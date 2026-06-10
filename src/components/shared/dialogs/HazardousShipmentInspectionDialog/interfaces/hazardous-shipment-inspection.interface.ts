import InspectionItem from "../../../../InspectionList/interfaces/inspection-item.interface";

export default interface HazardousShipmentInspectionDialogProps {
	isOpen: boolean;
	inspectionItems: InspectionItem[];
	onClose: () => void;
}