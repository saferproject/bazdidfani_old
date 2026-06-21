import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import type { Plugin } from "chart.js";
import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { formatNumber, StatusSlice } from "../data";

ChartJS.register(ArcElement, Tooltip);

interface Props {
  data: StatusSlice[];
}

const StatusDonut = ({ data }: Props) => {
  const total = data.reduce((s, d) => s + d.value, 0);

  const centerTextPlugin: Plugin<"doughnut"> = useMemo(
    () => ({
      id: "centerText",
      afterDraw(chart) {
        const { ctx, width, height } = chart;
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const cx = width / 2;
        const cy = height / 2;

        ctx.font = "900 22px 'Yekan Bakh', sans-serif";
        ctx.fillStyle = "#1f2937";
        ctx.fillText(formatNumber(total), cx, cy - 8);

        ctx.font = "12px 'Yekan Bakh', sans-serif";
        ctx.fillStyle = "#9ca3af";
        ctx.fillText("کل بازدیدها", cx, cy + 14);

        ctx.restore();
      },
    }),
    [total],
  );

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => d.color),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        rtl: true,
        textDirection: "rtl" as const,
        bodyFont: { family: "Yekan Bakh" },
        titleFont: { family: "Yekan Bakh" },
        callbacks: {
          label: (ctx: { label: string; raw: unknown }) => {
            const val = ctx.raw as number;
            const pct = Math.round((val / total) * 100);
            return `${ctx.label}: ${formatNumber(val)} (٪${formatNumber(pct)})`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <div className="shrink-0" style={{ width: 180, height: 180 }}>
        <Doughnut
          data={chartData}
          options={options}
          plugins={[centerTextPlugin]}
        />
      </div>

      <div className="flex w-full flex-col gap-3">
        {data.map((s, i) => {
          const percent = Math.round((s.value / total) * 100);
          return (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-sm text-gray-600">{s.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-800">
                  {formatNumber(s.value)}
                </span>
                <span
                  className="rounded-md px-1.5 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: `${s.color}1a`, color: s.color }}
                >
                  ٪{formatNumber(percent)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusDonut;
