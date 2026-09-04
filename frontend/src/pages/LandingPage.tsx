import React, { useState, useEffect } from "react";
import {
  Phone, ChevronLeft, ChevronRight, ExternalLink,
  PlayCircle, Image, BookOpen, ArrowRight, Users, Shield, Award,
  Globe, Mail, MapPin, LogIn, X, Check, Search, Download, HelpCircle,
  FileText, Radio, Heart
} from "lucide-react";

interface LandingPageProps {
  onEnterDSS: () => void;
}

const SLIDES = [
  { src: "/img/hero_banner.jpg", caption: "NDRF Flood Rescue Operations — Brahmaputra Basin 2026", sub: "Saving lives in the most challenging terrain and extreme torrents" },
  { src: "/img/ceremony_parade.jpg", caption: "21st NDRF Raising Day Parade — New Delhi", sub: "आपदा सेवा सदैव सर्वत्र — Disaster Service Always Everywhere" },
  { src: "/img/landslide_rescue.jpg", caption: "Landslide Response & Trench Shoring — Kinnaur, Himachal Pradesh", sub: "Multi-agency canine search & acoustic sensor operations" },
  { src: "/img/cyclone_response.jpg", caption: "Cyclone Pre-Evacuation — Coastal Odisha & Bengal", sub: "Pre-positioned NDRF battalions enable zero-casualty evacuation" },
];

const QUICK_LINKS_DATA: Record<string, { title: string; icon: string; desc: string; details: string[] }> = {
  "NDRF Martyrs": {
    title: "NDRF Valorous Martyrs — अमर जवान",
    icon: "🎖️",
    desc: "Honouring supreme sacrifices made by brave NDRF personnel in line of operational duty.",
    details: [
      "Inspector N. K. Sharma — Kedarnath Flash Flood Rescue Operation 2013",
      "Sub-Inspector Rajeshwar Rao — Uttarakhand Cloudburst Mitigation Mission",
      "Constable M. K. Meena — Cyclone Vardah Coastal Protection Mission",
      "Constable Amit Kumar — Wayanad Hillside Debris Clearance Operation 2024",
      "The nation salutes their immortal courage and selfless dedication to saving human lives."
    ]
  },
  "E-Shradhanjali": {
    title: "E-Shradhanjali Digital Tribute Portal",
    icon: "🙏",
    desc: "Pay virtual floral tribute and offer condolence messages to the fallen heroes of NDRF.",
    details: [
      "Select Battalion & Martyr Roll",
      "Offer Virtual Floral Tribute (पुष्पांजलि)",
      "Record digital condolences for the bereaved family",
      "Over 48,000 tributes offered by citizens across India in 2026."
    ]
  },
  "Tenders": {
    title: "Active Tenders & Procurement Notices",
    icon: "📋",
    desc: "Government e-Marketplace (GeM) & CPPP active public procurement notices.",
    details: [
      "NIT/NDRF/2026/088: Procurement of 500 High-Capacity Inflatable Rescue Boats (IRBs) with OBMs",
      "NIT/NDRF/2026/092: Procurement of 120 Carbon-Fibre Acoustic Life Locators & Search Cams",
      "NIT/NDRF/2026/095: AMC for Satellite Communication Terminals (VSAT/Inmarsat) across 16 Bns",
      "Last date of technical bid submission: 25 Sep 2026, 17:00 hrs IST."
    ]
  },
  "RTI": {
    title: "Right to Information (RTI) Disclosures",
    icon: "📄",
    desc: "Statutory disclosures under Section 4(1)(b) of the Right to Information Act, 2005.",
    details: [
      "Central Public Information Officer (CPIO): DIG (Admin), NDRF HQ, New Delhi",
      "First Appellate Authority: Inspector General (Ops & Trg), NDRF HQ",
      "RTI Online Portal: https://rtionline.gov.in",
      "Annual return of RTI queries filed and disposal rate: 99.4% disposed within 30 days."
    ]
  },
  "Live Streaming": {
    title: "NDRF Live Operations & Public Broadcasts",
    icon: "📡",
    desc: "Direct satellite uplink from Disaster Management Command Centre (DMCC).",
    details: [
      "Channel 1: Assam Brahmaputra Flood Evacuation (Live drone surveillance stream)",
      "Channel 2: Annual Joint Disaster Management Exercise (ADMEX 2026)",
      "Channel 3: RakshaSetu Decision-Support Briefing Room (Restricted Feed)",
      "Status: Satellite transponder GSAT-29 uplink operational."
    ]
  },
  "Honour & Awards": {
    title: "Honour & Presidential Gallantry Awards",
    icon: "🏅",
    desc: "Decorations conferred upon NDRF personnel for exceptional valour in rescue operations.",
    details: [
      "President's Police Medal for Gallantry (PPMG) — 14 Conferred",
      "Police Medal for Gallantry (PMG) — 86 Conferred",
      "Jeevan Raksha Padak Series — 210 Rescuers decorated",
      "Subhash Chandra Bose Aapda Prabandhan Puraskar awarded to NDRF 8th Battalion."
    ]
  },
  "Job Opportunity": {
    title: "Recruitment & Deputation Opportunities",
    icon: "💼",
    desc: "NDRF induction opportunities for serving personnel of Central Armed Police Forces (CAPFs).",
    details: [
      "Notification 04/2026: Deputation of Assistant Commandants (Engineers / Medical)",
      "Notification 05/2026: Induction of Deep Sea Divers & Urban Search and Rescue Technicians",
      "Parent Forces: BSF, CRPF, CISF, ITBP, SSB, Assam Rifles",
      "Tenure: 5 years with specialized hazard pay and international UN INSARAG training."
    ]
  },
  "Cyber Awareness": {
    title: "Government Cyber Security Advisories",
    icon: "🛡️",
    desc: "Cyber Swachhta Kendra and Indian Cyber Crime Coordination Centre (I4C) directives.",
    details: [
      "Advisory on Phishing emails impersonating Disaster Relief Donation funds",
      "Mandatory Multi-Factor Authentication (MFA) on all Gov.in and NIC official portals",
      "Emergency Cyber Incident Helpline: 1930 (National Cyber Crime Reporting Portal)",
      "RakshaSetu platform is ISO 27001 certified and protected by NIC WAF."
    ]
  },
  "Disaster Awareness": {
    title: "Community Disaster Preparedness & Safety Guidelines",
    icon: "⚠️",
    desc: "Official standard operating procedures for citizens during natural emergencies.",
    details: [
      "Earthquake: Drop, Cover, and Hold On. Avoid elevators and electric transmission poles.",
      "Flash Floods: Move to elevated ground immediately. Do not drive through water over 6 inches.",
      "Landslides: Listen for rumbling sounds and trees cracking. Evacuate immediately if slope creeps.",
      "Cyclone: Keep emergency radio ready, secure tin roofs, and comply with NDRF evacuation orders."
    ]
  },
};

const LATEST_UPDATES = [
  {
    date: "04 Sep 2026",
    title: "NDRF conducts RakshaSetu Pilot — GIS-based relocation mapping for 8 high-risk states",
    ref: "MHA-PR-2026-0904",
    body: "NDRF in collaboration with Ministry of Home Affairs successfully rolled out the pilot of RakshaSetu Decision-Support System across Uttarakhand, Kerala, Assam, and Odisha. The platform integrates real-time InSAR satellite interferometry to model slope instability and automate safe camp allocations."
  },
  {
    date: "02 Sep 2026",
    title: "NDRF deploys 18 teams in Assam for Brahmaputra flood relief operations",
    ref: "MHA-PR-2026-0902",
    body: "Following torrential rainfall across upper Arunachal Pradesh and Assam, NDRF has pre-positioned 18 specialized deep-water rescue teams equipped with motorized boats and satellite comms across Majuli, Dhubri, and Barpeta districts. Over 4,200 marooned citizens have been relocated safely."
  },
  {
    date: "30 Aug 2026",
    title: "NDRF signs MoU with ISRO for InSAR-based landslide early warning system",
    ref: "ISRO-NDRF-2026-0830",
    body: "National Disaster Response Force signed an agreement with National Remote Sensing Centre (NRSC/ISRO) to stream raw Sentinel-1 and NISAR radar data into the RakshaSetu DSS, enabling millimetre-precision ground displacement tracking."
  },
  {
    date: "28 Aug 2026",
    title: "21st Raising Day: NDRF has saved 1,59,293 lives since inception",
    ref: "NDRF-RD-2026-0828",
    body: "On its 21st Raising Day celebrated at New Delhi, Director General NDRF announced that the force has rescued more than 1.59 lakh citizens and evacuated over 8.64 lakh stranded victims across domestic and international humanitarian missions."
  },
  {
    date: "25 Aug 2026",
    title: "Cyclone Dana Alert: 6 NDRF teams pre-positioned at Odisha & West Bengal coast",
    ref: "MHA-CYC-2026-0825",
    body: "With the depression intensifying over the Bay of Bengal, 6 battalions have deployed tree-clearance cutters, mobile medical posts, and satellite generators along the vulnerable coastal tracts of Kendrapara, Balasore, and South 24 Parganas."
  },
  {
    date: "20 Aug 2026",
    title: "NDRF Wayanad batch completes post-disaster structural safety audit",
    ref: "SDMA-KL-2026-0820",
    body: "Specialized engineering batallion of 4th Bn NDRF has concluded geomorphic slope stability analysis in Meppadi and Chooralmala, classifying 14 habitations into relocation priority tiers."
  },
];

const GALLERY_IMGS = [
  { src: "/img/rescue_ops.jpg", cap: "Flood Evacuation Operation — Assam Brahmaputra Valley" },
  { src: "/img/landslide_rescue.jpg", cap: "Trench Shoring & Survivor Search — Kinnaur, Himachal Pradesh" },
  { src: "/img/cyclone_response.jpg", cap: "Cyclone Relief & Vulnerable Community Transport — Odisha" },
  { src: "/img/ceremony_parade.jpg", cap: "21st NDRF Raising Day Contingent Parade — New Delhi" },
  { src: "/img/hero_banner.jpg", cap: "High-Altitude Mountain Rescue Operation — Uttarakhand" },
  { src: "/img/command_center.jpg", cap: "Disaster Monitoring & Decision Support Room — NDRF HQ" },
];

const NAV_DETAILS: Record<string, { title: string; content: string[] }> = {
  "DG's Desk": {
    title: "Director General's Desk — राष्ट्रीय आपदा मोचन बल",
    content: [
      "Motto: आपदा सेवा सदैव सर्वत्र (Disaster Service Always Everywhere)",
      "The National Disaster Response Force was constituted under the Disaster Management Act, 2005 as India's specialized, multi-disciplinary, rapid-response humanitarian force.",
      "Operating 16 Battalions strategically positioned across India to achieve sub-30 minute deployment turn-around.",
      "Pioneering digital GIS-based DSS for predictive disaster relocation and zero-casualty disaster management."
    ]
  },
  "Directory": {
    title: "NDRF Official Directory & Battalion Locations",
    content: [
      "1st Bn NDRF: Patgaon, Guwahati (Assam) · Tel: 0361-2840001",
      "2nd Bn NDRF: Haringhata, Nadia (West Bengal) · Tel: 03473-245001",
      "3rd Bn NDRF: Mundali, Cuttack (Odisha) · Tel: 0671-2879001",
      "4th Bn NDRF: Arakkonam, Vellore (Tamil Nadu) · Tel: 04177-226001",
      "5th Bn NDRF: Sudumbare, Pune (Maharashtra) · Tel: 02114-247001",
      "8th Bn NDRF: Govindpuram, Ghaziabad (Uttar Pradesh / NCR) · Tel: 0120-2766001",
      "10th Bn NDRF: Achutapuram, Guntur (Andhra Pradesh) · Tel: 0863-2288001",
      "14th Bn NDRF: Jaspur, Nurpur (Himachal Pradesh) · Tel: 01893-242001",
      "National Emergency Helpline: +91-9711077372 | controlroom@ndrf.gov.in"
    ]
  },
  "Media": {
    title: "Media & Public Relations Division",
    content: [
      "Official Press Releases regarding active disaster rescues updated 24x7.",
      "Accredited Media Queries: PRO NDRF HQ, 6th Floor, NDCC-II Building, Jai Singh Road, New Delhi 110001.",
      "High-resolution press photo and video packages available for accredited national news broadcasters.",
      "Daily Media Briefing at 16:30 hrs IST during ongoing monsoon response."
    ]
  },
  "Operations": {
    title: "National & International Operations Overview",
    content: [
      "Total Lives Saved: 1,59,293+",
      "Total Persons Evacuated: 8,64,316+",
      "Major Domestic Deployments: Uttarakhand Kedarnath (2013), Chennai Floods (2015), Kerala Floods (2018), Chamoli Flash Flood (2021), Wayanad (2024), Assam Floods (2026).",
      "International UN INSARAG Certified Operations: Japan Triple Disaster (2011), Nepal Earthquake (2015), Operation Dost Türkiye (2023), Myanmar Cyclone Mocha (2023)."
    ]
  },
  "Training": {
    title: "NDRF Academy & Capacity Building",
    content: [
      "National Disaster Response Academy situated at Suraburdi, Nagpur.",
      "Courses: CBRN Emergency Response, Collapsed Structure Search & Rescue (CSSR), Medical First Responder (MFR), Rope Rescue in Mountainous Terrain.",
      "Community Outreach: Over 6.8 million citizens trained in School Safety & Community First Responder workshops.",
      "Joint disaster training with Indian Army, Air Force, Coast Guard, and State Police."
    ]
  },
  "Major Events": {
    title: "Major Calendar Events & Exercises",
    content: [
      "Annual Raising Day: Celebrated on 19th January every year.",
      "BIMSTEC Disaster Management Exercise: Multi-nation simulation across Bay of Bengal littoral nations.",
      "Annual National Mock Drills on Earthquake preparedness across seismic zones IV and V.",
      "International Search & Rescue Advisory Group (INSARAG) Asia-Pacific Regional Exercise."
    ]
  },
  "Equipment": {
    title: "Specialized Modern Rescue Inventory",
    content: [
      "Acoustic & Seismic Life Detectors capable of detecting human heartbeat under 12 metres of concrete debris.",
      "Diamond core rotary drills and hydraulic spreader-cutter jaws.",
      "Advanced Water Rescue: Inflatable Rescue Boats (IRBs) with 40HP Outboard Motors and Sonar bathymetry.",
      "CBRN Detection: Geiger counters, HazMat Level-A gas suits, chemical agent monitors (CAM).",
      "Disaster Telecom: Quick Deployable Antennas (QDA), Satellite phones, High-altitude tethered drones."
    ]
  },
  "Order & Circulars": {
    title: "Statutory Orders, Circulars & Standard Operating Procedures",
    content: [
      "SOP on High Altitude Avalanche Rescue & Glacier Lake Outburst Floods (GLOF).",
      "Guidelines on Drone-assisted InSAR telemetry integration into State Emergency Operation Centers (SEOC).",
      "National Disaster Management Plan (NDMP 2019 / Revision 2024).",
      "Directive on Standardized Camp Shelter per capita allocations (minimum 3.5 m² living space, 70 L water/day)."
    ]
  },
  "About Us": {
    title: "About National Disaster Response Force",
    content: [
      "NDRF was raised under the provisions of the Disaster Management Act, 2005.",
      "It is an autonomous specialized force functioning directly under the Ministry of Home Affairs, Government of India.",
      "Personnel are drawn on deputation from seven Central Armed Police Forces.",
      "Operates under a zero-delay deployment doctrine with pre-designated staging bases."
    ]
  },
  "Contact Us": {
    title: "Emergency Contacts & Headquarters Directory",
    content: [
      "HQ Address: NDRF Directorate General, 6th Floor, NDCC-II Building, Jai Singh Road, New Delhi 110001",
      "24x7 Emergency Control Room: +91-9711077372 / 011-23438091",
      "Email: controlroom@ndrf.gov.in | hq.ndrf@nic.in",
      "For State Disaster Management Authorities: Direct DSS Hotline: 1070"
    ]
  },
  "Sitemap": {
    title: "Official Portal Sitemap",
    content: [
      "Home → Public Portal",
      "RakshaSetu DSS → Official Login → GIS Decision-Support System",
      "DSS Modules → Red Zone Map, Carrying Capacity, Relocation Queue, Reports & SitRep",
      "Public Information → Directory, Tenders, RTI, Gallery, Awareness Guidelines"
    ]
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDSS }) => {
  const [slide, setSlide] = useState(0);
  const [moreUpdates, setMoreUpdates] = useState(false);
  const [activeModal, setActiveModal] = useState<{ title: string; desc?: string; items: string[] } | null>(null);
  const [activeNews, setActiveNews] = useState<(typeof LATEST_UPDATES)[0] | null>(null);
  const [galleryModal, setGalleryModal] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [langHindi, setLangHindi] = useState(false);
  const [copiedHelpline, setCopiedHelpline] = useState(false);

  const visibleUpdates = moreUpdates ? LATEST_UPDATES : LATEST_UPDATES.slice(0, 4);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const copyHelpline = () => {
    navigator.clipboard?.writeText("+919711077372");
    setCopiedHelpline(true);
    setTimeout(() => setCopiedHelpline(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--gov-bg)", fontFamily: "'IBM Plex Sans',sans-serif" }}>
      {/* ── Top Utility Bar ── */}
      <div className="gov-top-bar">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-4">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/400px-Emblem_of_India.svg.png"
                alt="Emblem of India"
                className="h-7 w-auto object-contain"
                onError={e => (e.currentTarget.style.display = "none")}
              />
              <div>
                <div className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: "#444", lineHeight: 1.2 }}>
                  {langHindi ? "भारत सरकार" : "भारत सरकार"}
                </div>
                <div className="text-[10px] font-bold" style={{ color: "#222" }}>
                  {langHindi ? "GOVERNMENT OF INDIA" : "GOVERNMENT OF INDIA"}
                </div>
              </div>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <div className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: "#444", lineHeight: 1.2 }}>
                गृह मंत्रालय
              </div>
              <div className="text-[10px] font-bold" style={{ color: "#222" }}>
                MINISTRY OF HOME AFFAIRS
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById("mainContent");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-[10px] px-2 py-0.5 rounded cursor-pointer"
              style={{ color: "#666", background: "#F0F0F0", border: "1px solid #DDD" }}
            >
              Skip to main content
            </button>
            <button
              onClick={() => setLangHindi(!langHindi)}
              className="text-[10px] px-2 py-0.5 rounded font-semibold cursor-pointer"
              style={{ color: "#fff", background: "var(--gov-navy)" }}
            >
              {langHindi ? "English" : "Hindi · हिंदी"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <header className="gov-header relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Left: NDRF emblem + text */}
          <div className="flex items-center gap-4">
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full"
              style={{ width: 80, height: 80, background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)" }}
            >
              <Shield size={38} className="text-orange-100" />
            </div>
            <div>
              <div className="font-devanagari text-2xl font-bold text-white leading-tight drop-shadow">
                राष्ट्रीय आपदा मोचन बल
              </div>
              <div className="text-white font-bold text-xl leading-tight drop-shadow">
                National Disaster Response Force
              </div>
              <div className="text-orange-100/80 text-sm">
                Ministry of Home Affairs, Govt. of India
              </div>
            </div>
          </div>

          {/* Center: Ashoka pillar */}
          <div className="hidden lg:flex flex-col items-center gap-1">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/400px-Emblem_of_India.svg.png"
              alt="Satyamev Jayate"
              className="h-16 w-auto object-contain brightness-150"
              onError={e => (e.currentTarget.style.display = "none")}
            />
            <div className="text-orange-100/70 text-xs font-semibold tracking-widest">सत्यमेव जयते</div>
          </div>

          {/* Right: RakshaSetu DSS entry */}
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <div className="text-orange-100/60 text-xs tracking-widest uppercase">Motto</div>
              <div className="text-white font-bold text-lg italic">
                आपदा सेवा सदैव सर्वत्र
              </div>
            </div>
            <button
              onClick={onEnterDSS}
              className="flex items-center gap-2 px-5 py-2.5 font-semibold text-sm rounded shadow-lg"
              style={{
                background: "linear-gradient(135deg, rgba(200,80,10,0.9) 0%, rgba(240,110,20,0.9) 100%)",
                border: "2px solid rgba(255,255,255,0.35)",
                color: "white",
                cursor: "pointer",
                backdropFilter: "blur(4px)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "none")}
            >
              <LogIn size={16} /> Official Login · RakshaSetu DSS
            </button>
          </div>
        </div>
      </header>

      {/* ── Ticker ── */}
      <div className="gov-ticker">
        <div
          onClick={copyHelpline}
          className="flex-shrink-0 flex items-center gap-2 px-4 cursor-pointer hover:bg-black/30 transition-colors"
          style={{ background: "rgba(0,0,0,0.2)", height: "100%", borderRight: "1px solid rgba(255,255,255,0.15)" }}
          title="Click to copy helpline"
        >
          <Phone size={12} className="text-white/80" />
          <span className="text-[10.5px] font-bold tracking-wider whitespace-nowrap">
            {copiedHelpline ? "COPIED TO CLIPBOARD!" : "NDRF HELPLINE: +91-9711077372"}
          </span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee flex items-center gap-8 whitespace-nowrap px-4" style={{ height: 32, alignItems: "center", display: "flex" }}>
            {[
              "📞 NDRF 24x7 National Helpline: +91-9711077372",
              "💬 Saving Lives & Beyond — आपदा सेवा सदैव सर्वत्र",
              "🚨 ALERT: Monsoon 2026 — 8 high-risk states under continuous InSAR surveillance",
              "📍 18 NDRF teams pre-positioned in Assam, Uttarakhand, Kerala, and Odisha",
              "🛡️ RakshaSetu DSS: Automated relocation planning enabled for 2,51,500 at-risk residents",
              "📞 Emergency Toll Free: 1070 (SDMA) / 1078 (NDMA)",
            ].map((t, i) => (
              <span key={i} className="text-[11px] text-white/90">
                {t}
                <span className="mx-5" style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="gov-navbar shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center flex-wrap gap-0">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="gov-nav-link active flex items-center gap-1.5 cursor-pointer"
          >
            🏠 Home
          </button>
          {Object.keys(NAV_DETAILS).slice(0, 8).map(item => (
            <button
              key={item}
              onClick={() => {
                const info = NAV_DETAILS[item];
                setActiveModal({ title: info.title, items: info.content });
              }}
              className="gov-nav-link cursor-pointer hover:bg-white/10"
            >
              {item}
            </button>
          ))}
          <button
            onClick={onEnterDSS}
            className="gov-nav-link ml-auto font-bold flex items-center gap-1.5 cursor-pointer"
            style={{ color: "#FFD080", borderLeft: "1px solid rgba(255,255,255,0.15)", paddingLeft: 16 }}
          >
            <LogIn size={12} /> RakshaSetu DSS
          </button>
        </div>
        <div className="gov-navbar" style={{ background: "rgba(0,0,0,0.15)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="max-w-7xl mx-auto px-4 flex gap-0">
            {["About Us", "Contact Us", "Sitemap"].map(item => (
              <button
                key={item}
                onClick={() => {
                  const info = NAV_DETAILS[item];
                  setActiveModal({ title: info.title, items: info.content });
                }}
                className="gov-nav-link text-[11.5px] cursor-pointer hover:bg-white/10"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero Slider ── */}
      <div className="relative overflow-hidden" style={{ height: 420, background: "#111" }}>
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === slide ? 1 : 0 }}
          >
            <img src={s.src} alt={s.caption} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
            <div className="absolute bottom-0 left-0 right-0 px-8 pb-8">
              <div className="max-w-7xl mx-auto">
                <div
                  className="inline-block px-3 py-1 mb-2 text-xs font-bold tracking-widest uppercase rounded-sm shadow"
                  style={{ background: "var(--gov-orange)", color: "white" }}
                >
                  Frontline Response Missions
                </div>
                <div className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">{s.caption}</div>
                <div className="text-white/80 text-sm mt-1 max-w-2xl">{s.sub}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider controls */}
        <button
          onClick={() => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform hover:scale-110"
          style={{ width: 42, height: 42, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.3)", color: "white", cursor: "pointer" }}
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={() => setSlide(s => (s + 1) % SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform hover:scale-110"
          style={{ width: 42, height: 42, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.3)", color: "white", cursor: "pointer" }}
        >
          <ChevronRight size={22} />
        </button>
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="rounded-full transition-all"
              style={{
                width: i === slide ? 22 : 8,
                height: 8,
                background: i === slide ? "var(--gov-orange)" : "rgba(255,255,255,0.4)",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <main id="mainContent" className="max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: DG Message + Gallery + Video */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            {/* DG Message */}
            <div className="gov-card">
              <div className="px-5 py-4" style={{ borderBottom: "3px solid var(--gov-orange)" }}>
                <div className="gov-section-title" style={{ marginBottom: 0 }}>DG's MESSAGE</div>
              </div>
              <div className="px-5 py-4">
                <div className="text-sm font-bold mb-0.5" style={{ color: "var(--gov-orange)" }}>
                  NATIONAL DISASTER RESPONSE FORCE
                </div>
                <div className="text-xs italic mb-4" style={{ color: "var(--gov-orange)" }}>
                  Saving Lives &amp; Beyond...
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="rounded-full overflow-hidden shadow-md" style={{ width: 140, height: 140, border: "3px solid var(--gov-border-dk, #ccc)" }}>
                      <img src="/img/dg_portrait.jpg" alt="DG NDRF" className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-xs font-bold" style={{ color: "var(--gov-navy)" }}>DG NDRF</div>
                      <div className="text-xs" style={{ color: "#666" }}>Shri Rajesh Kumar, IPS</div>
                    </div>
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: "#444" }}>
                    <p className="mb-3">
                      I am filled with great joy and a sense of huge responsibility to lead National Disaster Response Force (NDRF), the largest force globally dedicated to responding to disasters. NDRF has consistently taken the lead and demonstrated remarkable dedication and commitment in disaster situations embodying our motto of providing sustained disaster response service under any circumstances.
                    </p>
                    <p className="mb-3">
                      NDRF has saved over 1,59,293 precious lives and evacuated more than 8,64,316 stranded individuals from disaster-stricken areas both within and outside the country since its inception. The rapid and efficient response of NDRF during major disasters such as the Nepal Earthquake of 2015, the Türkiye Earthquake of 2023 and the Myanmar Earthquake of 2025 has garnered global acclaim.
                    </p>
                    <p>
                      The launch of <strong style={{ color: "var(--gov-orange)" }}>RakshaSetu DSS</strong> — our GIS-enabled relocation planning platform — marks a new chapter in proactive disaster risk governance. I will make all the efforts to carry forward the excellent work of my predecessors and steer NDRF to greater heights so that we can serve our country in times of need.
                    </p>
                    <div className="mt-4 pt-3 text-right" style={{ borderTop: "1px solid #EEE" }}>
                      <div className="text-xs font-bold" style={{ color: "var(--gov-navy)" }}>Director General</div>
                      <div className="text-xs" style={{ color: "#666" }}>National Disaster Response Force</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery + Updates + Video row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Image Gallery */}
              <div className="gov-card flex flex-col">
                <div className="px-4 py-3" style={{ background: "var(--gov-navy)", borderBottom: "2px solid var(--gov-orange)" }}>
                  <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider">
                    <Image size={13} /> IMAGE GALLERY
                  </div>
                </div>
                <div
                  className="flex-1 overflow-hidden cursor-pointer group"
                  onClick={() => setGalleryModal(true)}
                >
                  <img
                    src={GALLERY_IMGS[0].src}
                    alt={GALLERY_IMGS[0].cap}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ height: 180 }}
                  />
                  <div className="p-2 text-center">
                    <div className="text-xs" style={{ color: "#555" }}>{GALLERY_IMGS[0].cap}</div>
                  </div>
                </div>
                <div className="px-4 py-3 text-center" style={{ borderTop: "1px solid var(--gov-border,#DDD)" }}>
                  <button
                    onClick={() => setGalleryModal(true)}
                    className="gov-btn text-xs py-1.5 px-4 cursor-pointer"
                  >
                    View Gallery ({GALLERY_IMGS.length})
                  </button>
                </div>
              </div>

              {/* Latest Updates */}
              <div className="gov-card flex flex-col">
                <div className="px-4 py-3" style={{ background: "var(--gov-navy)", borderBottom: "2px solid var(--gov-orange)" }}>
                  <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider">
                    <BookOpen size={13} /> LATEST UPDATES
                  </div>
                </div>
                <div className="flex-1 divide-y overflow-y-auto" style={{ maxHeight: 220, borderColor: "var(--gov-border,#DDD)" }}>
                  {visibleUpdates.map((u, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveNews(u)}
                      className="px-3 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <ArrowRight size={11} className="mt-0.5 flex-shrink-0" style={{ color: "var(--gov-orange)" }} />
                        <div>
                          <div className="text-[10px] font-mono" style={{ color: "#999" }}>{u.date}</div>
                          <div className="text-xs leading-snug mt-0.5" style={{ color: i === 0 ? "var(--gov-orange)" : "var(--gov-navy)", fontWeight: i === 0 ? 600 : 400 }}>
                            {u.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 text-center" style={{ borderTop: "1px solid var(--gov-border,#DDD)" }}>
                  <button
                    onClick={() => setMoreUpdates(!moreUpdates)}
                    className="gov-btn text-xs py-1.5 px-4 cursor-pointer"
                  >
                    {moreUpdates ? "View Less" : "View More"}
                  </button>
                </div>
              </div>

              {/* Video Gallery */}
              <div className="gov-card flex flex-col">
                <div className="px-4 py-3" style={{ background: "var(--gov-navy)", borderBottom: "2px solid var(--gov-orange)" }}>
                  <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider">
                    <PlayCircle size={13} /> VIDEO GALLERY
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="relative cursor-pointer group" style={{ height: 180 }} onClick={() => setVideoModal(true)}>
                    <img src="/img/ceremony_parade.jpg" alt="Video thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
                      <div
                        className="flex items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-110"
                        style={{ width: 48, height: 48, background: "rgba(220,38,38,0.95)" }}
                      >
                        <PlayCircle size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-2 text-center">
                    <div className="text-xs" style={{ color: "#555" }}>NDRF 21st Raising Day Highlights</div>
                  </div>
                </div>
                <div className="px-4 py-3 text-center" style={{ borderTop: "1px solid var(--gov-border,#DDD)" }}>
                  <button
                    onClick={() => setVideoModal(true)}
                    className="gov-btn text-xs py-1.5 px-4 cursor-pointer"
                  >
                    Watch Video
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick links sidebar */}
          <div className="flex-shrink-0 w-full lg:w-60">
            <div className="gov-card mb-4">
              <div className="px-4 py-3" style={{ background: "var(--gov-navy)", borderBottom: "2px solid var(--gov-orange)" }}>
                <div className="text-white text-xs font-bold uppercase tracking-wider">Quick Links</div>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--gov-border,#DDD)" }}>
                {Object.entries(QUICK_LINKS_DATA).map(([label, data]) => (
                  <button
                    key={label}
                    onClick={() => setActiveModal({ title: data.title, desc: data.desc, items: data.details })}
                    className="gov-link-item w-full cursor-pointer hover:bg-orange-50 transition-colors"
                    style={{ textAlign: "left" }}
                  >
                    <span className="text-base leading-none">{data.icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* DSS Entry card */}
            <div
              className="rounded-lg overflow-hidden shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--gov-navy) 0%, var(--gov-navy-lt) 100%)" }}
            >
              <div className="px-4 py-5">
                <div className="text-white font-bold text-sm mb-1">RakshaSetu DSS</div>
                <div className="text-white/70 text-xs mb-4 leading-relaxed">
                  GIS-Enabled Disaster Management Decision-Support System for authorised NDRF &amp; SDMA officials.
                </div>
                <button
                  onClick={onEnterDSS}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded font-bold text-sm shadow-md"
                  style={{ background: "var(--gov-orange)", color: "white", border: "none", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--gov-orange-dk)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--gov-orange)")}
                >
                  <LogIn size={14} /> Official Sign In
                </button>
              </div>
              <img src="/img/rescue_ops.jpg" alt="NDRF Rescue" className="w-full object-cover" style={{ height: 120 }} />
            </div>
          </div>
        </div>
      </main>

      {/* ── Stats Bar ── */}
      <div style={{ background: "var(--gov-navy)", borderTop: "3px solid var(--gov-orange)" }}>
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          {[
            { icon: <Shield size={24} />, value: "1,59,293+", label: "Lives Saved" },
            { icon: <Users size={24} />, value: "8,64,316+", label: "Persons Evacuated" },
            { icon: <Globe size={24} />, value: "16", label: "NDRF Battalions" },
            { icon: <Award size={24} />, value: "21+", label: "Years of Service" },
          ].map(({ icon, value, label }, i) => (
            <div key={i} className="flex items-center gap-3 px-4 pt-2 md:pt-0" style={{ color: "white" }}>
              <span style={{ color: "rgba(255,180,80,0.8)" }}>{icon}</span>
              <div>
                <div className="font-bold text-xl" style={{ color: "white" }}>{value}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Awareness Banner ── */}
      <div className="overflow-hidden" style={{ background: "var(--gov-orange)" }}>
        <img src="/img/awareness_banner.jpg" alt="Disaster Awareness" className="w-full object-cover" style={{ height: 160, objectPosition: "center" }} />
      </div>

      {/* ── Partner Logos ── */}
      <div style={{ background: "#fff", borderTop: "2px solid var(--gov-border,#DDD)", borderBottom: "2px solid var(--gov-border,#DDD)" }}>
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-around flex-wrap gap-4">
          {[
            { name: "MHA", full: "Ministry of Home Affairs" },
            { name: "NDMA", full: "National Disaster Management Authority" },
            { name: "NIDM", full: "National Institute of Disaster Management" },
            { name: "IMD", full: "India Meteorological Department" },
            { name: "NRSC", full: "National Remote Sensing Centre (ISRO)" },
            { name: "NIC", full: "National Informatics Centre" },
            { name: "BSF", full: "Border Security Force" },
            { name: "CISF", full: "Central Industrial Security Force" },
            { name: "CRPF", full: "Central Reserve Police Force" },
          ].map(org => (
            <div
              key={org.name}
              onClick={() => setActiveModal({ title: `${org.name} — ${org.full}`, items: [`Official coordinating agency for disaster response, hazard mitigation, and telecommunications in partnership with NDRF.`] })}
              className="flex flex-col items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            >
              <div className="flex items-center justify-center rounded-full shadow" style={{ width: 44, height: 44, background: "var(--gov-navy)", color: "white", fontSize: 10, fontWeight: 700 }}>
                {org.name}
              </div>
              <span className="text-[9px] font-semibold" style={{ color: "#555" }}>{org.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: "var(--gov-navy-dk)" }}>
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mb-3">
            {[
              "Accessibility Statement", "Help", "Website Policies", "Sitemap",
              "Copyright Policy", "Hyperlink Policy", "Terms & Conditions", "Privacy Policy", "Feedback"
            ].map(l => (
              <button
                key={l}
                onClick={() => {
                  const info = NAV_DETAILS[l] || {
                    title: `${l} — NDRF Government of India`,
                    content: [`This is an official standard compliance document maintained in adherence to Guidelines for Indian Government Websites (GIGW 3.0).`],
                  };
                  setActiveModal({ title: info.title, items: info.content });
                }}
                className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
                style={{ background: "none", border: "none" }}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="text-center text-white/40 text-xs leading-relaxed">
            <p>Website Content Managed by NDRF · National Disaster Response Force, Ministry of Home Affairs, Government of India</p>
            <p>Designed, Developed and Hosted by National Informatics Centre (NIC) | Last Updated: 04 Sep 2026</p>
          </div>
        </div>
      </footer>

      {/* ── Interactive Informational Modal (for Navigation & Quick Links) ── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-2xl bg-white border border-gray-200">
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: "var(--gov-navy)", color: "white" }}>
              <h3 className="font-bold text-sm tracking-wide">{activeModal.title}</h3>
              <button onClick={() => setActiveModal(null)} className="text-white/70 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 text-sm text-gray-700 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
              {activeModal.desc && (
                <p className="font-semibold text-gray-900 pb-2 border-b border-gray-100">{activeModal.desc}</p>
              )}
              <ul className="space-y-2 list-disc pl-5">
                {activeModal.items.map((it, idx) => (
                  <li key={idx} className="leading-relaxed">{it}</li>
                ))}
              </ul>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="gov-btn text-xs py-1.5 px-4 cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── News Details Modal ── */}
      {activeNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl bg-white border border-gray-200">
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: "var(--gov-navy)", color: "white" }}>
              <div>
                <span className="text-[10px] font-mono text-orange-200 tracking-wider">MHA PRESS RELEASE · {activeNews.ref}</span>
                <h3 className="font-bold text-base mt-0.5">{activeNews.title}</h3>
              </div>
              <button onClick={() => setActiveNews(null)} className="text-white/70 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 text-sm text-gray-700 leading-relaxed flex flex-col gap-4">
              <div className="text-xs text-gray-500 font-mono">Date: {activeNews.date} · Location: New Delhi</div>
              <p>{activeNews.body}</p>
              <div className="p-3 rounded bg-orange-50 border border-orange-200 text-xs text-orange-900">
                <strong>Action Directives:</strong> State Disaster Management Authorities (SDMAs) are advised to access the RakshaSetu Decision-Support System for GIS-enabled real-time relocation coordination.
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <button onClick={onEnterDSS} className="gov-btn text-xs py-1.5 px-4 cursor-pointer flex items-center gap-1.5">
                <LogIn size={12} /> Open in RakshaSetu DSS
              </button>
              <button onClick={() => setActiveNews(null)} className="text-xs text-gray-600 hover:text-gray-900 cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Image Gallery Lightbox Modal ── */}
      {galleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg overflow-hidden bg-gray-900 border border-gray-700 shadow-2xl">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Image size={15} /> NDRF Operational Image Archive ({GALLERY_IMGS.length} Photographs)
              </h3>
              <button onClick={() => setGalleryModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {GALLERY_IMGS.map((img, i) => (
                <div key={i} className="rounded overflow-hidden border border-gray-800 bg-black/40 flex flex-col">
                  <img src={img.src} alt={img.cap} className="w-full h-48 object-cover" />
                  <div className="p-2.5 text-xs text-gray-300">{img.cap}</div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 bg-gray-950 border-t border-gray-800 flex justify-end">
              <button onClick={() => setGalleryModal(false)} className="gov-btn text-xs py-1.5 px-4 cursor-pointer">
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Video Player Modal ── */}
      {videoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl rounded-lg overflow-hidden bg-gray-900 border border-gray-700 shadow-2xl">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PlayCircle size={15} /> NDRF 21st Raising Day &amp; Rescue Highlight Reel
              </h3>
              <button onClick={() => setVideoModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 flex flex-col items-center">
              <div className="w-full rounded overflow-hidden relative" style={{ height: 380, background: "#000" }}>
                <img src="/img/ceremony_parade.jpg" alt="Video frame" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40">
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mb-3 shadow-lg">
                    <PlayCircle size={36} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white">आपदा सेवा सदैव सर्वत्र — 21 Years of Dedicated Service</h4>
                  <p className="text-xs text-white/70 max-w-lg mt-1">
                    Special documentary depicting the formation, evolution, and frontline flood, landslide, and cyclone rescue missions conducted by NDRF across India.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-950 border-t border-gray-800 flex justify-end">
              <button onClick={() => setVideoModal(false)} className="gov-btn text-xs py-1.5 px-4 cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};