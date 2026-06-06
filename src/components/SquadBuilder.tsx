import React, { useState, useEffect } from "react";
import { Player, FantasySquad, PlayerRole } from "../types";
import { PLAYERS_POOL } from "../data/cricketData";
import { Award, Check, Trash2, Trophy, Star, ShieldAlert, Sparkles, Filter, Search } from "lucide-react";

interface SquadBuilderProps {
  fantasySquad: FantasySquad;
  setFantasySquad: React.Dispatch<React.SetStateAction<FantasySquad>>;
}

export default function SquadBuilder({ fantasySquad, setFantasySquad }: SquadBuilderProps) {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<"ALL" | PlayerRole>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [squadSubmitted, setSquadSubmitted] = useState<boolean>(false);

  // Sync state upward in localStorage on submission or updates
  useEffect(() => {
    const saved = localStorage.getItem("cric_fantasy_squad");
    if (saved) {
      try {
        setFantasySquad(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved fantasy squad");
      }
    }
  }, [setFantasySquad]);

  // Player selection toggles
  const handleTogglePlayer = (player: Player) => {
    if (squadSubmitted) return; // cannot edit submitted team until reset

    const exists = fantasySquad.players.some((p) => p.id === player.id);
    let updatedPlayers = [...fantasySquad.players];

    if (exists) {
      // Remove player
      updatedPlayers = updatedPlayers.filter((p) => p.id !== player.id);
      let updatedCaptainId = fantasySquad.captainId;
      let updatedViceCaptainId = fantasySquad.viceCaptainId;

      if (fantasySquad.captainId === player.id) updatedCaptainId = null;
      if (fantasySquad.viceCaptainId === player.id) updatedViceCaptainId = null;

      setFantasySquad({
        players: updatedPlayers,
        captainId: updatedCaptainId,
        viceCaptainId: updatedViceCaptainId,
      });
    } else {
      // Check maximum squad size constraint (11 players limit)
      if (updatedPlayers.length >= 11) {
        alert("Your squad already has the maximum 11 players limit! Remove a player first.");
        return;
      }

      // Add player
      updatedPlayers.push(player);
      setFantasySquad({
        ...fantasySquad,
        players: updatedPlayers,
      });
    }
  };

  // Nominate Captain
  const setCaptain = (id: string) => {
    if (squadSubmitted) return;
    setFantasySquad({
      ...fantasySquad,
      captainId: id,
      viceCaptainId: fantasySquad.viceCaptainId === id ? null : fantasySquad.viceCaptainId, // Captain cannot be VC
    });
  };

  // Nominate Vice-Captain
  const setViceCaptain = (id: string) => {
    if (squadSubmitted) return;
    setFantasySquad({
      ...fantasySquad,
      viceCaptainId: id,
      captainId: fantasySquad.captainId === id ? null : fantasySquad.captainId, // VC cannot be Captain
    });
  };

  // Reset/Clear Squad
  const resetSquad = () => {
    setFantasySquad({ players: [], captainId: null, viceCaptainId: null });
    setSquadSubmitted(false);
    localStorage.removeItem("cric_fantasy_squad");
  };

  // Validate Squad constraints
  const squadSize = fantasySquad.players.length;
  const currentCredits = fantasySquad.players.reduce((sum, p) => sum + p.credits, 0);
  const budgetExceeded = currentCredits > 100;

  // Role counters
  const wks = fantasySquad.players.filter((p) => p.role === "WK");
  const bats = fantasySquad.players.filter((p) => p.role === "BAT");
  const ars = fantasySquad.players.filter((p) => p.role === "AR");
  const bowls = fantasySquad.players.filter((p) => p.role === "BOWL");

  const validationLogs: string[] = [];
  if (squadSize !== 11) {
    validationLogs.push(`Select exactly 11 players (Currently: ${squadSize}/11)`);
  }
  if (budgetExceeded) {
    validationLogs.push(`Credits budget exceeded. Maximum allowed is 100 (Currently: ${currentCredits.toFixed(1)})`);
  }
  if (wks.length < 1 || wks.length > 2) {
    validationLogs.push(`Wicketkeeper requirements: 1 to 2 needed (Selected: ${wks.length})`);
  }
  if (bats.length < 3 || bats.length > 5) {
    validationLogs.push(`Batsmen requirements: 3 to 5 needed (Selected: ${bats.length})`);
  }
  if (ars.length < 1 || ars.length > 3) {
    validationLogs.push(`All-rounder requirements: 1 to 3 needed (Selected: ${ars.length})`);
  }
  if (bowls.length < 3 || bowls.length > 5) {
    validationLogs.push(`Bowler requirements: 3 to 5 needed (Selected: ${bowls.length})`);
  }
  if (squadSize === 11 && (!fantasySquad.captainId || !fantasySquad.viceCaptainId)) {
    validationLogs.push("Designate. You must select both a Captain (2x points) and a Vice-Captain (1.5x points).");
  }

  const isValidSquad = validationLogs.length === 0;

  // Submit Final Squad
  const submitSquad = () => {
    if (!isValidSquad) return;
    localStorage.setItem("cric_fantasy_squad", JSON.stringify(fantasySquad));
    setSquadSubmitted(true);
  };

  // Filters Pool Players
  const filteredPool = PLAYERS_POOL.filter((player) => {
    const matchesQuery = player.name.toLowerCase().includes(searchQuery.toLowerCase()) || player.team.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedRoleFilter === "ALL" || player.role === selectedRoleFilter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Play Selector lists (Left Column) */}
        <div className="flex-1 space-y-4">
          <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-display font-bold text-sm flex items-center gap-1.5">
                  <Filter className="text-emerald-400 h-4.5 w-4.5" />
                  International Rosters Selector
                </h3>
                <p className="text-xs text-slate-400">Assemble your elite 11 players within budget limitations.</p>
              </div>
              <div className="w-full sm:w-auto relative">
                <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search player or team..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-56 bg-[#0B0E14] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-slate-700 font-sans"
                  id="search-player-input"
                />
              </div>
            </div>

            {/* Position Toggles Filter */}
            <div className="flex flex-wrap items-center gap-1 bg-[#0B0E14] p-1 border border-slate-800 rounded-xl max-w-max">
              {(["ALL", "WK", "BAT", "AR", "BOWL"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRoleFilter(role)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all uppercase ${
                    selectedRoleFilter === role
                      ? "bg-[#161B22] text-emerald-400 border border-slate-755 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                  id={`filter-${role}`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Player pool list scrollable */}
            <div className="overflow-y-auto max-h-[460px] pr-1 space-y-2">
              {filteredPool.map((player) => {
                const isSelected = fantasySquad.players.some((p) => p.id === player.id);
                return (
                  <div
                    key={player.id}
                    onClick={() => handleTogglePlayer(player)}
                    className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-emerald-950/20 border-emerald-555/40 shadow-inner"
                        : "bg-[#0B0E14] border-slate-800/60 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-[#161B22] rounded-lg flex items-center justify-center border border-slate-800 shrink-0">
                        <img src={player.imageUrl} alt={player.role} className="h-7 w-7 opacity-80" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-slate-100 text-xs font-sans font-bold leading-normal">{player.name}</h4>
                          <span className="text-[9px] font-mono bg-[#161B22] border border-slate-800 text-slate-300 px-1.5 rounded">
                            {player.team}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {player.role === "WK" ? "Wicketkeeper" : player.role === "BAT" ? "Batsman" : player.role === "AR" ? "All-Rounder" : "Bowler"} 
                          {" • "} 
                          {player.stats.runs ? `${player.stats.runs} runs` : `${player.stats.wickets || 0} wkts`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                      <div className="text-right">
                        <p className="text-white font-bold">{player.credits} Cr</p>
                        <p className="text-[9px] text-slate-500">Points: {player.avgScore}</p>
                      </div>
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold"
                            : "bg-[#0B0E14] border-slate-750 text-slate-600"
                        }`}
                      >
                        {isSelected ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <span className="text-[10px]">+</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredPool.length === 0 && (
                <div className="text-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-xl text-xs">
                  No professional players found matching current queries.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Squad Diagnostics (Right Column) */}
        <div className="w-full lg:w-96 space-y-4">
          <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg sticky top-28">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-white font-display font-bold text-sm">Squad Worksheet</h3>
                <p className="text-[10px] text-slate-500 font-mono">11-PLAYERS PARSER RULE</p>
              </div>
              <button
                onClick={resetSquad}
                className="text-slate-500 hover:text-red-400 p-1.5 rounded hover:bg-[#0B0E14] transition-all cursor-pointer"
                title="Clear playing sheet"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Visual Budget Counters */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Roster Players Selected:</span>
                <span className={`font-bold ${squadSize === 11 ? "text-emerald-400" : "text-yellow-400"}`}>
                  {squadSize}/11
                </span>
              </div>
              {/* Progress Bar size */}
              <div className="w-full h-2 bg-[#0B0E14] border border-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${squadSize === 11 ? "bg-emerald-500" : "bg-yellow-400"}`}
                  style={{ width: `${(squadSize / 11) * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>Credits Budget Spent:</span>
                <span className={`font-bold ${budgetExceeded ? "text-red-400" : "text-emerald-400"}`}>
                  {currentCredits.toFixed(1)}/100
                </span>
              </div>
              {/* Progress Bar budget */}
              <div className="w-full h-2 bg-[#0B0E14] border border-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${budgetExceeded ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min(100, (currentCredits / 100) * 100)}%` }}
                />
              </div>
            </div>

            {/* Position Rules Counters grid */}
            <div className="grid grid-cols-4 gap-2 bg-[#0B0E14] p-2.5 border border-slate-800 rounded-xl text-center font-mono">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 block">WK</span>
                <span className={`text-xs font-bold font-sans ${wks.length >= 1 && wks.length <= 2 ? "text-emerald-400" : "text-yellow-500"}`}>
                  {wks.length}/1-2
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 block">BAT</span>
                <span className={`text-xs font-bold font-sans ${bats.length >= 3 && bats.length <= 5 ? "text-emerald-400" : "text-yellow-500"}`}>
                  {bats.length}/3-5
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 block">AR</span>
                <span className={`text-xs font-bold font-sans ${ars.length >= 1 && ars.length <= 3 ? "text-emerald-400" : "text-yellow-500"}`}>
                  {ars.length}/1-3
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 block">BOWL</span>
                <span className={`text-xs font-bold font-sans ${bowls.length >= 3 && bowls.length <= 5 ? "text-emerald-400" : "text-yellow-500"}`}>
                  {bowls.length}/3-5
                </span>
              </div>
            </div>

            {/* Warnings list */}
            {validationLogs.length > 0 && (
              <div className="bg-red-950/25 border border-red-900/40 p-3 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-red-400 font-bold font-display">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  Roster Rules Violations ({validationLogs.length})
                </div>
                <ul className="text-[10px] text-slate-400 list-disc pl-4 space-y-0.5 font-sans leading-normal">
                  {validationLogs.map((log, i) => (
                    <li key={i}>{log}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submit Action Sheet */}
            {!squadSubmitted ? (
              <button
                disabled={!isValidSquad}
                onClick={submitSquad}
                className={`w-full py-3 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-1.5 shadow-md ${
                  isValidSquad
                    ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 glow-btn-pulse cursor-pointer"
                    : "bg-slate-900 text-slate-505 border border-slate-800 cursor-not-allowed"
                }`}
                id="lock-fantasy-squad-btn"
              >
                <Check className="h-4 w-4" />
                LOCK SQUAD AND PLAY
              </button>
            ) : (
              <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-xl text-center space-y-2.5">
                <p className="text-emerald-400 text-xs font-display font-medium leading-relaxed">
                  📢 your Fantasy XI is officially Locked and Submitted!
                </p>
                <button
                  onClick={resetSquad}
                  className="mx-auto block text-slate-400 hover:text-white border border-slate-850 px-3 py-1 rounded text-[10px] font-semibold"
                >
                  Edit Roster Selection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Captain nomination (Shows once players selection has reached exactly 11) */}
      {squadSize === 11 && (
        <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl animate-fadeIn">
          <div>
            <h3 className="text-white font-display font-bold text-sm flex items-center gap-1.5">
              <Star className="text-yellow-400 h-4.5 w-4.5" />
              Nominate Captain & Vice-Captain
            </h3>
            <p className="text-xs text-slate-400">
              Captain receives <span className="text-yellow-400 font-bold">2x</span> points, and Vice-Captain receives{" "}
              <span className="text-yellow-400 font-bold">1.5x</span> points!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fantasySquad.players.map((p) => {
              const isC = fantasySquad.captainId === p.id;
              const isVC = fantasySquad.viceCaptainId === p.id;
              return (
                <div
                  key={p.id}
                  className="p-3 bg-[#0B0E14] border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏏</span>
                    <div>
                      <h4 className="text-slate-200 text-xs font-bold">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 uppercase font-mono">
                        {p.role} • {p.team}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCaptain(p.id)}
                      disabled={squadSubmitted}
                      className={`h-7 w-7 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                        isC
                          ? "bg-yellow-500 text-slate-950 border-yellow-400"
                          : "bg-slate-950 text-slate-400 border-slate-900 hover:text-white"
                      }`}
                      title="Set as Captain (2x points)"
                    >
                      C
                    </button>
                    <button
                      onClick={() => setViceCaptain(p.id)}
                      disabled={squadSubmitted}
                      className={`h-7 w-7 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                        isVC
                          ? "bg-slate-600 text-white border-slate-500"
                          : "bg-slate-950 text-slate-400 border-slate-905 hover:text-white"
                      }`}
                      title="Set as Vice-Captain (1.5x points)"
                    >
                      VC
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 3: Field Visualizer Graph / Playing Squad Graphic (Shows once squad is submitted) */}
      {squadSubmitted && (
        <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl animate-fadeIn max-w-2xl mx-auto text-center relative overflow-hidden">
          {/* Subtle light lines to replicate field pitch */}
          <div className="absolute inset-0 bg-radial from-emerald-950/10 to-slate-950/90 pointer-events-none" />

          <div>
            <h3 className="text-white font-display font-black text-base flex justify-center items-center gap-2">
              <Trophy className="text-yellow-400 h-5 w-5" />
              Fantasy XI Playing Grid
            </h3>
            <p className="text-xs text-slate-400">Aesthetic placement of your loaded dream XI on line-up markers.</p>
          </div>

          {/* Playing Field Box */}
          <div className="bg-gradient-to-b from-emerald-950/60 via-emerald-900/20 to-[#0B0E14] rounded-2xl border border-emerald-990/60 p-6 min-h-[480px] flex flex-col justify-between relative shadow-inner">
            {/* Field Boundary Lines */}
            <div className="absolute inset-x-8 top-16 bottom-16 border border-dashed border-emerald-500/20 rounded-full pointer-events-none" />
            <div className="absolute inset-x-16 top-32 bottom-32 border border-dashed border-emerald-500/10 rounded-full pointer-events-none" />

            {/* Pitch Square centered */}
            <div className="absolute left-[calc(50%-1.5rem)] top-[calc(50%-4rem)] h-32 w-12 bg-lime-950/20 border border-emerald-500/10 rounded pointer-events-none" />

            {/* Line 1: Wicketkeeper */}
            <div className="space-y-1.5 z-10">
              <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider">WICKETKEEPER</span>
              <div className="flex justify-center gap-6">
                {wks.map((p) => {
                  const isC = fantasySquad.captainId === p.id;
                  const isVC = fantasySquad.viceCaptainId === p.id;
                  return (
                    <div key={p.id} className="flex flex-col items-center">
                       <div className="h-10 w-10 rounded-full bg-[#0B0E14] border-2 border-slate-800 flex items-center justify-center relative">
                        <span>🧤</span>
                        {isC && <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-slate-950 border border-yellow-400 rounded-full text-[8px] font-bold h-4 w-4 flex items-center justify-center">C</span>}
                        {isVC && <span className="absolute -top-1.5 -right-1.5 bg-slate-600 text-white border border-slate-500 rounded-full text-[8px] font-bold h-4 w-4 flex items-center justify-center">VC</span>}
                      </div>
                      <span className="text-[10px] font-bold text-slate-200 mt-1.5 font-sans bg-[#161B22]/80 px-2 py-0.5 rounded border border-slate-800 ">{p.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Line 2: Batsmen */}
            <div className="space-y-1.5 z-10 my-4">
              <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider">BATSMEN</span>
              <div className="flex justify-center flex-wrap gap-6">
                {bats.map((p) => {
                  const isC = fantasySquad.captainId === p.id;
                  const isVC = fantasySquad.viceCaptainId === p.id;
                  return (
                    <div key={p.id} className="flex flex-col items-center min-w-[70px]">
                       <div className="h-10 w-10 rounded-full bg-[#0B0E14] border-2 border-slate-800 flex items-center justify-center relative">
                        <span>🏏</span>
                        {isC && <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-slate-950 border border-yellow-400 rounded-full text-[8px] font-bold h-4 w-4 flex items-center justify-center">C</span>}
                        {isVC && <span className="absolute -top-1.5 -right-1.5 bg-slate-600 text-white border border-slate-500 rounded-full text-[8px] font-bold h-4 w-4 flex items-center justify-center">VC</span>}
                      </div>
                      <span className="text-[10px] font-bold text-slate-200 mt-1.5 font-sans bg-[#161B22]/80 px-2 py-0.5 rounded border border-slate-800 truncate max-w-[90px]">{p.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Line 3: All-Rounders */}
            <div className="space-y-1.5 z-10 my-4">
              <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider">ALL-ROUNDERS</span>
              <div className="flex justify-center flex-wrap gap-6">
                {ars.map((p) => {
                  const isC = fantasySquad.captainId === p.id;
                  const isVC = fantasySquad.viceCaptainId === p.id;
                  return (
                    <div key={p.id} className="flex flex-col items-center min-w-[70px]">
                       <div className="h-10 w-10 rounded-full bg-[#0B0E14] border-2 border-slate-800 flex items-center justify-center relative">
                        <span>⚡</span>
                        {isC && <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-slate-950 border border-yellow-400 rounded-full text-[8px] font-bold h-4 w-4 flex items-center justify-center">C</span>}
                        {isVC && <span className="absolute -top-1.5 -right-1.5 bg-slate-600 text-white border border-slate-500 rounded-full text-[8px] font-bold h-4 w-4 flex items-center justify-center">VC</span>}
                      </div>
                      <span className="text-[10px] font-bold text-slate-200 mt-1.5 font-sans bg-[#161B22]/80 px-2 py-0.5 rounded border border-slate-800 truncate max-w-[90px]">{p.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Line 4: Bowlers */}
            <div className="space-y-1.5 z-10">
              <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider">BOWLERS</span>
              <div className="flex justify-center flex-wrap gap-6 font-sans">
                {bowls.map((p) => {
                  const isC = fantasySquad.captainId === p.id;
                  const isVC = fantasySquad.viceCaptainId === p.id;
                  return (
                    <div key={p.id} className="flex flex-col items-center min-w-[70px]">
                       <div className="h-10 w-10 rounded-full bg-[#0B0E14] border-2 border-slate-800 flex items-center justify-center relative">
                        <span>🔴</span>
                        {isC && <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-slate-950 border border-yellow-400 rounded-full text-[8px] font-bold h-4 w-4 flex items-center justify-center">C</span>}
                        {isVC && <span className="absolute -top-1.5 -right-1.5 bg-slate-600 text-white border border-slate-500 rounded-full text-[8px] font-bold h-4 w-4 flex items-center justify-center">VC</span>}
                      </div>
                      <span className="text-[10px] font-bold text-slate-200 mt-1.5 font-sans bg-[#161B22]/80 px-2 py-0.5 rounded border border-slate-800 truncate max-w-[90px]">{p.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Field Footer Score summary */}
            <div className="border-t border-emerald-950 p-2.5 mt-4 text-center">
              <p className="text-[10px] text-slate-500 font-mono">
                CRICKETPRO • DFS ENGINE V1.2 • TOTAL VALUE: {currentCredits.toFixed(1)} CREDITS
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
