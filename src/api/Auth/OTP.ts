import { ApiWithoutAuth } from "../../Stores/apis/api";
import { setOTP, setPhone, setToken, setUserID } from "../../Stores/slices/user";
import { OTPSendCodeRequestDataType, OTPValidatePhoneType } from "../../types/OTPType";
import { RootState } from "../../Stores/store";

export const { useCheckOTPMutation, useSendOTPCodeOrSendEmailOrPhoneMutation } = ApiWithoutAuth.injectEndpoints({
	endpoints: (builder) => ({
		sendOTPCodeOrSendEmailOrPhone: builder.mutation<any, OTPSendCodeRequestDataType & { type: "otp" | "phone" }>({
			query: ({ phone, type, check }) => {
				if (type === "otp") {
					return {
						url: "auth/otp",
						method: "POST",
						data: {
							phone,
							check,
						},
					};
				} else {
					return {
						url: "auth/forgot-password/send-token",
						method: "POST",
						data: { data: phone, check },
					};
				}
			},
			onQueryStarted: async ({ phone }, { dispatch, queryFulfilled }) => {
				try {
					await queryFulfilled;
					dispatch(setPhone(phone));
				} catch (err) {
					throw err;
				}
			},
		}),
		checkOTP: builder.mutation<any, OTPValidatePhoneType & { forgot: boolean }>({
			query: ({ forgot, ...data }) => ({
				url: "auth/otp-check",
				method: "POST",
				data,
			}),
			onQueryStarted: async ({ forgot, token }, { queryFulfilled, dispatch, getState }) => {
				try {
					const state = getState();
					const phone = (state as RootState)?.user?.phone;
					const res = await queryFulfilled;
					if (forgot) {
						const verifiedOtp = String(token);
						localStorage.setItem("otp", verifiedOtp);
						localStorage.setItem("token", verifiedOtp);
						dispatch(setOTP(verifiedOtp));
						dispatch(setToken(verifiedOtp));
					} else {
						dispatch(setUserID(res.data?.data?.userResponse?.id));
						dispatch(setPhone(phone!));
					}
				} catch (err) {
					throw err;
				}
			},
		}),
	}),
});
