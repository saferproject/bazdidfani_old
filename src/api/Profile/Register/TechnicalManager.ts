import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import { ApiWithAuth } from "../../../Stores/apis/api";
import { setRoles } from "../../../Stores/slices/user";

export const { useRegisterTechnicalManagerMutation } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		registerTechnicalManager: builder.mutation<any, FormData>({
			query: (data) => ({
				url: "user/add-info-technical-manager",
				method: "POST",
				data,
			}),
			onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
				try {
					const res = await queryFulfilled;
					SweetAlertToast.fire({
						icon: "success",
						title: res.data.message,
					});
					const roles = res.data.data.user.roles.map((ele: any) => ele.role);
					dispatch(setRoles(roles));
				} catch (err) {
					throw err;
				}
			},
		}),
	}),
});
