import DialogWidths from "../types/dialog-widths";
import ImageOrientations from "../types/image-orientations";

export default interface SaferImageMagnifierDialogProps {
	isOpen: boolean;
	onClose: () => void;
	image: string;
	orientation: ImageOrientations;
	maxWidth?: DialogWidths | false;
	fullWidth?: boolean;
	fullScreen?: boolean;
	title?: string;
	description?: string;
}
