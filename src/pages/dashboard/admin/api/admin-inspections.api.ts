import APIResponse from "../../../../api/interfaces/response.interface";
import InspectionItem from "../../../../components/InspectionList/interfaces/inspection-item.interface";
import { ApiWithAuth } from "../../../../Stores/apis/api";
import buildQueryParams from "../../../../utilities/build-query-params";
import { Inspection } from "../interfaces/inspection.interface";

export const { useGetAdminInspectionsQuery, useGetInfiniteAdminInspectionsInfiniteQuery, useGetAdminInspectionDetailsQuery } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		getAdminInspections: builder.query<APIResponse<Inspection>, Record<string, string | number | boolean>>({
			query: (params) => ({
				url: `admin/list-bazdidfani${params ? "?" + buildQueryParams(params) : ""}`,
				method: "GET",
			}),
			providesTags: ["AdminInspections"],
			transformResponse: ({ data, message, status }: APIResponse<Inspection>) => ({
				data: {
					...data,
					data: data.data.map((item, index) => ({ ...item, count: data.per_page * (data.current_page - 1) + (index + 1) })),
				},
				message,
				status,
			}),
		}),

		getInfiniteAdminInspections: builder.infiniteQuery<APIResponse<Inspection>, Record<string, string | number | boolean>, number>({
			infiniteQueryOptions: {
				initialPageParam: 1,
				getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
					_lastPage.data.current_page < _lastPage.data.last_page ? lastPageParam + 1 : undefined,
			},
			query: ({ queryArg, pageParam }) => ({
				url: `admin/list-bazdidfani${queryArg ? "?" + buildQueryParams({ ...queryArg, page: pageParam }) : ""}`,
				method: "GET",
			}),
			providesTags: ["AdminInspections"],
		}),

		getAdminInspectionDetails: builder.query<{ status: boolean; message: string; data: Array<InspectionItem> }, { id: number }>({
			query: (params) => ({
				url: "admin/completed-checklist/show",
				method: "GET",
				params,
			}),
			providesTags: ["AdminInspectionDetails"],
		}),
	}),
});
