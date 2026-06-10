import { ApiWithAuth } from "../../Stores/apis/api";
import buildQueryParams from "../../utilities/build-query-params";
import APIResponse from "../interfaces/response.interface";
import CompanyUser from "./interfaces/company-user.interface";

export const { useChangeCompanyUserStatusMutation, useGetCompanyUsersQuery, useGetInfiniteCompanyUsersInfiniteQuery, useAddCompanyUserMutation } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		// Endpoint برای دریافت کاربران شرکت
		getCompanyUsers: builder.query<APIResponse<CompanyUser>, Record<string, string | number | boolean> | null>({
			query: (params) => ({
				url: `company/users${params ? "?" + buildQueryParams(params) : ""}`,
				method: "GET",
			}),
			providesTags: ["CompanyUsers"], // کش کردن داده‌ها
			transformResponse: ({ data, message, status }: APIResponse<CompanyUser>) => ({
				data: {
					...data,
					data: data.data.map((item, index) => ({ ...item, count: data.per_page * (data.current_page - 1) + (index + 1) })),
				},
				message,
				status,
			}),
		}),

		getInfiniteCompanyUsers: builder.infiniteQuery<APIResponse<CompanyUser>, Record<string, string | number | boolean>, number>({
			infiniteQueryOptions: {
				initialPageParam: 1,
				getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
					_lastPage.data.current_page < _lastPage.data.last_page ? lastPageParam + 1 : undefined,
			},
			query: ({ queryArg, pageParam }) => ({
				url: `company/users${queryArg ? "?" + buildQueryParams({ ...queryArg, page: pageParam }) : ""}`,
				method: "GET",
			}),
			providesTags: ["CompanyUsers"],
		}),

		addCompanyUser: builder.mutation<any, { user: number }>({
			query: (data) => ({
				url: "company/users",
				data,
				method: "POST",
			}),
			invalidatesTags: ["CompanyUsers"],
		}),

		// Endpoint برای تغییر وضعیت کاربر شرکت
		changeCompanyUserStatus: builder.mutation<any, { userId: number; body: { status: number } }>({
			query: ({ userId, body }) => ({
				url: `company/user-change-status/${userId}`,
				method: "POST",
				data: body,
			}),
			invalidatesTags: ["CompanyUsers"], // کش را پس از تغییر وضعیت بی‌اعتبار می‌کند
		}),
	}),
});
