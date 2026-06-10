import InspectionItem from "../../interfaces/inspection-item.interface";
import InspectionTypes from "../../../../Stores/types/inspection-types.type";

export default interface InspectionItemDialogProps {
	isOpen: boolean;
	currentInspectionItem: InspectionItem | null;
	inspectionId: number;
	inspectionType: InspectionTypes | null;
	checkedCount: number;
	totalCount: number;
	handleCloseDialog: () => void;
	onItemUpdated: (code?: number) => Promise<void>;
	onOpenItem: (item: InspectionItem) => void;
	onItemsFinished: () => void;
}
