import { MapApi } from "../../../Stores/apis/api";
import NominatimResponse from "../InspectionItem/interfaces/nominatim-response.interface";

export const { useGetAddressQuery } = MapApi.injectEndpoints({
	endpoints: (builder) => ({
		getAddress: builder.query<NominatimResponse, { latitude: number; longitude: number }>({
			query: ({ latitude, longitude }) => ({
				url: "reverse",
				method: "GET",
				params: {
					format: "jsonv2",
					lat: latitude,
					lon: longitude,
					addressdetails: 1,
					zoom: 18, // ? From 1 to 18, the higher the more detail in address
					"accept-language": "en",
				},
			}),
			providesTags: ["location"],
		}),
	}),
});
