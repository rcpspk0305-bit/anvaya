/**
 * Chapter 04 — The People Behind ANVAYA.
 * Circular portraits on a horizontal, auto-advancing track. The portrait in the centre is
 * lit (gold orbit ring, slow zoom); neighbours recede with scale and dimming. Autoplay pauses
 * on hover, focus, touch, when the chapter is off-screen, and in reduced-motion mode.
 * Names, roles and photographs come from config.faculty.
 */
(function (A) {
  'use strict';
  const { esc } = A.util;
  const C = A.config;
  const INTERVAL = 3800;

  function render(root) {
    root.innerHTML = C.faculty.map((p, i) => `
      <figure class="portrait" data-index="${i}">
        <div class="portrait-media">
          <span class="portrait-ring" aria-hidden="true"></span>
          <div class="arch">
            ${p.image
              ? `<img class="arch-img" src="${esc(p.image)}" alt="Portrait of ${esc(p.name)}" decoding="async" data-initials="${esc(p.initials)}">`
              : `<span class="arch-monogram" aria-hidden="true">${esc(p.initials)}</span>`}
            <span class="arch-light" aria-hidden="true"></span>
          </div>
        </div>
        <figcaption>
          <span class="portrait-role">${esc(p.honorific)}</span>
          <span class="portrait-name">${esc(p.name)}</span>
          <span class="portrait-dept">${esc(p.department)}</span>
        </figcaption>
      </figure>`).join('');

    // a missing photograph falls back to the monogram — never a broken image
    root.querySelectorAll('.arch-img').forEach(img => {
      const fallback = () => {
        const m = document.createElement('span');
        m.className = 'arch-monogram';
        m.setAttribute('aria-hidden', 'true');
        m.textContent = img.dataset.initials;
        img.replaceWith(m);
      };
      if (img.complete && !img.naturalWidth) fallback(); else img.addEventListener('error', fallback, { once: true });
    });
  }

  function carousel(root) {
    const wrap = root.parentElement;
    const items = [...root.querySelectorAll('.portrait')];
    const prev = wrap.querySelector('[data-portraits-prev]');
    const next = wrap.querySelector('[data-portraits-next]');
    const dotsEl = wrap.querySelector('[data-portraits-dots]');
    let active = -1, visible = false, hover = false, focus = false, holdUntil = 0;

    dotsEl.innerHTML = items.map((_, i) => `<button type="button" class="pdot" aria-label="Show ${esc(C.faculty[i].name)}"></button>`).join('');
    const dots = [...dotsEl.children];

    const behavior = () => (A.motion.reduced ? 'auto' : 'smooth');
    const centreOf = el => el.offsetLeft + el.offsetWidth / 2;
    function goTo(i, user) {
      const n = (i + items.length) % items.length;
      root.scrollTo({ left: centreOf(items[n]) - root.clientWidth / 2, behavior: behavior() });
      if (user) holdUntil = Date.now() + 9000;
    }

    // coverflow: scale and dim each portrait by its distance from the centre of the track
    function update() {
      const mid = root.scrollLeft + root.clientWidth / 2;
      let best = 0, bestD = Infinity;
      items.forEach((el, i) => {
        const d = (centreOf(el) - mid) / el.offsetWidth;
        el.style.setProperty('--k', Math.min(1, Math.abs(d)).toFixed(3));
        if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
      });
      if (best !== active) {
        active = best;
        items.forEach((el, i) => el.classList.toggle('is-active', i === active));
        dots.forEach((d, i) => d.setAttribute('aria-current', String(i === active)));
      }
      prev.disabled = active <= 0;
      next.disabled = active >= items.length - 1;
    }
    let raf = 0;
    root.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });

    prev.addEventListener('click', () => goTo(active - 1, true));
    next.addEventListener('click', () => goTo(active + 1, true));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i, true)));
    items.forEach((el, i) => el.addEventListener('click', () => { if (i !== active) goTo(i, true); }));
    root.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1, true); }
    });

    // autoplay, with considerate pauses
    wrap.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hover = true; });
    wrap.addEventListener('pointerleave', () => { hover = false; });
    wrap.addEventListener('focusin', () => { focus = true; });
    wrap.addEventListener('focusout', () => { focus = false; });
    root.addEventListener('touchstart', () => { holdUntil = Date.now() + 9000; }, { passive: true });
    root.addEventListener('wheel', () => { holdUntil = Date.now() + 9000; }, { passive: true });
    const playing = () => visible && !hover && !focus && !document.hidden && !A.motion.reduced && Date.now() > holdUntil;
    setInterval(() => {
      const on = playing();
      wrap.classList.toggle('is-playing', on);
      if (on) goTo(active >= items.length - 1 ? 0 : active + 1, false);
    }, INTERVAL);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.35 }).observe(wrap);

    if ('ResizeObserver' in window) new ResizeObserver(() => update()).observe(root);
    update();
    A.motion.onChange(update);
  }

  function guestInvitation() {
    const inv = document.querySelector('[data-guest-invitation]');
    const src = C.assets.guestInvitation;
    if (!inv || !src) return;
    const probe = new Image();
    probe.onload = () => {
      const img = inv.querySelector('[data-guest-img]');
      img.src = src;
      img.alt = `The ${C.brand.department} freshers' party invitation for ${C.brand.name}, sent to our guests of honour`;
      inv.hidden = false;
      document.querySelector('[data-letters]').classList.add('has-invite');
      if (A.thread) A.thread.rebuild();
    };
    probe.src = src;
    inv.querySelector('[data-guest-open]').addEventListener('click', () => {
      A.lightbox.open([{ src, alt: `The ${C.brand.department} freshers' party invitation for ${C.brand.name}`, caption: 'The invitation to our guests of honour', filename: `${C.brand.name}-2026-guest-invitation.jpg` }]);
    });
  }

  A.people = {
    init() {
      const root = document.querySelector('[data-portraits]');
      if (!root) return;
      render(root);
      carousel(root);
      guestInvitation();

      const co = document.querySelector('[data-coordinators]');
      if (co && C.coordinatorsVerified && C.coordinators.length) {
        co.hidden = false;
        co.innerHTML = `<h3 class="eyebrow">The organising committee · ${esc(C.brand.department)}</h3>
          <ul class="co-list">${C.coordinators.map(c => `<li><span class="co-name">${esc(c.name)}</span><span class="co-role">${esc(c.role)}</span></li>`).join('')}</ul>`;
      }
    }
  };
})(window.ANVAYA);
