"use client";

import { useEffect, useState } from "react";

export type PresetMode = "high_readiness" | "balanced" | "acute_stress" | "hiatus_setback";
export type AutonomicState = "HIGH_READINESS" | "BALANCED" | "ACUTE_STRESS" | "CHRONIC_FATIGUE";
export type RoutineType = "KINETIC_QUEST" | "SOMATIC_FLOW" | "RESTORATIVE_RESET";

export interface TelemetryState {
  heartRate: number;
  hrvRmssd: number;
  eegAlphaTheta: number;
  imuMotion: number;
  postureScore: number;
  allostaticLoadIndex: number;
  autonomicState: AutonomicState;
  recommendedRoutine: RoutineType;
  targetDurationMinutes: number;
  breathPacingSeconds: number;
  streakShieldActive: boolean;
  activePreset: PresetMode;
  explanation: string;
  isSimulating: boolean;
  isBleConnected: boolean;
  setPreset: (preset: PresetMode) => void;
  toggleSimulation: () => void;
}

// Preset definitions for instant judge simulation
export const PRESETS = {
  high_readiness: {
    heartRate: 64,
    hrvRmssd: 84,
    eegAlphaTheta: 1.6,
    imuMotion: 0.85,
    postureScore: 92,
    allostaticLoadIndex: 0.24,
    autonomicState: "HIGH_READINESS" as AutonomicState,
    recommendedRoutine: "KINETIC_QUEST" as RoutineType,
    targetDurationMinutes: 15,
    breathPacingSeconds: 4.5,
    streakShieldActive: false,
    explanation: "High autonomic readiness detected (HRV: 84ms). Primed for today's 15-minute active kinetic mobility quest."
  },
  balanced: {
    heartRate: 72,
    hrvRmssd: 60,
    eegAlphaTheta: 1.25,
    imuMotion: 0.45,
    postureScore: 85,
    allostaticLoadIndex: 0.44,
    autonomicState: "BALANCED" as AutonomicState,
    recommendedRoutine: "SOMATIC_FLOW" as RoutineType,
    targetDurationMinutes: 8,
    breathPacingSeconds: 5.5,
    streakShieldActive: false,
    explanation: "Balanced nervous system baseline. Prescribed an 8-minute fluid somatic stretch and posture reset."
  },
  acute_stress: {
    heartRate: 96,
    hrvRmssd: 22,
    eegAlphaTheta: 0.52,
    imuMotion: 0.15,
    postureScore: 60,
    allostaticLoadIndex: 0.78,
    autonomicState: "ACUTE_STRESS" as AutonomicState,
    recommendedRoutine: "RESTORATIVE_RESET" as RoutineType,
    targetDurationMinutes: 4,
    breathPacingSeconds: 6.5,
    streakShieldActive: true,
    explanation: "Elevated nervous system strain detected (HRV suppressed to 22ms). Goal downscaled to 4 minutes of parasympathetic vagus breathwork. Streaks protected."
  },
  hiatus_setback: {
    heartRate: 78,
    hrvRmssd: 38,
    eegAlphaTheta: 0.85,
    imuMotion: 0.20,
    postureScore: 68,
    allostaticLoadIndex: 0.65,
    autonomicState: "CHRONIC_FATIGUE" as AutonomicState,
    recommendedRoutine: "RESTORATIVE_RESET" as RoutineType,
    targetDurationMinutes: 2,
    breathPacingSeconds: 6.0,
    streakShieldActive: true,
    explanation: "Welcome back after an unplanned 4-day hiatus. Zero-Drop Streak-Shield activated with a gentle 2-minute reset to rebuild momentum guilt-free."
  }
};

// Global simple state manager
let state: TelemetryState = {
  ...PRESETS.high_readiness,
  activePreset: "high_readiness",
  isSimulating: true,
  isBleConnected: false,
  setPreset: (p) => {
    state = {
      ...state,
      ...PRESETS[p],
      activePreset: p
    };
    listeners.forEach((l) => l());
  },
  toggleSimulation: () => {
    state = { ...state, isSimulating: !state.isSimulating };
    listeners.forEach((l) => l());
  }
};

const listeners = new Set<() => void>();

export function useTelemetry(): TelemetryState {
  const [, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }, []);

  // Biological breathing oscillation effect
  useEffect(() => {
    if (!state.isSimulating) return;
    const interval = setInterval(() => {
      const base = PRESETS[state.activePreset];
      const hrJitter = (Math.random() - 0.5) * 2;
      const hrvJitter = (Math.random() - 0.5) * 3;
      
      state = {
        ...state,
        heartRate: Math.round(base.heartRate + hrJitter),
        hrvRmssd: Math.max(10, Math.round(base.hrvRmssd + hrvJitter))
      };
      listeners.forEach((l) => l());
    }, 1200);

    return () => clearInterval(interval);
  }, [state.activePreset, state.isSimulating]);

  return state;
}
