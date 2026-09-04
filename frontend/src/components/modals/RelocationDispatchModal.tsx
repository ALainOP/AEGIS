import React, { useState, useMemo } from "react";
import {
  X, AlertTriangle, Shield, Users, Bus, Ambulance,
  CheckCircle2, ArrowRight, Printer, MapPin, Gauge,
  Clock, Navigation, ShieldCheck, HeartPulse
} from "lucide-react";
import { useDisaster } from "../../context/DisasterContext";
import { HazardBadge, TierBadge } from "../ui/Badges";
import type { Habitation, SafeRelocationSite } from "../../types";

export const RelocationDispatchModal: React.FC = () => {
  const { activeRelocationHab, closeRelocationModal, safeSites, executeRelocation, getNearestSafeSite } = useDisaster();

  if (!activeRelocationHab) return null;

  const hab = activeRelocationHab;
  const initialSite = getNearestSafeSite(hab) || safeSites[0];
  const [selectedSiteId, setSelectedSiteId] = useState<string>(initialSite.id);

  // Auto calculate fleet
  const defaultBuses = Math.ceil(hab.population / 48);
  const defaultAmbulances = Math.ceil(hab.population / 350);
  const [buses, setBuses] = useState(defaultBuses);
  const [ambulances, setAmbulances] = useState(defaultAmbulances);
  const [battalion, setBattalion] = useState(
    hab.state === "Uttarakhand"
      ? "8th Bn NDRF (Ghaziabad / Dehradun Unit)"
      : hab.state === "Kerala" || hab.state === "Tamil Nadu"
      ? "4th Bn NDRF (Arakkonam Task Force)"
      : hab.state === "Assam"
      ? "1st Bn NDRF (Guwahati / Patgaon Unit)"
      : hab.state === "Odisha"
      ? "3rd Bn NDRF (Mundali / Cuttack)"
      : hab.state === "Himachal Pradesh" || hab.state === "Jammu & Kashmir"
      ? "14th Bn NDRF (Jaspur / Shimla)"
      : "5th Bn NDRF (Pune / Western Command)"
  );
  const [officer, setOfficer] = useState("Assistant Commandant V. K. Sharma");
  const [notes, setNotes] = useState(
    `Immediate priority evacuation under Sec 34 of Disaster Management Act 2005. Severe ${hab.hazardType} hazard trigger detected.`
  );
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  const selectedSite = safeSites.find(s => s.id === selectedSiteId) || safeSites[0];

  // Calculate distance
  const distanceKm = useMemo(() => {
    const [lat1, lon1] = hab.coordinates;
    const [lat2, lon2] = selectedSite.coordinates;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }, [hab, selectedSite]);

  const estimatedEtaMins = Math.max(20, Math.round(distanceKm * 2.2));

  // Vulnerability breakdown
  const childrenCount = Math.round(hab.population * 0.18);
  const elderlyCount = Math.round(hab.population * 0.14);
  const specialCareCount = Math.round(hab.population * 0.04);
  const cattleCount = Math.round(hab.households * 0.7);

  const handleConfirmDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      executeRelocation({
        habitation: hab,
        destinationSite: selectedSite,
        busesAssigned: buses,
        ambulancesAssigned: ambulances,
        battalionUnit: battalion,
        commandingOfficer: officer,
        notes,
      });
      setIsDispatching(false);
      setDispatchedSuccess(true);
      setTimeout(() => {
        setDispatchedSuccess(false);
        closeRelocationModal();
      }, 1400);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-lg overflow-hidden shadow-2xl"
        style={{ background: "var(--ts-surf-0)", border: "1px solid var(--ts-border-subtle)" }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #122A52 60%, #7B3200 100%)", borderBottom: "2px solid var(--ts-amber)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded bg-white/10 border border-white/20">
              <ShieldCheck size={22} className="text-orange-300" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-orange-200">
                MHA · NDRF EMERGENCY RELOCATION DIRECTIVE
              </div>
              <h3 className="text-base font-bold text-white leading-tight">
                Evacuation Dispatch: {hab.name}
              </h3>
              <div className="text-[11px] text-white/70">
                {hab.district}, {hab.state} · {hab.population.toLocaleString("en-IN")} residents in distress
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="ts-badge ts-badge-immediate">TIER 1 DISTRESS</span>
            <button
              onClick={closeRelocationModal}
              className="p-1.5 text-white/60 hover:text-white rounded hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Step Tabs */}
        <div className="flex items-center border-b px-6 bg-black/20" style={{ borderColor: "var(--ts-border)" }}>
          {[
            { n: 1, label: "1. Distressed Cohort & Hazard" },
            { n: 2, label: "2. Safe Haven Matching" },
            { n: 3, label: "3. Fleet Logistics & Directive" },
          ].map(s => (
            <button
              key={s.n}
              onClick={() => setStep(s.n as any)}
              className="px-4 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer"
              style={{
                borderColor: step === s.n ? "var(--ts-amber)" : "transparent",
                color: step === s.n ? "var(--ts-amber)" : "var(--ts-t35)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* STEP 1: DISTRESSED COHORT & HAZARD */}
          {step === 1 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Alert banner */}
              <div
                className="flex items-start gap-3 p-4 rounded-md"
                style={{ background: "rgba(184,50,50,0.12)", border: "1px solid rgba(184,50,50,0.35)" }}
              >
                <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-red-300">
                    CRITICAL DISASTER THREAT ACTIVE
                  </div>
                  <div className="text-xs text-red-200/80 leading-relaxed mt-0.5">
                    Continuous monitoring shows displacement velocity at <strong>{hab.insarDisplacementRate} mm/yr</strong> with pore pressure index at <strong>{hab.porePressureIndex} kPa</strong>. Structural slope failure is imminent under current precipitation. Immediate evacuation of all {hab.households} households required.
                  </div>
                </div>
              </div>

              {/* Demographic triage cards */}
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: "var(--ts-t60)" }}>
                  Distressed Population Breakdown
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="ts-card p-3 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5" style={{ color: "var(--ts-t35)" }}>
                      <Users size={13} />
                      <span className="text-[11px]">Total Evacuees</span>
                    </div>
                    <div className="text-lg font-bold font-data" style={{ color: "var(--ts-t100)" }}>
                      {hab.population.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px]" style={{ color: "var(--ts-t20)" }}>{hab.households} households</div>
                  </div>

                  <div className="ts-card p-3 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <HeartPulse size={13} />
                      <span className="text-[11px]">Infants & Children</span>
                    </div>
                    <div className="text-lg font-bold font-data text-amber-300">
                      {childrenCount.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px]" style={{ color: "var(--ts-t20)" }}>Age &lt; 10 years (18%)</div>
                  </div>

                  <div className="ts-card p-3 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-orange-400">
                      <Users size={13} />
                      <span className="text-[11px]">Elderly Citizens</span>
                    </div>
                    <div className="text-lg font-bold font-data text-orange-300">
                      {elderlyCount.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px]" style={{ color: "var(--ts-t20)" }}>Age &gt; 60 years (14%)</div>
                  </div>

                  <div className="ts-card p-3 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-red-400">
                      <Ambulance size={13} />
                      <span className="text-[11px]">Medical / Disabled</span>
                    </div>
                    <div className="text-lg font-bold font-data text-red-300">
                      {specialCareCount.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px]" style={{ color: "var(--ts-t20)" }}>Priority ambulance transit</div>
                  </div>
                </div>
              </div>

              {/* Geo-hazard Metrics */}
              <div className="ts-card p-4">
                <div className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: "var(--ts-t60)" }}>
                  Ground Hazard Metrics (Satellite & Sensor Telemetry)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Slope Gradient</div>
                    <div className="text-sm font-bold font-data mt-0.5" style={{ color: "var(--ts-t100)" }}>{hab.slopeAngle}°</div>
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Fault Line Proximity</div>
                    <div className="text-sm font-bold font-data mt-0.5" style={{ color: "var(--ts-t100)" }}>{hab.distanceToFault} km</div>
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>InSAR Creep Velocity</div>
                    <div className="text-sm font-bold font-data mt-0.5 text-red-400">{hab.insarDisplacementRate} mm/yr</div>
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>SEVI Vulnerability</div>
                    <div className="text-sm font-bold font-data mt-0.5 text-amber-400">{hab.sevi.overallScore.toFixed(1)} / 100</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={() => setStep(2)} className="ts-btn ts-btn-amber flex items-center gap-2 px-5 py-2">
                  Proceed to Safe Haven Matching <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SAFE HAVEN MATCHING */}
          {step === 2 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--ts-t60)" }}>
                    Candidate Relocation Safe Zones (Carrying Capacity Scored)
                  </div>
                  <span className="text-[11px]" style={{ color: "var(--ts-t35)" }}>
                    Filtered by state & remaining population headroom
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {safeSites.map(site => {
                    const isSelected = site.id === selectedSiteId;
                    const remainingCap = site.maxPopulationCapacity - site.allocatedPopulation;
                    const canAccommodate = remainingCap >= hab.population;
                    const isSameState = site.state === hab.state;

                    return (
                      <div
                        key={site.id}
                        onClick={() => setSelectedSiteId(site.id)}
                        className="p-4 rounded-md cursor-pointer transition-all flex flex-col gap-3"
                        style={{
                          background: isSelected ? "rgba(42,127,118,0.14)" : "var(--ts-surf-1)",
                          border: `1.5px solid ${isSelected ? "#2A7F76" : "var(--ts-border)"}`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="safeSite"
                              checked={isSelected}
                              onChange={() => setSelectedSiteId(site.id)}
                              className="mt-1"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm" style={{ color: "var(--ts-t100)" }}>
                                  {site.name}
                                </span>
                                {isSameState && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                                    SAME STATE
                                  </span>
                                )}
                                {isSelected && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-900 text-teal-200">
                                    DESIGNATED DESTINATION
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] mt-0.5" style={{ color: "var(--ts-t35)" }}>
                                {site.district}, {site.state} · {site.transitRoadClass}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs font-bold" style={{ color: canAccommodate ? "#3EA8C4" : "#B83232" }}>
                              {remainingCap.toLocaleString("en-IN")} headroom
                            </div>
                            <div className="text-[10px]" style={{ color: "var(--ts-t20)" }}>
                              Max {site.maxPopulationCapacity.toLocaleString("en-IN")} capacity
                            </div>
                          </div>
                        </div>

                        {/* Metrics Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t" style={{ borderColor: "var(--ts-border)" }}>
                          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ts-t60)" }}>
                            <MapPin size={11} className="text-teal-400" />
                            <span>Road Class: {site.transitRoadClass.split("(")[0]}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ts-t60)" }}>
                            <Gauge size={11} className="text-teal-400" />
                            <span>Suitability: {site.suitabilityScore}/100</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ts-t60)" }}>
                            <HeartPulse size={11} className="text-teal-400" />
                            <span>{site.healthcareBedsAvailable} Hospital Beds</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ts-t60)" }}>
                            <Shield size={11} className="text-teal-400" />
                            <span>Soil Stability: {site.soilStabilityIndex}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transit & ETA callout */}
              <div className="p-3 rounded bg-teal-950/30 border border-teal-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation size={14} className="text-teal-400" />
                  <span className="text-xs text-teal-200">
                    Estimated Transit Corridor: <strong>{distanceKm} km</strong> via {selectedSite.transitRoadClass.split("(")[0]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-teal-300 font-semibold font-data">
                  <Clock size={13} />
                  <span>Convoy ETA: ~{estimatedEtaMins} minutes</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button onClick={() => setStep(1)} className="ts-btn text-xs px-4 py-2">
                  ← Back to Cohort
                </button>
                <button onClick={() => setStep(3)} className="ts-btn ts-btn-amber flex items-center gap-2 px-5 py-2">
                  Proceed to Fleet & Directive <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FLEET LOGISTICS & DIRECTIVE PREVIEW */}
          {step === 3 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Fleet assignment form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="ts-card p-4 flex flex-col gap-3">
                  <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--ts-t60)" }}>
                    Evacuation Fleet Allocation
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold" style={{ color: "var(--ts-t35)" }}>
                        Evacuation Buses (48-Seater)
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Bus size={14} className="text-orange-400" />
                        <input
                          type="number"
                          className="ts-input text-xs"
                          value={buses}
                          onChange={e => setBuses(Math.max(1, parseInt(e.target.value) || 1))}
                          style={{ height: 32 }}
                        />
                        <span className="text-[10px]" style={{ color: "var(--ts-t20)" }}>
                          ({buses * 48} seats for {hab.population} evacuees)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold" style={{ color: "var(--ts-t35)" }}>
                        Emergency Ambulances / 4x4 Medical Vans
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Ambulance size={14} className="text-red-400" />
                        <input
                          type="number"
                          className="ts-input text-xs"
                          value={ambulances}
                          onChange={e => setAmbulances(Math.max(1, parseInt(e.target.value) || 1))}
                          style={{ height: 32 }}
                        />
                        <span className="text-[10px]" style={{ color: "var(--ts-t20)" }}>
                          (For {specialCareCount} priority medical cases)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ts-card p-4 flex flex-col gap-3">
                  <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--ts-t60)" }}>
                    Command & Field Deployment
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold" style={{ color: "var(--ts-t35)" }}>
                        Assigned NDRF Battalion Unit
                      </label>
                      <input
                        className="ts-input text-xs mt-1"
                        value={battalion}
                        onChange={e => setBattalion(e.target.value)}
                        style={{ height: 32 }}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold" style={{ color: "var(--ts-t35)" }}>
                        Designated Evacuation Officer
                      </label>
                      <input
                        className="ts-input text-xs mt-1"
                        value={officer}
                        onChange={e => setOfficer(e.target.value)}
                        style={{ height: 32 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Directive Document Preview */}
              <div
                className="p-5 rounded border bg-black/40 font-mono text-xs flex flex-col gap-3"
                style={{ borderColor: "var(--ts-border)" }}
              >
                <div className="text-center border-b pb-3" style={{ borderColor: "var(--ts-border)" }}>
                  <div className="font-bold text-sm tracking-wider text-orange-300">
                    GOVERNMENT OF INDIA · MINISTRY OF HOME AFFAIRS
                  </div>
                  <div className="text-[11px] text-white/70">
                    NATIONAL DISASTER RESPONSE FORCE (NDRF) COMMAND HQ, NEW DELHI
                  </div>
                  <div className="text-[10px] text-white/40 mt-1">
                    ORDER NO: NDRF/EVAC/2026/09/DIR-{(hab.id).replace("-", "")} · DATE: {new Date().toLocaleDateString("en-IN")}
                  </div>
                </div>

                <div className="text-white/80 leading-relaxed text-[11.5px]">
                  <strong>SUBJECT:</strong> URGENT MANDATORY EVACUATION DIRECTIVE OF {hab.name.toUpperCase()} ({hab.district.toUpperCase()}, {hab.state.toUpperCase()}) TO SAFE REFUGE SITE {selectedSite.name.toUpperCase()}.
                  <br /><br />
                  In exercise of the powers conferred by Section 34(c) of the Disaster Management Act, 2005, and pursuant to verified InSAR displacement telemetry indicating imminent {hab.hazardType} catastrophe, it is hereby ordered that <strong>{hab.population.toLocaleString("en-IN")} residents ({hab.households} households)</strong> be immediately evacuated along the designated transit corridor ({distanceKm} km).
                  <br /><br />
                  <strong>LOGISTICS ASSIGNMENT:</strong> {buses} Evacuation Coaches, {ambulances} Advanced Life Support Ambulances under the operational command of <strong>{battalion}</strong> ({officer}).
                </div>

                <div className="flex items-center justify-between pt-2 border-t text-[10px]" style={{ borderColor: "var(--ts-border)", color: "var(--ts-t35)" }}>
                  <span>Seal: National Disaster Response Force HQ</span>
                  <span>Digitally Authorized · Disaster DSS Protocol v2.6</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button onClick={() => setStep(2)} className="ts-btn text-xs px-4 py-2">
                  ← Back to Site
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="ts-btn text-xs flex items-center gap-1.5 px-3 py-2"
                  >
                    <Printer size={13} /> Print Directive
                  </button>

                  <button
                    onClick={handleConfirmDispatch}
                    disabled={isDispatching || dispatchedSuccess}
                    className="ts-btn ts-btn-amber flex items-center gap-2 px-6 py-2.5 text-xs font-bold"
                    style={{ background: dispatchedSuccess ? "#2A7F76" : undefined }}
                  >
                    {dispatchedSuccess ? (
                      <>
                        <CheckCircle2 size={16} /> Convoy Dispatched!
                      </>
                    ) : isDispatching ? (
                      "Transmitting Directive…"
                    ) : (
                      <>
                        <CheckCircle2 size={15} /> Confirm &amp; Dispatch Evacuation Convoy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
