import APIResponse from "../../../../api/interfaces/response.interface";
import { ApiWithAuth } from "../../../../Stores/apis/api";
import buildQueryParams from "../../../../utilities/build-query-params";
import Driver from "../interfaces/driver.interface";
import { AdminDriverFormType } from "../schemas/admin-driver-form.schema";

export const { useGetDriversQuery, useGetInfiniteDriversInfiniteQuery, useAdminChangeDriverStatusMutation, useAdminAddDriverMutation, useAdminEditDriverMutation } =
	ApiWithAuth.injectEndpoints({
		endpoints: (builder) => ({
			getDrivers: builder.query<APIResponse<Driver>, Record<string, string | number | boolean> | null>({
				query: (params) => ({
					url: `admin/driver/index${params ? "?" + buildQueryParams(params) : ""}`,
					method: "GET",
				}),
				providesTags: ["AdminDrivers"],
				transformResponse: ({ data, message, status }: APIResponse<Driver>) => ({
					data: {
						...data,
						data: data.data.map((item, index) => ({ ...item, count: data.per_page * (data.current_page - 1) + (index + 1) })),
					},
					message,
					status,
				}),
			}),

			getInfiniteDrivers: builder.infiniteQuery<APIResponse<unknown>, Record<string, string | number | boolean>, number>({
				infiniteQueryOptions: {
					initialPageParam: 1,
					getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
						_lastPage.data.current_page < _lastPage.data.last_page ? lastPageParam + 1 : undefined,
				},
				query: ({ queryArg, pageParam }) => ({
					url: `admin/driver/index${queryArg ? "?" + buildQueryParams({ ...queryArg, page: pageParam }) : ""}`,
					method: "GET",
				}),
				providesTags: ["AdminDrivers"],
			}),

			adminChangeDriverStatus: builder.mutation<any, { user_id: number; status: number; description: string }>({
				query: ({ user_id, ...data }) => ({
					url: `admin/driver/change-status/${user_id}`,
					method: "PUT",
					data,
				}),
				invalidatesTags: ["AdminDrivers"],
			}),

			adminAddDriver: builder.mutation<any, AdminDriverFormType & { status: 0 | 1 }>({
				query: (data) => ({
					url: "admin/driver/create",
					method: "POST",
					data,
				}),
				invalidatesTags: ["AdminDrivers"],
			}),

			adminEditDriver: builder.mutation<any, AdminDriverFormType & { status: 0 | 1; id: number }>({
				query: (data) => ({
					url: "admin/driver/update",
					method: "PUT",
					data,
				}),
				invalidatesTags: ["AdminDrivers"],
			}),
		}),
	});
