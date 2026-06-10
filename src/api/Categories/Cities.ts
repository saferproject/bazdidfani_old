import { ApiWithAuth } from "../../Stores/apis/api";

export const { useGetCitiesQuery } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		getCities: builder.query<any, string>({
			query: (query = "") => ({
				url: `cities${query ? `?query=${query}` : ""}`,
				method: "GET",
			}),
			providesTags: ["Cities"],
		}),
	}),
});
