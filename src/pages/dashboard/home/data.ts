import { AdminDashboardData } from "../../../api/Admin/Dashboard";
import { TmDashboardData } from "../../../api/TechnicalManager/Dashboard";
import { ToPersianNumber } from "../../../components/shared/Functions/ChangeNumLang";

/* ------------------------------------------------------------------ */
/*  تبدیل پاسخ سرویس api/admin/dashboard به مدل‌های نمایشی داشبورد      */
/* ------------------------------------------------------------------ */

export const formatNumber = (value: number): string =>
  ToPersianNumber(
    Math.round(value ?? 0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  );

/* ---------- کارت‌های KPI ---------- */
export interface KpiCard {
  key: string;
  title: string;
  value: number;
  suffix?: string;
  trend?: number; // درصد تغییر نسبت به ماه قبل (در صورت وجود)
  color: string;
  soft: string;
}

/* ---------- خلاصه فعالیت امروز (سربرگ) ---------- */
export interface TodayItem {
  label: string;
  value: number;
}

/* ---------- روند بازدیدها ---------- */
export interface MonthlyPoint {
  month: string;
  freight: number; // باری
  passenger: number; // مسافری
}

/* ---------- وضعیت بازدیدها (دونات) ---------- */
export interface StatusSlice {
  label: string;
  value: number;
  color: string;
}

/* ---------- برترین مدیران فنی ---------- */
export interface ManagerRow {
  name: string;
  company: string;
  count: number;
  rate?: number;
}

/* ---------- آخرین بازدیدها ---------- */
export interface RecentRow {
  id: string;
  plate: number[] | string[];
  driver: string;
  type: string;
  status: string;
  statusColor: string;
  time: string;
}

/* ---------- استان‌های برتر ---------- */
export interface ProvinceRow {
  name: string;
  count: number;
}

/* ---------- مدل نهایی داشبورد ---------- */
export interface DashboardModel {
  kpis: KpiCard[];
  today: TodayItem[];
  monthlyInspections: MonthlyPoint[];
  inspectionStatus: StatusSlice[];
  topManagers: ManagerRow[];
  recentInspections: RecentRow[];
  topProvinces: ProvinceRow[];
}

/** رنگ‌های نامعتبر/نامرئی روی پس‌زمینه‌ی سفید را با یک رنگ خنثا جایگزین می‌کند. */
const safeColor = (color: string, fallback = "#94a3b8"): string => {
  if (!color) return fallback;
  const c = color.trim().toLowerCase();
  if (c === "#fff" || c === "#ffffff" || c === "white") return fallback;
  // رنگ‌های دارای آلفا (۸ یا ۴ رقمی) ممکن است بسیار کم‌رنگ باشند
  if (/^#([0-9a-f]{4}|[0-9a-f]{8})$/i.test(c)) {
    return c.slice(0, c.length === 5 ? 4 : 7);
  }
  return color;
};

/** تبدیل کامل پاسخ API به مدل قابل‌استفاده توسط کامپوننت‌ها. */
export const mapDashboard = (d: AdminDashboardData): DashboardModel => {
  const cards = d.cards;

  // محاسبه‌ی درصد تغییر بازدید ماه نسبت به ماه قبل از روی روند
  const trend = d.visits_trend ?? [];
  const last = trend[trend.length - 1];
  const prev = trend[trend.length - 2];
  let monthTrend: number | undefined;
  if (last && prev) {
    const lastTotal = last.cargo + last.passenger;
    const prevTotal = prev.cargo + prev.passenger;
    if (prevTotal > 0) monthTrend = ((lastTotal - prevTotal) / prevTotal) * 100;
    else if (lastTotal > 0) monthTrend = 100;
    else monthTrend = 0;
  }

  const kpis: KpiCard[] = [
    {
      key: "month_visits",
      title: "بازدید این ماه",
      value: cards.month_visits,
      trend: monthTrend,
      color: "#00be77",
      soft: "#e6faf2",
    },
    {
      key: "active_fleet",
      title: "ناوگان فعال",
      value: cards.active_fleet,
      color: "#7474C1",
      soft: "#ecedf8",
    },
    {
      key: "technical_managers",
      title: "مدیران فنی",
      value: cards.technical_managers,
      color: "#f59e0b",
      soft: "#fef3e2",
    },
    {
      key: "month_income",
      title: "درآمد ماه",
      value: cards.month_income,
      suffix: "تومان",
      color: "#3b82f6",
      soft: "#e8f1fe",
    },
  ];

  const today: TodayItem[] = [
    { label: "بازدید امروز", value: cards.today_visits },
    { label: "شرکت فعال", value: cards.active_companies },
    { label: "راننده جدید", value: cards.today_drivers },
    { label: "در انتظار بررسی", value: cards.in_review_visits },
  ];

  const monthlyInspections: MonthlyPoint[] = trend.map((t) => ({
    month: t.month.split(" ")[0], // حذف سال از برچسب ماه
    freight: t.cargo,
    passenger: t.passenger,
  }));

  // فقط وضعیت‌های دارای مقدار در دونات نمایش داده می‌شوند
  const inspectionStatus: StatusSlice[] = (d.visits_status ?? [])
    .filter((s) => s.total > 0)
    .map((s) => ({
      label: s.title,
      value: s.total,
      color: safeColor(s.color),
    }));

  // نگاشت کد وضعیت به رنگ برای استفاده در جدول آخرین بازدیدها
  const statusColorMap = new Map<number, string>(
    (d.visits_status ?? []).map((s) => [s.code, safeColor(s.color)]),
  );

  const topManagers: ManagerRow[] = (d.top_technical_managers ?? []).map(
    (m) => ({
      name: m.technical_manager_name,
      company: m.company_name,
      count: m.visits,
    }),
  );

  const recentInspections: RecentRow[] = (d.recent_visits ?? []).map((v) => ({
    id: v.sabaf_code || "—",
    plate: v.plate,
    driver: v.driver_name || "—",
    type: v.type_title,
    status: v.status_title,
    statusColor: statusColorMap.get(v.status) ?? "#94a3b8",
    time: v.created_at_jalali,
  }));

  const topProvinces: ProvinceRow[] = (d.top_states ?? []).map((s) => ({
    name: s.state_name,
    count: s.visits,
  }));

  return {
    kpis,
    today,
    monthlyInspections,
    inspectionStatus,
    topManagers,
    recentInspections,
    topProvinces,
  };
};

/* ------------------------------------------------------------------ */
/*  داشبورد مدیر فنی: api/technical-manager/dashboard                  */
/* ------------------------------------------------------------------ */

export interface TechnicalManagerModel {
  kpis: KpiCard[];
  today: TodayItem[];
  monthlyInspections: MonthlyPoint[];
  inspectionStatus: StatusSlice[];
  recentInspections: RecentRow[];
  topCompanies: ProvinceRow[];
}

/** تبدیل پاسخ سرویس داشبورد مدیر فنی به مدل نمایشی. */
export const mapTechnicalManagerDashboard = (
  d: TmDashboardData,
): TechnicalManagerModel => {
  const cards = d.cards;
  const trend = d.visits_trend ?? [];

  const kpis: KpiCard[] = [
    {
      key: "month_visits",
      title: "بازدید این ماه",
      value: cards.month_visits,
      color: "#00be77",
      soft: "#e6faf2",
    },
    {
      key: "active_companies",
      title: "شرکت‌های فعال",
      value: cards.active_companies,
      color: "#7474C1",
      soft: "#ecedf8",
    },
    {
      key: "approved_percentage_month",
      title: "نرخ تأیید ماه",
      value: cards.approved_percentage_month,
      suffix: "٪",
      color: "#f59e0b",
      soft: "#fef3e2",
    },
  ];

  const today: TodayItem[] = [
    { label: "بازدید امروز", value: cards.today_visits },
    { label: "تأیید‌شده", value: cards.approved_visits },
    { label: "در حال انجام", value: cards.in_progress_visits },
    { label: "ابطال‌شده", value: cards.cancelled_visits },
  ];

  const monthlyInspections: MonthlyPoint[] = trend.map((t) => ({
    month: t.month.split(" ")[0],
    freight: t.cargo,
    passenger: t.passenger,
  }));

  const inspectionStatus: StatusSlice[] = (d.visits_status ?? [])
    .filter((s) => s.total > 0)
    .map((s) => ({
      label: s.title,
      value: s.total,
      color: safeColor(s.color),
    }));

  const statusColorMap = new Map<number, string>(
    (d.visits_status ?? []).map((s) => [s.code, safeColor(s.color)]),
  );

  const recentInspections: RecentRow[] = (d.recent_visits ?? []).map((v) => ({
    id: v.sabaf_code || "—",
    plate: v.plate,
    driver: v.driver_name || "—",
    type: v.type_title,
    status: v.status_title,
    statusColor: statusColorMap.get(v.status) ?? "#94a3b8",
    time: v.created_at_jalali,
  }));

  const topCompanies: ProvinceRow[] = (d.top_companies ?? []).map((c) => ({
    name: c.company_name,
    count: c.visits,
  }));

  return {
    kpis,
    today,
    monthlyInspections,
    inspectionStatus,
    recentInspections,
    topCompanies,
  };
};
