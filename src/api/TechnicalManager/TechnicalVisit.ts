import { ApiWithAuth } from "../../Stores/apis/api";
import buildQueryParams from "../../utilities/build-query-params";
import APIResponse from "../interfaces/response.interface";

export const {
  useGetInspectionsWithPaginationQuery,
  useGetInspectionsInfiniteQuery,
  useChangeTechnicalVisitStatusMutation,
  useAddTechnicalInspectionMutation,
  useGetTechnicalManagerCompaniesQuery,
  useGetVisitChecklistMutation,
} = ApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint برای تغییر وضعیت بازدید فنی
    changeTechnicalVisitStatus: builder.mutation<
      any,
      { bazdidfani_id: number; status: number }
    >({
      query: (data) => ({
        url: `technical-manager/bazdifani/change-status`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["TechnicalVisits"], // پس از تغییر وضعیت، کش بی‌اعتبار می‌شود
    }),

    // ? Getting inspections based on pagination
    getInspectionsWithPagination: builder.query<
      APIResponse<unknown>,
      { [key: string]: string | number }
    >({
      query: (params) => ({
        url: `technical-manager/bazdifani${params ? "?" + buildQueryParams(params) : ""}`,
        method: "GET",
      }),
      providesTags: ["TechnicalVisits"],
      transformResponse: ({ data, message, status }) => ({
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

    // ? Getting inspections based on infinite loader
    getInspections: builder.infiniteQuery<
      APIResponse<unknown>,
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
        url: `technical-manager/bazdifani${queryArg ? "?" + buildQueryParams({ ...queryArg, page: pageParam }) : ""}`,
        method: "GET",
      }),
      providesTags: ["TechnicalVisits"],
    }),

    addTechnicalInspection: builder.mutation({
      query: (data) => ({
        url: "technical-manager/visit/register",
        method: "POST",
        data,
      }),
      invalidatesTags: ["TechnicalVisits"],
    }),

    getTechnicalManagerCompanies: builder.query({
      query: ({ id, name }) => ({
        url: `technical-manager/companies?${id ? `id=${id}` : ""}${name ? `&name=${name}` : ""}`,
        method: "GET",
      }),
    }),

    getVisitChecklist: builder.mutation<
      any,
      { bazdidfani_id: number; latitude: number; longitude: number; description: string }
    >({
      query: (data) => ({
        url: "technical-manager/visit/get-checklist",
        method: "POST",
        data,
      }),
    }),
  }),
});
