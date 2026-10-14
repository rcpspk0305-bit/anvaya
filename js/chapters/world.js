/**
 * Chapter 01 helpers: config bindings, the live countdown, calendar links.
 */
(function (A) {
  'use strict';
  const C = A.config;

  const get = path => path.split('.').reduce((o, k) => (o == null ? o : o[k]), C);

  /** Fill every [data-bind] / [data-href] from config so the config stays the single source of truth. */
  function bind() {
    document.querySelectorAll('[data-bind]').forEach(el => {
      const v = get(el.dataset.bind);
      if (typeof v === 'string') el.textContent = v;
    });
    document.querySelectorAll('[data-href]').forEach(el => {
      const v = get(el.dataset.href);
      if (typeof v === 'string') el.href = v;
    });
  }

  /* ---------------- calendar ---------------- */
  const utc = iso => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  function calendar() {
    const d = C.datetime;
    const title = `${C.brand.fullName} — ${C.brand.department} Freshers' Celebration`;
    const details = `${C.brand.tagline}. Hosted by the seniors of ${C.brand.department}, ${C.brand.institution}. Venue: ${d.venue}, ${d.venueLocation}.`;
    const location = `${d.venue}, ${d.venueLocation}, ${C.brand.institution}`;
    const url = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + `&text=${encodeURIComponent(title)}`
      + `&dates=${utc(d.startTimestamp)}/${utc(d.endTimestamp)}`
      + `&details=${encodeURIComponent(details)}`
      + `&location=${encodeURIComponent(location)}`;
    document.querySelectorAll('[data-calendar]').forEach(a => { a.href = url; });

    const icsEsc = s => s.replace(/[,;\\]/g, m => '\\' + m);
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CSE 2 MGIT//ANVAYA 2026//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:anvaya-2026@cse2.mgit',
      `DTSTAMP:${utc(new Date().toISOString())}`,
      `DTSTART:${utc(d.startTimestamp)}`,
      `DTEND:${utc(d.endTimestamp)}`,
      `SUMMARY:${icsEsc(title)}`,
      `DESCRIPTION:${icsEsc(details)}`,
      `LOCATION:${icsEsc(location)}`,
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const blobUrl = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    document.querySelectorAll('[data-ics]').forEach(a => { a.href = blobUrl; });
  }

  /* ---------------- countdown ---------------- */
  function countdown() {
    const root = document.querySelector('[data-countdown]');
    if (!root) return;
    const start = new Date(C.datetime.startTimestamp).getTime();
    const end = new Date(C.datetime.endTimestamp).getTime();
    const els = { d: root.querySelector('[data-cd="d"]'), h: root.querySelector('[data-cd="h"]'), m: root.querySelector('[data-cd="m"]'), s: root.querySelector('[data-cd="s"]') };
    const label = root.querySelector('[data-countdown-label]');
    const status = root.querySelector('[data-countdown-status]');
    const prev = {};
    let phase = '';
    const pad = n => String(n).padStart(2, '0');

    function setPhase(p, labelText, statusText) {
      if (phase === p && status.textContent === statusText) return;
      phase = p;
      root.dataset.phase = p;
      label.textContent = labelText;
      status.textContent = statusText;
    }

    function tick() {
      const now = Date.now();
      if (now < start) {
        let s = Math.floor((start - now) / 1000);
        const v = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
        for (const k in v) {
          const t = pad(v[k]);
          if (prev[k] !== t) {
            prev[k] = t;
            els[k].textContent = t;
            if (!A.motion.reduced) { els[k].classList.remove('tick'); void els[k].offsetWidth; els[k].classList.add('tick'); }
          }
        }
        setPhase('before', 'The celebration begins in', '');
      } else if (now < end) {
        const nowItem = C.schedule.find(it => now >= new Date(it.start).getTime() && now < new Date(it.end).getTime());
        setPhase('live', 'ANVAYA is happening now', nowItem ? `Now in ${C.datetime.venue}: ${nowItem.title}` : `Now in ${C.datetime.venue}`);
      } else {
        setPhase('after', 'ANVAYA 2026 has become a story', 'Thank you for being part of the beginning.');
      }
    }
    tick();
    // align to the second boundary so the seconds digit never stutters
    setTimeout(() => { tick(); setInterval(tick, 1000); }, 1000 - (Date.now() % 1000));
  }

  A.world = {
    init() {
      bind();
      calendar();
      countdown();
    },
    get
  };
})(window.ANVAYA);
