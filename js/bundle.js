/**
 * ANVAYA 2K26 - Unified Production Bundle
 * Royal Golden Solar Aesthetics & Interactive Experience
 * Works seamlessly offline via file:// (double click) and on any web server.
 */
(() => {
'use strict';

// --- Begin config.js ---
/**
 * ANVAYA 2K26 - Central Event Configuration
 * Replicating and elevating the Avyra experience for CSE 2 at MGIT.
 */
const EVENT_CONFIG = {
  // 1. Event Identity & College
  brand: {
    name: "ANVAYA",
    edition: "2K26",
    fullName: "ANVAYA 2K26",
    department: "CSE 2",
    departmentFullName: "Department of Computer Science & Engineering - CSE 2",
    institution: "Mahatma Gandhi Institute of Technology (MGIT)",
    institutionShort: "MGIT",
    tagline: "Where It All Begins.",
    subTagline: "“Some beginnings deserve to be experienced.”",
    batchInfo: "Class of CSE 2 • Batch of 2026",
    batchYear: "2026",
    experienceLabel: "AN EXPERIENCE BY CSE 2",
    airspaceLabel: "FLIGHT ANVAYA • CSE 2"
  },

  // 2. Date, Time & Venue
  datetime: {
    date: "15/10/2026",
    weekday: "Thursday",
    fullDateString: "Thursday, 15 October 2026",
    time: "9:30 AM",
    timeSuffix: "Onwards",
    venue: "E-201",
    venueLocation: "MGIT Campus - E Block",
    targetTimestamp: "2026-10-15T09:30:00+05:30",
    timezone: "IST"
  },

  // 3. Welcome / Senior Message
  welcome: {
    sectionBadge: "A Heartfelt Welcome From Seniors",
    title: "The OGs of CSE 2 bring you a celebration to remember.",
    highlightLead: "One department. Two batches. Countless memories waiting to be made.",
    messageBody: "CSE 2 invites its newest members to begin their MGIT journey with a day filled with energy, laughter, and unforgettable moments.",
    letterHeading: "Welcome to MGIT. Your next chapter starts here.",
    letterBody: "To our wonderful freshers: welcome to a journey of discovery, friendship, challenges, and growth. May you find your people, discover what you're capable of, and turn every opportunity into a step towards something extraordinary. Here's to new beginnings and the memories we'll create together."
  },

  // 4. Custom Schedule & Timeline
  schedule: [
    {
      id: "sched-1",
      number: "01",
      time: "09:30 AM - 09:50 AM",
      shortTime: "09:30 AM",
      title: "Welcoming Guests & Inauguration",
      description: "The grand ceremonial commencement of ANVAYA 2K26. Traditional floral reception, lighting of the lamp, and inaugural address.",
      icon: "sparkles",
      venueBadge: "Venue: E-201 • MGIT"
    },
    {
      id: "sched-2",
      number: "02",
      time: "09:50 AM - 10:20 AM",
      shortTime: "09:50 AM",
      title: "Speeches & Inspiring Words",
      description: "Inspiring words of wisdom, encouragement, and stories from our respected Principal, HOD, Dr. Meera Alphy, Dr. Madhubabu, and senior mentors.",
      icon: "mic",
      venueBadge: "Venue: E-201 • MGIT"
    },
    {
      id: "sched-3",
      number: "03",
      time: "10:20 AM - 10:30 AM",
      shortTime: "10:20 AM",
      title: "Dance Performance (Act I)",
      description: "Electrifying choreography, high-octane stage beats, and synchronized rhythm kicking off the cultural showcase.",
      icon: "disc",
      venueBadge: "Venue: E-201 • MGIT"
    },
    {
      id: "sched-4",
      number: "04",
      time: "10:30 AM - 10:50 AM",
      shortTime: "10:30 AM",
      title: "Singing & Musical Showcase",
      description: "Soulful acoustic melodies, crowd anthems, and breathtaking musical performances to elevate the room's energy.",
      icon: "music",
      venueBadge: "Venue: E-201 • MGIT"
    },
    {
      id: "sched-5",
      number: "05",
      time: "10:50 AM - 11:10 AM",
      shortTime: "10:50 AM",
      title: "Dance Performance (Act II)",
      description: "Second thrilling wave of stage dance showcases featuring energetic fusion beats and showstopping group acts.",
      icon: "disc",
      venueBadge: "Venue: E-201 • MGIT"
    },
    {
      id: "sched-6",
      number: "06",
      time: "11:10 AM - 12:00 PM",
      shortTime: "11:10 AM",
      title: "Rose Ceremony",
      description: "A cherished tradition welcoming every fresher with flowers, warm smiles, introductions, and everlasting bonds.",
      icon: "heart",
      venueBadge: "Venue: E-201 • MGIT"
    },
    {
      id: "sched-7",
      number: "07",
      time: "12:00 PM - 12:30 PM",
      shortTime: "12:00 PM",
      title: "Everyone Dancing (DJ Jamming)",
      description: "The grand finale! The floor opens up for every senior and fresher to dance together to high-energy DJ beats and celebration.",
      icon: "party",
      venueBadge: "Venue: E-201 • MGIT"
    }
  ],

  // 5. Faculty & Leadership (Guests of Honor)
  faculty: [
    {
      id: "fac-1",
      name: "Prof. G. ChandraMohan Reddy",
      role: "Respected Principal",
      department: "Mahatma Gandhi Institute of Technology (MGIT)",
      badge: "MGIT Leadership",
      avatarInitials: "GCR",
      image: "images/chandramohan-reddy.jpg"
    },
    {
      id: "fac-2",
      name: "Prof. T. V. Rajini Kanth",
      role: "Honourable HOD",
      department: "Department of Computer Science & Engineering",
      badge: "MGIT Leadership",
      avatarInitials: "TRK",
      image: "images/rajini-kanth.jpg"
    },
    {
      id: "fac-3",
      name: "Dr. Meera Alphy",
      role: "Beloved Faculty Incharge",
      department: "Department of Computer Science & Engineering - CSE 2",
      badge: "CSE 2 Incharge",
      avatarInitials: "DMA",
      image: "images/meera.jpg"
    },
    {
      id: "fac-4",
      name: "Dr. Madhubabu",
      role: "Assistant Professor",
      department: "Department of Computer Science & Engineering",
      badge: "CSE 2 Faculty",
      avatarInitials: "DMB",
      image: ""
    }
  ],

  // 6. Student Coordinators (CSE 2 Organizing Committee)
  coordinators: [
    { id: "c-1", name: "R. Siddharth Varma", role: "President / Lead", initials: "SV" },
    { id: "c-2", name: "K. Shreya Reddy", role: "Vice President", initials: "SR" },
    { id: "c-3", name: "M. Harsha Vardhan", role: "Technical Head", initials: "HV" },
    { id: "c-4", name: "P. Ananya Rao", role: "Cultural Head", initials: "AR" },
    { id: "c-5", name: "V. Sai Karthik", role: "Event Logistics", initials: "SK" },
    { id: "c-6", name: "B. Nikhitha", role: "Hospitality Lead", initials: "BN" },
    { id: "c-7", name: "T. Aditya Sharma", role: "Creative & Media", initials: "AS" },
    { id: "c-8", name: "S. Divya Sree", role: "Stage & Anchoring", initials: "DS" },
    { id: "c-9", name: "K. Akhil Teja", role: "Design Head", initials: "AT" },
    { id: "c-10", name: "N. Tanmayi", role: "Sponsorship & Gifts", initials: "NT" },
    { id: "c-11", name: "G. Charan Kumar", role: "Sound & DJ Lead", initials: "CK" },
    { id: "c-12", name: "Ch. Pooja Reddy", role: "PR & Communications", initials: "PR" }
  ],

  // 7. Links & Social Media
  links: {
    instagramUrl: "https://instagram.com/anvaya_mgit",
    instagramHandle: "@anvaya_mgit",
    driveGalleryUrl: "https://drive.google.com/drive/folders/113pdQ3sQI-rSpyySxFSQzCH5jfqVXxw7",
    footerCredit: "Made by CSE-2 with fondness"
  }
};
// --- End config.js ---


// --- Begin starfield.js ---
/**
 * Golden Solar Stardust Canvas Engine
 * Radiant sun motes, floating embers, and shimmering golden solar streaks
 * Harmonizing with the sunlight in the ancient banyan tree
 */
function initStarfield(canvasId = 'starfield-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animationFrameId;
  let isVisible = true;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  const moteCount = window.innerWidth < 768 ? 35 : 75;
  const motes = [];
  const colorMap = {
    gold: 'rgba(245, 158, 11,',
    amber: 'rgba(217, 119, 6,',
    champagne: 'rgba(254, 240, 138,',
    solarWhite: 'rgba(255, 253, 245,'
  };

  for (let i = 0; i < moteCount; i++) {
    const rand = Math.random();
    const type = rand < 0.45 ? 'gold' : rand < 0.75 ? 'champagne' : rand < 0.9 ? 'amber' : 'solarWhite';
    motes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.4 + 0.8,
      alpha: Math.random() * 0.55 + 0.25,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -Math.random() * 0.35 - 0.1, // gently rising like warm solar embers
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulsePhase: Math.random() * Math.PI * 2,
      colorType: type
    });
  }

  // Golden Sunflare Streak
  let flare = {
    x: 0,
    y: 0,
    length: 120,
    speed: 12,
    angle: Math.PI / 4,
    opacity: 0,
    active: false
  };
  let flareTimer = 0;

  const triggerFlare = () => {
    if (prefersReducedMotion) return;
    flare.x = Math.random() * (canvas.width * 0.7);
    flare.y = Math.random() * (canvas.height * 0.4);
    flare.length = Math.random() * 90 + 90;
    flare.speed = Math.random() * 8 + 10;
    flare.opacity = 1;
    flare.active = true;
  };

  const drawCrossFlare = (x, y, radius, alpha) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.8})`;
    ctx.lineWidth = 0.8;

    ctx.beginPath();
    ctx.moveTo(-radius * 2.5, 0);
    ctx.lineTo(radius * 2.5, 0);
    ctx.moveTo(0, -radius * 2.5);
    ctx.lineTo(0, radius * 2.5);
    ctx.stroke();

    ctx.restore();
  };

  const render = () => {
    if (!isVisible) {
      animationFrameId = requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Solar Motes
    for (let i = 0; i < motes.length; i++) {
      const s = motes[i];
      s.pulsePhase += s.pulseSpeed;
      const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.pulsePhase));

      s.x += s.speedX;
      s.y += s.speedY;

      if (s.y < -10) s.y = canvas.height + 10;
      if (s.x > canvas.width + 10) s.x = -10;
      else if (s.x < -10) s.x = canvas.width + 10;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `${colorMap[s.colorType]}${currentAlpha})`;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
      ctx.shadowBlur = s.size * 3;
      ctx.fill();

      // Shimmer flare on large motes
      if (s.size > 2.2 && currentAlpha > 0.4) {
        drawCrossFlare(s.x, s.y, s.size, currentAlpha);
      }
    }

    // Solar flare streak
    flareTimer++;
    if (flareTimer > 320 && Math.random() < 0.02) {
      triggerFlare();
      flareTimer = 0;
    }

    if (flare.active) {
      flare.x += Math.cos(flare.angle) * flare.speed;
      flare.y += Math.sin(flare.angle) * flare.speed;
      flare.opacity -= 0.015;

      const tailX = flare.x - Math.cos(flare.angle) * flare.length;
      const tailY = flare.y - Math.sin(flare.angle) * flare.length;

      const grad = ctx.createLinearGradient(tailX, tailY, flare.x, flare.y);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0)');
      grad.addColorStop(0.7, `rgba(254, 240, 138, ${flare.opacity * 0.7})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${flare.opacity})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(flare.x, flare.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
      ctx.shadowBlur = 8;
      ctx.stroke();

      if (flare.opacity <= 0 || flare.x > canvas.width || flare.y > canvas.height) {
        flare.active = false;
      }
    }

    animationFrameId = requestAnimationFrame(render);
  };

  render();

  return () => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationFrameId);
  };
}
// --- End starfield.js ---


// --- Begin petals.js ---
/**
 * ANVAYA 2K26 - Golden Autumn Falling Leaves Engine
 * Realistic 3D fluttering golden leaves that swirl and fall dynamically on scroll
 * Perfectly harmonized with the ancient golden banyan tree background.
 */
function initPetals(canvasId = 'petals-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animationFrameId;
  let isVisible = true;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // DPR for crisp rendering on high-res displays
  let dpr = 1;
  let width = window.innerWidth;
  let height = window.innerHeight;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  };
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  // Autumn Palette Palettes
  const LEAF_PALETTES = [
    {
      // 1. Radiant Amber Gold
      primary: '#FBBF24',
      secondary: '#F59E0B',
      dark: '#B45309',
      highlight: '#FEF08A',
      back: '#FDE68A',
      stem: '#78350F',
      glow: 'rgba(245, 158, 11, 0.45)'
    },
    {
      // 2. Sunburst Canary Yellow
      primary: '#FDE047',
      secondary: '#EAB308',
      dark: '#CA8A04',
      highlight: '#FEF9C3',
      back: '#FEF08A',
      stem: '#713F12',
      glow: 'rgba(234, 179, 8, 0.4)'
    },
    {
      // 3. Golden Honey & Topaz
      primary: '#F59E0B',
      secondary: '#D97706',
      dark: '#92400E',
      highlight: '#FFFBEB',
      back: '#FCD34D',
      stem: '#451A03',
      glow: 'rgba(217, 119, 6, 0.45)'
    },
    {
      // 4. Sunset Bronze Gold
      primary: '#F97316',
      secondary: '#EA580C',
      dark: '#9A3412',
      highlight: '#FED7AA',
      back: '#FDBA74',
      stem: '#7C2D12',
      glow: 'rgba(249, 115, 22, 0.35)'
    }
  ];

  // Leaf factory
  function createLeaf(spawnAtTop = false) {
    const palette = LEAF_PALETTES[Math.floor(Math.random() * LEAF_PALETTES.length)];
    const leafType = Math.floor(Math.random() * 3); // 0: Oval Banyan, 1: Pointed Elm, 2: Flutter Birch
    const depth = 0.5 + Math.random() * 0.7; // 0.5 to 1.2
    const size = (14 + Math.random() * 16) * depth;

    return {
      x: Math.random() * width,
      y: spawnAtTop ? -size * 2 - Math.random() * 80 : Math.random() * height,
      size,
      depth,
      leafType,
      palette,
      // Base falling velocity
      speedY: (0.7 + Math.random() * 1.1) * depth,
      speedX: (Math.random() - 0.5) * 0.6,
      // 3D physics & fluttering oscillations
      oscillationPhase: Math.random() * Math.PI * 2,
      oscillationSpeed: 0.018 + Math.random() * 0.022,
      swayWidth: 1.2 + Math.random() * 2.2,
      // Rotations: Roll (2D angle), Pitch (3D tumble flip), Yaw (3D side sway)
      roll: Math.random() * Math.PI * 2,
      rollSpeed: (Math.random() - 0.5) * 0.025,
      pitch: Math.random() * Math.PI * 2,
      pitchSpeed: 0.02 + Math.random() * 0.035,
      yaw: Math.random() * Math.PI * 2,
      yawSpeed: 0.015 + Math.random() * 0.025,
      opacity: 0.82 + Math.random() * 0.18,
      isScrollSpawned: spawnAtTop
    };
  }

  const isMobile = width < 768;
  const baseCount = prefersReducedMotion ? 0 : isMobile ? 14 : 26;
  const maxLeaves = isMobile ? 45 : 75;
  const leaves = [];

  for (let i = 0; i < baseCount; i++) {
    leaves.push(createLeaf(false));
  }

  // Draw realistic organic leaf geometry
  function drawLeaf(leaf) {
    const { size, palette, leafType, roll, pitch, yaw, depth, opacity } = leaf;

    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(roll);

    // 3D Perspective Scaling
    const cosPitch = Math.cos(pitch);
    const cosYaw = Math.cos(yaw);
    const isBackSide = cosPitch < 0;

    // Apply scale for 3D flip (cosPitch controls flattening/flip, cosYaw controls width sway)
    ctx.scale(Math.max(0.18, Math.abs(cosYaw)), Math.max(0.12, Math.abs(cosPitch)));
    ctx.globalAlpha = opacity * (isBackSide ? 0.8 : 1.0);

    // Glowing aura matching autumn sunburst
    ctx.shadowColor = palette.glow;
    ctx.shadowBlur = 6 * depth;

    // Gradient shading
    const grad = ctx.createLinearGradient(0, -size, size * 0.4, size);
    if (!isBackSide) {
      grad.addColorStop(0, palette.highlight);
      grad.addColorStop(0.35, palette.primary);
      grad.addColorStop(0.8, palette.secondary);
      grad.addColorStop(1, palette.dark);
    } else {
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.4, palette.back);
      grad.addColorStop(1, palette.secondary);
    }
    ctx.fillStyle = grad;

    // Draw leaf based on type
    ctx.beginPath();
    if (leafType === 0) {
      // Oval Banyan Autumn Leaf
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.75, -size * 0.5, size * 0.7, size * 0.55, 0, size);
      ctx.bezierCurveTo(-size * 0.7, size * 0.55, -size * 0.75, -size * 0.5, 0, -size);
    } else if (leafType === 1) {
      // Pointed Golden Elm Leaf
      ctx.moveTo(0, -size * 1.1);
      ctx.bezierCurveTo(size * 0.85, -size * 0.45, size * 0.5, size * 0.65, 0, size);
      ctx.bezierCurveTo(-size * 0.5, size * 0.65, -size * 0.85, -size * 0.45, 0, -size * 1.1);
    } else {
      // Fluttering Birch Leaf (slight wavy profile)
      ctx.moveTo(0, -size * 1.05);
      ctx.bezierCurveTo(size * 0.8, -size * 0.6, size * 0.85, 0, size * 0.4, size * 0.6);
      ctx.bezierCurveTo(size * 0.2, size * 0.85, 0, size * 0.95, 0, size);
      ctx.bezierCurveTo(0, size * 0.95, -size * 0.2, size * 0.85, -size * 0.4, size * 0.6);
      ctx.bezierCurveTo(-size * 0.85, 0, -size * 0.8, -size * 0.6, 0, -size * 1.05);
    }
    ctx.closePath();
    ctx.fill();

    // Central Vein and Stem
    ctx.shadowBlur = 0;
    ctx.strokeStyle = isBackSide ? 'rgba(255, 255, 255, 0.5)' : palette.stem;
    ctx.lineWidth = Math.max(0.7, 1.2 * depth);
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.85);
    ctx.lineTo(0, size * 1.18); // stem protruding past base
    ctx.stroke();

    // Subtle side veins
    if (depth > 0.7) {
      ctx.strokeStyle = isBackSide ? 'rgba(255, 255, 255, 0.25)' : 'rgba(120, 53, 15, 0.35)';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      // 3 pairs of angled veins
      for (let v = -0.4; v <= 0.4; v += 0.35) {
        const vy = size * v;
        ctx.moveTo(0, vy);
        ctx.lineTo(size * 0.35, vy - size * 0.18);
        ctx.moveTo(0, vy);
        ctx.lineTo(-size * 0.35, vy - size * 0.18);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  // Scroll Tracking & Dynamics
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let scrollVelocity = 0;
  let leavesToSpawn = 0;

  const onScroll = () => {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const delta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    const absDelta = Math.abs(delta);
    if (absDelta > 1) {
      // Boost downward velocity on scroll
      scrollVelocity += Math.min(absDelta * 0.25, 12);
      if (scrollVelocity > 22) scrollVelocity = 22;

      // Queue new leaves to cascade down during scroll
      leavesToSpawn += Math.min(4, Math.ceil(absDelta / 12));
    }

    // Parallax update for background tree wallpaper
    const bgImage = document.getElementById('site-bg-image');
    if (bgImage) {
      const offset = currentScrollY * 0.05;
      bgImage.style.transform = `translate3d(0, ${offset}px, 0) scale(1.04)`;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Also listen for mouse wheel and touch gesture velocity
  window.addEventListener('wheel', (e) => {
    const delta = Math.abs(e.deltaY);
    if (delta > 2) {
      scrollVelocity += Math.min(delta * 0.06, 6);
      leavesToSpawn += 1;
    }
  }, { passive: true });

  window.addEventListener('touchmove', () => {
    scrollVelocity += 1.5;
    leavesToSpawn += 1;
  }, { passive: true });

  // Main Animation Loop
  const render = () => {
    if (!isVisible) {
      animationFrameId = requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Smooth scroll velocity decay
    scrollVelocity *= 0.93;
    if (scrollVelocity < 0.01) scrollVelocity = 0;

    // Spawn queued leaves from canopy at top
    if (leavesToSpawn > 0 && leaves.length < maxLeaves) {
      const spawnCount = Math.min(leavesToSpawn, 2);
      for (let s = 0; s < spawnCount; s++) {
        leaves.push(createLeaf(true));
      }
      leavesToSpawn -= spawnCount;
    }

    // Update & draw leaves
    for (let i = leaves.length - 1; i >= 0; i--) {
      const p = leaves[i];

      // Oscillations
      p.oscillationPhase += p.oscillationSpeed * (1 + scrollVelocity * 0.04);
      p.roll += p.rollSpeed * (1 + scrollVelocity * 0.06);
      p.pitch += p.pitchSpeed * (1 + scrollVelocity * 0.08);
      p.yaw += p.yawSpeed * (1 + scrollVelocity * 0.06);

      // Downward velocity boosted by scroll velocity
      const fallSpeed = (p.speedY + scrollVelocity * 0.65) * p.depth;
      p.y += fallSpeed;

      // Horizontal sway + wind drift
      const horizontalSway = Math.sin(p.oscillationPhase) * p.swayWidth + p.speedX;
      p.x += horizontalSway + (scrollVelocity * 0.08 * Math.sin(p.roll));

      // Wrap or recycle leaves when off-screen
      if (p.y > height + 60) {
        if (leaves.length > baseCount) {
          // Extra scroll-spawned leaves are pruned to maintain clean performance
          leaves.splice(i, 1);
          continue;
        } else {
          // Base leaves recycle back to the top
          p.y = -p.size * 2 - Math.random() * 40;
          p.x = Math.random() * width;
        }
      }

      // Horizontal wrap
      if (p.x > width + 50) p.x = -50;
      else if (p.x < -50) p.x = width + 50;

      drawLeaf(p);
    }

    animationFrameId = requestAnimationFrame(render);
  };

  render();

  return () => {
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(animationFrameId);
  };
}
// --- End petals.js ---


// --- Begin clock.js ---
/**
 * Countdown Timer & 3D Interactive Analog Clock
 */
function initClockAndCountdown(targetIsoDate = '2026-10-15T09:30:00+05:30') {
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  const hourHand = document.getElementById('watch-hour-hand');
  const minHand = document.getElementById('watch-min-hand');
  const secHand = document.getElementById('watch-sec-hand');
  const watchHousing = document.getElementById('watch-housing');

  const targetTime = new Date(targetIsoDate).getTime();

  // 1. Update Countdown
  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetTime - now;

    if (difference > 0) {
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');
    } else {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
    }

    // 2. Update Real-Time Analog Clock Hands
    const currentDate = new Date();
    const sec = currentDate.getSeconds();
    const min = currentDate.getMinutes();
    const hr = currentDate.getHours();

    const secDeg = sec * 6;
    const minDeg = (min + sec / 60) * 6;
    const hrDeg = ((hr % 12) + min / 60 + sec / 3600) * 30;

    if (secHand) secHand.style.transform = `rotate(${secDeg}deg)`;
    if (minHand) minHand.style.transform = `rotate(${minDeg}deg)`;
    if (hourHand) hourHand.style.transform = `rotate(${hrDeg}deg)`;
  }

  updateCountdown();
  const timerInterval = setInterval(updateCountdown, 1000);

  // 3. Mouse 3D Gyro Parallax on the Watch Housing
  if (watchHousing) {
    const section = document.getElementById('watch-reveal') || watchHousing.parentElement;
    if (section) {
      section.addEventListener('mousemove', (e) => {
        const rect = watchHousing.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / 18;
        const deltaY = (e.clientY - centerY) / 18;
        watchHousing.style.transform = `rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;
      });

      section.addEventListener('mouseleave', () => {
        watchHousing.style.transform = 'rotateY(0deg) rotateX(0deg)';
      });
    }
  }

  return () => clearInterval(timerInterval);
}
// --- End clock.js ---


// --- Begin portal.js ---
/**
 * The Golden Threshold Entrance Portal
 * Opulent solar crest transition unveiling ANVAYA 2K26
 */
function initPortal() {
  const portalEl = document.getElementById('portal-overlay');
  const skipBtn = document.getElementById('portal-skip-btn');
  const enterBtn = document.getElementById('portal-enter-btn');
  const pullCta = document.getElementById('portal-pull-cta');
  const solarPiece = document.getElementById('portal-crystal');

  if (!portalEl) return;

  let hasEntered = false;

  // Auto skip if URL has hash (e.g. #schedule)
  if (window.location.hash) {
    portalEl.style.display = 'none';
    return;
  }

  function triggerEntrance() {
    if (hasEntered) return;
    hasEntered = true;

    // Trigger visual solar expansion bloom
    if (solarPiece) {
      solarPiece.style.transform = 'scale(3.5) rotate(15deg)';
      solarPiece.style.opacity = '0';
      solarPiece.style.filter = 'brightness(2) blur(8px)';
      solarPiece.style.transition = 'all 1.1s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    portalEl.classList.add('portal-exit');

    setTimeout(() => {
      portalEl.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 850);
  }

  if (skipBtn) skipBtn.addEventListener('click', triggerEntrance);
  if (enterBtn) enterBtn.addEventListener('click', triggerEntrance);
  if (pullCta) pullCta.addEventListener('click', triggerEntrance);
  if (solarPiece) solarPiece.addEventListener('click', triggerEntrance);

  // Wheel pull down
  window.addEventListener('wheel', (e) => {
    if (!hasEntered && e.deltaY > 30) {
      triggerEntrance();
    }
  }, { passive: true });

  // Touch swipe down
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!hasEntered && touchStartY) {
      const delta = e.touches[0].clientY - touchStartY;
      if (delta > 50) {
        triggerEntrance();
      }
    }
  }, { passive: true });

  // Keyboard shortcut (Enter or Space)
  window.addEventListener('keydown', (e) => {
    if (!hasEntered && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      triggerEntrance();
    }
  });
}
// --- End portal.js ---


// --- Begin confetti.js ---
/**
 * Festive Canvas Confetti Engine
 * Royal Golden & Champagne Foil Particle Physics
 */
function fireConfetti(options = {}) {
  const count = options.particleCount || 95;
  const colors = options.colors || ['#F59E0B', '#FBBF24', '#FDE047', '#FEF08A', '#D97706', '#EA580C', '#FFFDF7', '#B45309'];
  
  let canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const particles = [];
  const originX = options.origin?.x !== undefined ? options.origin.x * canvas.width : canvas.width * 0.5;
  const originY = options.origin?.y !== undefined ? options.origin.y * canvas.height : canvas.height * 0.75;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI / 180) * (options.angle || (270 + (Math.random() - 0.5) * 80));
    const speed = Math.random() * 22 + 14;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.5,
      friction: 0.94,
      wobble: Math.random() * 10,
      wobbleSpeed: 0.1,
      size: Math.random() * 9 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.01
    });
  }

  let animId;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.alpha <= 0) continue;
      alive++;

      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      p.wobble += p.wobbleSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.wobble);
      ctx.scale(Math.cos(p.wobble), 1);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      ctx.restore();
    }

    if (alive > 0) {
      animId = requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animId);
    }
  }

  update();
}
// --- End confetti.js ---


// --- Begin main.js ---
/**
 * ANVAYA 2K26 - Main Application Logic
 * Royal Golden Solar Aesthetics & Interactive Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Visual Canvases & Portal
  initStarfield('starfield-canvas');
  initPetals('petals-canvas');
  initClockAndCountdown(EVENT_CONFIG.datetime.targetTimestamp);
  initPortal();

  // 2. Navbar Scroll Effect & Mobile Drawer
  const navbar = document.getElementById('main-navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar?.classList.add('navbar-scrolled');
    } else {
      navbar?.classList.remove('navbar-scrolled');
    }
  }, { passive: true });

  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      const isHidden = mobileDrawer.classList.toggle('hidden');
      mobileBtn.setAttribute('aria-expanded', String(!isHidden));
    });

    // Close drawer when clicking a mobile link
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.add('hidden');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Render Schedule Timeline
  renderSchedule();

  // 4. Render Faculty / Leadership Cards
  renderFaculty();

  // 5. Setup Google Calendar Link & Confetti
  setupCalendarAndConfetti();

  // 6. Setup Poster Lightbox Modal
  setupPosterModal();

  // 7. Setup Interactive 3D Celestial Art Frame
  setupInteractiveArtFrame();
});

// Interactive Solar Schedule Showcase
let activeScheduleIndex = 0;

function renderSchedule() {
  const container = document.getElementById('schedule-list') || document.getElementById('schedule-container');
  if (!container) return;

  const icons = {
    sparkles: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    mic: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`,
    disc: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" x2="12" y1="2" y2="4"/><line x1="12" x2="12" y1="20" y2="22"/></svg>`,
    music: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    heart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    party: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5.8 11.3 6.9-6.9a2 2 0 0 1 2.8 0l4.2 4.2a2 2 0 0 1 0 2.8l-6.9 6.9"/><path d="m2 22 3-3"/><path d="M9.5 14.5 4 20"/></svg>`
  };

  function updateView() {
    const activeItem = EVENT_CONFIG.schedule[activeScheduleIndex];
    const totalEvents = EVENT_CONFIG.schedule.length;
    const activeIconSvg = icons[activeItem.icon] || icons.sparkles;

    container.innerHTML = `
      <!-- 1. Interactive Horizontal Chrono-Stepper Bar -->
      <div class="w-full mb-8 sm:mb-10 overflow-x-auto pb-3 custom-scrollbar">
        <div class="flex items-center justify-between min-w-[680px] sm:min-w-full gap-2 p-2 rounded-2xl bg-[#140b07]/80 border border-amber-500/25 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
          ${EVENT_CONFIG.schedule.map((item, idx) => {
            const isActive = idx === activeScheduleIndex;
            return `
              <button data-sched-step="${idx}"
                class="flex-1 flex flex-col items-center justify-center py-2.5 px-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-[#0c0704] font-bold shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-[1.03]'
                    : 'text-amber-200/70 hover:text-white hover:bg-amber-500/10'
                }">
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] font-mono font-bold tracking-widest ${isActive ? 'text-[#0c0704]' : 'text-amber-400'}">0${idx + 1}</span>
                  <span class="text-xs font-mono font-semibold">${item.shortTime}</span>
                </div>
                <span class="text-[11px] font-serif font-bold tracking-wide truncate max-w-[90px] sm:max-w-[110px] mt-0.5">
                  ${item.title.split(' ')[0]}
                </span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 2. Cinematic Spotlight Stage Card -->
      <div class="glass-panel p-6 sm:p-10 md:p-12 border-amber-500/35 relative overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.7)] transition-all duration-500">
        <!-- Background Ambient Glow & Chapter Watermark -->
        <div class="absolute -right-10 -bottom-10 text-[140px] sm:text-[200px] font-serif font-black text-amber-500/5 select-none pointer-events-none leading-none">
          0${activeScheduleIndex + 1}
        </div>
        <div class="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-500/15 blur-[80px] pointer-events-none"></div>

        <!-- Stage Header: Chapter & Navigation Controls -->
        <div class="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
          <div class="flex items-center gap-3">
            <div class="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>CHAPTER 0${activeScheduleIndex + 1} OF 0${totalEvents}</span>
            </div>
            <span class="hidden sm:inline-block text-xs font-mono tracking-wider text-amber-200/60 uppercase">
              ${EVENT_CONFIG.datetime.fullDateString}
            </span>
          </div>

          <!-- Step Arrows -->
          <div class="flex items-center gap-2">
            <button id="sched-prev-btn" aria-label="Previous Chapter"
              class="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/5 border border-amber-500/30 text-xs font-bold text-amber-200 hover:text-white hover:bg-amber-500/20 hover:border-amber-400 transition-all cursor-pointer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              <span>Prev</span>
            </button>
            <button id="sched-next-btn" aria-label="Next Chapter"
              class="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-xs font-extrabold text-[#0c0704] hover:scale-105 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all cursor-pointer">
              <span>Next</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        <!-- Stage Body: Showcase Event Content -->
        <div class="relative z-10 pt-8 sm:pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <!-- Left: Big Glowing Icon & Time Anchor -->
          <div class="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-amber-600/30 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.45)] mb-5">
              ${activeIconSvg}
            </div>

            <!-- Time Stamp -->
            <div class="flex items-center gap-2 font-sans px-4 py-2 rounded-xl bg-[#140b07]/90 border border-amber-500/30 shadow-inner">
              <svg width="18" height="18" class="text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span class="text-xl sm:text-2xl font-black text-white tracking-tight">${activeItem.time}</span>
            </div>

            <!-- Venue Badge -->
            <div class="mt-3 flex items-center gap-1.5 text-xs text-amber-300/80 font-medium">
              <svg width="14" height="14" class="text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>${activeItem.venueBadge}</span>
            </div>
          </div>

          <!-- Right: Detailed Event Narrative -->
          <div class="lg:col-span-8 space-y-4 text-center lg:text-left">
            <h3 class="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide">
              ${activeItem.title}
            </h3>

            <p class="text-base sm:text-lg text-amber-100/90 font-light leading-relaxed max-w-2xl">
              ${activeItem.description}
            </p>

            <!-- Distinguished Speakers (Special for Event 02) -->
            ${activeItem.id === 'sched-2' ? `
              <div class="pt-5 mt-4 border-t border-amber-500/25">
                <span class="text-xs font-mono font-bold uppercase tracking-widest text-amber-300 block mb-3">Distinguished Speakers & Leaders:</span>
                <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  ${EVENT_CONFIG.faculty.map(f => `
                    <div class="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1e1008] border border-amber-500/35 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                      ${f.image ? `
                        <img src="${f.image}" alt="${f.name}" class="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400" />
                      ` : `
                        <div class="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center ring-1 ring-amber-400">${f.avatarInitials}</div>
                      `}
                      <span class="text-xs font-semibold text-white tracking-wide">${f.name}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- 3. Interactive Quick-Selector Deck (All 7 Events At A Glance) -->
      <div class="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        ${EVENT_CONFIG.schedule.map((item, idx) => {
          const isActive = idx === activeScheduleIndex;
          const cardIcon = icons[item.icon] || icons.sparkles;
          return `
            <div data-sched-card="${idx}"
              class="glass-panel p-3.5 flex flex-col justify-between rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                isActive
                  ? 'border-amber-400/80 bg-amber-500/15 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
                  : 'border-amber-500/20 hover:border-amber-400/50'
              }">
              <div class="flex items-center justify-between gap-1 mb-2">
                <span class="text-[10px] font-mono font-bold tracking-widest ${isActive ? 'text-amber-300' : 'text-amber-200/60'}">CH. 0${idx + 1}</span>
                <span class="${isActive ? 'text-amber-400' : 'text-amber-200/40'}">${cardIcon}</span>
              </div>
              <h4 class="font-serif text-xs font-bold text-white line-clamp-2 leading-snug">
                ${item.title}
              </h4>
              <span class="text-[10px] font-mono text-amber-200/70 mt-2 block">
                ${item.shortTime}
              </span>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Event Listeners for Stepper Tabs
    container.querySelectorAll('[data-sched-step]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetIdx = parseInt(btn.getAttribute('data-sched-step'), 10);
        if (!isNaN(targetIdx) && targetIdx !== activeScheduleIndex) {
          activeScheduleIndex = targetIdx;
          updateView();
        }
      });
    });

    // Event Listeners for Quick Selector Cards
    container.querySelectorAll('[data-sched-card]').forEach(card => {
      card.addEventListener('click', (e) => {
        const targetIdx = parseInt(card.getAttribute('data-sched-card'), 10);
        if (!isNaN(targetIdx) && targetIdx !== activeScheduleIndex) {
          activeScheduleIndex = targetIdx;
          updateView();
        }
      });
    });

    // Prev / Next Buttons
    const prevBtn = document.getElementById('sched-prev-btn');
    const nextBtn = document.getElementById('sched-next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        activeScheduleIndex = (activeScheduleIndex - 1 + totalEvents) % totalEvents;
        updateView();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        activeScheduleIndex = (activeScheduleIndex + 1) % totalEvents;
        updateView();
      });
    }
  }

  updateView();

  // Keyboard navigation when user is on page
  window.addEventListener('keydown', (e) => {
    const schedSection = document.getElementById('schedule');
    if (!schedSection) return;
    const rect = schedSection.getBoundingClientRect();
    // Only if schedule section is currently in view
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowRight') {
        activeScheduleIndex = (activeScheduleIndex + 1) % EVENT_CONFIG.schedule.length;
        updateView();
      } else if (e.key === 'ArrowLeft') {
        activeScheduleIndex = (activeScheduleIndex - 1 + EVENT_CONFIG.schedule.length) % EVENT_CONFIG.schedule.length;
        updateView();
      }
    }
  });
}

// Render Faculty Leaders in 4-card responsive golden grid
function renderFaculty() {
  const container = document.getElementById('faculty-grid');
  if (!container) return;

  container.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8";

  container.innerHTML = EVENT_CONFIG.faculty.map((member) => `
    <div class="glass-panel p-6 sm:p-8 flex flex-col items-center text-center group border-amber-500/25 hover:border-amber-500/60 transition-all duration-300">
      <div class="relative mb-6">
        <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl p-1 bg-gradient-to-tr from-amber-500 via-[#FEF08A] to-amber-700 shadow-[0_0_25px_rgba(245,158,11,0.35)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.65)] group-hover:scale-105 transition-all duration-300">
          <div class="w-full h-full rounded-[14px] bg-[#1a0f07] flex items-center justify-center border border-amber-500/30 relative shadow-inner overflow-hidden">
            ${member.image ? `
              <img src="${member.image}" alt="${member.name}" class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden');" />
              <div class="hidden flex flex-col items-center justify-center text-center p-4">
                <span class="font-serif text-3xl font-black text-amber-200 tracking-widest drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">${member.avatarInitials}</span>
                <span class="text-[9px] font-mono tracking-widest text-amber-400 uppercase mt-1">MGIT FACULTY</span>
              </div>
            ` : `
              <div class="flex flex-col items-center justify-center text-center p-4">
                <div class="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-200 font-serif text-2xl font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] mb-1">
                  ${member.avatarInitials}
                </div>
                <span class="text-[9px] font-mono tracking-widest text-amber-400 uppercase mt-1">MGIT FACULTY</span>
              </div>
            `}
          </div>
        </div>
      </div>

      <div class="mb-3 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-xs font-semibold tracking-wider text-amber-300 uppercase">
        ${member.role}
      </div>

      <h3 class="font-serif text-lg sm:text-xl font-bold text-white tracking-wide mt-1 group-hover:text-amber-300 transition-colors">
        ${member.name}
      </h3>

      <p class="mt-2 text-xs sm:text-sm text-amber-100/70 font-normal leading-relaxed">
        ${member.department}
      </p>

      <div class="mt-auto pt-5 w-full border-t border-amber-500/20 flex items-center justify-center gap-2 text-[11px] text-amber-300/90 tracking-widest uppercase font-semibold">
        <svg width="12" height="12" class="text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        <span>${member.badge}</span>
      </div>
    </div>
  `).join('');
}

// Google Calendar URL Generator & Confetti
function setupCalendarAndConfetti() {
  const calBtn = document.getElementById('add-to-calendar-btn');
  const celebrateBtn = document.getElementById('celebrate-btn');

  // Generate Google Calendar Link
  if (calBtn) {
    const title = encodeURIComponent(`${EVENT_CONFIG.brand.fullName} — ${EVENT_CONFIG.brand.department} Freshers' Celebration`);
    const details = encodeURIComponent(`${EVENT_CONFIG.brand.tagline}\n\nJoin us for ${EVENT_CONFIG.brand.fullName} at MGIT with the OGs of ${EVENT_CONFIG.brand.department}.\n\nSchedule starts at ${EVENT_CONFIG.datetime.time} at ${EVENT_CONFIG.datetime.venue}.\n\nInstagram: ${EVENT_CONFIG.links.instagramHandle}`);
    const location = encodeURIComponent(`${EVENT_CONFIG.datetime.venue}, ${EVENT_CONFIG.brand.institution}`);
    
    // Dates in UTC format YYYYMMDDTHHmmssZ
    // 15 Oct 2026 09:30 AM IST = 04:00 AM UTC
    // 15 Oct 2026 01:00 PM IST = 07:30 AM UTC
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261015T040000Z/20261015T073000Z&details=${details}&location=${location}`;
    
    calBtn.setAttribute('href', calendarUrl);
    calBtn.setAttribute('target', '_blank');
    calBtn.setAttribute('rel', 'noopener noreferrer');
  }

  // Confetti Physics on Celebrate Button
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', (e) => {
      const rect = celebrateBtn.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;

      // Burst of golden confetti
      fireConfetti({ particleCount: 110, origin: { x: originX, y: originY } });
      setTimeout(() => {
        fireConfetti({ particleCount: 70, origin: { x: originX - 0.15, y: originY } });
        fireConfetti({ particleCount: 70, origin: { x: originX + 0.15, y: originY } });
      }, 250);
    });
  }
}

// Poster Lightbox Modal Logic
function setupPosterModal() {
  const trigger = document.getElementById('open-poster-modal');
  const modal = document.getElementById('poster-modal');
  const closeBtn = document.getElementById('close-poster-modal');

  if (!modal || !trigger) return;

  const openModal = () => {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  };

  trigger.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// 7. Interactive 3D Celestial Art Frame Experience
function setupInteractiveArtFrame() {
  const frameContainer = document.querySelector('.art-frame-container');
  const artFrame = document.querySelector('.art-frame');
  const modal = document.getElementById('poster-modal');

  if (!frameContainer || !artFrame) return;

  // 3D Magnetic Tilt Effect
  frameContainer.addEventListener('mousemove', (e) => {
    const rect = artFrame.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const maxTilt = 14;
    const tiltX = -(mouseY / (rect.height / 2)) * maxTilt;
    const tiltY = (mouseX / (rect.width / 2)) * maxTilt;

    artFrame.style.transform = `perspective(900px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(1.05)`;
  });

  frameContainer.addEventListener('mouseleave', () => {
    artFrame.style.transform = '';
  });

  // Click Art Frame -> Golden Stardust Confetti & Open Lightbox
  artFrame.style.cursor = 'pointer';
  artFrame.setAttribute('title', 'Click to view high-resolution artwork & trigger celestial stardust');

  artFrame.addEventListener('click', (e) => {
    const rect = artFrame.getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 2) / window.innerHeight;

    // Trigger golden stardust confetti
    fireConfetti({ particleCount: 65, origin: { x: originX, y: originY } });

    // Open lightbox after a micro pause
    if (modal) {
      setTimeout(() => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }, 300);
    }
  });
}
// --- End main.js ---


})();
