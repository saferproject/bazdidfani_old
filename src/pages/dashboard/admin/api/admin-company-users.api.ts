import APIResponse from "../../../../api/interfaces/response.interface";
import { ApiWithAuth } from "../../../../Stores/apis/api";
import buildQueryParams from "../../../../utilities/build-query-params";
import CompanyUser from "../interfaces/company-user.interface";

export const { useGetAdminCompanyUsersQuery, useChangeAdminCompanyUserStatusMutation } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		getAdminCompanyUsers: builder.query<APIResponse<CompanyUser>, Record<string, string | number | boolean> | null>({
			query: (params) => ({
				url: `admin/company/company-user/index${params ? "?" + buildQueryParams(params) : ""}`,
				method: "GET",
			}),
			providesTags: ["AdminCompanyUsers"],
			transformResponse: ({ data, message, status }: APIResponse<CompanyUser>) => ({
				data: {
					...data,
					data: data.data.map((item, index) => ({ ...item, count: data.per_page * (data.current_page - 1) + (index + 1) })),
				},
				message,
				status,
			}),
		}),

		changeAdminCompanyUserStatus: builder.mutation<any, { id: number; status: 0 | 1; admin_description: string }>({
			query: ({ id, ...data }) => ({
				url: `admin/company/company-user/change-status/${id}`,
				method: "PUT",
				data,
			}),
			invalidatesTags: ["AdminCompanyUsers"],
		}),
	}),
});
