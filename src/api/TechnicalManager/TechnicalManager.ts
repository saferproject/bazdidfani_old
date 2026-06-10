import { ApiWithAuth } from "../../Stores/apis/api";
import { RoleType } from "../../types/RoleType";

export const {
	useChangeTechnicalManagerStatusMutation,
	useAddTechnicalManagerMutation,
	useEditTechnicalManagerMutation,
	useGetTechnicalManagersMutation,
} = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		GetTechnicalManagers: builder.mutation<any, string>({
			query: (queryString = "") => ({
				url: `company/technicalManager/index${queryString}`,
				method: "GET",
			}),
		}),
		
		// Endpoint برای تغییر وضعیت مدیر فنی
		changeTechnicalManagerStatus: builder.mutation<any, { role: RoleType; userId: number; status: number }>({
			query: ({ userId, ...data }) => ({
				url: `company/technicalManager/change-status/${userId}`,
				method: "POST",
				data,
			}),
			invalidatesTags: ["TechnicalManager"], // پس از تغییر وضعیت، کش بی‌اعتبار می‌شود
		}),

		// Endpoint برای اضافه کردن مدیر فنی
		addTechnicalManager: builder.mutation<any, any>({
			query: (data) => ({
				url: `company/technicalManager/store`,
				method: "POST",
				data,
			}),
			invalidatesTags: ["TechnicalManager"], // پس از اضافه کردن، کش بی‌اعتبار می‌شود
		}),

		editTechnicalManager: builder.mutation<unknown, unknown>({
			query: (data) => ({
				url: "company/technicalManager/update-cooperate-to-company",
				method: "PUT",
				data,
			}),
			invalidatesTags: ["TechnicalManager"], // پس از اضافه کردن، کش بی‌اعتبار می‌شود
		}),
	}),
});
