/**
 * The golden thread — one continuous line that leaves the hero, touches every chapter marker,
 * runs down the margin, and arrives at the final emblem. It illuminates as the visitor scrolls.
 */
(function (A) {
  'use strict';
  const { clamp } = A.util;

  let svg, base, lit, head, main;
  let samplesY = [], samplesL = [], total = 0, ready = false;

  function point(el, ax = 0.5, ay = 0.5) {
    const r = el.getBoundingClientRect();
    const m = main.getBoundingClientRect();
    return [r.left - m.left + r.width * ax, r.top - m.top + r.height * ay];
  }

  function build() {
    const mainRect = main.getBoundingClientRect();
    const W = mainRect.width, H = main.scrollHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.style.height = H + 'px';
    const small = W < 760;
    const gutter = small ? 7 : Math.max(22, Math.min(64, W * 0.03));

    const pts = [];
    const cue = document.querySelector('.scroll-cue-line');
    if (cue) pts.push(point(cue, 0.5, 1));
    document.querySelectorAll('.chapter:not(.ch-world) .ch-num').forEach(n => {
      const p = point(n, 0, 0.55);
      p[0] -= small ? 0 : 18;
      pts.push(p);
    });
    const fin = document.querySelector('[data-finale]');
    if (fin) pts.push(point(fin, 0.5, 0));
    if (pts.length < 2) return;

    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const span = y1 - y0;
      // swing out to the margin, run down it, swing back in to the next chapter marker
      const top = y0 + Math.min(220, span * 0.2);
      const bot = y1 - Math.min(220, span * 0.2);
      if (span > 600) {
        d += ` C${x0.toFixed(1)},${(y0 + (top - y0) * 0.6).toFixed(1)} ${gutter},${(top - (top - y0) * 0.4).toFixed(1)} ${gutter},${top.toFixed(1)}`;
        d += ` L${gutter},${bot.toFixed(1)}`;
        d += ` C${gutter},${(bot + (y1 - bot) * 0.4).toFixed(1)} ${x1.toFixed(1)},${(y1 - (y1 - bot) * 0.6).toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
      } else {
        d += ` C${x0.toFixed(1)},${(y0 + span * 0.5).toFixed(1)} ${x1.toFixed(1)},${(y1 - span * 0.5).toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
      }
    }
    base.setAttribute('d', d);
    lit.setAttribute('d', d);
    total = lit.getTotalLength();
    lit.style.strokeDasharray = `${total} ${total}`;
    samplesY = [];
    samplesL = [];
    const N = 320;
    for (let i = 0; i <= N; i++) {
      const l = (total * i) / N;
      const p = lit.getPointAtLength(l);
      samplesY.push(p.y);
      samplesL.push(l);
    }
    // keep y monotonic for the lookup
    for (let i = 1; i < samplesY.length; i++) samplesY[i] = Math.max(samplesY[i], samplesY[i - 1]);
    ready = true;
    update(A.ticker.frame);
  }

  function lengthAtY(y) {
    if (y <= samplesY[0]) return 0;
    let lo = 0, hi = samplesY.length - 1;
    if (y >= samplesY[hi]) return total;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (samplesY[mid] < y) lo = mid; else hi = mid;
    }
    const f = (y - samplesY[lo]) / Math.max(0.001, samplesY[hi] - samplesY[lo]);
    return samplesL[lo] + (samplesL[hi] - samplesL[lo]) * f;
  }

  function update(f) {
    if (!ready) return;
    const mainTop = main.offsetTop;
    const reading = f.scrollY + f.vh * 0.62 - mainTop;
    const L = clamp(lengthAtY(reading), 0, total);
    lit.style.strokeDashoffset = (total - L).toFixed(1);
    const p = lit.getPointAtLength(L);
    head.setAttribute('cx', p.x.toFixed(1));
    head.setAttribute('cy', p.y.toFixed(1));
    head.style.opacity = L > 4 && L < total - 2 ? 1 : 0;
  }

  A.thread = {
    init() {
      main = document.getElementById('main');
      svg = main && main.querySelector('.thread');
      if (!svg) return;
      base = svg.querySelector('.thread-base');
      lit = svg.querySelector('.thread-lit');
      head = svg.querySelector('.thread-head');
      let t = 0;
      const rebuild = () => { clearTimeout(t); t = setTimeout(build, 150); };
      if ('ResizeObserver' in window) new ResizeObserver(rebuild).observe(main);
      A.util.onResize(rebuild);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(rebuild);
      rebuild();
      A.ticker.add(update, () => ready && A.ticker.frame.scrollDirty);
    },
    rebuild: () => build()
  };
})(window.ANVAYA);
