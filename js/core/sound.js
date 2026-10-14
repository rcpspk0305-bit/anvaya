/**
 * Optional ambience, off by default and never started without a click.
 * Everything is synthesised with Web Audio (no audio files): a low, slowly breathing pad
 * tuned to a D drone, filtered "air", and a soft bell when entering ANVAYA.
 */
(function (A) {
  'use strict';
  let ctx = null, master = null, pad = null, on = false;
  const buttons = new Set();

  function build() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 900;
    lp.Q.value = 0.4;
    lp.connect(master);

    pad = [73.42, 110, 146.83, 220.0, 293.66].map((freq, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 ? 'sine' : 'triangle';
      o.frequency.value = freq;
      o.detune.value = (i - 2) * 4;
      const g = ctx.createGain();
      g.gain.value = [0.16, 0.1, 0.07, 0.035, 0.02][i];
      // slow breathing
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.017;
      const lg = ctx.createGain();
      lg.gain.value = g.gain.value * 0.5;
      lfo.connect(lg).connect(g.gain);
      o.connect(g).connect(lp);
      o.start();
      lfo.start();
      return o;
    });

    // filtered noise for air
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1400;
    bp.Q.value = 0.6;
    const ng = ctx.createGain();
    ng.gain.value = 0.018;
    noise.connect(bp).connect(ng).connect(master);
    noise.start();
    return true;
  }

  function sync() {
    buttons.forEach(b => {
      b.setAttribute('aria-pressed', String(on));
      const label = b.querySelector('[data-sound-label]');
      if (label) label.textContent = on ? 'Sound on' : 'Sound off';
    });
  }

  const sound = {
    get on() { return on; },
    async toggle() {
      if (!ctx && !build()) return;
      if (ctx.state === 'suspended') await ctx.resume();
      on = !on;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(on ? 0.22 : 0, now + (on ? 2.5 : 0.6));
      sync();
    },
    /** Soft bell — only audible when the visitor has turned sound on. */
    chime() {
      if (!on || !ctx) return;
      const now = ctx.currentTime;
      [587.33, 880, 1174.66].forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.09 / (i + 1), now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
        o.connect(g).connect(master);
        o.start(now + i * 0.06);
        o.stop(now + 3.4);
      });
    },
    bind(btn) {
      if (!btn) return;
      buttons.add(btn);
      btn.addEventListener('click', () => sound.toggle());
      sync();
    }
  };

  A.sound = sound;
})(window.ANVAYA);
