import { ApiWithAuth } from "../../Stores/apis/api";

/* ------------------------------------------------------------------ */
/*  انواع پاسخ سرویس داشبورد مدیر فنی: api/technical-manager/dashboard */
/* ------------------------------------------------------------------ */

export interface TmDashboardCards {
  today_visits: number;
  approved_visits: number;
  in_progress_visits: number;
  cancelled_visits: number;
  month_visits: number;
  active_companies: number;
  approved_percentage_month: number;
}

export interface TmDashboardTrend {
  month: string;
  year: number;
  month_number: number;
  cargo: number;
  passenger: number;
}

export interface TmDashboardStatus {
  code: number;
  title: string;
  color: string;
  total: number;
}

export interface TmDashboardRecentVisit {
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

export interface TmDashboardTopCompany {
  company_name: string;
  visits: number;
}

export interface TmDashboardData {
  cards: TmDashboardCards;
  visits_trend: TmDashboardTrend[];
  visits_status: TmDashboardStatus[];
  recent_visits: TmDashboardRecentVisit[];
  top_companies: TmDashboardTopCompany[];
  generated_at: string;
}

export interface TmDashboardResponse {
  success: boolean;
  message: string;
  data: TmDashboardData;
}

export const { useGetTechnicalManagerDashboardQuery } =
  ApiWithAuth.injectEndpoints({
    endpoints: (builder) => ({
      getTechnicalManagerDashboard: builder.query<TmDashboardResponse, void>({
        query: () => ({
          url: "technical-manager/dashboard",
          method: "GET",
        }),
      }),
    }),
  });
