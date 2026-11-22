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

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene & Atmosphere matching TWIN META tokens
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#070b14"); // Canvas deep token
    scene.fog = new THREE.FogExp2(0x070b14, 0.04);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 1.6, 4.8); // 1.6m standing eye-height

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    containerRef.current.appendChild(renderer.domElement);

    // 2. Floor Grid (TWIN META iso-grid token #131d33 & floor #0a1120)
    const gridHelper = new THREE.GridHelper(24, 24, 0x2b3b5e, 0x131d33);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Platform Base
    const platformGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.08, 32);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0e182c,
      roughness: 0.6,
      metalness: 0.2
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.04;
    scene.add(platform);

    const ringRimGeo = new THREE.RingGeometry(1.78, 1.84, 32);
    const ringRimMat = new THREE.MeshBasicMaterial({ color: 0x4c8dff, side: THREE.DoubleSide });
    const ringRim = new THREE.Mesh(ringRimGeo, ringRimMat);
    ringRim.rotation.x = Math.PI / 2;
    ringRim.position.y = 0.01;
    scene.add(ringRim);

    // 3. Humanoid Kinematic Silhouette (Digital Twin Avatar)
    const avatarGroup = new THREE.Group();
    avatarGroup.position.set(0, 0, 0);

    // Head
    const headGeo = new THREE.IcosahedronGeometry(0.16, 2);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x9cc0ff, wireframe: true, transparent: true, opacity: 0.8 });
    const head = new THREE.Mesh(headGeo, wireMat);
    head.position.y = 1.65;
    avatarGroup.add(head);

    // Torso / Spine
    const spineCurve = new THREE.LineCurve3(new THREE.Vector3(0, 0.9, 0), new THREE.Vector3(0, 1.5, 0));
    const spineGeo = new THREE.TubeGeometry(spineCurve, 10, 0.04, 8, false);
    const spineMat = new THREE.MeshStandardMaterial({ color: 0x2b3b5e, roughness: 0.5 });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    avatarGroup.add(spine);

    // Chest Core (Vagus Coherence Center)
    const coreGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x4c8dff, wireframe: true });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 1.35;
    avatarGroup.add(core);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.55);
    const lArm = new THREE.Mesh(armGeo, spineMat);
    lArm.position.set(-0.28, 1.25, 0);
    lArm.rotation.z = Math.PI / 10;
    const rArm = new THREE.Mesh(armGeo, spineMat);
    rArm.position.set(0.28, 1.25, 0);
    rArm.rotation.z = -Math.PI / 10;
    avatarGroup.add(lArm);
    avatarGroup.add(rArm);

    scene.add(avatarGroup);

    // 4. Bio-Responsive Breathing Halo (Torus around chest)
    const haloGeo = new THREE.TorusGeometry(0.85, 0.018, 16, 100);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x4c8dff, transparent: true, opacity: 0.7 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 1.35, 0);
    halo.rotation.x = Math.PI / 2.2;
    scene.add(halo);

    // 5. Ambient Swirling Particle Wave (Somatic Flow)
    const particleCount = 2000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    const cAccent = new THREE.Color("#4c8dff");
    const cHealthy = new THREE.Color("#10b981");
    const cStress = new THREE.Color("#f59e0b");

    for (let i = 0; i < particleCount; i++) {
      const radius = 0.8 + Math.random() * 3.2;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.2) * 2.8;

      pPos[i * 3] = Math.cos(angle) * radius;
      pPos[i * 3 + 1] = height;
      pPos[i * 3 + 2] = Math.sin(angle) * radius;

      pColors[i * 3] = cAccent.r;
      pColors[i * 3 + 1] = cAccent.g;
      pColors[i * 3 + 2] = cAccent.b;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(pGeo, pMat);
    scene.add(particleSystem);

    // 6. Floating 3D Text Board (TWIN META canvas texture board)
    const boardCanvas = document.createElement("canvas");
    boardCanvas.width = 512;
    boardCanvas.height = 240;
    const ctx = boardCanvas.getContext("2d")!;
    const boardTex = new THREE.CanvasTexture(boardCanvas);
    boardTex.colorSpace = THREE.SRGBColorSpace;

    const boardGeo = new THREE.PlaneGeometry(1.2, 0.56);
    const boardMaterial = new THREE.MeshBasicMaterial({ map: boardTex, transparent: true });
    const boardMesh = new THREE.Mesh(boardGeo, boardMaterial);
    boardMesh.position.set(1.4, 1.6, -0.4);
    boardMesh.rotation.y = -Math.PI / 8;
    scene.add(boardMesh);

    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0x9cc0ff, 1.2);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    // Clock
    let clock = new THREE.Clock();
    let frameId: number;

    const render = () => {
      frameId = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();
      const current = telemetryRef.current;

      // Rotate particle flow
      const speed = current.autonomicState === "HIGH_READINESS" ? 1.4 : 0.5;
      particleSystem.rotation.y = elapsed * 0.06 * speed;

      // Respiration pulsation
      const cadence = current.breathPacingSeconds;
      const breathScale = 1.0 + 0.25 * Math.sin((elapsed * 2 * Math.PI) / (cadence * 2));
      halo.scale.set(breathScale, breathScale, breathScale);

      // Color transition
      if (current.autonomicState === "ACUTE_STRESS") {
        haloMat.color.lerp(cStress, 0.05);
        coreMat.color.lerp(cStress, 0.05);
        ringRimMat.color.lerp(cStress, 0.05);
      } else if (current.autonomicState === "HIGH_READINESS") {
        haloMat.color.lerp(cHealthy, 0.05);
        coreMat.color.lerp(cHealthy, 0.05);
        ringRimMat.color.lerp(cHealthy, 0.05);
      } else {
        haloMat.color.lerp(cAccent, 0.05);
        coreMat.color.lerp(cAccent, 0.05);
        ringRimMat.color.lerp(cAccent, 0.05);
      }

      // Draw in-scene 3D Board (TWIN META canvas texture board style)
      ctx.fillStyle = "rgba(10, 16, 32, 0.94)";
      ctx.beginPath();
      ctx.roundRect(0, 0, 512, 240, 18);
      ctx.fill();

      // Left accent bar
      ctx.fillStyle = current.autonomicState === "ACUTE_STRESS" ? "#f59e0b" : current.autonomicState === "HIGH_READINESS" ? "#10b981" : "#4c8dff";
      ctx.fillRect(0, 0, 12, 240);

      // Board Text
      ctx.font = "bold 26px -apple-system, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("SOMATIC TELEMETRY", 28, 48);

      ctx.font = "20px -apple-system, sans-serif";
      ctx.fillStyle = "#a9b4c8";
      ctx.fillText(`HRV: ${current.hrvRmssd}ms   •   HR: ${current.heartRate} bpm`, 28, 92);
      ctx.fillText(`Allostatic Load: ${current.allostaticLoadIndex} / 1.0`, 28, 134);

      ctx.fillStyle = current.streakShieldActive ? "#fbc561" : "#5ee0b0";
      ctx.font = "bold 19px -apple-system, sans-serif";
      ctx.fillText(current.streakShieldActive ? "🛡️ Streak-Shield Engaged (Restorative)" : "⚡ High Readiness (Kinetic Quest)", 28, 180);

      ctx.fillStyle = "#6f7d99";
      ctx.font = "16px -apple-system, sans-serif";
      ctx.fillText(`Respiration Target: ${cadence}s cadence`, 28, 214);

      boardTex.needsUpdate = true;

      renderer.render(scene, camera);
    };

    render();

    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      pGeo.dispose();
      pMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      headGeo.dispose();
      wireMat.dispose();
      platformGeo.dispose();
      platformMat.dispose();
      ringRimGeo.dispose();
      ringRimMat.dispose();
      boardGeo.dispose();
      boardMaterial.dispose();
      boardTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-canvas">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Floating HUD Pill matching TWIN META */}
      <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-line bg-shell/80 px-3.5 py-2 shadow-lg backdrop-blur-md">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-ink">Digital Twin Viewport</p>
        <p className="text-xs text-ink-2 font-mono">1.6m standing observer • WebXR OpenXR runtime active</p>
      </div>
    </div>
  );
}
