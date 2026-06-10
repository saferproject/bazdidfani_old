import { ApiWithAuth } from "../../Stores/apis/api";

export const { useSendOTPWithoutCheckMutation } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		sendOTPWithoutCheck: builder.mutation<any, { phone: string }>({
			query: (data) => ({
				url: "auth/otp/send",
				method: "POST",
				data,
			}),
		}),
	}),
});

