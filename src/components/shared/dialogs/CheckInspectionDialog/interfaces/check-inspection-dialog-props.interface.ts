import InspectionItem from "../../../../InspectionList/interfaces/inspection-item.interface";

export default interface CheckInspectionDialogProps {
	isOpen: boolean;
	data: Array<InspectionItem>;
	isAdminPage?: boolean;
	onClose: () => void;
}