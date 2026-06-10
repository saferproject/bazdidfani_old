export default interface ReferInspectionDialogProps {
	isOpen: boolean;
	data: unknown;
	onClose: () => void;
	onSuccess: () => void;
}
