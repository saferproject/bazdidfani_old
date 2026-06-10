import { ApiWithAuth } from "../../Stores/apis/api";

export const { useStartInspectionMutation, useStartSelfStatementMutation, useGetSelfStatementChecklistQuery } = ApiWithAuth.injectEndpoints(
	{
		endpoints: (builder) => ({
			startInspection: builder.mutation<any, Record<string, any>>({
				query: (data) => ({
					url: "start-technical-inspection",
					method: "POST",
					data,
				}),
			}),

			startSelfStatement: builder.mutation<any, Record<string, any>>({
				query: (data) => ({
					url: "driver/start-self-statement",
					method: "POST",
					data,
				}),
			}),

			getSelfStatementChecklist: builder.query<any, Record<string, string | number>>({
				query: (params) => ({
					url: "technical-manager/self-statement/check-list",
					method: "GET",
					params,
				}),
			}),
		}),
	}
);
