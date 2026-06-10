import { ApiWithAuth } from "../../../../Stores/apis/api";
import Setting from "../interfaces/setting.interface";

export const { useGetAdminSettingsQuery, useChangeAdminSettingMutation } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		getAdminSettings: builder.query<Setting[], void>({
			query: () => ({
				url: "admin/system-settings/index",
				method: "GET",
			}),
			providesTags: ["AdminSettings"],
		}),

		changeAdminSetting: builder.mutation<unknown, { id: number; value: string | number; status: number }>({
			query: (data) => ({
				url: "admin/system-settings/update",
				method: "PUT",
				data,
			}),
			invalidatesTags: ["AdminSettings"],
		}),
	}),
});
