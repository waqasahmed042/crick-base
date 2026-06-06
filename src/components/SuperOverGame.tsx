import React, { useState } from "react";
import { Play, RotateCcw, ShieldAlert, Sparkles, Trophy, User, Zap } from "lucide-react";

interface SuperOverGameProps {}

export default function SuperOverGame() {
  const teams = [
    { id: "IND", name: "India", logo: "🏏", primaryColor: "border-blue-500 text-blue-400" },
    { id: "AUS", name: "Australia", logo: "🦘", primaryColor: "border-yellow-500 text-yellow-400" },
    { id: "PAK", name: "Pakistan", logo: "🌙", primaryColor: "border-emerald-500 text-emerald-400" },
    { id: "ENG", name: "England", logo: "🦁", primaryColor: "border-red-500 text-red-400" },
    { id: "RSA", name: "South Africa", logo: "🇿🇦", primaryColor: "border-green-600 text-green-500" },
  ];

  const [gameState, setGameState] = useState<"SETUP" | "PLAY" | "END">("SETUP");
  const [userTeam, setUserTeam] = useState<string>("IND");
  const [oppTeam, setOppTeam] = useState<string>("AUS");

  const [target, setTarget] = useState<number>(15); // Randomly set between 12 and 22
  const [runsScored, setRunsScored] = useState<number>(0);
  const [wicketsLost, setWicketsLost] = useState<number>(0); // Max 2 wickets allowed in Super Over
  const [ballsBowled, setBallsBowled] = useState<number>(0);
  const [batterAtStriker, setBatterAtStriker] = useState<string>("Star Batsman");

  const [lastBallLog, setLastBallLog] = useState<string>("");
  const [gameResultTitle, setGameResultTitle] = useState<string>("");
  const [overCommentary, setOverCommentary] = useState<string[]>([]);

  // Start the super over
  const startSuperOver = () => {
    // Set computer target between 13 and 21
    const randomTarget = Math.floor(Math.random() * 9) + 13;
    setTarget(randomTarget);
    setRunsScored(0);
    setWicketsLost(0);
    setBallsBowled(0);
    setLastBallLog("Super Over started! You are batting first, chasing a daunting target under high intensity.");
    setOverCommentary([]);
    setGameState("PLAY");
  };

  // Play a delivery choosing shot type
  const playShot = (shotType: "SAFE" | "CONTROLLED" | "AGGRESSIVE" | "DANGEROUS") => {
    if (gameState !== "PLAY" || ballsBowled >= 6 || wicketsLost >= 2) return;

    const currentBallNum = ballsBowled + 1;

    // Delivery styles chosen randomly by bowler
    const deliveries = ["Fast Inswinging Yorker", "Slow Off-Cutter bouncer", "Full Wider Delivery", "Standard Back-of-Length Seamer"];
    const activeDelivery = deliveries[Math.floor(Math.random() * deliveries.length)];

    let runsThisBall = 0;
    let wicketThisBall = false;
    let comment = "";

    // Calculate outcomes based on risk
    const randomSeed = Math.random();

    if (shotType === "SAFE") {
      // Very safe single
      if (randomSeed < 0.05) {
        wicketThisBall = true;
        comment = "Unfortunate run-out! Batsman nudged to cover and ran blindly. Easy throw to striker ends catches him yard short!";
      } else if (randomSeed < 0.75) {
        runsThisBall = 1;
        comment = "Soft push into the gap at extra cover region for a comfortable rotational single.";
      } else {
        runsThisBall = 2;
        comment = "Controlled clip deep left of mid-on. They sprint back quickly for another double.";
      }
    } else if (shotType === "CONTROLLED") {
      // Balanced placement
      if (randomSeed < 0.12) {
        wicketThisBall = true;
        comment = "OUT CAUGHT! Attempted to loft over mid-off, got too much under the ball. Caught comfortably inside circle.";
      } else if (randomSeed < 0.4) {
        runsThisBall = 2;
        comment = "Brilliant wrist flick gets past short fine-leg. Deep fielder runs right but can't prevent the couple.";
      } else if (randomSeed < 0.75) {
        runsThisBall = 1;
        comment = "Pushed down to long-off. Good stride forward to neutralize swing.";
      } else if (randomSeed < 0.95) {
        runsThisBall = 4;
        comment = "CRACKING SHOT! Over-pitched wide delivery, batsman executes classic slice through cover for four!";
      } else {
        runsThisBall = 0;
        comment = "Excellent yorker block. Squeezed out, bowler pick up ball quickly.";
      }
    } else if (shotType === "AGGRESSIVE") {
      // High-risk boundary focus
      if (randomSeed < 0.28) {
        wicketThisBall = true;
        comment = "OUT! STUMPED! Left the crease early to smash over bowler head. Spinner extracts drift, beats the blade, keeper whips off bails nicely.";
      } else if (randomSeed < 0.6) {
        runsThisBall = 4;
        comment = "FOUR RUNS! Lofty pull over deep mid-wicket. One bounce over the ropes!";
      } else if (randomSeed < 0.8) {
        runsThisBall = 6;
        comment = "MAXIMUM! Massive lofted drive down the ground! Into the concrete stands of Bridgetown!";
      } else if (randomSeed < 0.95) {
        runsThisBall = 0;
        comment = "Slower ball completely cheats the batsman. Swing and a clean miss outside off.";
      } else {
        runsThisBall = 1;
        comment = "Thick outside edge flies wide of slip. Sneaks local single.";
      }
    } else {
      // Slog scoop / Extreme risk
      if (randomSeed < 0.42) {
        wicketThisBall = true;
        comment = "OUT BOWLED! Tried to execute fancy ramp scoop against 145kph straight delivery. Completely missed seam and stakes are uprooted!";
      } else if (randomSeed < 0.85) {
        runsThisBall = 6;
        comment = "OMG INDEED SIX! Batsman dropped on one knee and ramp-scooped over keeper's head! Pure theatrical boundary!";
      } else {
        runsThisBall = 0;
        comment = "Full toss misses swinging bats entirely. Close appeal for LBW but umpire denies.";
      }
    }

    // Apply outcome values
    const newRuns = runsScored + runsThisBall;
    const newWickets = wicketsLost + (wicketThisBall ? 1 : 0);

    setRunsScored(newRuns);
    setWicketsLost(newWickets);
    setBallsBowled(currentBallNum);

    const matchBallSummary = `Ball ${currentBallNum}: (${activeDelivery}) -> ${wicketThisBall ? "WICKET" : runsThisBall + " Run(s)"}. ${comment}`;
    setLastBallLog(matchBallSummary);
    setOverCommentary((prev) => [matchBallSummary, ...prev]);

    // Check game termination conditions
    if (newRuns >= target) {
      setGameResultTitle(`🏆 VICTORY FOR ${teams.find((t) => t.id === userTeam)?.name}!`);
      setGameState("END");
    } else if (newWickets >= 2) {
      setGameResultTitle(`😞 ALL OUT! ${teams.find((t) => t.id === oppTeam)?.name} wins by defending successfully!`);
      setGameState("END");
    } else if (currentBallNum >= 6) {
      const remainingDefecit = target - newRuns;
      setGameResultTitle(`😞 DEFEAT! Chasing side fell short by ${remainingDefecit} run(s). CPU defends team total.`);
      setGameState("END");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Play decor bg */}
        <div className="pointer-events-none absolute inset-0 bg-radial from-emerald-950/5 to-[#161B22]" />

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 relative z-10">
          <div className="bg-emerald-500/25 p-2 rounded-xl border border-emerald-500/35">
            <Zap className="text-emerald-400 h-5 w-5 glow-btn-pulse" />
          </div>
          <div>
            <h3 className="text-white font-display text-base font-bold tracking-tight">6-Ball Super Over Simulator</h3>
            <p className="text-xs text-slate-400">Can you chase down the target in the ultimate nail-biter finish?</p>
          </div>
        </div>

        {/* SETUP PHASE */}
        {gameState === "SETUP" && (
          <div className="space-y-6 pt-6 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              {/* Select batting team */}
              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] text-slate-500 font-mono block uppercase">Your National Side:</label>
                <div className="grid grid-cols-1 gap-1">
                  {teams.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setUserTeam(t.id)}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                        userTeam === t.id
                          ? "bg-[#161B22] text-white border-slate-700 shadow-md"
                          : "bg-[#0B0E14] text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      <span>{t.logo} {t.name}</span>
                      {userTeam === t.id && <span className="text-[10px] text-emerald-400 font-mono">BAT</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select bowling team */}
              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] text-slate-500 font-mono block uppercase">Opponent Bowling CPU:</label>
                <div className="grid grid-cols-1 gap-1">
                  {teams.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setOppTeam(t.id)}
                      disabled={userTeam === t.id} // cannot play against self
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                        oppTeam === t.id
                          ? "bg-[#161B22] text-white border-slate-700 shadow-md"
                          : "bg-[#0B0E14] text-slate-400 border-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                      }`}
                    >
                      <span>{t.logo} {t.name}</span>
                      {oppTeam === t.id && <span className="text-[10px] text-red-400 font-mono font-bold">BOWL</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={startSuperOver}
              className="w-full py-3 bg-gradient-to-tr from-emerald-500 to-lime-400 text-slate-950 font-sans font-black text-xs rounded-xl shadow-lg hover:opacity-95 flex items-center justify-center gap-1.5 uppercase letter-tag tracking-wider"
              id="start-superover-setup-btn"
            >
              <Play className="h-4 w-4 fill-slate-950" />
              Enter Stadium (Bat First)
            </button>
          </div>
        )}

        {/* ACTIVE PLAY PHASE */}
        {gameState === "PLAY" && (
          <div className="space-y-6 pt-5 relative z-10 font-sans">
            {/* Visual scoreboard */}
            <div className="bg-[#0B0E14] p-5 rounded-2xl border border-slate-800 text-center space-y-4">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-b border-slate-800 pb-2">
                <span>SUPER OVER TARGET CHASE</span>
                <span className="bg-[#161B22] px-2 py-0.5 rounded border border-slate-800">
                  {userTeam} vs {oppTeam}
                </span>
              </div>

              <div className="flex justify-around items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block">RUNS SCORED</span>
                  <span className="text-4xl font-mono text-emerald-400 font-bold">{runsScored}</span>
                </div>
                {/* VS DECOR */}
                <div className="text-xl font-mono text-slate-505 font-bold px-3 py-1 border border-slate-800 rounded">
                  / {wicketsLost}
                  <p className="text-[9px] text-slate-500 mt-1 uppercase font-semibold">Wickets</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-505 font-mono block">BALLS BENT</span>
                  <span className="text-4xl font-mono text-white font-bold">{ballsBowled}/6</span>
                </div>
              </div>

              {/* Target Statement */}
              <div className="bg-[#161B22] p-3 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">Target to win:</span>
                <span className="text-yellow-400 font-bold">{target} runs</span>
              </div>

              <div className="text-xs text-lime-300 font-display font-semibold">
                Need {target - runsScored} runs from {6 - ballsBowled} balls remaining!
              </div>
            </div>

            {/* Micro shot options as buttons */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-slate-500 font-mono block uppercase">SELECT BATTING DELIVERY ACTION:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => playShot("SAFE")}
                  className="p-3 bg-[#0B0E14] hover:bg-slate-800 border border-slate-800 rounded-xl text-left hover:border-slate-700 transition-all font-sans cursor-pointer"
                  id="shot-safe"
                >
                  <h5 className="text-slate-200 text-xs font-semibold flex items-center gap-1">
                    🟢 Safe single / block
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">Risk: 5% OUT | Yield: 1-2 Runs</p>
                </button>

                <button
                  onClick={() => playShot("CONTROLLED")}
                  className="p-3 bg-[#0B0E14] hover:bg-slate-800 border border-slate-800 rounded-xl text-left hover:border-slate-700 transition-all font-sans cursor-pointer"
                  id="shot-controlled"
                >
                  <h5 className="text-slate-200 text-xs font-semibold flex items-center gap-1">
                    🟡 Controlled placement
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">Risk: 12% OUT | Yield: 1-4 Runs</p>
                </button>

                <button
                  onClick={() => playShot("AGGRESSIVE")}
                  className="p-3 bg-[#0B0E14] hover:bg-slate-800 border border-slate-805 rounded-xl text-left hover:border-slate-700 transition-all font-sans cursor-pointer"
                  id="shot-aggressive"
                >
                  <h5 className="text-slate-200 text-xs font-semibold flex items-center gap-1">
                    🟠 Aggressive loft over ropes
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">Risk: 28% OUT | Yield: 4-6 Runs</p>
                </button>

                <button
                  onClick={() => playShot("DANGEROUS")}
                  className="p-3 bg-[#0B0E14] hover:bg-slate-800 border border-slate-800 rounded-xl text-left hover:border-slate-705 transition-all font-sans cursor-pointer"
                  id="shot-dangerous"
                >
                  <h5 className="text-slate-200 text-xs font-semibold flex items-center gap-1">
                    🔴 Experimental Slog scoop
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">Risk: 42% OUT | Yield: 0 or 6 Runs</p>
                </button>
              </div>
            </div>

            {/* Last Ball live feedback */}
            {lastBallLog && (
              <div className="bg-emerald-955/15 p-3.5 border border-emerald-900/35 rounded-xl">
                <p className="text-[9px] text-emerald-400 font-mono block uppercase">Live Feed Event ticker:</p>
                <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">{lastBallLog}</p>
              </div>
            )}
          </div>
        )}          {/* COMPLETED / END PHASE */}
        {gameState === "END" && (
          <div className="space-y-6 pt-5 relative z-10 text-center py-6">
            <div className="inline-flex h-14 w-14 rounded-full bg-[#0B0E14] items-center justify-center border-2 border-yellow-405 font-bold text-yellow-300 text-2xl animate-bounce">
              🏆
            </div>
            <div className="space-y-1">
              <h3 className="text-white font-display font-black text-lg">{gameResultTitle}</h3>
              <p className="text-xs text-slate-400">Match score sheet finalized below.</p>
            </div>

            {/* Final scorecard breakdown */}
            <div className="bg-[#0B0E14] p-4 rounded-xl border border-slate-800 max-w-sm mx-auto font-mono text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span>Runs scored:</span>
                <span className="font-bold text-white">{runsScored}</span>
              </div>
              <div className="flex justify-between">
                <span>Overs/Deliveries:</span>
                <span className="font-bold text-white">{ballsBowled}/6 completed</span>
              </div>
              <div className="flex justify-between">
                <span>Wickets lost:</span>
                <span className="font-bold text-white">{wicketsLost}/2</span>
              </div>
              <div className="flex justify-between text-yellow-500 border-t border-slate-800 pt-2 font-bold">
                <span>Target was:</span>
                <span>{target} runs</span>
              </div>
            </div>

            <button
              onClick={startSuperOver}
              className="px-6 py-3 bg-gradient-to-tr from-emerald-500 to-lime-400 text-slate-950 font-sans font-black text-xs rounded-xl shadow-lg hover:opacity-95 items-center gap-1 border-none cursor-pointer"
              id="replay-superover-btn"
            >
              Play Match Again
            </button>
          </div>
        )}

        {/* Historical match tracker scroll */}
        {overCommentary.length > 0 && (
          <div className="pt-4 border-t border-slate-800 mt-5 space-y-2 max-h-[160px] overflow-y-auto pr-1">
            <span className="text-[10px] text-slate-500 font-mono block uppercase">TRANSCRIPT OVER FEED HISTORY:</span>
            {overCommentary.map((log, i) => (
              <p key={i} className="text-[10px] text-slate-400 font-mono leading-tight hover:text-slate-300">
                • {log}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
