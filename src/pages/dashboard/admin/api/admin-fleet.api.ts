import APIResponse from "../../../../api/interfaces/response.interface";
import { ApiWithAuth } from "../../../../Stores/apis/api";
import buildQueryParams from "../../../../utilities/build-query-params";
import Truck from "../interfaces/fleet.interface";

export const {
	useGetAdminFleetQuery,
	useGetAdminFleetDataMutation,
	useChangeAdminFleetStatusMutation,
	useAddAdminFleetMutation,
	useGetAdminFleetDataForEditMutation,
	useEditAdminFleetMutation,
} = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		getAdminFleet: builder.query<APIResponse<Truck>, Record<string, string | number | boolean> | null>({
			query: (params) => ({
				url: `admin/truck/index${params ? "?" + buildQueryParams(params) : ""}`,
				method: "GET",
			}),
			providesTags: ["AdminFleet"],
			transformResponse: ({ data, message, status }: APIResponse<Truck>) => ({
				data: {
					...data,
					data: data.data.map((item, index) => ({ ...item, count: data.per_page * (data.current_page - 1) + (index + 1) })),
				},
				message,
				status,
			}),
		}),

		getAdminFleetData: builder.mutation<unknown, unknown>({
			query: (data) => ({
				url: `admin/truck/smart-number-inqiury`,
				method: "POST",
				data,
			}),
		}),

		getAdminFleetDataForEdit: builder.mutation<unknown, unknown>({
			query: (data) => ({
				url: "admin/truck/smart-number-inqiury-with-server",
				method: "POST",
				data,
			}),
		}),

		changeAdminFleetStatus: builder.mutation<any, { id: number; status: 0 | 1; admin_description: string }>({
			query: ({ id, ...data }) => ({
				url: `admin/truck/change-status/${id}`,
				method: "PUT",
				data,
			}),
			invalidatesTags: ["AdminFleet"],
		}),

		addAdminFleet: builder.mutation<unknown, unknown>({
			query: (data) => ({
				url: "admin/truck/create",
				method: "POST",
				data,
			}),
			invalidatesTags: ["AdminFleet"],
		}),

		editAdminFleet: builder.mutation<unknown, unknown>({
			query: (data) => ({
				url: "admin/truck/update",
				method: "PUT",
				data,
			}),
			invalidatesTags: ["AdminFleet"],
		}),
	}),
});
