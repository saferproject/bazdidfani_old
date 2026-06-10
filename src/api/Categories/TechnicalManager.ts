import { ApiWithAuth } from "../../Stores/apis/api";
import buildQueryParams from "../../utilities/build-query-params";
import APIResponse from "../interfaces/response.interface";
import Inspector from "./interfaces/inspector.interface";










export const {
  useGetTechnicalManagerQuery,
	useGetInfiniteTechnicalManagerInfiniteQuery,
	useGetCompanyTechnicalManagersQuery
} = ApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint برای دریافت Technical Manager
    getTechnicalManager: builder.query<
      APIResponse<Inspector>,
      Record<string, string | number | boolean> | null
    >({
      query: (params) => ({
        url: `company/technicalManager/index${params ? "?" + buildQueryParams(params) : ""}`,
        method: "GET",
      }),
      providesTags: ["TechnicalManager"], // کش کردن داده‌ها
      transformResponse: ({
        data,
        message,
        status,
      }: APIResponse<Inspector>) => ({
        data: {
          ...data,
          data: data.data.map((item, index) => ({
            personal: {
              ...item.personal,
              count: data.per_page * (data.current_page - 1) + (index + 1),
            },
          })),
        },
        message,
        status,
      }),
    }),

    getCompanyTechnicalManagers: builder.query<
      APIResponse<Inspector>,
      Record<string, string | number | boolean> | null
    >({
      query: (params) => ({
        url: `company/technicalManager/list${params ? "?" + buildQueryParams(params) : ""}`,
        method: "GET",
      }),
      providesTags: ["TechnicalManager"], // کش کردن داده‌ها
      // transformResponse: ({
      //   data,
      //   message,
      //   status,
      // }: APIResponse<Inspector>) => ({
      //   data: {
      //     ...data,
      //     data: data.data.map((item, index) => ({
      //       personal: {
      //         ...item.personal,
      //         count: data.per_page * (data.current_page - 1) + (index + 1),
      //       },
      //     })),
      //   },
      //   message,
      //   status,
      // }),
    }),

    getInfiniteTechnicalManager: builder.infiniteQuery<
      APIResponse<Inspector>,
      Record<string, string | number | boolean>,
      number
    >({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
          _lastPage.data.current_page < _lastPage.data.last_page
            ? lastPageParam + 1
            : undefined,
      },
      query: ({ queryArg, pageParam }) => ({
        url: `company/technicalManager/index${queryArg ? "?" + buildQueryParams({ ...queryArg, page: pageParam }) : ""}`,
        method: "GET",
      }),
      providesTags: ["TechnicalManager"],
    }),
  }),
});
