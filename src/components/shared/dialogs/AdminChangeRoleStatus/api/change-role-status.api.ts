import { ApiWithAuth } from "../../../../../Stores/apis/api";

export const { useGetRoleStatesQuery, useAdminChangeRoleStatusMutation } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		getRoleStates: builder.query<unknown, number>({
			query: (id) => ({
				url: `admin/roles/get-user-roles/${id}`,
				method: "GET",
			}),
			providesTags: ["RoleStates"], // کش کردن داده‌ها
		}),

		adminChangeRoleStatus: builder.mutation<unknown, { user_id: number; role_id: number; status: number }>({
			query: (data) => ({
				url: "admin/user/all-change-status-user",
				method: "PUT",
				data,
			}),
			invalidatesTags: ["RoleStates"], // کش کردن داده‌ها
		}),
	}),
});
