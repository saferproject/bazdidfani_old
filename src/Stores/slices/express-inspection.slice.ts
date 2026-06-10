import { createSlice } from "@reduxjs/toolkit";

const ExpressInspectionSlice = createSlice({
	name: "isExpressInspectionActive",
	initialState: false,
	reducers: {
		activateExpressInspection: () => true,
		deactivateExpressInspection: () => false,
	},
});

export const { activateExpressInspection, deactivateExpressInspection } = ExpressInspectionSlice.actions;

export default ExpressInspectionSlice.reducer;
