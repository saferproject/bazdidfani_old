import { ApiWithAuth } from "../../../../Stores/apis/api";

export const { useAdminGetLogsQuery, useAdminSaveLogMutation } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		adminGetLogs: builder.query<{ success: boolean; message: string; data: string }, void>({
			query: () => ({
				url: "admin/frontend/log/index",
				method: "GET",
			}),
			providesTags: ["Logs"],
		}),

		adminSaveLog: builder.mutation<
			unknown,
			{ log_message: string; type: "debug" | "info" | "notice" | "warning" | "error" | "critical" | "alert" | "emergency" }
		>({
			query: (data) => ({
				url: "admin/frontend/log/store",
				method: "POST",
				data,
			}),
			invalidatesTags: ["Logs"],
		}),
	}),
});
