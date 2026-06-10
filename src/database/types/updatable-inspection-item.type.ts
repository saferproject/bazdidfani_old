import InspectionItem from "../../components/InspectionList/interfaces/inspection-item.interface";

type UpdatableInspectionItem = Omit<
  InspectionItem,
  | "id"
  | "code"
  | "checkListId"
  | "bazdidfani_id"
  | "uuid"
  | "technical_inspection_id"
  | "self_statement"
  | "bazdidfani_status"
  | "image_data"
>;

export default UpdatableInspectionItem;
