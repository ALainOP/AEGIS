import React from "react";
import {
  ArrowRight, AlertTriangle, MapPin, Shield, Users,
  Activity, Bus, CheckCircle2, Zap
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { StatCard } from "../components/ui/StatCard";
import { HazardBadge, SeverityBadge } from "../components/ui/Badges";
import { useDisaster } from "../context/DisasterContext";
import { stateBreakdown, hazardTrendData } from "../data/mockData";
import type { PageKey } from "../types";

interface OverviewPageProps {
  setActivePage: (p: PageKey) => void;
}

function fmt(d: string) {
  return (
    new Date(d).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }) + " IST"
  );
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ setActivePage }) => {
  const { habitations, safeSites, alertEvents, relocationOrders, openRelocationModal } = useDisaster();

  const totalPop = habitations.reduce((s, h) => s + h.population, 0);
  const critCount = habitations.filter(h => h.tier === 1 && h.status !== "allocated").length;
  const totalRedZones = stateBreakdown.reduce((s, r) => s + r.zones, 0);
  const inTransitOrders = relocationOrders.filter(o => o.status === "in_transit");
  const inTransitPop = inTransitOrders.reduce((s, o) => s + o.population, 0);
  const settledOrders = relocationOrders.filter(o => o.status === "completed");
  const settledPop = settledOrders.reduce((s, o) => s + o.population, 0);

  const highestRiskHab = habitations.find(h => h.tier === 1 && h.status !== "allocated" && h.status !== "relocating");

  return (
    <div className="flex flex-col gap-0 h-full animate-fade-in">
      {/* ── Authority bar ── */}
      <div
        className="flex items-center justify-between px-6 py-2 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--ts-border)", background: "var(--ts-surf-0)" }}
      >
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" style={{ animation: "pulse 2s infinite" }} />
          <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--ts-t35)" }}>
            System Operational · 24x7 InSAR &amp; Hydrological Data Feeds Active
          </span>
        </div>
        <div className="flex items-center gap-2">
          {highestRiskHab && (
            <button
              onClick={() => openRelocationModal(highestRiskHab)}
              className="ts-btn text-xs font-bold bg-red-700/80 hover:bg-red-600 text-white border border-red-500 flex items-center gap-1.5 py-1 px-3"
            >
              <Zap size={12} className="text-yellow-300 fill-yellow-300" />
              <span>🚨 Evacuate {highestRiskHab.name.slice(0, 16)}…</span>
            </button>
          )}
          <button
            onClick={() => setActivePage("map")}
            className="ts-btn ts-btn-amber flex items-center gap-2 py-1 px-3 text-xs"
          >
            Open Red Zone Map <ArrowRight size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Active Evacuation Convoy Notification Banner */}
        {inTransitOrders.length > 0 && (
          <div
            onClick={() => setActivePage("queue")}
            className="p-4 rounded-md border flex items-center justify-between cursor-pointer hover:bg-amber-950/30 transition-colors"
            style={{ background: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.3)" }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-amber-500/20 text-amber-300">
                <Bus size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                  <span>ACTIVE RELOCATION MISSIONS: {inTransitOrders.length} CONVOYS CURRENTLY EN ROUTE</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-400 text-black font-bold">LIVE ESCORT</span>
                </div>
                <div className="text-[11px] text-amber-200/80 mt-0.5">
                  {inTransitPop.toLocaleString("en-IN")} citizens being relocated to engineered safe zones. Click to view live escort telemetry and ETA.
                </div>
              </div>
            </div>
            <ArrowRight size={16} className="text-amber-400" />
          </div>
        )}

        {/* ── Page heading ── */}
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--ts-t100)", letterSpacing: "-0.02em" }}>
            Disaster Risk &amp; Relocation Command Center
          </h1>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--ts-t35)" }}>
            Real-time InSAR landslide &amp; flood decision-support · NDRF Disaster Management Division · India
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-px" style={{ background: "var(--ts-border)" }}>
          <StatCard
            label="Red Zones Mapped"
            value={totalRedZones}
            unit="zones"
            severity="critical"
            icon={<MapPin size={14} />}
            delta="+4 this week"
            deltaDir="up"
          />
          <StatCard
            label="Habitations in Distress"
            value={critCount}
            unit="urgent"
            severity="warning"
            icon={<AlertTriangle size={14} />}
            delta={`${critCount} Tier-1 critical`}
            deltaDir="up"
          />
          <StatCard
            label="Evacuees in Transit"
            value={inTransitPop}
            unit="persons"
            severity={inTransitPop > 0 ? "warning" : "safe"}
            icon={<Bus size={14} />}
            delta={`${inTransitOrders.length} active convoys`}
            deltaDir="up"
          />
          <StatCard
            label="Safely Relocated"
            value={settledPop}
            unit="persons"
            severity="safe"
            icon={<Shield size={14} />}
            delta={`${settledOrders.length} habitations settled`}
            deltaDir="down"
          />
        </div>

        {/* ── Main content grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: State table + Hazard chart */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Hazard distribution bar chart */}
            <div className="ts-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--ts-border)" }}>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--ts-t60)" }}>
                    Hazard Distribution Trends
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--ts-t20)" }}>
                    Habitations under threat by hazard type (Mar - Sep 2026)
                  </div>
                </div>
                <Activity size={14} style={{ color: "var(--ts-t20)" }} />
              </div>
              <div className="px-4 pt-3 pb-4">
                <div style={{ height: 110 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hazardTrendData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: "var(--ts-surf-1)",
                          border: "1px solid var(--ts-border)",
                          borderRadius: 3,
                          fontSize: 11,
                        }}
                        itemStyle={{ color: "var(--ts-t60)" }}
                        labelStyle={{ color: "var(--ts-t100)", fontFamily: "IBM Plex Mono", fontSize: 10 }}
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      />
                      <Bar dataKey="landslide" stackId="a" fill="#C9861A" />
                      <Bar dataKey="flood" stackId="a" fill="#3EA8C4" />
                      <Bar dataKey="coastal" stackId="a" fill="#2A7F76" />
                      <Bar dataKey="cloudburst" stackId="a" fill="#6A90B8" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* State breakdown table */}
            <div className="ts-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--ts-border)" }}>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--ts-t60)" }}>
                    State-Level Vulnerability &amp; Habitational Distribution
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--ts-t20)" }}>
                    Monitored by respective State Disaster Management Authorities
                  </div>
                </div>
                <button onClick={() => setActivePage("queue")} className="ts-btn text-[10.5px] py-1 px-2.5">
                  View Priority Queue →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="ts-table">
                  <thead>
                    <tr>
                      <th>State</th>
                      <th>Red Zones</th>
                      <th>Tier 1 (Immediate)</th>
                      <th>Tier 2</th>
                      <th>Tier 3</th>
                      <th>At-Risk Population</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stateBreakdown.map(r => (
                      <tr key={r.state}>
                        <td className="font-semibold text-white text-xs">{r.state}</td>
                        <td className="font-data text-xs">{r.zones}</td>
                        <td>
                          <span className="ts-badge ts-badge-immediate text-[10px]">{r.tier1}</span>
                        </td>
                        <td>
                          <span className="ts-badge ts-badge-short text-[10px]">{r.tier2}</span>
                        </td>
                        <td>
                          <span className="ts-badge ts-badge-medium-t text-[10px]">{r.tier3}</span>
                        </td>
                        <td className="font-data text-xs">{r.population.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Urgent Distress Callouts */}
          <div className="flex flex-col gap-6">
            {/* Critical Habitations awaiting relocation */}
            <div className="ts-card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-red-400 flex items-center gap-1.5">
                  <AlertTriangle size={13} />
                  <span>Immediate Triage Habitations</span>
                </div>
                <span className="text-[10px] text-white/40">{critCount} pending</span>
              </div>

              <div className="divide-y" style={{ borderColor: "var(--ts-border)" }}>
                {habitations
                  .filter(h => h.tier === 1)
                  .slice(0, 4)
                  .map(h => (
                    <div key={h.id} className="py-2.5 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-white">{h.name}</div>
                        <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>
                          {h.district}, {h.state} · {h.population.toLocaleString("en-IN")} persons
                        </div>
                      </div>

                      <button
                        onClick={() => openRelocationModal(h)}
                        className={`text-[10px] px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                          h.status === "relocating"
                            ? "bg-amber-900/40 text-amber-300 border border-amber-800"
                            : h.status === "allocated"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : "bg-red-700/80 hover:bg-red-600 text-white"
                        }`}
                      >
                        {h.status === "relocating" ? "In Transit" : h.status === "allocated" ? "Settled" : "Relocate"}
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Live Alerts Stream */}
            <div className="ts-card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                  Live Early Warning Feed
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              </div>

              <div className="divide-y text-xs" style={{ borderColor: "var(--ts-border)" }}>
                {alertEvents.slice(0, 5).map(a => (
                  <div key={a.id} className="py-2 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white/90">{a.location}</span>
                      <SeverityBadge level={a.severity} />
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--ts-t35)" }}>
                      {a.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
