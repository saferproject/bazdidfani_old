import type InspectionTypes from "../../../Stores/types/inspection-types.type";
import type InspectionItem from "./inspection-item.interface";

export interface InspectionSubmissionCheckpoint {
  mode: InspectionTypes;
  checklistAccepted: boolean;
  uploadedImageKeys: string[];
  failedImageKeys: string[];
  finalized: boolean;
}

export interface InspectionChecklistPayload {
  inspectionItems: InspectionItem[];
  inspectionId: number;
  isSelfStatement: 0 | 1;
}

export interface PreparedInspectionImage {
  /** Local fingerprint only; never added to the multipart request. */
  key: string;
  data: FormData;
}

export interface InspectionSubmissionProgress {
  visible: boolean;
  value: number;
  maxSteps: number;
  title: string;
}
