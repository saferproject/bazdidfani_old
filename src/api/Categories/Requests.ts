import CompanyUsage from "../../pages/dashboard/admin/enums/company-usage.enum";
import { ApiWithAuth } from "../../Stores/apis/api";

export const { useGetLoadingTypesQuery } = ApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint برای دریافت Loading Types
    getLoadingTypes: builder.query<
      any,
      { query: string; activityType: CompanyUsage }
    >({
      query: (params) => ({
        url: `loading-types${
          Object.keys(params).length
            ? "?" +
              Object.entries(params)
                .map(([key, value]) => `${key}=${value}`)
                .join("&")
            : ""
        }`,
        method: "GET",
      }),
      providesTags: ["LoadingTypes"],
    }),
  }),
});
