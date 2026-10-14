/**
 * ANVAYA 2K26 - Main Application Logic
 * Royal Golden Solar Aesthetics & Interactive Experience
 */
import { EVENT_CONFIG } from './config.js';
import { initStarfield } from './starfield.js';
import { initPetals } from './petals.js';
import { initClockAndCountdown } from './clock.js';
import { initPortal } from './portal.js';
import { fireConfetti } from './confetti.js';

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
  setupCinematicReveals();
});

function setupCinematicReveals() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('#hero [data-reveal="hero"]');
  if (hero) requestAnimationFrame(() => hero.classList.add('is-visible'));

  const targets = [...document.querySelectorAll('section:not(#hero) > div, section:not(#hero) h2, section:not(#hero) .glass-panel, section:not(#hero) .glass-panel-glow')];
  targets.forEach((element, index) => {
    if (element.closest('#portal-overlay')) return;
    element.dataset.reveal = 'section';
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach(element => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(element => observer.observe(element));
}

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
