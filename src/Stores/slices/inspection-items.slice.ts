import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import InspectionItem from "../../components/InspectionList/interfaces/inspection-item.interface";

const initialState: InspectionItem[] = [];

const InspectionItemsSlice = createSlice({
	name: "InspectionItems",
	initialState,
	reducers: {
		setInspectionItems: (_state, { payload }: PayloadAction<Array<InspectionItem>>) => {
			return payload;
		},
		setInspectionItemDescription: (
			state,
			{
				payload: { code, property, description },
			}: PayloadAction<{
				code: number;
				property: Extract<keyof InspectionItem, "driverDescription" | "inspectorDescription">;
				description: string;
			}>
		) => {
			return state.map((item) => {
				if (item.details.length) {
					return {
						...item,
						details: item.details.map((detail) => (detail.code === code ? { ...detail, [property]: description } : detail)),
					};
				} else if (item.code === code) {
					const newItem = { ...item };

					newItem[property] = description;

					return newItem;
				} else return { ...item, details: item.details.map((detail) => ({ ...detail })) };
			});
		},
		addInspectionItem: (state, { payload: { item, index } }: PayloadAction<{ item: InspectionItem; index?: number }>) => {
			if (index) state.splice(index, 0, item);
			else state.push(item);
		},
		editInspectionItem: (state, { payload }: PayloadAction<InspectionItem>) => {
			state.splice(
				state.findIndex((item) => item.code === payload.code),
				1,
				{ ...payload }
			);
		},
		removeInspectionItem: (state, action: PayloadAction<number>) => {
			state.splice(
				state.findIndex((item) => item.code === action.payload),
				1
			);
		},
		setChildInspectionItems: (
			state,
			{ payload: { parentCode, children } }: PayloadAction<{ children: Array<InspectionItem>; parentCode: number }>
		) => {
			state.splice(
				state.findIndex((item) => item.code === parentCode),
				1,
				{ ...state.find((item) => item.code === parentCode), details: children }
			);
		},
		addChildInspectionItem: (
			state,
			{ payload: { item, parentCode, index } }: PayloadAction<{ item: InspectionItem; parentCode: number; index?: number }>
		) => {
			if (index) {
				const newItem = { ...state.find((item) => item.code === parentCode) };

				newItem.details.splice(index, 0, item);

				state.splice(
					state.findIndex((item) => item.code === parentCode),
					1,
					newItem
				);
			} else {
				const newItem = state.find((item) => item.code === parentCode);

				newItem.details.push(item);

				state.splice(
					state.findIndex((item) => item.code === parentCode),
					1,
					newItem
				);
			}
		},
		editChildInspectionItem: (state, { payload: { item, parentCode } }: PayloadAction<{ item: InspectionItem; parentCode: number }>) => {
			const newItem = state.find((item) => item.code === parentCode);

			newItem.details.splice(
				newItem.details.findIndex((item) => item.code === item.code),
				1,
				item
			);

			state.splice(
				state.findIndex((item) => item.code === parentCode),
				1,
				newItem
			);
		},
		removeChildInspectionItem: (
			state,
			{ payload: { childCode, parentCode } }: PayloadAction<{ parentCode: number; childCode: number }>
		) => {
			const newItem = state.find((item) => item.code === parentCode);

			newItem.details.splice(
				newItem.details.findIndex((item) => item.code === childCode),
				1
			);

			state.splice(
				state.findIndex((item) => item.code === parentCode),
				1,
				newItem
			);
		},
		addInspectionImage: (state, { payload: { code, image } }: PayloadAction<{ code: number; image: string }>) => {
			return state.map((item) => {
				if (item.details.length) {
					return {
						...item,
						details: item.details.map((detail) => (detail.code === code ? { ...detail, images: [...detail.images, image] } : detail)),
					};
				} else if (item.code === code) return { ...item, images: [...item.images, image] };
				else return { ...item, details: item.details.map((detail) => ({ ...detail })) };
			});
		},
		replaceInspectionImage: (state, { payload: { code, image, index } }: PayloadAction<{ code: number; image: string; index: number }>) => {
			return state.map((item) => {
				if (item.details.length) {
					return {
						...item,
						details: item.details.map((detail) =>
							detail.code === code && index >= 0 && index < (detail.images?.length || 0)
								? {
										...detail,
										images: [...detail.images.slice(0, index), image, ...detail.images.slice(index + 1)],
								  }
								: detail
						),
					};
				} else if (item.code === code) return { ...item, images: [...item.images.slice(0, index), image, ...item.images.slice(index + 1)] };
				else return { ...item, details: item.details.map((detail) => ({ ...detail })) };
			});
		},
		removeInspectionImage: (state, { payload: { code, index } }: PayloadAction<{ code: number; index: number }>) => {
			return state.map((item) => {
				if (item.details.length) {
					return {
						...item,
						details: item.details.map((detail) =>
							detail.code === code && index >= 0 && index < (detail.images?.length || 0)
								? {
										...detail,
										images: [...detail.images.slice(0, index), ...detail.images.slice(index + 1)],
								  }
								: detail
						),
					};
				} else if (item.code === code) return { ...item, images: [...item.images.slice(0, index), ...item.images.slice(index + 1)] };
				else return { ...item, details: item.details.map((detail) => ({ ...detail })) };
			});
		},
		checkInspectionItem: (state, { payload: code }: PayloadAction<number>) => {
			return state.map((item) => {
				if (item.details.length) {
					return {
						...item,
						details: item.details.map((detail) => (detail.code === code ? { ...detail, checked: true, reviewed: true } : detail)),
						checked: item.details.length && item.details.every((detail) => detail.checked) ? true : false,
						reviewed: item.details.length && item.details.every((detail) => detail.reviewed) ? true : false,
					};
				} else if (item.code === code) return { ...item, checked: true, reviewed: true };
				else return { ...item, details: item.details.map((detail) => ({ ...detail })) };
			});
		},
		unCheckInspectionItem: (state, { payload: code }: PayloadAction<number>) => {
			return state.map((item) => {
				if (item.details.length) {
					return {
						...item,
						details: item.details.map((detail) => (detail.code === code ? { ...detail, checked: false, reviewed: true } : detail)),
						checked: false,
						reviewed: item.details.length && item.details.every((detail) => detail.reviewed) ? true : false,
					};
				} else if (item.code === code) return { ...item, checked: false, reviewed: true };
				else return { ...item, details: item.details.map((detail) => ({ ...detail })) };
			});
		},
		reviewInspectionItem: (state, { payload: code }: PayloadAction<number>) => {
			return state.map((i) => {
				if (i.details.length) {
					return {
						...i,
						details: i.details.map((detail) => (detail.code === code ? { ...detail, reviewed: true } : detail)),
						reviewed: i.details.length && i.details.every((detail) => detail.reviewed) ? true : false,
					};
				} else if (i.code === code) return { ...i, reviewed: true };
				else return { ...i, details: i.details.map((detail) => ({ ...detail })) };
			});
		},
	},
});

export const {
	setInspectionItems,
	addInspectionItem,
	editInspectionItem,
	removeInspectionItem,
	setChildInspectionItems,
	addChildInspectionItem,
	editChildInspectionItem,
	removeChildInspectionItem,
	addInspectionImage,
	replaceInspectionImage,
	removeInspectionImage,
	checkInspectionItem,
	unCheckInspectionItem,
	setInspectionItemDescription,
	reviewInspectionItem,
} = InspectionItemsSlice.actions;

export default InspectionItemsSlice.reducer;
