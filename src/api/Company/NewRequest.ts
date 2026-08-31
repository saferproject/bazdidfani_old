import { ApiWithAuth } from "../../Stores/apis/api";
import {
  AccessibleCompaniesResponse,
  CompanyContextResponse,
} from "../../types/CompanyContext";
import buildQueryParams from "../../utilities/build-query-params";

export const {
  useAddNewRequestMutation,
  useAddSelfStatementByCompanyMutation,
  useChangeCompanyContextMutation,
  useGetAccessibleCompaniesQuery,
  useGetCompaniesQuery,
  useRedirectInspectionMutation,
} = ApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint برای ارسال درخواست جدید بازدید فنی
    addNewRequest: builder.mutation<any, unknown>({
      query: (data) => ({
        url: "company/bazdidfani/store",
        method: "POST",
        data,
      }),
      // Tag برای کش کردن یا بی‌اعتبار کردن درخواست‌ها
      invalidatesTags: ["RequestsList"],
    }),

    getCompanies: builder.query<any, { status: 2 | 3 }>({
      query: (data) => ({
        url: "admin/company/active-list?" + buildQueryParams(data),
        method: "GET",
      }),
    }),

    // ? ثبت درخواست خوداظهاری توسط شرکت
    addSelfStatementByCompany: builder.mutation({
      query: (data) => ({
        url: "company/bazdidfani/self-statement/store",
        method: "POST",
        data,
      }),
      invalidatesTags: ["RequestsList"],
    }),

    // ? ارجاع مجدد درخواست بازدید فنی به یک مدیر فنی
    redirectInspection: builder.mutation({
      query: (data) => ({
        url: "company/bazdidfani/reassign-technical-manager",
        method: "POST",
        data,
      }),
      invalidatesTags: ["RequestsList"],
    }),

    getAccessibleCompanies: builder.query<AccessibleCompaniesResponse, void>({
      query: () => ({
        url: "company/accessible-companies",
        method: "GET",
      }),
      providesTags: ["AccessibleCompanies"],
    }),

    changeCompanyContext: builder.mutation<
      CompanyContextResponse,
      { company_id: number }
    >({
      query: (data) => ({
        url: "company/context",
        method: "PUT",
        data,
        suppressForbiddenRedirect: true,
      }),
    }),
  }),
});
