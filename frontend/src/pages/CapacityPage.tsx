import React, { useState } from "react";
import {
  CheckSquare, Square, ArrowUpDown, Droplets, Zap, Heart,
  School, MapPin, Gauge, AlertTriangle, ShieldCheck, Sliders, Users
} from "lucide-react";
import { useDisaster } from "../context/DisasterContext";
import type { SafeRelocationSite } from "../types";

function CapBar({ used, total, color }: { used: number; total: number; color: string }) {
  const pct = Math.min((used / total) * 100, 100);
  return (
    <div className="w-full rounded-none overflow-hidden" style={{ height: 3, background: "rgba(255,255,255,0.08)" }}>
      <div className="h-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function MetricRow({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5" style={{ color: "var(--ts-t35)" }}>
        <span className="flex-shrink-0">{icon}</span>
        <span className="text-[10.5px]">{label}</span>
      </div>
      <span className="font-data text-[11px]" style={{ color: "var(--ts-t60)" }}>
        {typeof value === "number" ? value.toLocaleString("en-IN") : value}
        {unit && <span className="text-[9px] ml-0.5" style={{ color: "var(--ts-t20)" }}>{unit}</span>}
      </span>
    </div>
  );
}

const SITE_TYPE_LABELS: Record<string, string> = {
  engineered_plateau: "Engineered Plateau",
  resilient_township: "Resilient Township",
  elevated_ridge: "Elevated Ridge",
  coastal_inland_haven: "Coastal Inland Haven",
};

type SortKey = "suitabilityScore" | "maxPopulationCapacity" | "costPerFamilyLakhs" | "soilStabilityIndex";

export const CapacityPage: React.FC = () => {
  const { safeSites, habitations, openRelocationModal } = useDisaster();

  const [compared, setCompared] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("suitabilityScore");
  const [sortDesc, setSortDesc] = useState(true);

  // Stress test simulator state
  const [simulatorSiteId, setSimulatorSiteId] = useState<string>(safeSites[0]?.id || "");
  const [addedEvacuees, setAddedEvacuees] = useState<number>(2000);

  const sorted = [...safeSites].sort((a, b) =>
    sortDesc ? (b[sortKey] as number) - (a[sortKey] as number) : (a[sortKey] as number) - (b[sortKey] as number)
  );

  const toggleCompare = (id: string) => {
    setCompared(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const comparedSites = safeSites.filter(s => compared.includes(s.id));

  const cycleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc(!sortDesc);
    else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => cycleSort(k)}
      className="ts-btn text-[10px]"
      style={{
        gap: 4,
        padding: "4px 8px",
        borderColor: sortKey === k ? "var(--ts-amber)" : undefined,
        color: sortKey === k ? "var(--ts-amber)" : undefined,
      }}
    >
      {label} <ArrowUpDown size={9} />
    </button>
  );

  // Simulator site calculation
  const simSite = safeSites.find(s => s.id === simulatorSiteId) || safeSites[0];
  const simTotalPop = simSite ? simSite.allocatedPopulation + addedEvacuees : 0;
  const simCapacityPct = simSite ? Math.round((simTotalPop / simSite.maxPopulationCapacity) * 100) : 0;
  const simWaterPerCapita = simSite && simTotalPop > 0 ? Math.round(simSite.waterSupplyLpdTotal / simTotalPop) : 0;
  const simAreaPerCapita = simSite && simTotalPop > 0 ? Math.round(simSite.usableAreaSqMeters / simTotalPop) : 0;
  const isOverCapacity = simCapacityPct > 100;
  const isWaterStress = simWaterPerCapita < 60;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--ts-border)", background: "var(--ts-surf-0)" }}
      >
        <div>
          <h2 className="text-[14px] font-bold tracking-tight" style={{ color: "var(--ts-t100)", letterSpacing: "-0.01em" }}>
            Safe Haven Carrying Capacity Assessment
          </h2>
          <p className="text-[10.5px] mt-0.5" style={{ color: "var(--ts-t35)" }}>
            Candidate relocation sites · Real-time headroom, water security &amp; stress-test simulator
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px]" style={{ color: "var(--ts-t20)" }}>Sort by:</span>
          <SortBtn k="suitabilityScore" label="Suitability" />
          <SortBtn k="maxPopulationCapacity" label="Capacity" />
          <SortBtn k="costPerFamilyLakhs" label="Cost/Family" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Interactive Carrying Capacity Stress-Test Simulator */}
        {simSite && (
          <div
            className="p-5 rounded-lg border flex flex-col gap-4 shadow-lg"
            style={{ background: "rgba(11, 18, 32, 0.8)", borderColor: "var(--ts-border)" }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Safe Zone Relocation Stress-Test Simulator
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px]" style={{ color: "var(--ts-t35)" }}>Target Safe Haven:</span>
                <select
                  className="ts-select text-xs py-1 px-2"
                  value={simulatorSiteId}
                  onChange={e => setSimulatorSiteId(e.target.value)}
                  style={{ height: 28 }}
                >
                  {safeSites.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.district}, {s.state})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slider Control */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: "var(--ts-t60)" }}>Simulate Incoming Distressed Evacuees:</span>
                <span className="font-bold text-amber-300 font-data text-sm">
                  +{addedEvacuees.toLocaleString("en-IN")} persons
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10000}
                step={250}
                value={addedEvacuees}
                onChange={e => setAddedEvacuees(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Simulated Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="ts-card p-3 flex flex-col gap-1">
                <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Projected Total Occupancy</div>
                <div className="text-base font-bold font-data" style={{ color: isOverCapacity ? "#EF4444" : "#10B981" }}>
                  {simTotalPop.toLocaleString("en-IN")} / {simSite.maxPopulationCapacity.toLocaleString("en-IN")}
                </div>
                <div className="text-[10px] font-semibold" style={{ color: isOverCapacity ? "#EF4444" : "#10B981" }}>
                  {simCapacityPct}% {isOverCapacity ? "(BREACHED)" : "(Within Limits)"}
                </div>
              </div>

              <div className="ts-card p-3 flex flex-col gap-1">
                <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Water Security Per Capita</div>
                <div className="text-base font-bold font-data" style={{ color: isWaterStress ? "#F59E0B" : "#3EA8C4" }}>
                  {simWaterPerCapita} Litres/day
                </div>
                <div className="text-[10px]" style={{ color: isWaterStress ? "#F59E0B" : "var(--ts-t20)" }}>
                  {isWaterStress ? "⚠️ Near humanitarian min (50L)" : "✓ Optimal supply standard"}
                </div>
              </div>

              <div className="ts-card p-3 flex flex-col gap-1">
                <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Shelter Space Density</div>
                <div className="text-base font-bold font-data text-white">
                  {simAreaPerCapita} m²/person
                </div>
                <div className="text-[10px]" style={{ color: "var(--ts-t20)" }}>
                  SPHERE Standard: &gt; 3.5 m²
                </div>
              </div>

              <div className="ts-card p-3 flex flex-col gap-1">
                <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Hospital Bed Headroom</div>
                <div className="text-base font-bold font-data text-white">
                  {simSite.healthcareBedsAvailable} Beds
                </div>
                <div className="text-[10px]" style={{ color: "var(--ts-t20)" }}>
                  Field Trauma Unit on stand-by
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Site cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map(site => {
            const isCompared = compared.includes(site.id);
            const remaining = site.maxPopulationCapacity - site.allocatedPopulation;
            const capUsedPct = Math.round((site.allocatedPopulation / site.maxPopulationCapacity) * 100);
            const score = site.suitabilityScore;
            const scoreColor = score >= 88 ? "#2A7F76" : score >= 78 ? "#C9861A" : "#B83232";

            return (
              <div
                key={site.id}
                className="ts-card flex flex-col gap-0 overflow-hidden transition-all"
                style={{ borderColor: isCompared ? "var(--ts-amber)" : undefined }}
              >
                {/* Card header */}
                <div className="px-4 pt-4 pb-3 flex flex-col gap-1" style={{ borderBottom: "1px solid var(--ts-border)" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm" style={{ color: "var(--ts-t100)" }}>
                        {site.name}
                      </div>
                      <div className="text-[11px]" style={{ color: "var(--ts-t35)" }}>
                        {site.district}, {site.state} · {SITE_TYPE_LABELS[site.siteType] ?? site.siteType}
                      </div>
                    </div>
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded font-data font-bold text-xs"
                      style={{ background: `${scoreColor}22`, color: scoreColor, border: `1px solid ${scoreColor}55` }}
                    >
                      {score}
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  {/* Capacity bar */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span style={{ color: "var(--ts-t35)" }}>Population Intake:</span>
                      <span className="font-data" style={{ color: "var(--ts-t60)" }}>
                        {site.allocatedPopulation.toLocaleString("en-IN")} / {site.maxPopulationCapacity.toLocaleString("en-IN")} ({capUsedPct}%)
                      </span>
                    </div>
                    <CapBar used={site.allocatedPopulation} total={site.maxPopulationCapacity} color="#3EA8C4" />
                    <div className="text-[9.5px] mt-1 text-teal-400 font-semibold">
                      {remaining.toLocaleString("en-IN")} evacuee headroom available
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t" style={{ borderColor: "var(--ts-border)" }}>
                    <MetricRow icon={<Droplets size={11} />} label="Daily Water Supply" value={site.waterSupplyLpdTotal} unit="L/day" />
                    <MetricRow icon={<Zap size={11} />} label="Power Grid Capacity" value={site.powerGridKwTotal} unit="kW" />
                    <MetricRow icon={<Heart size={11} />} label="Emergency Healthcare Beds" value={site.healthcareBedsAvailable} />
                    <MetricRow icon={<School size={11} />} label="School/Shelter Capacity" value={site.schoolCapacityHeadroom} />
                    <MetricRow icon={<MapPin size={11} />} label="Transit Road Class" value={site.transitRoadClass.split("(")[0]} />
                  </div>
                </div>

                {/* Card footer */}
                <div
                  className="px-4 py-2.5 flex items-center justify-between"
                  style={{ borderTop: "1px solid var(--ts-border)", background: "rgba(255,255,255,0.02)" }}
                >
                  <button
                    onClick={() => toggleCompare(site.id)}
                    className="flex items-center gap-1.5 text-[11px] cursor-pointer"
                    style={{ color: isCompared ? "var(--ts-amber)" : "var(--ts-t35)" }}
                  >
                    {isCompared ? <CheckSquare size={13} /> : <Square size={13} />}
                    <span>{isCompared ? "Compared" : "Compare"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setSimulatorSiteId(site.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="ts-btn text-[10.5px] py-1 px-2.5"
                  >
                    Stress-Test Site
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison drawer if items selected */}
        {comparedSites.length > 0 && (
          <div
            className="p-5 rounded-lg border flex flex-col gap-4 shadow-xl"
            style={{ background: "var(--ts-surf-1)", borderColor: "var(--ts-amber)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare size={15} className="text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Safe Site Comparison ({comparedSites.length} of 3 selected)
                </h4>
              </div>
              <button
                onClick={() => setCompared([])}
                className="text-xs text-white/50 hover:text-white"
              >
                Clear comparison
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparedSites.map(site => (
                <div key={site.id} className="p-3 rounded bg-black/30 border border-white/10 flex flex-col gap-2">
                  <div className="font-bold text-xs text-white">{site.name}</div>
                  <div className="text-[11px]" style={{ color: "var(--ts-t35)" }}>
                    {site.district}, {site.state}
                  </div>
                  <div className="text-xs text-teal-300 font-semibold font-data">
                    Headroom: {(site.maxPopulationCapacity - site.allocatedPopulation).toLocaleString("en-IN")} persons
                  </div>
                  <div className="text-[11px] text-white/70">
                    Water: {Math.round(site.waterSupplyLpdTotal / site.maxPopulationCapacity)} L/person/day
                  </div>
                  <div className="text-[11px] text-white/70">
                    Beds: {site.healthcareBedsAvailable} · Soil Stability: {site.soilStabilityIndex}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
