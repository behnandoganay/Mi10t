// Prosedürel sprite üretimi — hiçbir görsel dosya gerekmez.
// Her sprite bir kez offscreen canvas'a çizilir, oyun sırasında drawImage ile basılır.
const Sprites = (() => {
  function make(w, h, draw) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d');
    draw(g, w, h);
    return c;
  }

  const player = make(48, 56, (g, w, h) => {
    const cx = w / 2;
    // motor alevi
    const flame = g.createLinearGradient(0, h - 18, 0, h);
    flame.addColorStop(0, '#ffd166');
    flame.addColorStop(1, 'rgba(255,80,40,0)');
    g.fillStyle = flame;
    g.beginPath();
    g.moveTo(cx - 6, h - 16);
    g.lineTo(cx, h);
    g.lineTo(cx + 6, h - 16);
    g.closePath();
    g.fill();
    // gövde
    const body = g.createLinearGradient(0, 0, 0, h);
    body.addColorStop(0, '#e8f6ff');
    body.addColorStop(0.5, '#5ab9ff');
    body.addColorStop(1, '#1b5e9e');
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(cx, 2);
    g.lineTo(cx + 9, 26);
    g.lineTo(cx + 22, 42);
    g.lineTo(cx + 14, 46);
    g.lineTo(cx + 5, 40);
    g.lineTo(cx - 5, 40);
    g.lineTo(cx - 14, 46);
    g.lineTo(cx - 22, 42);
    g.lineTo(cx - 9, 26);
    g.closePath();
    g.fill();
    // kokpit
    g.fillStyle = '#0e2a4a';
    g.beginPath();
    g.ellipse(cx, 22, 4, 8, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#9fe8ff';
    g.beginPath();
    g.ellipse(cx, 20, 2.5, 4.5, 0, 0, Math.PI * 2);
    g.fill();
  });

  // Temel düşman: yeşil böcek
  const enemyBasic = make(40, 34, (g, w, h) => {
    const cx = w / 2, cy = h / 2;
    g.fillStyle = '#3ddc7a';
    g.beginPath();
    g.ellipse(cx, cy, 15, 11, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#1e8a4a';
    g.beginPath(); // kanatlar
    g.moveTo(cx - 12, cy - 4);
    g.lineTo(cx - 19, cy - 13);
    g.lineTo(cx - 8, cy - 9);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(cx + 12, cy - 4);
    g.lineTo(cx + 19, cy - 13);
    g.lineTo(cx + 8, cy - 9);
    g.closePath();
    g.fill();
    g.fillStyle = '#062';
    g.beginPath();
    g.arc(cx - 5, cy + 1, 3, 0, Math.PI * 2);
    g.arc(cx + 5, cy + 1, 3, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#eaffd0';
    g.beginPath();
    g.arc(cx - 5, cy, 1.4, 0, Math.PI * 2);
    g.arc(cx + 5, cy, 1.4, 0, Math.PI * 2);
    g.fill();
  });

  // Dalıcı düşman: kırmızı ok
  const enemyDiver = make(38, 40, (g, w, h) => {
    const cx = w / 2;
    const body = g.createLinearGradient(0, 0, 0, h);
    body.addColorStop(0, '#ff8080');
    body.addColorStop(1, '#a01030');
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(cx, h - 3);
    g.lineTo(cx + 15, 8);
    g.lineTo(cx + 5, 14);
    g.lineTo(cx, 6);
    g.lineTo(cx - 5, 14);
    g.lineTo(cx - 15, 8);
    g.closePath();
    g.fill();
    g.fillStyle = '#ffd6a0';
    g.beginPath();
    g.arc(cx, 22, 4, 0, Math.PI * 2);
    g.fill();
  });

  // Atıcı düşman: mor UFO
  const enemyShooter = make(44, 32, (g, w, h) => {
    const cx = w / 2, cy = h / 2;
    g.fillStyle = '#b06cff';
    g.beginPath();
    g.ellipse(cx, cy + 3, 20, 8, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#7a3fd0';
    g.beginPath();
    g.ellipse(cx, cy + 6, 14, 4, 0, 0, Math.PI * 2);
    g.fill();
    const dome = g.createRadialGradient(cx, cy - 4, 1, cx, cy - 4, 10);
    dome.addColorStop(0, '#ffe9ff');
    dome.addColorStop(1, '#c690ff');
    g.fillStyle = dome;
    g.beginPath();
    g.arc(cx, cy - 3, 9, Math.PI, 0);
    g.fill();
    g.fillStyle = '#ffe06a';
    for (let i = -1; i <= 1; i++) {
      g.beginPath();
      g.arc(cx + i * 10, cy + 5, 2, 0, Math.PI * 2);
      g.fill();
    }
  });

  function makeOrb(color, letter) {
    return make(34, 34, (g, w, h) => {
      const cx = w / 2, cy = h / 2;
      const grad = g.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, 15);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, color);
      grad.addColorStop(1, '#111');
      g.fillStyle = grad;
      g.beginPath();
      g.arc(cx, cy, 14, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = 'rgba(255,255,255,0.85)';
      g.lineWidth = 2;
      g.stroke();
      g.fillStyle = '#fff';
      g.font = 'bold 15px system-ui, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(letter, cx, cy + 1);
    });
  }

  return {
    player,
    enemyBasic,
    enemyDiver,
    enemyShooter,
    orbDouble: makeOrb('#4fc3ff', 'Ç'),  // çift atış
    orbSpeed: makeOrb('#3ddc7a', 'H'),   // hız
    orbShield: makeOrb('#ffd166', 'K'),  // kalkan
    orbLife: makeOrb('#ff6b8a', '♥'),    // ekstra can
  };
})();
