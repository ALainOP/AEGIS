import React from "react";
import type { HazardType, RelocationTier } from "../../types";

export type SeverityLevel = "critical"|"high"|"medium"|"low"|"safe"|"immediate"|"short-term"|"medium-term";

export const SeverityBadge: React.FC<{ level: SeverityLevel; label?: string }> = ({ level, label }) => {
  const cls =
    level === "critical"   ? "ts-badge ts-badge-critical"  :
    level === "high"       ? "ts-badge ts-badge-high"      :
    level === "medium"     ? "ts-badge ts-badge-medium"    :
    level === "low"        ? "ts-badge ts-badge-low"       :
    level === "safe"       ? "ts-badge ts-badge-safe"      :
    level === "immediate"  ? "ts-badge ts-badge-immediate" :
    level === "short-term" ? "ts-badge ts-badge-short"     :
                             "ts-badge ts-badge-medium-t";
  const defaultLabel =
    level === "critical"   ? "CRITICAL"    :
    level === "high"       ? "HIGH"        :
    level === "medium"     ? "MEDIUM"      :
    level === "low"        ? "LOW"         :
    level === "safe"       ? "SAFE"        :
    level === "immediate"  ? "IMMEDIATE"   :
    level === "short-term" ? "SHORT-TERM"  :
                             "MEDIUM-TERM";
  return <span className={cls}>{label ?? defaultLabel}</span>;
};

const HAZARD_META: Record<HazardType, { label: string; color: string }> = {
  landslide:  { label: "LANDSLIDE",  color: "#C9861A" },
  flood:      { label: "FLOOD",      color: "#3EA8C4" },
  coastal:    { label: "COASTAL",    color: "#2A7F76" },
  cloudburst: { label: "CLOUDBURST", color: "#6A90B8" },
};

export const HazardBadge: React.FC<{ type: HazardType }> = ({ type }) => {
  const { label, color } = HAZARD_META[type];
  return (
    <span className="ts-badge" style={{ color, background: `${color}18`, borderColor: `${color}40` }}>
      {label}
    </span>
  );
};

export const TierBadge: React.FC<{ tier: RelocationTier }> = ({ tier }) => {
  const map: Record<RelocationTier, { cls: string; label: string }> = {
    1: { cls: "ts-badge ts-badge-immediate", label: "TIER 1 — IMMEDIATE" },
    2: { cls: "ts-badge ts-badge-short",     label: "TIER 2 — SHORT-TERM" },
    3: { cls: "ts-badge ts-badge-medium-t",  label: "TIER 3 — MEDIUM-TERM" },
  };
  const { cls, label } = map[tier];
  return <span className={cls}>{label}</span>;
};
