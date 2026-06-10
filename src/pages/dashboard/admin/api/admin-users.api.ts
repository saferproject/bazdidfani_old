import APIResponse from "../../../../api/interfaces/response.interface";
import { ApiWithAuth } from "../../../../Stores/apis/api";
import buildQueryParams from "../../../../utilities/build-query-params";
import Role from "../interfaces/role.interface";
import User from "../interfaces/user.interface";

export const { useGetAdminUsersQuery, useEditAdminUsersMutation, useGetUserRolesQuery } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		getAdminUsers: builder.query<APIResponse<User>, Record<string, string | number | boolean>>({
			query: (params) => ({
				url: `admin/user/users-list${params ? "?" + buildQueryParams(params) : ""}`,
				method: "GET",
			}),
			providesTags: ["AdminUsers"],
			transformResponse: ({ data, message, status }: APIResponse<User>) => ({
				data: {
					...data,
					data: data.data.map((item, index) => ({ ...item, count: data.per_page * (data.current_page - 1) + (index + 1) })),
				},
				message,
				status,
			}),
		}),

		editAdminUsers: builder.mutation<unknown, unknown>({
			query: (data) => ({
				url: "admin/user/profile/update",
				method: "PUT",
				data,
			}),
			invalidatesTags: ["AdminUsers"],
		}),

		getUserRoles: builder.query<Role[], void>({
			query: () => ({
				url: "admin/roles",
				method: "GET",
			}),
		}),
	}),
});
