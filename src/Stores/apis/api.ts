import { createApi } from "@reduxjs/toolkit/query/react";
import AxiosBaseQuery from "../AxiosBaseQuery";
import { API_URL } from "../api-urls";

export const ApiWithAuth = createApi({
	reducerPath: "ApiWithAuth",
	refetchOnMountOrArgChange: true,
	refetchOnFocus: true,
	refetchOnReconnect: true,
	keepUnusedDataFor: 0,

	baseQuery: AxiosBaseQuery({
		baseUrl: API_URL + "/api/",
		hasAuth: true,
	}),
	tagTypes: [
		"AdminUser",
		"States",
		"Cities",
		"Cargos",
		"PackingType",
		"LoadingTypes",
		"Systems",
		"Tips",
		"Colors",
		"TechnicalManager",
		"NewRequests",
		"CompanyUsers",
		"SelfStatement",
		"Drivers",
		"Fleet",
		"MyFleet",
		"Profile",
		"Permissions",
		"RequestsList",
		"TechnicalVisits",
		"RequestDetail",
		"CreditChnageHistory",
		"WalletInfo",
		"CompanyRoleData",
		"TechnicalManagerRoleData",
		"Companies",
		"TechnicalManagers",
		"AdminDrivers",
		"AdminFleet",
		"AdminCompanyUsers",
		"AdminUsers",
		"AdminInspections",
		"AdminInspectionDetails",
		"AdminSettings",
		"InspectionCheck",
		"RoleStates",
		"Logs",
	],
	endpoints: () => ({}),
});

export const ApiWithoutAuth = createApi({
	reducerPath: "ApiWithoutAuth",
	baseQuery: AxiosBaseQuery({
		baseUrl: API_URL + "/api/",
	}),
	endpoints: () => ({}),
});

export const MapApi = createApi({
	reducerPath: "MapApi",
	baseQuery: AxiosBaseQuery({
		baseUrl: "https://nominatim.openstreetmap.org/",
	}),
	tagTypes: ["cityLocation", "locationDetails", "location"],
	endpoints: () => ({}),
});
