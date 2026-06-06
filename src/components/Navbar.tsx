import React from "react";
import { Activity, Award, BarChart2, ShieldAlert, Sparkles, Trophy, Zap } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  liveMatchScore: string;
  liveMatchSummary: string;
}

export default function Navbar({ activeTab, setActiveTab, liveMatchScore, liveMatchSummary }: NavbarProps) {
  const tabs = [
    { id: "matches", label: "Match Center", icon: Activity },
    { id: "fantasy", label: "Fantasy XI", icon: ShieldAlert },
    { id: "analyst", label: "AI Analyst", icon: Sparkles },
    { id: "game", label: "Super Over Game", icon: Zap },
    { id: "news", label: "Editorial News", icon: Trophy },
    { id: "standings", label: "Rankings & Tables", icon: Award },
  ];

  return (
    <header className="w-full bg-[#0F131A] border-b border-slate-800 sticky top-0 z-50">
      {/* Live Match Mini Ticker - Broadcast styling */}
      <div className="bg-[#161B22] border-b border-slate-800/60 text-xs py-1.5 px-4 flex items-center justify-between text-emerald-400 font-mono">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold text-emerald-400">LIVE MATCH DETAILS:</span>
          <span>IND vs AUS 3rd T20I</span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span className="hidden md:inline text-slate-300 truncate">{liveMatchSummary}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="bg-[#0B0E14] border border-slate-800 px-2 rounded-md font-bold text-emerald-400">
            {liveMatchScore}
          </span>
          <span className="hidden lg:inline bg-red-950/40 border border-red-900/30 text-red-400 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider">
            HIGH TENSION
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("matches")}>
          <div className="bg-[#161B22] border border-slate-800 p-2 rounded-xl text-emerald-400 shadow-inner">
            <Trophy className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-1">
              CRICKET<span className="text-emerald-400">PRO</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono">BROADCAST SECTOR • PORTAL V4</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap justify-center items-center gap-1 bg-[#0B0E14] p-1 rounded-xl border border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-sans font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 font-semibold shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
                id={`nav-${tab.id}`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "stroke-[2.5]" : ""}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
