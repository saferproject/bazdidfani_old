import { ReactNode } from "react";

/** سربرگ خوش‌آمدگویی گرادیانتی مشترک بین داشبوردها. */
export const DashboardHeader = ({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: { label: string; value: string; icon: ReactNode }[];
}) => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-[#00be77] to-[#00eb93] p-5 text-white sm:p-6">
    <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
    <div className="absolute -bottom-16 left-24 h-40 w-40 rounded-full bg-white/10" />
    <div className="relative flex flex-col gap-1">
      <h2 className="font-Yekan-Bakh text-xl font-extrabold sm:text-2xl">
        {title}
      </h2>
      <p className="text-sm text-white/85">{subtitle}</p>
    </div>
    <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-xl bg-white/50 p-3 backdrop-blur-sm"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-gray-500/20 text-lg text-gray-600">
            {item.icon}
          </span>
          <div className="flex flex-col text-gray-600">
            <span className="text-lg font-extrabold leading-none">
              {item.value}
            </span>
            <span className="text-[11px] text-gray-600/80">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/** کارت بخش با عنوان و اکشن اختیاری. */
export const SectionCard = ({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl border border-[#eef0f3] bg-white p-4 sm:p-5 ${className}`}
  >
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-Yekan-Bakh text-base font-bold text-gray-800">
        {title}
      </h3>
      {action}
    </div>
    {children}
  </div>
);

/** حالت خالی مشترک. */
export const EmptyState = ({
  text = "داده‌ای برای نمایش وجود ندارد",
}: {
  text?: string;
}) => (
  <div className="flex h-32 items-center justify-center text-sm text-gray-400">
    {text}
  </div>
);

/** لیست رتبه‌بندی با مدال رنگی شماره. */
export const RankBadge = ({ index }: { index: number }) => (
  <span
    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
      index === 0
        ? "bg-amber-100 text-amber-600"
        : index === 1
          ? "bg-gray-100 text-gray-500"
          : index === 2
            ? "bg-orange-100 text-orange-500"
            : "bg-gray-50 text-gray-400"
    }`}
  >
    {index + 1}
  </span>
);

/** نوار پیشرفت افقی با گرادیانت سبز. ratio بین ۰ تا ۱۰۰ است. */
export const ProgressRow = ({
  label,
  value,
  ratio,
  color = "#00be77",
}: {
  label: string;
  value: string;
  ratio: number;
  color?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-bold text-gray-700">{value}</span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.min(100, Math.max(0, ratio))}%`,
          background: `linear-gradient(to left, ${color}, ${color}cc)`,
        }}
      />
    </div>
  </div>
);
