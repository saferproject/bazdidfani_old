import APIResponse from "../../../../api/interfaces/response.interface";
import { ApiWithAuth } from "../../../../Stores/apis/api";
import { RoleType } from "../../../../types/RoleType";
import buildQueryParams from "../../../../utilities/build-query-params";
import CompanyStatus from "../enums/company-status.enum";
import AdminCompanyForm from "../interfaces/admin-company-form.interface";
import Company from "../interfaces/company.interface";

export const { useGetAllCompaniesQuery, useGetInfiniteAllCompaniesInfiniteQuery, useChangeCompanyStatusMutation, useAddCompanyMutation, useEditCompanyMutation } =
	ApiWithAuth.injectEndpoints({
		endpoints: (builder) => ({
			getAllCompanies: builder.query<APIResponse<Company>, Record<string, string | number | boolean> | null>({
				query: (params) => ({
					url: `admin/company/index${params ? "?" + buildQueryParams(params) : ""}`,
					method: "GET",
				}),
				providesTags: ["Companies"],
				transformResponse: ({ data, message, status }: APIResponse<Company>) => ({
					data: {
						...data,
						data: data.data.map((item, index) => ({ ...item, count: data.per_page * (data.current_page - 1) + (index + 1) })),
					},
					message,
					status,
				}),
			}),

			getInfiniteAllCompanies: builder.infiniteQuery<APIResponse<Company>, Record<string, string | number | boolean>, number>({
				infiniteQueryOptions: {
					initialPageParam: 1,
					getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
						_lastPage.data.current_page < _lastPage.data.last_page ? lastPageParam + 1 : undefined,
				},
				query: ({ queryArg, pageParam }) => ({
					url: `admin/company/index${queryArg ? "?" + buildQueryParams({ ...queryArg, page: pageParam }) : ""}`,
					method: "GET",
				}),
				providesTags: ["Companies"],
			}),

			changeCompanyStatus: builder.mutation<any, { role: RoleType; status: CompanyStatus; userId: number }>({
				query: ({ role, status, userId }) => ({
					url: `admin/users/change-status/${userId}`,
					method: "POST",
					data: { role, status },
				}),
				invalidatesTags: ["Companies"],
			}),

			addCompany: builder.mutation<any, AdminCompanyForm & { city_code: number; state_id: string }>({
				query: (data) => ({
					url: "admin/company/create",
					method: "POST",
					data,
				}),
				invalidatesTags: ["Companies"],
			}),

			editCompany: builder.mutation<any, AdminCompanyForm & { city_code: number; state_id: string }>({
				query: (data) => ({
					url: "admin/company/update",
					method: "PUT",
					data,
				}),
				invalidatesTags: ["Companies"],
			}),
		}),
	});
