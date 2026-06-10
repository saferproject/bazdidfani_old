import DialogWidths from "../../types/dialog-widths";

export default interface SaferTextDialogProps {
	isOpen: boolean;
	title: string;
	description: string;
	children?: React.ReactElement;
	maxWidth?: DialogWidths | false;
	fullWidth?: boolean;
	fullScreen?: boolean;
	contentDividers?: boolean;
	buttons?: React.ReactElement;
	persist?: boolean;
}
