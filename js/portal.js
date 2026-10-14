/**
 * The Golden Threshold Entrance Portal
 * Opulent solar crest transition unveiling ANVAYA 2K26
 */
export function initPortal() {
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
