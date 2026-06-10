import { LatLngExpression } from "leaflet";
import { MapApi } from "../../Stores/apis/api";
import { GetCityLocationType } from "../../types/MapType";

export const { useGetCityLocationQuery, useGetDetailsByLocationQuery } = MapApi.injectEndpoints({
	endpoints: (builder) => ({
		getCityLocation: builder.query<any, GetCityLocationType>({
			query: (data) => ({
				url: `search?city=${data.city || ""}&state=${data.state || ""}&country=ایران&format=json&accept-language=fa`,
				method: "GET",
			}),
			providesTags: ["cityLocation"],
		}),

		getDetailsByLocation: builder.query<any, LatLngExpression>({
			query: (location) => ({
				url: `reverse?lat=${location[0]}&lon=${location[1]}&format=json&accept-language=fa&zoom=18`,
				method: "GET",
			}),
			providesTags: ["locationDetails"],
		}),
	}),
});
