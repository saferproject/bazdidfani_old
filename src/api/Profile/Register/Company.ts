import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import { ApiWithAuth } from "../../../Stores/apis/api";
import { setRoles } from "../../../Stores/slices/user";
import { RegisterCompanyType } from "../../../types/Register";

export const { useRegisterCompanyMutation } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		registerCompany: builder.mutation<any, RegisterCompanyType>({
			query: (data) => ({
				url: "user/add-info-company",
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
