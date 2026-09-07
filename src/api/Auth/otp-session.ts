import {
  setOTP,
  setPhone,
  setToken,
  setUserID,
} from "../../Stores/slices/user";
import type { UnknownAction } from "@reduxjs/toolkit";

/** Keep registration and company-user verification on the same storage path. */
export function completeOtpSession(
  dispatch: (action: UnknownAction) => unknown,
  {
    forgot,
    token,
    phone,
    userId,
  }: {
    forgot: boolean;
    token: string;
    phone: string | null;
    userId?: string | number;
  },
): void {
  if (forgot) {
    // The existing password-reset flow uses this verified OTP in both keys.
    const verifiedOtp = String(token);
    dispatch(setOTP(verifiedOtp));
    dispatch(setToken(verifiedOtp));
  } else {
    if (userId != null) dispatch(setUserID(String(userId)));
    if (phone) dispatch(setPhone(phone));
  }
}
