import { Bus, TruckFast } from "iconsax-reactjs";
import {
  CompanyDashboardResponse,
  useGetCompanyDashboardQuery,
} from "../../../api/Company/Dashboard";
import Plate from "../../../components/shared/DataGrid/Plate";
import { UndefinedToEmptyString } from "../../../utilities/Helper";
import InspectionsAreaChart from "./components/InspectionsAreaChart";
import { DashboardHeader, SectionCard } from "./components/Shared";
import StatCard from "./components/StatCard";
import StatusDonut from "./components/StatusDonut";
import { formatNumber, KpiCard, MonthlyPoint, StatusSlice } from "./data";
import { Button, CircularProgress, Divider } from "@mui/material";
import { ReactNode } from "react";
import {
  // TbArrowDownLeft,
  // TbArrowUpRight,
  TbCalendarStats,
  TbCircleCheck,
  TbClock,
  TbFileText,
  TbSteeringWheel,
  TbTruck,
  TbUsers,
  // TbWallet,
} from "react-icons/tb";
import { useSelector } from "react-redux";
import useHavePermission from "../../../components/shared/Functions/CostumeHooks/CheckPermissions";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../Stores/store";
import CompanyUsage from "../admin/enums/company-usage.enum";

// const walletTransactions: WalletTx[] = [
//   { title: "شارژ کیف پول", amount: 5_000_000, type: "in", time: "۱۴۰۵/۰۳/۱۹" },
//   {
//     title: "هزینه بازدید فنی",
//     amount: 850_000,
//     type: "out",
//     time: "۱۴۰۵/۰۳/۱۸",
//   },
//   {
//     title: "هزینه بازدید فنی",
//     amount: 850_000,
//     type: "out",
//     time: "۱۴۰۵/۰۳/۱۷",
//   },
//   { title: "شارژ کیف پول", amount: 3_000_000, type: "in", time: "۱۴۰۵/۰۳/۱۵" },
// ];

const CompanyDashboard = () => {
  const { data, isLoading, isError } = useGetCompanyDashboardQuery();

  const companyUsage = useSelector((state: RootState) => state.user.companyUsage);
  const isTechnicalManager = useHavePermission("technicalManager");

  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <CircularProgress />
      </div>
    );

  if (isError || !data?.data)
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-gray-500">
        <span className="text-base font-semibold">
          خطا در دریافت اطلاعات داشبورد
        </span>
        <span className="text-sm text-gray-400">لطفاً دوباره تلاش کنید.</span>
      </div>
    );

  const { inspectionStatus, kpis, monthlyRequests, recentVisits, today } =
    mapDashboard(data);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <DashboardHeader
        title="داشبورد شرکت"
        subtitle="وضعیت ناوگان، درخواست‌ها و رانندگان شرکت در یک نگاه."
        items={today.map((t) => ({
          label: t.label,
          value: formatNumber(t.value),
          icon: t.icon,
        }))}
      />

      <div className="flex items-center justify-center gap-2 w-full">
          <Divider className="grow text-primary shadow shadow-primary border border-primary/50" />
          {isTechnicalManager && companyUsage !== CompanyUsage.PASSENGER && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<TruckFast />}
              onClick={() => navigate("/dashboard/do-technical-visit-freighter")}
              className="whitespace-nowrap text-lg gap-4 p-4"
            >
              بازدید فنی باری
            </Button>
          )}
          {isTechnicalManager && companyUsage !== CompanyUsage.FREIGHTER && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<Bus />}
              onClick={() => navigate("/dashboard/do-technical-visit-passenger")}
              className="whitespace-nowrap text-lg gap-4 p-4"
            >
              بازدید فنی مسافری
            </Button>
          )}
          <Divider className="grow text-primary shadow shadow-primary border border-primary/50" />
      </div>

      {/* کارت‌های KPI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ icon, ...kpi }) => (
          <StatCard key={kpi.key} kpi={kpi} icon={icon} />
        ))}
      </div>

      {/* نمودار روند + دونات وضعیت */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard
          title="روند درخواست‌های بازدید"
          className="lg:col-span-2"
          action={
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="h-2.5 w-2.5 rounded-full bg-[#00be77]" />
                باری
              </span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="h-2.5 w-2.5 rounded-full bg-[#7474C1]" />
                مسافری
              </span>
            </div>
          }
        >
          <InspectionsAreaChart data={monthlyRequests} />
        </SectionCard>

        <SectionCard title="وضعیت بازدیدها">
          <StatusDonut data={inspectionStatus} />
        </SectionCard>
      </div>

      {/* آخرین درخواست‌ها + رانندگان برتر */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="آخرین درخواست‌های بازدید" className="lg:col-span-2">
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full min-w-[520px] text-right">
              <thead>
                <tr className="text-xs text-gray-400">
                  <th className="px-2 pb-3 font-medium">کد سباف</th>
                  <th className="px-2 pb-3 font-medium">پلاک</th>
                  <th className="px-2 pb-3 font-medium">راننده</th>
                  <th className="px-2 pb-3 font-medium">نوع</th>
                  <th className="px-2 pb-3 font-medium">وضعیت</th>
                  <th className="px-2 pb-3 font-medium">زمان</th>
                </tr>
              </thead>
              <tbody>
                {recentVisits.map((row) => (
                  <tr
                    key={`${row.id}`}
                    className="border-t border-[#f2f4f6] text-sm transition-colors hover:bg-gray-50/60"
                  >
                    <td className="px-2 py-3 font-mono text-xs text-gray-400">
                      {row.id}
                    </td>
                    <td className="px-2 py-3 font-semibold text-gray-700">
                      <Plate
                        firstChar={UndefinedToEmptyString(row.plate[0])}
                        secondChar={UndefinedToEmptyString(row.plate[1])}
                        thirdChar={UndefinedToEmptyString(row.plate[2])}
                        fourthChar={UndefinedToEmptyString(row.plate[3])}
                      />
                    </td>
                    <td className="px-2 py-3 text-gray-600">
                      {row.driver_name}
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={`whitespace-nowrap rounded-md px-2 py-0.5 text-xs ${
                          row.type_title === "باری"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-indigo-50 text-indigo-500"
                        }`}
                      >
                        {row.type_title}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className="whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold"
                        // style={{
                        //   backgroundColor: `${row.statusColor}1a`,
                        //   color: row.statusColor,
                        // }}
                      >
                        {row.status_title}
                      </span>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-400">
                      &lrm;{row.created_at_jalali}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* <SectionCard title="رانندگان برتر">
          <div className="flex flex-col gap-4">
            {topDrivers.map((d) => (
              <ProgressRow
                key={d.name}
                label={d.name}
                value={`${formatNumber(d.count)} بازدید`}
                ratio={(d.count / maxDriver) * 100}
                color="#7474C1"
              />
            ))}
          </div>
        </SectionCard> */}
      </div>

      {/* آخرین تراکنش‌های کیف پول */}
      {/* <SectionCard title="آخرین تراکنش‌های کیف پول">
        <div className="flex flex-col divide-y divide-[#f2f4f6]">
          {walletTransactions.map((tx, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    tx.type === "in"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {tx.type === "in" ? <TbArrowDownLeft /> : <TbArrowUpRight />}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700">
                    {tx.title}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    &lrm;{tx.time}
                  </span>
                </div>
              </div>
              <span
                className={`text-sm font-bold ${
                  tx.type === "in" ? "text-green-600" : "text-red-500"
                }`}
              >
                {tx.type === "in" ? "+" : "−"} {formatNumber(tx.amount)} تومان
              </span>
            </div>
          ))}
        </div>
      </SectionCard> */}
    </div>
  );
};

function mapDashboard(data: Pick<CompanyDashboardResponse, "data">) {
  const today = [
    {
      label: "درخواست امروز",
      value: data.data.cards.today_visits,
      icon: <TbFileText />,
    },
    {
      label: "بازدید موفق",
      value: data.data.cards.approved_visits,
      icon: <TbCircleCheck />,
    },
    {
      label: "در انتظار",
      value: data.data.cards.in_progress_visits,
      icon: <TbClock />,
    },
    {
      label: "راننده فعال",
      value: data.data.cards.active_drivers,
      icon: <TbSteeringWheel />,
    },
  ];

  const kpis: (KpiCard & { icon: ReactNode })[] = [
    {
      key: "fleet",
      title: "ناوگان شرکت",
      value: data.data.cards.active_fleet,
      color: "#00be77",
      soft: "#e6faf2",
      icon: <TbTruck />,
    },
    {
      key: "drivers",
      title: "رانندگان",
      value: data.data.cards.total_drivers,
      color: "#7474C1",
      soft: "#ecedf8",
      icon: <TbUsers />,
    },
    {
      key: "month",
      title: "بازدید این ماه",
      value: data.data.cards.month_income,
      color: "#f59e0b",
      soft: "#fef3e2",
      icon: <TbCalendarStats />,
    },
    // {
    //   key: "wallet",
    //   title: "موجودی کیف پول",
    //   value: 12_450_000,
    //   suffix: "تومان",
    //   color: "#3b82f6",
    //   soft: "#e8f1fe",
    //   icon: <TbWallet />,
    // },
  ];

  const monthlyRequests: MonthlyPoint[] = data.data.visits_trend.map(
    (point) => ({
      month: point.month,
      freight: point.cargo,
      passenger: point.passenger,
    }),
  );

  const inspectionStatus: StatusSlice[] = data.data.visits_status.map(
    (status) => ({
      label: status.title,
      value: status.total,
      color: status.color,
    }),
  );

  const recentVisits = data.data.recent_visits;

  return {
    today,
    kpis,
    monthlyRequests,
    inspectionStatus,
    recentVisits,
  };
}

export default CompanyDashboard;
