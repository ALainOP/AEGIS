import React, { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { OverviewPage } from "./pages/OverviewPage";
import { RedZoneMapPage } from "./pages/RedZoneMapPage";
import { CapacityPage } from "./pages/CapacityPage";
import { RelocationQueuePage } from "./pages/RelocationQueuePage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { DisasterProvider, useDisaster } from "./context/DisasterContext";
import { RelocationDispatchModal } from "./components/modals/RelocationDispatchModal";
import type { PageKey } from "./types";

type AppView = "landing" | "login" | "dashboard";

function DashboardView({
  onLogout,
  userRole,
}: {
  onLogout: () => void;
  userRole: string;
}) {
  const { habitations, alertEvents, activePage, setActivePage } = useDisaster();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const criticalCount = habitations.filter(h => h.tier === 1 && h.status !== "allocated").length;

  const pageEl = {
    overview: <OverviewPage setActivePage={setActivePage} />,
    map: <RedZoneMapPage />,
    capacity: <CapacityPage />,
    queue: <RelocationQueuePage />,
    reports: <ReportsPage />,
    settings: <SettingsPage />,
  }[activePage];

  return (
    <div className="dss-root flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        criticalCount={criticalCount}
        onLogout={onLogout}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar alerts={alertEvents} onLogout={onLogout} userRole={userRole} />

        {/* Live Alert ticker */}
        <div
          className="flex-shrink-0 overflow-hidden"
          style={{ height: 24, background: "rgba(184,50,50,0.08)", borderBottom: "1px solid rgba(184,50,50,0.20)" }}
        >
          <div className="flex items-center h-full">
            <div
              className="flex-shrink-0 flex items-center gap-1.5 px-3"
              style={{ height: "100%", background: "rgba(184,50,50,0.20)", borderRight: "1px solid rgba(184,50,50,0.25)" }}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" style={{ animation: "pulse 1s infinite" }} />
              <span className="font-data text-[9.5px] font-bold uppercase tracking-widest text-red-400">
                LIVE TELEMETRY
              </span>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <div className="animate-marquee flex items-center gap-8 whitespace-nowrap px-4" style={{ height: 24, alignItems: "center", display: "flex" }}>
                {[...alertEvents, ...alertEvents].map((a, i) => (
                  <span key={i} className="font-data text-[9.5px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                    <span style={{ color: a.severity === "critical" ? "#EF4444" : "#F59E0B" }}>▲</span>{" "}
                    {a.title} — {a.location}
                    <span className="mx-4" style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main key={activePage} className="flex-1 overflow-hidden animate-fade-in">
          {pageEl}
        </main>
      </div>

      {/* Global Relocation Dispatch Assistant Modal */}
      <RelocationDispatchModal />
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<AppView>("landing");
  const [userRole, setUserRole] = useState("sdma");

  const handleLogin = (role: string) => {
    setUserRole(role);
    setView("dashboard");
  };

  const handleLogout = () => {
    setView("landing");
    setUserRole("");
  };

  return (
    <DisasterProvider>
      {view === "landing" && <LandingPage onEnterDSS={() => setView("login")} />}

      {view === "login" && (
        <div>
          {/* Back to public site link */}
          <div className="fixed top-3 left-3 z-50">
            <button
              onClick={() => setView("landing")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              ← Back to Public Portal
            </button>
          </div>
          <LoginPage onLogin={handleLogin} onBackToPublic={() => setView("landing")} />
        </div>
      )}

      {view === "dashboard" && <DashboardView onLogout={handleLogout} userRole={userRole} />}
    </DisasterProvider>
  );
}