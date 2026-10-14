/**
 * Bootstrap. Every system starts inside its own guard, so one failure never hides content:
 * if the opening cannot run, the visitor lands directly in the site.
 */
(function (A) {
  'use strict';
  const { clamp } = A.util;
  const html = document.documentElement;

  function safe(name, fn) {
    try { fn(); } catch (err) { console.error(`[anvaya] ${name} failed to start`, err); }
  }

  /* ---------------- scene choreography across the page ---------------- */
  let heroDoc = null, finaleDoc = null, active = 'hero';
  const hero = () => document.getElementById('world');
  const finale = () => document.getElementById('finale');

  function docRect(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height };
  }
  function measureAnchors() {
    const hm = document.getElementById('hero-wordmark');
    const fm = document.getElementById('finale-wordmark');
    if (hm) heroDoc = docRect(hm);
    if (fm) finaleDoc = docRect(fm);
  }
  // hero: the scene drifts at ~half the scroll speed, so content slides past the moon with depth
  const heroAnchor = () => ({ x: heroDoc.x, y: heroDoc.y - window.scrollY * 0.55, w: heroDoc.w, h: heroDoc.h });
  const finaleAnchor = () => ({ x: finaleDoc.x, y: finaleDoc.y - window.scrollY, w: finaleDoc.w, h: finaleDoc.h });

  function sceneByScroll(f) {
    if (html.classList.contains('intro-active') || !heroDoc) return;
    const h = hero(), fin = finale();
    const heroVis = 1 - clamp(f.scrollY / Math.max(1, h.offsetHeight * 0.85));
    const ft = fin.getBoundingClientRect().top;
    const finVis = clamp((f.vh - ft) / (f.vh * 0.75));
    if (finVis > 0.001) {
      if (active !== 'finale') { active = 'finale'; A.scene.setAnchor(finaleAnchor); }
      A.scene.setVisible(finVis);
      A.ambient.setFocus(-0.2, 0.15);
    } else {
      if (active !== 'hero') { active = 'hero'; A.scene.setAnchor(heroAnchor); }
      A.scene.setVisible(heroVis);
    }
  }

  const main = {
    attachHeroScene() {
      measureAnchors();
      active = 'hero';
      A.scene.setAnchor(heroAnchor, 0);
      A.scene.setVisible(1, true);
      A.ambient.setLight(0.85);
      A.ambient.setDust(0.55);
    },
    onEntered() {
      measureAnchors();
      A.thread.rebuild();
      A.nav.measure();
      A.ticker.frame.scrollDirty = true;
      A.ticker.wake();
    }
  };
  A.main = main;

  /* ---------------- reveal-on-scroll (masked, once) ---------------- */
  function reveals() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    els.forEach(e => io.observe(e));
    // late-rendered chapters register their .reveal elements too
    new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      if (n.classList.contains('reveal')) io.observe(n);
      n.querySelectorAll && n.querySelectorAll('.reveal').forEach(x => io.observe(x));
    }))).observe(document.getElementById('main'), { childList: true, subtree: true });
  }

  /* ---------------- magnetic buttons (fine pointers only, restrained) ---------------- */
  function magnetic() {
    if (A.motion.isCoarse) return;
    document.addEventListener('pointermove', e => {
      const b = e.target.closest && e.target.closest('[data-magnetic]');
      document.querySelectorAll('[data-magnetic].is-pulled').forEach(x => { if (x !== b) { x.classList.remove('is-pulled'); x.style.transform = ''; } });
      if (!b || A.motion.reduced) return;
      const r = b.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      b.classList.add('is-pulled');
      b.style.transform = `translate(${(dx * 6).toFixed(2)}px, ${(dy * 5).toFixed(2)}px)`;
    }, { passive: true });
  }

  /* ---------------- start ---------------- */
  safe('bindings', () => A.world.init());
  safe('ambient', () => A.ambient.init());
  safe('scene', () => A.scene.init());
  safe('lightbox', () => A.lightbox.init());
  safe('navigation', () => A.nav.init());
  safe('discover', () => A.discover.init());
  safe('journey', () => A.journey.init());
  safe('people', () => A.people.init());
  safe('memories', () => A.memories.init());
  safe('invitation', () => A.invitation.init());
  safe('finale', () => A.finale.init());
  safe('thread', () => A.thread.init());
  safe('reveals', reveals);
  safe('magnetic', magnetic);

  A.nav.onChapter(c => {
    A.ambient.setMood(c.mood);
    A.ambient.setLight(c.id === 'world' || c.id === 'finale' ? 0.85 : 0.6);
  });
  A.ticker.add(sceneByScroll, () => A.ticker.frame.scrollDirty);
  A.util.onResize(() => { measureAnchors(); A.scene.invalidate(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureAnchors);
  window.addEventListener('load', measureAnchors);

  // the opening starts last; if anything in it fails, enter the site directly
  try {
    A.intro.init();
  } catch (err) {
    console.error('[anvaya] intro failed to start', err);
    html.classList.remove('intro-active');
    html.classList.add('world-entered');
    const aw = document.getElementById('awakening');
    if (aw) aw.hidden = true;
    document.querySelectorAll('#main, [data-topbar], [data-rail]').forEach(el => { el.inert = false; });
    safe('scene fallback', () => main.attachHeroScene());
  }
})(window.ANVAYA);
