import { ApiWithAuth } from "../../Stores/apis/api";
import { RoleType } from "../../types/RoleType";

export const {
	useChangeTechnicalManagerStatusMutation,
	useAddTechnicalManagerMutation,
	useEditTechnicalManagerMutation,
	useGetTechnicalManagersMutation,
	useSendOTPToTechManagerMutation,
	useVerifyOTPForTechManagerMutation,
	useCompleteNewTechManagerProfileMutation,
	useRegisterNewTechManagerMutation
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

		sendOTPToTechManager: builder.mutation<any, { phone: string }>({
			query: (data) => {
				return {
					url: "company/technicalManager/onboard/send-otp",
					method: "POST",
					data
				}
			}
		}),

		verifyOTPForTechManager: builder.mutation<any, { phone: string, token: string }>({
			query: (data) => {
				return {
					url: "company/technicalManager/onboard/verify-otp",
					method: "POST",
					data
				}
			}
		}),

		completeNewTechManagerProfile: builder.mutation<any, { 
			phone: string,
  			full_name: string,
  			father_name: string,
  			address: string,
  			national_code: string,
  			email: string,
  			telephone: string,
  			birthdate: Date,
  			city_code: number,
  			image: string 
		}>({
			query: (data) => {
				return {
					url: "company/technicalManager/onboard/complete-profile",
					method: "POST",
					data
				}
			}
		}),

		registerNewTechManager: builder.mutation<any, { 
			phone: string,
			national_code: string,
			type: string,
			capacity: number,
			passenger_capacity: number,
			freighter_capacity: number,
			start_cooperate: Date,
			end_cooperate: Date
		}>({
			query: (data) => {
				return {
					url: "company/technicalManager/onboard/register",
					method: "POST",
					data
				}
			}
		}),
	}),
});
