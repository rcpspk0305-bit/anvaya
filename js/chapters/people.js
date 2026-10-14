/**
 * Chapter 04 — The People Behind ANVAYA. Architectural arch portraits for the guests of honour.
 * Names, roles and photographs come from config.faculty; a person without a photograph gets a
 * monogram arch rather than an invented image.
 */
(function (A) {
  'use strict';
  const { esc } = A.util;
  const C = A.config;

  A.people = {
    init() {
      const root = document.querySelector('[data-portraits]');
      if (!root) return;
      root.innerHTML = C.faculty.map((p, i) => `
        <figure class="portrait reveal ${i < 2 ? 'portrait--lead' : ''}" style="--d:${i}">
          <div class="arch">
            ${p.image
              ? `<img class="arch-img" src="${esc(p.image)}" alt="Portrait of ${esc(p.name)}" loading="lazy" decoding="async" data-initials="${esc(p.initials)}">`
              : `<span class="arch-monogram" aria-hidden="true">${esc(p.initials)}</span>`}
            <span class="arch-light" aria-hidden="true"></span>
          </div>
          <figcaption>
            <span class="portrait-role">${esc(p.honorific)}</span>
            <span class="portrait-name">${esc(p.name)}</span>
            <span class="portrait-dept">${esc(p.department)}</span>
          </figcaption>
        </figure>`).join('');

      // a missing photograph falls back to the monogram arch — never a broken image
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

      // pointer-follow light on the arch (desktop only, restrained)
      if (!A.motion.isCoarse) {
        root.querySelectorAll('.portrait').forEach(fig => {
          fig.addEventListener('pointermove', e => {
            const r = fig.getBoundingClientRect();
            fig.style.setProperty('--lx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
            fig.style.setProperty('--ly', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
          });
        });
      }

      // horizontal scroller: arrow buttons move one portrait at a time and disable at the ends
      const prev = document.querySelector('[data-portraits-prev]');
      const next = document.querySelector('[data-portraits-next]');
      const step = () => {
        const item = root.querySelector('.portrait');
        return item ? item.getBoundingClientRect().width + parseFloat(getComputedStyle(root).columnGap || 0) : root.clientWidth * 0.8;
      };
      const behavior = () => (A.motion.reduced ? 'auto' : 'smooth');
      const syncNav = () => {
        const max = root.scrollWidth - root.clientWidth - 2;
        prev.disabled = root.scrollLeft <= 2;
        next.disabled = root.scrollLeft >= max;
        root.parentElement.classList.toggle('is-scrollable', max > 2);
      };
      prev.addEventListener('click', () => root.scrollBy({ left: -step(), behavior: behavior() }));
      next.addEventListener('click', () => root.scrollBy({ left: step(), behavior: behavior() }));
      root.addEventListener('scroll', syncNav, { passive: true });
      root.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); root.scrollBy({ left: step(), behavior: behavior() }); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); root.scrollBy({ left: -step(), behavior: behavior() }); }
      });
      if ('ResizeObserver' in window) new ResizeObserver(syncNav).observe(root);
      syncNav();

      // the printed invitation for our guests of honour — shown only when the image exists
      const inv = document.querySelector('[data-guest-invitation]');
      const src = C.assets.guestInvitation;
      if (inv && src) {
        const probe = new Image();
        probe.onload = () => {
          const img = inv.querySelector('[data-guest-img]');
          img.src = src;
          img.alt = `The ${C.brand.department} freshers' party invitation for ${C.brand.name}, sent to our guests of honour`;
          inv.hidden = false;
          document.querySelector('[data-letters]').classList.add('has-invite');
          A.thread && A.thread.rebuild();
        };
        probe.src = src;
        inv.querySelector('[data-guest-open]').addEventListener('click', () => {
          A.lightbox.open([{ src, alt: `The ${C.brand.department} freshers' party invitation for ${C.brand.name}`, caption: 'The invitation to our guests of honour', filename: `${C.brand.name}-2026-guest-invitation.jpg` }]);
        });
      }

      const co = document.querySelector('[data-coordinators]');
      if (co && C.coordinatorsVerified && C.coordinators.length) {
        co.hidden = false;
        co.innerHTML = `<h3 class="eyebrow">The organising committee · ${esc(C.brand.department)}</h3>
          <ul class="co-list">${C.coordinators.map(c => `<li><span class="co-name">${esc(c.name)}</span><span class="co-role">${esc(c.role)}</span></li>`).join('')}</ul>`;
      }
    }
  };
})(window.ANVAYA);
