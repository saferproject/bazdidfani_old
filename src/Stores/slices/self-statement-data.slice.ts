import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import SelfStatementData from "../../pages/dashboard/do-technical-visit/interfaces/self-statement-data.interface";

const initialState: SelfStatementData | null = null;

const SelfStatementDataSlice = createSlice({
	name: "SelfStatementData",
	initialState,
	reducers: {
		setSelfStatementData: (_state, actions: PayloadAction<SelfStatementData>) => actions.payload,
		clearSelfStatementData: () => null,
	},
});

export const { setSelfStatementData, clearSelfStatementData } = SelfStatementDataSlice.actions;

export default SelfStatementDataSlice.reducer;
