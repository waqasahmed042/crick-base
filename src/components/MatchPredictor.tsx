import React, { useState } from "react";
import { Sparkles, HelpCircle, Activity, Globe, Send, RefreshCw, BarChart2 } from "lucide-react";

export default function MatchPredictor() {
  const [runsNeeded, setRunsNeeded] = useState<number>(18);
  const [ballsRemaining, setBallsRemaining] = useState<number>(12);
  const [wicketsFallen, setWicketsFallen] = useState<number>(5);
  const [bowlerType, setBowlerType] = useState<string>("Fast-Medium Cutter");
  const [batStyle, setBatStyle] = useState<string>("Right-Handed Power-Hitter");
  const [pitchCondition, setPitchCondition] = useState<string>("Cracked and Variable Bounce");

  const [predictionResult, setPredictionResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  // Trigger analysis call to Express API
  const handleGeneratePrediction = async () => {
    setIsLoading(true);
    setPredictionResult("");
    try {
      const response = await fetch("/api/predict-situation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runsNeeded,
          ballsRemaining,
          wicketsFallen,
          bowlerType,
          batStyle,
          pitchCondition,
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction API offline");
      }

      const data = await response.json();
      setPredictionResult(data.text);
      setIsSimulated(data.isSimulated || false);
    } catch (err) {
      // Offline fallback state directly inside UI
      setPredictionResult(
        `### 🏏 PRO MATCH REPORT (OFFLINE RECOVERY)\n\n#### 📊 Calculated Probability\n- **Chasing Team Win Probability**: **35%** (Required Run Rate is **${((runsNeeded / ballsRemaining) * 6).toFixed(2)} RPO**)\n- **Defending Team Win Probability**: **65%**\n\n#### 🧠 Bowler & Batsman Battle tactics\n- **Bowler Strategy (${bowlerType})**: Bowl full outside-off yorker tramlines. With variable bounce on the **${pitchCondition}** surface, cross-seam deliveries will be highly potent.\n- **Batter Strategy (${batStyle})**: Stand deep, clear the front leg to lift over covers. Focus on converting length slots into overhead trajectories.\n\n#### ⚡ Simulated ball by ball finishes\n- **1st Delivery**: Cummins bowls a slower cutter, swing and a miss.\n- **2nd Delivery**: In slot, smacked over long-on for SIX runs!\n- **3rd Delivery**: Fast Yorker, inside edge for single.`
      );
      setIsSimulated(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
          <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/35">
            <Sparkles className="text-emerald-400 h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-white font-display text-base font-bold tracking-tight">AI Situation Analyst & Predictor</h3>
            <p className="text-xs text-slate-400">Design any custom game scenario; let Gemini write a professional coach's breakdown.</p>
          </div>
        </div>

        {/* Configuration sliders/selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 bg-radial from-[#0B0E14]/10 to-[#161B22]">
          <div className="space-y-5 font-mono text-xs">
            {/* Slider 1: Runs needed */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Runs Needed Chasing:</span>
                <span className="text-emerald-400 font-bold">{runsNeeded} runs</span>
              </div>
              <input
                type="range"
                min="3"
                max="80"
                value={runsNeeded}
                onChange={(e) => setRunsNeeded(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#0B0E14] border border-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[9px] text-slate-600">
                <span>3 runs</span>
                <span>80 runs</span>
              </div>
            </div>

            {/* Slider 2: Balls Left */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Balls Remaining:</span>
                <span className="text-emerald-400 font-bold">{ballsRemaining} balls</span>
              </div>
              <input
                type="range"
                min="4"
                max="48"
                value={ballsRemaining}
                onChange={(e) => setBallsRemaining(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#0B0E14] border border-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[9px] text-slate-600">
                <span>4 balls (0.4 overs)</span>
                <span>48 balls (8.0 overs)</span>
              </div>
            </div>

            {/* Slider 3: Wickets down */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Wickets Fallen:</span>
                <span className="text-red-400 font-bold">{wicketsFallen} wkts down</span>
              </div>
              <input
                type="range"
                min="0"
                max="9"
                value={wicketsFallen}
                onChange={(e) => setWicketsFallen(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#0B0E14] border border-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[9px] text-slate-600">
                <span>0 (Top order intact)</span>
                <span>9 (Last-wicket pairing)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Bowler type dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono block uppercase">Bowler Style Profile:</label>
              <select
                value={bowlerType}
                onChange={(e) => setBowlerType(e.target.value)}
                className="w-full bg-[#0B0E14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                id="bowler-type-select"
              >
                <option value="Express Fast Yorker-Specialist">Express Fast (145+ kph Yorker-Specialist)</option>
                <option value="Fast-Medium Cutter Bowler">Fast-Medium (Cutters & Slower Dippers)</option>
                <option value="Right-Arm Leg-Spinner (Googly variations)">Right-Arm Leg-Spinner (Googly variations)</option>
                <option value="Off-Spinner (Defensive drift line)">Off-Spinner (Defensive drift line)</option>
                <option value="Left-Arm Slow orthodox Spin">Left-Arm Orthodox Spin</option>
              </select>
            </div>

            {/* Striker batsman type dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono block uppercase">Active Batter Profile:</label>
              <select
                value={batStyle}
                onChange={(e) => setBatStyle(e.target.value)}
                className="w-full bg-[#0B0E14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                id="bat-style-select"
              >
                <option value="Right-Handed Power-Hitter (Clears ropes cleanly)">Right-Handed Power-Hitter (Ropes specialist)</option>
                <option value="Left-Handed Anchoring batsman (Timed drives)">Left-Handed Anchor (Timer & gap-finder)</option>
                <option value="Wristy All-Rounder (360-degree sweeps)">Wristy All-Rounder (360-degree sweeps)</option>
                <option value="Defensive Tail-ender (Struggles with spin)">Defensive Tail-ender (Struggles with length)</option>
              </select>
            </div>

            {/* Pitch condition state dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono block uppercase">Pitch surface state:</label>
              <select
                value={pitchCondition}
                onChange={(e) => setPitchCondition(e.target.value)}
                className="w-full bg-[#0B0E14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                id="pitch-condition-select"
              >
                <option value="Cracked surface with high variable bounce">Cracked & Dry (Variable Bounce, dangerous)</option>
                <option value="Green grassy deck with strong seam swing">Green Top (Highly conducive to Swing & Seam)</option>
                <option value="Flat batting road with absolute zero help">Flat Highway (Paradise for batsmen)</option>
                <option value="Dusty spinner strip with massive lateral turn">Dusty Bowl (Heavy turn, low bounce)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tactical Required Run Rate Ticker */}
        <div className="mt-6 p-4 bg-[#0B0E14] border border-slate-800 rounded-xl flex items-center justify-between font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Activity className="text-emerald-400 h-4.5 w-4.5" />
            <span>Target Equation RPO Requirement:</span>
          </div>
          <span className="font-bold text-white bg-[#161B22] px-3 py-1 border border-slate-800 rounded">
            {((runsNeeded / ballsRemaining) * 6).toFixed(2)} runs per over
          </span>
        </div>

        {/* Generate predict triggers */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleGeneratePrediction}
            disabled={isLoading}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-tr from-emerald-500 to-lime-400 text-slate-950 font-sans font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
            id="run-predictor-assessment-btn"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                DRAFTING EXPERT PROGNOSIS...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 fill-slate-950" />
                EXECUTE SPORT REPORT PROGNOSIS
              </>
            )}
          </button>
        </div>
      </div>

      {/* Outcome analysis article section */}
      {(predictionResult || isLoading) && (
        <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="text-emerald-400 h-5 w-5" />
              <h4 className="text-white font-display font-bold text-sm">
                Live Analyst Tactical Intelligence Brief
              </h4>
            </div>
            {isSimulated && (
              <span className="text-[10px] font-mono text-slate-500 bg-[#0B0E14] px-2 py-0.5 border border-slate-800 rounded">
                SIMULATED PREVIEW
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="py-12 space-y-4 text-center">
              <div className="inline-flex h-8 w-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
              <p className="text-xs text-slate-400 font-mono">
                Calculating win matrices and fetching tactical logs from model...
              </p>
            </div>
          ) : (
            <div className="text-slate-200 text-xs font-sans whitespace-pre-wrap leading-relaxed space-y-4">
              {/* Parse headers into bold segments for amazing look */}
              {predictionResult.split("\n").map((line, idx) => {
                if (line.startsWith("###")) {
                  return (
                    <h5 key={idx} className="text-white font-display font-extrabold text-sm border-b border-slate-805/80 pb-1 mt-5 text-emerald-400 uppercase tracking-wide">
                      {line.replace("###", "").trim()}
                    </h5>
                  );
                } else if (line.startsWith("####")) {
                  return (
                    <h6 key={idx} className="text-slate-100 font-display font-bold text-xs mt-3">
                      {line.replace("####", "").trim()}
                    </h6>
                  );
                } else if (line.startsWith("- **")) {
                  // Render highlight stats bullet nicely
                  return (
                    <p key={idx} className="bg-[#0B0E14] p-2 border border-slate-800 rounded-lg pl-3 my-1 border-l-2 border-l-emerald-500 font-sans">
                      {line.replace("- ", "").trim()}
                    </p>
                  );
                } else {
                  return <p key={idx} className="text-slate-300 font-sans">{line}</p>;
                }
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
