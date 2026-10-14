/**
 * Countdown Timer & 3D Interactive Analog Clock
 */
export function initClockAndCountdown(targetIsoDate = '2026-10-15T09:30:00+05:30') {
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
