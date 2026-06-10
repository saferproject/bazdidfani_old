import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import SaferTextDialogProps from "../../components/shared/dialogs/TextDialog/interfaces/text-dialog-props.interface";

const initialState: SaferTextDialogProps | null = null;

const TextDialogSlice = createSlice({
	name: "TextDialog",
	initialState,
	reducers: {
		setTextDialogData: (_state, { payload }: PayloadAction<SaferTextDialogProps>) => {
			return payload;
		},
		openTextDialog: (state) => {
			state.isOpen = true;
		},
		closeTextDialog: (state) => {
			state.isOpen = false;
		},
	},
});

export const { setTextDialogData, openTextDialog, closeTextDialog } = TextDialogSlice.actions;

export default TextDialogSlice.reducer;
