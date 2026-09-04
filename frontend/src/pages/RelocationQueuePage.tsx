import React, { useState, useMemo } from "react";
import {
  Search, Filter, ChevronUp, ChevronDown, Users, MapPin,
  ShieldCheck, AlertTriangle, Bus, CheckCircle2, Download,
  ArrowRight, Clock, Navigation, Zap
} from "lucide-react";
import { useDisaster } from "../context/DisasterContext";
import { HazardBadge, TierBadge } from "../components/ui/Badges";
import type { Habitation, HazardType, RelocationTier } from "../types";

type SortKey = "tier" | "population" | "sevi" | "state";

const STATUS_LABEL: Record<string, string> = {
  critical: "CRITICAL",
  alert: "ALERT",
  monitored: "MONITORED",
  allocated: "SAFELY ALLOCATED",
  relocating: "EVACUATING (IN TRANSIT)",
};

const STATUS_CLS: Record<string, string> = {
  critical: "ts-badge ts-badge-immediate",
  alert: "ts-badge ts-badge-high",
  monitored: "ts-badge ts-badge-medium",
  allocated: "ts-badge ts-badge-safe",
  relocating: "ts-badge ts-badge-low",
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export const RelocationQueuePage: React.FC = () => {
  const {
    habitations,
    safeSites,
    relocationOrders,
    openRelocationModal,
    completeRelocation,
    focusHabitationOnMap,
    bulkRelocateTier1,
  } = useDisaster();

  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [hazardFilter, setHazardFilter] = useState<"all" | HazardType>("all");
  const [tierFilter, setTierFilter] = useState<"all" | RelocationTier>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("tier");
  const [sortDesc, setSortDesc] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"queue" | "convoys">("queue");

  const states = Array.from(new Set(habitations.map(h => h.state))).sort();

  const inTransitOrders = relocationOrders.filter(o => o.status === "in_transit");
  const completedOrders = relocationOrders.filter(o => o.status === "completed");

  const filtered = useMemo(() => {
    return habitations
      .filter(
        h =>
          (search === "" ||
            h.name.toLowerCase().includes(search.toLowerCase()) ||
            h.district.toLowerCase().includes(search.toLowerCase()) ||
            h.state.toLowerCase().includes(search.toLowerCase())) &&
          (stateFilter === "all" || h.state === stateFilter) &&
          (hazardFilter === "all" || h.hazardType === hazardFilter) &&
          (tierFilter === "all" || h.tier === tierFilter) &&
          (statusFilter === "all" || h.status === statusFilter)
      )
      .sort((a, b) => {
        let aVal: number | string, bVal: number | string;
        if (sortKey === "tier") {
          aVal = a.tier;
          bVal = b.tier;
        } else if (sortKey === "population") {
          aVal = a.population;
          bVal = b.population;
        } else if (sortKey === "sevi") {
          aVal = a.sevi.overallScore;
          bVal = b.sevi.overallScore;
        } else {
          aVal = a.state;
          bVal = b.state;
        }
        if (typeof aVal === "string")
          return sortDesc
            ? (bVal as string).localeCompare(aVal as string)
            : (aVal as string).localeCompare(bVal as string);
        return sortDesc ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
      });
  }, [habitations, search, stateFilter, hazardFilter, tierFilter, statusFilter, sortKey, sortDesc]);

  const SortTh = ({ k, label }: { k: SortKey; label: string }) => (
    <th
      onClick={() => {
        if (sortKey === k) setSortDesc(!sortDesc);
        else {
          setSortKey(k);
          setSortDesc(false);
        }
      }}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortKey === k ? sortDesc ? <ChevronDown size={9} /> : <ChevronUp size={9} /> : null}
      </div>
    </th>
  );

  // Tier stats
  const t1Pending = habitations.filter(h => h.tier === 1 && h.status !== "allocated" && h.status !== "relocating").length;
  const t2 = habitations.filter(h => h.tier === 2).length;
  const t3 = habitations.filter(h => h.tier === 3).length;

  const exportCSV = () => {
    const headers = ["ID", "Name", "State", "District", "Hazard", "Tier", "Population", "Households", "SEVI", "Status", "Allocated_Site"];
    const rows = filtered.map(h => [
      h.id,
      `"${h.name}"`,
      `"${h.state}"`,
      `"${h.district}"`,
      h.hazardType,
      h.tier,
      h.population,
      h.households,
      h.sevi.overallScore.toFixed(1),
      h.status,
      `"${h.allocatedToSiteId || "Pending"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NDRF_Relocation_Priority_Queue_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--ts-border)", background: "var(--ts-surf-0)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-bold tracking-tight" style={{ color: "var(--ts-t100)", letterSpacing: "-0.01em" }}>
                Relocation Priority &amp; Evacuation Management
              </h2>
              {inTransitOrders.length > 0 && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800 animate-pulse">
                  <Bus size={11} /> {inTransitOrders.length} CONVOYS EN ROUTE
                </span>
              )}
            </div>
            <p className="text-[10.5px] mt-0.5" style={{ color: "var(--ts-t35)" }}>
              SEVI-triaged habitations under disaster distress · Direct MHA &amp; SDMA evacuation dispatch
            </p>
          </div>

          <div className="flex items-center gap-2">
            {t1Pending > 0 && (
              <button
                onClick={() => bulkRelocateTier1()}
                className="ts-btn ts-btn-amber flex items-center gap-1.5 text-xs py-1.5 px-3 font-bold"
                title="Trigger automated multi-agency evacuation for all pending Tier-1 distress habitations"
              >
                <Zap size={13} className="text-yellow-300 fill-yellow-300" />
                <span>Bulk Evacuate Tier-1 ({t1Pending})</span>
              </button>
            )}

            <button
              onClick={exportCSV}
              className="ts-btn flex items-center gap-1 text-xs py-1.5 px-2.5"
              title="Download queue as CSV spreadsheet"
            >
              <Download size={12} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs: Queue vs Active Convoys */}
        <div className="flex items-center gap-4 mt-3 border-b" style={{ borderColor: "var(--ts-border)" }}>
          <button
            onClick={() => setActiveTab("queue")}
            className="pb-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5"
            style={{
              borderColor: activeTab === "queue" ? "var(--ts-amber)" : "transparent",
              color: activeTab === "queue" ? "var(--ts-amber)" : "var(--ts-t35)",
            }}
          >
            <span>Priority Habitation Triage</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/10">{habitations.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("convoys")}
            className="pb-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5"
            style={{
              borderColor: activeTab === "convoys" ? "var(--ts-amber)" : "transparent",
              color: activeTab === "convoys" ? "var(--ts-amber)" : "var(--ts-t35)",
            }}
          >
            <Bus size={12} />
            <span>Active Evacuation Convoys</span>
            <span
              className="px-1.5 py-0.2 rounded text-[10px]"
              style={{ background: inTransitOrders.length > 0 ? "var(--ts-amber)" : "rgba(255,255,255,0.1)", color: inTransitOrders.length > 0 ? "#111" : undefined }}
            >
              {relocationOrders.length}
            </span>
          </button>
        </div>

        {/* Filter bar (only in queue tab) */}
        {activeTab === "queue" && (
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--ts-t20)" }} />
              <input
                className="ts-input pl-8"
                placeholder="Search habitation, district, state…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ height: 30, fontSize: 11.5 }}
              />
            </div>
            <select className="ts-select" value={stateFilter} onChange={e => setStateFilter(e.target.value)} style={{ height: 30 }}>
              <option value="all">All States</option>
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select className="ts-select" value={hazardFilter} onChange={e => setHazardFilter(e.target.value as "all" | HazardType)} style={{ height: 30 }}>
              <option value="all">All Hazards</option>
              <option value="landslide">Landslide</option>
              <option value="flood">Flood</option>
              <option value="coastal">Coastal</option>
              <option value="cloudburst">Cloudburst</option>
            </select>
            <select className="ts-select" value={tierFilter} onChange={e => setTierFilter(e.target.value === "all" ? "all" : (Number(e.target.value) as RelocationTier))} style={{ height: 30 }}>
              <option value="all">All Tiers</option>
              <option value="1">Tier 1 — Immediate ({t1Pending})</option>
              <option value="2">Tier 2 — Short-term ({t2})</option>
              <option value="3">Tier 3 — Medium-term ({t3})</option>
            </select>
            <select className="ts-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ height: 30 }}>
              <option value="all">All Statuses</option>
              <option value="critical">Critical</option>
              <option value="alert">Alert</option>
              <option value="relocating">Evacuating</option>
              <option value="allocated">Safely Allocated</option>
            </select>
            <span className="text-[10.5px]" style={{ color: "var(--ts-t20)" }}>
              {filtered.length} habitations
            </span>
          </div>
        )}
      </div>

      {/* BODY CONTENT: QUEUE TAB */}
      {activeTab === "queue" && (
        <div className="flex-1 overflow-auto">
          <table className="ts-table">
            <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
              <tr>
                <SortTh k="tier" label="Urgency" />
                <th>Habitation</th>
                <SortTh k="state" label="State / District" />
                <th>Hazard</th>
                <SortTh k="population" label="Population" />
                <SortTh k="sevi" label="SEVI Score" />
                <th>Status</th>
                <th>Quick Action</th>
                <th>Last Telemetry</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(hab => {
                const isSel = selected === hab.id;
                const isRelocating = hab.status === "relocating";
                const isAllocated = hab.status === "allocated";
                const assignedSite = safeSites.find(s => s.id === hab.allocatedToSiteId);

                return (
                  <React.Fragment key={hab.id}>
                    <tr
                      onClick={() => setSelected(isSel ? null : hab.id)}
                      style={{
                        background: isSel ? "rgba(201,134,26,0.05)" : undefined,
                        borderLeft: isSel ? "2px solid var(--ts-amber)" : "2px solid transparent",
                      }}
                    >
                      <td>
                        <TierBadge tier={hab.tier} />
                      </td>
                      <td>
                        <div className="font-medium text-[12px]" style={{ color: "var(--ts-t100)" }}>
                          {hab.name}
                        </div>
                        <div className="font-data text-[9.5px] mt-0.5" style={{ color: "var(--ts-t20)" }}>
                          {hab.id}
                        </div>
                      </td>
                      <td>
                        <div className="text-[12px]" style={{ color: "var(--ts-t60)" }}>{hab.state}</div>
                        <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>{hab.district}</div>
                      </td>
                      <td>
                        <HazardBadge type={hab.hazardType} />
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Users size={11} style={{ color: "var(--ts-t20)" }} />
                          <span className="font-data text-[11.5px]">{hab.population.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="text-[9.5px] mt-0.5" style={{ color: "var(--ts-t20)" }}>
                          {hab.households.toLocaleString("en-IN")} households
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <div className="h-1 flex-1 max-w-[60px] rounded-none overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                            <div
                              className="h-full"
                              style={{
                                width: `${hab.sevi.overallScore}%`,
                                background:
                                  hab.sevi.overallScore >= 80
                                    ? "#B83232"
                                    : hab.sevi.overallScore >= 65
                                    ? "#C9861A"
                                    : "#3EA8C4",
                              }}
                            />
                          </div>
                          <span className="font-data text-[11.5px]" style={{ color: "var(--ts-t60)" }}>
                            {hab.sevi.overallScore.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={STATUS_CLS[hab.status] ?? "ts-badge"}>
                          {STATUS_LABEL[hab.status] ?? hab.status}
                        </span>
                        {assignedSite && (
                          <div className="text-[9.5px] text-teal-300 mt-0.5">
                            → {assignedSite.name.slice(0, 22)}…
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          {!isAllocated && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                openRelocationModal(hab);
                              }}
                              className={`px-2.5 py-1 rounded text-[10.5px] font-bold transition-all cursor-pointer ${
                                isRelocating
                                  ? "bg-amber-900/60 text-amber-200 border border-amber-700"
                                  : "bg-red-700/80 hover:bg-red-600 text-white border border-red-500"
                              }`}
                            >
                              {isRelocating ? "Manage Convoy" : "🚨 Relocate"}
                            </button>
                          )}
                          {isAllocated && (
                            <span className="text-[10.5px] text-emerald-400 flex items-center gap-1 font-semibold">
                              <CheckCircle2 size={12} /> Settled
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="font-data text-[10.5px]" style={{ color: "var(--ts-t35)" }}>
                          {fmt(hab.lastUpdated)}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded row with full action suite */}
                    {isSel && (
                      <tr>
                        <td colSpan={9} style={{ background: "rgba(201,134,26,0.04)", padding: 0 }}>
                          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                              <div className="text-[9px] uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--ts-t20)" }}>
                                Geo-hazard Metrics
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between">
                                  <span className="text-[10.5px]" style={{ color: "var(--ts-t35)" }}>Slope Angle</span>
                                  <span className="font-data text-[10.5px]">{hab.slopeAngle}°</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[10.5px]" style={{ color: "var(--ts-t35)" }}>InSAR Velocity</span>
                                  <span className="font-data text-[10.5px] text-red-400">{hab.insarDisplacementRate} mm/yr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[10.5px]" style={{ color: "var(--ts-t35)" }}>Pore Pressure</span>
                                  <span className="font-data text-[10.5px]">{hab.porePressureIndex} kPa</span>
                                </div>
                                {hab.inundationDepthMax && (
                                  <div className="flex justify-between">
                                    <span className="text-[10.5px]" style={{ color: "var(--ts-t35)" }}>Max Inundation</span>
                                    <span className="font-data text-[10.5px]">{hab.inundationDepthMax} m</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="text-[9px] uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--ts-t20)" }}>
                                SEVI Components
                              </div>
                              <div className="flex flex-col gap-1.5">
                                {[
                                  ["Physical Exposure", hab.sevi.physicalExposure],
                                  ["Socio-Econ Fragility", hab.sevi.socioEconomicFragility],
                                  ["Coping Capacity Gap", hab.sevi.lackOfCopingCapacity],
                                  ["Infra Deficit", hab.sevi.infrastructureDeficit],
                                  ["Env. Degradation", hab.sevi.environmentalDegradation],
                                ].map(([label, val]) => (
                                  <div key={label as string} className="flex items-center justify-between gap-3">
                                    <span className="text-[10px]" style={{ color: "var(--ts-t35)" }}>{label as string}</span>
                                    <div className="flex items-center gap-1.5">
                                      <div className="h-1 w-12 rounded-none overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                                        <div className="h-full" style={{ width: `${val}%`, background: "#C9861A" }} />
                                      </div>
                                      <span className="font-data text-[10px]">{val as number}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="text-[9px] uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--ts-t20)" }}>
                                Location &amp; Destination
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-1.5">
                                  <MapPin size={10} style={{ color: "var(--ts-t20)" }} />
                                  <span className="font-data text-[10px]">
                                    {hab.coordinates[0].toFixed(4)}°N, {hab.coordinates[1].toFixed(4)}°E
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[10.5px]" style={{ color: "var(--ts-t35)" }}>Fault Line</span>
                                  <span className="font-data text-[10.5px]">{hab.distanceToFault} km</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[10.5px]" style={{ color: "var(--ts-t35)" }}>River Basin</span>
                                  <span className="font-data text-[10.5px]">{hab.distanceToRiver} km</span>
                                </div>
                                {assignedSite && (
                                  <div className="mt-1 p-1.5 rounded bg-teal-950/40 border border-teal-800/40 text-[10px] text-teal-300">
                                    Assigned Safe Site: <strong>{assignedSite.name}</strong>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 justify-center">
                              <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "var(--ts-t20)" }}>
                                Action Dispatch
                              </div>
                              <button
                                onClick={() => openRelocationModal(hab)}
                                className="ts-btn ts-btn-amber text-[11px] justify-center font-bold"
                              >
                                {isRelocating ? "Manage Relocation Order" : "🚨 Dispatch Evacuation Plan"}
                              </button>
                              <button
                                onClick={() => focusHabitationOnMap(hab)}
                                className="ts-btn text-[11px] justify-center"
                              >
                                <MapPin size={11} /> View on Tactical Map
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16" style={{ color: "var(--ts-t20)" }}>
              <Filter size={24} className="mb-3 opacity-30" />
              <span className="text-[12px]">No habitations match the current filters</span>
            </div>
          )}
        </div>
      )}

      {/* BODY CONTENT: CONVOYS TAB */}
      {activeTab === "convoys" && (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Active Convoys List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Bus size={14} /> Active Evacuation Operations in Transit ({inTransitOrders.length})
              </h3>
              <span className="text-[11px]" style={{ color: "var(--ts-t35)" }}>
                Live satellite telemetry &amp; escort tracking
              </span>
            </div>

            {inTransitOrders.length === 0 ? (
              <div className="ts-card p-8 text-center" style={{ color: "var(--ts-t35)" }}>
                <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500 opacity-60" />
                <div className="text-sm font-semibold text-white">No Active Evacuation Convoys Right Now</div>
                <div className="text-xs text-white/50 mt-1">
                  All distress missions have either reached safe havens or are awaiting dispatch from the priority queue.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {inTransitOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-5 rounded-lg border flex flex-col gap-4"
                    style={{ background: "var(--ts-surf-1)", borderColor: "var(--ts-border)" }}
                  >
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">
                            {order.habitationName} → {order.destinationSiteName}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">
                            IN TRANSIT
                          </span>
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--ts-t35)" }}>
                          Directive ID: <span className="font-mono text-orange-200">{order.id}</span> · Assigned Battalion: <strong>{order.battalionUnit}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => completeRelocation(order.id)}
                          className="px-3 py-1.5 rounded text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={13} /> Mark Safely Settled (Complete)
                        </button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5 font-data">
                        <span style={{ color: "var(--ts-t60)" }}>Transit Corridor Progress</span>
                        <span className="text-amber-400 font-bold">{order.progressPct}% Completed</span>
                      </div>
                      <div className="w-full h-2 rounded bg-black/40 overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                          style={{ width: `${order.progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Fleet & Logistics breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t text-xs" style={{ borderColor: "var(--ts-border)" }}>
                      <div>
                        <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Evacuees in Transit</div>
                        <div className="font-bold text-white font-data mt-0.5">{order.population.toLocaleString("en-IN")} persons</div>
                      </div>
                      <div>
                        <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Convoy Fleet</div>
                        <div className="font-bold text-white font-data mt-0.5">{order.busesAssigned} Buses · {order.ambulancesAssigned} Ambulances</div>
                      </div>
                      <div>
                        <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Transit Corridor</div>
                        <div className="font-bold text-white font-data mt-0.5">{order.distanceKm} km</div>
                      </div>
                      <div>
                        <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Estimated Time to Arrival</div>
                        <div className="font-bold text-amber-300 font-data mt-0.5 flex items-center gap-1">
                          <Clock size={11} /> {order.etaMinutes} minutes
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Missions Archive */}
          {completedOrders.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                <CheckCircle2 size={14} /> Completed Relocations &amp; Settled Populations ({completedOrders.length})
              </h3>
              <div className="divide-y rounded-lg border overflow-hidden" style={{ borderColor: "var(--ts-border)", background: "var(--ts-surf-0)" }}>
                {completedOrders.map(order => (
                  <div key={order.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-xs text-white">
                        {order.habitationName} → {order.destinationSiteName}
                      </div>
                      <div className="text-[11px]" style={{ color: "var(--ts-t35)" }}>
                        {order.population.toLocaleString("en-IN")} residents safely sheltered · Order: {order.id}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      SAFELY SETTLED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
