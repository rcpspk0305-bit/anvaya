/**
 * Chapter 03 — The Journey. A chronological <ol> (fully usable on its own) dressed with a single
 * golden path that illuminates with scroll. Milestones light as the path reaches them; the next
 * one is emphasised. On the event day, the item happening right now is marked from the real clock.
 */
(function (A) {
  'use strict';
  const { esc, clamp } = A.util;
  const C = A.config;

  let root, svg, base, lit, items = [], points = [], total = 0, lens = [], ready = false;

  function render() {
    const ol = root.querySelector('[data-milestones]');
    ol.innerHTML = C.schedule.map((s, i) => `
      <li class="milestone ${i % 2 ? 'is-right' : 'is-left'}" id="m-${esc(s.id)}" data-start="${esc(s.start)}" data-end="${esc(s.end)}">
        <span class="ms-node" aria-hidden="true"><span class="ms-dot"></span></span>
        <div class="ms-card">
          <p class="ms-time"><time datetime="${esc(s.start)}">${esc(s.time)}</time><span class="ms-badge" data-badge></span></p>
          <h3 class="ms-title"><span class="ms-num">${esc(s.number)}</span>${esc(s.title)}</h3>
          <p class="ms-desc">${esc(s.description)}</p>
        </div>
      </li>`).join('');
    items = [...ol.children];
  }

  function build() {
    const r = root.getBoundingClientRect();
    const W = r.width, H = root.offsetHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    points = items.map(li => {
      const n = li.querySelector('.ms-node').getBoundingClientRect();
      return [n.left - r.left + n.width / 2, n.top - r.top + n.height / 2];
    });
    if (points.length < 2) return;
    const small = W < 760;
    // orbital arcs between milestones: each segment bows outward, alternating sides
    let d = `M${points[0][0].toFixed(1)},${Math.max(0, points[0][1] - 80).toFixed(1)} L${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1], [x1, y1] = points[i];
      const bow = small ? 0 : (i % 2 ? 1 : -1) * Math.min(120, W * 0.09);
      const my = (y0 + y1) / 2;
      d += ` C${(x0 + bow).toFixed(1)},${(y0 + (my - y0) * 0.7).toFixed(1)} ${(x1 + bow).toFixed(1)},${(y1 - (y1 - my) * 0.7).toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
    }
    const last = points[points.length - 1];
    d += ` L${last[0].toFixed(1)},${(last[1] + 80).toFixed(1)}`;
    base.setAttribute('d', d);
    lit.setAttribute('d', d);
    total = lit.getTotalLength();
    lit.style.strokeDasharray = `${total} ${total}`;
    // path length at each milestone (search along the path)
    lens = [];
    const N = 400;
    let k = 0;
    for (let i = 0; i <= N && k < points.length; i++) {
      const l = (total * i) / N;
      const p = lit.getPointAtLength(l);
      if (p.y >= points[k][1] - 1) { lens.push(l); k++; }
    }
    while (lens.length < points.length) lens.push(total);
    ready = true;
    update(A.ticker.frame);
  }

  function update(f) {
    if (!ready) return;
    const r = root.getBoundingClientRect();
    // progress: the reading line (60% down the viewport) travelling through the section
    const reading = f.vh * 0.6 - r.top;
    let L;
    if (A.motion.reduced) L = total;
    else {
      // map reading-line y to path length via milestone anchors
      L = 0;
      if (reading >= points[points.length - 1][1]) L = lens[lens.length - 1] + clamp((reading - points[points.length - 1][1]) / 80) * (total - lens[lens.length - 1]);
      else if (reading > points[0][1]) {
        for (let i = 1; i < points.length; i++) {
          if (reading <= points[i][1]) {
            const t = clamp((reading - points[i - 1][1]) / (points[i][1] - points[i - 1][1]));
            L = lens[i - 1] + (lens[i] - lens[i - 1]) * t;
            break;
          }
        }
      } else L = lens[0] * clamp(1 + (reading - points[0][1]) / 120);
    }
    lit.style.strokeDashoffset = (total - L).toFixed(1);
    let nextSet = false;
    items.forEach((li, i) => {
      const reached = L >= lens[i] - 2;
      li.classList.toggle('is-reached', reached);
      const isNext = !reached && !nextSet;
      if (isNext) nextSet = true;
      li.classList.toggle('is-next', isNext && !A.motion.reduced);
    });
  }

  function clock() {
    const now = Date.now();
    items.forEach(li => {
      const s = new Date(li.dataset.start).getTime(), e = new Date(li.dataset.end).getTime();
      const badge = li.querySelector('[data-badge]');
      const live = now >= s && now < e;
      li.classList.toggle('is-live', live);
      badge.textContent = live ? 'Happening now' : '';
    });
  }

  A.journey = {
    init() {
      root = document.querySelector('[data-journey]');
      if (!root) return;
      svg = root.querySelector('.journey-path');
      base = svg.querySelector('.jp-base');
      lit = svg.querySelector('.jp-lit');
      render();
      clock();
      setInterval(clock, 30000);
      let t = 0;
      const rebuild = () => { clearTimeout(t); t = setTimeout(build, 120); };
      if ('ResizeObserver' in window) new ResizeObserver(rebuild).observe(root);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(rebuild);
      rebuild();
      let visible = false;
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { A.ticker.frame.scrollDirty = true; A.ticker.wake(); } }, { rootMargin: '20% 0px' }).observe(root);
      A.ticker.add(update, () => visible && ready && A.ticker.frame.scrollDirty);
      A.motion.onChange(() => update(A.ticker.frame));
    }
  };
})(window.ANVAYA);
