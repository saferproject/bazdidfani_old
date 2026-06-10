import DialogWidths from "../../types/dialog-widths";

export default interface SaferCameraDialogProps {
	isOpen: boolean;
	onClose: (data?: unknown) => void;
	onCapture: (image: string, data?: unknown) => void;
	title?: string;
	description?: string;
	required?: boolean;
	maxWidth?: DialogWidths | false;
	fullWidth?: boolean;
	fullScreen?: boolean;
	data?: unknown;
}
