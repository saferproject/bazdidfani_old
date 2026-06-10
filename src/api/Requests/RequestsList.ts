import InspectionRequest from "../../pages/dashboard/requests/interfaces/inspection-request.interface";
import { ApiWithAuth } from "../../Stores/apis/api";
import InspectionItem from "../../components/InspectionList/interfaces/inspection-item.interface";
import APIResponse from "../interfaces/response.interface";
import buildQueryParams from "../../utilities/build-query-params";

export const {
	useGetRequestsListQuery,
	useGetInfiniteRequestsListInfiniteQuery,
	useGetRequestsExcelQuery,
	useGetRequestDetailQuery,
	useGetInspectionCheckDataQuery,
	useDeleteInspectionCheckImageMutation,
	useConfirmInspectionCheckMutation,
	useCancelInspectionRequestMutation,
} = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		getRequestsList: builder.query<APIResponse<InspectionRequest>, Record<string, string | number | boolean> | null>({
			query: (params) => ({
				url: `company/bazdidfani/index${params ? "?" + buildQueryParams(params) : ""}`,
				method: "GET",
			}),
			providesTags: ["RequestsList"],
			transformResponse: ({ data, message, status }: APIResponse<InspectionRequest>) => ({
				data: {
					...data,
					data: data.data.map((item, index) => ({ ...item, count: data.per_page * (data.current_page - 1) + (index + 1) })),
				},
				message,
				status,
			}),
		}),

		getInfiniteRequestsList: builder.infiniteQuery<APIResponse<InspectionRequest>, Record<string, string | number | boolean>, number>({
			infiniteQueryOptions: {
				initialPageParam: 1,
				getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
					_lastPage.data.current_page < _lastPage.data.last_page ? lastPageParam + 1 : undefined,
			},
			query: ({ queryArg, pageParam }) => ({
				url: `company/bazdidfani/index${queryArg ? "?" + buildQueryParams({ ...queryArg, page: pageParam }) : ""}`,
				method: "GET",
			}),
			providesTags: ["RequestsList"],
		}),

		getRequestsExcel: builder.query<Blob, Record<string, string | number | boolean> | null>({
			query: (params) => ({
				url: `company/bazdidfani/index${params ? "?" + buildQueryParams(params) : ""}`,
				method: "GET",
				responseHandler: async (response) => {
					return await response.blob();
				},
			}),
			keepUnusedDataFor: 0,
		}),

		getRequestDetail: builder.query<any, number>({
			query: (id) => ({
				url: `company/bazdidfani/details/${id}`,
				method: "GET",
			}),
			providesTags: ["RequestDetail"],
		}),

		getInspectionCheckData: builder.query<{ status: boolean; message: string; data: Array<InspectionItem> }, { id: number }>({
			query: (params) => ({
				url: "company/bazdidfani/completed-checklist/show",
				method: "GET",
				params,
			}),
			providesTags: ["InspectionCheck"],
		}),

		deleteInspectionCheckImage: builder.mutation<
			unknown,
			{ technical_inspection_id: number; uuid: string; code: number; image_code: string; is_detail: number }
		>({
			query: (data) => ({
				url: "company/bazdidfani/completed-checklist/delete-image-item-checklist",
				method: "DELETE",
				data,
			}),
			invalidatesTags: ["InspectionCheck", "RequestsList"],
		}),

		confirmInspectionCheck: builder.mutation<unknown, { bazdidfani_id: number }>({
			query: (data) => ({
				url: "company/bazdidfani/completed-checklist/confirm",
				method: "PUT",
				data,
			}),
			invalidatesTags: ["RequestsList"],
		}),

		cancelInspectionRequest: builder.mutation<unknown, { bazdidfani_id: number }>({
			query: (data) => ({
				url: "company/bazdidfani/cancel",
				method: "POST",
				data,
			}),
			invalidatesTags: ["RequestsList"],
		}),
	}),
});
