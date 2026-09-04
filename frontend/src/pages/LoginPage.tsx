import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck, Lock, User, AlertCircle, ChevronRight, LogIn } from "lucide-react";

interface LoginPageProps {
  onLogin: (role: string) => void;
  onBackToPublic?: () => void;
}

const DEMO_USERS = [
  { id: "SDMA-DL-001", password: "ndrf@2026", name: "SDMA Officer — Delhi", role: "sdma", designation: "Deputy Director, DM Division" },
  { id: "NDRF-DG-001", password: "dg@ndrf26", name: "DG NDRF", role: "dg", designation: "Director General, NDRF" },
  { id: "MHA-SEC-001", password: "mha@2026",  name: "MHA Secretary", role: "secretary", designation: "Secretary, Ministry of Home Affairs" },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBackToPublic }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = DEMO_USERS.find(u => u.id === userId.trim() && u.password === password);
      if (user) {
        onLogin(user.role);
      } else {
        setError("Invalid User ID or Password. Please check your credentials and try again.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(145deg, #1B3A6B 0%, #122A52 40%, #8B3200 100%)" }}
    >
      {/* Gov top strip */}
      <div className="flex items-center justify-between px-6 py-1.5" style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-4">
          <span className="text-[10.5px] font-semibold tracking-widest text-white/50 uppercase">
            भारत सरकार · Government of India
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[10.5px] font-semibold tracking-widest text-white/50 uppercase">
            गृह मंत्रालय · Ministry of Home Affairs
          </span>
        </div>
        <button
          type="button"
          onClick={() => onBackToPublic?.()}
          className="text-[10.5px] text-white/60 hover:text-white transition-colors cursor-pointer"
          style={{ background: "none", border: "none" }}
        >
          Go to Public Portal ↗
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex">
        {/* Left: branding panel */}
        <div
          className="hidden lg:flex flex-col justify-between p-12 flex-1"
          style={{ background: "rgba(0,0,0,0.15)", borderRight: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Logo section */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              {/* NDRF Emblem SVG placeholder */}
              <div className="flex items-center justify-center rounded-full" style={{ width: 72, height: 72, background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)" }}>
                <ShieldCheck size={36} className="text-orange-300" />
              </div>
              <div>
                <div className="font-devanagari text-2xl font-bold text-white leading-tight">
                  राष्ट्रीय आपदा मोचन बल
                </div>
                <div className="text-white/80 font-bold text-lg leading-tight">National Disaster Response Force</div>
                <div className="text-white/50 text-sm">Ministry of Home Affairs, Govt. of India</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-white font-bold text-3xl leading-tight mb-2">
                RakshaSetu DSS
              </div>
              <div className="text-white/60 text-base leading-relaxed">
                GIS-Enabled Disaster Management<br />Decision-Support System
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-md mb-8" style={{ background: "rgba(200,80,10,0.2)", border: "1px solid rgba(200,80,10,0.35)" }}>
              <Lock size={14} className="text-orange-300 flex-shrink-0" />
              <span className="text-orange-200 text-xs">
                <strong>Restricted Access.</strong> Authorised NDRF / SDMA / MHA personnel only.
                Unauthorised access is a criminal offence under IT Act 2000.
              </span>
            </div>

            {/* Feature pills */}
            <div className="flex flex-col gap-3">
              {[
                ["GIS Red Zone Mapping", "Real-time InSAR displacement monitoring"],
                ["Carrying Capacity Analysis", "Multi-parameter site suitability assessment"],
                ["Relocation Priority Queue", "SEVI-weighted triage across 18 states"],
                ["SDMA Analytics & Reports", "MHA-ready briefs and data exports"],
              ].map(([title, sub]) => (
                <div key={title} className="flex items-start gap-3">
                  <ChevronRight size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white/90 text-sm font-semibold">{title}</div>
                    <div className="text-white/40 text-xs">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
            <img src="/img/command_center.jpg" alt="NDRF Command Center" className="w-full object-cover" style={{ height: 180 }} />
            <div className="px-3 py-2" style={{ background: "rgba(0,0,0,0.5)" }}>
              <span className="text-white/50 text-xs">NDRF Disaster Management Command Centre — New Delhi</span>
            </div>
          </div>
        </div>

        {/* Right: Login form */}
        <div className="flex items-center justify-center p-8" style={{ width: "100%", maxWidth: 480, flexShrink: 0 }}>
          <div className="w-full">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="flex items-center justify-center rounded-full" style={{ width: 52, height: 52, background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)" }}>
                  <ShieldCheck size={24} className="text-orange-300" />
                </div>
              </div>
              <div className="text-white font-bold text-xl">RakshaSetu DSS</div>
              <div className="text-white/50 text-sm">NDRF · Ministry of Home Affairs</div>
            </div>

            {/* Login card */}
            <div className="login-card">
              {/* Card header */}
              <div className="px-8 py-5" style={{ background: "linear-gradient(135deg, #7B3200 0%, #C8500A 100%)", borderBottom: "3px solid #A03E08" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Lock size={16} className="text-orange-200" />
                  <span className="text-white font-bold text-base tracking-wide">OFFICIAL SIGN IN</span>
                </div>
                <div className="text-orange-200/70 text-xs">
                  Restricted to authorised government personnel
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="px-8 py-7 flex flex-col gap-5">
                {/* User ID */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#444" }}>
                    Government User ID
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#999" }} />
                    <input
                      className="login-input pl-9"
                      placeholder="e.g. SDMA-DL-001"
                      value={userId}
                      onChange={e => setUserId(e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#444" }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#999" }} />
                    <input
                      className="login-input pl-9 pr-10"
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "#999", background: "none", border: "none", cursor: "pointer" }}
                    >
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                    <AlertCircle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-red-700 text-xs leading-snug">{error}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !userId || !password}
                  className="gov-btn justify-center w-full py-3 text-sm"
                  style={{ opacity: loading || !userId || !password ? 0.65 : 1 }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" /></svg>
                      Authenticating…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><LogIn size={14} /> Sign In to RakshaSetu</span>
                  )}
                </button>

                {/* Demo credentials */}
                <div className="rounded" style={{ background: "#F0F7FF", border: "1px solid #C8DCEF", padding: "10px 12px" }}>
                  <div className="text-xs font-semibold mb-2" style={{ color: "#1B3A6B" }}>Demo Credentials (SIH 2026)</div>
                  {DEMO_USERS.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => { setUserId(u.id); setPassword(u.password); setError(""); }}
                      className="w-full text-left text-xs py-1.5 px-2 rounded mb-0.5 transition-colors"
                      style={{ color: "#2A5298", background: "transparent", border: "none", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#DEE9F6"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <span className="font-mono font-semibold">{u.id}</span>
                      <span style={{ color: "#666" }}> · {u.designation}</span>
                    </button>
                  ))}
                </div>
              </form>

              {/* Card footer */}
              <div className="px-8 py-4 flex items-center justify-between" style={{ background: "#F8FAFE", borderTop: "1px solid #E4EBF5" }}>
                <span className="text-xs" style={{ color: "#666" }}>
                  Helpline: <strong style={{ color: "#C8500A" }}>+91-9711077372</strong>
                </span>
                <span className="text-xs" style={{ color: "#999" }}>NIC Secured · GoI</span>
              </div>
            </div>

            {/* Footer links */}
            <div className="flex items-center justify-center gap-4 mt-5">
              {["Privacy Policy", "Terms of Use", "Accessibility"].map(l => (
                <button key={l} className="text-white/30 hover:text-white/60 text-xs transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 py-2 text-center" style={{ background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-white/25 text-xs">
          © 2026 National Disaster Response Force, Ministry of Home Affairs, Government of India.
          Designed, Developed and Hosted by National Informatics Centre (NIC).
        </span>
      </div>
    </div>
  );
};