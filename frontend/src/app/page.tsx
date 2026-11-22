"use client";

import { Topbar } from "@/components/shell/topbar";
import { Somatic3DScene } from "@/components/three/somatic-scene";
import { SomaticCopilotDrawer } from "@/components/copilot/somatic-copilot";

export default function SessionPage() {
  return (
    <div className="flex h-screen w-screen flex-col bg-slate-950 text-slate-100 overflow-hidden">
      <Topbar />

      <main className="relative flex flex-1 overflow-hidden p-4 gap-4">
        {/* Left: 3D Somatic Biofeedback Canvas */}
        <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl">
          <Somatic3DScene />
        </div>

        {/* Right: Adaptive Somatic Copilot Panel */}
        <div className="w-84 xl:w-96 shrink-0 h-full hidden lg:block">
          <SomaticCopilotDrawer />
        </div>
      </main>
    </div>
  );
}
