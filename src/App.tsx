import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import LiveScoreboard from "./components/LiveScoreboard";
import SquadBuilder from "./components/SquadBuilder";
import MatchPredictor from "./components/MatchPredictor";
import SuperOverGame from "./components/SuperOverGame";
import NewsSection from "./components/NewsSection";
import StandingsTable from "./components/StandingsTable";
import { Match, FantasySquad } from "./types";
import { INITIAL_MATCH_STATE } from "./data/cricketData";
import { Trophy, HelpCircle, Activity } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("matches");

  // Keep track of active live match, shared with navbar for dynamic score changes
  const [liveMatch, setLiveMatch] = useState<Match>(INITIAL_MATCH_STATE);

  // Keep track of user's active fantasy squad selection
  const [fantasySquad, setFantasySquad] = useState<FantasySquad>({
    players: [],
    captainId: null,
    viceCaptainId: null,
  });

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-200 flex flex-col font-sans select-none antialiased">
      {/* Broadcast Live Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        liveMatchScore={liveMatch.teamB.score}
        liveMatchSummary={liveMatch.summaryText}
      />

      {/* Main Broadcast Sandbox Page */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, cubicBezier: [0.4, 0, 0.2, 1] }}
            className="focus:outline-none"
          >
            {activeTab === "matches" && (
              <LiveScoreboard match={liveMatch} setMatch={setLiveMatch} />
            )}

            {activeTab === "fantasy" && (
              <SquadBuilder fantasySquad={fantasySquad} setFantasySquad={setFantasySquad} />
            )}

            {activeTab === "analyst" && (
              <MatchPredictor />
            )}

            {activeTab === "game" && (
              <SuperOverGame />
            )}

            {activeTab === "news" && (
              <NewsSection />
            )}

            {activeTab === "standings" && (
              <StandingsTable />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Broadcaster Ticker Row */}
      <footer className="w-full bg-[#0F131A] border-t border-slate-800 py-6 mt-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Trophy className="text-emerald-500 h-4.5 w-4.5" />
            <span>© 2026 CRICKETPRO Broadcasting & Analytics Network. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span className="hover:text-white transition-all cursor-pointer">BROADCAST TERMS</span>
            <span className="text-slate-800">|</span>
            <span className="hover:text-white transition-all cursor-pointer">STATS PROTOCOLS</span>
            <span className="text-slate-800">|</span>
            <span className="hover:text-white transition-all cursor-pointer flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              S1 FEED ON
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
