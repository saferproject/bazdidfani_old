import { ApiWithAuth } from "../../Stores/apis/api";
import { OTPValidatePhoneType } from "../../types/OTPType";
import { ProfileDataType } from "../../types/ProfileType";

export const {
  useGetProfileQuery,
  useEditProfileMutation,
  useChangePasswordMutation,
  useAddPermissionMutation,
  useGetPermissionListQuery,
  useAllPermissionsQuery,
  useProfileApiMutation,
  useEditPhoneNumberMutation,
  useCheckOTPForCompanyUserMutation
} = ApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint برای دریافت پروفایل
    getProfile: builder.query<any, void>({
      query: () => ({
        url: "user/profile/show",
        method: "GET",
      }),
      providesTags: ["Profile"], // کش کردن داده‌ها
    }),
    profileApi: builder.mutation<any, FormData>({
      query: (data) => ({
        url: "auth/profile",
        method: "POST",
        data,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          // dispatch(clear())
        } catch (err) {
          throw err;
        }
      },
    }),

    // Endpoint برای ویرایش پروفایل
    editProfile: builder.mutation<any, FormData>({
      query: (data) => ({
        url: "user/profile/update",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Profile"], // پس از ویرایش، کش بی‌اعتبار می‌شود
    }),

    editPhoneNumber: builder.mutation<
      any,
      { new_phone_number: string; token: string }
    >({
      query: (data) => ({
        url: "user/profile/change-phone-number",
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // Endpoint برای تغییر پسورد
    changePassword: builder.mutation<
      any,
      {
        current_password: string;
        password: ProfileDataType["password"];
        password_confirmation: ProfileDataType["password_confirmation"];
      }
    >({
      query: (data) => ({
        url: "user/profile/change-password",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // Endpoint برای اضافه کردن پرمیشن به کاربر
    addPermission: builder.mutation<
      any,
      { permissions: number[]; user_id: number | string }
    >({
      query: ({ permissions, user_id }) => ({
        url: `company/user/add-permission/${user_id}`,
        method: "POST",
        data: { permissions },
      }),
      invalidatesTags: ["Permissions"], // کش بی‌اعتبار می‌شود
    }),

    // Endpoint برای دریافت لیست پرمیشن‌ها
    getPermissionList: builder.query<any, void>({
      query: () => ({
        url: "user/role-permissions/permissions",
        method: "GET",
      }),
      providesTags: ["Permissions"], // کش کردن داده‌ها
    }),

    // Endpoint برای دریافت تمامی پرمیشن‌ها
    allPermissions: builder.query<any, void>({
      query: () => ({
        url: "user/role-permissions/all-permissions",
        method: "GET",
      }),
      providesTags: ["Permissions"], // کش کردن داده‌ها
    }),

    checkOTPForCompanyUser: builder.mutation<any, OTPValidatePhoneType & { forgot: boolean }>(
      {
        query: ({ forgot, ...data }) => ({
          url: "auth/otp-check-add-user",
          method: "POST",
          data,
        }),
        onQueryStarted: async (
          { forgot, token },
          { queryFulfilled, dispatch, getState },
        ) => {
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
      },
    ),
  }),
});
