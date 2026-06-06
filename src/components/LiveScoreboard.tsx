import React, { useState, useEffect, useRef } from "react";
import { Match, CommentaryItem, BatterInnings, BowlerInnings } from "../types";
import { OTHER_MATCHES, INITIAL_MATCH_STATE } from "../data/cricketData";
import { Play, RotateCcw, Send, Sparkles, Trophy, User, Zap, ChevronRight } from "lucide-react";

interface LiveScoreboardProps {
  match: Match;
  setMatch: React.Dispatch<React.SetStateAction<Match>>;
}

export default function LiveScoreboard({ match, setMatch }: LiveScoreboardProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<string>("m-1");
  const [currentMatch, setCurrentMatch] = useState<Match>(match);

  // Simulation State for Live Over
  // We starts at 19.0 overs, IND chasing 184 (stands at 170/5), needs 14 off 6.
  const [ballsSimulated, setBallsSimulated] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<string>("");
  const [isSimulatingAuto, setIsSimulatingAuto] = useState<boolean>(false);

  // Chat state
  const [chatInput, setChatInput] = useState<string>("");
  const [chatLog, setChatLog] = useState<{ sender: "user" | "ai"; text: string; time: string }[]>([
    {
      sender: "ai",
      text: "Welcome to the commentary booth! I am your AI analyst tracking this high-tension final over. Hardik Pandya is at the striker's end, with Pat Cummins set to deliver. Feel free to ask me about tactics or predictions!",
      time: "19.0"
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync state upward when currentMatch changes
  useEffect(() => {
    if (selectedMatchId === "m-1") {
      setMatch(currentMatch);
    }
  }, [currentMatch, selectedMatchId, setMatch]);

  // Handle Match Toggles
  const handleMatchChange = (id: string) => {
    setSelectedMatchId(id);
    if (id === "m-1") {
      setCurrentMatch(match);
    } else {
      const other = OTHER_MATCHES.find((m) => m.id === id);
      if (other) {
        setCurrentMatch(other);
      }
    }
  };

  // Scroll Chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  // Reset Over Simulator
  const resetSimulation = () => {
    const freshMatch = JSON.parse(JSON.stringify(INITIAL_MATCH_STATE));
    setCurrentMatch(freshMatch);
    setMatch(freshMatch);
    setBallsSimulated(0);
    setIsGameOver(false);
    setGameResult("");
    setIsSimulatingAuto(false);
    setChatLog([
      {
        sender: "ai",
        text: "The final over has been reset! India needs 14 runs off 6 balls to claim victory. Pat Cummins is ready to bowl. What is your prediction?",
        time: "19.0"
      }
    ]);
  };

  // Run Ball Simulation
  const simulateNextBall = () => {
    if (selectedMatchId !== "m-1" || isGameOver) return;

    const ballIndex = ballsSimulated + 1; // 1 to 6
    if (ballIndex > 6) return;

    // Define random outcomes for a thrilling last over
    // Possible ball results: 0 (dot), 1 (single), 2 (double), 4 (four), 6 (six), W (wicket), Wd (wide)
    const outcomesPool = [
      { run: 6, extras: 0, isWicket: false, ballDisplay: "6", commentary: "INTO THE CROWD! Cummins pitches it short in the slot, batsman clears front leg and deposits it over deep mid-wicket for a gigantic six!" },
      { run: 4, extras: 0, isWicket: false, ballDisplay: "4", commentary: "CRACKING BOUNDARY! Full toss outside off, slashed forcefully behind back-point. Nobody is moving!" },
      { run: 1, extras: 0, isWicket: false, ballDisplay: "1", commentary: "Excellent yorker length. Batsman digs it out to long-on for a single. Rotates strike carefully." },
      { run: 0, extras: 0, isWicket: true, ballDisplay: "W", commentary: "OUT! CLEAN BOWLED! Absolute corker! Fast pace-on yorker swinging into the middle stump. Hardik Pandya swings across the line, misses completely and the stumps are shattered!" },
      { run: 2, extras: 0, isWicket: false, ballDisplay: "2", commentary: "Controlled slice into the vacant deep-cover region. They sprint back hard for the second run, direct hit missed!" },
      { run: 0, extras: 1, isWicket: false, ballDisplay: "wd", commentary: "WIDE BALL! Sprayed wide of the tramline outside off. Extras added to the scorecard, but Cummins must bowl this delivery again." },
      { run: 0, extras: 0, isWicket: false, ballDisplay: "0", commentary: "Superb slower ball bouncer! Striker is fooled by the dip and swings early. No run." },
    ];

    // Select outcome weighted slightly differently based on ball sequence
    let outcomeIndex = Math.floor(Math.random() * outcomesPool.length);
    // Custom drama: last ball odds are high risk boundary/wicket
    if (ballIndex === 6) {
      const tightRunsNeeded = currentMatch.target - currentMatch.teamB.runs;
      if (tightRunsNeeded > 4) {
        outcomeIndex = 0; // six chance if needed
      } else if (tightRunsNeeded === 4) {
        outcomeIndex = 1; // four chance
      }
    }

    const outcome = outcomesPool[outcomeIndex];
    let updatedMatch = { ...currentMatch };

    // 1. Update Extras & Runs
    const runsForThisBall = outcome.run + outcome.extras;
    const isWide = outcome.ballDisplay === "wd";

    updatedMatch.teamB.runs += runsForThisBall;
    
    // Update overs and balls calculations
    let nextBalls = updatedMatch.teamB.balls;
    let nextOvers = updatedMatch.teamB.overs;

    if (!isWide) {
      nextBalls += 1;
      if (nextBalls >= 6) {
        nextOvers += 1;
        nextBalls = 0;
      }
      setBallsSimulated((prev) => prev + 1);
    } // Wide balls do not count as balls bowled in the over

    updatedMatch.teamB.balls = nextBalls;
    updatedMatch.teamB.overs = nextOvers;

    // 1.5 Update Score display
    if (outcome.isWicket) {
      updatedMatch.teamB.wickets += 1;
    }
    updatedMatch.teamB.score = `${updatedMatch.teamB.runs}/${updatedMatch.teamB.wickets}`;

    // 2. Manage Delivery Chain
    updatedMatch.recentDeliveries = [...updatedMatch.recentDeliveries, outcome.ballDisplay];

    // 3. Batters crease adjustments & stats update
    // Striker (batsman[4]) / Non-striker (batsman[5])
    let striker = updatedMatch.teamB.batsmen[4];
    let nonStriker = updatedMatch.teamB.batsmen[5];

    if (!isWide) {
      striker.balls += 1;
    }

    if (outcome.isWicket) {
      // Striker is retired/out
      striker.name = `OUT (${striker.name})`;
      striker.strikeRate = Math.round((striker.runs / striker.balls) * 100) || 0;
      // Bring in a tail-ender
      const tailenders = ["Jasprit Bumrah", "Arshdeep Singh", "Mohammed Siraj"];
      const newBatter: BatterInnings = {
        name: tailenders[Math.floor(Math.random() * tailenders.length)],
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0
      };
      // Replace striker
      updatedMatch.teamB.batsmen[4] = newBatter;
    } else {
      striker.runs += outcome.run;
      if (outcome.run === 4) striker.fours += 1;
      if (outcome.run === 6) striker.sixes += 1;
      striker.strikeRate = Math.round((striker.runs / striker.balls) * 100) || 0;

      // Rotate strike on odd runs
      if (outcome.run === 1 || outcome.run === 3) {
        updatedMatch.teamB.batsmen[4] = nonStriker;
        updatedMatch.teamB.batsmen[5] = striker;
      }
    }

    // 4. Bowler update (Pat Cummins is our 20th over choice, let's update first bowler in team B's scorecard or a specific one)
    // Actually, Pat Cummins is on team A bowlers scorecard (index 2 as bowler for team A)
    let bowler = updatedMatch.teamA.bowlers[2];
    if (!isWide) {
      bowler.runs += outcome.run;
      if (outcome.isWicket) {
        bowler.wickets += 1;
      }
      const totalBowledBalls = Math.round(bowler.overs * 6) + 1;
      const calculatedOvers = parseFloat((Math.floor(totalBowledBalls / 6) + (totalBowledBalls % 6) / 10).toFixed(1));
      bowler.overs = calculatedOvers;
      bowler.economy = parseFloat(((bowler.runs / totalBowledBalls) * 6).toFixed(2));
    } else {
      bowler.runs += outcome.extras;
    }

    // 5. Add custom Commentary record
    const preciseOverNum = `19.${isWide ? ballsSimulated : ballIndex}`;
    const newComment: CommentaryItem = {
      id: `sim-c-${Date.now()}`,
      over: preciseOverNum,
      event: outcome.isWicket ? "WICKET" : outcome.run === 6 ? "SIX" : outcome.run === 4 ? "FOUR" : outcome.run === 0 ? "DOT" : "RUN",
      scoreText: updatedMatch.teamB.score,
      text: `Pat Cummins to ${updatedMatch.teamB.batsmen[4].name}, ${outcome.ballDisplay === "wd" ? "WIDE" : runsForThisBall + " Run(s)"}. ${outcome.commentary}`
    };
    updatedMatch.commentary = [newComment, ...updatedMatch.commentary];

    // 6. Check Game Over conditions
    const currentScore = updatedMatch.teamB.runs;
    const requiredScore = updatedMatch.target;
    const currentWickets = updatedMatch.teamB.wickets;

    let localIsGameOver = false;
    let localResult = "";

    if (currentScore >= requiredScore) {
      localIsGameOver = true;
      localResult = `🎉 INDIA WINS IN THE CRUNCH! Defeated Australia by ${10 - currentWickets} wickets in a sensational final over thriller!`;
      updatedMatch.summaryText = "India won by 5 wickets";
      updatedMatch.status = "COMPLETED";
    } else if (currentWickets >= 10) {
      localIsGameOver = true;
      localResult = "❌ ALL OUT! Australia bowl out the chasing batsmen and win by 13 runs!";
      updatedMatch.summaryText = "Australia won by 13 runs";
      updatedMatch.status = "COMPLETED";
    } else if ((ballIndex >= 6 && !isWide) || updatedMatch.teamB.overs >= 20) {
      localIsGameOver = true;
      const defecit = requiredScore - currentScore - 1;
      localResult = `😔 OVER COMPLETED! Australia defends their score! India fell short by ${defecit} run(s).`;
      updatedMatch.summaryText = `Australia won by ${defecit} run(s)`;
      updatedMatch.status = "COMPLETED";
    }

    if (localIsGameOver) {
      setIsGameOver(true);
      setGameResult(localResult);
      setIsSimulatingAuto(false);
      updatedMatch.summaryText = localResult;

      // Push final announcement to Chat Analyst
      setChatLog(prev => [
        ...prev,
        {
          sender: "ai",
          text: `🚨 MATCH FINISHED! ${localResult}. Write to me for a post-match breakdown!`,
          time: "20.0"
        }
      ]);
    } else {
      updatedMatch.summaryText = `India needs ${requiredScore - currentScore} runs from ${6 - ballIndex} balls!`;
    }

    setCurrentMatch(updatedMatch);
  };

  // Auto-Simulate Over
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulatingAuto && !isGameOver) {
      timer = setTimeout(() => {
        simulateNextBall();
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [isSimulatingAuto, ballsSimulated, isGameOver]);

  // Handle message send to analyst AI
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput("");
    setChatLog((prev) => [...prev, { sender: "user", text: userMsg, time: `19.${ballsSimulated}` }]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat-analyst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMsg,
          matchState: currentMatch
        }),
      });

      if (!response.ok) {
        throw new Error("Booths server disconnect");
      }

      const data = await response.json();
      setChatLog((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.text,
          time: `19.${ballsSimulated}`
        }
      ]);
    } catch (err) {
      setChatLog((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "My apologies! I temporarily lost the microphone connection to the broadcast booth. But tactically, watch the batsman's foot placement on Cummins' full yorker length!",
          time: `19.${ballsSimulated}`
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Selectors - Match index */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3" id="match-center-index">
        <button
          onClick={() => handleMatchChange("m-1")}
          className={`px-4 py-2 text-xs font-sans font-semibold rounded-lg border transition-all flex items-center gap-2 ${
            selectedMatchId === "m-1"
              ? "bg-[#161B22] text-white border-slate-700 shadow"
              : "bg-[#0B0E14] text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
          IND vs AUS (T20I)
        </button>
        <button
          onClick={() => handleMatchChange("m-2")}
          className={`px-4 py-2 text-xs font-sans font-semibold rounded-lg border transition-all flex items-center gap-2 ${
            selectedMatchId === "m-2"
              ? "bg-[#161B22] text-white border-slate-700 shadow"
              : "bg-[#0B0E14] text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <span className="flex h-2 w-2 rounded-full bg-slate-500" />
          ENG vs PAK (ODI) - Upcoming
        </button>
        <button
          onClick={() => handleMatchChange("m-3")}
          className={`px-4 py-2 text-xs font-sans font-semibold rounded-lg border transition-all flex items-center gap-2 ${
            selectedMatchId === "m-3"
              ? "bg-[#161B22] text-white border-slate-700 shadow"
              : "bg-[#0B0E14] text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-505" />
          RSA vs NZ (Test) - Completed
        </button>
      </div>

      {/* Main Grid: Match Details (Left) + AI Booth Chat (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Match Scoreboard Header Card */}
          <div className="bg-[#161B22] border border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="scoreboard-main-card">
            {/* Top Deck: Venue info & Format Match Status Badge */}
            <div className="bg-[#0F131A] p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">{currentMatch.venue}</p>
                <h3 className="text-white font-display text-sm font-bold tracking-tight">{currentMatch.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-[#0B0E14] text-slate-300 px-2 py-0.5 rounded border border-slate-800 uppercase font-semibold">
                  {currentMatch.format}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                    currentMatch.status === "LIVE"
                      ? "bg-red-950/40 text-red-400 border-red-900/50"
                      : currentMatch.status === "UPCOMING"
                      ? "bg-blue-950/40 text-blue-405 border-blue-900/50"
                      : "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                  }`}
                >
                  {currentMatch.status}
                </span>
              </div>
            </div>

            {/* Middle Deck: Versus Team Scores */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-around gap-6 bg-gradient-to-b from-[#161B22] to-[#0B0E14]">
              {/* Team A */}
              <div className="flex flex-col items-center text-center gap-2.5">
                <span className="text-4xl">{currentMatch.teamA.logo}</span>
                <span className="text-lg font-display font-medium text-slate-200">{currentMatch.teamA.name}</span>
                <span className="text-2xl font-mono text-white font-bold">{currentMatch.teamA.score}</span>
                {currentMatch.status !== "UPCOMING" && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({currentMatch.teamA.overs} overs)
                  </span>
                )}
              </div>

              {/* VS Decator */}
              <div className="flex flex-col items-center">
                <div className="text-xs text-slate-400 font-mono font-bold border border-slate-850 bg-[#161B22] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  vs
                </div>
                <div className="h-10 w-[1px] bg-slate-800 mt-2 hidden md:block" />
              </div>

              {/* Team B */}
              <div className="flex flex-col items-center text-center gap-2.5">
                <span className="text-4xl">{currentMatch.teamB.logo}</span>
                <span className="text-lg font-display font-medium text-slate-200">{currentMatch.teamB.name}</span>
                <span className="text-3 shadow-inner rounded-xl text-3xl font-mono text-emerald-400 font-bold px-3 py-0.5 bg-[#0B0E14] border border-slate-800/80">
                  {currentMatch.teamB.score}
                </span>
                {currentMatch.status !== "UPCOMING" && (
                  <span className="text-[10px] text-emerald-300 font-mono">
                    ({currentMatch.teamB.overs}.{currentMatch.teamB.balls} overs)
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Deck: Summary banner */}
            <div className="bg-emerald-950/10 px-6 py-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Trophy className="text-emerald-400 h-5 w-5 shrink-0" />
                <span className="text-emerald-300 font-display text-xs font-semibold leading-normal">
                  {currentMatch.summaryText}
                </span>
              </div>
              {selectedMatchId === "m-1" && !isGameOver && (
                <div className="font-mono text-xs text-emerald-400 bg-[#0B0E14] border border-slate-800 px-2.5 py-1 rounded">
                  REQ RATE: <span className="font-bold">14.0 RPO</span>
                </div>
              )}
            </div>
          </div>
                 {/* Interactive Live Over Simulator control panel */}
          {selectedMatchId === "m-1" && (
            <div className="bg-[#161B22] border border-slate-805/80 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-slate-100 font-display font-bold text-sm flex items-center gap-1.5">
                    <Zap className="text-emerald-400 h-4.5 w-4.5 animate-pulse" />
                    Interactive Ball-by-Ball Simulator
                  </h4>
                  <p className="text-xs text-slate-400">Play the high-tension final over delivered by Cummins!</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-500">Balls:</span>
                  <span className="bg-[#0B0E14] text-slate-350 border border-slate-800 px-2 py-0.5 rounded font-bold">
                    {ballsSimulated}/6
                  </span>
                </div>
              </div>

              {/* Delivery Sequence Tracker */}
              <div className="bg-[#0B0E14] p-4 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wider">THIS OVER PROGRESS:</span>
                <div className="flex items-center gap-2.5">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const b = currentMatch.recentDeliveries[i];
                    return (
                      <div
                        key={i}
                        className={`h-9 w-9 rounded-full flex items-center justify-center font-mono text-xs font-bold border transition-all ${
                          b === "6"
                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-600 font-black scale-105"
                            : b === "4"
                            ? "bg-teal-950/80 text-teal-400 border-teal-600 font-bold"
                            : b === "W"
                            ? "bg-red-950/80 text-red-500 border-red-600 font-black scale-105"
                            : b === "wd"
                            ? "bg-yellow-950/80 text-yellow-500 border-yellow-700 text-[10px]"
                            : b
                            ? "bg-[#161B22] text-slate-300 border-slate-700"
                            : "bg-[#0B0E14] text-slate-750 border-slate-800 border-dashed border-2 cursor-not-allowed"
                        }`}
                      >
                        {b || i + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={simulateNextBall}
                  disabled={isGameOver}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                    isGameOver
                      ? "bg-[#0B0E14] text-slate-600 border border-slate-800 cursor-not-allowed"
                      : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-black glow-btn-pulse cursor-pointer"
                  }`}
                  id="simulate-next-ball-btn"
                >
                  <Play className="h-4 w-4 fill-slate-950" />
                  SIMULATE NEXT BALL
                </button>

                <button
                  onClick={() => setIsSimulatingAuto((prev) => !prev)}
                  disabled={isGameOver}
                  className={`px-4 py-3 rounded-xl text-xs font-sans font-medium border transition-all flex items-center justify-center gap-1.5 ${
                    isSimulatingAuto
                      ? "bg-slate-900 text-yellow-405 border-yellow-700"
                      : "bg-[#0B0E14] text-slate-305 border border-slate-800 hover:text-white"
                  }`}
                >
                  <Trophy className="h-4 w-4" />
                  {isSimulatingAuto ? "PAUSE RUN" : "AUTO-PLAY OVER"}
                </button>

                <button
                  onClick={resetSimulation}
                  className="px-4 py-3 rounded-xl text-xs font-sans font-medium text-slate-400 bg-[#0B0E14] border border-slate-800 hover:text-white hover:bg-slate-905 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  RESET OVER
                </button>
              </div>

              {/* Game finish state notification */}
              {isGameOver && (
                <div className="bg-[#0B0E14]/80 border border-slate-850 p-4 rounded-xl text-center space-y-2 animate-fadeIn">
                  <p className="text-white font-display text-sm font-bold">{gameResult}</p>
                  <p className="text-xs text-slate-400">Click Reset to play the legendary final-over sequence again!</p>
                </div>
              )}
            </div>
          )}

          {/* Batting & Bowling Scorecard Sheets */}
          {currentMatch.status !== "UPCOMING" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Batting Team Stats */}
              <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
                <h4 className="text-white font-display font-medium text-sm border-b border-slate-800/80 pb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-400" />
                  Batting Scorecard ({currentMatch.currentInnings === "B" ? currentMatch.teamB.name : currentMatch.teamA.name})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-850 pb-2">
                        <th className="py-2">Batter</th>
                        <th className="text-right py-2">R</th>
                        <th className="text-right py-2">B</th>
                        <th className="text-right py-2">4s</th>
                        <th className="text-right py-2">6s</th>
                        <th className="text-right py-2">SR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/40">
                      {(currentMatch.currentInnings === "B" ? currentMatch.teamB.batsmen : currentMatch.teamA.batsmen).map((b, idx) => (
                        <tr key={idx} className="hover:bg-[#0B0E14]/30 font-sans">
                           <td className="py-2.5 font-medium text-slate-200 flex items-center gap-1.5">
                            {b.name}
                            {!b.name.includes("OUT") && idx === 4 && selectedMatchId === "m-1" && (
                              <span className="bg-emerald-950 text-emerald-450 text-[9px] px-1 rounded-sm border border-emerald-800/50 font-bold uppercase">*</span>
                            )}
                          </td>
                          <td className="text-right text-white font-mono">{b.runs}</td>
                          <td className="text-right text-slate-400 font-mono">{b.balls}</td>
                          <td className="text-right text-slate-400 font-mono">{b.fours}</td>
                          <td className="text-right text-slate-400 font-mono">{b.sixes}</td>
                          <td className="text-right text-emerald-400 font-mono">{b.strikeRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bowling Team Stats */}
              <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
                <h4 className="text-white font-display font-medium text-sm border-b border-slate-800/80 pb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-400" />
                  Bowling Card ({currentMatch.currentInnings === "B" ? currentMatch.teamA.name : currentMatch.teamB.name})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-850 pb-2">
                        <th className="py-2">Bowler</th>
                        <th className="text-right py-2">O</th>
                        <th className="text-right py-2">M</th>
                        <th className="text-right py-2">R</th>
                        <th className="text-right py-2">W</th>
                        <th className="text-right py-2">Hcon</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/40 font-sans">
                      {(currentMatch.currentInnings === "B" ? currentMatch.teamA.bowlers : currentMatch.teamB.bowlers).map((bw, idx) => (
                        <tr key={idx} className="hover:bg-[#0B0E14]/30">
                          <td className="py-2.5 font-medium text-slate-200 flex items-center gap-1.5">
                            {bw.name}
                            {bw.name === "Pat Cummins" && selectedMatchId === "m-1" && (
                              <span className="bg-lime-950/80 text-lime-450 text-[9px] px-1 rounded border border-lime-800/50 font-bold uppercase">DEF</span>
                            )}
                          </td>
                          <td className="text-right text-slate-400 font-mono">{bw.overs}</td>
                          <td className="text-right text-slate-400 font-mono">{bw.maidens}</td>
                          <td className="text-right text-white font-mono">{bw.runs}</td>
                          <td className="text-right text-emerald-400 font-mono">{bw.wickets}</td>
                          <td className="text-right text-emerald-400 font-mono">{bw.economy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Historical Commentary Feed */}
          <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
            <h4 className="text-slate-100 font-display font-medium text-sm border-b border-slate-805/80 pb-2">
              Commentary Transcript
            </h4>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 sm:scrollbar">
              {currentMatch.commentary.map((c, idx) => (
                <div key={idx} className="flex gap-4 border-l-2 border-slate-800 pl-4 py-1.5 hover:bg-[#0B0E14]/10 transition-all">
                  <div className="shrink-0 font-mono text-xs font-bold text-slate-400 bg-[#0B0E14] px-2 py-0.5 rounded border border-slate-800 self-start">
                    {c.over}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-[#0B0E14] text-slate-350 px-1.5 py-0.2 border border-slate-800 rounded">
                        {c.scoreText}
                      </span>
                      {c.event === "WICKET" && (
                        <span className="bg-red-950/50 text-red-400 border border-red-800/40 text-[10px] px-1 rounded font-bold uppercase tracking-wider">
                          Wicket
                        </span>
                      )}
                      {(c.event === "SIX" || c.event === "FOUR") && (
                        <span className="bg-emerald-950/50 text-emerald-450 border border-emerald-800/40 text-[10px] px-1 rounded font-bold uppercase tracking-wider">
                          Boundary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Commentary Chatbot Booth Column */}
        <div className="bg-[#161B22] border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[650px] lg:h-auto overflow-hidden">
          {/* Header */}
          <div className="bg-[#0F131A] p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-display text-xs font-bold tracking-tight">AI Commentary Booth</h4>
                <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Tied to active over simulation</p>
              </div>
            </div>
            <span className="bg-emerald-950/40 text-emerald-455 border border-emerald-900/40 text-[9px] px-1.5 rounded font-bold tracking-widest font-mono">
              ACTIVE
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatLog.map((log, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] ${
                  log.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed font-sans ${
                    log.sender === "user"
                      ? "bg-[#0B0E14] border border-slate-80d text-slate-200 rounded-tr-none"
                      : "bg-[#0F131A] border border-slate-800/60 text-slate-300 rounded-tl-none"
                  }`}
                >
                  <p>{log.text}</p>
                </div>
                <span className="text-[9px] text-slate-500 font-mono mt-1">
                  Over: {log.time}
                </span>
              </div>
            ))}
            {isChatLoading && (
              <div className="mr-auto items-start max-w-[85%] flex flex-col">
                <div className="p-3 bg-[#0B0E14] border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="font-mono text-[10px]">Consulting stats analyst...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Sheet */}
          <form onSubmit={handleChatSubmit} className="p-3 border-t border-slate-800 bg-[#0F131A] flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask: 'Who will win?' or 'Pitch guide'..."
              className="flex-1 bg-[#0B0E14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-sans"
              id="chat-booth-input-field"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                (!chatInput.trim() || isChatLoading)
                  ? "bg-[#0B0E14] text-slate-600 border border-slate-800 cursor-not-allowed"
                  : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
