import APIResponseData from "../../../../api/interfaces/api-response-data.interface";
import { ApiWithAuth } from "../../../../Stores/apis/api";
import CompanyRoleForm from "../interfaces/company-role-form.interface";
import DeleteTechnicalManagerCertificateAPI from "../interfaces/delete-technical-manager-certificate-api.interface";
import TechnicalManagerRoleData, { TechnicalManagerRoleImage } from "../interfaces/technical-manager-role-data.interface";

export const {
	useTechnicalManagerRoleDataQuery,
	useCompanyRoleDataQuery,
	useUpdateTechnicalManagerRoleDataMutation,
	useUpdateCompanyRoleDataMutation,
	useDeleteTechnicalManagerCertificateMutation,
} = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		// ? دریافت اطلاعات احراز هویت مدیر فنی
		technicalManagerRoleData: builder.query<APIResponseData<TechnicalManagerRoleData>, void>({
			query: () => ({
				url: "technical-manager/show",
				method: "GET",
			}),
			providesTags: ["TechnicalManagerRoleData"],
		}),

		// ? دریافت اطلاعات احراز هویت شرکت
		companyRoleData: builder.query<any, void>({
			query: () => ({
				url: "company/show",
				method: "GET",
			}),
			providesTags: ["CompanyRoleData"],
		}),

		// ? ویرایش اطلاعات احراز هویت مدیر فنی
		updateTechnicalManagerRoleData: builder.mutation<APIResponseData<TechnicalManagerRoleData>, FormData>({
			query: (data) => ({
				url: "technical-manager/update",
				// ? must be POST because laravel can't process form-data with PUT or PATCH
				method: "POST",
				data,
			}),
		}),

		// ? ویرایش اطلاعات احراز هویت شرکت
		updateCompanyRoleData: builder.mutation<any, CompanyRoleForm>({
			query: (data) => ({
				url: "company/update",
				method: "PUT",
				data,
			}),
		}),

		// ? حذف عکس مجوز مدیر فنی
		deleteTechnicalManagerCertificate: builder.mutation<
			APIResponseData<Pick<TechnicalManagerRoleImage, "image_type">>,
			DeleteTechnicalManagerCertificateAPI
		>({
			query: (data) => ({
				url: "technical-manager/certificate/delete",
				method: "DELETE",
				data,
			}),
		}),
	}),
});
