import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import InspectionTypes from "../types/inspection-types.type";
import {
	readPersistedState,
	removePersistedState,
	writePersistedState,
} from "../utilities/persisted-state";

const INSPECTION_TYPE_STORAGE_KEY = "inspection-type";
const initialState: InspectionTypes | null = readPersistedState<InspectionTypes | null>(
	INSPECTION_TYPE_STORAGE_KEY,
	null,
);

const InspectionTypeSlice = createSlice({
	name: "InspectionType",
	initialState: initialState,
	reducers: {
		setInspectionType: (_state, { payload: type }: PayloadAction<InspectionTypes>) => {
			writePersistedState(INSPECTION_TYPE_STORAGE_KEY, type);
			return type;
		},
		clearInspectionType: () => {
			removePersistedState(INSPECTION_TYPE_STORAGE_KEY);
			return null;
		},
	},
});

export const { setInspectionType, clearInspectionType } = InspectionTypeSlice.actions;

export default InspectionTypeSlice.reducer;
