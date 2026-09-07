import type InspectionTypes from "../../../Stores/types/inspection-types.type";
import type InspectionSchema from "../../../database/schemas/inspection-item.schema";
import { withCriticalActivity } from "../../../utilities/critical-activity";
import type InspectionItem from "../interfaces/inspection-item.interface";
import type {
  InspectionChecklistPayload,
  InspectionSubmissionCheckpoint,
  InspectionSubmissionProgress,
  PreparedInspectionImage,
} from "../interfaces/inspection-submission.interface";
import validateInspectionItems from "./validate-inspection-items";

type ChecklistTarget = "driver" | "technical" | "direct";

export const checklistTarget = (mode: InspectionTypes): ChecklistTarget =>
  mode === "SELF_STATEMENT" ? "driver" : mode === "DIRECT_TECHNICAL_VISIT" ? "direct" : "technical";

export const createChecklistPayload = (
  items: InspectionItem[],
  inspectionId: number,
  mode: InspectionTypes,
): InspectionChecklistPayload => ({
  inspectionItems: items.map((item) => ({
    ...item,
    images: [],
    details: item.details.map((detail) => ({ ...detail, images: [] })),
  })),
  inspectionId,
  isSelfStatement: mode === "SELF_STATEMENT" ? 1 : 0,
});

export interface InspectionSubmissionDependencies {
  read: (inspectionId: number) => Promise<InspectionSchema | null>;
  saveCheckpoint: (inspectionId: number, checkpoint: InspectionSubmissionCheckpoint) => Promise<void>;
  remove: (inspectionId: number) => Promise<void>;
  submitChecklist: Record<ChecklistTarget, (payload: InspectionChecklistPayload) => Promise<unknown>>;
  prepareImages: (items: InspectionItem[], inspectionId: number, isSelfStatement: 0 | 1) => Promise<PreparedInspectionImage[]>;
  upload: (data: FormData) => Promise<unknown>;
  finalize: (data: { inspectionId: number; isSelfStatement: 0 | 1 }) => Promise<unknown>;
  onProgress?: (progress: InspectionSubmissionProgress) => void;
  onImageFailure?: (error: unknown) => void;
  /** Stops subsequent requests if the owning screen/session has changed. */
  isActive?: () => boolean;
}

export interface InspectionSubmissionResult {
  finalized: boolean;
  failedCount: number;
}

interface SubmissionInput {
  inspectionId: number;
  mode: InspectionTypes;
  action: "confirm" | "reject";
}

/** Owns the complete checklist -> photos -> finalization sequence, including retries. */
export class InspectionSubmissionCoordinator {
  private pending: Promise<InspectionSubmissionResult> | null = null;
  private completed = new Map<string, InspectionSubmissionResult>();
  // Retain positive acknowledgements even if the following local checkpoint write fails.
  private checkpoints = new Map<string, InspectionSubmissionCheckpoint>();

  get isRunning(): boolean {
    return this.pending !== null;
  }

  run(input: SubmissionInput, dependencies: InspectionSubmissionDependencies): Promise<InspectionSubmissionResult> {
    if (this.pending) return this.pending;
    const key = `${input.mode}:${input.inspectionId}`;
    const completed = this.completed.get(key);
    if (completed) return Promise.resolve(completed);

    this.pending = withCriticalActivity(() => this.execute(input, dependencies, key))
      .finally(() => { this.pending = null; });
    return this.pending;
  }

  private async execute(
    { inspectionId, mode, action }: SubmissionInput,
    dependencies: InspectionSubmissionDependencies,
    key: string,
  ): Promise<InspectionSubmissionResult> {
    const assertActive = () => {
      if (dependencies.isActive && !dependencies.isActive())
        throw new Error("ارسال متوقف شد؛ اطلاعات بازدید برای ادامه محفوظ است.");
    };
    assertActive();
    if (!Number.isFinite(inspectionId) || inspectionId <= 0 || !mode)
      throw new Error("شناسه بازدید نامعتبر است.");

    const draft = await dependencies.read(inspectionId);
    if (!draft) throw new Error("اطلاعات ذخیره شده بازدید پیدا نشد.");
    const items = structuredClone(draft.items);
    const saved = this.checkpoints.get(key) ?? draft.submission;
    const checkpoint: InspectionSubmissionCheckpoint = saved?.mode === mode
      ? structuredClone(saved)
      : { mode, checklistAccepted: mode === "RETAKE_IMAGES", uploadedImageKeys: [], failedImageKeys: [], finalized: false };
    const save = async () => {
      this.checkpoints.set(key, structuredClone(checkpoint));
      await dependencies.saveCheckpoint(inspectionId, checkpoint);
    };
    const progress = (title: string, value: number, maxSteps: number) =>
      dependencies.onProgress?.({ visible: true, title, value, maxSteps });
    const finish = async (): Promise<InspectionSubmissionResult> => {
      const result = { finalized: true, failedCount: checkpoint.failedImageKeys.length };
      // Review mode may finalize with failed photos. Preserve that evidence locally.
      if (!result.failedCount) await dependencies.remove(inspectionId);
      this.completed.set(key, result);
      return result;
    };

    if (checkpoint.finalized) return finish();

    if (!checkpoint.checklistAccepted) {
      if (action === "confirm" && !validateInspectionItems(items))
        throw new Error("لطفا سلامت تمامی موارد را تایید نمایید و عکس های لازم را ذخیره کنید.");
      assertActive();
      progress("ارسال اطلاعات چک لیست ...", 0, 2);
      await dependencies.submitChecklist[checklistTarget(mode)](createChecklistPayload(items, inspectionId, mode));
      checkpoint.checklistAccepted = true;
      await save();
    }

    assertActive();
    progress("آماده سازی عکس ها برای ارسال ...", 1, 2);
    const isSelfStatement = mode === "SELF_STATEMENT" ? 1 : 0;
    const images = await dependencies.prepareImages(items, inspectionId, isSelfStatement);
    const uploaded = new Set(checkpoint.uploadedImageKeys);
    let sentCount = images.filter((image) => uploaded.has(image.key)).length;
    checkpoint.failedImageKeys = [];
    progress(`عکس های ارسال شده: ${sentCount} از ${images.length}`, sentCount + 1, images.length + 2);

    for (const image of images) {
      if (uploaded.has(image.key)) continue;
      assertActive();
      try {
        await dependencies.upload(image.data);
      } catch (error) {
        checkpoint.failedImageKeys.push(image.key);
        await save();
        dependencies.onImageFailure?.(error);
        continue;
      }
      uploaded.add(image.key);
      checkpoint.uploadedImageKeys = [...uploaded];
      await save();
      sentCount += 1;
      progress(`عکس های ارسال شده: ${sentCount} از ${images.length}`, sentCount + 1, images.length + 2);
    }

    await save();
    if (checkpoint.failedImageKeys.length && mode !== "REVIEW_SELF_STATEMENT")
      return { finalized: false, failedCount: checkpoint.failedImageKeys.length };

    assertActive();
    progress("بررسی نهایی عکس ها ...", images.length + 1, images.length + 2);
    await dependencies.finalize({ inspectionId, isSelfStatement });
    checkpoint.finalized = true;
    await save();
    return finish();
  }
}
