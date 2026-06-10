import City from "../../pages/dashboard/admin/interfaces/city.interface";
import { ApiWithAuth } from "../../Stores/apis/api";

export const { useGetCitiesQuery, useGetStatesQuery } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		// Endpoint برای دریافت Cities
		getCities: builder.query<{ success: boolean; message: string; data: Array<City> }, { query?: string; province_id?: string }>({
			query: ({ query = "", province_id = "" }) => ({
				url: `cities?${query ? `query=${query}` : ""}${province_id ? `&province_id=${province_id}` : ""}&city_org=true`,
				method: "GET",
			}),
			providesTags: ["Cities"], // کش کردن نتایج
		}),

		// Endpoint برای دریافت States
		getStates: builder.query<any, string>({
			query: (query = "") => ({
				url: `states${query ? `?query=${query}` : ""}`,
				method: "GET",
			}),
			providesTags: ["States"], // کش کردن نتایج
		}),
	}),
});
