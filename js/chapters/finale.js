/**
 * Chapter 07 — The Final Reveal. The moon and the city return; a golden thread crosses the
 * whole scene and resolves into the ANVAYA emblem, echoing the opening.
 */
(function (A) {
  'use strict';
  const C = A.config;
  let played = false;

  A.finale = {
    init() {
      const stage = document.querySelector('[data-finale]');
      const mark = document.getElementById('finale-wordmark');
      if (!stage || !mark) return;

      // keep the emblem hidden until the thread arrives (unless motion is reduced)
      if (!A.motion.reduced) A.logo.hide(mark);

      const io = new IntersectionObserver(async entries => {
        if (played || !entries.some(e => e.isIntersecting)) return;
        played = true;
        io.disconnect();
        stage.classList.add('is-playing');
        if (A.motion.reduced) { A.logo.finish(mark); stage.classList.add('is-revealed'); return; }
        await A.util.wait(350);
        await A.scene.runThread('finale', { duration: 2.4 });
        A.scene.clearThread(1.2);
        stage.classList.add('is-revealed');
        A.sound.chime();
        await A.logo.reveal(mark, { speed: 1.25 });
      }, { threshold: 0.45 });
      io.observe(stage);

      A.motion.onChange(reduced => { if (reduced) { A.logo.finish(mark); stage.classList.add('is-revealed'); } });

      document.querySelectorAll('[data-artwork-open]').forEach(b => b.addEventListener('click', () => {
        A.lightbox.open([{ src: C.assets.artwork, alt: 'The official ANVAYA 2026 artwork: the ANVAYA lettering beside a textured moon and a city skyline reflected in water, surrounded by teal, burgundy and gold marble.', caption: 'ANVAYA 2026 — official artwork', filename: 'ANVAYA-2026-artwork.jpg' }]);
      }));
      document.querySelectorAll('[data-replay]').forEach(b => b.addEventListener('click', () => A.intro && A.intro.replay()));
    }
  };
})(window.ANVAYA);
