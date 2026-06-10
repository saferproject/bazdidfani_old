import { QueryParamsMaker } from "../../utilities/Helper";
import { ApiWithAuth } from "../../Stores/apis/api";
import buildQueryParams from "../../utilities/build-query-params";
import APIResponse from "../interfaces/response.interface";
import DriverFleet from "./interfaces/driver-fleet.interface";
import CompanyFleet from "./interfaces/company-fleet.interface";

export const {
	useGetFleetForCompanyQuery,
	useGetInfiniteFleetForCompanyInfiniteQuery,
	useGetFleetForDriverQuery,
	useGetInfiniteFleetForDriverInfiniteQuery,
	useChangeFleetStatusMutation,
	useDeleteFleetMutation,
	useGetDriverFleetByIdQuery,
	useGetCompanyFleetByIdQuery,
	useGetLoadingTypesByActivityTypeQuery,
	useAddEditDriverOrComaonyFleetMutation,
} = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		getFleetForCompany: builder.query<APIResponse<CompanyFleet>, Record<string, string | number | boolean> | null>({
			query: (params) => ({
				url: `company/trucks${params ? "?" + buildQueryParams(params) : ""}`,
				method: "GET",
			}),
			providesTags: ["Fleet"], // کش کردن داده‌ها
			transformResponse: ({ data, message, status }: APIResponse<CompanyFleet>) => ({
				data: {
					...data,
					data: data.data.map((item, index) => ({ ...item, count: data.per_page * (data.current_page - 1) + (index + 1) })),
				},
				message,
				status,
			}),
		}),

		getInfiniteFleetForCompany: builder.infiniteQuery<APIResponse<CompanyFleet>, Record<string, string | number | boolean>, number>({
			infiniteQueryOptions: {
				initialPageParam: 1,
				getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
					_lastPage.data.current_page < _lastPage.data.last_page ? lastPageParam + 1 : undefined,
			},
			query: ({ queryArg, pageParam }) => ({
				url: `company/trucks${queryArg ? "?" + buildQueryParams({ ...queryArg, page: pageParam }) : ""}`,
				method: "GET",
			}),
			providesTags: ["Fleet"],
		}),

		getFleetForDriver: builder.query<APIResponse<DriverFleet>, Record<string, string | number | boolean> | null>({
			query: (params) => ({
				url: `driver/trucks${params ? "?" + buildQueryParams(params) : ""}`,
				method: "GET",
			}),
			providesTags: ["Fleet"], // کش کردن داده‌ها
			transformResponse: ({ data, message, status }: APIResponse<DriverFleet>) => ({
				data: {
					...data,
					data: data.data.map((item, index) => ({ ...item, count: data.per_page * (data.current_page - 1) + (index + 1) })),
				},
				message,
				status,
			}),
		}),

		getInfiniteFleetForDriver: builder.infiniteQuery<APIResponse<DriverFleet>, Record<string, string | number | boolean>, number>({
			infiniteQueryOptions: {
				initialPageParam: 1,
				getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
					_lastPage.data.current_page < _lastPage.data.last_page ? lastPageParam + 1 : undefined,
			},
			query: ({ queryArg, pageParam }) => ({
				url: `driver/trucks${queryArg ? "?" + buildQueryParams({ ...queryArg, page: pageParam }) : ""}`,
				method: "GET",
			}),
			providesTags: ["Fleet"],
		}),

		// Endpoint برای تغییر وضعیت Fleet
		changeFleetStatus: builder.mutation<any, { id: number; owner: "me" | "company"; body: { status: number } }>({
			query: ({ id, owner, body }) => ({
				url: `${owner === "me" ? "driver" : "company"}/trucks/change-status/${id}`,
				method: "POST",
				data: body,
			}),
			invalidatesTags: ["Fleet"], // پس از تغییر وضعیت، کش بی‌اعتبار می‌شود
		}),

		addEditDriverOrComaonyFleet: builder.mutation<any, { data: any; owner: "me" | "company" | "technical-manager"; mode: "ADD" | "EDIT" | "ADD_WITHOUT_INQUIRY" }>({
			query: ({ data, owner, mode }) => {
				if (mode === "EDIT") {
					if (owner === "me") {
						return {
							url: `driver/trucks/update/${data.id}`,
							method: "POST",
							data: {
								...data,
							},
						};
					} else {
						return {
							url: `company/trucks/${data.id}`,
							method: "PUT",
							data: {
								...data,
							},
						};
					}
				} else {
					if (owner === "me") {
						return {
							url: `driver/trucks`,
							method: "POST",
							data: {
								...data,
							},
						};
					} else if (owner === "technical-manager") {
						return {
							url: `technical-manager/trucks`,
							method: "POST",
							data: {
								...data,
							},
						};
					} else {
						return {
							url: `company/trucks`,
							method: "POST",
							data: {
								...data,
							},
						};
					}
				}
			},
			invalidatesTags: ["Fleet"],
		}),

		deleteFleet: builder.mutation<any, { id: number; owner: "company" | "me" }>({
			query: ({ id, owner }) =>
				owner === "me"
					? {
							url: `driver/trucks/${id}`,
							method: "DELETE",
					  }
					: {
							url: `company/trucks/${id}`,
							method: "DELETE",
					  },
			invalidatesTags: ["Fleet"],
		}),

		// Endpoint برای دریافت Fleet by ID
		getDriverFleetById: builder.query<any, number>({
			query: (id) => ({
				url: `driver/trucks/${id}`,
				method: "GET",
			}),
			providesTags: ["Fleet"], // کش کردن داده‌ها
		}),

		// ? get company Fleet by ID
		getCompanyFleetById: builder.query<any, number>({
			query: (id) => ({
				url: `company/trucks/${id}`,
				method: "GET",
			}),
			providesTags: ["Fleet"], // کش کردن داده‌ها
		}),

		// Endpoint برای دریافت Loading Types by Activity Type
		getLoadingTypesByActivityType: builder.query<any, { activityType: "freighter" | "passenger"; query?: string | null }>({
			query: ({ activityType, query = "" }) => ({
				url: `loading-types${QueryParamsMaker({ query, activityType: activityType === "passenger" ? 2 : 1 })}`,
				method: "GET",
			}),
			providesTags: ["LoadingTypes"], // کش کردن داده‌ها
		}),
	}),
});
