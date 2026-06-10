import CompanyUsage from "../pages/dashboard/admin/enums/company-usage.enum";
import { ApiWithAuth } from "../Stores/apis/api";

export const {
  useGetNationalCodeInquiryMutation,
  useGetSmartNumberInquiryMutation,
  useInquiryOrgCodeMutation,
  useGetTechnicalManagerSmartNumberInquiryMutation,
} = ApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // دریافت استعلام کد ملی
    getNationalCodeInquiry: builder.mutation<any, string>({
      query: (nationalCode = "") => ({
        url: `company/inquiry_national_code?national_code=${nationalCode}`,
        method: "GET",
      }),
    }),

    // دریافت استعلام شماره هوشمند
    getSmartNumberInquiry: builder.mutation<
      any,
      {
        smartNumber: string;
        owner: string;
        companyUsage: CompanyUsage;
        usage: "passenger" | "freighter";
        userType: "driver" | "company";
      }
    >({
      query: ({ smartNumber, owner, companyUsage, usage, userType }) =>
        owner === "company"
          ? {
              url: `company/smart-number-inquiry?smart_number=${smartNumber}&company_usage=${companyUsage}&usage=${usage}&user_type=${userType}`,
              method: "GET",
            }
          : {
              url: `driver/smart-number-inquiry?smart_number=${smartNumber}&user_type=${userType}`,
              method: "GET",
            },
    }),

    getTechnicalManagerSmartNumberInquiry: builder.mutation<
      any,
      {
        smartNumber: string;
        companyUsage: CompanyUsage;
        usage: "passenger" | "freighter";
      }
    >({
      query: ({ smartNumber, companyUsage, usage }) => ({
        url: `technical-manager/smart-number-inquiry?smart_number=${smartNumber}&company_usage=${companyUsage}&usage=${usage}`,
        method: "GET",
      }),
    }),

    // دریافت استعلام کد سازمانی
    inquiryOrgCode: builder.mutation<any, string>({
      query: (organizationCode) => ({
        url: `user/inquiry-company-organization-code?organization_code=${organizationCode}`,
        method: "GET",
      }),
    }),
  }),
});
