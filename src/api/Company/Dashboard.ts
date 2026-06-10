import { ApiWithAuth } from "../../Stores/apis/api";

/* ------------------------------------------------------------------ */
/*  انواع پاسخ سرویس داشبورد شرکت: api/company/dashboard               */
/* ------------------------------------------------------------------ */

export interface CompanyDashboardCards {
  today_visits: number;
  approved_visits: number;
  in_progress_visits: number;
  cancelled_visits: number;
  active_fleet: number;
  active_drivers: number;
  total_drivers: number;
  month_income: number;
}

export interface CompanyDashboardTrend {
  month: string;
  year: number;
  month_number: number;
  cargo: number;
  passenger: number;
}

export interface CompanyDashboardStatus {
  code: number;
  title: string;
  color: string;
  total: number;
}

export interface CompanyDashboardRecentVisit {
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

export interface CompanyDashboardTopState {
  state_name: string;
  visits: number;
}

export interface CompanyDashboardData {
  cards: CompanyDashboardCards;
  visits_trend: CompanyDashboardTrend[];
  visits_status: CompanyDashboardStatus[];
  recent_visits: CompanyDashboardRecentVisit[];
}

export interface CompanyDashboardResponse {
  success: boolean;
  message: string;
  data: CompanyDashboardData;
}

export const { useGetCompanyDashboardQuery } = ApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyDashboard: builder.query<CompanyDashboardResponse, void>({
      query: () => ({
        url: "company/dashboard",
        method: "GET",
      }),
    }),
  }),
});
