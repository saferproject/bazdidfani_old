import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import DriverForm from "../../../pages/RoleAssignment/interfaces/driver-role-form.interface";
import { ApiWithAuth } from "../../../Stores/apis/api";
import { setRoles } from "../../../Stores/slices/user";

export const { useRegisterDriverMutation } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		registerDriver: builder.mutation<any, DriverForm>({
			query: (data) => ({
				url: "user/add-info-driver",
				method: "POST",
				data
			}),
			onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
				try {
					const res = await queryFulfilled;
					SweetAlertToast.fire({
						icon: "success",
						title: res.data.message,
					});
					const obj = res.data.data.user_role;
					dispatch(setRoles(obj));
				} catch (err) {
					throw err;
				}
			},
		}),
	}),
});
