import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import InspectionData from "../../pages/dashboard/do-technical-visit/interfaces/inspection-data.interface";
import {
	readPersistedState,
	removePersistedState,
	writePersistedState,
} from "../utilities/persisted-state";

const INSPECTION_DATA_STORAGE_KEY = "inspection-data";
const initialState: InspectionData | null = readPersistedState<InspectionData | null>(
	INSPECTION_DATA_STORAGE_KEY,
	null,
);

const InspectionDataSlice = createSlice({
	name: "InspectionData",
	initialState,
	reducers: {
		setInspectionData: (_state, actions: PayloadAction<InspectionData>) => {
			writePersistedState(INSPECTION_DATA_STORAGE_KEY, actions.payload);
			return actions.payload;
		},
		clearInspectionData: () => {
			removePersistedState(INSPECTION_DATA_STORAGE_KEY);
			return null;
		},
	},
});

export const { setInspectionData, clearInspectionData } = InspectionDataSlice.actions;

export default InspectionDataSlice.reducer;
