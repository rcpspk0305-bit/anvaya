/**
 * Chapter 06 — InvitationGenerator. Draws a personal ANVAYA invitation on a 1080×1350 canvas,
 * entirely in the browser. The name is never stored or sent anywhere.
 */
(function (A) {
  'use strict';
  const C = A.config;
  const W = 1080, H = 1350;
  const GOLD = '#DABD7C', GOLD_HI = '#F0D9A4', IVORY = '#F5E8CC';

  let canvas, ctx, input, status, saveBtn, shareBtn, art, mark, raf = 0;

  const load = src => new Promise((res, rej) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = rej; i.src = src; });
  const cleanName = v => v.replace(/\s+/g, ' ').trim().slice(0, 32);

  function tracked(text, x, y, size, spacing, color, weight = 500) {
    ctx.font = `${weight} ${size}px Manrope, system-ui, sans-serif`;
    ctx.fillStyle = color;
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing = `${spacing}px`;
      ctx.fillText(text, x + spacing / 2, y);
      ctx.letterSpacing = '0px';
    } else ctx.fillText(text.split('').join(' '), x, y);
  }

  function wrap(text, x, y, maxW, lh) {
    const words = text.split(' ');
    let line = '', lines = [];
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    }
    lines.push(line);
    lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
    return lines.length;
  }

  function star(x, y, s, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = GOLD_HI;
    ctx.beginPath();
    ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s * 0.28, y);
    ctx.quadraticCurveTo(x, y, x, y + s); ctx.quadraticCurveTo(x, y, x - s * 0.28, y);
    ctx.quadraticCurveTo(x, y, x, y - s);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - s * 0.6, y); ctx.quadraticCurveTo(x, y, x, y - s * 0.12);
    ctx.quadraticCurveTo(x, y, x + s * 0.6, y); ctx.quadraticCurveTo(x, y, x, y + s * 0.12);
    ctx.quadraticCurveTo(x, y, x - s * 0.6, y);
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    raf = 0;
    const name = cleanName(input.value);
    ctx.clearRect(0, 0, W, H);

    // mineral ground: the artwork itself, framing a dark panel
    if (art) {
      const s = H / art.height;
      ctx.drawImage(art, (W - art.width * s) / 2, 0, art.width * s, H);
    } else {
      ctx.fillStyle = '#0A2122';
      ctx.fillRect(0, 0, W, H);
    }
    const inset = 64;
    const pg = ctx.createLinearGradient(0, inset, 0, H - inset);
    pg.addColorStop(0, 'rgba(6,20,21,.94)');
    pg.addColorStop(0.5, 'rgba(10,26,27,.9)');
    pg.addColorStop(1, 'rgba(26,10,18,.94)');
    ctx.fillStyle = pg;
    ctx.fillRect(inset, inset, W - inset * 2, H - inset * 2);

    // gold frame: double hairline with stars at the corners
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(inset + 18, inset + 18, W - (inset + 18) * 2, H - (inset + 18) * 2);
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1;
    ctx.strokeRect(inset + 28, inset + 28, W - (inset + 28) * 2, H - (inset + 28) * 2);
    ctx.globalAlpha = 1;
    [[inset + 18, inset + 18], [W - inset - 18, inset + 18], [inset + 18, H - inset - 18], [W - inset - 18, H - inset - 18]].forEach(([x, y]) => star(x, y, 16));

    // celestial orbit behind the wordmark
    ctx.save();
    ctx.strokeStyle = GOLD;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(W / 2, 352, 430, 118, -0.12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.ellipse(W / 2, 352, 300, 300 * 0.62, 0.18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    star(W / 2 + 420, 300, 12, 0.9);
    star(W / 2 - 360, 420, 9, 0.7);

    // the official wordmark (keyed from the artwork)
    if (mark) {
      const mw = 820, mh = mw * (mark.height / mark.width);
      ctx.drawImage(mark, (W - mw) / 2, 160, mw, mh);
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    tracked('AN INVITATION FOR', W / 2, 640, 22, 7, GOLD, 600);

    // the guest's name — auto-fitted
    const display = name || 'Our newest batchmate';
    let size = name ? 104 : 72;
    ctx.font = `italic 400 ${size}px "Cormorant Garamond", Georgia, serif`;
    while (ctx.measureText(display).width > 820 && size > 46) {
      size -= 4;
      ctx.font = `italic 400 ${size}px "Cormorant Garamond", Georgia, serif`;
    }
    const g = ctx.createLinearGradient(W / 2 - 300, 0, W / 2 + 300, 0);
    g.addColorStop(0, '#E8CF98'); g.addColorStop(0.5, '#FFF3D9'); g.addColorStop(1, '#D3AF6C');
    ctx.fillStyle = name ? g : 'rgba(245,232,204,.55)';
    ctx.fillText(display, W / 2, 748);

    ctx.strokeStyle = GOLD;
    ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(W / 2 - 150, 800); ctx.lineTo(W / 2 - 18, 800); ctx.moveTo(W / 2 + 18, 800); ctx.lineTo(W / 2 + 150, 800); ctx.stroke();
    ctx.globalAlpha = 1;
    star(W / 2, 800, 8);

    ctx.font = '400 38px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = IVORY;
    wrap(`You are invited to begin your story at ${C.brand.fullName} — the freshers’ celebration hosted by the seniors of ${C.brand.department}.`, W / 2, 870, 760, 50);

    const d = C.datetime;
    tracked(d.fullDateString.toUpperCase(), W / 2, 1040, 26, 5, GOLD_HI, 600);
    tracked(`${d.time} ${d.timezone} ONWARDS  ·  ${d.venue}`.toUpperCase(), W / 2, 1088, 24, 4.5, IVORY, 500);
    tracked(d.venueLocation.toUpperCase(), W / 2, 1132, 20, 4, 'rgba(245,232,204,.72)', 500);

    ctx.font = 'italic 400 36px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = GOLD;
    ctx.fillText(C.brand.tagline, W / 2, 1200);
    tracked(`${C.links.instagramHandle}  ·  ${C.brand.institution}`.toUpperCase(), W / 2, 1240, 15, 3, 'rgba(245,232,204,.6)', 500);

    canvas.setAttribute('aria-label', `Preview of the ANVAYA 2026 invitation for ${name || 'a guest'}: ${d.fullDateString}, ${d.time} ${d.timezone}, ${d.venue}, ${d.venueLocation}.`);
  }
  const queue = () => { if (!raf) raf = requestAnimationFrame(draw); };

  const fileName = () => {
    const slug = cleanName(input.value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `ANVAYA-2026-invitation${slug ? '-' + slug : ''}.png`;
  };
  const say = msg => { status.textContent = msg; };

  function toBlob() {
    return new Promise((res, rej) => {
      try { canvas.toBlob(b => (b ? res(b) : rej(new Error('empty'))), 'image/png'); } catch (e) { rej(e); }
    });
  }
  const blockedMsg = 'Your browser blocked image export for a page opened as a local file. Serve the site (see README) and try again.';

  async function save() {
    try {
      const blob = await toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName();
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      say('Invitation saved as ' + a.download);
    } catch (e) { say(blockedMsg); }
  }

  let shareMode = 'none';
  function detectShare() {
    try {
      const probe = new File([new Blob(['x'], { type: 'image/png' })], 'probe.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [probe] })) return 'files';
    } catch (e) { /* not supported */ }
    if (navigator.clipboard && window.ClipboardItem && window.isSecureContext) return 'clipboard';
    return 'none';
  }
  async function share() {
    try {
      const blob = await toBlob();
      if (shareMode === 'files') {
        const file = new File([blob], fileName(), { type: 'image/png' });
        await navigator.share({ files: [file], title: C.brand.fullName, text: `${C.brand.fullName} · ${C.brand.tagline} · ${C.datetime.fullDateString}, ${C.datetime.venue}` });
        say('Shared.');
      } else if (shareMode === 'clipboard') {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        say('Invitation image copied — paste it into any chat.');
      }
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      say(e && e.name === 'SecurityError' ? blockedMsg : 'Sharing did not complete. You can save the invitation instead.');
    }
  }

  A.invitation = {
    init() {
      canvas = document.querySelector('[data-invite-canvas]');
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      input = document.querySelector('[data-invite-name]');
      status = document.querySelector('[data-invite-status]');
      saveBtn = document.querySelector('[data-invite-save]');
      shareBtn = document.querySelector('[data-invite-share]');
      document.querySelector('[data-invite-form]').addEventListener('submit', e => { e.preventDefault(); save(); });
      input.addEventListener('input', queue);
      saveBtn.addEventListener('click', save);

      shareMode = detectShare();
      if (shareMode === 'none') shareBtn.hidden = true;
      else {
        if (shareMode === 'clipboard') shareBtn.querySelector('span').textContent = 'Copy image';
        shareBtn.addEventListener('click', share);
      }

      // draw lazily, once the chapter is near
      let started = false;
      const start = async () => {
        if (started) return;
        started = true;
        draw();
        const fonts = document.fonts ? Promise.all([
          document.fonts.load('italic 400 100px "Cormorant Garamond"'),
          document.fonts.load('400 38px "Cormorant Garamond"'),
          document.fonts.load('600 26px Manrope'),
          document.fonts.load('500 24px Manrope')
        ]).catch(() => {}) : Promise.resolve();
        const [a, m] = await Promise.all([
          load(C.assets.artworkSmall).catch(() => null),
          load(C.assets.wordmark).catch(() => null),
          fonts
        ]);
        art = a; mark = m;
        draw();
      };
      new IntersectionObserver((entries, io) => {
        if (entries.some(e => e.isIntersecting)) { io.disconnect(); start(); }
      }, { rootMargin: '600px 0px' }).observe(canvas);
    }
  };
})(window.ANVAYA);
