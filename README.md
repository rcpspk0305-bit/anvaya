# ANVAYA 2026 — Bonds Beyond Beginnings

The freshers' celebration website for **ANVAYA 2026**, hosted by the seniors of **CSE 2** at
**Mahatma Gandhi Institute of Technology (MGIT)** — Thursday, 15 October 2026, 9:30 AM, E-201.

The site is one continuous world drawn from the official artwork: teal and burgundy marble,
a textured moon over a dark skyline, reflective water, and a golden thread that connects every chapter.

## Experience

1. **The Awakening** — darkness, rising marble light, a point of gold that draws an orbit, the moon,
   city and water, then the official ANVAYA lettering revealed by travelling light. Skippable (button or Esc).
2. **Enter ANVAYA** — the emblem or *Explore ANVAYA* sends energy through the orbits, the camera
   travels toward the moon, a gold threshold disperses into teal and burgundy, and the site appears.
3. **The Living World** — seven chapters:
   01 The World of ANVAYA (hero, live countdown, calendar) · 02 Discover the Experience (orbital destinations) ·
   03 The Journey (scroll-lit timeline) · 04 The People (faculty portraits, seniors' letter, guest invitation) ·
   05 Echoes of the Past (midnight-lake gallery) · 06 Become Part of the Story (personal invitation generator) ·
   07 The Final Reveal.

Deep links such as `/#journey` skip the opening. Motion can be reduced from the top bar (the OS
setting is respected by default). Sound is off until the visitor turns it on.

## Run locally

No build step and no dependencies.

```bash
python -m http.server 4317
```

Then open http://127.0.0.1:4317. Opening `index.html` directly also works, but browsers block
saving the generated invitation image from `file://` pages.

## Editing content

Everything shown on the site comes from [`js/config.js`](js/config.js): dates, venue, schedule,
destinations, faculty, links, and assets.

- **Portraits** live in `images/people/`. A person whose photo is missing is shown with a monogram.
- **Guest invitation**: save the image as `images/invitation-letter.jpg` and it appears in Chapter 04.
- **Past-event photos**: add entries to `memories` in the config. Until then Chapter 05 shows the
  still-lake state with a link to the Drive archive.
- **Coordinators** are kept hidden until `coordinatorsVerified` is set to `true`.

## Structure

```
index.html
css/   tokens.css · base.css · intro.css · chapters.css
js/    config.js · intro.js · main.js
       core/   motion.js (motion settings + shared frame loop) · sound.js
       world/  ambient.js (marble shader + dust) · scene.js (moon, city, water, orbits)
               wordmark.js (logo reveal) · thread.js (page-long golden thread)
       ui/     nav.js · lightbox.js
       chapters/ world · discover · journey · people · memories · invitation · finale
images/brand/  assets derived from the official artwork (see below)
```

`images/brand/` is generated from `images/poster.jpeg`, the only official artwork in the repo (a flattened
image). The wordmark is a luminance-keyed extraction of the poster's own lettering, not a redrawn
logo. If a vector or transparent master of the logo becomes available, replace
`wordmark-key.webp` / `wordmark-key-sm.webp` with it.
