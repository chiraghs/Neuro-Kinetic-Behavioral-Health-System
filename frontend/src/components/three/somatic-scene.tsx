"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTelemetry } from "@/store/telemetry-store";

export function Somatic3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const telemetry = useTelemetry();
  const telemetryRef = useRef(telemetry);

  useEffect(() => {
    telemetryRef.current = telemetry;
  }, [telemetry]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090d16, 0.035);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 1. Bio-Responsive Particle Wave (The Somatic Wave)
    const particleCount = 3500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color("#38bdf8"); // Cyan
    const color2 = new THREE.Color("#818cf8"); // Indigo
    const colorStress = new THREE.Color("#fbbf24"); // Amber

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 4.5;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = (Math.random() - 0.5) * 1.5;
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      colors[i * 3] = color1.r;
      colors[i * 3 + 1] = color1.g;
      colors[i * 3 + 2] = color1.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 2. Core Vagus Coherence Ring (Pacing guide)
    const ringGeo = new THREE.TorusGeometry(1.6, 0.025, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const coherenceRing = new THREE.Mesh(ringGeo, ringMat);
    coherenceRing.position.set(0, 1.8, 0);
    scene.add(coherenceRing);

    // Subtle ambient grid floor
    const grid = new THREE.GridHelper(20, 20, 0x1e293b, 0x0f172a);
    grid.position.y = -0.8;
    scene.add(grid);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const current = telemetryRef.current;

      // Adjust particle motion speed based on heart rate & readiness
      const speedMultiplier = current.autonomicState === "HIGH_READINESS" ? 1.4 : 0.6;
      particles.rotation.y = elapsedTime * 0.08 * speedMultiplier;

      // Pulse coherence ring based on target breath pacing
      const breathCadence = current.breathPacingSeconds; // e.g. 5.5s
      const scale = 1.0 + 0.22 * Math.sin((elapsedTime * 2 * Math.PI) / (breathCadence * 2));
      coherenceRing.scale.set(scale, scale, scale);

      // Color transition
      if (current.autonomicState === "ACUTE_STRESS") {
        ringMat.color.lerp(colorStress, 0.05);
      } else {
        ringMat.color.lerp(color1, 0.05);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-950">
      <div ref={containerRef} className="absolute inset-0" />
      
      {/* Floating Spatial Watermark in 3D scene */}
      <div className="pointer-events-none absolute bottom-6 left-6 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 backdrop-blur-md">
        <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Bio-Responsive WebGL Viewport</p>
        <p className="text-xs text-slate-300">Respiration halo synced to {telemetry.breathPacingSeconds}s vagus cadence</p>
      </div>
    </div>
  );
}
