"use client";

import { useState } from "react";
import { Somatic3DScene } from "./somatic-scene";
import { Button, Badge } from "../ui/primitives";
import { useTelemetry } from "@/store/telemetry-store";
import { Eye, Layers, Wind, Activity, Cpu, Sparkles, ChevronRight, X, Radio } from "lucide-react";

export type SensorNode = "ppg_heart" | "eeg_frontal" | "imu_spine" | "imu_pelvis" | null;

export function SomaticViewport() {
  const telemetry = useTelemetry();
  const [activeLayers, setActiveLayers] = useState({
    biosensors: true,
    kinematics: true,
    vagusHalo: true,
    hudBoard: true
  });
  const [selectedSensor, setSelectedSensor] = useState<SensorNode>("ppg_heart");

  const toggleLayer = (key: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sensorDetails = {
    ppg_heart: {
      name: "Optical PPG Sensor (MAX30102)",
      location: "Sternum / Cardiac Vector",
      metric: `HR: ${telemetry.heartRate} bpm • HRV: ${telemetry.hrvRmssd}ms`,
      status: "Streaming (250 Hz)",
      battery: "94%",
      fidelity: "99.2% Coherence",
      desc: "Captures pulse-wave transit time and parasympathetic autonomic regulation via high-frequency RMSSD variance."
    },
    eeg_frontal: {
      name: "Frontal Dry EEG Array",
      location: "Prefrontal Cortex (Fp1/Fp2)",
      metric: `α/θ Ratio: ${telemetry.eegAlphaTheta} • 8-12 Hz Alpha Band`,
      status: "Streaming (500 Hz)",
      battery: "91%",
      fidelity: "SNR 32 dB",
      desc: "Monitors executive cognitive load, mental fatigue, and autonomic downregulation states."
    },
    imu_spine: {
      name: "Upper Kinematic IMU Pod",
      location: "Cervical / Thoracic Spine (C7-T1)",
      metric: `Alignment: ${telemetry.postureScore}% • Quat (0.98, 0.02, 0.12)`,
      status: "Active (100 Hz)",
      battery: "88%",
      fidelity: "9-Axis BNO085",
      desc: "Measures spinal curvature, shoulder asymmetry, and compensatory forward-head tilt in real time."
    },
    imu_pelvis: {
      name: "Lower Kinematic IMU Pod",
      location: "Lumbar / Sacrum (L4-S1)",
      metric: `Pelvic Tilt: 3.4° • Movement: ${telemetry.imuMotion.toFixed(2)}G`,
      status: "Active (100 Hz)",
      battery: "89%",
      fidelity: "9-Axis BNO085",
      desc: "Tracks core stability, pelvic rotation, and physical exertion intensity."
    }
  };

  return (
    <div className="relative h-full w-full rounded-[var(--radius-card)] border border-line bg-canvas overflow-hidden shadow-[var(--shadow-card)]">
      {/* 1. Top Controls Bar (Layer Switcher & View Mode) */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 rounded-lg border border-line bg-shell/90 p-1 backdrop-blur-md">
          <Button
            variant={activeLayers.biosensors ? "primary" : "ghost"}
            size="xs"
            onClick={() => toggleLayer("biosensors")}
          >
            🫀 Biosensors
          </Button>
          <Button
            variant={activeLayers.kinematics ? "primary" : "ghost"}
            size="xs"
            onClick={() => toggleLayer("kinematics")}
          >
            🦴 Kinematics
          </Button>
          <Button
            variant={activeLayers.vagusHalo ? "primary" : "ghost"}
            size="xs"
            onClick={() => toggleLayer("vagusHalo")}
          >
            🌊 Vagus Halo
          </Button>
          <Button
            variant={activeLayers.hudBoard ? "primary" : "ghost"}
            size="xs"
            onClick={() => toggleLayer("hudBoard")}
          >
            📊 In-Scene HUD
          </Button>
        </div>

        {/* Sensor Hotspot Selector Pills */}
        <div className="flex items-center gap-1 rounded-lg border border-line bg-shell/90 p-1 backdrop-blur-md">
          <span className="text-[11px] font-medium text-muted px-2">Inspect:</span>
          {(["ppg_heart", "eeg_frontal", "imu_spine", "imu_pelvis"] as const).map((id) => (
            <button
              key={id}
              onClick={() => setSelectedSensor(id)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                selectedSensor === id
                  ? "bg-surface-3 text-ink shadow-sm border border-accent/40"
                  : "text-muted hover:text-ink hover:bg-surface-2"
              }`}
            >
              {id === "ppg_heart" ? "PPG Heart" : id === "eeg_frontal" ? "EEG Brain" : id === "imu_spine" ? "IMU Spine" : "IMU Pelvis"}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Three.js Bio-Responsive Canvas */}
      <Somatic3DScene />

      {/* 3. Floating Sensor Detail Drawer (if selected) */}
      {selectedSensor && (
        <div className="absolute top-16 right-3 z-20 w-72 rounded-xl border border-line-strong bg-shell/95 p-3.5 shadow-2xl backdrop-blur-xl animate-fade-in pointer-events-auto">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-healthy animate-pulse"></span>
              <p className="text-xs font-semibold text-ink">{sensorDetails[selectedSensor].name}</p>
            </div>
            <button onClick={() => setSelectedSensor(null)} className="text-muted hover:text-ink">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-2.5 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted text-[11px]">
              <span>Placement:</span>
              <span className="font-medium text-ink-2">{sensorDetails[selectedSensor].location}</span>
            </div>
            <div className="flex justify-between text-muted text-[11px]">
              <span>Live Signal:</span>
              <span className="font-mono font-medium text-accent-ink">{sensorDetails[selectedSensor].metric}</span>
            </div>
            <div className="flex justify-between text-muted text-[11px]">
              <span>Protocol:</span>
              <span className="font-medium text-ink-2">{sensorDetails[selectedSensor].fidelity}</span>
            </div>
            <div className="flex justify-between text-muted text-[11px]">
              <span>Battery:</span>
              <span className="font-mono text-healthy-ink">{sensorDetails[selectedSensor].battery}</span>
            </div>
          </div>

          <p className="mt-2.5 pt-2 border-t border-line text-[11px] text-muted leading-relaxed">
            {sensorDetails[selectedSensor].desc}
          </p>
        </div>
      )}

      {/* 4. Bottom Respiration Cadence Guide Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-auto flex items-center justify-between rounded-xl border border-line bg-shell/90 px-4 py-2.5 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent border border-accent/30">
            <Wind className="h-3.5 w-3.5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-ink">Vagus Nerve Breathing Pacer</span>
              <Badge tone="accent">{telemetry.breathPacingSeconds}s Cadence</Badge>
            </div>
            <p className="text-[11px] text-muted">Inhale 4s • Hold 7s • Exhale 8s for parasympathetic downregulation</p>
          </div>
        </div>

        {/* Animated breathing bar */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-48 h-2 rounded-full bg-surface-3 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-accent to-healthy rounded-full animate-pulse"
              style={{ width: "65%" }}
            ></div>
          </div>
          <span className="text-xs font-mono text-ink-2">Coherence: 94%</span>
        </div>
      </div>
    </div>
  );
}
