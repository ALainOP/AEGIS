import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaDir?: "up"|"down"|"neutral";
  severity?: "normal"|"warning"|"critical"|"safe";
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label, value, unit, delta, deltaDir="neutral", severity="normal", icon,
}) => {
  const topBorder =
    severity === "critical" ? "border-t-ts-red" :
    severity === "warning"  ? "border-t-ts-amber" :
    severity === "safe"     ? "border-t-emerald-500" :
    "border-t-transparent";

  const deltaColor =
    deltaDir === "up"   ? "text-ts-red" :
    deltaDir === "down" ? "text-ts-teal" :
    "text-ts-text-35";

  return (
    <div className={`ts-card p-4 flex flex-col gap-2 border-t-2 ${topBorder}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[9.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--ts-t35)" }}>
          {label}
        </span>
        {icon && <span style={{ color: "var(--ts-t20)", flexShrink: 0 }}>{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold leading-none font-data" style={{ color: "var(--ts-t100)" }}>
          {typeof value === "number" ? value.toLocaleString("en-IN") : value}
        </span>
        {unit && <span className="text-[11px] font-medium" style={{ color: "var(--ts-t35)" }}>{unit}</span>}
      </div>
      {delta && <span className={`text-[10px] font-data ${deltaColor}`}>{delta}</span>}
    </div>
  );
};
