import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import ChangePasswordDialogProps from "../../components/shared/dialogs/ChangePasswordDialog/interfaces/change-password-dialog-props";

const initialState: ChangePasswordDialogProps = { isOpen: false };

const ChangePasswordDialogSlice = createSlice({
	name: "ChangePasswordDialog",
	initialState,
	reducers: {
		openChangePasswordDialog: (state) => {
			state.isOpen = true;
		},
		closeChangePasswordDialog: (state) => {
			state.isOpen = false;
		},
	},
});

export const { openChangePasswordDialog, closeChangePasswordDialog } = ChangePasswordDialogSlice.actions;

export default ChangePasswordDialogSlice.reducer;
