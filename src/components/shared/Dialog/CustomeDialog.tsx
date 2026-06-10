import { Breakpoint } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FC, ReactNode } from "react";

export interface CustomDialogProps {
	show?: boolean;
	fullWidth?: boolean;
	title?: string;
	children: ReactNode;
	dialogActions?: ReactNode;
	onClose: () => void;
	maxWidth?: false | Breakpoint;
	hasOnClose: boolean;
	fullScreen?: boolean;
	contentClassName?: string;
	paperProps?: Record<string, any>;
	dialogClassName?: string;
	showTitle?: boolean;
}

export const EmptyCustomDialoProps: CustomDialogProps = {
	show: false,
	children: <></>,
	hasOnClose: true,
	onClose: () => {},
};

const CustomDialog: FC<CustomDialogProps> = (props) => {
	const {
		children,
		onClose,
		show,
		fullWidth,
		maxWidth = "lg",
		title,
		hasOnClose,
		dialogActions,
		fullScreen,
		paperProps,
		contentClassName,
		dialogClassName,
		showTitle,
	} = props;

	return (
		<Dialog
			open={show}
			keepMounted
			onClose={hasOnClose ? onClose : () => {}}
			aria-describedby="alert-dialog-slide-description"
			dir="rtl"
			fullWidth={fullWidth}
			className={dialogClassName}
			maxWidth={maxWidth}
			sx={{
				"& .MuiPaper-root": {
					borderRadius: 8,
				},
			}}
			fullScreen={fullScreen}
			PaperProps={paperProps}
		>
			{showTitle && <DialogTitle>{title}</DialogTitle>}
			<DialogContent className={contentClassName}>{children}</DialogContent>
			{dialogActions && <DialogActions className="flex justify-around">{dialogActions}</DialogActions>}
		</Dialog>
	);
};

export default CustomDialog;
