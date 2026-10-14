/**
 * LogoReveal — reveals the official ANVAYA lettering (keyed from the artwork) with travelling light.
 *
 * Markup (static HTML, fully visible without JS):
 *   <span class="wm" data-wordmark>
 *     <img class="wm-layer wm-gold" …>   gold-toned pass, revealed first by the light front
 *     <img class="wm-layer wm-true" …>   the artwork's own teal / burgundy mineral colouring
 *     <img class="wm-layer wm-glint" …>  a bright pass masked to a narrow band — highlights that
 *                                        only exist where the letters exist, so they follow the strokes
 *   </span>
 */
(function (A) {
  'use strict';
  const { tween, ease } = A.util;

  function set(el, vars) {
    for (const k in vars) el.style.setProperty(k, vars[k]);
  }

  function hide(el) {
    el.dataset.state = 'revealing';
    set(el, { '--wm-gold': '-25%', '--wm-true': '-35%', '--wm-glint': '-30%', '--wm-glow': '0', '--wm-gold-op': '1' });
  }

  function finish(el) {
    el.dataset.state = 'revealed';
    ['--wm-gold', '--wm-true', '--wm-glint', '--wm-glow', '--wm-gold-op'].forEach(k => el.style.removeProperty(k));
  }

  /** Full reveal; resolves when the lettering is completely legible. */
  async function reveal(el, { speed = 1, signal } = {}) {
    if (!el) return;
    if (A.motion.reduced) { finish(el); return; }
    hide(el);
    const d = v => v / speed;
    const gold = tween({ duration: d(1.8), easing: ease.inOutSine, signal, update: v => set(el, { '--wm-gold': `${-25 + v * 150}%` }) });
    const mineral = tween({ duration: d(2.0), delay: d(0.8), easing: ease.inOutSine, signal, update: v => set(el, { '--wm-true': `${-35 + v * 170}%` }) });
    const glow = tween({ duration: d(2.2), delay: d(0.5), easing: ease.outCubic, signal, update: v => set(el, { '--wm-glow': v.toFixed(3) }) });
    const glint = tween({ duration: d(1.4), delay: d(2.0), easing: ease.inOutCubic, signal, update: v => set(el, { '--wm-glint': `${-30 + v * 160}%` }) });
    await Promise.all([gold, mineral, glow, glint]);
    await tween({ duration: d(0.6), signal, update: v => set(el, { '--wm-gold-op': (1 - v).toFixed(3) }) });
    finish(el);
  }

  /** A single highlight travelling across the metal — used on hover and focus. */
  let busy = new WeakSet();
  function shimmer(el) {
    if (!el || A.motion.reduced || busy.has(el) || el.dataset.state === 'revealing') return;
    busy.add(el);
    el.dataset.state = 'shimmer';
    tween({ duration: 1.1, easing: ease.inOutCubic, update: v => set(el, { '--wm-glint': `${-30 + v * 160}%` }) })
      .then(() => { busy.delete(el); if (el.dataset.state === 'shimmer') finish(el); });
  }

  A.logo = { reveal, hide, finish, shimmer };
})(window.ANVAYA);
