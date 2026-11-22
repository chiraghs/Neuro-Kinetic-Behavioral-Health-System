"use client";

import { useState } from "react";
import { Topbar } from "@/components/shell/topbar";
import { Shield, Activity, Heart, Calendar, Download, CheckCircle2, TrendingUp, Sparkles, Award } from "lucide-react";

export default function DashboardPage() {
  const [downloading, setDownloading] = useState(false);

  // Generate 60 days of resilient habit history
  const days = Array.from({ length: 60 }, (_, i) => {
    const isSetbackDay = (i >= 13 && i <= 15) || (i >= 37 && i <= 39) || i === 46;
    const isMissedDay = i === 45;
    return {
      day: i + 1,
      date: `Nov ${i + 1}`,
      status: isMissedDay ? "missed" : isSetbackDay ? "shield" : "completed",
      routine: isSetbackDay ? "Restorative Reset" : i % 2 === 0 ? "Kinetic Quest" : "Somatic Flow",
      hrv: isSetbackDay ? Math.floor(25 + Math.random() * 10) : Math.floor(55 + (i * 0.35))
    };
  });

  const handleExportFhir = () => {
    setDownloading(true);
    setTimeout(() => {
      const data = {
        resourceType: "ClinicalImpression",
        status: "completed",
        patient: "Patient/somasync-user-01",
        metrics: {
          sixty_day_adherence_pct: 98.3,
          streak_shield_saves: 8,
          baseline_hrv_gain_pct: 19.4,
          kinematic_mobility_gain_deg: 24.2
        }
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "somasync_clinical_impression_fhir.json";
      a.click();
      setDownloading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col">
      <Topbar />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Header Title & FHIR Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Habit Resilience & Autonomic Recovery</span>
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                Active Streak: 18 Days
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Longitudinal tracking designed around biological empathy and non-punitive setback recovery.
            </p>
          </div>

          <button
            onClick={handleExportFhir}
            disabled={downloading}
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-white border border-slate-700 transition"
          >
            <Download className="h-4 w-4 text-cyan-400" />
            <span>{downloading ? "Exporting FHIR..." : "Export Clinical FHIR Summary"}</span>
          </button>
        </div>

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>60-Day Adherence</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-white mt-2">98.3%</p>
            <p className="text-[11px] text-emerald-400 mt-1">vs 18% industry standard</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Streak-Shield Saves</span>
              <Shield className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-white mt-2">8 Days</p>
            <p className="text-[11px] text-amber-300 mt-1">Rescued via Restorative Resets</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Baseline HRV Gain</span>
              <Heart className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-extrabold text-white mt-2">+19.4%</p>
            <p className="text-[11px] text-cyan-300 mt-1">Enhanced parasympathetic tone</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Recovery Velocity</span>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </div>
            <p className="text-2xl font-extrabold text-white mt-2">&lt; 24h</p>
            <p className="text-[11px] text-purple-300 mt-1">Average time to resume habit</p>
          </div>
        </div>

        {/* 60-Day Zero-Drop Habit Calendar Grid */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cyan-400" />
                <span>60-Day Zero-Drop Habit Calendar</span>
              </h2>
              <p className="text-xs text-slate-400">
                Hover over days to see how adaptive downscaling protected habit momentum during life setbacks.
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-emerald-500/80"></span>
                <span className="text-slate-300">Kinetic Quest / Flow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-amber-500/80"></span>
                <span className="text-slate-300">Streak-Shield Reset</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-slate-700"></span>
                <span className="text-slate-400">Rest</span>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2 pt-2">
            {days.map((d) => (
              <div
                key={d.day}
                title={`Day ${d.day} (${d.routine}) - Resting HRV: ${d.hrv}ms`}
                className={`group relative flex flex-col items-center justify-center rounded-xl p-2.5 transition border cursor-pointer ${
                  d.status === "completed"
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                    : d.status === "shield"
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-200 hover:bg-amber-500/30 shadow-sm shadow-amber-500/10"
                    : "bg-slate-800/40 border-slate-700 text-slate-500"
                }`}
              >
                <span className="text-[10px] opacity-70">D{d.day}</span>
                {d.status === "shield" ? (
                  <Shield className="h-4 w-4 text-amber-400 my-0.5" />
                ) : d.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 my-0.5" />
                ) : (
                  <span className="h-4 w-4 my-0.5 text-center text-xs">•</span>
                )}
                <span className="text-[9px] font-mono">{d.hrv}ms</span>
              </div>
            ))}
          </div>
        </div>

        {/* Psychological Resilience Summary Banner */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Why This Model Sustains Behavior</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                By cushioning 8 high-stress days with 2-minute Restorative Resets instead of binary streak failures, 
                the user avoided the behavioral "What-the-Hell" collapse. Consistency was preserved with biological empathy.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
