"use client";

import { Topbar } from "@/components/shell/topbar";
import { Somatic3DScene } from "@/components/three/somatic-scene";
import { SomaticCopilotDrawer } from "@/components/copilot/somatic-copilot";

export default function SessionPage() {
  return (
    <div className="flex h-screen w-screen flex-col bg-canvas text-ink overflow-hidden">
      <Topbar />

      <main className="relative flex flex-1 overflow-hidden p-3.5 gap-3.5">
        {/* Left: 3D Somatic Biofeedback Canvas */}
        <div className="relative flex-1 rounded-[var(--radius-card)] overflow-hidden border border-line shadow-[var(--shadow-card)]">
          <Somatic3DScene />
        </div>

        {/* Right: Adaptive Somatic Copilot Panel */}
        <div className="w-80 xl:w-92 shrink-0 h-full hidden lg:block">
          <SomaticCopilotDrawer />
        </div>
      </main>
    </div>
  );
}
