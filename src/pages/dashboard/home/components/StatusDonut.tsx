import { useMemo } from "react";
import { formatNumber, StatusSlice } from "../data";

interface Props {
  data: StatusSlice[];
}

/** نمودار دونات وضعیت بازدیدها (SVG، بدون کتابخانه خارجی). */
const StatusDonut = ({ data }: Props) => {
  const size = 180;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const total = data.reduce((s, d) => s + d.value, 0);

  const segments = useMemo(() => {
    let offset = 0;
    return data.map((d) => {
      const fraction = d.value / total;
      const seg = {
        ...d,
        dash: fraction * circumference,
        gap: circumference - fraction * circumference,
        offset: offset,
        percent: Math.round(fraction * 100),
      };
      offset -= fraction * circumference;
      return seg;
    });
  }, [data, total, circumference]);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f3f5"
            strokeWidth={stroke}
          />
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={s.offset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-gray-800">
            {formatNumber(total)}
          </span>
          <span className="text-xs text-gray-400">کل بازدیدها</span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        {segments.map((s, i) => (
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
                ٪{formatNumber(s.percent)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDonut;
