/**
 * Festive Canvas Confetti Engine
 * Royal Golden & Champagne Foil Particle Physics
 */
export function fireConfetti(options = {}) {
  const count = options.particleCount || 95;
  const colors = options.colors || ['#F59E0B', '#FBBF24', '#FDE047', '#FEF08A', '#D97706', '#EA580C', '#FFFDF7', '#B45309'];
  
  let canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const particles = [];
  const originX = options.origin?.x !== undefined ? options.origin.x * canvas.width : canvas.width * 0.5;
  const originY = options.origin?.y !== undefined ? options.origin.y * canvas.height : canvas.height * 0.75;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI / 180) * (options.angle || (270 + (Math.random() - 0.5) * 80));
    const speed = Math.random() * 22 + 14;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.5,
      friction: 0.94,
      wobble: Math.random() * 10,
      wobbleSpeed: 0.1,
      size: Math.random() * 9 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.01
    });
  }

  let animId;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.alpha <= 0) continue;
      alive++;

      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      p.wobble += p.wobbleSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.wobble);
      ctx.scale(Math.cos(p.wobble), 1);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      ctx.restore();
    }

    if (alive > 0) {
      animId = requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animId);
    }
  }

  update();
}
