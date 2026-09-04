import React, { useEffect, useState } from "react";
import { Search, Bell, Radio, ChevronDown, LogOut } from "lucide-react";
import type { AlertEvent } from "../../types";

interface TopBarProps {
  alerts: AlertEvent[];
  onLogout?: () => void;
  userRole?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ alerts, onLogout, userRole }) => {
  const [time, setTime] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const criticalAlerts = alerts.filter(a => a.severity === "critical").length;

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: false, timeZone: "Asia/Kolkata",
      }) + " IST");
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header
      className="flex items-center flex-shrink-0 w-full z-20"
      style={{ height: 48, background: "var(--ts-surf-0)", borderBottom: "1px solid var(--ts-border)" }}
    >
      {/* Authority strip */}
      <div
        className="hidden lg:flex items-center gap-2 px-4 flex-shrink-0"
        style={{ borderRight: "1px solid var(--ts-border)", height: "100%" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" style={{ animation: "pulse 2s infinite" }} />
        <span className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: "var(--ts-t35)" }}>
          Govt. of India · MHA · NDRF
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 flex items-center px-4 max-w-sm">
        <div className="relative w-full">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--ts-t20)" }} />
          <input
            className="ts-input pl-8 text-[12px]"
            placeholder="Search habitations, districts, sites…"
            style={{ height: 30, fontSize: 12 }}
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Right cluster */}
      <div className="flex items-center gap-1 px-3">
        {/* InSAR status */}
        <div className="hidden md:flex items-center gap-1.5 px-3" style={{ borderRight: "1px solid var(--ts-border)", height: "100%" }}>
          <Radio size={11} style={{ color: "var(--ts-amber)" }} />
          <span className="text-[10px]" style={{ color: "var(--ts-amber)" }}>InSAR Active</span>
        </div>

        {/* Alert bell */}
        <button className="relative ts-btn ts-btn-ghost px-2.5 py-1.5" style={{ gap: 5 }}>
          <Bell size={13} />
          {criticalAlerts > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full text-[8px] font-bold font-data"
              style={{ width: 14, height: 14, background: "var(--ts-red)", color: "white" }}
            >
              {criticalAlerts}
            </span>
          )}
        </button>

        {/* Time */}
        <div
          className="hidden lg:flex items-center px-3"
          style={{ borderLeft: "1px solid var(--ts-border)", height: "100%" }}
        >
          <span className="font-data text-[10px] tabular-nums" style={{ color: "var(--ts-t35)" }}>{time}</span>
        </div>

        {/* User chip with dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-1 rounded-sm transition-colors cursor-pointer"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--ts-border)", height: 30 }}
          >
            <div
              className="flex items-center justify-center rounded-sm text-[10px] font-bold"
              style={{ width: 20, height: 20, background: "rgba(201,134,26,0.2)", color: "var(--ts-amber)" }}
            >
              {userRole === "dg" ? "DG" : userRole === "secretary" ? "Sec" : "SD"}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-[11px] font-medium leading-tight" style={{ color: "var(--ts-t100)" }}>
                {userRole === "dg" ? "DG NDRF" : userRole === "secretary" ? "MHA Secretary" : "SDMA Officer"}
              </div>
              <div className="text-[9px] leading-tight" style={{ color: "var(--ts-t35)" }}>NDRF · DM Division</div>
            </div>
            <ChevronDown size={11} style={{ color: "var(--ts-t20)" }} />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 w-48 py-1 rounded shadow-xl z-50 animate-fade-in"
              style={{ background: "var(--ts-surf-1)", border: "1px solid var(--ts-border-subtle)" }}
            >
              <div className="px-3 py-2 border-b" style={{ borderColor: "var(--ts-border)" }}>
                <div className="text-xs font-semibold" style={{ color: "var(--ts-t100)" }}>
                  {userRole === "dg" ? "Shri Rajesh Kumar, IPS" : userRole === "secretary" ? "MHA Special Secretary" : "SDMA Official (Delhi)"}
                </div>
                <div className="text-[10px]" style={{ color: "var(--ts-t35)" }}>Government of India</div>
              </div>
              {onLogout && (
                <button
                  onClick={() => { setMenuOpen(false); onLogout(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer text-left"
                  style={{ color: "#E05555", background: "none", border: "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(184,50,50,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <LogOut size={13} />
                  <span>Exit to Public Portal</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
