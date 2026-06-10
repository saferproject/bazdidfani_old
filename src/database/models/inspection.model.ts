import InspectionItem from "../../components/InspectionList/interfaces/inspection-item.interface";
import dexieDB from "../IndexDB.database";
import InspectionSchema from "../schemas/inspection-item.schema";
import { EntityTable } from "dexie";

export class InspectionModel {
  private static store: EntityTable<InspectionSchema> = dexieDB.Inspection;

  private static findItemByCode(items: InspectionItem[], code: number) {
    for (const item of items) {
      if (item.code === code) return item;

      const matchedDetail = item.details?.find((detail) => detail.code === code);
      if (matchedDetail) return matchedDetail;
    }

    return null;
  }

  private static normalizeItems(items: unknown): InspectionItem[] {
    if (!Array.isArray(items)) return [];

    return items.map((item) => ({
      ...item,
      details: Array.isArray(item?.details) ? item.details : [],
    }));
  }

  private static syncParentFlags(item: InspectionItem) {
    if (!item.details?.length) return item;

    return {
      ...item,
      checked: item.details.every((detail) => detail.checked),
      reviewed: item.details.every((detail) => detail.reviewed),
    };
  }

  static getInspection = async (inspectionId: number) => {
    try {
      if (this.store) {
        const collection = this.store
          .where("inspectionId")
          .equals(inspectionId);

        const inspection = (await collection.first()) ?? null;

        if (inspection) inspection.items = this.normalizeItems(inspection.items);

        return inspection;
      } else throw new Error(`Store Inspections does not exist in IndexDB`);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  static getAllItems = async (inspectionId: number) => {
    try {
      const inspection = await this.getInspection(inspectionId);

      return inspection?.items ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  static getItem = async (code: number, inspectionId: number) => {
    try {
      const inspection = await this.getInspection(inspectionId);

      if (!inspection) return null;

      return this.findItemByCode(inspection.items, code);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  static insertInspection = async (data: InspectionSchema) => {
    try {
      if (this.store) await this.store.put(data);
      else throw new Error(`Store Inspections does not exist in IndexDB`);
    } catch (error) {
      console.error(error);
    }
  };

  static updateItem = async (
    code: number,
    inspectionId: number,
    data: InspectionItem,
  ) => {
    try {
      if (this.store) {
        const inspection = await this.getInspection(inspectionId);

        if (inspection) {
          const newInspection = structuredClone(inspection);
          const topLevelItemIndex = newInspection.items.findIndex(
            (item) => item.code === code,
          );

          if (topLevelItemIndex >= 0)
            newInspection.items.splice(topLevelItemIndex, 1, data);
          else {
            const parentItemIndex = newInspection.items.findIndex((item) =>
              item.details.some((detail) => detail.code === code),
            );

            if (parentItemIndex < 0)
              throw new Error(`No inspection item with id ${code} exist for update`);

            const parentItem = structuredClone(newInspection.items[parentItemIndex]);
            const detailIndex = parentItem.details.findIndex(
              (detail) => detail.code === code,
            );

            parentItem.details.splice(detailIndex, 1, data);
            newInspection.items.splice(
              parentItemIndex,
              1,
              this.syncParentFlags(parentItem),
            );
          }

          await this.store.put(newInspection);
          return newInspection;
        } else
          throw new Error(
            `No inspection item with id ${code} exist for update`,
          );
      } else throw new Error(`Store Inspections does not exist in IndexDB`);
    } catch (error) {
      console.error(error);
    }
  };

  static removeInspection = async (inspectionId: number) => {
    try {
      if (this.store) {
        const collection = this.store
          .where("inspectionId")
          .equals(inspectionId);

        const inspection = await collection.first();

        // @ts-ignore
        if (inspection) this.store.delete(inspection.inspectionId);
        else
          throw new Error(
            `No inspection item with id ${inspectionId} exist for remove`,
          );
      } else throw new Error(`Store Inspections does not exist in IndexDB`);
    } catch (error) {
      console.error(error);
    }
  };

  static removeAllInspections = async () => {
    try {
      if (this.store) return await this.store.clear();
      else throw new Error(`Store Inspections does not exist in IndexDB`);
    } catch (error) {
      console.error(error);
    }
  };

  static getFirstUnreviewedItem = async (inspectionId: number) => {
    try {
      if (this.store) {
        const inspection = await this.getInspection(inspectionId);

        if (!inspection) return null;

        const firstUnreviewedItem = inspection.items.find((item) =>
          item.details.length
            ? item.details.some((detail) => !detail.reviewed)
            : !item.reviewed,
        );

        if (firstUnreviewedItem?.details.length) {
          const nextUncheckedDetail = firstUnreviewedItem.details.find(
            (detail) => !detail.reviewed,
          );

          if (nextUncheckedDetail) return nextUncheckedDetail;
        } else if (firstUnreviewedItem) return firstUnreviewedItem;
        else return null;
      } else throw new Error(`Store Inspections does not exist in IndexDB`);
    } catch (error) {
      console.error(error);
      return null;
    }
  };
}
