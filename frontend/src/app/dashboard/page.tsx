"use client";

import { useState } from "react";
import { Topbar } from "@/components/shell/topbar";
import { Shield, Activity, Heart, Calendar, Download, CheckCircle2, TrendingUp, Sparkles, Award } from "lucide-react";
import { Card, CardHeader, CardBody, Badge, Button } from "@/components/ui/primitives";

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
    <div className="min-h-screen w-screen bg-canvas text-ink flex flex-col">
      <Topbar />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Header Title & FHIR Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold tracking-tight text-ink">Habit Resilience & Autonomic Recovery</h1>
              <Badge tone="healthy">Active Streak: 18 Days</Badge>
            </div>
            <p className="text-xs text-muted mt-1">
              Longitudinal tracking designed around biological empathy and non-punitive setback recovery.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportFhir}
            disabled={downloading}
            className="gap-2"
          >
            <Download className="h-4 w-4 text-accent" />
            <span>{downloading ? "Exporting FHIR..." : "Export Clinical FHIR Summary"}</span>
          </Button>
        </div>

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between text-muted text-xs">
                <span>60-Day Adherence</span>
                <CheckCircle2 className="h-4 w-4 text-healthy" />
              </div>
              <p className="text-2xl font-bold font-mono text-ink mt-2">98.3%</p>
              <p className="text-[11px] text-healthy-ink mt-1">vs 18% industry standard</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between text-muted text-xs">
                <span>Streak-Shield Saves</span>
                <Shield className="h-4 w-4 text-warning" />
              </div>
              <p className="text-2xl font-bold font-mono text-ink mt-2">8 Days</p>
              <p className="text-[11px] text-warning-ink mt-1">Rescued via Restorative Resets</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between text-muted text-xs">
                <span>Baseline HRV Gain</span>
                <Heart className="h-4 w-4 text-accent" />
              </div>
              <p className="text-2xl font-bold font-mono text-ink mt-2">+19.4%</p>
              <p className="text-[11px] text-accent-ink mt-1">Enhanced parasympathetic tone</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between text-muted text-xs">
                <span>Recovery Velocity</span>
                <TrendingUp className="h-4 w-4 text-maint" />
              </div>
              <p className="text-2xl font-bold font-mono text-ink mt-2">&lt; 24h</p>
              <p className="text-[11px] text-maint-ink mt-1">Average time to resume habit</p>
            </CardBody>
          </Card>
        </div>

        {/* 60-Day Zero-Drop Habit Calendar Grid */}
        <Card>
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent" />
                <span>60-Day Zero-Drop Habit Calendar</span>
              </div>
            }
            description="Hover over days to see how adaptive downscaling protected habit momentum during life setbacks."
            actions={
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded bg-healthy"></span>
                  <span className="text-ink-2">Kinetic Quest / Flow</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded bg-warning"></span>
                  <span className="text-ink-2">Streak-Shield Reset</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded bg-surface-3"></span>
                  <span className="text-muted">Rest</span>
                </div>
              </div>
            }
          />

          <CardBody>
            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2 pt-2">
              {days.map((d) => (
                <div
                  key={d.day}
                  title={`Day ${d.day} (${d.routine}) - Resting HRV: ${d.hrv}ms`}
                  className={`group relative flex flex-col items-center justify-center rounded-lg p-2.5 transition border cursor-pointer ${
                    d.status === "completed"
                      ? "bg-healthy/12 border-healthy/35 text-healthy-ink hover:bg-healthy/20"
                      : d.status === "shield"
                      ? "bg-warning/15 border-warning/40 text-warning-ink hover:bg-warning/25 shadow-sm"
                      : "bg-surface-2 border-line text-muted"
                  }`}
                >
                  <span className="text-[10px] opacity-70">D{d.day}</span>
                  {d.status === "shield" ? (
                    <Shield className="h-3.5 w-3.5 text-warning my-0.5" />
                  ) : d.status === "completed" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-healthy my-0.5" />
                  ) : (
                    <span className="h-3.5 w-3.5 my-0.5 text-center text-xs">•</span>
                  )}
                  <span className="text-[9px] font-mono">{d.hrv}ms</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Psychological Resilience Summary Banner */}
        <Card className="border-accent/40 bg-accent-soft/30 p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent/20 text-accent border border-accent/30 shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">Why This Model Sustains Behavior</h3>
              <p className="text-xs text-ink-2 mt-1 max-w-2xl leading-relaxed">
                By cushioning 8 high-stress days with 2-minute Restorative Resets instead of binary streak failures, 
                the user avoided the behavioral "What-the-Hell" collapse. Consistency was preserved with biological empathy.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
