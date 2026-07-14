// Web Audio API ile sentezlenen sesler — ses dosyası gerekmez.
// Mobil tarayıcılar ilk kullanıcı dokunuşundan önce ses çalmayı engeller;
// unlock() ilk dokunuşta çağrılır.
const Sound = (() => {
  let ctx = null;
  let master = null;
  let noiseBuf = null;
  let enabled = true;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { enabled = false; return false; }
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
      // patlama sesleri için beyaz gürültü tamponu
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    return true;
  }

  function unlock() {
    if (!enabled) return;
    if (!ensure()) return;
    if (ctx.state === 'suspended') ctx.resume();
  }

  function ready() {
    return enabled && ctx && ctx.state === 'running';
  }

  function tone(type, f0, f1, dur, vol, delay = 0) {
    if (!ready()) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  function noise(dur, vol, freq) {
    if (!ready()) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(freq, t);
    filt.frequency.exponentialRampToValueAtTime(80, t + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filt).connect(gain).connect(master);
    src.start(t);
    src.stop(t + dur);
  }

  return {
    unlock,
    shoot() { tone('square', 900, 220, 0.09, 0.06); },
    explosion() { noise(0.35, 0.4, 1800); tone('sawtooth', 160, 40, 0.3, 0.15); },
    hit() { noise(0.5, 0.5, 2500); tone('sawtooth', 220, 50, 0.45, 0.25); },
    powerup() { tone('sine', 520, 1040, 0.12, 0.2); tone('sine', 780, 1560, 0.14, 0.15, 0.09); },
    click() { tone('square', 660, 660, 0.05, 0.12); },
    gameover() {
      tone('triangle', 440, 440, 0.22, 0.2);
      tone('triangle', 330, 330, 0.22, 0.2, 0.22);
      tone('triangle', 220, 110, 0.6, 0.2, 0.44);
    },
  };
})();
