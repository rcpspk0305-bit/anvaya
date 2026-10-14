/**
 * Chapter 05 — Echoes of the Past. A midnight-lake gallery.
 *  - With photographs in config.memories: floating frames with reflections on a horizontal track,
 *    moved by vertical scroll on wide screens (sticky stage) and by native swipe / scroll-snap on
 *    touch screens; every frame opens the shared lightbox.
 *  - Without photographs (current state): an intentional still lake that points to the real
 *    memory archive. No images are invented.
 */
(function (A) {
  'use strict';
  const { esc, clamp } = A.util;
  const C = A.config;

  const ext = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';

  function emptyState(root) {
    root.classList.add('lake--still');
    root.innerHTML = `
      <div class="lake-still" aria-hidden="true">
        <span class="lake-moon"></span>
        <span class="lake-moon lake-moon--reflected"></span>
        <span class="lake-ripple" style="--r:0"></span>
        <span class="lake-ripple" style="--r:1"></span>
        <span class="lake-ripple" style="--r:2"></span>
      </div>
      <div class="lake-copy reveal">
        <p class="eyebrow">The lake is still</p>
        <p class="lake-text">Photographs from earlier ${esc(C.brand.department)} freshers’ celebrations live in the department’s memory archive. The moments of ${esc(C.brand.fullName)} will surface on this lake after ${esc(C.datetime.shortDate)}.</p>
        <a class="btn btn-line" href="${esc(C.links.driveGalleryUrl)}" target="_blank" rel="noopener noreferrer">
          <span>Open the memory archive</span>${ext}
        </a>
      </div>`;
  }

  function gallery(root, list) {
    root.classList.add('lake--gallery');
    root.innerHTML = `
      <div class="lake-stage">
        <ul class="lake-track" data-track>
          ${list.map((m, i) => `
            <li class="lake-item" style="--i:${i};--lift:${[0, 38, 12, 52, 20][i % 5]}px;--w:${[30, 24, 34, 26, 28][i % 5]}">
              <button type="button" class="lake-frame" data-index="${i}" aria-label="Open photograph: ${esc(m.alt || m.caption || 'memory ' + (i + 1))}">
                <img src="${esc(m.src)}" alt="${esc(m.alt || '')}" loading="lazy" decoding="async">
              </button>
              <span class="lake-reflect" aria-hidden="true"><img src="${esc(m.src)}" alt="" loading="lazy" decoding="async"></span>
              ${m.caption ? `<p class="lake-caption">${esc(m.caption)}</p>` : ''}
            </li>`).join('')}
        </ul>
      </div>
      <p class="lake-note"><a class="text-link" href="${esc(C.links.driveGalleryUrl)}" target="_blank" rel="noopener noreferrer">The full memory archive</a></p>`;

    const items = list.map(m => ({ src: m.src, alt: m.alt, caption: m.caption }));
    root.querySelectorAll('.lake-frame').forEach(b => b.addEventListener('click', () => A.lightbox.open(items, +b.dataset.index)));

    // scroll-driven travel on wide, fine-pointer screens; native horizontal scroll elsewhere
    const track = root.querySelector('[data-track]');
    const stage = root.querySelector('.lake-stage');
    const driven = () => !A.motion.isCoarse && window.innerWidth >= 900 && !A.motion.reduced;
    let dist = 0;
    function measure() {
      root.classList.toggle('is-driven', driven());
      if (!driven()) { root.style.height = ''; track.style.transform = ''; return; }
      dist = Math.max(0, track.scrollWidth - stage.clientWidth);
      root.style.height = `calc(100vh + ${dist}px)`;
    }
    function update(f) {
      if (!driven()) return;
      const r = root.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - f.vh));
      track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
    }
    // keyboard: bring a focused frame into the stage
    root.addEventListener('focusin', e => {
      const li = e.target.closest('.lake-item');
      if (!li || !driven()) return;
      const target = li.offsetLeft - stage.clientWidth * 0.3;
      const p = clamp(target / Math.max(1, dist));
      const top = root.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + p * (root.offsetHeight - window.innerHeight), behavior: A.motion.reduced ? 'auto' : 'smooth' });
    });
    measure();
    A.util.onResize(measure);
    A.motion.onChange(measure);
    let visible = false;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '10% 0px' }).observe(root);
    A.ticker.add(update, () => visible && A.ticker.frame.scrollDirty);
  }

  A.memories = {
    init() {
      const root = document.querySelector('[data-memories]');
      if (!root) return;
      const list = (C.memories || []).filter(m => m && m.src);
      if (list.length) gallery(root, list); else emptyState(root);
    }
  };
})(window.ANVAYA);
