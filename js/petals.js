/**
 * ANVAYA 2K26 - Golden Autumn Falling Leaves Engine
 * Realistic 3D fluttering golden leaves that swirl and fall dynamically on scroll
 * Perfectly harmonized with the ancient golden banyan tree background.
 */
export function initPetals(canvasId = 'petals-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animationFrameId;
  let isVisible = true;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // DPR for crisp rendering on high-res displays
  let dpr = 1;
  let width = window.innerWidth;
  let height = window.innerHeight;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  };
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  // Autumn Palette Palettes
  const LEAF_PALETTES = [
    {
      // 1. Radiant Amber Gold
      primary: '#FBBF24',
      secondary: '#F59E0B',
      dark: '#B45309',
      highlight: '#FEF08A',
      back: '#FDE68A',
      stem: '#78350F',
      glow: 'rgba(245, 158, 11, 0.45)'
    },
    {
      // 2. Sunburst Canary Yellow
      primary: '#FDE047',
      secondary: '#EAB308',
      dark: '#CA8A04',
      highlight: '#FEF9C3',
      back: '#FEF08A',
      stem: '#713F12',
      glow: 'rgba(234, 179, 8, 0.4)'
    },
    {
      // 3. Golden Honey & Topaz
      primary: '#F59E0B',
      secondary: '#D97706',
      dark: '#92400E',
      highlight: '#FFFBEB',
      back: '#FCD34D',
      stem: '#451A03',
      glow: 'rgba(217, 119, 6, 0.45)'
    },
    {
      // 4. Sunset Bronze Gold
      primary: '#F97316',
      secondary: '#EA580C',
      dark: '#9A3412',
      highlight: '#FED7AA',
      back: '#FDBA74',
      stem: '#7C2D12',
      glow: 'rgba(249, 115, 22, 0.35)'
    }
  ];

  // Leaf factory
  function createLeaf(spawnAtTop = false) {
    const palette = LEAF_PALETTES[Math.floor(Math.random() * LEAF_PALETTES.length)];
    const leafType = Math.floor(Math.random() * 3); // 0: Oval Banyan, 1: Pointed Elm, 2: Flutter Birch
    const depth = 0.5 + Math.random() * 0.7; // 0.5 to 1.2
    const size = (14 + Math.random() * 16) * depth;

    return {
      x: Math.random() * width,
      y: spawnAtTop ? -size * 2 - Math.random() * 80 : Math.random() * height,
      size,
      depth,
      leafType,
      palette,
      // Base falling velocity
      speedY: (0.7 + Math.random() * 1.1) * depth,
      speedX: (Math.random() - 0.5) * 0.6,
      // 3D physics & fluttering oscillations
      oscillationPhase: Math.random() * Math.PI * 2,
      oscillationSpeed: 0.018 + Math.random() * 0.022,
      swayWidth: 1.2 + Math.random() * 2.2,
      // Rotations: Roll (2D angle), Pitch (3D tumble flip), Yaw (3D side sway)
      roll: Math.random() * Math.PI * 2,
      rollSpeed: (Math.random() - 0.5) * 0.025,
      pitch: Math.random() * Math.PI * 2,
      pitchSpeed: 0.02 + Math.random() * 0.035,
      yaw: Math.random() * Math.PI * 2,
      yawSpeed: 0.015 + Math.random() * 0.025,
      opacity: 0.82 + Math.random() * 0.18,
      isScrollSpawned: spawnAtTop
    };
  }

  const isMobile = width < 768;
  const baseCount = prefersReducedMotion ? 0 : isMobile ? 14 : 26;
  const maxLeaves = isMobile ? 45 : 75;
  const leaves = [];

  for (let i = 0; i < baseCount; i++) {
    leaves.push(createLeaf(false));
  }

  // Draw realistic organic leaf geometry
  function drawLeaf(leaf) {
    const { size, palette, leafType, roll, pitch, yaw, depth, opacity } = leaf;

    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(roll);

    // 3D Perspective Scaling
    const cosPitch = Math.cos(pitch);
    const cosYaw = Math.cos(yaw);
    const isBackSide = cosPitch < 0;

    // Apply scale for 3D flip (cosPitch controls flattening/flip, cosYaw controls width sway)
    ctx.scale(Math.max(0.18, Math.abs(cosYaw)), Math.max(0.12, Math.abs(cosPitch)));
    ctx.globalAlpha = opacity * (isBackSide ? 0.8 : 1.0);

    // Glowing aura matching autumn sunburst
    ctx.shadowColor = palette.glow;
    ctx.shadowBlur = 6 * depth;

    // Gradient shading
    const grad = ctx.createLinearGradient(0, -size, size * 0.4, size);
    if (!isBackSide) {
      grad.addColorStop(0, palette.highlight);
      grad.addColorStop(0.35, palette.primary);
      grad.addColorStop(0.8, palette.secondary);
      grad.addColorStop(1, palette.dark);
    } else {
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.4, palette.back);
      grad.addColorStop(1, palette.secondary);
    }
    ctx.fillStyle = grad;

    // Draw leaf based on type
    ctx.beginPath();
    if (leafType === 0) {
      // Oval Banyan Autumn Leaf
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.75, -size * 0.5, size * 0.7, size * 0.55, 0, size);
      ctx.bezierCurveTo(-size * 0.7, size * 0.55, -size * 0.75, -size * 0.5, 0, -size);
    } else if (leafType === 1) {
      // Pointed Golden Elm Leaf
      ctx.moveTo(0, -size * 1.1);
      ctx.bezierCurveTo(size * 0.85, -size * 0.45, size * 0.5, size * 0.65, 0, size);
      ctx.bezierCurveTo(-size * 0.5, size * 0.65, -size * 0.85, -size * 0.45, 0, -size * 1.1);
    } else {
      // Fluttering Birch Leaf (slight wavy profile)
      ctx.moveTo(0, -size * 1.05);
      ctx.bezierCurveTo(size * 0.8, -size * 0.6, size * 0.85, 0, size * 0.4, size * 0.6);
      ctx.bezierCurveTo(size * 0.2, size * 0.85, 0, size * 0.95, 0, size);
      ctx.bezierCurveTo(0, size * 0.95, -size * 0.2, size * 0.85, -size * 0.4, size * 0.6);
      ctx.bezierCurveTo(-size * 0.85, 0, -size * 0.8, -size * 0.6, 0, -size * 1.05);
    }
    ctx.closePath();
    ctx.fill();

    // Central Vein and Stem
    ctx.shadowBlur = 0;
    ctx.strokeStyle = isBackSide ? 'rgba(255, 255, 255, 0.5)' : palette.stem;
    ctx.lineWidth = Math.max(0.7, 1.2 * depth);
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.85);
    ctx.lineTo(0, size * 1.18); // stem protruding past base
    ctx.stroke();

    // Subtle side veins
    if (depth > 0.7) {
      ctx.strokeStyle = isBackSide ? 'rgba(255, 255, 255, 0.25)' : 'rgba(120, 53, 15, 0.35)';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      // 3 pairs of angled veins
      for (let v = -0.4; v <= 0.4; v += 0.35) {
        const vy = size * v;
        ctx.moveTo(0, vy);
        ctx.lineTo(size * 0.35, vy - size * 0.18);
        ctx.moveTo(0, vy);
        ctx.lineTo(-size * 0.35, vy - size * 0.18);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  // Scroll Tracking & Dynamics
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let scrollVelocity = 0;
  let leavesToSpawn = 0;

  const onScroll = () => {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const delta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    const absDelta = Math.abs(delta);
    if (absDelta > 1) {
      // Boost downward velocity on scroll
      scrollVelocity += Math.min(absDelta * 0.25, 12);
      if (scrollVelocity > 22) scrollVelocity = 22;

      // Queue new leaves to cascade down during scroll
      leavesToSpawn += Math.min(4, Math.ceil(absDelta / 12));
    }

    // Parallax update for background tree wallpaper
    const bgImage = document.getElementById('site-bg-image');
    if (bgImage) {
      const offset = currentScrollY * 0.05;
      bgImage.style.transform = `translate3d(0, ${offset}px, 0) scale(1.04)`;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Also listen for mouse wheel and touch gesture velocity
  window.addEventListener('wheel', (e) => {
    const delta = Math.abs(e.deltaY);
    if (delta > 2) {
      scrollVelocity += Math.min(delta * 0.06, 6);
      leavesToSpawn += 1;
    }
  }, { passive: true });

  window.addEventListener('touchmove', () => {
    scrollVelocity += 1.5;
    leavesToSpawn += 1;
  }, { passive: true });

  // Main Animation Loop
  const render = () => {
    if (!isVisible) {
      animationFrameId = requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Smooth scroll velocity decay
    scrollVelocity *= 0.93;
    if (scrollVelocity < 0.01) scrollVelocity = 0;

    // Spawn queued leaves from canopy at top
    if (leavesToSpawn > 0 && leaves.length < maxLeaves) {
      const spawnCount = Math.min(leavesToSpawn, 2);
      for (let s = 0; s < spawnCount; s++) {
        leaves.push(createLeaf(true));
      }
      leavesToSpawn -= spawnCount;
    }

    // Update & draw leaves
    for (let i = leaves.length - 1; i >= 0; i--) {
      const p = leaves[i];

      // Oscillations
      p.oscillationPhase += p.oscillationSpeed * (1 + scrollVelocity * 0.04);
      p.roll += p.rollSpeed * (1 + scrollVelocity * 0.06);
      p.pitch += p.pitchSpeed * (1 + scrollVelocity * 0.08);
      p.yaw += p.yawSpeed * (1 + scrollVelocity * 0.06);

      // Downward velocity boosted by scroll velocity
      const fallSpeed = (p.speedY + scrollVelocity * 0.65) * p.depth;
      p.y += fallSpeed;

      // Horizontal sway + wind drift
      const horizontalSway = Math.sin(p.oscillationPhase) * p.swayWidth + p.speedX;
      p.x += horizontalSway + (scrollVelocity * 0.08 * Math.sin(p.roll));

      // Wrap or recycle leaves when off-screen
      if (p.y > height + 60) {
        if (leaves.length > baseCount) {
          // Extra scroll-spawned leaves are pruned to maintain clean performance
          leaves.splice(i, 1);
          continue;
        } else {
          // Base leaves recycle back to the top
          p.y = -p.size * 2 - Math.random() * 40;
          p.x = Math.random() * width;
        }
      }

      // Horizontal wrap
      if (p.x > width + 50) p.x = -50;
      else if (p.x < -50) p.x = width + 50;

      drawLeaf(p);
    }

    animationFrameId = requestAnimationFrame(render);
  };

  render();

  return () => {
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(animationFrameId);
  };
}
