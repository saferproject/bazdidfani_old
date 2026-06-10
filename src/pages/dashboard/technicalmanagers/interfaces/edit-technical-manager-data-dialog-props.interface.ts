export default interface EditTechnicalManagerDataDialogProps {
	isOpen: boolean;
	data: unknown;
	onSuccess: () => void;
	onClose: () => void;
}