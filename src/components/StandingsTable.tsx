import React, { useState } from "react";
import { StandingTeam, ICCRankingItem } from "../types";
import { TOURNAMENT_STANDINGS, ICC_RANKINGS_BAT, ICC_RANKINGS_BOWL } from "../data/cricketData";
import { Award, BarChart2, Check, TrendingUp, Trophy } from "lucide-react";

export default function StandingsTable() {
  const [rankingTab, setRankingTab] = useState<"BAT" | "BOWL">("BAT");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Point Table Standings (Left and Center) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-white font-display font-medium text-sm flex items-center gap-1.5">
                <Trophy className="text-emerald-400 h-4.5 w-4.5" />
                Tournament points Table (World Cup - Super 8)
              </h3>
              <p className="text-xs text-slate-400">Current standings based on matches, won ratio, net-run rates, and streaks.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 font-sans">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800 pb-2">
                    <th className="py-2.5 font-mono text-[10px] uppercase w-10 text-center">Pos</th>
                    <th className="py-2.5 uppercase text-slate-400">Team</th>
                    <th className="py-2.5 text-center font-mono text-[10px] w-12">M</th>
                    <th className="py-2.5 text-center font-mono text-[10px] w-12 text-emerald-400">W</th>
                    <th className="py-2.5 text-center font-mono text-[10px] w-12 text-red-400">L</th>
                    <th className="py-2.5 text-center font-mono text-[10px] w-16">NRR</th>
                    <th className="py-2.5 text-center font-mono text-[10px] w-28 text-slate-450">Recent Form</th>
                    <th className="py-2.5 text-right font-bold w-16 text-emerald-300">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {TOURNAMENT_STANDINGS.map((t, idx) => (
                    <tr key={idx} className="hover:bg-[#0B0E14]/30 font-sans">
                      <td className="py-3 text-center font-mono text-slate-500 font-bold">{t.position}</td>
                      <td className="py-3 font-semibold text-slate-200 flex items-center gap-2">
                        <span>
                          {t.name === "India" ? "🏏" : t.name === "Australia" ? "🦘" : t.name === "South Africa" ? "🇿🇦" : t.name === "England" ? "🦁" : t.name === "Pakistan" ? "🌙" : t.name === "New Zealand" ? "🇳🇿" : "🇦🇫"}
                        </span>
                        <span>{t.name}</span>
                      </td>
                      <td className="py-3 text-center font-mono text-slate-400">{t.matches}</td>
                      <td className="py-3 text-center font-mono text-emerald-400">{t.won}</td>
                      <td className="py-3 text-center font-mono text-red-500">{t.lost}</td>
                      <td className="py-3 text-center font-mono text-slate-400 font-medium">{t.nrr}</td>
                      <td className="py-3">
                        <div className="flex items-center justify-center gap-1 font-mono">
                          {t.recent.map((f, i) => (
                            <span
                              key={i}
                              className={`h-4.5 w-4.5 rounded text-[9px] font-extrabold flex items-center justify-center ${
                                f === "W"
                                  ? "bg-emerald-950/60 text-emerald-450 border border-emerald-900/50"
                                  : "bg-red-955/65 text-red-400 border border-red-900/50"
                              }`}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 text-right font-bold text-emerald-400 font-mono text-xs">{t.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Players Rankings Table List (Right Side) */}
        <div className="space-y-4">
          <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-display font-medium text-sm flex items-center gap-1.5">
                  <Award className="text-emerald-400 h-4.5 w-4.5" />
                  ICC Player Rankings
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">GLOBAL T20I LEADERBOARDS</p>
              </div>
            </div>

            {/* Selector tabs between bat and ball */}
            <div className="grid grid-cols-2 gap-1 bg-[#0B0E14] p-1 border border-slate-800 rounded-xl mb-4">
              <button
                onClick={() => setRankingTab("BAT")}
                className={`py-1.5 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
                  rankingTab === "BAT" ? "bg-[#161B22] text-emerald-400 border border-slate-800/40 shadow" : "text-slate-500 hover:text-white"
                }`}
              >
                Batting Rankings
              </button>
              <button
                onClick={() => setRankingTab("BOWL")}
                className={`py-1.5 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
                  rankingTab === "BOWL" ? "bg-[#161B22] text-emerald-400 border border-slate-800/40 shadow" : "text-slate-500 hover:text-white"
                }`}
              >
                Bowling Rankings
              </button>
            </div>

            {/* List rankings */}
            <div className="space-y-2.5">
              {(rankingTab === "BAT" ? ICC_RANKINGS_BAT : ICC_RANKINGS_BOWL).map((it) => (
                <div
                  key={it.rank}
                  className="p-3 bg-[#0B0E14] border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-500 w-4 text-center">
                      #{it.rank}
                    </span>
                    <div>
                      <h4 className="text-slate-100 text-xs font-sans font-bold leading-normal">{it.player}</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-mono mt-0.5">
                        {it.team} • Global Elite
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs font-sans">
                    <p className="text-emerald-400 font-bold">{it.rating}</p>
                    <p className="text-[9px] text-slate-600 flex items-center gap-0.5 shrink-0 justify-end">
                      <TrendingUp className="h-2.5 w-2.5 text-emerald-500" /> RAT
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
