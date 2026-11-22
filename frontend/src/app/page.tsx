"use client";

import { Topbar } from "@/components/shell/topbar";
import { SomaticViewport } from "@/components/three/somatic-viewport";
import { SomaticCopilotDrawer } from "@/components/copilot/somatic-copilot";
import { StatTile, PageHeader } from "@/components/page";
import { useTelemetry } from "@/store/telemetry-store";
import { HeartPulse, Brain, Bone, Activity, Sparkles, Shield, RefreshCw } from "lucide-react";
import { Button, Badge } from "@/components/ui/primitives";

export default function SessionPage() {
  const telemetry = useTelemetry();

  return (
    <div className="flex h-screen w-screen flex-col bg-canvas text-ink overflow-hidden">
      <Topbar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden p-4 gap-3.5">
        {/* Top 4 Real-Time StatTiles (Like TWIN META's live metrics strip) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          <StatTile
            label="Autonomic Tone (HRV)"
            value={`${telemetry.hrvRmssd} ms`}
            sub={telemetry.hrvRmssd > 50 ? "Coherent parasympathetic tone" : "Sympathetic stress dominance"}
            tone={telemetry.hrvRmssd > 50 ? "healthy" : "warning"}
            icon={<HeartPulse className="h-4 w-4" />}
          />

          <StatTile
            label="Cognitive State (EEG)"
            value={`${telemetry.eegAlphaTheta} α/θ`}
            sub={telemetry.eegAlphaTheta > 1.2 ? "Alpha calm / focused state" : "Elevated beta / mental strain"}
            tone={telemetry.eegAlphaTheta > 1.2 ? "accent" : "warning"}
            icon={<Brain className="h-4 w-4" />}
          />

          <StatTile
            label="Kinematic Symmetry"
            value={`${telemetry.postureScore}%`}
            sub="Spinal curvature & pelvic alignment"
            tone="healthy"
            icon={<Bone className="h-4 w-4" />}
          />

          <StatTile
            label="Allostatic Load Index"
            value={`${telemetry.allostaticLoadIndex} / 1.0`}
            sub={telemetry.streakShieldActive ? "Zero-Drop Streak-Shield engaged" : "High physical readiness"}
            tone={telemetry.streakShieldActive ? "warning" : "healthy"}
            icon={<Activity className="h-4 w-4" />}
          />
        </div>

        {/* Workspace: 3D Viewport on Left + Copilot Drawer on Right */}
        <div className="flex flex-1 overflow-hidden gap-3.5">
          <div className="flex-1 h-full min-w-0">
            <SomaticViewport />
          </div>

          <div className="w-80 xl:w-92 shrink-0 h-full hidden lg:block">
            <SomaticCopilotDrawer />
          </div>
        </div>
      </div>
    </div>
  );
}
