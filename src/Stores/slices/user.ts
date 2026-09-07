import CompanyUsage from "../../pages/dashboard/admin/enums/company-usage.enum";
import { ActiveCompany } from "../../types/CompanyContext";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  readLocalStorage,
  readLocalStorageJson,
  removeLocalStorage,
  writeLocalStorage,
} from "../utilities/local-storage";

export interface IRole {
  name: string;
  description: string;
}

export interface IPersonal {
  id: number;
  full_name: string;
  email: string;
  national_code: string;
  user_id: number;
  post: string;
  phone: string;
  father_name: string;
  address: string;
  telephone: number;
  birthdate: Date;
  city_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  cities: {
    uuid: number;
    name: string;
    code: number;
    province_id: number;
    city_org: number;
    created_at: Date;
    updated_at: Date;
  };
  has_associations: boolean;
}

type IStep = 0 | 1 | 2;

interface UserState {
  personal: IPersonal | null;
  roles: IRole[];
  profileImage: string | null;
  token: string | null;
  prevToken: string | null;
  otp: string | null;
  step: IStep | null;
  OTPSent: string | null;
  phone: string | null;
  userID: string | null;
  activeMenuId: string | null;
  userCompanyPersonal: IPersonal | null;
  userCompanyRoles: IRole[];
  companyUsage: CompanyUsage;
  twoAuthentication: boolean;
  newTechnicalManagerData: Record<string, any>;
  company: ActiveCompany | null;
}

// مقدار اولیه
const SESSION_STORAGE_KEYS = [
  "personal", "profileImage", "roles", "token", "prev-token", "otp", "step",
  "OTPSent", "phone", "userID", "activeMenuId", "userCompanyPersonal",
  "userCompanyRoles", "companyUsage", "twoAuthentication",
] as const;

const isRecord = (value: unknown): boolean =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readStep = (): IStep | null => {
  const step = readLocalStorage("step");
  return step === "0" || step === "1" || step === "2" ? Number(step) as IStep : null;
};

const readCompanyUsage = (): CompanyUsage | null => {
  const value = readLocalStorage("companyUsage");
  return value === "1" || value === "2" || value === "3" ? Number(value) as CompanyUsage : null;
};

// Lazy hydration avoids browser access during imports and tolerates damaged data.
const createInitialState = (): UserState => ({
  personal: readLocalStorageJson<IPersonal | null>("personal", null, isRecord),
  profileImage: readLocalStorage("profileImage"),
  roles: readLocalStorageJson<IRole[]>("roles", [], Array.isArray),
  token: readLocalStorage("token"),
  prevToken: readLocalStorage("prev-token"),
  otp: readLocalStorage("otp"),
  step: readStep(),
  OTPSent: readLocalStorage("OTPSent"),
  phone: readLocalStorage("phone"),
  userID: readLocalStorage("userID"),
  activeMenuId: readLocalStorage("activeMenuId"),
  userCompanyPersonal: readLocalStorageJson<IPersonal | null>("userCompanyPersonal", null, isRecord),
  userCompanyRoles: readLocalStorageJson<IRole[]>("userCompanyRoles", [], Array.isArray),
  companyUsage: readCompanyUsage(),
  twoAuthentication: readLocalStorage("twoAuthentication") === "true",
  newTechnicalManagerData: {},
  company: null,
});

export const userSlice = createSlice({
  name: "user",
  initialState: createInitialState,
  reducers: {
    setPersonalData: (state, action: PayloadAction<IPersonal>) => {
      writeLocalStorage("personal", JSON.stringify(action.payload));
      state.personal = action.payload;
    },
    setProfileImage: (state, action: PayloadAction<string>) => {
      state.profileImage = action.payload;
    },
    setRoles: (state, action: PayloadAction<IRole[]>) => {
      writeLocalStorage("roles", JSON.stringify(action.payload));
      state.roles = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      writeLocalStorage("token", action.payload);
      state.token = action.payload;
    },
    setOTP: (state, action: PayloadAction<string>) => {
      writeLocalStorage("otp", action.payload);
      state.otp = action.payload;
    },
    removeToken: (state) => {
      removeLocalStorage("token");
      state.token = null;
    },
    // ? ورود به‌جای کاربر دیگر: توکن مدیر فعلی در prev-token نگه داشته می‌شود و توکن کاربر هدف جایگزین token می‌گردد
    loginAs: (
      state,
      action: PayloadAction<{ prevToken: string; token: string }>,
    ) => {
      writeLocalStorage("prev-token", action.payload.prevToken);
      state.prevToken = action.payload.prevToken;
      writeLocalStorage("token", action.payload.token);
      state.token = action.payload.token;
      state.company = null;
    },
    // ? بازگشت به حساب مدیر در صورت وجود prev-token (هنگام خروج از حساب کاربری جعل‌شده)
    restorePrevToken: (state) => {
      if (state.prevToken) {
        writeLocalStorage("token", state.prevToken);
        state.token = state.prevToken;
        removeLocalStorage("prev-token");
        state.prevToken = null;
        state.companyUsage = null;
        state.company = null;
        removeLocalStorage("companyUsage");
      }
    },
    removeOtp: (state) => {
      removeLocalStorage("otp");
      state.otp = null;
    },
    setStep: (state, action: PayloadAction<IStep>) => {
      writeLocalStorage("step", String(action.payload));
      state.step = action.payload;
    },
    removeStep: (state) => {
      removeLocalStorage("step");
      state.step = null;
    },
    setOTPSent: (state, action: PayloadAction<string>) => {
      writeLocalStorage("OTPSent", action.payload?.toString());
      state.OTPSent = action.payload;
    },
    setTwoAuthentication: (state, action: PayloadAction<boolean>) => {
      writeLocalStorage("twoAuthentication", action.payload?.toString());
      state.twoAuthentication = action.payload;
    },
    removeOTPSent: (state) => {
      removeLocalStorage("OTPSent");
      state.OTPSent = null;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      writeLocalStorage("phone", action.payload);
      state.phone = action.payload;
    },
    removePhone: (state) => {
      removeLocalStorage("phone");
      state.phone = null;
    },
    setUserID: (state, action: PayloadAction<string>) => {
      writeLocalStorage("userID", action.payload);
      state.userID = action.payload;
    },
    setActiveMenuId: (state, action: PayloadAction<string>) => {
      writeLocalStorage("activeMenuId", action.payload);
      state.activeMenuId = action.payload;
    },
    setUserCompanyPersonal: (state, action: PayloadAction<IPersonal>) => {
      state.userCompanyPersonal = action.payload;
      writeLocalStorage(
        "userCompanyPersonal",
        JSON.stringify(action.payload),
      );
    },
    removeUserCompanyPersonal: (state) => {
      ((state.userCompanyPersonal = null),
        removeLocalStorage("userCompanyPersonal"));
    },
    setUserCompanyRoles: (state, action: PayloadAction<IRole[]>) => {
      state.userCompanyRoles = action.payload;
      writeLocalStorage("userCompanyRoles", JSON.stringify(action.payload));
    },
    removeUserCompanyRoles: (state) => {
      ((state.userCompanyRoles = []),
        removeLocalStorage("userCompanyRoles"));
    },
    setCompanyUsage: (state, action: PayloadAction<CompanyUsage>) => {
      state.companyUsage = action.payload;
      if (action.payload != null)
        writeLocalStorage("companyUsage", String(action.payload));
      else removeLocalStorage("companyUsage");
    },
    setNewTechnicalManagetData: (state, action) => {
      state.newTechnicalManagerData = action.payload;
    },
    setCompany: (state, action: PayloadAction<ActiveCompany | null>) => {
      state.company = action.payload;
    },
    clear: (state) => {
      SESSION_STORAGE_KEYS.forEach(removeLocalStorage);
      state.companyUsage = null;
      state.personal = null;
      state.profileImage = null;
      state.roles = [];
      state.token = null;
      state.prevToken = null;
      state.otp = null;
      state.step = null;
      state.OTPSent = null;
      state.phone = null;
      state.userID = null;
      state.activeMenuId = null;
      state.userCompanyPersonal = null;
      state.userCompanyRoles = [];
      state.twoAuthentication = false;
      state.newTechnicalManagerData = {};
      state.company = null;
    },
  },
});

// خروجی گرفتن از اکشن‌ها و ردیوسر
export const {
  setPersonalData,
  setProfileImage,
  setRoles,
  setToken,
  setOTP,
  removeOtp,
  removeToken,
  loginAs,
  restorePrevToken,
  setStep,
  removeStep,
  setOTPSent,
  removeOTPSent,
  setPhone,
  removePhone,
  setUserID,
  setActiveMenuId,
  removeUserCompanyPersonal,
  removeUserCompanyRoles,
  setUserCompanyPersonal,
  setUserCompanyRoles,
  setCompanyUsage,
  setTwoAuthentication,
  setNewTechnicalManagetData,
  setCompany,
  clear,
} = userSlice.actions;

export default userSlice.reducer;
