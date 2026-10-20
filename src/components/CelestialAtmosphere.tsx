import React, { useEffect, useRef, useState } from 'react';

interface CelestialAtmosphereProps {
  isDark: boolean;
}

/**
 * CelestialAtmosphere:
 * 
 * Night Mode:
 * - Authentic 3D Astronomical Deep Space: multi-magnitude starfield, photometric Airy halos,
 *   organic Milky Way dust lane, living interactive stardust motes, and physically realistic falling meteor.
 * 
 * Day Mode (Pinterest Inflight Sky Inspo - Behance Stefan Poulos):
 * - Elevated celestial daylight sky with rich cerulean depths (#2e6aa0 -> #4c8ec6 -> #9ecbed -> #f0f7ff).
 * - Multi-layered procedural cumulus & cirrus cloud formations with 3D volumetric light and atmospheric shadows.
 * - Volumetric crepuscular sunbeams (God rays) radiating from a soft golden-white sun disc.
 * - Interactive multi-plane parallax responding fluidly to pointer movement / touch swipe.
 * - Interactive aerodynamic wind currents: moving the cursor or swiping stirs the drifting clouds.
 * - Floating golden & pearlescent solar motes (sun dust dancing in light shafts) with wake dispersal.
 * - Tap/Click gentle celestial breath pulse ("Selah") that ripples through the clouds.
 * - 60 FPS smooth performance powered by cached offscreen canvas cloud generators.
 */
export const CelestialAtmosphere: React.FC<CelestialAtmosphereProps> = React.memo(({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showHint, setShowHint] = useState(!isDark);

  useEffect(() => {
    setShowHint(!isDark);
    if (!isDark) {
      const timer = setTimeout(() => setShowHint(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Responsive canvas resizing with DPR clamping
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // =========================================================================
    // 1. NIGHT MODE ARCHITECTURE: Real Astrophysics Deep Space
    // =========================================================================
    interface Star {
      x: number;
      y: number;
      radius: number;
      baseAlpha: number;
      twinkleSpeed: number;
      phase: number;
      spectralColor: string;
      glowColor: string;
      tier: 'micro' | 'mid' | 'beacon';
      driftVx: number;
      driftVy: number;
      interactiveEnergy: number;
    }

    const nightSpectra = [
      { core: '#ffffff', glow: 'rgba(255, 255, 255, 0.40)' },
      { core: '#f8fafc', glow: 'rgba(224, 242, 254, 0.35)' },
      { core: '#ffffff', glow: 'rgba(255, 255, 255, 0.30)' },
      { core: '#fffdf5', glow: 'rgba(254, 243, 199, 0.28)' },
      { core: '#fef3c7', glow: 'rgba(251, 191, 36, 0.24)' },
    ];

    const stars: Star[] = [];
    const totalStarCount = 280;

    for (let i = 0; i < totalStarCount; i++) {
      let tier: 'micro' | 'mid' | 'beacon' = 'micro';
      let radius = Math.random() * 0.4 + 0.35;
      let baseAlpha = Math.random() * 0.35 + 0.25;

      if (i < 14) {
        tier = 'beacon';
        radius = Math.random() * 0.5 + 1.35;
        baseAlpha = Math.random() * 0.25 + 0.75;
      } else if (i < 70) {
        tier = 'mid';
        radius = Math.random() * 0.4 + 0.8;
        baseAlpha = Math.random() * 0.3 + 0.45;
      }

      const spec = nightSpectra[Math.floor(Math.random() * nightSpectra.length)];
      let sx = Math.random();
      let sy = Math.random();
      if (tier === 'micro' && Math.random() < 0.45) {
        const t = Math.random();
        sx = t;
        sy = (1 - t) * 0.85 + (Math.random() - 0.5) * 0.32;
        if (sy < 0) sy += 1;
        if (sy > 1) sy -= 1;
      }

      stars.push({
        x: sx,
        y: sy,
        radius,
        baseAlpha,
        twinkleSpeed: Math.random() * 0.016 + 0.006,
        phase: Math.random() * Math.PI * 2,
        spectralColor: spec.core,
        glowColor: spec.glow,
        tier,
        driftVx: (Math.random() - 0.5) * 0.000015,
        driftVy: (Math.random() - 0.5) * 0.000012 - 0.000005,
        interactiveEnergy: 0,
      });
    }

    interface CosmicDustMote {
      x: number;
      y: number;
      size: number;
      alpha: number;
      phase: number;
    }

    const galacticDust: CosmicDustMote[] = [];
    for (let d = 0; d < 180; d++) {
      const t = Math.random();
      const spread = (Math.random() - 0.5) * 0.28;
      galacticDust.push({
        x: t,
        y: Math.max(0, Math.min(1, (1 - t) * 0.82 + spread)),
        size: Math.random() * 0.45 + 0.3,
        alpha: Math.random() * 0.18 + 0.06,
        phase: Math.random() * Math.PI * 2,
      });
    }

    interface RealMeteor {
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      alpha: number;
      decay: number;
      active: boolean;
    }

    let activeMeteor: RealMeteor | null = null;
    let meteorCooldown = Math.random() * 1200 + 800;

    const triggerMeteor = () => {
      const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1);
      const speed = Math.random() * 8 + 14;
      activeMeteor = {
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * height * 0.35,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 70 + 60,
        alpha: 0.9,
        decay: 0.024,
        active: true,
      };
    };

    // =========================================================================
    // 2. DAY MODE ARCHITECTURE: Pinterest Inflight Cumulus Sky Engine
    // =========================================================================

    // Helper: Build a high-fidelity volumetric cloud sprite on an offscreen canvas
    const createOffscreenCloud = (
      type: 'cumulus-bank' | 'cumulus-tower' | 'cumulus-soft' | 'cirrus-wisp' | 'foreground-puff',
      w: number,
      h: number
    ): HTMLCanvasElement => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const oCtx = c.getContext('2d');
      if (!oCtx) return c;

      const numPuffs = type === 'cumulus-bank' ? 24 : type === 'cumulus-tower' ? 20 : type === 'cirrus-wisp' ? 12 : 14;

      // Seed puffs along an organic baseline
      for (let i = 0; i < numPuffs; i++) {
        let px = 0;
        let py = 0;
        let pr = 0;

        if (type === 'cumulus-bank') {
          const t = i / numPuffs;
          px = w * (0.15 + t * 0.7 + (Math.random() - 0.5) * 0.08);
          // Curve upwards in the center like a majestic cumulus head
          const arch = Math.sin(t * Math.PI);
          py = h * (0.65 - arch * 0.35 + (Math.random() - 0.5) * 0.12);
          pr = h * (0.28 + arch * 0.22 + Math.random() * 0.15);
        } else if (type === 'cumulus-tower') {
          const t = i / numPuffs;
          px = w * (0.3 + (Math.random() - 0.5) * 0.35);
          py = h * (0.75 - t * 0.5 + (Math.random() - 0.5) * 0.1);
          pr = h * (0.25 + (1 - t) * 0.2 + Math.random() * 0.1);
        } else if (type === 'cirrus-wisp') {
          const t = i / numPuffs;
          px = w * (0.1 + t * 0.8);
          py = h * (0.5 + (Math.random() - 0.5) * 0.15);
          pr = h * (0.15 + Math.random() * 0.18);
        } else {
          // Soft puff / Foreground
          px = w * (0.35 + (Math.random() - 0.5) * 0.3);
          py = h * (0.5 + (Math.random() - 0.5) * 0.2);
          pr = h * (0.32 + Math.random() * 0.15);
        }

        // Draw 3D illuminated soft puff:
        // Top highlight (facing sun), soft core, atmospheric shaded base
        const grad = oCtx.createRadialGradient(
          px - pr * 0.2, py - pr * 0.3, pr * 0.05,
          px, py, pr
        );

        if (type === 'cirrus-wisp') {
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
          grad.addColorStop(0.5, 'rgba(240, 248, 255, 0.30)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
          // Warm sunlight on peaks, pure white in heart, pale cerulean shadow underneath
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          grad.addColorStop(0.3, 'rgba(253, 254, 255, 0.88)');
          grad.addColorStop(0.65, 'rgba(235, 245, 255, 0.65)');
          grad.addColorStop(0.85, 'rgba(195, 222, 245, 0.35)');
          grad.addColorStop(1, 'rgba(224, 242, 254, 0)');
        }

        oCtx.fillStyle = grad;
        oCtx.beginPath();
        oCtx.arc(px, py, pr, 0, Math.PI * 2);
        oCtx.fill();
      }

      return c;
    };

    // Pre-render cloud sprites once for ultra-fast, smooth 60fps draw operations
    const cloudSprites = {
      bank: createOffscreenCloud('cumulus-bank', 800, 480),
      tower: createOffscreenCloud('cumulus-tower', 650, 440),
      soft: createOffscreenCloud('cumulus-soft', 550, 360),
      cirrus: createOffscreenCloud('cirrus-wisp', 700, 260),
      foreground: createOffscreenCloud('foreground-puff', 600, 380),
    };

    interface DayCloudInstance {
      sprite: HTMLCanvasElement;
      x: number; // 0..1 normalized base position
      y: number; // 0..1 normalized base position
      w: number; // base display width
      h: number; // base display height
      driftSpeed: number; // horizontal drift
      parallaxFactor: number; // depth response to pointer (0.05 to 0.45)
      alpha: number;
      phase: number;
      breathSpeed: number;
      breathScale: number;
      windOffset: number; // interactive wind perturbation
    }

    // Curated cloud landscape matching the Pinterest in-flight elevated composition:
    // Some distant majestic cumulus, some mid-level drifting billows, and soft foreground wisps
    const dayClouds: DayCloudInstance[] = [
      // High-altitude subtle cirrus wisps
      { sprite: cloudSprites.cirrus, x: 0.10, y: 0.08, w: 900, h: 320, driftSpeed: 0.00003, parallaxFactor: 0.04, alpha: 0.45, phase: 0.5, breathSpeed: 0.0006, breathScale: 0.02, windOffset: 0 },
      { sprite: cloudSprites.cirrus, x: 0.65, y: 0.15, w: 850, h: 300, driftSpeed: 0.00004, parallaxFactor: 0.05, alpha: 0.50, phase: 2.2, breathSpeed: 0.0007, breathScale: 0.02, windOffset: 0 },

      // Distant majestic cumulus shelf along the lower third (inflight horizon)
      { sprite: cloudSprites.bank, x: -0.10, y: 0.58, w: 1100, h: 620, driftSpeed: 0.00005, parallaxFactor: 0.10, alpha: 0.68, phase: 1.0, breathSpeed: 0.0008, breathScale: 0.03, windOffset: 0 },
      { sprite: cloudSprites.bank, x: 0.55, y: 0.62, w: 1200, h: 660, driftSpeed: 0.00004, parallaxFactor: 0.12, alpha: 0.72, phase: 3.4, breathSpeed: 0.0007, breathScale: 0.03, windOffset: 0 },

      // Mid-altitude sculpted cumulus billows
      { sprite: cloudSprites.tower, x: 0.12, y: 0.38, w: 750, h: 500, driftSpeed: 0.00008, parallaxFactor: 0.22, alpha: 0.78, phase: 1.8, breathSpeed: 0.0011, breathScale: 0.04, windOffset: 0 },
      { sprite: cloudSprites.soft, x: 0.72, y: 0.42, w: 700, h: 460, driftSpeed: 0.00007, parallaxFactor: 0.24, alpha: 0.75, phase: 4.1, breathSpeed: 0.0010, breathScale: 0.04, windOffset: 0 },

      // Gentle floating puffs that wander closer to view
      { sprite: cloudSprites.soft, x: 0.38, y: 0.24, w: 580, h: 380, driftSpeed: 0.00009, parallaxFactor: 0.28, alpha: 0.65, phase: 5.2, breathSpeed: 0.0012, breathScale: 0.03, windOffset: 0 },

      // Near/foreground atmospheric feathering (reacts strongly to interactive breeze & parallax)
      { sprite: cloudSprites.foreground, x: -0.05, y: 0.80, w: 1050, h: 620, driftSpeed: 0.00012, parallaxFactor: 0.42, alpha: 0.85, phase: 0.0, breathSpeed: 0.0014, breathScale: 0.05, windOffset: 0 },
      { sprite: cloudSprites.foreground, x: 0.45, y: 0.85, w: 1150, h: 680, driftSpeed: 0.00011, parallaxFactor: 0.45, alpha: 0.88, phase: 2.8, breathSpeed: 0.0013, breathScale: 0.05, windOffset: 0 },
    ];

    // =========================================================================
    // 3. FLOATING SUNLIGHT MOTES & INTERACTIVE SOLAR PARTICLES (Sun Dust)
    // =========================================================================
    interface SunDustMote {
      x: number; // 0..1
      y: number; // 0..1
      radius: number;
      alpha: number;
      baseAlpha: number;
      speedY: number;
      speedX: number;
      swayPhase: number;
      swaySpeed: number;
      color: string;
      glowColor: string;
    }

    const sunMotes: SunDustMote[] = [];
    const totalSunMotes = 50;
    const solarDustTints = [
      { core: '#ffffff', glow: 'rgba(255, 255, 255, 0.75)' },
      { core: '#fef3c7', glow: 'rgba(251, 191, 36, 0.50)' }, // Warm golden glint
      { core: '#fdf8f0', glow: 'rgba(254, 240, 138, 0.55)' },
      { core: '#e0f2fe', glow: 'rgba(186, 230, 253, 0.65)' }, // Celestial sky spark
    ];

    for (let m = 0; m < totalSunMotes; m++) {
      const tint = solarDustTints[Math.floor(Math.random() * solarDustTints.length)];
      sunMotes.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * 1.2 + 0.6,
        alpha: Math.random() * 0.45 + 0.3,
        baseAlpha: Math.random() * 0.45 + 0.3,
        speedX: (Math.random() - 0.5) * 0.00015,
        speedY: -(Math.random() * 0.00025 + 0.0001), // Gently ascends in warm thermal breeze
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.01,
        color: tint.core,
        glowColor: tint.glow,
      });
    }

    // Interactive dispersion particles spawned on touch/click
    interface InteractivePulse {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      color: string;
    }

    const pulses: InteractivePulse[] = [];

    interface InteractiveDustSpark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
      color: string;
    }

    const daySparks: InteractiveDustSpark[] = [];

    // =========================================================================
    // 4. INTERACTION TRACKING: Smooth Parallax, Wind Impulse, and Touch Waves
    // =========================================================================
    let targetPointerNormX = 0.5;
    let targetPointerNormY = 0.3;
    let pointerNormX = 0.5;
    let pointerNormY = 0.3;
    let pointerPixelX = -1000;
    let pointerPixelY = -1000;
    let lastMoveTime = 0;
    let windImpulseX = 0;
    let windImpulseY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const now = performance.now();
      const dt = Math.max(1, now - lastMoveTime);
      lastMoveTime = now;

      // Calculate movement delta for interactive wind impulse
      if (pointerPixelX > 0) {
        const dX = (clientX - pointerPixelX) / width;
        const dY = (clientY - pointerPixelY) / height;
        const velocity = Math.sqrt(dX * dX + dY * dY) / (dt * 0.001);
        
        // Gentle aerodynamical wind push
        windImpulseX += dX * Math.min(2.5, velocity * 0.15);
        windImpulseY += dY * Math.min(2.5, velocity * 0.15);

        // Perturb clouds near cursor
        dayClouds.forEach((cloud) => {
          const cpx = cloud.x * width;
          const cpy = cloud.y * height;
          const dist = Math.hypot(clientX - cpx, clientY - cpy);
          if (dist < 320) {
            const push = (1 - dist / 320) * 0.02 * (dX > 0 ? 1 : -1);
            cloud.windOffset = Math.max(-40, Math.min(40, cloud.windOffset + push * 80));
          }
        });

        // Spawn delicate sun motes along cursor wake (sparse, elegant)
        if (!isDark && Math.random() < 0.35) {
          daySparks.push({
            x: clientX + (Math.random() - 0.5) * 12,
            y: clientY + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 0.6 + dX * 25,
            vy: (Math.random() - 0.5) * 0.6 - 0.4,
            size: Math.random() * 1.4 + 0.8,
            alpha: 0.8,
            life: 0,
            maxLife: Math.random() * 30 + 35,
            color: Math.random() < 0.6 ? '#ffffff' : '#fef08a',
          });
        }
      }

      pointerPixelX = clientX;
      pointerPixelY = clientY;
      targetPointerNormX = clientX / width;
      targetPointerNormY = clientY / height;

      // Excite stars in Night mode
      if (isDark) {
        stars.forEach((star) => {
          const dx = (star.x - targetPointerNormX) * width;
          const dy = (star.y - targetPointerNormY) * height;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            const power = 1 - dist / 140;
            star.interactiveEnergy = Math.min(1.4, star.interactiveEnergy + power * 0.4);
          }
        });
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      pointerPixelX = clientX;
      pointerPixelY = clientY;
      targetPointerNormX = clientX / width;
      targetPointerNormY = clientY / height;

      if (!isDark) {
        // Celestial Breath Pulse: expanding luminous shockwave through the atmosphere
        pulses.push({
          x: clientX,
          y: clientY,
          radius: 10,
          maxRadius: Math.min(width, height) * 0.45,
          alpha: 0.55,
          color: 'rgba(255, 255, 255,',
        });

        // Disperse dancing sun crystals
        for (let k = 0; k < 12; k++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 1.8 + 0.6;
          daySparks.push({
            x: clientX,
            y: clientY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.5,
            size: Math.random() * 1.6 + 0.9,
            alpha: 0.9,
            life: 0,
            maxLife: Math.random() * 35 + 45,
            color: Math.random() < 0.5 ? '#ffffff' : '#fef3c7',
          });
        }
      } else {
        // Night mode touch burst
        stars.forEach((star) => {
          const dx = (star.x - targetPointerNormX) * width;
          const dy = (star.y - targetPointerNormY) * height;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            const power = 1 - dist / 180;
            star.interactiveEnergy = Math.min(1.6, star.interactiveEnergy + power * 0.75);
          }
        });
      }
    };

    const handlePointerLeave = () => {
      targetPointerNormX = 0.5;
      targetPointerNormY = 0.3;
      pointerPixelX = -1000;
      pointerPixelY = -1000;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchstart', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);

    // =========================================================================
    // 5. MAIN ANIMATION & COMPOSITING LOOP
    // =========================================================================
    let globalTime = 0;

    const render = () => {
      globalTime += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Smooth pointer interpolation for liquid parallax feel
      pointerNormX += (targetPointerNormX - pointerNormX) * 0.045;
      pointerNormY += (targetPointerNormY - pointerNormY) * 0.045;

      // Dampen wind impulses smoothly back to peaceful equilibrium
      windImpulseX *= 0.94;
      windImpulseY *= 0.94;

      if (!isDark) {
        // ---------------------------------------------------------------------
        // DAY MODE: INFLIGHT EXPERIENCE ELEVATED CELESTIAL SKY (Stefan Poulos / Pinterest)
        // ---------------------------------------------------------------------

        // Base Celestial Sky Gradient (#3c73a5 atmospheric model)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#2e6aa0');   // Deep serene cerulean zenith
        skyGrad.addColorStop(0.28, '#4182b8'); // Majestic high-altitude sky
        skyGrad.addColorStop(0.55, '#68a4d4'); // Soft sunlit mid-sky
        skyGrad.addColorStop(0.80, '#b6dbf5'); // Soft daylight baby blue
        skyGrad.addColorStop(0.96, '#e2f1fc'); // Luminous horizon mist
        skyGrad.addColorStop(1, '#f1f8fd');    // Clean pearlescent base
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Volumetric Sun Position (Upper Right with subtle parallax)
        const sunX = width * 0.82 + (pointerNormX - 0.5) * -18;
        const sunY = height * 0.14 + (pointerNormY - 0.3) * -12;

        // Radiant Sun Glow & Volumetric Atmospheric Corona
        ctx.save();
        const sunCorona = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, Math.min(width, height) * 0.55);
        sunCorona.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        sunCorona.addColorStop(0.12, 'rgba(254, 249, 215, 0.60)'); // Warm solar pearl
        sunCorona.addColorStop(0.35, 'rgba(224, 242, 254, 0.35)'); // Celestial sky blend
        sunCorona.addColorStop(0.70, 'rgba(186, 230, 253, 0.15)');
        sunCorona.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sunCorona;
        ctx.beginPath();
        ctx.arc(sunX, sunY, Math.min(width, height) * 0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Dynamic Crepuscular Rays (God Rays / Rayos Celestiales)
        // Gently swing angle as user moves across the heavens
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const numRays = 7;
        const baseRayAngle = Math.PI * 0.72; // Streaming down-left across canvas
        const rayAngleSway = (pointerNormX - 0.5) * 0.12 + Math.sin(globalTime * 0.4) * 0.04;

        for (let r = 0; r < numRays; r++) {
          const rayOffset = (r - (numRays - 1) / 2) * 0.16;
          const rayAngle = baseRayAngle + rayOffset + rayAngleSway;
          const rayLength = Math.max(width, height) * 1.2;
          const rayBreadth = (0.09 + Math.sin(globalTime * 0.5 + r) * 0.02) * width;
          const rayAlpha = (0.09 + Math.sin(globalTime * 0.8 + r * 1.5) * 0.035) * (0.8 + pointerNormY * 0.3);

          ctx.save();
          ctx.translate(sunX, sunY);
          ctx.rotate(rayAngle);

          const rayGrad = ctx.createLinearGradient(0, 0, rayLength, 0);
          rayGrad.addColorStop(0, `rgba(255, 255, 255, ${rayAlpha * 1.5})`);
          rayGrad.addColorStop(0.25, `rgba(254, 243, 199, ${rayAlpha * 0.8})`);
          rayGrad.addColorStop(0.7, `rgba(224, 242, 254, ${rayAlpha * 0.3})`);
          rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(rayLength, -rayBreadth * 0.5);
          ctx.lineTo(rayLength, rayBreadth * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();

        // Interactive Breath Pulse Waves (on touch/click)
        for (let pIdx = pulses.length - 1; pIdx >= 0; pIdx--) {
          const p = pulses[pIdx];
          p.radius += 4.5;
          p.alpha *= 0.94;

          if (p.alpha <= 0.01 || p.radius >= p.maxRadius) {
            pulses.splice(pIdx, 1);
            continue;
          }

          ctx.save();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = `${p.color} ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Soft inner wash
          ctx.fillStyle = `${p.color} ${p.alpha * 0.18})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Render Multi-Layer Procedural Cumulus & Cirrus Clouds
        dayClouds.forEach((cloud) => {
          // Autonomous organic drift across sky
          cloud.x += cloud.driftSpeed + windImpulseX * 0.0003;
          if (cloud.x > 1.25) cloud.x = -0.35;
          if (cloud.x < -0.35) cloud.x = 1.25;

          // Gentle breathing scale (Selah / Calm)
          cloud.phase += cloud.breathSpeed * 60;
          const currentBreath = 1 + Math.sin(cloud.phase) * cloud.breathScale;

          // Parallax displacement based on pointer position and depth tier
          const parallaxX = (pointerNormX - 0.5) * -1 * (cloud.parallaxFactor * 140);
          const parallaxY = (pointerNormY - 0.3) * -1 * (cloud.parallaxFactor * 80);

          // Dampen cloud wind offset
          cloud.windOffset *= 0.97;

          const renderX = cloud.x * width + parallaxX + cloud.windOffset;
          const renderY = cloud.y * height + parallaxY;
          const renderW = cloud.w * currentBreath;
          const renderH = cloud.h * currentBreath;

          ctx.save();
          ctx.globalAlpha = Math.min(1, cloud.alpha);
          ctx.drawImage(cloud.sprite, renderX - renderW * 0.5, renderY - renderH * 0.5, renderW, renderH);
          ctx.restore();
        });

        // Render Floating Sun Dust Motes (Golden & Pearlescent Particles)
        ctx.save();
        sunMotes.forEach((mote) => {
          mote.x += mote.speedX + windImpulseX * 0.0006;
          mote.y += mote.speedY + windImpulseY * 0.0004;

          if (mote.y < -0.05) mote.y = 1.05;
          if (mote.x < -0.05) mote.x = 1.05;
          if (mote.x > 1.05) mote.x = -0.05;

          mote.swayPhase += mote.swaySpeed;
          const swayX = Math.sin(mote.swayPhase) * 0.0005 * width;
          const px = mote.x * width + swayX + (pointerNormX - 0.5) * -15;
          const py = mote.y * height + (pointerNormY - 0.3) * -10;

          // Subtle twinkle
          const twinkle = 0.8 + Math.sin(mote.swayPhase * 1.5) * 0.2;
          const curAlpha = mote.alpha * twinkle;

          // Halo
          const halo = ctx.createRadialGradient(px, py, 0, px, py, mote.radius * 3.5);
          halo.addColorStop(0, mote.glowColor);
          halo.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(px, py, mote.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Core
          ctx.globalAlpha = curAlpha;
          ctx.fillStyle = mote.color;
          ctx.beginPath();
          ctx.arc(px, py, mote.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // Render Interactive Day Wake Sparks
        for (let sIdx = daySparks.length - 1; sIdx >= 0; sIdx--) {
          const sp = daySparks[sIdx];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vx *= 0.96;
          sp.vy *= 0.96;
          sp.life++;

          const progress = sp.life / sp.maxLife;
          const alpha = sp.alpha * (1 - progress);

          if (progress >= 1 || alpha <= 0.01) {
            daySparks.splice(sIdx, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = sp.color;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size * (1 - progress * 0.25), 0, Math.PI * 2);
          ctx.fill();

          // Subtle sun glint
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(sp.x - sp.size * 2, sp.y);
          ctx.lineTo(sp.x + sp.size * 2, sp.y);
          ctx.moveTo(sp.x, sp.y - sp.size * 2);
          ctx.lineTo(sp.x, sp.y + sp.size * 2);
          ctx.stroke();
          ctx.restore();
        }

      } else {
        // ---------------------------------------------------------------------
        // NIGHT MODE: REAL DEEP ASTRONOMICAL SPACE & MILKY WAY
        // ---------------------------------------------------------------------
        const spaceGrad = ctx.createLinearGradient(0, 0, 0, height);
        spaceGrad.addColorStop(0, '#010306');
        spaceGrad.addColorStop(0.35, '#02050c');
        spaceGrad.addColorStop(0.70, '#030713');
        spaceGrad.addColorStop(1, '#010307');
        ctx.fillStyle = spaceGrad;
        ctx.fillRect(0, 0, width, height);

        // Milky Way Galactic Band
        ctx.save();
        const mwGrad = ctx.createLinearGradient(width * 0.15, 0, width * 0.85, height);
        mwGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        mwGrad.addColorStop(0.38, 'rgba(224, 242, 254, 0.025)');
        mwGrad.addColorStop(0.50, 'rgba(240, 249, 255, 0.045)');
        mwGrad.addColorStop(0.62, 'rgba(204, 251, 241, 0.022)');
        mwGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = mwGrad;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        // Galactic Sub-Pixel Micro-Dust
        ctx.save();
        ctx.fillStyle = '#ffffff';
        galacticDust.forEach((mote) => {
          mote.phase += 0.008;
          const currentA = mote.alpha * (0.8 + Math.sin(mote.phase) * 0.2);
          ctx.globalAlpha = currentA;
          ctx.beginPath();
          ctx.arc(mote.x * width, mote.y * height, mote.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // Multi-Magnitude Starfield
        stars.forEach((star) => {
          star.x += star.driftVx;
          star.y += star.driftVy;
          if (star.x < 0) star.x += 1;
          if (star.x > 1) star.x -= 1;
          if (star.y < 0) star.y += 1;
          if (star.y > 1) star.y -= 1;

          star.phase += star.twinkleSpeed;
          const scintillation = Math.sin(star.phase);
          const alpha = Math.max(
            0.15,
            Math.min(1, star.baseAlpha + scintillation * 0.22 + star.interactiveEnergy * 0.35)
          );

          if (star.interactiveEnergy > 0) {
            star.interactiveEnergy *= 0.94;
            if (star.interactiveEnergy < 0.01) star.interactiveEnergy = 0;
          }

          const sx = star.x * width;
          const sy = star.y * height;
          const effectiveRadius = star.radius * (1 + star.interactiveEnergy * 0.5);

          ctx.save();
          ctx.translate(sx, sy);

          if (star.tier === 'beacon' || star.interactiveEnergy > 0.3) {
            const haloR = effectiveRadius * (star.tier === 'beacon' ? 6.0 : 4.0);
            const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, haloR);
            halo.addColorStop(0, star.glowColor);
            halo.addColorStop(0.35, star.glowColor.replace(/[\d.]+\)$/, `${(alpha * 0.25).toFixed(2)})`));
            halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(0, 0, haloR, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.globalAlpha = Math.min(1, alpha);
          ctx.fillStyle = star.spectralColor;
          ctx.beginPath();
          ctx.arc(0, 0, effectiveRadius, 0, Math.PI * 2);
          ctx.fill();

          if (star.tier !== 'micro') {
            ctx.globalAlpha = Math.min(1, alpha * 1.3);
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(0.35, effectiveRadius * 0.45), 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        });

        // Falling Meteor
        meteorCooldown--;
        if (meteorCooldown <= 0 && !activeMeteor) {
          triggerMeteor();
          meteorCooldown = Math.random() * 1400 + 900;
        }

        if (activeMeteor && activeMeteor.active) {
          const m = activeMeteor;
          m.x += m.vx;
          m.y += m.vy;
          m.alpha -= m.decay;

          if (m.alpha <= 0 || m.x > width + 50 || m.y > height + 50) {
            m.active = false;
            activeMeteor = null;
          } else {
            const headLength = m.length;
            const speedMag = Math.hypot(m.vx, m.vy);
            const dirX = m.vx / speedMag;
            const dirY = m.vy / speedMag;
            const tailX = m.x - dirX * headLength;
            const tailY = m.y - dirY * headLength;

            ctx.save();
            const streak = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
            streak.addColorStop(0, 'rgba(255, 255, 255, 0)');
            streak.addColorStop(0.7, `rgba(224, 242, 254, ${m.alpha * 0.5})`);
            streak.addColorStop(1, `rgba(255, 255, 255, ${m.alpha * 0.95})`);

            ctx.strokeStyle = streak;
            ctx.lineWidth = 1.0;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = m.alpha;
            ctx.beginPath();
            ctx.arc(m.x, m.y, 1.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchstart', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [isDark]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh',
        }}
        aria-hidden="true"
      />

      {/* Discreet, elegant interactive sky hint for Day Mode that fades smoothly */}
      {showHint && !isDark && (
        <div 
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-1000 ease-out"
          style={{ opacity: showHint ? 0.9 : 0 }}
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wide shadow-md backdrop-blur-md bg-white/75 text-sky-900 border border-sky-200/60 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
            <span>Cielo Diurno Vivo • Mueve o desliza para sentir la brisa</span>
          </div>
        </div>
      )}
    </>
  );
});

CelestialAtmosphere.displayName = 'CelestialAtmosphere';
export default CelestialAtmosphere;
