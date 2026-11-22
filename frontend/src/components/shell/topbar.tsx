"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Glasses, Activity, Heart, Shield, ChevronDown, Check, Zap, Cpu } from "lucide-react";
import { useTelemetry, PresetMode } from "@/store/telemetry-store";
import { cn } from "@/lib/cn";
import { Button, Badge, type Tone } from "../ui/primitives";

export function Topbar() {
  const pathname = usePathname();
  const telemetry = useTelemetry();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBadgeTone = (): Tone => {
    switch (telemetry.autonomicState) {
      case "HIGH_READINESS": return "healthy";
      case "BALANCED": return "accent";
      case "ACUTE_STRESS": return "warning";
      case "CHRONIC_FATIGUE": return "agent";
    }
  };

  const presetLabels: { id: PresetMode; label: string; desc: string; icon: string }[] = [
    { id: "high_readiness", label: "High Readiness (HRV 84ms)", desc: "Primed for 15-min kinetic movement quest", icon: "⚡" },
    { id: "balanced", label: "Balanced Baseline (HRV 60ms)", desc: "8-min fluid somatic flow & spinal posture", icon: "🌱" },
    { id: "acute_stress", label: "Acute Stress Spike (HRV 22ms)", desc: "Auto-downscales to 4-min vagus breathwork", icon: "🔥" },
    { id: "hiatus_setback", label: "4-Day Hiatus Setback", desc: "Activates Zero-Drop Streak-Shield (2-min reset)", icon: "🛡️" }
  ];

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-line bg-shell px-5 backdrop-blur-xl">
      {/* Brand & Tabs */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white shadow-[0_0_12px_rgba(76,141,255,0.4)] font-bold text-sm tracking-wider">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-ink text-sm">SomaSync VR</span>
              <Badge tone="accent">MVP</Badge>
            </div>
            <p className="text-[10px] text-muted leading-none mt-0.5">Neuro-Kinetic Behavioral Health</p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-0.5 rounded-lg border border-line bg-surface p-0.5">
          <Link
            href="/"
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              pathname === "/"
                ? "bg-surface-3 text-ink shadow-sm"
                : "text-muted hover:text-ink hover:bg-surface-2"
            )}
          >
            3D Somatic Session
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              pathname === "/dashboard"
                ? "bg-surface-3 text-ink shadow-sm"
                : "text-muted hover:text-ink hover:bg-surface-2"
            )}
          >
            Habit Resilience Dashboard
          </Link>
        </nav>
      </div>

      {/* Center Live Biometric Pill */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium">
          <Badge tone={getBadgeTone()}>
            <span className="relative flex h-1.5 w-1.5 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
            </span>
            {telemetry.autonomicState.replace("_", " ")}
          </Badge>
          <span className="text-muted">•</span>
          <span className="text-ink font-mono text-[11px]">HRV {telemetry.hrvRmssd}ms</span>
          <span className="text-muted">•</span>
          <span className="text-ink font-mono text-[11px]">HR {telemetry.heartRate} bpm</span>
        </div>

        {telemetry.streakShieldActive && (
          <Badge tone="warning">
            <Shield className="h-3 w-3" />
            <span>Streak-Shield Active</span>
          </Badge>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Synthetic Sensor Simulator (Demo Controls) */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-accent-ink border-accent/40 bg-accent-soft hover:bg-accent-soft/80"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Demo Controls</span>
            <ChevronDown className="h-3 w-3 opacity-70" />
          </Button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-84 rounded-xl border border-line-strong bg-shell p-2 shadow-2xl backdrop-blur-2xl z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-line">
                <p className="text-xs font-semibold text-ink">Judge & Evaluator Simulator</p>
                <p className="text-[11px] text-muted">Simulate physiological states without hardware</p>
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
                      "flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                      telemetry.activePreset === p.id
                        ? "bg-surface-2 border border-accent/40 text-ink"
                        : "hover:bg-surface-2 text-ink-2"
                    )}
                  >
                    <span className="text-sm mt-0.5">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-ink leading-tight">{p.label}</p>
                      <p className="text-[11px] text-muted mt-0.5 truncate">{p.desc}</p>
                    </div>
                    {telemetry.activePreset === p.id && (
                      <Check className="h-3.5 w-3.5 text-accent mt-1 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enter VR Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => alert("WebXR Session: Meta Quest / OpenXR runtime detected. Launching full immersive session...")}
        >
          <Glasses className="h-4 w-4" />
          <span className="hidden sm:inline">Enter VR</span>
        </Button>
      </div>
    </header>
  );
}
