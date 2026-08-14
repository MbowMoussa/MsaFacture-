import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatCFAParts } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  isCurrency?: boolean;
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  description?: string;
  className?: string;
  badgeText?: string;
  badgeColor?: string;
}

export default function StatsCard({
  title,
  value,
  isCurrency = false,
  icon: Icon,
  iconColor = "text-indigo-600",
  iconBg = "bg-indigo-50/80 border border-indigo-100",
  trend,
  description,
  className,
  badgeText,
  badgeColor = "bg-slate-100 text-slate-700",
}: StatsCardProps) {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  const cfaParts = isCurrency && typeof numValue === "number" ? formatCFAParts(numValue) : null;

  const displayValue = !isCurrency
    ? typeof value === "number"
      ? value.toLocaleString("fr-FR")
      : value
    : null;

  const TrendIcon =
    trend?.positive === undefined
      ? Minus
      : trend.positive
      ? TrendingUp
      : TrendingDown;

  return (
    <div className={cn("card p-4 flex flex-col justify-between gap-3 bg-white border border-slate-200/80 rounded-xl shadow-xs hover:border-slate-300 transition-all duration-200 group", className)}>
      {/* Top row: Title + Icon */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </div>

      {/* Main Value — Compact & Aligned */}
      <div className="space-y-0.5">
        {isCurrency && cfaParts ? (
          <div className="flex items-baseline flex-wrap">
            <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-mono leading-none">
              {cfaParts.value}
            </span>
            <span className="text-xs font-semibold text-slate-500 font-sans ml-1">
              {cfaParts.symbol}
            </span>
          </div>
        ) : (
          <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">
            {displayValue}
          </p>
        )}

        {description && (
          <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">{description}</p>
        )}
      </div>

      {/* Footer: Trend or Badge */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
        {trend ? (
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold",
              trend.positive === undefined
                ? "bg-slate-100 text-slate-600"
                : trend.positive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : "bg-rose-50 text-rose-700 border border-rose-200/60"
            )}>
              <TrendIcon className="h-3 w-3" />
              {trend.positive !== false ? "+" : ""}{trend.value}%
            </span>
            <span className="text-slate-400 font-medium truncate">{trend.label}</span>
          </div>
        ) : badgeText ? (
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", badgeColor)}>
            {badgeText}
          </span>
        ) : (
          <span className="text-slate-400 text-[10px]">Temps réel</span>
        )}
      </div>
    </div>
  );
}
