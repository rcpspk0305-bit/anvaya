/**
 * Golden Solar Stardust Canvas Engine
 * Radiant sun motes, floating embers, and shimmering golden solar streaks
 * Harmonizing with the sunlight in the ancient banyan tree
 */
export function initStarfield(canvasId = 'starfield-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animationFrameId;
  let isVisible = true;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  const moteCount = window.innerWidth < 768 ? 35 : 75;
  const motes = [];
  const colorMap = {
    gold: 'rgba(245, 158, 11,',
    amber: 'rgba(217, 119, 6,',
    champagne: 'rgba(254, 240, 138,',
    solarWhite: 'rgba(255, 253, 245,'
  };

  for (let i = 0; i < moteCount; i++) {
    const rand = Math.random();
    const type = rand < 0.45 ? 'gold' : rand < 0.75 ? 'champagne' : rand < 0.9 ? 'amber' : 'solarWhite';
    motes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.4 + 0.8,
      alpha: Math.random() * 0.55 + 0.25,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -Math.random() * 0.35 - 0.1, // gently rising like warm solar embers
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulsePhase: Math.random() * Math.PI * 2,
      colorType: type
    });
  }

  // Golden Sunflare Streak
  let flare = {
    x: 0,
    y: 0,
    length: 120,
    speed: 12,
    angle: Math.PI / 4,
    opacity: 0,
    active: false
  };
  let flareTimer = 0;

  const triggerFlare = () => {
    if (prefersReducedMotion) return;
    flare.x = Math.random() * (canvas.width * 0.7);
    flare.y = Math.random() * (canvas.height * 0.4);
    flare.length = Math.random() * 90 + 90;
    flare.speed = Math.random() * 8 + 10;
    flare.opacity = 1;
    flare.active = true;
  };

  const drawCrossFlare = (x, y, radius, alpha) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.8})`;
    ctx.lineWidth = 0.8;

    ctx.beginPath();
    ctx.moveTo(-radius * 2.5, 0);
    ctx.lineTo(radius * 2.5, 0);
    ctx.moveTo(0, -radius * 2.5);
    ctx.lineTo(0, radius * 2.5);
    ctx.stroke();

    ctx.restore();
  };

  const render = () => {
    if (!isVisible) {
      animationFrameId = requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Solar Motes
    for (let i = 0; i < motes.length; i++) {
      const s = motes[i];
      s.pulsePhase += s.pulseSpeed;
      const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.pulsePhase));

      s.x += s.speedX;
      s.y += s.speedY;

      if (s.y < -10) s.y = canvas.height + 10;
      if (s.x > canvas.width + 10) s.x = -10;
      else if (s.x < -10) s.x = canvas.width + 10;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `${colorMap[s.colorType]}${currentAlpha})`;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
      ctx.shadowBlur = s.size * 3;
      ctx.fill();

      // Shimmer flare on large motes
      if (s.size > 2.2 && currentAlpha > 0.4) {
        drawCrossFlare(s.x, s.y, s.size, currentAlpha);
      }
    }

    // Solar flare streak
    flareTimer++;
    if (flareTimer > 320 && Math.random() < 0.02) {
      triggerFlare();
      flareTimer = 0;
    }

    if (flare.active) {
      flare.x += Math.cos(flare.angle) * flare.speed;
      flare.y += Math.sin(flare.angle) * flare.speed;
      flare.opacity -= 0.015;

      const tailX = flare.x - Math.cos(flare.angle) * flare.length;
      const tailY = flare.y - Math.sin(flare.angle) * flare.length;

      const grad = ctx.createLinearGradient(tailX, tailY, flare.x, flare.y);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0)');
      grad.addColorStop(0.7, `rgba(254, 240, 138, ${flare.opacity * 0.7})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${flare.opacity})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(flare.x, flare.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
      ctx.shadowBlur = 8;
      ctx.stroke();

      if (flare.opacity <= 0 || flare.x > canvas.width || flare.y > canvas.height) {
        flare.active = false;
      }
    }

    animationFrameId = requestAnimationFrame(render);
  };

  render();

  return () => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationFrameId);
  };
}
