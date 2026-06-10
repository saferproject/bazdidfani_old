import InspectionItem from "../../components/InspectionList/interfaces/inspection-item.interface";
import { InspectionModel } from "../../database/models/inspection.model";
import SelfStatementData from "../../pages/dashboard/do-technical-visit/interfaces/self-statement-data.interface";
import { ApiWithAuth } from "../../Stores/apis/api";
import buildQueryParams from "../../utilities/build-query-params";
import APIResponse from "../interfaces/response.interface";
import AddSelfStatement from "./interfaces/add-self-statement-endpoint.interface";

export const {
  useGetSelfStatementQuery,
  useGetInfiniteSelfStatementInfiniteQuery,
  useAddDriverCheckListMutation,
  useAddDriverMutation,
  useEditDriverMutation,
  useChangeDriverStatusMutation,
  useGetDriverQuery,
  useGetInfiniteDriverInfiniteQuery,
  useValidateDriverForSelfStatementMutation,
  useAddSelfStatementMutation,
  useUploadInspectionImageMutation,
  useEndOfUploadInspectionImagesMutation,
} = ApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // ? برای دریافت لیست خود اظهاری ها
    getSelfStatement: builder.query<
      APIResponse<SelfStatementData>,
      Record<string, string | number | boolean>
    >({
      query: (params) => ({
        url: `driver/list-self-statement${params ? "?" + buildQueryParams(params) : ""}`,
        method: "GET",
      }),
      providesTags: ["SelfStatement"],
      transformResponse: ({
        data,
        message,
        status,
      }: APIResponse<SelfStatementData>) => ({
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

    getInfiniteSelfStatement: builder.infiniteQuery<
      APIResponse<SelfStatementData>,
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
        url: `driver/list-self-statement${queryArg ? "?" + buildQueryParams({ ...queryArg, page: pageParam }) : ""}`,
        method: "GET",
      }),
      providesTags: ["SelfStatement"],
    }),

    // Endpoint برای دریافت Drivers
    getDriver: builder.query<
      APIResponse<unknown>,
      Record<string, string | number | boolean> | null
    >({
      query: (params) => ({
        url: `company/drivers/index${params ? "?" + buildQueryParams(params) : ""}`,
        method: "GET",
      }),
      providesTags: ["Drivers"],
      transformResponse: ({ data, message, status }: APIResponse<unknown>) => ({
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

    getInfiniteDriver: builder.infiniteQuery<
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
        url: `company/drivers/index${queryArg ? "?" + buildQueryParams({ ...queryArg, page: pageParam }) : ""}`,
        method: "GET",
      }),
      providesTags: ["Drivers"],
    }),

    addDriver: builder.mutation<any, any>({
      query: (data) => ({
        url: "company/drivers/store",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Drivers"],
    }),

    editDriver: builder.mutation<unknown, unknown>({
      query: ({ company_driver_id, ...data }) => ({
        url: `company/drivers/update/${company_driver_id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Drivers"],
    }),

    changeDriverStatus: builder.mutation<
      any,
      { userId: number; body: { status: number } }
    >({
      query: ({ userId, body }) => ({
        url: `company/drivers/change-status/${userId}`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Drivers"],
    }),

    addDriverCheckList: builder.mutation<
      any,
      {
        inspectionItems: Omit<Array<InspectionItem>, "images">;
        inspectionId: number;
        isSelfStatement: number;
      }
    >({
      query: (data) => ({
        url: `driver/submit-check-list`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["SelfStatement"],
      onQueryStarted: async (_data, { queryFulfilled }) => {
        const response = await queryFulfilled;
        if (response) await InspectionModel.removeAllInspections();
      },
    }),

    // ? استعلام راننده برای خود اظهاری
    validateDriverForSelfStatement: builder.mutation<
      any,
      { national_code: string }
    >({
      query: (data) => ({
        url: "driver/self-statement-inquiry-national-code",
        method: "POST",
        data,
      }),
    }),

    // ? ثبت خوداظهاری
    addSelfStatement: builder.mutation<any, AddSelfStatement>({
      query: (data) => ({
        url: "driver/add-self-statement",
        method: "POST",
        data,
      }),
      invalidatesTags: ["SelfStatement"],
    }),

    // ? ارسال عکس های بازدید فنی یا خوداظهاری
    uploadInspectionImage: builder.mutation<any, FormData>({
      query: (data) => ({
        url: "submit-check-list-image",
        method: "POST",
        data,
      }),
      extraOptions: { retry: true },
    }),

    // ? پایان ارسال عکس های خوداظهاری یا بازدید فنی
    endOfUploadInspectionImages: builder.mutation<
      any,
      { inspectionId: number; isSelfStatement: 0 | 1 }
    >({
      query: (data) => ({
        url: "end-upload-check-list-image",
        method: "POST",
        data,
      }),
    }),
  }),
});
