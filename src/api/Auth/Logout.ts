import { ApiWithAuth } from "../../Stores/apis/api";

export const { useLogoutMutation } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		logout: builder.mutation<any, void>({
			query: () => ({
				url: "auth/logout",
				method: "POST",
			}),
		}),
	}),
});
