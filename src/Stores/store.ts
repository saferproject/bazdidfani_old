import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import { ApiWithAuth, ApiWithoutAuth, MapApi } from "./apis/api";
import InspectionItemsSlice from "./slices/inspection-items.slice";
import InspectionTypeSlice from "./slices/inspection-type.slice";
import CurrentInspectionItemSlice from "./slices/current-inspection-item.slice";
import TextDialogSlice from "./slices/text-dialog.slice";
import ChangePasswordDialogSlice from "./slices/change-passwrod-dialog.slice";
import ExpressInspectionSlice from "./slices/express-inspection.slice";
import InspectionDataSlice from "./slices/inspection-data.slice";
import SelfStatementDataSlice from "./slices/self-statement-data.slice";
import TechnicalInspectionPrintDataSlice from './slices/technical-inspection-print-data.slice';

export const store = configureStore({
	reducer: {
		inspectionItems: InspectionItemsSlice,
		inspectionType: InspectionTypeSlice,
		currentInspectionItem: CurrentInspectionItemSlice,
		textDialog: TextDialogSlice,
		changePasswordDialog: ChangePasswordDialogSlice,
		expressInspection: ExpressInspectionSlice,
		inspectionData: InspectionDataSlice,
		selfStatementData: SelfStatementDataSlice,
		user: userReducer,
		technicalInspectionPrintData: TechnicalInspectionPrintDataSlice,
		[ApiWithAuth.reducerPath]: ApiWithAuth.reducer,
		[ApiWithoutAuth.reducerPath]: ApiWithoutAuth.reducer,
		[MapApi.reducerPath]: MapApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(ApiWithAuth.middleware).concat(ApiWithoutAuth.middleware).concat(MapApi.middleware),
});

// نوع‌های کمکی برای TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


