export type HazardType = 'landslide' | 'flood' | 'coastal' | 'cloudburst';
export type RelocationTier = 1 | 2 | 3;
export type HabitationStatus = 'critical' | 'alert' | 'monitored' | 'allocated' | 'relocating';
export type SiteType = 'engineered_plateau' | 'resilient_township' | 'elevated_ridge' | 'coastal_inland_haven';
export type SeismicZone = 'Zone II' | 'Zone III' | 'Zone IV' | 'Zone V';

export interface SeviMetrics {
  physicalExposure: number;
  socioEconomicFragility: number;
  lackOfCopingCapacity: number;
  infrastructureDeficit: number;
  environmentalDegradation: number;
  overallScore: number;
}

export interface Habitation {
  id: string;
  name: string;
  state: string;
  district: string;
  hazardType: HazardType;
  tier: RelocationTier;
  population: number;
  households: number;
  coordinates: [number, number];
  polygonCoordinates: [number, number][];
  slopeAngle: number;
  distanceToFault: number;
  distanceToRiver: number;
  inundationDepthMax?: number;
  insarDisplacementRate: number;
  porePressureIndex: number;
  sevi: SeviMetrics;
  status: HabitationStatus;
  allocatedToSiteId?: string;
  lastUpdated: string;
}

export interface SafeRelocationSite {
  id: string;
  name: string;
  state: string;
  district: string;
  siteType: SiteType;
  coordinates: [number, number];
  polygonCoordinates: [number, number][];
  totalAreaSqMeters: number;
  usableAreaSqMeters: number;
  maxPopulationCapacity: number;
  allocatedPopulation: number;
  waterSupplyLpdTotal: number;
  waterSupplyLpdAllocated: number;
  powerGridKwTotal: number;
  powerGridKwAllocated: number;
  healthcareBedsAvailable: number;
  schoolCapacityHeadroom: number;
  slopeAngle: number;
  seismicZone: SeismicZone;
  soilStabilityIndex: number;
  costPerFamilyLakhs: number;
  transitRoadClass: string;
  suitabilityScore: number;
}

export interface AlertEvent {
  id: string;
  timestamp: string;
  title: string;
  location: string;
  hazardType: HazardType;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface RelocationOrder {
  id: string;
  habitationId: string;
  habitationName: string;
  state: string;
  district: string;
  hazardType: HazardType;
  population: number;
  households: number;
  destinationSiteId: string;
  destinationSiteName: string;
  distanceKm: number;
  status: 'in_transit' | 'completed';
  busesAssigned: number;
  ambulancesAssigned: number;
  battalionUnit: string;
  commandingOfficer: string;
  dispatchTime: string;
  etaMinutes: number;
  progressPct: number;
  notes?: string;
}

export type PageKey = 'overview' | 'map' | 'capacity' | 'queue' | 'reports' | 'settings';
