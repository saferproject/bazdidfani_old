import { useAppDispatch } from "../../../../Stores/hooks";
import { closeTextDialog } from "../../../../Stores/slices/text-dialog.slice";
import SaferTextDialogProps from "./interfaces/text-dialog-props.interface";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { CloseCircle, InfoCircle } from "iconsax-reactjs";
import { FC } from "react";













/**
 * @param {SaferTextDialogProps} props - The properties for the SaferDialog component.
 * @see {@linkcode SaferTextDialogProps} for the properties that can be passed to this component.
 * @description SaferDialog is a customizable dialog component that provides a consistent layout for displaying content.
 * @see {@linkplain https://v5.mui.com/material-ui/react-dialog/|MUI Dialog} for more information on the MUI Dialog component.
 */
const SaferTextDialog: FC<SaferTextDialogProps> = ({
	children,
	isOpen,
	title,
	description,
	buttons = <></>,
	maxWidth = "md",
	fullWidth = false,
	fullScreen = false,
	contentDividers = false,
	persist = false,
}) => {
	const dispatch = useAppDispatch();

	const handleCloseDialog = () => {
		dispatch(closeTextDialog());
	};

	return (
    <Dialog
      open={isOpen}
      onClose={!persist ? handleCloseDialog : undefined}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
    >
      <DialogTitle className="flex items-center justify-between">
        <h2 className="shrink text-xl font-semibold font-Yekan-Bakh">
          {title}
        </h2>
        <IconButton onClick={handleCloseDialog}>
          <CloseCircle size="24" className="text-red-500" />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers={contentDividers}
        className="flex flex-col gap-4 mb-2"
      >
        {description && (
          <p className="text-gray-600 font-Yekan-Bakh text-sm">{description}</p>
        )}
        {children}
      </DialogContent>
      <DialogActions className="flex items-center gap-2 justify-end">
        {buttons}
      </DialogActions>
    </Dialog>
  );
};

export default SaferTextDialog;
