/**
 * Lightbox — keyboard (←/→/Esc), touch-swipe and button navigation over a list of images.
 * Built on <dialog> so focus is contained while open and returned on close.
 */
(function (A) {
  'use strict';
  let dlg, img, cap, count, prev, next, dl, items = [], idx = 0, opener = null;

  function show(i) {
    idx = (i + items.length) % items.length;
    const it = items[idx];
    dlg.classList.remove('is-ready');
    img.onload = () => dlg.classList.add('is-ready');
    img.src = it.src;
    img.alt = it.alt || '';
    cap.textContent = it.caption || '';
    cap.hidden = !it.caption;
    count.textContent = items.length > 1 ? `${idx + 1} / ${items.length}` : '';
    prev.hidden = next.hidden = items.length < 2;
    dl.href = it.download || it.src;
    dl.setAttribute('download', it.filename || '');
    if (img.complete && img.naturalWidth) dlg.classList.add('is-ready');
  }

  function close() {
    if (!dlg.open) return;
    dlg.close();
  }

  A.lightbox = {
    init() {
      dlg = document.querySelector('[data-lightbox]');
      if (!dlg) return;
      img = dlg.querySelector('[data-lb-img]');
      cap = dlg.querySelector('[data-lb-caption]');
      count = dlg.querySelector('[data-lb-count]');
      prev = dlg.querySelector('[data-lb-prev]');
      next = dlg.querySelector('[data-lb-next]');
      dl = dlg.querySelector('[data-lb-download]');
      prev.addEventListener('click', () => show(idx - 1));
      next.addEventListener('click', () => show(idx + 1));
      dlg.querySelector('[data-lb-close]').addEventListener('click', close);
      dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
      dlg.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft' && items.length > 1) { e.preventDefault(); show(idx - 1); }
        if (e.key === 'ArrowRight' && items.length > 1) { e.preventDefault(); show(idx + 1); }
      });
      dlg.addEventListener('close', () => {
        document.documentElement.classList.remove('lightbox-open');
        if (opener && opener.isConnected) opener.focus();
      });
      // swipe
      let sx = null, sy = null;
      dlg.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { sx = e.clientX; sy = e.clientY; } });
      dlg.addEventListener('pointerup', e => {
        if (sx === null) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        sx = sy = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4 && items.length > 1) show(idx + (dx < 0 ? 1 : -1));
      });
    },
    open(list, i = 0) {
      if (!dlg || !list.length) return;
      opener = document.activeElement;
      items = list;
      show(i);
      document.documentElement.classList.add('lightbox-open');
      dlg.showModal();
      dlg.querySelector('[data-lb-close]').focus();
    },
    close
  };
})(window.ANVAYA);
