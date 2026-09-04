import React, { useState } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, CartesianGrid
} from "recharts";
import { Download, FileText, Printer, CheckCircle2, AlertTriangle, ShieldCheck, X } from "lucide-react";
import { useDisaster } from "../context/DisasterContext";
import { hazardTrendData, populationAtRiskData, stateBreakdown } from "../data/mockData";

const TT = (props: any) => (
  <div style={{ background: "var(--ts-surf-1)", border: "1px solid var(--ts-border)", borderRadius: 3, padding: "8px 12px", fontSize: 11 }}>
    {props.label && <div style={{ color: "var(--ts-amber)", fontFamily: "IBM Plex Mono", fontSize: 10, marginBottom: 4 }}>{props.label}</div>}
    {props.payload?.map((p: any) => (
      <div key={p.name} style={{ color: "var(--ts-t60)" }}>{p.name}: <strong style={{ color: "var(--ts-t100)" }}>{p.value}</strong></div>
    ))}
  </div>
);

export const ReportsPage: React.FC = () => {
  const { habitations, safeSites, relocationOrders } = useDisaster();
  const [showBriefModal, setShowBriefModal] = useState(false);

  const totalPop = habitations.reduce((s, h) => s + h.population, 0);
  const inTransit = relocationOrders.filter(o => o.status === "in_transit");
  const completed = relocationOrders.filter(o => o.status === "completed");
  const completedPop = completed.reduce((s, o) => s + o.population, 0);

  const downloadFullCSV = () => {
    const headers = [
      "Habitation_ID", "Name", "State", "District", "Hazard_Type", "Tier",
      "Population", "Households", "Slope_Angle", "InSAR_mm_yr", "Pore_Pressure_kPa",
      "SEVI_Score", "Status", "Allocated_Safe_Site"
    ];
    const rows = habitations.map(h => [
      h.id, `"${h.name}"`, `"${h.state}"`, `"${h.district}"`, h.hazardType, h.tier,
      h.population, h.households, h.slopeAngle, h.insarDisplacementRate, h.porePressureIndex,
      h.sevi.overallScore.toFixed(1), h.status, `"${h.allocatedToSiteId || "Pending"}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NDRF_National_Disaster_Relocation_SitRep_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--ts-border)", background: "var(--ts-surf-0)" }}>
        <div>
          <h2 className="text-[14px] font-bold tracking-tight" style={{ color: "var(--ts-t100)", letterSpacing: "-0.01em" }}>
            Reports, Analytics &amp; MHA SitRep
          </h2>
          <p className="text-[10.5px] mt-0.5" style={{ color: "var(--ts-t35)" }}>
            Disaster decision analytics · Executive briefs &amp; evacuation progress reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBriefModal(true)}
            className="ts-btn ts-btn-amber gap-1.5 text-xs py-1.5 px-3 font-semibold"
          >
            <FileText size={12} /> View Executive MHA Brief
          </button>
          <button
            onClick={downloadFullCSV}
            className="ts-btn gap-1.5 text-xs py-1.5 px-3"
          >
            <Download size={12} /> Download Dataset (CSV)
          </button>
          <button
            onClick={() => window.print()}
            className="ts-btn gap-1.5 text-xs py-1.5 px-3"
          >
            <Printer size={12} /> Print Dossier
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* SitRep Summary Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="ts-card p-3">
            <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Total Monitored Citizens</div>
            <div className="text-base font-bold font-data text-white">{totalPop.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-white/50">{habitations.length} habitations across 8 states</div>
          </div>
          <div className="ts-card p-3">
            <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Safely Evacuated &amp; Settled</div>
            <div className="text-base font-bold font-data text-emerald-400">{completedPop.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-emerald-400/80">{completed.length} habitations settled</div>
          </div>
          <div className="ts-card p-3">
            <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Active Evacuation Convoys</div>
            <div className="text-base font-bold font-data text-amber-400">{inTransit.length}</div>
            <div className="text-[10px] text-amber-300/80">{inTransit.reduce((s, o) => s + o.population, 0).toLocaleString("en-IN")} persons in transit</div>
          </div>
          <div className="ts-card p-3">
            <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Candidate Safe Sites Available</div>
            <div className="text-base font-bold font-data text-teal-400">{safeSites.length}</div>
            <div className="text-[10px] text-teal-300/80">
              {(safeSites.reduce((s, x) => s + x.maxPopulationCapacity - x.allocatedPopulation, 0)).toLocaleString("en-IN")} headroom capacity
            </div>
          </div>
        </div>

        {/* Chart row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Hazard trends */}
          <div className="ts-card overflow-hidden">
            <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--ts-border)" }}>
              <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--ts-t60)" }}>Hazard Zone Trend — Mar to Sep 2026</div>
              <div className="text-[10px] mt-0.5" style={{ color: "var(--ts-t20)" }}>Monthly count of active red zones by hazard type</div>
            </div>
            <div className="px-4 py-4">
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hazardTrendData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<TT />} />
                    <Line dataKey="landslide" stroke="#C9861A" strokeWidth={1.5} dot={false} name="Landslide" />
                    <Line dataKey="flood" stroke="#3EA8C4" strokeWidth={1.5} dot={false} name="Flood" />
                    <Line dataKey="coastal" stroke="#2A7F76" strokeWidth={1.5} dot={false} name="Coastal" />
                    <Line dataKey="cloudburst" stroke="#6A90B8" strokeWidth={1.5} dot={false} name="Cloudburst" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-2">
                {[["Landslide", "#C9861A"], ["Flood", "#3EA8C4"], ["Coastal", "#2A7F76"], ["Cloudburst", "#6A90B8"]].map(([n, c]) => (
                  <div key={n} className="flex items-center gap-1.5">
                    <div className="w-4 h-0.5 flex-shrink-0" style={{ background: c }} />
                    <span className="text-[10px]" style={{ color: "var(--ts-t35)" }}>{n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Population at risk */}
          <div className="ts-card overflow-hidden">
            <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--ts-border)" }}>
              <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--ts-t60)" }}>Population at Risk — Cumulative</div>
              <div className="text-[10px] mt-0.5" style={{ color: "var(--ts-t20)" }}>Estimated vulnerable persons per month</div>
            </div>
            <div className="px-4 py-4">
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={populationAtRiskData} margin={{ top: 4, right: 4, left: -14, bottom: 0 }}>
                    <defs>
                      <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#B83232" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#B83232" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<TT />} />
                    <Area type="monotone" dataKey="population" stroke="#B83232" strokeWidth={1.5} fill="url(#popGrad)" name="Population at Risk" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* State Breakdown Table */}
        <div className="ts-card overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--ts-border)" }}>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--ts-t60)" }}>
                State Disaster Management Summary
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: "var(--ts-t20)" }}>
                Active hazard zones and population statistics by state
              </div>
            </div>
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
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody>
                {stateBreakdown.map(r => (
                  <tr key={r.state}>
                    <td className="font-semibold text-white text-xs">{r.state}</td>
                    <td className="font-data text-xs">{r.zones}</td>
                    <td><span className="ts-badge ts-badge-immediate text-[10px]">{r.tier1}</span></td>
                    <td><span className="ts-badge ts-badge-short text-[10px]">{r.tier2}</span></td>
                    <td><span className="ts-badge ts-badge-medium-t text-[10px]">{r.tier3}</span></td>
                    <td className="font-data text-xs">{r.population.toLocaleString("en-IN")}</td>
                    <td className="text-[10.5px] font-data" style={{ color: "var(--ts-t35)" }}>{r.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Executive MHA Brief Modal */}
      {showBriefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-lg overflow-hidden shadow-2xl border"
            style={{ background: "var(--ts-surf-0)", borderColor: "var(--ts-amber)" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ background: "var(--ts-surf-1)", borderColor: "var(--ts-border)" }}>
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Ministry of Home Affairs · Daily Situation Report (SitRep)
                  </h3>
                  <div className="text-[10.5px] text-white/50">
                    Cycle: Monsoon 2026 · Compiled by National Disaster Response Force HQ
                  </div>
                </div>
              </div>
              <button onClick={() => setShowBriefModal(false)} className="text-white/50 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed flex flex-col gap-4 text-white/80">
              <div className="p-3 rounded bg-amber-950/30 border border-amber-800/40 text-amber-200">
                <strong>EXECUTIVE SUMMARY FOR HON'BLE UNION HOME MINISTER:</strong>
                <br />
                As of 04 September 2026, InSAR interferometric surveillance across the Himalayan arc and coastal belts has flagged <strong>{habitations.length} distressed habitation clusters</strong> requiring managed resettlement.
              </div>

              <div>
                <strong>1. IMMEDIATE ACTION REPORT (TIER-1):</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Active Evacuation Convoys: <strong>{inTransit.length} operations</strong> transporting {inTransit.reduce((s, o) => s + o.population, 0).toLocaleString("en-IN")} citizens.</li>
                  <li>Evacuations Successfully Completed: <strong>{completed.length} operations</strong> ({completedPop.toLocaleString("en-IN")} persons safely housed).</li>
                  <li>Priority focus maintained on Raigunna (Chamoli), Mundakkal (Wayanad), and Majuli Char (Assam).</li>
                </ul>
              </div>

              <div>
                <strong>2. SAFE REFUGE CARRYING CAPACITY AUDIT:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Total Safe Sites Commissioned: {safeSites.length} engineered plateau / township sites.</li>
                  <li>Aggregate Capacity Headroom: {(safeSites.reduce((s, x) => s + x.maxPopulationCapacity - x.allocatedPopulation, 0)).toLocaleString("en-IN")} persons remaining.</li>
                  <li>Per-capita water standards maintained at &gt;70 L/day across all designated centers.</li>
                </ul>
              </div>

              <div>
                <strong>3. SIGNED DIRECTIVE:</strong>
                <div className="mt-2 text-white/50">
                  Digitally Certified by Director General, NDRF &amp; Joint Secretary (DM), Ministry of Home Affairs, New Delhi.
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t flex items-center justify-between" style={{ borderColor: "var(--ts-border)", background: "var(--ts-surf-1)" }}>
              <button onClick={() => window.print()} className="ts-btn text-xs flex items-center gap-1.5">
                <Printer size={12} /> Print Brief
              </button>
              <button onClick={() => setShowBriefModal(false)} className="ts-btn ts-btn-amber text-xs px-4">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
