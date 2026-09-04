import React, { createContext, useContext, useState, useEffect } from "react";
import { habitations as initialHabitations, safeSites as initialSafeSites, alertEvents as initialAlerts } from "../data/mockData";
import type { Habitation, SafeRelocationSite, AlertEvent, RelocationOrder, PageKey } from "../types";

interface RelocationParams {
  habitation: Habitation;
  destinationSite: SafeRelocationSite;
  busesAssigned: number;
  ambulancesAssigned: number;
  battalionUnit: string;
  commandingOfficer: string;
  notes?: string;
}

interface DisasterContextType {
  habitations: Habitation[];
  safeSites: SafeRelocationSite[];
  alertEvents: AlertEvent[];
  relocationOrders: RelocationOrder[];
  activeRelocationHab: Habitation | null;
  selectedHabForMap: Habitation | null;
  activePage: PageKey;
  setActivePage: (p: PageKey) => void;
  openRelocationModal: (hab: Habitation) => void;
  closeRelocationModal: () => void;
  executeRelocation: (params: RelocationParams) => RelocationOrder;
  completeRelocation: (orderId: string) => void;
  focusHabitationOnMap: (hab: Habitation) => void;
  bulkRelocateTier1: (preferredSiteId?: string) => void;
  getNearestSafeSite: (hab: Habitation) => SafeRelocationSite | undefined;
}

const INITIAL_ORDERS: RelocationOrder[] = [
  {
    id: "NDRF/EVAC/2026/09/4821",
    habitationId: "HAB-KL-02",
    habitationName: "Mundakkal Tribal Settlement",
    state: "Kerala",
    district: "Wayanad",
    hazardType: "landslide",
    population: 1870,
    households: 342,
    destinationSiteId: "SITE-KL-B2",
    destinationSiteName: "Nedumbala-Muttil High-Table Plateau",
    distanceKm: 14.2,
    status: "in_transit",
    busesAssigned: 38,
    ambulancesAssigned: 6,
    battalionUnit: "4th Bn NDRF (Arakkonam Task Force)",
    commandingOfficer: "Assistant Commandant S. Nair",
    dispatchTime: "2026-09-04T07:15:00Z",
    etaMinutes: 25,
    progressPct: 72,
    notes: "Landslide debris clearance ongoing along SH-12. Convoy escorted by Kerala Police & NDRF dog squad.",
  },
  {
    id: "NDRF/EVAC/2026/09/3910",
    habitationId: "HAB-AS-03",
    habitationName: "Majuli Char Riverine Colony",
    state: "Assam",
    district: "Majuli",
    hazardType: "flood",
    population: 5120,
    households: 980,
    destinationSiteId: "SITE-AS-C3",
    destinationSiteName: "Jorhat Northern Bypass Township",
    distanceKm: 28.5,
    status: "completed",
    busesAssigned: 85,
    ambulancesAssigned: 12,
    battalionUnit: "1st Bn NDRF (Guwahati Unit)",
    commandingOfficer: "Deputy Commandant B. Barman",
    dispatchTime: "2026-09-03T10:00:00Z",
    etaMinutes: 0,
    progressPct: 100,
    notes: "All 5,120 residents safely evacuated via motorized rescue boats and transit buses. Relief kits distributed.",
  },
];

const DisasterContext = createContext<DisasterContextType | undefined>(undefined);

export const DisasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habitations, setHabitations] = useState<Habitation[]>(initialHabitations);
  const [safeSites, setSafeSites] = useState<SafeRelocationSite[]>(initialSafeSites);
  const [alertEvents, setAlertEvents] = useState<AlertEvent[]>(initialAlerts);
  const [relocationOrders, setRelocationOrders] = useState<RelocationOrder[]>(INITIAL_ORDERS);
  const [activeRelocationHab, setActiveRelocationHab] = useState<Habitation | null>(null);
  const [selectedHabForMap, setSelectedHabForMap] = useState<Habitation | null>(null);
  const [activePage, setActivePage] = useState<PageKey>("overview");

  // Advance in-transit progress slightly every 10 seconds for realistic live feel
  useEffect(() => {
    const timer = setInterval(() => {
      setRelocationOrders(prev =>
        prev.map(ord => {
          if (ord.status === "in_transit" && ord.progressPct < 98) {
            const nextProgress = Math.min(ord.progressPct + 2, 98);
            const remainingMins = Math.max(1, Math.round(ord.etaMinutes * (1 - nextProgress / 100)));
            return { ...ord, progressPct: nextProgress, etaMinutes: remainingMins };
          }
          return ord;
        })
      );
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Distance calculation helper (Euclidean approximation for India)
  const getDistanceKm = (c1: [number, number], c2: [number, number]): number => {
    const [lat1, lon1] = c1;
    const [lat2, lon2] = c2;
    const R = 6371; // km
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
  };

  const getNearestSafeSite = (hab: Habitation): SafeRelocationSite | undefined => {
    // Filter same state first, or closest overall
    const stateSites = safeSites.filter(s => s.state === hab.state);
    const candidates = stateSites.length > 0 ? stateSites : safeSites;
    let closest: SafeRelocationSite | undefined = candidates[0];
    let minD = Infinity;

    for (const site of candidates) {
      const d = getDistanceKm(hab.coordinates, site.coordinates);
      const remainingCap = site.maxPopulationCapacity - site.allocatedPopulation;
      // prioritize sites that have enough capacity
      if (remainingCap >= hab.population && d < minD) {
        minD = d;
        closest = site;
      }
    }
    return closest || candidates[0];
  };

  const openRelocationModal = (hab: Habitation) => {
    setActiveRelocationHab(hab);
  };

  const closeRelocationModal = () => {
    setActiveRelocationHab(null);
  };

  const executeRelocation = (params: RelocationParams): RelocationOrder => {
    const { habitation, destinationSite, busesAssigned, ambulancesAssigned, battalionUnit, commandingOfficer, notes } = params;
    const dist = getDistanceKm(habitation.coordinates, destinationSite.coordinates);
    const estimatedMinutes = Math.max(20, Math.round(dist * 2.2));

    const newOrder: RelocationOrder = {
      id: `NDRF/EVAC/2026/09/${Math.floor(1000 + Math.random() * 9000)}`,
      habitationId: habitation.id,
      habitationName: habitation.name,
      state: habitation.state,
      district: habitation.district,
      hazardType: habitation.hazardType,
      population: habitation.population,
      households: habitation.households,
      destinationSiteId: destinationSite.id,
      destinationSiteName: destinationSite.name,
      distanceKm: dist,
      status: "in_transit",
      busesAssigned,
      ambulancesAssigned,
      battalionUnit,
      commandingOfficer,
      dispatchTime: new Date().toISOString(),
      etaMinutes: estimatedMinutes,
      progressPct: 15,
      notes,
    };

    // 1. Update Habitation status
    setHabitations(prev =>
      prev.map(h => (h.id === habitation.id ? { ...h, status: "relocating", allocatedToSiteId: destinationSite.id } : h))
    );

    // 2. Update Safe Site capacity
    setSafeSites(prev =>
      prev.map(s => {
        if (s.id === destinationSite.id) {
          const newAllocatedPop = s.allocatedPopulation + habitation.population;
          const waterAdd = habitation.population * 100;
          const powerAdd = Math.round(habitation.population * 0.4);
          return {
            ...s,
            allocatedPopulation: newAllocatedPop,
            waterSupplyLpdAllocated: s.waterSupplyLpdAllocated + waterAdd,
            powerGridKwAllocated: s.powerGridKwAllocated + powerAdd,
          };
        }
        return s;
      })
    );

    // 3. Add to Relocation Orders list
    setRelocationOrders(prev => [newOrder, ...prev]);

    // 4. Add Live Alert Ticker item
    const newAlert: AlertEvent = {
      id: `ALT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: `EMERGENCY EVACUATION DISPATCHED: ${habitation.name} (${habitation.population.toLocaleString("en-IN")} persons) → ${destinationSite.name}`,
      location: `${habitation.district}, ${habitation.state}`,
      hazardType: habitation.hazardType,
      severity: "critical",
    };
    setAlertEvents(prev => [newAlert, ...prev]);

    // Close modal
    setActiveRelocationHab(null);

    return newOrder;
  };

  const completeRelocation = (orderId: string) => {
    setRelocationOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return { ...ord, status: "completed", progressPct: 100, etaMinutes: 0 };
        }
        return ord;
      })
    );

    const order = relocationOrders.find(o => o.id === orderId);
    if (order) {
      setHabitations(prev =>
        prev.map(h => (h.id === order.habitationId ? { ...h, status: "allocated" } : h))
      );

      const completeAlert: AlertEvent = {
        id: `ALT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        title: `EVACUATION COMPLETE: ${order.habitationName} safely settled at ${order.destinationSiteName}`,
        location: `${order.district}, ${order.state}`,
        hazardType: order.hazardType,
        severity: "low",
      };
      setAlertEvents(prev => [completeAlert, ...prev]);
    }
  };

  const focusHabitationOnMap = (hab: Habitation) => {
    setSelectedHabForMap(hab);
    setActivePage("map");
  };

  const bulkRelocateTier1 = (preferredSiteId?: string) => {
    const tier1Habs = habitations.filter(h => h.tier === 1 && h.status !== "relocating" && h.status !== "allocated");
    tier1Habs.forEach(hab => {
      const site = preferredSiteId
        ? safeSites.find(s => s.id === preferredSiteId) || getNearestSafeSite(hab)
        : getNearestSafeSite(hab);

      if (site) {
        const buses = Math.ceil(hab.population / 50);
        const ambulances = Math.ceil(hab.population / 400);
        executeRelocation({
          habitation: hab,
          destinationSite: site,
          busesAssigned: buses,
          ambulancesAssigned: ambulances,
          battalionUnit: "NDRF Multi-Agency Rapid Deployment Unit",
          commandingOfficer: "Deputy Inspector General, NDRF Ops",
          notes: "Automated Tier-1 National Priority Evacuation Order triggered under Disaster Management Act 2005.",
        });
      }
    });
  };

  return (
    <DisasterContext.Provider
      value={{
        habitations,
        safeSites,
        alertEvents,
        relocationOrders,
        activeRelocationHab,
        selectedHabForMap,
        activePage,
        setActivePage,
        openRelocationModal,
        closeRelocationModal,
        executeRelocation,
        completeRelocation,
        focusHabitationOnMap,
        bulkRelocateTier1,
        getNearestSafeSite,
      }}
    >
      {children}
    </DisasterContext.Provider>
  );
};

export const useDisaster = (): DisasterContextType => {
  const ctx = useContext(DisasterContext);
  if (!ctx) {
    throw new Error("useDisaster must be used within a DisasterProvider");
  }
  return ctx;
};
