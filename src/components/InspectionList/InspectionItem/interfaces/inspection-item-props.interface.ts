import InspectionItem from "../../interfaces/inspection-item.interface";

export default interface InspectionItemProps {
	item: InspectionItem;
	onToggleItem: (item: InspectionItem) => void;
	onEditItem: (item: InspectionItem) => void;
}
