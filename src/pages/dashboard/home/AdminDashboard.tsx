import { Bus, TruckFast } from "iconsax-reactjs";
import { useGetAdminDashboardQuery } from "../../../api/Admin/Dashboard";
import Plate from "../../../components/shared/DataGrid/Plate";
import { UndefinedToEmptyString } from "../../../utilities/Helper";
import InspectionsAreaChart from "./components/InspectionsAreaChart";
import {
  DashboardHeader,
  EmptyState,
  ProgressRow,
  RankBadge,
  SectionCard,
} from "./components/Shared";
import StatCard from "./components/StatCard";
import StatusDonut from "./components/StatusDonut";
import { formatNumber, mapDashboard } from "./data";
import { Button, CircularProgress, Divider } from "@mui/material";
import { ReactNode } from "react";
import {
  TbBuildingSkyscraper,
  TbClipboardCheck,
  TbClock,
  TbTruck,
  TbUserPlus,
  TbUsers,
  TbWallet,
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import CompanyUsage from "../../../pages/dashboard/admin/enums/company-usage.enum";
import { useSelector } from "react-redux";
import { RootState } from "../../../Stores/store";
import useHavePermission from "../../../components/shared/Functions/CostumeHooks/CheckPermissions";

const kpiIcons: Record<string, ReactNode> = {
  month_visits: <TbClipboardCheck />,
  active_fleet: <TbTruck />,
  technical_managers: <TbUsers />,
  month_income: <TbWallet />,
};

const todayMeta: ReactNode[] = [
  <TbClipboardCheck />,
  <TbBuildingSkyscraper />,
  <TbUserPlus />,
  <TbClock />,
];

/** داشبورد ادمین — داده‌ی واقعی از سرویس api/admin/dashboard. */
const AdminDashboard = () => {
  const { data, isLoading, isError } = useGetAdminDashboardQuery();

  const navigate = useNavigate();

  const companyUsage = useSelector((state: RootState) => state.user.companyUsage);
  const isTechnicalManager = useHavePermission("technicalManager");

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

  const {
    kpis,
    today,
    monthlyInspections,
    inspectionStatus,
    topManagers,
    recentInspections,
    topProvinces,
  } = mapDashboard(data.data);

  const maxProvince = Math.max(1, ...topProvinces.map((p) => p.count));

  return (
    <div className="flex flex-col gap-5 pb-6">
      <DashboardHeader
        title="داشبورد مدیریت"
        subtitle="خلاصه‌ای از عملکرد سامانه را در یک نگاه مشاهده کنید."
        items={today.map((t, i) => ({
          label: t.label,
          value: formatNumber(t.value),
          icon: todayMeta[i],
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
        {kpis.map((kpi) => (
          <StatCard key={kpi.key} kpi={kpi} icon={kpiIcons[kpi.key]} />
        ))}
      </div>

      {/* نمودار روند + دونات وضعیت */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard
          title="روند بازدیدها"
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
          {monthlyInspections.length >= 2 ? (
            <InspectionsAreaChart data={monthlyInspections} />
          ) : (
            <EmptyState text="برای رسم نمودار حداقل دو ماه داده لازم است" />
          )}
        </SectionCard>

        <SectionCard title="وضعیت بازدیدها">
          {inspectionStatus.length > 0 ? (
            <StatusDonut data={inspectionStatus} />
          ) : (
            <EmptyState />
          )}
        </SectionCard>
      </div>

      {/* آخرین بازدیدها + برترین مدیران فنی */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="آخرین بازدیدها" className="lg:col-span-2">
          {recentInspections.length > 0 ? (
            <div className="-mx-1 overflow-x-auto">
              <table className="w-full min-w-130 text-right">
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
                  {recentInspections.map((row) => (
                    <tr
                      key={row.id}
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
                      <td className="px-2 py-3 text-gray-600">{row.driver}</td>
                      <td className="px-2 py-3">
                        <span
                          className={`whitespace-nowrap rounded-md px-2 py-0.5 text-xs ${
                            row.type === "باری"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-indigo-50 text-indigo-500"
                          }`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span
                          className="whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold"
                          style={{
                            backgroundColor: `${row.statusColor}1a`,
                            color: row.statusColor,
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-400">
                        &lrm;{row.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState />
          )}
        </SectionCard>

        <SectionCard title="برترین مدیران فنی">
          {topManagers.length > 0 ? (
            <div className="flex flex-col gap-4">
              {topManagers.map((m, i) => (
                <div key={`${m.name}-${i}`} className="flex items-center gap-3">
                  <RankBadge index={i} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-gray-700">
                        {m.name}
                      </span>
                      <span className="shrink-0 text-xs font-bold text-gray-500">
                        {formatNumber(m.count)} بازدید
                      </span>
                    </div>
                    <span className="truncate text-[11px] text-gray-400">
                      {m.company}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </SectionCard>
      </div>

      {/* استان‌های برتر */}
      <SectionCard title="استان‌های برتر بر اساس تعداد بازدید">
        {topProvinces.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {topProvinces.map((p) => (
              <ProgressRow
                key={p.name}
                label={p.name}
                value={formatNumber(p.count)}
                ratio={(p.count / maxProvince) * 100}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </SectionCard>
    </div>
  );
};

export default AdminDashboard;
