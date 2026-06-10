import { ApiWithAuth } from "../../Stores/apis/api";

interface LoginAsResponse {
  status: boolean;
  message: string;
  data: {
    // توکن کاربر هدف که توسط بک‌اند تولید می‌شود
    token: string;
  };
}

/**
 * ورود به‌جای کاربر (login-as) — فقط برای مدیریت.
 * قرارداد با بک‌اند: POST admin/login-as/{userId}
 * پاسخ مورد انتظار: { status, message, data: { token } }
 */
export const { useLoginAsMutation } = ApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    loginAs: builder.mutation<LoginAsResponse, { userId: number }>({
      query: ({ userId }) => ({
        url: `admin/users/login-as/${userId}`,
        method: "POST",
      }),
    }),
  }),
});
