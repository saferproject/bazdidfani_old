import { STORAGE_URL } from "../../Stores/api-urls";
import { ApiWithAuth, ApiWithoutAuth } from "../../Stores/apis/api";
import {
	clear,
	setCompanyUsage,
	setOTPSent,
	setPersonalData,
	setPhone,
	setProfileImage,
	setRoles,
	setToken,
	setTwoAuthentication,
} from "../../Stores/slices/user";
import { LoginDataOrChangePasswordType, NewPasswordDataType } from "../../types/AuthType";

type props = LoginDataOrChangePasswordType & NewPasswordDataType & { forgot: boolean };

const hasTwoAuthentication = (value: unknown) => value === true || value === 1 || value === "1" || value === "true";

export const { useLoginOrSendNewPasswordDataMutation } = ApiWithoutAuth.injectEndpoints({
	endpoints: (builder) => ({
		loginOrSendNewPasswordData: builder.mutation<any, props>({
			query: (data) => {
				if (!data.forgot) {
					return {
						url: "auth/login",
						data: {
							username: data.username,
							password: data.password,
						},
						method: "POST",
					};
				} else {
					return {
						url: "auth/forgot-password",
						data: {
							data: data.data,
							token: data.token,
							password: data.password,
							password_confirmation: data.password_confirmation,
						},
						method: "POST",
					};
				}
			},
			onQueryStarted: async ({ forgot }, { dispatch, queryFulfilled }) => {
				try {
					const res = await queryFulfilled;
					const requiresTwoAuthentication = hasTwoAuthentication(res.data?.data?.two_authentication);
					if (requiresTwoAuthentication) {
						dispatch(clear());
						dispatch(setOTPSent(new Date().toString()));
						dispatch(setPhone(res.data.data.user.username));
						dispatch(setTwoAuthentication(true));
						dispatch(
							setPersonalData({
								...res?.data?.data?.user?.personal,
								has_associations: res?.data?.data?.has_associations,
								phone: res?.data?.data?.user?.username,
							})
						);
						const profileImage = res?.data?.data?.user?.images.find((ele: any) => ele.image_type === "profile")?.url;
						dispatch(setProfileImage(profileImage ? `${STORAGE_URL}${profileImage}` : ""));
						const rawRoles = res?.data?.data?.user?.roles;
						const roles = rawRoles.map((item: any) => ({
							name: item?.role?.name,
							description: item?.role?.description,
						}));
						dispatch(setRoles(roles));
						dispatch(setCompanyUsage(res.data.data.company_usage));
					} else if (!forgot) {
						dispatch(setTwoAuthentication(false));
						dispatch(clear());
						dispatch(setToken(res?.data?.data?.token));
						dispatch(
							setPersonalData({
								...res?.data?.data?.user?.personal,
								has_associations: res?.data?.data?.has_associations,
								phone: res?.data?.data?.user?.username,
							})
						);
						const profileImage = res?.data?.data?.user?.images.find((ele: any) => ele.image_type === "profile")?.url;
						dispatch(setProfileImage(profileImage ? `${STORAGE_URL}${profileImage}` : ""));
						const rawRoles = res?.data?.data?.user?.roles;
						const roles = rawRoles.map((item: any) => ({
							name: item?.role?.name,
							description: item?.role?.description,
						}));
						dispatch(setRoles(roles));
						dispatch(setCompanyUsage(res.data.data.company_usage));
					} else dispatch(clear());
				} catch (err) {
					throw err;
				}
			},
		}),
	}),
});

export const { useVerifyTokenQuery } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		verifyToken: builder.query<any, void>({
			query: () => ({
				url: "verify_token",
				method: "GET",
			}),
			onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
				try {
					const res = await queryFulfilled;
					// dispatch(setToken(res?.data?.token));
					dispatch(
						setPersonalData({
							...res?.data?.user.personal,
						})
					);
					const profileImage = res?.data?.user?.images.find((ele: any) => ele.image_type === "profile")?.url;
					dispatch(setProfileImage(profileImage ? `${STORAGE_URL}${profileImage}` : ""));
					const rawRoles = res?.data?.user?.roles;
					const roles = rawRoles.map((item: any) => ({
						name: item?.role?.name,
						description: item?.role?.description,
					}));
					dispatch(setRoles(roles));
					// Only update companyUsage when the server provides a concrete value.
					// TMs typically have no user_company entry, so this would be undefined —
					// leaving the value that was correctly set at login time intact.
					const freshCompanyUsage = res?.data?.user?.user_company[0]?.company.company_usage;
					if (freshCompanyUsage !== undefined) dispatch(setCompanyUsage(freshCompanyUsage));
				} catch (err) {
					dispatch(clear());
					const currentPath = window.location.pathname;
					window.location.href = `/auth?next=${currentPath}`;
					throw err;
				}
			},
		}),
	}),
});
