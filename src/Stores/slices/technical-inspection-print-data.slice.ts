import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import InspectionRequest from "../../pages/dashboard/requests/interfaces/inspection-request.interface";

const initialState: InspectionRequest | null = null;

const TechnicalInspectionPrintDataSlice = createSlice({
	name: "CurrentInspectionItem",
	initialState,
	reducers: {
		setTechnicalInspectionPrintData: (_state, { payload: inspectionRequest }: PayloadAction<InspectionRequest>) => inspectionRequest,
		clearTechnicalInspectionPrintData: () => null,
	},
});

export const { setTechnicalInspectionPrintData } = TechnicalInspectionPrintDataSlice.actions;

export default TechnicalInspectionPrintDataSlice.reducer;
