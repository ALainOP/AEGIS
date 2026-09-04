import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Tooltip, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Layers, Eye, EyeOff, ChevronRight, X, AlertTriangle,
  Bus, ShieldCheck, MapPin, Navigation, ArrowRight, Zap
} from "lucide-react";
import { useDisaster } from "../context/DisasterContext";
import { HazardBadge, TierBadge } from "../components/ui/Badges";
import type { Habitation, SafeRelocationSite } from "../types";

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

function MapFly({ hab }: { hab: Habitation | null }) {
  const map = useMap();
  useEffect(() => {
    if (hab) map.flyTo(hab.coordinates, 10, { duration: 1.2 });
  }, [hab, map]);
  return null;
}

function createIcon(color: string, selected: boolean, isRelocating: boolean) {
  const size = selected ? 16 : 11;
  const pulse = isRelocating ? "animation: pulse 1s infinite;" : "";
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid ${
      selected ? "white" : color + "99"
    };box-shadow:0 0 8px ${color};${pulse}"></div>`,
  });
}

function createSiteIcon(selected: boolean) {
  const s = selected ? 16 : 11;
  return L.divIcon({
    className: "",
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
    html: `<div style="width:${s}px;height:${s}px;background:#2A7F76;border:2px solid ${
      selected ? "white" : "#2A7F7699"
    };box-shadow:0 0 6px #2A7F7666;transform:rotate(45deg);"></div>`,
  });
}

const TIER_COLORS: Record<number, string> = { 1: "#B83232", 2: "#C9861A", 3: "#3EA8C4" };

export const RedZoneMapPage: React.FC = () => {
  const {
    habitations,
    safeSites,
    relocationOrders,
    openRelocationModal,
    selectedHabForMap,
  } = useDisaster();

  const [showRed, setShowRed] = useState(true);
  const [showSafe, setShowSafe] = useState(true);
  const [showCorridors, setShowCorridors] = useState(true);
  const [hazardFilter, setHazardFilter] = useState<string>("all");
  const [mapStyle, setMapStyle] = useState<"dark" | "satellite" | "osm">("dark");
  const [selected, setSelected] = useState<Habitation | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

  // If a habitation was selected externally (e.g. from queue or overview), select it
  useEffect(() => {
    if (selectedHabForMap) {
      setSelected(selectedHabForMap);
    }
  }, [selectedHabForMap]);

  const tileUrl =
    mapStyle === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : mapStyle === "satellite"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const filteredHabs = habitations.filter(h => hazardFilter === "all" || h.hazardType === hazardFilter);
  const sortedHabs = [...filteredHabs].sort((a, b) => a.tier - b.tier || b.sevi.overallScore - a.sevi.overallScore);

  const tierLabel = (tier: number) => (tier === 1 ? "IMMEDIATE" : tier === 2 ? "SHORT-TERM" : "MEDIUM-TERM");
  const tierBadgeCls = (tier: number) =>
    tier === 1 ? "ts-badge ts-badge-immediate" : tier === 2 ? "ts-badge ts-badge-short" : "ts-badge ts-badge-medium-t";

  // Find active relocation order if selected habitation is in transit
  const activeOrder = selected ? relocationOrders.find(o => o.habitationId === selected.id && o.status === "in_transit") : null;
  const destinationSite = selected
    ? safeSites.find(s => s.id === selected.allocatedToSiteId) ||
      safeSites.find(s => s.state === selected.state) ||
      safeSites[0]
    : null;

  return (
    <div className="flex h-full overflow-hidden relative">
      {/* ── Layer panel (left) ── */}
      <div
        className="flex flex-col flex-shrink-0 z-10"
        style={{ width: 210, background: "var(--ts-surf-0)", borderRight: "1px solid var(--ts-border)" }}
      >
        {/* Header */}
        <div className="px-3 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--ts-border)" }}>
          <div className="flex items-center gap-1.5">
            <Layers size={12} style={{ color: "var(--ts-amber)" }} />
            <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--ts-t35)" }}>
              Tactical Layers
            </span>
          </div>
        </div>

        {/* Layers */}
        <div className="px-3 py-3 flex flex-col gap-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--ts-border)" }}>
          <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "var(--ts-t20)" }}>
            Overlays
          </div>
          {[
            { key: "showRed", label: "Red Hazard Zones", state: showRed, set: setShowRed, color: "#B83232" },
            { key: "showSafe", label: "Safe Havens / Camps", state: showSafe, set: setShowSafe, color: "#2A7F76" },
            { key: "showCorridors", label: "Evacuation Corridors", state: showCorridors, set: setShowCorridors, color: "#C9861A" },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-2.5 cursor-pointer">
              <button
                onClick={() => item.set(!item.state)}
                className="flex-shrink-0 rounded-none transition-colors"
                style={{
                  width: 14,
                  height: 14,
                  border: `1px solid ${item.state ? item.color : "rgba(255,255,255,0.2)"}`,
                  background: item.state ? `${item.color}30` : "transparent",
                  cursor: "pointer",
                }}
              >
                {item.state && <div style={{ width: "100%", height: "100%", background: item.color, opacity: 0.8 }} />}
              </button>
              <span className="text-[11.5px]" style={{ color: item.state ? "var(--ts-t60)" : "var(--ts-t20)" }}>
                {item.label}
              </span>
              {item.state ? (
                <Eye size={10} style={{ color: "var(--ts-t20)", marginLeft: "auto" }} />
              ) : (
                <EyeOff size={10} style={{ color: "var(--ts-t20)", marginLeft: "auto" }} />
              )}
            </label>
          ))}
        </div>

        {/* Hazard filter */}
        <div className="px-3 py-3 flex flex-col gap-2 flex-shrink-0" style={{ borderBottom: "1px solid var(--ts-border)" }}>
          <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "var(--ts-t20)" }}>
            Hazard Type
          </div>
          {["all", "landslide", "flood", "coastal", "cloudburst"].map(h => (
            <button
              key={h}
              onClick={() => setHazardFilter(h)}
              className="text-left text-[11px] px-2 py-1 rounded-sm transition-colors"
              style={{
                background: hazardFilter === h ? "rgba(201,134,26,0.1)" : "transparent",
                color: hazardFilter === h ? "var(--ts-amber)" : "var(--ts-t35)",
                border: hazardFilter === h ? "1px solid rgba(201,134,26,0.25)" : "1px solid transparent",
              }}
            >
              {h === "all" ? "All Hazards" : h.charAt(0).toUpperCase() + h.slice(1)}
            </button>
          ))}
        </div>

        {/* Map style */}
        <div className="px-3 py-3 flex flex-col gap-2 flex-shrink-0" style={{ borderBottom: "1px solid var(--ts-border)" }}>
          <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "var(--ts-t20)" }}>
            Basemap
          </div>
          {[
            ["dark", "Dark (Tactical)"],
            ["satellite", "Satellite (ESRI)"],
            ["osm", "Street (OSM)"],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setMapStyle(k as "dark" | "satellite" | "osm")}
              className="text-left text-[11px] px-2 py-1 rounded-sm transition-colors"
              style={{
                background: mapStyle === k ? "rgba(201,134,26,0.1)" : "transparent",
                color: mapStyle === k ? "var(--ts-amber)" : "var(--ts-t35)",
                border: mapStyle === k ? "1px solid rgba(201,134,26,0.25)" : "1px solid transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Severity legend */}
        <div className="px-3 py-3 flex flex-col gap-2">
          <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "var(--ts-t20)" }}>
            Severity Legend
          </div>
          {[
            ["Tier 1 — Immediate", "#B83232"],
            ["Tier 2 — Short-term", "#C9861A"],
            ["Tier 3 — Medium-term", "#3EA8C4"],
            ["Safe Relocation Camp", "#2A7F76"],
          ].map(([label, color]) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-none flex-shrink-0" style={{ background: color }} />
              <span className="text-[10.5px]" style={{ color: "var(--ts-t35)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Map ── */}
      <div className="flex-1 relative h-full">
        <MapContainer center={[23.5937, 80.9629]} zoom={5} scrollWheelZoom className="h-full w-full">
          <MapFly hab={selected} />
          <TileLayer url={tileUrl} attribution="&copy; CartoDB / ESRI / OSM" />

          {/* Red zone polygons */}
          {showRed &&
            filteredHabs.map(hab => {
              const color = TIER_COLORS[hab.tier] ?? "#3EA8C4";
              const isSel = selected?.id === hab.id;
              const isRelocating = hab.status === "relocating";
              return (
                <React.Fragment key={hab.id}>
                  <Polygon
                    positions={hab.polygonCoordinates}
                    pathOptions={{
                      color: isRelocating ? "#F59E0B" : color,
                      weight: isSel ? 3 : 1.5,
                      fillColor: isRelocating ? "#F59E0B" : color,
                      fillOpacity: isSel ? 0.4 : 0.18,
                      dashArray: isSel || isRelocating ? "6,4" : undefined,
                    }}
                    eventHandlers={{ click: () => setSelected(isSel ? null : hab) }}
                  >
                    <Tooltip sticky>
                      <div style={{ fontFamily: "IBM Plex Mono", fontSize: 10, lineHeight: 1.6 }}>
                        <strong>{hab.name}</strong><br />
                        Status: <span style={{ textTransform: "uppercase", color: isRelocating ? "#F59E0B" : color }}>{hab.status}</span><br />
                        Tier {hab.tier} · {hab.population.toLocaleString("en-IN")} persons<br />
                        InSAR: {hab.insarDisplacementRate} mm/yr · Pore: {hab.porePressureIndex} kPa
                      </div>
                    </Tooltip>
                  </Polygon>
                  <Marker
                    position={hab.coordinates}
                    icon={createIcon(color, isSel, isRelocating)}
                    eventHandlers={{ click: () => setSelected(isSel ? null : hab) }}
                  />
                </React.Fragment>
              );
            })}

          {/* Safe site polygons */}
          {showSafe &&
            safeSites.map(site => {
              return (
                <React.Fragment key={site.id}>
                  <Polygon
                    positions={site.polygonCoordinates}
                    pathOptions={{ color: "#2A7F76", weight: 1.5, fillColor: "#2A7F76", fillOpacity: 0.18 }}
                  >
                    <Tooltip sticky>
                      <div style={{ fontFamily: "IBM Plex Mono", fontSize: 10, lineHeight: 1.6 }}>
                        <strong style={{ color: "#3AA496" }}>{site.name}</strong><br />
                        Capacity: {site.maxPopulationCapacity.toLocaleString("en-IN")} persons<br />
                        Allocated: {site.allocatedPopulation.toLocaleString("en-IN")} · Headroom: {(site.maxPopulationCapacity - site.allocatedPopulation).toLocaleString("en-IN")}
                      </div>
                    </Tooltip>
                  </Polygon>
                  <Marker position={site.coordinates} icon={createSiteIcon(false)} />
                </React.Fragment>
              );
            })}

          {/* Evacuation corridor polyline when habitation is selected */}
          {showCorridors && selected && destinationSite && (
            <Polyline
              positions={[selected.coordinates, destinationSite.coordinates]}
              pathOptions={{
                color: selected.status === "relocating" ? "#F59E0B" : "#3EA8C4",
                weight: 2.5,
                dashArray: "8, 6",
                opacity: 0.85,
              }}
            />
          )}
        </MapContainer>

        {/* Bottom Tactical Action Drawer when a Habitation is selected */}
        {selected && (
          <div
            className="absolute bottom-4 left-4 right-4 z-40 p-4 rounded-lg shadow-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in"
            style={{ background: "rgba(11, 18, 32, 0.95)", borderColor: "var(--ts-border)", backdropFilter: "blur(8px)" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: selected.status === "relocating" ? "rgba(245,158,11,0.2)" : "rgba(184,50,50,0.2)" }}
              >
                <AlertTriangle size={20} className={selected.status === "relocating" ? "text-amber-400" : "text-red-400"} />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-sm text-white">{selected.name}</h4>
                  <TierBadge tier={selected.tier} />
                  <span className="text-xs text-white/50">
                    {selected.district}, {selected.state}
                  </span>
                  {selected.status === "relocating" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">
                      CONVOY IN TRANSIT
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-1 text-xs text-white/70 flex-wrap">
                  <span>Pop: <strong className="text-white font-data">{selected.population.toLocaleString("en-IN")}</strong> ({selected.households} hh)</span>
                  <span>InSAR: <strong className="text-red-400 font-data">{selected.insarDisplacementRate} mm/yr</strong></span>
                  <span>Slope: <strong className="text-white font-data">{selected.slopeAngle}°</strong></span>
                  <span>SEVI Score: <strong className="text-amber-400 font-data">{selected.sevi.overallScore.toFixed(1)}</strong></span>
                </div>
              </div>
            </div>

            {/* Destination match + Action */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {destinationSite && (
                <div className="hidden lg:block text-right text-xs">
                  <div className="text-teal-300 font-semibold">
                    Dest: {destinationSite.name.slice(0, 24)}…
                  </div>
                  <div className="text-[10px] text-white/40">
                    Road: {destinationSite.transitRoadClass.split("(")[0]}
                  </div>
                </div>
              )}

              <button
                onClick={() => openRelocationModal(selected)}
                className="ts-btn ts-btn-amber px-5 py-2 text-xs font-bold flex items-center gap-2"
              >
                <Zap size={14} className="text-yellow-200 fill-yellow-200" />
                <span>{selected.status === "relocating" ? "Manage Relocation Convoy" : "🚨 Relocate Habitation Now"}</span>
              </button>

              <button
                onClick={() => setSelected(null)}
                className="p-1.5 text-white/50 hover:text-white rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Zone list panel (right) ── */}
      {panelOpen && (
        <div
          className="flex flex-col flex-shrink-0 overflow-hidden z-10"
          style={{ width: 300, background: "var(--ts-surf-0)", borderLeft: "1px solid var(--ts-border)" }}
        >
          <div className="flex items-center justify-between px-3 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--ts-border)" }}>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--ts-t35)" }}>
                Distressed Zones
              </div>
              <div className="text-[9.5px] mt-0.5" style={{ color: "var(--ts-t20)" }}>
                {sortedHabs.length} zones · sorted by severity
              </div>
            </div>
            <button onClick={() => setPanelOpen(false)} className="ts-btn ts-btn-ghost p-1" style={{ width: 24, height: 24 }}>
              <X size={12} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: "var(--ts-border)" }}>
            {sortedHabs.map(hab => {
              const isSel = selected?.id === hab.id;
              const color = TIER_COLORS[hab.tier] ?? "#3EA8C4";
              const isRelocating = hab.status === "relocating";
              return (
                <div
                  key={hab.id}
                  onClick={() => setSelected(isSel ? null : hab)}
                  className="px-3 py-3 cursor-pointer transition-colors flex flex-col gap-2"
                  style={{
                    background: isSel ? "rgba(201,134,26,0.07)" : "transparent",
                    borderLeft: isSel ? "2px solid var(--ts-amber)" : "2px solid transparent",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[12px] font-medium leading-snug" style={{ color: "var(--ts-t100)" }}>
                      {hab.name}
                    </span>
                    <span className={tierBadgeCls(hab.tier)} style={{ fontSize: 8, flexShrink: 0 }}>
                      {tierLabel(hab.tier)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <HazardBadge type={hab.hazardType} />
                    <span className="text-[10px]" style={{ color: "var(--ts-t35)" }}>
                      {hab.district}, {hab.state}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[9px] uppercase tracking-widest" style={{ color: "var(--ts-t20)" }}>
                        Intensity
                      </div>
                      <div className="font-data text-[12px] font-bold" style={{ color }}>
                        {hab.sevi.overallScore.toFixed(1)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-widest" style={{ color: "var(--ts-t20)" }}>
                        Population
                      </div>
                      <div className="font-data text-[12px]" style={{ color: "var(--ts-t60)" }}>
                        {hab.population.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-data text-[9.5px]" style={{ color: "var(--ts-t20)" }}>
                      {fmt(hab.lastUpdated)}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        openRelocationModal(hab);
                      }}
                      className="text-[10px] px-2 py-0.5 rounded font-semibold bg-amber-900/40 text-amber-300 hover:bg-amber-800/60 transition-colors"
                    >
                      {isRelocating ? "Convoy" : "Relocate"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Show panel button when collapsed */}
      {!panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 ts-btn-amber ts-btn z-30"
          style={{ writingMode: "vertical-lr", transform: "translateY(-50%) rotate(180deg)", height: 100, position: "absolute" }}
        >
          <ChevronRight size={10} /> Zones
        </button>
      )}
    </div>
  );
};
