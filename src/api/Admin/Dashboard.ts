import { ApiWithAuth } from "../../Stores/apis/api";

/* ------------------------------------------------------------------ */
/*  انواع پاسخ سرویس داشبورد ادمین: api/admin/dashboard               */
/* ------------------------------------------------------------------ */

export interface AdminDashboardCards {
  today_visits: number;
  active_companies: number;
  today_drivers: number;
  in_review_visits: number;
  month_visits: number;
  active_fleet: number;
  technical_managers: number;
  month_income: number;
}

export interface AdminDashboardTrend {
  month: string;
  year: number;
  month_number: number;
  cargo: number;
  passenger: number;
}

export interface AdminDashboardStatus {
  code: number;
  title: string;
  color: string;
  total: number;
}

export interface AdminDashboardRecentVisit {
  id: number;
  sabaf_code: string | null;
  plate: string[] | number[];
  driver_name: string | null;
  type: number;
  type_title: string;
  status: number;
  status_title: string;
  created_at: string;
  created_at_jalali: string;
}

export interface AdminDashboardTopManager {
  company_name: string;
  technical_manager_name: string;
  visits: number;
}

export interface AdminDashboardTopState {
  state_name: string;
  visits: number;
}

export interface AdminDashboardData {
  cards: AdminDashboardCards;
  visits_trend: AdminDashboardTrend[];
  visits_status: AdminDashboardStatus[];
  recent_visits: AdminDashboardRecentVisit[];
  top_technical_managers: AdminDashboardTopManager[];
  top_states: AdminDashboardTopState[];
  generated_at: string;
}

export interface AdminDashboardResponse {
  success: boolean;
  message: string;
  data: AdminDashboardData;
}

export const { useGetAdminDashboardQuery } = ApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<AdminDashboardResponse, void>({
      query: () => ({
        url: "admin/dashboard",
        method: "GET",
      }),
    }),
  }),
});
