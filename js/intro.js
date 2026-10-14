/**
 * IntroExperience (The Awakening) + WorldTransition (Enter ANVAYA).
 *
 *  A  Before the beginning — near darkness; marble light slowly rises, dust drifts.
 *  B  The world awakens — a point of gold draws a thread that becomes an orbit; the moon,
 *     the skyline and the water emerge; further orbits draw in.
 *  C  ANVAYA emerges — the official lettering is revealed by travelling light.
 *  D  Invitation — tagline, Explore, hint. Emblem and Explore both enter.
 *
 * Skip intro (or Esc) enters immediately at any point. Deep links (#chapter) bypass the intro.
 */
(function (A) {
  'use strict';
  const { tween, wait, ease } = A.util;
  const html = document.documentElement;
  const SEEN = 'anvaya.introSeen';

  let root, mark, signal = { aborted: false }, entering = false, entered = false;

  const seen = () => { try { return sessionStorage.getItem(SEEN) === '1'; } catch (e) { return false; } };
  const markSeen = () => { try { sessionStorage.setItem(SEEN, '1'); } catch (e) { /* ignore */ } };

  const heroMark = () => document.getElementById('hero-wordmark');
  const fixedRect = el => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };

  function lockPage(on) {
    html.classList.toggle('intro-active', on);
    const main = document.getElementById('main');
    if (main) main.inert = on;
    document.querySelector('[data-topbar]').inert = on;
    document.querySelector('[data-rail]').inert = on;
  }

  /* ---------------- A → D ---------------- */
  async function play({ quick = false } = {}) {
    const S = A.scene.state;
    signal = { aborted: false };
    const sig = signal;
    lockPage(true);
    root.hidden = false;
    root.classList.remove('is-entering', 'is-gone', 'is-invite');
    root.classList.add('is-playing');
    A.scene.setAnchor(() => fixedRect(mark));
    A.scene.setVisible(1, true);
    A.ambient.setFocus(-0.25, 0.1);
    requestAnimationFrame(() => root.focus({ preventScroll: true }));

    if (A.motion.reduced) {
      Object.assign(S, { moon: 1, city: 1, water: 1, glints: 1, orbits: [1, 1, 1], dolly: 0, energy: 0 });
      A.ambient.setLight(0.6, true);
      A.logo.finish(mark);
      root.classList.add('is-invite');
      A.scene.invalidate();
      return;
    }

    Object.assign(S, { moon: 0, city: 0, water: 0, glints: 0, orbits: [0, 0, 0], dolly: 0, energy: 0, spin: 1, bright: 0 });
    A.logo.hide(mark);

    if (quick) {
      A.ambient.setLight(0.55);
      A.ambient.setDust(0.7);
      const all = tween({ duration: 1.4, easing: ease.outCubic, signal: sig, update: v => { S.moon = S.city = S.water = S.glints = v; S.orbits = [v, v, v]; } });
      await wait(300);
      await A.logo.reveal(mark, { speed: 1.6, signal: sig });
      await all;
      if (!sig.aborted) root.classList.add('is-invite');
      return;
    }

    // Scene A — before the beginning
    A.ambient.setLight(0, true);
    A.ambient.setDust(0);
    await wait(250);
    A.ambient.setLight(0.3);
    A.ambient.setDust(0.45);
    await wait(1500);
    if (sig.aborted) return;

    // Scene B — a point of light becomes an orbit; the world assembles around it
    const thread = A.scene.runThread('intro', { duration: 3.4 }).then(() => {
      if (sig.aborted) return;
      S.orbits[0] = 1;
      A.scene.clearThread(1.0);
    });
    await wait(900);
    A.ambient.setLight(0.5);
    const moon = tween({ duration: 3.2, easing: ease.inOutSine, signal: sig, update: v => { S.moon = v; } });
    await wait(900);
    const city = tween({ duration: 2.8, easing: ease.outCubic, signal: sig, update: v => { S.city = v; } });
    const water = tween({ duration: 2.6, delay: 0.5, easing: ease.inOutSine, signal: sig, update: v => { S.water = v; } });
    await thread;
    if (sig.aborted) return;
    tween({ duration: 1.8, easing: ease.inOutCubic, signal: sig, update: v => { S.orbits[1] = v; } });
    tween({ duration: 2.4, delay: 0.4, easing: ease.inOutCubic, signal: sig, update: v => { S.orbits[2] = v; } });
    tween({ duration: 2, delay: 0.6, signal: sig, update: v => { S.glints = v; } });
    A.ambient.setLight(0.62);
    A.ambient.setDust(0.7);
    await Promise.all([moon, city, water]);
    if (sig.aborted) return;

    // Scene C — ANVAYA emerges
    await A.logo.reveal(mark, { signal: sig });
    if (sig.aborted) return;

    // Scene D — invitation to enter
    root.classList.add('is-invite');
  }

  /* ---------------- Enter ANVAYA ---------------- */
  function pulseAt(x, y) {
    const ring = document.createElement('span');
    ring.className = 'pulse-ring';
    ring.style.left = x + 'px';
    ring.style.top = y + 'px';
    root.appendChild(ring);
    setTimeout(() => ring.remove(), 1400);
  }

  function arrive() {
    // swap the scene's anchor to the hero wordmark while the threshold hides the cut
    lockPage(false);
    html.classList.add('world-entered');
    if (location.hash && location.hash.length > 1) {
      const t = document.querySelector(location.hash);
      if (t) t.scrollIntoView();
    } else window.scrollTo(0, 0);
    A.main.attachHeroScene();
    const S = A.scene.state;
    Object.assign(S, { dolly: 0, energy: 0, spin: 1, bright: 0, moon: 1, city: 1, water: 1, glints: 1, orbits: [1, 1, 1] });
    A.logo.finish(heroMark());
  }

  function finish() {
    root.hidden = true;
    root.classList.remove('is-playing', 'is-entering');
    entering = false;
    entered = true;
    markSeen();
    const h = document.getElementById('world-title');
    const main = document.getElementById('main');
    if (!location.hash) (h || main).focus({ preventScroll: true });
    A.ambient.flare(0);
    A.main.onEntered();
  }

  async function enter(evt) {
    if (entering || entered) return;
    entering = true;
    signal.aborted = true;
    A.sound.chime();

    // finish any part of the opening that was still drawing so the world is complete
    const S = A.scene.state;
    Object.assign(S, { moon: 1, city: 1, water: 1, glints: 1, orbits: [1, 1, 1] });
    if (S.thread) A.scene.clearThread(0.4);
    A.logo.finish(mark);
    root.classList.add('is-invite');

    if (A.motion.reduced) {
      root.classList.add('is-fading');
      arrive();
      await wait(300);
      root.classList.remove('is-fading');
      finish();
      return;
    }

    // 1. precise golden illumination from what was pressed
    const src = evt && evt.currentTarget ? evt.currentTarget.getBoundingClientRect() : mark.getBoundingClientRect();
    const px = evt && evt.clientX ? evt.clientX : src.left + src.width / 2;
    const py = evt && evt.clientY ? evt.clientY : src.top + src.height / 2;
    pulseAt(px, py);
    root.classList.add('is-entering');
    const th = root.querySelector('.threshold');
    const L = A.scene.layout();
    if (L) { th.style.setProperty('--tx', L.mx + 'px'); th.style.setProperty('--ty', L.my + 'px'); }

    // 2–3. energy runs through the orbits, which accelerate
    tween({ duration: 0.7, easing: ease.outCubic, update: v => { S.energy = v; } });
    tween({ duration: 1.5, easing: ease.inExpo, update: v => { S.spin = 1 + v * 18; } });
    // 4–5. the camera travels toward the moon and the city; near towers part with parallax
    tween({ duration: 1.55, delay: 0.2, easing: ease.inOutCubic, update: v => { S.dolly = v; S.bright = v; } });
    // 6. a luminous threshold
    const gTh = th.querySelector('.th-gold'), mTh = th.querySelector('.th-mineral');
    await tween({ duration: 0.55, delay: 1.05, easing: ease.inCubic, update: v => { gTh.style.opacity = v; A.ambient.flare(v * 0.8); } });

    arrive();
    // 7. gold disperses into teal and burgundy; 8. the world is revealed
    mTh.style.opacity = 1;
    tween({ duration: 0.9, easing: ease.outCubic, update: v => { gTh.style.opacity = 1 - v; gTh.style.transform = `scale(${1 + v * 0.6})`; A.ambient.flare(0.8 * (1 - v)); } });
    await tween({ duration: 1.1, delay: 0.25, easing: ease.inOutSine, update: v => { mTh.style.opacity = 1 - v; mTh.style.transform = `scale(${1 + v * 0.25})`; } });
    gTh.style.cssText = '';
    mTh.style.cssText = '';
    finish();
  }

  /** Skip: the shortest graceful path into the site. */
  async function skip() {
    if (entered || entering) return;
    entering = true;
    signal.aborted = true;
    A.scene.clearThread(0.2);
    root.classList.add('is-fading');
    if (!A.motion.reduced) await wait(450);
    arrive();
    root.classList.remove('is-fading');
    finish();
  }

  A.intro = {
    init() {
      root = document.getElementById('awakening');
      if (!root) return;
      mark = document.getElementById('aw-wordmark');
      root.querySelectorAll('[data-enter]').forEach(b => b.addEventListener('click', enter));
      root.querySelector('[data-skip]').addEventListener('click', skip);
      A.sound.bind(root.querySelector('[data-sound]'));
      root.addEventListener('keydown', e => {
        if (e.key === 'Escape') { e.preventDefault(); skip(); }
        // keep focus inside the opening while it is shown
        if (e.key === 'Tab') {
          const f = [...root.querySelectorAll('button')];
          const first = f[0], last = f[f.length - 1];
          if (e.shiftKey && (document.activeElement === first || document.activeElement === root)) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
      const emblem = root.querySelector('.aw-emblem');
      emblem.addEventListener('pointerenter', () => { if (root.classList.contains('is-invite')) A.logo.shimmer(mark); });
      emblem.addEventListener('focus', () => { if (root.classList.contains('is-invite')) A.logo.shimmer(mark); });

      const deepLink = location.hash && location.hash.length > 1 && document.querySelector(location.hash);
      if (deepLink) {
        // visitors arriving at a specific chapter go straight there
        root.hidden = true;
        lockPage(false);
        html.classList.add('world-entered');
        entered = true;
        A.main.attachHeroScene();
        Object.assign(A.scene.state, { moon: 1, city: 1, water: 1, glints: 1, orbits: [1, 1, 1] });
        A.main.onEntered();
        return;
      }
      play({ quick: seen() }).catch(err => {
        console.error('[anvaya] intro failed, entering directly', err);
        skip();
      });
    },
    replay() {
      if (entering) return;
      entered = false;
      window.scrollTo(0, 0);
      A.scene.setVisible(1, true);
      play({ quick: false }).catch(() => skip());
    },
    skip
  };
})(window.ANVAYA);
