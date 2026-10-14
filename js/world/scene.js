/**
 * The moon-and-city scene from the artwork, rebuilt as living layers on one 2D canvas.
 *
 * Geometry is anchored to the on-screen ANVAYA wordmark (intro, hero and finale each pass their
 * own wordmark element), using the proportions measured from the official artwork: the moon sits
 * behind the "A", the skyline rises from the shoreline that runs through the letters, and the water
 * below reflects both. Each layer has a depth used for pointer parallax and for the camera dolly
 * of the "Enter ANVAYA" transition.
 */
(function (A) {
  'use strict';
  const { clamp, lerp, ease, pointer } = A.util;
  const TAU = Math.PI * 2;

  /* ---------------- deterministic noise ---------------- */
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  }
  function valueNoise(seed) {
    const r = rng(seed);
    const p = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    const perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
    const vals = new Float32Array(256).map(() => r());
    return (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y);
      const xf = x - xi, yf = y - yi;
      const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      const X = xi & 255, Y = yi & 255, X1 = (xi + 1) & 255, Y1 = (yi + 1) & 255;
      const a = vals[perm[X + perm[Y]]], b = vals[perm[X1 + perm[Y]]];
      const c = vals[perm[X + perm[Y1]]], d = vals[perm[X1 + perm[Y1]]];
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };
  }
  const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const mix3 = (c1, c2, t) => [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];

  /* ---------------- moon texture (built once) ---------------- */
  function buildMoon() {
    const S = 512, R = S / 2 - 2;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const g = c.getContext('2d');
    const img = g.createImageData(S, S);
    const n1 = valueNoise(3), n2 = valueNoise(11), n3 = valueNoise(29);
    const ivory = [250, 236, 204], gold = [226, 178, 116], amber = [190, 128, 82];
    const teal = [96, 156, 146], burg = [150, 64, 88];
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const dx = (x - S / 2) / R, dy = (y - S / 2) / R;
        const d2 = dx * dx + dy * dy;
        const i = (y * S + x) * 4;
        if (d2 > 1.02) { img.data[i + 3] = 0; continue; }
        const nz = Math.sqrt(Math.max(0, 1 - d2));
        const lam = clamp(0.3 + 0.75 * (-0.5 * dx - 0.38 * dy + 0.78 * nz));
        const f = n1(x / 46, y / 46) * 0.5 + n1(x / 19, y / 19) * 0.3 + n1(x / 7, y / 7) * 0.2;
        let col = mix3(mix3(amber, gold, sstep(0.05, 0.6, lam)), ivory, sstep(0.55, 1, lam));
        const tp = sstep(0.48, 0.72, n2(x / 70, y / 70) * 0.7 + f * 0.3) * sstep(-0.35, 0.6, dx);
        const bp = sstep(0.52, 0.78, n3(x / 55, y / 55) * 0.7 + f * 0.3) * sstep(-0.2, 0.75, dx * 0.6 + dy * 0.5);
        col = mix3(col, teal, tp * 0.62);
        col = mix3(col, burg, bp * 0.5);
        // fine mosaic crackle, like the moon in the artwork
        const cr = Math.abs(n1(x / 8 + 40, y / 8 - 12) - 0.5) < 0.025 ? 0.86 : 1;
        const k = (0.84 + 0.3 * f) * (0.72 + 0.28 * nz) * cr;
        img.data[i] = clamp(col[0] * k, 0, 255);
        img.data[i + 1] = clamp(col[1] * k, 0, 255);
        img.data[i + 2] = clamp(col[2] * k, 0, 255);
        img.data[i + 3] = 255 * clamp((1 - Math.sqrt(d2)) * R * 0.9);
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }

  /* ---------------- skyline (normalised, generated once) ---------------- */
  function genSkyline(seed, count, envelope, opts) {
    const r = rng(seed);
    const out = [];
    let x = 0;
    for (let i = 0; i < count && x < 1; i++) {
      const w = opts.minW + r() * (opts.maxW - opts.minW);
      const env = envelope(x + w / 2);
      const h = clamp(env * (0.55 + r() * 0.5), 0.06, 1);
      const typeRoll = r();
      const type = h > 0.6 && typeRoll < 0.45 ? 'spire' : typeRoll < 0.6 ? 'step' : typeRoll < 0.72 ? 'slant' : 'flat';
      out.push({ x, w, h, type, seed: Math.floor(r() * 1e9), lit: opts.lit * (0.5 + r()) });
      x += w * (0.82 + r() * 0.5);
    }
    return out;
  }
  const NEAR = genSkyline(41, 60, x => 0.18 + 0.82 * Math.exp(-Math.pow((x - 0.3) / 0.16, 2)) + 0.38 * Math.exp(-Math.pow((x - 0.78) / 0.08, 2)), { minW: 0.022, maxW: 0.06, lit: 0.22 });
  const FAR = genSkyline(97, 140, x => 0.35 + 0.4 * Math.abs(Math.sin(x * 9.0)) * Math.exp(-Math.pow((x - 0.35) / 0.4, 2)), { minW: 0.006, maxW: 0.02, lit: 0.08 });
  const CRANES = [{ x: 0.56, h: 0.78, jib: 0.16, dir: 1 }, { x: 0.9, h: 0.55, jib: 0.1, dir: -1 }];

  function drawSkyline(c, list, opts) {
    const g = c.getContext('2d');
    const W = c.width, H = c.height;
    g.clearRect(0, 0, W, H);
    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, opts.top);
    grad.addColorStop(1, opts.bottom);
    const cell = Math.max(2, H * opts.cell);
    for (const b of list) {
      const bx = b.x * W, bw = Math.max(1.5, b.w * W), bh = b.h * H, by = H - bh;
      g.fillStyle = grad;
      g.beginPath();
      if (b.type === 'slant') {
        g.moveTo(bx, H); g.lineTo(bx, by + bh * 0.08); g.lineTo(bx + bw, by); g.lineTo(bx + bw, H);
      } else {
        g.rect(bx, by, bw, bh);
      }
      g.fill();
      if (b.type === 'step') g.fillRect(bx + bw * 0.2, by - bh * 0.12, bw * 0.6, bh * 0.12 + 1);
      if (b.type === 'spire') {
        g.beginPath();
        g.moveTo(bx + bw * 0.28, by); g.lineTo(bx + bw * 0.5, by - bh * 0.28); g.lineTo(bx + bw * 0.72, by);
        g.fill();
        g.fillRect(bx + bw * 0.5 - 0.5, by - bh * 0.42, 1, bh * 0.16);
      }
      // moonlit rim on the top edge
      g.fillStyle = opts.rim;
      g.fillRect(bx, by, bw, Math.max(1, H * 0.003));
      // windows
      const wr = rng(b.seed);
      const cols = Math.floor(bw / cell), rows = Math.floor(bh / cell);
      for (let cy = 1; cy < rows - 1; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          if (wr() > b.lit) continue;
          const teal = wr() < 0.18;
          g.fillStyle = teal ? `rgba(140,193,184,${0.35 + wr() * 0.45})` : `rgba(246,214,160,${opts.winAlpha * (0.45 + wr() * 0.55)})`;
          g.fillRect(bx + cx * cell + cell * 0.3, by + cy * cell + cell * 0.3, cell * 0.42, cell * 0.5);
        }
      }
    }
    if (opts.cranes) {
      g.strokeStyle = opts.top;
      g.lineWidth = Math.max(1, H * 0.004);
      for (const cr of opts.cranes) {
        const x = cr.x * W, top = H - cr.h * H, jib = cr.jib * W * cr.dir;
        g.beginPath();
        g.moveTo(x, H); g.lineTo(x, top);
        g.moveTo(x - jib * 0.25, top); g.lineTo(x + jib, top);
        g.moveTo(x, top - H * 0.04); g.lineTo(x + jib * 0.8, top);
        g.moveTo(x + jib * 0.7, top); g.lineTo(x + jib * 0.7, top + H * 0.12);
        g.stroke();
      }
    }
  }

  /* ---------------- glow sprite ---------------- */
  function sprite(rgb) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, `rgba(255,248,232,1)`);
    gr.addColorStop(0.12, `rgba(${rgb},.9)`);
    gr.addColorStop(0.4, `rgba(${rgb},.22)`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return c;
  }

  /* ---------------- state ---------------- */
  const st = {
    visible: 0, visibleTarget: 0,
    moon: 0, city: 0, water: 0, glints: 0,
    orbits: [0, 0, 0], orbitAlpha: 1,
    dolly: 0, energy: 0, spin: 1,
    thread: null,
    bright: 0
  };

  let canvas, ctx, dpr = 1, W = 0, H = 0;
  let moonTex = null, nearC = null, farC = null, skyBuf = null, waterBuf = null, waterMask = null;
  let glowGold = null;
  let anchorFn = null, cur = null, from = null, blendT = 1, blendDur = 1;
  let renderedScale = 0, maskKey = '';
  let needsFrame = true;

  function computeLayout(a) {
    const small = a.w < 520;
    const r = a.w * (small ? 0.2 : 0.177);
    return {
      ax: a.x, ay: a.y, aw: a.w, ah: a.h,
      mx: a.x + a.w * 0.242, my: a.y - a.h * (small ? 0.12 : 0.04), r,
      horizon: a.y + a.h * 0.277,
      nearX: a.x - a.w * 0.1, nearW: a.w * 0.6, nearH: a.h * 0.62,
      farH: a.h * 0.2,
      waterRight: a.x + a.w * 0.78
    };
  }
  function blendLayout(a, b, t) {
    const o = {};
    for (const k in b) o[k] = lerp(a[k], b[k], t);
    return o;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, A.motion.isSmall() ? 1.5 : 1.75);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    renderedScale = 0;
    maskKey = '';
    needsFrame = true;
    A.ticker.wake();
  }

  function ensureLayers(L) {
    const scale = L.nearH;
    if (renderedScale && Math.abs(scale - renderedScale) / renderedScale < 0.12) return;
    renderedScale = scale;
    nearC = nearC || document.createElement('canvas');
    nearC.width = Math.max(2, Math.round(L.nearW * dpr));
    nearC.height = Math.max(2, Math.round(L.nearH * dpr));
    drawSkyline(nearC, NEAR, { top: '#0e1f21', bottom: '#020607', rim: 'rgba(245,206,145,.22)', cell: 0.022, winAlpha: 1, cranes: CRANES });
    farC = farC || document.createElement('canvas');
    farC.width = Math.round(W * dpr);
    farC.height = Math.max(2, Math.round(L.farH * dpr));
    drawSkyline(farC, FAR, { top: '#123033', bottom: '#081617', rim: 'rgba(245,206,145,.1)', cell: 0.08, winAlpha: 0.55 });
  }

  function ensureWater(L) {
    const waterH = Math.max(10, H - L.horizon);
    const key = [Math.round(waterH), Math.round(L.waterRight), W].join('|');
    if (key === maskKey) return;
    maskKey = key;
    const s = 0.5 * dpr;
    skyBuf = skyBuf || document.createElement('canvas');
    waterBuf = waterBuf || document.createElement('canvas');
    waterMask = waterMask || document.createElement('canvas');
    const bw = Math.max(2, Math.round(W * s)), bh = Math.max(2, Math.round(waterH * s));
    skyBuf.width = waterBuf.width = waterMask.width = bw;
    skyBuf.height = waterBuf.height = waterMask.height = bh;
    const m = waterMask.getContext('2d');
    m.clearRect(0, 0, bw, bh);
    const hx = m.createLinearGradient(0, 0, bw, 0);
    const edge = clamp(L.waterRight / W, 0.3, 1);
    hx.addColorStop(0, 'rgba(0,0,0,1)');
    hx.addColorStop(Math.max(0, edge - 0.32), 'rgba(0,0,0,1)');
    hx.addColorStop(edge, 'rgba(0,0,0,0)');
    hx.addColorStop(1, 'rgba(0,0,0,0)');
    m.fillStyle = hx;
    m.fillRect(0, 0, bw, bh);
    m.globalCompositeOperation = 'destination-in';
    const vy = m.createLinearGradient(0, 0, 0, bh);
    vy.addColorStop(0, 'rgba(0,0,0,1)');
    vy.addColorStop(0.55, 'rgba(0,0,0,.75)');
    vy.addColorStop(1, 'rgba(0,0,0,0)');
    m.fillStyle = vy;
    m.fillRect(0, 0, bw, bh);
    m.globalCompositeOperation = 'source-over';
  }

  /* ---------------- geometry helpers ---------------- */
  function orbitDefs(L) {
    const r = L.r;
    return [
      { cx: L.mx + r * 0.9, cy: L.my + r * 0.4, rx: r * 3.1, ry: r * 1.02, rot: -0.17, a0: Math.PI * 0.82, alpha: 0.5, speed: 0.05 },
      { cx: L.mx, cy: L.my, rx: r * 1.34, ry: r * 1.34, rot: 0, a0: -Math.PI / 2, alpha: 0.32, speed: -0.035 },
      { cx: L.mx + r * 1.9, cy: L.my + r * 0.75, rx: r * 4.7, ry: r * 1.75, rot: 0.09, a0: Math.PI * 1.1, alpha: 0.26, speed: 0.022 }
    ];
  }
  function ellipsePt(o, a) {
    const c = Math.cos(o.rot), s = Math.sin(o.rot);
    const x = o.rx * Math.cos(a), y = o.ry * Math.sin(a);
    return [o.cx + x * c - y * s, o.cy + x * s + y * c];
  }
  function ellipseTan(o, a) {
    const c = Math.cos(o.rot), s = Math.sin(o.rot);
    const x = -o.rx * Math.sin(a), y = o.ry * Math.cos(a);
    const tx = x * c - y * s, ty = x * s + y * c, l = Math.hypot(tx, ty) || 1;
    return [tx / l, ty / l];
  }
  function bezier(p0, p1, p2, p3, n) {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, u = 1 - t;
      out.push([
        u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]
      ]);
    }
    return out;
  }
  function withLengths(pts) {
    const len = [0];
    for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, len, total: len[len.length - 1] };
  }

  /** Thread paths are built from the live layout so they stay correct across resizes. */
  const threadPaths = {
    intro(L) {
      const o = orbitDefs(L)[0];
      const p3 = ellipsePt(o, o.a0), t = ellipseTan(o, o.a0);
      const lead = bezier([-W * 0.04, H * 0.9], [W * 0.12, H * 0.98], [p3[0] - t[0] * L.r * 2.2, p3[1] - t[1] * L.r * 2.2], p3, 50);
      const loop = [];
      for (let i = 1; i <= 140; i++) loop.push(ellipsePt(o, o.a0 + (i / 140) * TAU));
      return { path: withLengths(lead.concat(loop)), leadCount: lead.length };
    },
    finale(L) {
      const end = [L.ax + L.aw * 0.5, L.ay + L.ah * 0.5];
      const a = bezier([-W * 0.05, L.my + L.r * 0.4], [W * 0.2, L.my - L.r * 2.6], [L.mx + L.r * 2.4, L.my - L.r * 2.2], [L.mx + L.r * 1.6, L.my + L.r * 0.2], 60);
      const b = bezier(a[a.length - 1], [L.mx + L.r * 1.0, L.my + L.r * 2.0], [end[0] + L.aw * 0.28, end[1] + L.ah * 0.6], end, 50);
      return { path: withLengths(a.concat(b.slice(1))), leadCount: 0 };
    }
  };

  /* ---------------- drawing ---------------- */
  function layerXform(L, depth) {
    const k = 1 + st.dolly * depth * 2.6;
    const px = A.motion.reduced ? 0 : -pointer.x * depth * 18;
    const py = A.motion.reduced ? 0 : -pointer.y * depth * 8;
    return {
      k,
      x: v => L.mx + (v - L.mx) * k + px,
      y: v => L.my + (v - L.my) * k + py
    };
  }

  function drawMoon(L, t) {
    if (st.moon <= 0) return;
    const X = layerXform(L, 0.22);
    const rise = (1 - ease.outCubic(st.moon)) * L.r * 0.5;
    const cx = X.x(L.mx), cy = X.y(L.my) + rise, r = L.r * X.k;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = st.moon * (0.32 + st.bright * 0.4);
    const halo = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 3.2);
    halo.addColorStop(0, 'rgba(245,206,145,.55)');
    halo.addColorStop(0.35, 'rgba(167,77,83,.16)');
    halo.addColorStop(1, 'rgba(22,68,67,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(cx - r * 3.2, cy - r * 3.2, r * 6.4, r * 6.4);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = st.moon;
    ctx.drawImage(moonTex, cx - r, cy - r, r * 2, r * 2);
    ctx.globalAlpha = 1;
  }

  function drawCity(L) {
    if (st.city <= 0) return;
    const rise = (1 - ease.outCubic(st.city)) * L.r * 0.18;
    const F = layerXform(L, 0.5);
    ctx.globalAlpha = st.city * 0.92;
    ctx.drawImage(farC, F.x(0), F.y(L.horizon - L.farH) + rise, W * F.k, L.farH * F.k);
    const N = layerXform(L, 1);
    ctx.globalAlpha = st.city;
    ctx.drawImage(nearC, N.x(L.nearX), N.y(L.horizon - L.nearH) + rise * 1.6, L.nearW * N.k, L.nearH * N.k);
    // shoreline lights
    ctx.globalCompositeOperation = 'lighter';
    const hy = N.y(L.horizon);
    const g = ctx.createLinearGradient(N.x(L.nearX - L.aw * 0.1), 0, N.x(L.ax + L.aw * 0.75), 0);
    g.addColorStop(0, 'rgba(245,206,145,0)');
    g.addColorStop(0.25, 'rgba(245,206,145,.55)');
    g.addColorStop(0.6, 'rgba(218,189,124,.3)');
    g.addColorStop(1, 'rgba(218,189,124,0)');
    ctx.fillStyle = g;
    ctx.globalAlpha = st.city;
    ctx.fillRect(0, hy - 1, W, 1.6);
    ctx.globalAlpha = st.city * 0.25;
    ctx.fillRect(0, hy - 4, W, 8);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  function drawWater(L, t) {
    if (st.water <= 0) return;
    const s = 0.5 * dpr;
    const bw = waterBuf.width, bh = waterBuf.height;
    const sk = skyBuf.getContext('2d');
    const wk = waterBuf.getContext('2d');
    // 1. the band of sky just above the horizon, at half resolution
    sk.setTransform(1, 0, 0, 1, 0, 0);
    sk.clearRect(0, 0, bw, bh);
    sk.setTransform(s, 0, 0, s, 0, -(L.horizon - bh / s) * s);
    const saved = ctx;
    ctx = sk;
    drawMoon(L, t);
    drawCity(L);
    ctx = saved;
    sk.setTransform(1, 0, 0, 1, 0, 0);
    // 2. mirrored strips with ripple displacement that grows away from the shore
    wk.clearRect(0, 0, bw, bh);
    wk.fillStyle = '#04100f';
    wk.globalAlpha = 0.72;
    wk.fillRect(0, 0, bw, bh);
    wk.globalAlpha = 1;
    const strip = 2;
    const amp = A.motion.reduced ? 0 : 1;
    for (let y = 0; y < bh; y += strip) {
      const depth = y / bh;
      const sy = bh - y - strip;
      if (sy < 0) break;
      const off = amp * (Math.sin(y * 0.55 + t * 1.7) * (0.6 + depth * 5) + Math.sin(y * 0.13 - t * 0.9) * depth * 4);
      wk.globalAlpha = 0.55 * (1 - depth * 0.6);
      wk.drawImage(skyBuf, 0, sy, bw, strip, off, y, bw, strip);
    }
    // 3. moonlight glitter column
    wk.globalCompositeOperation = 'lighter';
    const gx = (L.mx - (A.motion.reduced ? 0 : pointer.x * 4)) * s;
    const gr = rng(5);
    for (let i = 0; i < 46; i++) {
      const d = i / 46;
      const y = Math.pow(d, 1.35) * bh * 0.95;
      const w = L.r * s * (0.15 + gr() * 0.9) * (1 + d * 0.8);
      const fl = 0.5 + 0.5 * Math.sin(t * (1.2 + gr() * 2) + i * 1.7);
      wk.globalAlpha = (0.12 + 0.5 * fl) * (1 - d) * st.moon;
      wk.fillStyle = gr() < 0.2 ? 'rgb(140,193,184)' : 'rgb(246,214,160)';
      wk.fillRect(gx - w / 2 + Math.sin(t * 0.8 + i) * 3, y, w, Math.max(1, s * (1 + d * 1.5)));
    }
    wk.globalCompositeOperation = 'destination-in';
    wk.globalAlpha = 1;
    wk.drawImage(waterMask, 0, 0);
    wk.globalCompositeOperation = 'source-over';
    const N = layerXform(L, 1);
    ctx.globalAlpha = st.water;
    ctx.drawImage(waterBuf, N.x(0), N.y(L.horizon), (bw / s) * N.k, (bh / s) * N.k);
    ctx.globalAlpha = 1;
  }

  function strokeArc(o, a0, a1) {
    ctx.beginPath();
    ctx.ellipse(o.cx, o.cy, o.rx, o.ry, o.rot, a0, a1);
    ctx.stroke();
  }

  function drawOrbits(L, t) {
    const X = layerXform(L, 0.7);
    const defs = orbitDefs(L).map(o => ({ ...o, cx: X.x(o.cx), cy: X.y(o.cy), rx: o.rx * X.k, ry: o.ry * X.k }));
    ctx.lineCap = 'round';
    defs.forEach((o, i) => {
      const p = st.orbits[i];
      if (p <= 0) return;
      ctx.strokeStyle = 'rgba(218,189,124,1)';
      ctx.globalAlpha = o.alpha * st.orbitAlpha * (1 + st.energy * 0.8);
      ctx.lineWidth = 1;
      strokeArc(o, o.a0, o.a0 + p * TAU);
      if (p < 1) return;
      // travelling markers; during the transition they accelerate into comets
      const ang = o.a0 + t * o.speed * st.spin * TAU + i * 1.9;
      const pt = ellipsePt(o, ang);
      ctx.globalCompositeOperation = 'lighter';
      if (st.energy > 0.02) {
        ctx.lineWidth = 2;
        const tail = 0.9 * st.energy;
        const n = 14;
        for (let k = 0; k < n; k++) {
          ctx.globalAlpha = (1 - k / n) * 0.55 * st.energy;
          const dir = Math.sign(o.speed);
          strokeArc(o, Math.min(ang - dir * tail * (k + 1) / n, ang - dir * tail * k / n), Math.max(ang - dir * tail * (k + 1) / n, ang - dir * tail * k / n));
        }
      }
      const size = (i === 0 ? 16 : 11) * (1 + st.energy * 1.5);
      ctx.globalAlpha = st.orbitAlpha * (0.75 + st.energy * 0.25);
      ctx.drawImage(glowGold, pt[0] - size / 2, pt[1] - size / 2, size, size);
      ctx.globalCompositeOperation = 'source-over';
    });
    ctx.globalAlpha = 1;
  }

  function drawThread(t) {
    const th = st.thread;
    if (!th) return;
    const { pts, len, total } = th.path;
    const headL = th.head * total;
    let hi = 1;
    while (hi < len.length - 1 && len[hi] < headL) hi++;
    const lerpPt = (i) => {
      const a = pts[i - 1], b = pts[i];
      const f = clamp((headL - len[i - 1]) / Math.max(0.001, len[i] - len[i - 1]));
      return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)];
    };
    const head = lerpPt(hi);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // faint persistent trail (the part that becomes the orbit); the lead-in fades with th.leadFade
    ctx.strokeStyle = 'rgb(218,189,124)';
    ctx.lineWidth = 1;
    if (th.leadCount) {
      ctx.globalAlpha = 0.45 * (1 - th.leadFade);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < Math.min(hi, th.leadCount); i++) ctx.lineTo(pts[i][0], pts[i][1]);
      if (hi <= th.leadCount) ctx.lineTo(head[0], head[1]);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.45 * (1 - th.tailFade);
    ctx.beginPath();
    const s0 = th.leadCount ? Math.max(1, th.leadCount - 1) : 1;
    if (hi > s0) {
      ctx.moveTo(pts[s0 - 1][0], pts[s0 - 1][1]);
      for (let i = s0; i < hi; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.lineTo(head[0], head[1]);
      ctx.stroke();
    }
    if (th.head >= 1 && th.headFade >= 1) return;
    // bright comet tail
    ctx.globalCompositeOperation = 'lighter';
    const tailL = Math.min(total * 0.22, 340);
    const segs = 18;
    for (let k = 0; k < segs; k++) {
      const l0 = headL - (tailL * (k + 1)) / segs, l1 = headL - (tailL * k) / segs;
      if (l1 <= 0) break;
      ctx.globalAlpha = Math.pow(1 - k / segs, 1.6) * 0.9 * (1 - th.headFade);
      ctx.lineWidth = 2.4 * (1 - k / segs) + 0.6;
      ctx.beginPath();
      let started = false;
      for (let i = 1; i < len.length; i++) {
        if (len[i] < l0) continue;
        if (len[i - 1] > l1) break;
        const p = pts[i];
        if (!started) { ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); started = true; }
        ctx.lineTo(p[0], p[1]);
      }
      ctx.stroke();
    }
    const hs = 46 * (0.8 + 0.2 * Math.sin(t * 9));
    ctx.globalAlpha = 1 - th.headFade;
    ctx.drawImage(glowGold, head[0] - hs / 2, head[1] - hs / 2, hs, hs);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  function star(x, y, s, a) {
    ctx.globalAlpha = a;
    const g = ctx.createLinearGradient(x - s, y, x + s, y);
    g.addColorStop(0, 'rgba(245,232,204,0)'); g.addColorStop(0.5, 'rgba(255,246,226,1)'); g.addColorStop(1, 'rgba(245,232,204,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - s, y - 0.6, s * 2, 1.2);
    const v = ctx.createLinearGradient(x, y - s, x, y + s);
    v.addColorStop(0, 'rgba(245,232,204,0)'); v.addColorStop(0.5, 'rgba(255,246,226,1)'); v.addColorStop(1, 'rgba(245,232,204,0)');
    ctx.fillStyle = v;
    ctx.fillRect(x - 0.6, y - s, 1.2, s * 2);
    ctx.drawImage(glowGold, x - s * 0.35, y - s * 0.35, s * 0.7, s * 0.7);
  }
  function drawGlints(L, t) {
    if (st.glints <= 0) return;
    const X = layerXform(L, 0.6);
    ctx.globalCompositeOperation = 'lighter';
    const pts = [[L.mx + L.r * 1.25, L.my - L.r * 1.6, 1.0], [L.mx - L.r * 1.9, L.my + L.r * 0.9, 0.6], [L.mx + L.r * 3.9, L.my - L.r * 0.8, 0.5]];
    pts.forEach(([x, y, w], i) => {
      const tw = A.motion.reduced ? 0.8 : 0.55 + 0.45 * Math.sin(t * (0.7 + i * 0.3) + i * 2);
      star(X.x(x), X.y(y), L.r * 0.22 * w * (0.8 + tw * 0.3), st.glints * tw * 0.9);
    });
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  function render(f) {
    const t = f.time;
    // layout follows the active anchor; switching anchors blends smoothly
    const target = anchorFn ? computeLayout(anchorFn()) : null;
    if (!target) return;
    if (blendT < 1 && from) {
      blendT = clamp(blendT + f.dt / blendDur);
      cur = blendLayout(from, target, ease.inOutCubic(blendT));
    } else cur = target;
    ensureLayers(cur);
    ensureWater(cur);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    drawMoon(cur, t);
    drawCity(cur);
    drawWater(cur, t);
    drawOrbits(cur, t);
    drawThread(t);
    drawGlints(cur, t);
    needsFrame = false;
  }

  /* ---------------- public API ---------------- */
  const scene = { state: st };

  scene.init = function () {
    canvas = document.getElementById('world-scene');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    moonTex = buildMoon();
    glowGold = sprite('240,214,160');
    resize();
    A.util.onResize(() => { resize(); });

    A.ticker.add(f => {
      st.visible = lerp(st.visible, st.visibleTarget, 1 - Math.exp(-f.dt * 2.4));
      if (Math.abs(st.visible - st.visibleTarget) < 0.003) st.visible = st.visibleTarget;
      canvas.style.opacity = st.visible.toFixed(3);
      if (st.visible <= 0.002) return;
      render(f);
    }, () => {
      if (!anchorFn) return false;
      const fading = Math.abs(st.visible - st.visibleTarget) > 0.003;
      if (st.visible <= 0.002 && !fading) return false;
      return !A.motion.reduced || needsFrame || fading || blendT < 1 || A.ticker.frame.scrollDirty;
    });
    A.motion.onChange(() => { needsFrame = true; A.ticker.wake(); });
  };

  /** fn returns the anchor rect {x,y,w,h} in viewport coordinates. */
  scene.setAnchor = function (fn, blend = 0) {
    if (cur && blend > 0) { from = cur; blendT = 0; blendDur = blend; }
    anchorFn = fn;
    needsFrame = true;
    A.ticker.wake();
  };
  scene.setVisible = function (v, instant) {
    st.visibleTarget = v;
    if (instant) st.visible = v;
    needsFrame = true;
    A.ticker.wake();
  };
  scene.invalidate = function () { needsFrame = true; A.ticker.wake(); };
  scene.layout = () => cur;

  /** Draw a golden thread along a named path. Resolves when the head arrives. */
  scene.runThread = function (kind, { duration = 2.6, persist = false } = {}) {
    if (!cur && anchorFn) cur = computeLayout(anchorFn());
    if (!cur) return Promise.resolve();
    const built = threadPaths[kind](cur);
    const th = { path: built.path, leadCount: built.leadCount, head: 0, leadFade: 0, tailFade: 0, headFade: 0 };
    st.thread = th;
    if (A.motion.reduced) { th.head = 1; th.headFade = 1; th.tailFade = persist ? 0 : 1; needsFrame = true; return Promise.resolve(th); }
    return A.util.tween({ duration, easing: ease.inOutSine, update: v => { th.head = v; } }).then(() => th);
  };
  scene.clearThread = function (fadeDur = 0.8) {
    const th = st.thread;
    if (!th) return Promise.resolve();
    return A.util.tween({ duration: fadeDur, easing: ease.outCubic, update: v => { th.leadFade = v; th.headFade = v; th.tailFade = v; } })
      .then(() => { if (st.thread === th) st.thread = null; needsFrame = true; });
  };

  A.scene = scene;
})(window.ANVAYA);
