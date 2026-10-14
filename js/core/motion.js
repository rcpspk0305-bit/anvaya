/**
 * MotionSettings + the shared frame loop.
 * One requestAnimationFrame drives every animated system on the page; it stops entirely
 * when nothing is subscribed or the tab is hidden. Scroll is read once per frame.
 */
(function (A) {
  'use strict';

  const html = document.documentElement;
  const STORAGE_KEY = 'anvaya.motion';
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = {
    linear: t => t,
    inCubic: t => t * t * t,
    outCubic: t => 1 - Math.pow(1 - t, 3),
    inOutCubic: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outExpo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    inExpo: t => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
    inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
    outQuint: t => 1 - Math.pow(1 - t, 5)
  };

  function readStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function store(v) {
    try { v === null ? localStorage.removeItem(STORAGE_KEY) : localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* storage blocked */ }
  }

  const listeners = new Set();
  const motion = {
    get reduced() { return html.dataset.motion === 'reduced'; },
    /** User preference wins over the OS setting once chosen. */
    set(mode) {
      store(mode);
      apply();
    },
    toggle() { motion.set(motion.reduced ? 'full' : 'reduced'); },
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    isCoarse: window.matchMedia('(pointer: coarse)').matches,
    isSmall: () => window.innerWidth < 760,
    lowPower: (navigator.hardwareConcurrency || 4) <= 4 || (navigator.deviceMemory || 4) <= 3
  };

  function apply() {
    const pref = readStored();
    const reduced = pref ? pref === 'reduced' : mq.matches;
    const prev = html.dataset.motion;
    html.dataset.motion = reduced ? 'reduced' : 'full';
    if (prev && prev !== html.dataset.motion) listeners.forEach(fn => fn(reduced));
  }
  apply();
  (mq.addEventListener ? mq.addEventListener('change', apply) : mq.addListener(apply));

  /* ---------------- frame loop ---------------- */
  const subs = new Set();
  let raf = 0;
  let last = 0;
  const frame = { time: 0, dt: 0, scrollY: window.scrollY, vw: window.innerWidth, vh: window.innerHeight, scrollDirty: true };

  function loop(now) {
    raf = 0;
    const t = now / 1000;
    frame.dt = last ? Math.min(0.05, t - last) : 0.016;
    frame.time = t;
    last = t;
    if (frame.scrollDirty) frame.scrollY = window.scrollY;
    let anyActive = false;
    subs.forEach(s => {
      if (s.active && !s.active()) return;
      anyActive = true;
      try { s.fn(frame); } catch (err) { console.error('[anvaya] frame subscriber failed', err); subs.delete(s); }
    });
    frame.scrollDirty = false;
    // Idle when nothing needs drawing; scroll, pointer, resize, visibility and wake() restart the loop.
    if (anyActive) schedule(); else last = 0;
  }
  function schedule() {
    if (!raf && subs.size && !document.hidden) raf = requestAnimationFrame(loop);
  }

  const ticker = {
    frame,
    /** fn(frame) runs every frame while active() (optional) returns true. */
    add(fn, active) {
      const s = { fn, active };
      subs.add(s);
      schedule();
      return () => subs.delete(s);
    },
    wake: schedule
  };

  document.addEventListener('visibilitychange', () => { last = 0; schedule(); });
  window.addEventListener('scroll', () => { frame.scrollDirty = true; schedule(); }, { passive: true });
  let resizeT = 0;
  const resizeFns = new Set();
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      frame.vw = window.innerWidth;
      frame.vh = window.innerHeight;
      frame.scrollDirty = true;
      resizeFns.forEach(fn => fn(frame));
      schedule();
    }, 120);
  });

  /** Promise-based tween on the shared loop. Jumps to the end in reduced motion; stops early when signal.aborted. */
  function tween({ duration = 1, delay = 0, easing = ease.outCubic, update, skipIfReduced = true, signal }) {
    return new Promise(resolve => {
      if (skipIfReduced && motion.reduced) { update(1, 1); resolve(); return; }
      let start = null;
      const off = ticker.add(f => {
        if (signal && signal.aborted) { off(); resolve(); return; }
        if (start === null) start = f.time;
        const el = f.time - start - delay;
        if (el < 0) return;
        const p = clamp(el / duration);
        update(easing(p), p);
        if (p >= 1) { off(); resolve(); }
      });
    });
  }

  const wait = ms => new Promise(r => setTimeout(r, ms));
  /** Escape text before it is placed in a template string (all content comes from config, but stay safe). */
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /** Small pointer state shared by parallax systems (normalised −1…1, smoothed). */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!motion.isCoarse) {
    window.addEventListener('pointermove', e => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
      schedule();
    }, { passive: true });
  }
  ticker.add(f => {
    const k = 1 - Math.exp(-f.dt * 3);
    pointer.x += (pointer.tx - pointer.x) * k;
    pointer.y += (pointer.ty - pointer.y) * k;
  }, () => !motion.reduced && (Math.abs(pointer.tx - pointer.x) > 0.001 || Math.abs(pointer.ty - pointer.y) > 0.001));

  A.motion = motion;
  A.ticker = ticker;
  A.util = { clamp, lerp, ease, tween, wait, esc, pointer, onResize: fn => (resizeFns.add(fn), () => resizeFns.delete(fn)) };
})(window.ANVAYA);
