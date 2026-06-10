import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import InspectionItem from "../../components/InspectionList/interfaces/inspection-item.interface";

const initialState: InspectionItem | null = null;

const CurrentInspectionItemSlice = createSlice({
	name: "CurrentInspectionItem",
	initialState,
	reducers: {
		setCurrentInspectionItem: (_state, { payload }: PayloadAction<InspectionItem>) => {
			return payload;
		},
		addImageToCurrentItem: (state, { payload }: PayloadAction<string>) => {
			state.images.push(payload);
		},
		replaceImageOfCurrentItem: (state, { payload: { index, image } }: PayloadAction<{ image: string; index: number }>) => {
			state.images.splice(index, 1, image);
		},
		removeImageOfCurrentItem: (state, { payload: index }: PayloadAction<number>) => {
			state.images.splice(index, 1);
		},
		checkCurrentItem: (state) => {
			state.checked = true;
		},
		unCheckCurrentItem: (state) => {
			state.checked = false;
		},
		setCurrentItemDescription: (
			state,
			{
				payload: { property, description },
			}: PayloadAction<{ property: Extract<keyof InspectionItem, "driverDescription" | "inspectorDescription">; description: string }>
		) => {
			state[property] = description;
		},
	},
});

export const {
	setCurrentInspectionItem,
	addImageToCurrentItem,
	replaceImageOfCurrentItem,
	removeImageOfCurrentItem,
	checkCurrentItem,
	unCheckCurrentItem,
	setCurrentItemDescription,
} = CurrentInspectionItemSlice.actions;

export default CurrentInspectionItemSlice.reducer;
