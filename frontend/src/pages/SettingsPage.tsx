import React from "react";
import { User, Database, Map, Bell, Shield, Save } from "lucide-react";

export const SettingsPage: React.FC = () => {
  const sections = [
    {
      id:"profile", label:"User Profile", Icon:User,
      fields:[
        { label:"Full Name",        value:"SDMA Officer", type:"text" },
        { label:"Designation",      value:"Deputy Director, DM Division", type:"text" },
        { label:"Organisation",     value:"NDRF, Ministry of Home Affairs", type:"text" },
        { label:"State Jurisdiction",value:"National (All States)", type:"text" },
        { label:"Contact Email",    value:"sdma.officer@ndrf.gov.in", type:"email" },
      ],
    },
    {
      id:"data", label:"Data Configuration", Icon:Database,
      fields:[
        { label:"InSAR Telemetry Endpoint", value:"wss://insar.isro.gov.in/live/ndrf", type:"text" },
        { label:"Data Refresh Interval",    value:"300", type:"number" },
        { label:"Historical Data Window",   value:"180", type:"number" },
      ],
    },
    {
      id:"map", label:"Map Settings", Icon:Map,
      fields:[
        { label:"Default Basemap",      value:"dark", type:"text" },
        { label:"Default Zoom Level",   value:"5", type:"number" },
        { label:"GeoJSON Source URL",   value:"https://gis.ndrf.gov.in/api/redzone-geojson", type:"text" },
      ],
    },
    {
      id:"alerts", label:"Alert Thresholds", Icon:Bell,
      fields:[
        { label:"InSAR Displacement Threshold (mm/yr)", value:"25", type:"number" },
        { label:"Pore Pressure Alert (kPa)",             value:"90", type:"number" },
        { label:"Rainfall Intensity Alert (mm/hr)",      value:"60", type:"number" },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-3 flex-shrink-0" style={{ borderBottom:"1px solid var(--ts-border)", background:"var(--ts-surf-0)" }}>
        <h2 className="text-[14px] font-bold tracking-tight" style={{ color:"var(--ts-t100)", letterSpacing:"-0.01em" }}>Settings</h2>
        <p className="text-[10.5px] mt-0.5" style={{ color:"var(--ts-t35)" }}>Platform configuration · NDRF DM Division</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl flex flex-col gap-6">
          {sections.map(sec => (
            <div key={sec.id} className="ts-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom:"1px solid var(--ts-border)" }}>
                <sec.Icon size={13} style={{ color:"var(--ts-amber)" }} />
                <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color:"var(--ts-t60)" }}>{sec.label}</span>
              </div>
              <div className="px-4 py-4 flex flex-col gap-4">
                {sec.fields.map(field => (
                  <div key={field.label} className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color:"var(--ts-t20)" }}>
                      {field.label}
                    </label>
                    <input
                      className="ts-input"
                      type={field.type}
                      defaultValue={field.value}
                      style={{ height:32, fontSize:12.5 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* System info */}
          <div className="ts-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom:"1px solid var(--ts-border)" }}>
              <Shield size={13} style={{ color:"var(--ts-amber)" }} />
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color:"var(--ts-t60)" }}>System Information</span>
            </div>
            <div className="px-4 py-4 grid grid-cols-2 gap-3">
              {[
                ["Platform", "RakshaSetu DSS v1.0"],
                ["Classification","RESTRICTED — GoI INTERNAL"],
                ["Data Standard","BIS IS 15700:2018"],
                ["GIS Projection","WGS 84 / EPSG:4326"],
                ["Last Sync","Sep 04, 2026, 09:57 IST"],
                ["NIC Hosted","Yes — NIC Data Centre, Hyderabad"],
              ].map(([k,v]) => (
                <div key={k}>
                  <div className="text-[9.5px] uppercase tracking-widest font-semibold" style={{ color:"var(--ts-t20)" }}>{k}</div>
                  <div className="font-data text-[11px] mt-0.5" style={{ color:"var(--ts-t60)" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button className="ts-btn ts-btn-amber gap-1.5" style={{ padding:"7px 18px" }}>
              <Save size={12}/> Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
