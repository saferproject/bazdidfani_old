import type { UnknownAction } from "@reduxjs/toolkit";
import { setOTP, setPhone, setToken, setUserID } from "../../Stores/slices/user";

/** Keep registration and company-user verification on the same storage path. */
export function completeOtpSession(
  dispatch: (action: UnknownAction) => unknown,
  { forgot, token, phone, userId }: {
    forgot: boolean;
    token: string;
    phone: string | null;
    userId: string;
  },
): void {
  if (forgot) {
    // The existing password-reset flow uses this verified OTP in both keys.
    const verifiedOtp = String(token);
    dispatch(setOTP(verifiedOtp));
    dispatch(setToken(verifiedOtp));
  } else {
    dispatch(setUserID(userId));
    dispatch(setPhone(phone));
  }
}
