import { useMemo, useState } from "react";
import { formatNumber, MonthlyPoint } from "../data";

interface Props {
  data: MonthlyPoint[];
}

/**
 * نمودار سطحی (Area) بازدیدها به تفکیک باری و مسافری.
 * بدون کتابخانه‌ی خارجی و کاملاً با SVG رسم شده است.
 */
const InspectionsAreaChart = ({ data }: Props) => {
  const W = 720;
  const H = 260;
  const padX = 36;
  const padY = 28;

  const [hover, setHover] = useState<number | null>(null);

  const { freightPath, freightArea, passengerPath, passengerArea, points, max } =
    useMemo(() => {
      const totals = data.map((d) => d.freight + d.passenger);
      const maxVal = Math.ceil(Math.max(...totals) / 500) * 500;

      const stepX = (W - padX * 2) / (data.length - 1);
      const scaleY = (v: number) => H - padY - (v / maxVal) * (H - padY * 2);
      const xAt = (i: number) => padX + stepX * i;

      const buildLine = (key: "freight" | "passenger") =>
        data.map((d, i) => `${xAt(i)},${scaleY(d[key])}`).join(" ");

      const fLine = buildLine("freight");
      const pLine = buildLine("passenger");

      const toArea = (line: string) =>
        `M ${padX},${H - padY} L ${line.replace(/ /g, " L ")} L ${
          W - padX
        },${H - padY} Z`;

      const pts = data.map((d, i) => ({
        x: xAt(i),
        fy: scaleY(d.freight),
        py: scaleY(d.passenger),
        ...d,
      }));

      return {
        freightPath: `M ${fLine.replace(/ /g, " L ")}`,
        freightArea: toArea(fLine),
        passengerPath: `M ${pLine.replace(/ /g, " L ")}`,
        passengerArea: toArea(pLine),
        points: pts,
        max: maxVal,
      };
    }, [data]);

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="gFreight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00be77" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00be77" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gPassenger" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7474C1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7474C1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* خطوط راهنمای افقی */}
        {gridLines.map((g, i) => {
          const y = padY + g * (H - padY * 2);
          const val = Math.round(max * (1 - g));
          return (
            <g key={i}>
              <line
                x1={padX}
                x2={W - padX}
                y1={y}
                y2={y}
                stroke="#eef0f3"
                strokeWidth={1}
              />
              <text x={W - padX + 4} y={y + 4} fontSize="10" fill="#aab2bd">
                {formatNumber(val)}
              </text>
            </g>
          );
        })}

        <path d={passengerArea} fill="url(#gPassenger)" />
        <path d={freightArea} fill="url(#gFreight)" />
        <path d={passengerPath} fill="none" stroke="#7474C1" strokeWidth={2.5} />
        <path d={freightPath} fill="none" stroke="#00be77" strokeWidth={2.5} />

        {points.map((p, i) => (
          <g key={i}>
            {/* ناحیه‌ی شناسایی هاور */}
            <rect
              x={p.x - 22}
              y={padY}
              width={44}
              height={H - padY}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
            {hover === i && (
              <line
                x1={p.x}
                x2={p.x}
                y1={padY}
                y2={H - padY}
                stroke="#cfd6de"
                strokeDasharray="4 4"
              />
            )}
            <circle
              cx={p.x}
              cy={p.fy}
              r={hover === i ? 5 : 3}
              fill="#00be77"
              stroke="#fff"
              strokeWidth={2}
            />
            <circle
              cx={p.x}
              cy={p.py}
              r={hover === i ? 5 : 3}
              fill="#7474C1"
              stroke="#fff"
              strokeWidth={2}
            />
            <text
              x={p.x}
              y={H - 8}
              textAnchor="middle"
              fontSize="11"
              fill="#8a929c"
            >
              {p.month}
            </text>
          </g>
        ))}
      </svg>

      {hover !== null && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-4 text-xs">
          <span className="font-semibold text-gray-700">
            {points[hover].month}
          </span>
          <span className="flex items-center gap-1 text-[#00be77]">
            <span className="h-2 w-2 rounded-full bg-[#00be77]" />
            باری: {formatNumber(points[hover].freight)}
          </span>
          <span className="flex items-center gap-1 text-[#7474C1]">
            <span className="h-2 w-2 rounded-full bg-[#7474C1]" />
            مسافری: {formatNumber(points[hover].passenger)}
          </span>
        </div>
      )}
    </div>
  );
};

export default InspectionsAreaChart;
