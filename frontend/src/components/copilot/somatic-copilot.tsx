"use client";

import { useTelemetry } from "@/store/telemetry-store";
import { Sparkles, Activity, ShieldCheck, HeartPulse, UserCheck, ArrowRight, Shield } from "lucide-react";
import { Card, CardHeader, CardBody, Badge, Button } from "../ui/primitives";

export function SomaticCopilotDrawer() {
  const telemetry = useTelemetry();

  return (
    <Card className="flex h-full flex-col justify-between">
      <div>
        <CardHeader
          title="Adaptive Somatic Copilot"
          description="Allostatic Load & Goal Governor"
          icon={<Sparkles className="h-4 w-4 text-accent" />}
          actions={<Badge tone="agent">Active AI</Badge>}
        />

        <CardBody className="space-y-4">
          {/* Live Biometric Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-lg border border-line bg-surface-2 p-3">
              <div className="flex items-center gap-1.5 text-muted text-[11px]">
                <HeartPulse className="h-3.5 w-3.5 text-accent" />
                <span>HRV (RMSSD)</span>
              </div>
              <p className="text-xl font-bold font-mono text-ink mt-1">
                {telemetry.hrvRmssd} <span className="text-xs font-normal text-muted">ms</span>
              </p>
            </div>

            <div className="rounded-lg border border-line bg-surface-2 p-3">
              <div className="flex items-center gap-1.5 text-muted text-[11px]">
                <Activity className="h-3.5 w-3.5 text-agent-ink" />
                <span>Allostatic Load</span>
              </div>
              <p className="text-xl font-bold font-mono text-ink mt-1">
                {telemetry.allostaticLoadIndex} <span className="text-xs font-normal text-muted">/ 1.0</span>
              </p>
            </div>
          </div>

          {/* Empathetic Prescription Box */}
          <div className="rounded-lg border border-line-strong bg-accent-soft/40 p-3.5">
            <div className="flex items-center gap-2 text-accent-ink font-medium text-xs mb-1.5">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Today's Adaptive Prescription</span>
            </div>
            <p className="text-xs leading-relaxed text-ink-2">
              {telemetry.explanation}
            </p>
          </div>

          {/* Assigned Routine Details */}
          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-line/60">
              <span className="text-muted">Target Routine:</span>
              <span className="font-semibold text-ink">{telemetry.recommendedRoutine.replace("_", " ")}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-line/60">
              <span className="text-muted">Target Duration:</span>
              <span className="font-semibold text-accent-ink font-mono">{telemetry.targetDurationMinutes} Minutes</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-line/60">
              <span className="text-muted">Respiration Cadence:</span>
              <span className="font-semibold text-ink font-mono">{telemetry.breathPacingSeconds}s Inhale/Exhale</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-muted">Streak Protection:</span>
              {telemetry.streakShieldActive ? (
                <Badge tone="warning">
                  <Shield className="h-3 w-3" />
                  <span>Shield Armed</span>
                </Badge>
              ) : (
                <Badge tone="healthy">Normal Streak Active</Badge>
              )}
            </div>
          </div>
        </CardBody>
      </div>

      {/* Manual Override Action */}
      <div className="p-4 border-t border-line">
        <Button
          variant="primary"
          size="md"
          className="w-full gap-2"
          onClick={() => alert(`Starting session: ${telemetry.targetDurationMinutes}-minute ${telemetry.recommendedRoutine}`)}
        >
          <span>Begin {telemetry.targetDurationMinutes}-Min Session</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
