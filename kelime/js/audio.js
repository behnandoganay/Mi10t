// audio.js — Web Audio ile sentez sesler; ses dosyası yok.

const Sound = (() => {
  let ctx = null;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, { type = 'sine', gain = 0.12, at = 0 } = {}) {
    const c = ac();
    if (!c) return;
    const t0 = c.currentTime + at;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  return {
    unlock: ac, // ilk dokunuşta çağrılır (mobil otomatik çalma kilidi)
    tick() { tone(1100, 0.06, { type: 'square', gain: 0.05 }); },
    ok() { tone(520, 0.09); tone(780, 0.12, { at: 0.08 }); },
    bad() { tone(170, 0.18, { type: 'sawtooth', gain: 0.09 }); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.14, { at: i * 0.11 })); },
  };
})();
