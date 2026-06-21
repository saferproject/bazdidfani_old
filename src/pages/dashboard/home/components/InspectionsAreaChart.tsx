import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatNumber, MonthlyPoint } from "../data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

interface Props {
  data: MonthlyPoint[];
}

const InspectionsAreaChart = ({ data }: Props) => {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "باری",
        data: data.map((d) => d.freight),
        borderColor: "#00be77",
        backgroundColor: "rgba(0, 190, 119, 0.15)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: "#00be77",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        borderWidth: 2.5,
      },
      {
        label: "مسافری",
        data: data.map((d) => d.passenger),
        borderColor: "#7474C1",
        backgroundColor: "rgba(116, 116, 193, 0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: "#7474C1",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        borderWidth: 2.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        rtl: true,
        textDirection: "rtl" as const,
        bodyFont: { family: "Yekan Bakh" },
        titleFont: { family: "Yekan Bakh" },
        callbacks: {
          label: (ctx: { dataset: { label?: string }; raw: unknown }) =>
            `${ctx.dataset.label}: ${formatNumber(ctx.raw as number)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: "Yekan Bakh" } },
      },
      y: {
        grid: { color: "#eef0f3" },
        ticks: {
          callback: (value: string | number) => formatNumber(Number(value)),
          font: { family: "Yekan Bakh" },
        },
      },
    },
  };

  return (
    <div className="w-full" style={{ height: 260 }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default InspectionsAreaChart;
