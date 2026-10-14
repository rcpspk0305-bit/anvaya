/**
 * Chapter 02 — Discover the Experience.
 * Desktop: an orrery — six destinations on two orbits around a central reading panel.
 * Mobile: large touch-friendly "stations" that expand in place.
 * All content is drawn from config.destinations → config.schedule.
 */
(function (A) {
  'use strict';
  const { esc } = A.util;
  const C = A.config;

  const GLYPHS = {
    lamp: '<path d="M3.5 14.5c1.8 3 4.8 4.5 8.5 4.5s6.7-1.5 8.5-4.5z"/><path d="M12 14.2c-2.3-1.8-1.6-5 0-8.7 1.6 3.7 2.3 6.9 0 8.7z"/>',
    voice: '<path d="M4.5 6.5h15v9h-8l-4 3.2v-3.2h-3z"/><path d="M8.5 10.2h7M8.5 12.6h4.5"/>',
    dance: '<circle cx="13" cy="4.6" r="1.6"/><path d="M13 7.5l-2.6 4.8 3 2.3 1.6 5.4M13 7.5l4.2 2.6M10.4 12.3l-4 .6M13.4 14.6l-3.2 5"/>',
    music: '<path d="M9 17.5V6.3l10-2.1v11.3"/><circle cx="6.6" cy="17.6" r="2.4"/><circle cx="16.6" cy="15.6" r="2.4"/>',
    rose: '<path d="M12 21v-8"/><path d="M12 13c-3.2 0-5.2-2.2-5.2-5.3 2 0 3.2 1 3.2 1S10 5.6 12 3.4c2 2.2 2 5.3 2 5.3s1.2-1 3.2-1c0 3.1-2 5.3-5.2 5.3z"/><path d="M12 17.2c-1.6-1.2-3.6-1.4-5-.4M12 16.4c1.3-1 3.1-1.2 4.4-.3"/>',
    stars: '<path d="M11 3l1.6 4.4L17 9l-4.4 1.6L11 15l-1.6-4.4L5 9l4.4-1.6z"/><path d="M18 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>'
  };
  const glyph = (k, cls = 'glyph') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${GLYPHS[k] || GLYPHS.stars}</svg>`;

  // orbit geometry in the 1000×640 viewBox (matches the <ellipse>s in index.html)
  const ORBITS = {
    inner: { cx: 500, cy: 320, rx: 300, ry: 150, rot: -8 },
    outer: { cx: 500, cy: 320, rx: 400, ry: 255, rot: 6 }
  };
  const PLACES = [['outer', 180], ['inner', 248], ['outer', 300], ['inner', 348], ['outer', 52], ['inner', 138]];
  function placeOn(o, deg) {
    const a = (deg * Math.PI) / 180, r = (o.rot * Math.PI) / 180;
    const x = o.rx * Math.cos(a), y = o.ry * Math.sin(a);
    return [o.cx + x * Math.cos(r) - y * Math.sin(r), o.cy + x * Math.sin(r) + y * Math.cos(r)];
  }

  const items = () => C.destinations.map(d => ({ ...d, entries: d.scheduleIds.map(id => C.schedule.find(s => s.id === id)).filter(Boolean) }));
  const timesOf = d => d.entries.map(e => e.time).join(' · ');

  function previewHTML(d) {
    return `
      <p class="core-kicker">${glyph(d.glyph, 'glyph glyph-sm')}<span>${esc(d.kicker)}</span></p>
      <h3 class="core-title">${esc(d.title)}</h3>
      <p class="core-time">${esc(timesOf(d))}</p>
      <p class="core-summary">${esc(d.summary)}</p>
      <p class="core-hint">Select to open the details</p>`;
  }
  function detailHTML(d) {
    return `
      <p class="core-kicker">${glyph(d.glyph, 'glyph glyph-sm')}<span>${esc(d.kicker)}</span></p>
      <h3 class="core-title">${esc(d.title)}</h3>
      <ul class="core-entries">
        ${d.entries.map(e => `
          <li>
            <p class="core-entry-time">${esc(e.time)}</p>
            <p class="core-entry-title">${esc(e.title)}</p>
            <p class="core-entry-desc">${esc(e.description)}</p>
          </li>`).join('')}
      </ul>
      <div class="core-actions">
        <a class="text-link" href="#m-${esc(d.entries[0].id)}">Find it on the journey</a>
        <button type="button" class="text-link" data-core-close>Back to the orbit</button>
      </div>`;
  }
  const introHTML = () => `
      <p class="core-kicker"><span>${esc(C.datetime.fullDateString)}</span></p>
      <h3 class="core-title">Six moments, <em>one morning.</em></h3>
      <p class="core-summary">Choose a point of light on the orbit to see what happens there.</p>`;

  function initOrrery(list) {
    const root = document.querySelector('[data-orrery]');
    if (!root) return;
    const core = root.querySelector('[data-orrery-core]');
    const nodes = root.querySelector('[data-orrery-nodes]');
    const link = root.querySelector('.orb-link');
    core.id = 'orrery-core';
    core.innerHTML = introHTML();
    let expanded = -1, previewing = -1;

    const btns = list.map((d, i) => {
      const [orbit, deg] = PLACES[i % PLACES.length];
      const [x, y] = placeOn(ORBITS[orbit], deg);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'orrery-node';
      b.style.left = (x / 10) + '%';
      b.style.top = (y / 6.4) + '%';
      b.style.setProperty('--float', `${(i % 3) * 1.3}s`);
      b.dataset.x = x;
      b.dataset.y = y;
      b.setAttribute('aria-controls', core.id);
      b.setAttribute('aria-expanded', 'false');
      b.innerHTML = `<span class="node-planet">${glyph(d.glyph)}</span><span class="node-label"><span class="node-kicker">${esc(d.entries[0].shortTime)}</span>${esc(d.title)}</span>`;
      nodes.appendChild(b);
      return b;
    });

    function drawLink(i) {
      if (i < 0) { link.classList.remove('is-on'); return; }
      link.setAttribute('x2', btns[i].dataset.x);
      link.setAttribute('y2', btns[i].dataset.y);
      link.classList.remove('is-on');
      void link.getBoundingClientRect();
      link.classList.add('is-on');
    }
    function swap(html, mode) {
      core.dataset.mode = mode;
      core.classList.remove('is-swapping');
      void core.offsetWidth;
      core.innerHTML = html;
      core.classList.add('is-swapping');
    }
    function preview(i) {
      if (expanded >= 0 || i === previewing) return;
      previewing = i;
      btns.forEach((b, k) => b.classList.toggle('is-active', k === i));
      drawLink(i);
      swap(previewHTML(list[i]), 'preview');
    }
    function expand(i) {
      if (expanded === i) { collapse(true); return; }
      expanded = i;
      previewing = i;
      btns.forEach((b, k) => {
        b.classList.toggle('is-active', k === i);
        b.setAttribute('aria-expanded', String(k === i));
      });
      root.classList.add('is-expanded');
      drawLink(i);
      swap(detailHTML(list[i]), 'detail');
    }
    function collapse(refocus) {
      if (expanded < 0) return;
      const i = expanded;
      expanded = -1;
      previewing = -1;
      btns.forEach(b => b.setAttribute('aria-expanded', 'false'));
      root.classList.remove('is-expanded');
      preview(i);
      if (refocus) btns[i].focus();
    }

    btns.forEach((b, i) => {
      b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') preview(i); });
      b.addEventListener('focus', () => preview(i));
      b.addEventListener('click', () => expand(i));
    });
    core.addEventListener('click', e => { if (e.target.closest('[data-core-close]')) collapse(true); });
    root.addEventListener('keydown', e => { if (e.key === 'Escape' && expanded >= 0) { e.preventDefault(); collapse(true); } });
  }

  function initStations(list) {
    const ul = document.querySelector('[data-stations]');
    if (!ul) return;
    ul.innerHTML = list.map((d, i) => `
      <li class="station reveal" style="--d:${i % 3}">
        <button type="button" class="station-head" aria-expanded="false" aria-controls="station-${esc(d.id)}">
          <span class="station-orbit">${glyph(d.glyph)}</span>
          <span class="station-text">
            <span class="station-kicker">${esc(d.kicker)} · ${esc(d.entries.map(e => e.shortTime).join(' & '))}</span>
            <span class="station-title">${esc(d.title)}</span>
            <span class="station-summary">${esc(d.summary)}</span>
          </span>
          <span class="station-toggle" aria-hidden="true"></span>
        </button>
        <div class="station-body" id="station-${esc(d.id)}" hidden>
          ${d.entries.map(e => `
            <div class="station-entry">
              <p class="core-entry-time">${esc(e.time)}</p>
              <p class="core-entry-title">${esc(e.title)}</p>
              <p class="core-entry-desc">${esc(e.description)}</p>
            </div>`).join('')}
          <a class="text-link" href="#m-${esc(d.entries[0].id)}">Find it on the journey</a>
        </div>
      </li>`).join('');
    ul.querySelectorAll('.station-head').forEach(btn => {
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        const body = document.getElementById(btn.getAttribute('aria-controls'));
        body.hidden = open;
        btn.parentElement.classList.toggle('is-open', !open);
      });
    });
  }

  A.discover = {
    init() {
      const list = items();
      initOrrery(list);
      initStations(list);
    },
    glyph
  };
})(window.ANVAYA);
