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

  // Patlama: alçak gümleme + sönümlenen gürültü.
  function boom() {
    const c = ac();
    if (!c) return;
    const t0 = c.currentTime;
    const dur = 0.6;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(1400, t0);
    f.frequency.exponentialRampToValueAtTime(120, t0 + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.5, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f).connect(g).connect(c.destination);
    src.start(t0);
    tone(70, 0.5, { type: 'sine', gain: 0.3 });
  }

  return {
    unlock: ac, // ilk dokunuşta çağrılır (mobil otomatik çalma kilidi)
    tick() { tone(1100, 0.06, { type: 'square', gain: 0.05 }); },
    ok() { tone(520, 0.09); tone(780, 0.12, { at: 0.08 }); },
    bad() { tone(170, 0.18, { type: 'sawtooth', gain: 0.09 }); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.14, { at: i * 0.11 })); },
    boom,
  };
})();
