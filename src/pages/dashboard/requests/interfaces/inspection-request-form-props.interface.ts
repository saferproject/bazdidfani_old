import InspectionRequest from "./inspection-request.interface";

export default interface InspectionRequestFormProps {
	isOpen: boolean;
	data?: InspectionRequest;
	onClose: () => void;
}
