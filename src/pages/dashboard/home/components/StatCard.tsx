import { formatNumber, KpiCard } from "../data";
import { ReactNode } from "react";

// import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

interface Props {
  kpi: KpiCard;
  icon: ReactNode;
}

const StatCard = ({ kpi, icon }: Props) => {
  // const hasTrend = typeof kpi.trend === "number";
  // const up = (kpi.trend ?? 0) >= 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#eef0f3] bg-white p-4 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      {/* هاله رنگی گوشه */}
      <span
        className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full opacity-60 transition-transform duration-500 group-hover:scale-125"
        style={{ backgroundColor: kpi.soft }}
      />

      <div className="relative flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: kpi.soft, color: kpi.color }}
        >
          {icon}
        </div>

        {/* {hasTrend && (
          <div
            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold ${
              up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            }`}
          >
            {up ? <FiTrendingUp /> : <FiTrendingDown />}
            <span>٪{formatNumber(Math.abs(kpi.trend as number))}</span>
          </div>
        )} */}
      </div>

      <div className="relative mt-4">
        <div className="flex items-end gap-1">
          <span className="text-2xl font-extrabold tracking-tight text-gray-800">
            {formatNumber(kpi.value)}
          </span>
          {kpi.suffix && (
            <span className="mb-0.5 text-xs text-gray-400">{kpi.suffix}</span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">{kpi.title}</p>
      </div>
    </div>
  );
};

export default StatCard;
