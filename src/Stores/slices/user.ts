import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CompanyUsage from "../../pages/dashboard/admin/enums/company-usage.enum";

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
	company: Record<string, any>;
}

// مقدار اولیه
const initialState: UserState = {
	personal: localStorage.getItem("personal") ? JSON.parse(localStorage.getItem("personal")!) : null,
	profileImage: localStorage.getItem("profileImage"),
	roles: localStorage.getItem("roles") ? JSON.parse(localStorage.getItem("roles")!) : [],
	token: localStorage.getItem("token"),
	prevToken: localStorage.getItem("prev-token"),
	otp: localStorage.getItem("otp"),
	step: localStorage.getItem("step") ? (+localStorage.getItem("step")! as IStep) : null,
	OTPSent: localStorage.getItem("OTPSent"),
	phone: localStorage.getItem("phone"),
	userID: localStorage.getItem("userID"),
	activeMenuId: localStorage.getItem("activeMenuId"),
	userCompanyPersonal: localStorage.getItem("userCompanyPersonal") ? JSON.parse(localStorage.getItem("userCompanyPersonal")) : null,
	userCompanyRoles: localStorage.getItem("userCompanyRoles") ? JSON.parse(localStorage.getItem("userCompanyRoles")) : [],
	companyUsage: localStorage.getItem("companyUsage") ? (Number(localStorage.getItem("companyUsage")) as CompanyUsage) : null,
	twoAuthentication: localStorage.getItem("twoAuthentication") === "true",
	newTechnicalManagerData: {},
	company: {}
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setPersonalData: (state, action: PayloadAction<IPersonal>) => {
			localStorage.setItem("personal", JSON.stringify(action.payload));
			state.personal = action.payload;
		},
		setProfileImage: (state, action: PayloadAction<string>) => {
			state.profileImage = action.payload;
		},
		setRoles: (state, action: PayloadAction<IRole[]>) => {
			localStorage.setItem("roles", JSON.stringify(action.payload));
			state.roles = action.payload;
		},
		setToken: (state, action: PayloadAction<string>) => {
			localStorage.setItem("token", action.payload);
			state.token = action.payload;
		},
		setOTP: (state, action: PayloadAction<string>) => {
			localStorage.setItem("otp", action.payload);
			state.otp = action.payload;
		},
		removeToken: (state) => {
			localStorage.removeItem("token");
			state.token = null;
		},
		// ? ورود به‌جای کاربر دیگر: توکن مدیر فعلی در prev-token نگه داشته می‌شود و توکن کاربر هدف جایگزین token می‌گردد
		loginAs: (state, action: PayloadAction<{ prevToken: string; token: string }>) => {
			localStorage.setItem("prev-token", action.payload.prevToken);
			state.prevToken = action.payload.prevToken;
			localStorage.setItem("token", action.payload.token);
			state.token = action.payload.token;
		},
		// ? بازگشت به حساب مدیر در صورت وجود prev-token (هنگام خروج از حساب کاربری جعل‌شده)
		restorePrevToken: (state) => {
			if (state.prevToken) {
				localStorage.setItem("token", state.prevToken);
				state.token = state.prevToken;
				localStorage.removeItem("prev-token");
				state.prevToken = null;
				state.companyUsage = null;
				localStorage.setItem("companyUsage", null);
			}
		},
		removeOtp: (state) => {
			localStorage.removeItem("otp");
			state.otp = null;
		},
		setStep: (state, action: PayloadAction<IStep>) => {
			localStorage.setItem("step", String(action.payload));
			state.step = action.payload;
		},
		removeStep: (state) => {
			localStorage.removeItem("step");
			state.step = null;
		},
		setOTPSent: (state, action: PayloadAction<string>) => {
			localStorage.setItem("OTPSent", action.payload?.toString());
			state.OTPSent = action.payload;
		},
		setTwoAuthentication: (state, action: PayloadAction<boolean>) => {
			localStorage.setItem("twoAuthentication", action.payload?.toString());
			state.twoAuthentication = action.payload;
		},
		removeOTPSent: (state) => {
			localStorage.removeItem("OTPSent");
			state.OTPSent = null;
		},
		setPhone: (state, action: PayloadAction<string>) => {
			localStorage.setItem("phone", action.payload);
			state.phone = action.payload;
		},
		removePhone: (state) => {
			localStorage.removeItem("phone");
			state.phone = null;
		},
		setUserID: (state, action: PayloadAction<string>) => {
			localStorage.setItem("userID", action.payload);
			state.userID = action.payload;
		},
		setActiveMenuId: (state, action: PayloadAction<string>) => {
			localStorage.setItem("activeMenuId", action.payload);
			state.activeMenuId = action.payload;
		},
		setUserCompanyPersonal: (state, action: PayloadAction<IPersonal>) => {
			state.userCompanyPersonal = action.payload;
			localStorage.setItem("userCompanyPersonal", JSON.stringify(action.payload));
		},
		removeUserCompanyPersonal: (state) => {
			(state.userCompanyPersonal = null), localStorage.removeItem("userCompanyPersonal");
		},
		setUserCompanyRoles: (state, action: PayloadAction<IRole[]>) => {
			state.userCompanyRoles = action.payload;
			localStorage.setItem("userCompanyRoles", JSON.stringify(action.payload));
		},
		removeUserCompanyRoles: (state) => {
			(state.userCompanyRoles = []), localStorage.removeItem("userCompanyRoles");
		},
		setCompanyUsage: (state, action: PayloadAction<CompanyUsage>) => {
			state.companyUsage = action.payload;
			if (action.payload != null) localStorage.setItem("companyUsage", String(action.payload));
			else localStorage.removeItem("companyUsage");
		},
		setNewTechnicalManagetData: (state, action) => {
			state.newTechnicalManagerData = action.payload;
		},
		setCompany: (state, action) => {
			state.company = action.payload;
		},
		clear: (state) => {
			localStorage.clear(); // also removes companyUsage
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
			state.company = {};
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
