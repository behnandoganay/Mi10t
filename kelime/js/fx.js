// fx.js — Görsel efektler: bomba patlaması ve konfeti. Saf DOM + CSS animasyonu.

const FX = (() => {
  const COLORS = ['#4a63c8', '#c26a12', '#b8860b', '#22885c', '#c43d3d'];

  // Süre dolunca tam ekran patlama; bitince done() çağrılır.
  function explode(done) {
    const o = document.createElement('div');
    o.className = 'fx-overlay';
    let html = '<div class="fx-flash"></div><div class="fx-boom">💥</div>';
    for (let i = 0; i < 22; i++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = 90 + Math.random() * 170;
      const dx = (Math.cos(ang) * dist).toFixed(0);
      const dy = (Math.sin(ang) * dist).toFixed(0);
      const rot = (Math.random() * 720 - 360).toFixed(0);
      html += `<span class="fx-part" style="--dx:${dx}px;--dy:${dy}px;--rot:${rot}deg;` +
        `background:${COLORS[i % COLORS.length]};animation-delay:${(Math.random() * 0.08).toFixed(2)}s"></span>`;
    }
    o.innerHTML = html;
    document.body.appendChild(o);
    const app = document.getElementById('app');
    app.classList.add('shake-hard');
    setTimeout(() => {
      app.classList.remove('shake-hard');
      o.remove();
      if (done) done();
    }, 1050);
  }

  // Kazanan ekranı için yukarıdan konfeti yağmuru.
  function confetti(count = 28) {
    const pieces = [];
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'fx-confetti';
      s.style.left = (Math.random() * 100).toFixed(1) + 'vw';
      s.style.background = COLORS[i % COLORS.length];
      s.style.setProperty('--rot', (Math.random() * 720 - 360).toFixed(0) + 'deg');
      s.style.animationDuration = (1.4 + Math.random() * 1.4).toFixed(2) + 's';
      s.style.animationDelay = (Math.random() * 0.6).toFixed(2) + 's';
      document.body.appendChild(s);
      pieces.push(s);
    }
    setTimeout(() => pieces.forEach((p) => p.remove()), 3600);
  }

  return { explode, confetti };
})();
