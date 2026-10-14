/**
 * OrbitalNavigation — top bar, celestial progress rail (desktop), chapter sheet (all sizes).
 * Tracks the current chapter for the rest of the site (ambient mood, scene visibility).
 */
(function (A) {
  'use strict';
  const { clamp, esc } = A.util;

  let chapters = [], offsets = [], current = -1, docH = 1;
  const listeners = new Set();
  let railFill, railItems = [], menuItems = [], numEl, titleEl, topbar;

  function measure() {
    offsets = chapters.map(c => c.el.getBoundingClientRect().top + window.scrollY);
    docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }

  function setCurrent(i) {
    if (i === current) return;
    current = i;
    const c = chapters[i];
    if (!c) return;
    numEl.textContent = c.num;
    titleEl.textContent = c.title;
    [railItems, menuItems].forEach(list => list.forEach((a, k) => {
      if (k === i) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
    }));
    listeners.forEach(fn => fn(c, i));
  }

  function update(f) {
    const y = f.scrollY + f.vh * 0.45;
    let i = 0;
    for (let k = 0; k < offsets.length; k++) if (offsets[k] <= y) i = k;
    setCurrent(i);
    // bead travels between chapter nodes
    const a = offsets[i], b = offsets[i + 1] != null ? offsets[i + 1] : docH + f.vh;
    const within = clamp((y - a) / Math.max(1, b - a));
    const frac = chapters.length > 1 ? clamp((i + within) / (chapters.length - 1)) : 0;
    if (railFill) railFill.style.transform = `scaleY(${frac.toFixed(4)})`;
    topbar.classList.toggle('is-scrolled', f.scrollY > 24);
  }

  /* ---------------- chapter sheet ---------------- */
  let menu, openBtn, lastFocus = null;
  function openMenu() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    document.documentElement.classList.add('menu-open');
    openBtn.setAttribute('aria-expanded', 'true');
    document.getElementById('main').inert = true;
    requestAnimationFrame(() => {
      menu.classList.add('is-open');
      const cur = menu.querySelector('[aria-current]') || menu.querySelector('a');
      cur && cur.focus();
    });
  }
  function closeMenu(restore = true) {
    if (menu.hidden) return;
    menu.classList.remove('is-open');
    document.documentElement.classList.remove('menu-open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.getElementById('main').inert = false;
    const done = () => { menu.hidden = true; };
    if (A.motion.reduced) done(); else setTimeout(done, 320);
    if (restore && lastFocus) lastFocus.focus();
  }

  function trap(e) {
    if (menu.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key !== 'Tab') return;
    const f = [...menu.querySelectorAll('a, button')].filter(el => !el.disabled);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function bindMotionToggle() {
    const btn = document.querySelector('[data-motion-toggle]');
    if (!btn) return;
    const sync = () => {
      btn.setAttribute('aria-pressed', String(A.motion.reduced));
      btn.querySelector('.tool-label').textContent = A.motion.reduced ? 'Motion reduced' : 'Reduce motion';
    };
    btn.addEventListener('click', () => { A.motion.toggle(); sync(); });
    A.motion.onChange(sync);
    sync();
  }

  A.nav = {
    init() {
      topbar = document.querySelector('[data-topbar]');
      numEl = document.querySelector('[data-current-num]');
      titleEl = document.querySelector('[data-current-title]');
      chapters = [...document.querySelectorAll('[data-chapter]')].map(el => ({
        el, id: el.id, num: el.dataset.chapter, title: el.dataset.title, mood: parseFloat(el.dataset.mood || '0')
      }));

      const railList = document.querySelector('.rail-list');
      railFill = document.querySelector('.rail-fill');
      const menuList = document.querySelector('.menu-list');
      chapters.forEach((c, i) => {
        const li = document.createElement('li');
        li.style.setProperty('--i', i);
        li.innerHTML = `<a class="rail-node" href="#${esc(c.id)}"><span class="rail-dot" aria-hidden="true"></span><span class="rail-label"><span class="rail-num">${esc(c.num)}</span> ${esc(c.title)}</span></a>`;
        railList.appendChild(li);
        railItems.push(li.firstElementChild);

        const mi = document.createElement('li');
        mi.style.setProperty('--i', i);
        mi.innerHTML = `<a class="menu-link" href="#${esc(c.id)}"><span class="menu-num">${esc(c.num)}</span><span class="menu-title">${esc(c.title)}</span></a>`;
        menuList.appendChild(mi);
        menuItems.push(mi.firstElementChild);
      });

      menu = document.getElementById('menu');
      openBtn = document.querySelector('[data-menu-open]');
      openBtn.addEventListener('click', openMenu);
      menu.querySelector('[data-menu-close]').addEventListener('click', () => closeMenu());
      menu.addEventListener('click', e => { if (e.target === menu) closeMenu(); });
      menuItems.forEach(a => a.addEventListener('click', () => closeMenu(false)));
      document.addEventListener('keydown', trap);

      bindMotionToggle();
      A.sound.bind(topbar.querySelector('[data-sound]'));

      measure();
      if ('ResizeObserver' in window) new ResizeObserver(() => { measure(); A.ticker.frame.scrollDirty = true; A.ticker.wake(); }).observe(document.getElementById('main'));
      A.util.onResize(measure);
      A.ticker.add(update, () => A.ticker.frame.scrollDirty);
      A.ticker.frame.scrollDirty = true;
      A.ticker.wake();
    },
    onChapter(fn) { listeners.add(fn); },
    get current() { return chapters[current]; },
    measure
  };
})(window.ANVAYA);
