import APIResponse from "../../../../api/interfaces/response.interface";
import { ApiWithAuth } from "../../../../Stores/apis/api";
import buildQueryParams from "../../../../utilities/build-query-params";
import Inspector from "../interfaces/inspector.interface";










export const {
  useGetAdminTechnicalManagersQuery,
  useGetAdminInfiniteTechnicalManagersInfiniteQuery,
  useChangeAdminTechnicalManagerStatusMutation,
  useAddAdminTechnicalManagerMutation,
  useEditAdminTechnicalManagerMutation,
} = ApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getAdminTechnicalManagers: builder.query<
      APIResponse<Inspector>,
      Record<string, string | number | boolean> | null
    >({
      query: (params) => ({
        url: `admin/technical-manager/index${params ? "?" + buildQueryParams(params) : ""}`,
        method: "GET",
      }),
      providesTags: ["TechnicalManagers"],
      transformResponse: ({
        data,
        message,
        status,
      }: APIResponse<Inspector>) => ({
        data: {
          ...data,
          data: data.data.map((item, index) => ({
            ...item,
            count: data.per_page * (data.current_page - 1) + (index + 1),
          })),
        },
        message,
        status,
      }),
    }),

    getAdminInfiniteTechnicalManagers: builder.infiniteQuery<
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
        url: `admin/technical-manager/index${queryArg ? "?" + buildQueryParams({ ...queryArg, page: pageParam }) : ""}`,
        method: "GET",
      }),
      providesTags: ["TechnicalManagers"],
    }),

    changeAdminTechnicalManagerStatus: builder.mutation<
      any,
      { status: 0 | 1; userId: number; description: string }
    >({
      query: ({ status, userId, description }) => ({
        url: `admin/technical-manager/change-status/${userId}`,
        method: "PUT",
        data: { status, description },
      }),
      invalidatesTags: ["TechnicalManagers"],
    }),

    addAdminTechnicalManager: builder.mutation<any, FormData>({
      query: (data) => ({
        url: "/admin/technical-manager/update",
        method: "POST",
        data,
      }),
      invalidatesTags: ["TechnicalManagers"],
    }),

    editAdminTechnicalManager: builder.mutation<any, FormData>({
      query: (data) => ({
        url: "admin/technical-manager/update",
        method: "POST",
        data,
      }),
      invalidatesTags: ["TechnicalManagers"],
    }),
  }),
});
