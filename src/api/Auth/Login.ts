import { STORAGE_URL } from "../../Stores/api-urls";
import { ApiWithAuth, ApiWithoutAuth } from "../../Stores/apis/api";
import {
  clear,
  setCompany,
  setCompanyUsage,
  setOTPSent,
  setPersonalData,
  setPhone,
  setProfileImage,
  setRoles,
  setToken,
  setTwoAuthentication,
  setUserID,
} from "../../Stores/slices/user";
import type { RootState } from "../../Stores/store";
import {
  LoginDataOrChangePasswordType,
  NewPasswordDataType,
} from "../../types/AuthType";
import getActiveCompany from "../../utilities/get-active-company";
import { getSessionProfile } from "./session-profile";

type props = LoginDataOrChangePasswordType &
  NewPasswordDataType & { forgot: boolean };

const hasTwoAuthentication = (value: unknown) =>
  value === true || value === 1 || value === "1" || value === "true";

export const { useLoginOrSendNewPasswordDataMutation } =
  ApiWithoutAuth.injectEndpoints({
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
            const requiresTwoAuthentication = hasTwoAuthentication(
              res.data?.data?.two_authentication,
            );
            if (requiresTwoAuthentication) {
              dispatch(clear());
              dispatch(setCompany(getActiveCompany(res.data)));
              dispatch(setOTPSent(new Date().toString()));
              dispatch(setPhone(res.data.data.user.username));
              dispatch(setUserID(String(res.data.data.user.id)));
              dispatch(setTwoAuthentication(true));
              dispatch(
                setPersonalData({
                  ...res?.data?.data?.user?.personal,
                  has_associations: res?.data?.data?.has_associations,
                  phone: res?.data?.data?.user?.username,
                }),
              );
              const { profileImage, roles } = getSessionProfile(
                res.data?.data?.user,
                STORAGE_URL,
              );
              dispatch(setProfileImage(profileImage));
              dispatch(setRoles(roles));
              dispatch(setCompanyUsage(res.data.data.company_usage));
            } else if (!forgot) {
              dispatch(setTwoAuthentication(false));
              dispatch(clear());
              dispatch(setCompany(getActiveCompany(res.data)));
              dispatch(setToken(res?.data?.data?.token));
              dispatch(setPhone(res.data.data.user.username));
              dispatch(setUserID(String(res.data.data.user.id)));
              dispatch(
                setPersonalData({
                  ...res?.data?.data?.user?.personal,
                  has_associations: res?.data?.data?.has_associations,
                  phone: res?.data?.data?.user?.username,
                }),
              );
              const { profileImage, roles } = getSessionProfile(
                res.data?.data?.user,
                STORAGE_URL,
              );
              dispatch(setProfileImage(profileImage));
              dispatch(setRoles(roles));
              dispatch(setCompanyUsage(res.data.data.company_usage));
            } else dispatch(clear());
          } catch {
            // Request failures remain available on the mutation result.
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
      onQueryStarted: async (_, { dispatch, queryFulfilled, getState }) => {
        const requestToken = (getState() as RootState).user.token;
        try {
          const res = await queryFulfilled;
          // A verification started before login-as must not hydrate the new user.
          if ((getState() as RootState).user.token !== requestToken) return;
          if (!res.data?.user) return;
          dispatch(setCompany(getActiveCompany(res.data)));
          // dispatch(setToken(res?.data?.token));
          dispatch(
            setPersonalData({
              ...res?.data?.user.personal,
            }),
          );
          const { profileImage, roles } = getSessionProfile(
            res.data.user,
            STORAGE_URL,
          );
          dispatch(setProfileImage(profileImage));
          dispatch(setRoles(roles));
          // Only update companyUsage when the server provides a concrete value.
          // TMs typically have no user_company entry, so this would be undefined —
          // leaving the value that was correctly set at login time intact.
          const freshCompanyUsage =
            res?.data?.user?.user_company?.[0]?.company?.company_usage;
          if (freshCompanyUsage !== undefined)
            dispatch(setCompanyUsage(freshCompanyUsage));
        } catch {
          // The transport owns 401 expiry. Offline/5xx failures keep the session
          // so retrying verification does not require another login.
        }
      },
    }),
  }),
});
