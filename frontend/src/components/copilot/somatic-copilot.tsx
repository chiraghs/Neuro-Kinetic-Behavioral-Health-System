"use client";

import { useTelemetry } from "@/store/telemetry-store";
import { Sparkles, Activity, ShieldCheck, HeartPulse, UserCheck, ArrowRight } from "lucide-react";

export function SomaticCopilotDrawer() {
  const telemetry = useTelemetry();

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Adaptive Somatic Copilot</h3>
            <p className="text-[11px] text-slate-400">Allostatic Load & Goal Governor</p>
          </div>
        </div>

        {/* Live Somatic Telemetry Readout */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <HeartPulse className="h-3.5 w-3.5 text-cyan-400" />
              <span>HRV (RMSSD)</span>
            </div>
            <p className="text-lg font-bold text-white mt-1">{telemetry.hrvRmssd} <span className="text-xs font-normal text-slate-400">ms</span></p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Activity className="h-3.5 w-3.5 text-purple-400" />
              <span>Allostatic Load</span>
            </div>
            <p className="text-lg font-bold text-white mt-1">{telemetry.allostaticLoadIndex} <span className="text-xs font-normal text-slate-400">/ 1.0</span></p>
          </div>
        </div>

        {/* Empathetic Adaptation Message */}
        <div className="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs mb-1.5">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Today's Adaptive Prescription</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-200">
            {telemetry.explanation}
          </p>
        </div>

        {/* Assigned Routine Details */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
            <span className="text-slate-400">Target Routine:</span>
            <span className="font-bold text-white">{telemetry.recommendedRoutine.replace("_", " ")}</span>
          </div>
          <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
            <span className="text-slate-400">Target Duration:</span>
            <span className="font-bold text-cyan-400">{telemetry.targetDurationMinutes} Minutes</span>
          </div>
          <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
            <span className="text-slate-400">Respiration Pacing:</span>
            <span className="font-bold text-indigo-300">{telemetry.breathPacingSeconds}s Cadence</span>
          </div>
          <div className="flex items-center justify-between text-xs py-2">
            <span className="text-slate-400">Streak Protection:</span>
            <span className="font-bold text-emerald-400">{telemetry.streakShieldActive ? "Shield Armed 🛡️" : "Normal Streak Active"}</span>
          </div>
        </div>
      </div>

      {/* Manual Override Action */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <button
          onClick={() => alert("Manual Override: Starting session with custom parameters.")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-700"
        >
          <span>Begin {telemetry.targetDurationMinutes}-Min Session</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
