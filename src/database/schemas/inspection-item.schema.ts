import InspectionItem from "../../components/InspectionList/interfaces/inspection-item.interface";

export default interface InspectionSchema {
  inspectionId: number;
  inspectorId: number;
  trailerCode: number;
  isSelfStatement: boolean;
  driverNationalCode: string | null;
  dateStarted: Date;
  items: InspectionItem[];
}
