"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Glasses, Activity, Heart, Shield, ChevronDown, Check, RefreshCw } from "lucide-react";
import { useTelemetry, PresetMode } from "@/store/telemetry-store";
import { cn } from "@/lib/cn";

export function Topbar() {
  const pathname = usePathname();
  const telemetry = useTelemetry();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusColor = () => {
    switch (telemetry.autonomicState) {
      case "HIGH_READINESS": return "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
      case "BALANCED": return "border-cyan-500/40 bg-cyan-500/10 text-cyan-400";
      case "ACUTE_STRESS": return "border-amber-500/40 bg-amber-500/10 text-amber-400";
      case "CHRONIC_FATIGUE": return "border-purple-500/40 bg-purple-500/10 text-purple-400";
    }
  };

  const presetLabels: { id: PresetMode; label: string; desc: string; icon: string }[] = [
    { id: "high_readiness", label: "High Readiness (HRV 84ms)", desc: "Primed for 15-min kinetic movement quest", icon: "⚡" },
    { id: "balanced", label: "Balanced Baseline (HRV 60ms)", desc: "8-min fluid somatic flow & spinal posture", icon: "🌱" },
    { id: "acute_stress", label: "Acute Stress Spike (HRV 22ms)", desc: "Auto-downscales to 4-min vagus breathwork", icon: "🔥" },
    { id: "hiatus_setback", label: "4-Day Hiatus Setback", desc: "Activates Zero-Drop Streak-Shield (2-min reset)", icon: "🛡️" }
  ];

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-xl">
      {/* Brand & Mode */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 font-bold text-lg">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">SomaSync VR</span>
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-500/30">
                MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Neuro-Kinetic Behavioral Health</p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-lg bg-slate-900/60 p-1 border border-slate-800">
          <Link
            href="/"
            className={cn(
              "rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all",
              pathname === "/"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-white"
            )}
          >
            3D Somatic Session
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all",
              pathname === "/dashboard"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-white"
            )}
          >
            Habit Resilience Dashboard
          </Link>
        </nav>
      </div>

      {/* Center Live Biometric Pill */}
      <div className="hidden lg:flex items-center gap-3">
        <div className={cn("flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium backdrop-blur-md", getStatusColor())}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
          </span>
          <span className="font-semibold">{telemetry.autonomicState.replace("_", " ")}</span>
          <span className="opacity-40">•</span>
          <span>HRV: {telemetry.hrvRmssd}ms</span>
          <span className="opacity-40">•</span>
          <span>HR: {telemetry.heartRate} bpm</span>
        </div>

        {telemetry.streakShieldActive && (
          <div className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            <Shield className="h-3.5 w-3.5 text-amber-400" />
            <span>Streak-Shield Active</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Synthetic Sensor Simulator (Demo Controls) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-1.5 text-xs font-semibold text-cyan-200 transition-all hover:bg-cyan-900/50 hover:border-cyan-400 shadow-sm shadow-cyan-500/10"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Demo Controls</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl z-50">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white">Judge & Evaluator Simulator</p>
                <p className="text-[11px] text-slate-400">Simulate physiological states without hardware</p>
              </div>
              <div className="py-1">
                {presetLabels.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      telemetry.setPreset(p.id);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-all",
                      telemetry.activePreset === p.id
                        ? "bg-cyan-500/15 border border-cyan-500/30 text-white"
                        : "hover:bg-slate-800 text-slate-300"
                    )}
                  >
                    <span className="text-base mt-0.5">{p.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold leading-tight">{p.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{p.desc}</p>
                    </div>
                    {telemetry.activePreset === p.id && (
                      <Check className="h-4 w-4 text-cyan-400 mt-1 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enter VR Button */}
        <button
          onClick={() => alert("WebXR Session: Meta Quest / OpenXR runtime detected. Launching full immersive session...")}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:brightness-110 transition-all"
        >
          <Glasses className="h-4 w-4" />
          <span className="hidden sm:inline">Enter VR</span>
        </button>
      </div>
    </header>
  );
}
