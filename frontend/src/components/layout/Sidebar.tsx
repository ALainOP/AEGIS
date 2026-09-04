import React from "react";
import {
  LayoutDashboard, MapPin, Layers, ListOrdered,
  BarChart2, Settings, ChevronLeft, ChevronRight,
  ShieldCheck, AlertTriangle, LogOut,
} from "lucide-react";
import type { PageKey } from "../../types";

interface SidebarProps {
  activePage: PageKey;
  setActivePage: (p: PageKey) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  criticalCount: number;
  onLogout: () => void;
}

const NAV: { id: PageKey; label: string; Icon: React.ElementType }[] = [
  { id: "overview",  label: "Overview",          Icon: LayoutDashboard },
  { id: "map",       label: "Red Zone Map",       Icon: MapPin          },
  { id: "capacity",  label: "Carrying Capacity",  Icon: Layers          },
  { id: "queue",     label: "Relocation Queue",   Icon: ListOrdered     },
  { id: "reports",   label: "Reports & Insights", Icon: BarChart2       },
  { id: "settings",  label: "Settings",           Icon: Settings        },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activePage, setActivePage, collapsed, setCollapsed, criticalCount, onLogout,
}) => {
  const w = collapsed ? 56 : 220;
  return (
    <aside
      className="flex flex-col flex-shrink-0 h-screen sticky top-0 z-30 transition-all duration-200 overflow-hidden"
      style={{ width: w, background: "var(--ts-surf-0)", borderRight: "1px solid var(--ts-border)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 flex-shrink-0"
        style={{ height: 48, borderBottom: "1px solid var(--ts-border)", overflow: "hidden" }}>
        <div className="flex-shrink-0 flex items-center justify-center"
          style={{ width: 30, height: 30, background: "rgba(201,134,26,0.12)", border: "1px solid rgba(201,134,26,0.28)", borderRadius: 2 }}>
          <ShieldCheck size={15} style={{ color: "var(--ts-amber)" }} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-bold text-[13.5px] leading-tight whitespace-nowrap"
              style={{ color: "var(--ts-t100)", letterSpacing: "-0.01em" }}>RakshaSetu</div>
            <div className="text-[9px] uppercase tracking-widest whitespace-nowrap" style={{ color: "var(--ts-t20)" }}>
              NDRF · TerraSafe DSS
            </div>
          </div>
        )}
      </div>

      {!collapsed ? (
        <div className="px-3 pt-4 pb-1.5">
          <span className="text-[9px] uppercase tracking-[0.12em] font-semibold" style={{ color: "var(--ts-t20)" }}>Navigation</span>
        </div>
      ) : <div className="pt-3" />}

      <nav className="flex-1 flex flex-col gap-0.5 px-2 overflow-y-auto overflow-x-hidden">
        {NAV.map(({ id, label, Icon }) => {
          const isActive = activePage === id;
          return (
            <button key={id} onClick={() => setActivePage(id)} title={collapsed ? label : undefined}
              className={`nav-item ${isActive ? "active" : ""}`}
              style={{ justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "8px 0" : "7px 10px" }}>
              <span className="flex-shrink-0 relative">
                <Icon size={14} />
                {id === "map" && criticalCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full font-bold font-data"
                    style={{ width: 13, height: 13, fontSize: 7, background: "var(--ts-red)", color: "white" }}>
                    {criticalCount > 9 ? "9+" : criticalCount}
                  </span>
                )}
              </span>
              {!collapsed && <span className="text-[12.5px] leading-none">{label}</span>}
              {!collapsed && id === "map" && criticalCount > 0 && (
                <span className="ml-auto ts-badge ts-badge-immediate" style={{ fontSize: 8 }}>{criticalCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Org footer */}
      {!collapsed && (
        <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: "1px solid var(--ts-border)" }}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={11} style={{ color: "var(--ts-amber)", flexShrink: 0 }} />
            <div>
              <div className="text-[10.5px] font-semibold" style={{ color: "var(--ts-t60)" }}>NDRF · DM Division</div>
              <div className="text-[9px]" style={{ color: "var(--ts-t20)" }}>Ministry of Home Affairs, GoI</div>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <button onClick={onLogout} title="Return to public portal"
        className="flex-shrink-0 flex items-center gap-2 px-3 transition-colors"
        style={{ height: 36, background: "rgba(184,50,50,0.06)", borderTop: "1px solid var(--ts-border)", borderRight: "none", borderBottom: "none", borderLeft: "none", color: "rgba(255,100,100,0.5)", cursor: "pointer", width: "100%", justifyContent: collapsed ? "center" : "flex-start" }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(184,50,50,0.12)"; e.currentTarget.style.color = "#E05555"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(184,50,50,0.06)"; e.currentTarget.style.color = "rgba(255,100,100,0.5)"; }}>
        <LogOut size={13} />
        {!collapsed && <span className="text-[11px]">Exit to Public Portal</span>}
      </button>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", height: 32, width: "100%", background: "transparent", borderTop: "1px solid var(--ts-border)", borderRight: "none", borderBottom: "none", borderLeft: "none", color: "var(--ts-t20)", cursor: "pointer" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        {collapsed ? <ChevronRight size={13} /> : (
          <span className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--ts-t20)" }}>
            <ChevronLeft size={11} /> Collapse
          </span>
        )}
      </button>
    </aside>
  );
};