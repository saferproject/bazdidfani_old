import type InspectionItem from "../../components/InspectionList/interfaces/inspection-item.interface";
import type { InspectionSubmissionCheckpoint } from "../../components/InspectionList/interfaces/inspection-submission.interface";
import { withCriticalActivity } from "../../utilities/critical-activity";
import dexieDB from "../IndexDB.database";
import type InspectionSchema from "../schemas/inspection-item.schema";

type ItemUpdate = InspectionItem | ((item: InspectionItem) => void);

/** All read/modify/write operations share one IndexedDB transaction. */
export class InspectionModel {
  private static get store() {
    return dexieDB.Inspection;
  }

  private static normalizeItems(items: unknown): InspectionItem[] {
    if (!Array.isArray(items)) return [];
    return items.map((item) => ({
      ...item,
      details: this.normalizeItems(item?.details),
      images: Array.isArray(item?.images) ? item.images : [],
    }));
  }

  private static findItemByCode(items: InspectionItem[], code: number): InspectionItem | null {
    for (const item of items) {
      if (item.code === code) return item;
      const detail = this.findItemByCode(item.details, code);
      if (detail) return detail;
    }
    return null;
  }

  private static syncParentFlags(items: InspectionItem[]): void {
    for (const item of items) {
      if (!item.details.length) continue;
      this.syncParentFlags(item.details);
      item.checked = item.details.every((detail) => detail.checked);
      item.reviewed = item.details.every((detail) => detail.reviewed);
    }
  }

  static getInspection = async (inspectionId: number): Promise<InspectionSchema | null> => {
    const inspection = await this.store.get(inspectionId);
    return inspection ? { ...inspection, items: this.normalizeItems(inspection.items) } : null;
  };

  static getAllItems = async (inspectionId: number): Promise<InspectionItem[]> =>
    (await this.getInspection(inspectionId))?.items ?? [];

  static getItem = async (code: number, inspectionId: number): Promise<InspectionItem | null> =>
    this.findItemByCode(await this.getAllItems(inspectionId), code);

  static insertInspection = async (
    data: InspectionSchema,
    mergeItems?: (incoming: InspectionItem[], saved: InspectionItem[]) => InspectionItem[],
  ): Promise<void> =>
    withCriticalActivity(() => dexieDB.transaction("rw", this.store, async () => {
      const existing = await this.store.get(data.inspectionId);
      await this.store.put({
        ...existing,
        ...data,
        dateStarted: existing?.dateStarted ?? data.dateStarted,
        submission: data.submission ?? existing?.submission,
        items: mergeItems ? mergeItems(data.items, this.normalizeItems(existing?.items)) : data.items,
      });
    }));

  private static mutateInspection = async (
    inspectionId: number,
    update: (inspection: InspectionSchema) => void,
  ): Promise<InspectionSchema> =>
    withCriticalActivity(() => dexieDB.transaction("rw", this.store, async () => {
      const inspection = await this.getInspection(inspectionId);
      if (!inspection) throw new Error("اطلاعات ذخیره شده بازدید پیدا نشد.");
      update(inspection);
      await this.store.put(inspection);
      return inspection;
    }));

  /** Pass an updater when the edit depends on the latest stored value. */
  static updateItem = async (
    code: number,
    inspectionId: number,
    update: ItemUpdate,
  ): Promise<InspectionSchema> =>
    this.mutateInspection(inspectionId, (inspection) => {
      const item = this.findItemByCode(inspection.items, code);
      if (!item) throw new Error("آیتم مورد نظر در بازدید پیدا نشد.");
      if (typeof update === "function") update(item);
      else Object.assign(item, structuredClone(update));
      this.syncParentFlags(inspection.items);
    });

  static checkRemainingItems = async (inspectionId: number): Promise<InspectionSchema> =>
    this.mutateInspection(inspectionId, (inspection) => {
      const checkItems = (items: InspectionItem[]) => {
        for (const item of items) {
          if (item.details.length) checkItems(item.details);
          else if (!item.requiredImage && !item.checked) {
            item.checked = true;
            item.reviewed = true;
          }
        }
      };
      checkItems(inspection.items);
      this.syncParentFlags(inspection.items);
    });

  static saveSubmission = async (
    inspectionId: number,
    submission: InspectionSubmissionCheckpoint,
  ): Promise<void> => {
    await this.mutateInspection(inspectionId, (inspection) => {
      inspection.submission = structuredClone(submission);
    });
  };

  static removeInspection = async (inspectionId: number): Promise<void> => {
    await withCriticalActivity(() => this.store.delete(inspectionId));
  };

  static removeAllInspections = async (): Promise<void> => {
    await withCriticalActivity(() => this.store.clear());
  };

  static getFirstUnreviewedItem = async (inspectionId: number): Promise<InspectionItem | null> => {
    const findUnreviewed = (items: InspectionItem[]): InspectionItem | null => {
      for (const item of items) {
        if (item.details.length) {
          const detail = findUnreviewed(item.details);
          if (detail) return detail;
        } else if (!item.reviewed) return item;
      }
      return null;
    };
    return findUnreviewed(await this.getAllItems(inspectionId));
  };
}
