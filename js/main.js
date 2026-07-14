// Oyun döngüsü, durum makinesi (MENU → PLAYING → GAME_OVER),
// yıldız alanı, parçacıklar ve çarpışma çözümü.

// Basit parçacık sistemi (patlama efektleri)
const Particles = (() => {
  const list = [];
  return {
    explosion(x, y, color, count = 14) {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 60 + Math.random() * 220;
        list.push({
          x, y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          life: 0.5 + Math.random() * 0.3,
          t: 0,
          color,
          size: 2 + Math.random() * 3,
        });
      }
    },
    update(dt) {
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.t += dt;
        if (p.t >= p.life) { list.splice(i, 1); continue; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.96;
        p.vy *= 0.96;
      }
    },
    reset() { list.length = 0; },
    draw(ctx) {
      for (const p of list) {
        ctx.globalAlpha = 1 - p.t / p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1;
    },
  };
})();

const Game = {
  state: 'MENU',
  score: 0,
  wave: 1,
  best: parseInt(localStorage.getItem('uzay_savascisi_rekor') || '0', 10) || 0,
};

(() => {
  const STEP = 1 / 60;
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;
  let lastTime = 0;
  let acc = 0;
  let elapsed = 0; // toplam oyun zamanı (animasyonlar için)
  let stars = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth || window.innerWidth;
    H = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    Input.layout(W, H);
    makeStars();
  }

  function makeStars() {
    stars = [];
    const layers = [
      { count: Math.round(W * H / 14000), speed: 22, size: 1, alpha: 0.5 },
      { count: Math.round(W * H / 22000), speed: 48, size: 1.6, alpha: 0.75 },
      { count: Math.round(W * H / 45000), speed: 90, size: 2.4, alpha: 1 },
    ];
    for (const l of layers) {
      for (let i = 0; i < l.count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          speed: l.speed,
          size: l.size,
          alpha: l.alpha,
        });
      }
    }
  }

  function startGame() {
    Game.state = 'PLAYING';
    Game.score = 0;
    Game.wave = 1;
    Player.reset(W, H);
    Bullets.reset();
    Powerups.reset();
    Particles.reset();
    Enemies.reset(W);
    Sound.click();
  }

  function gameOver() {
    Game.state = 'GAME_OVER';
    if (Game.score > Game.best) {
      Game.best = Game.score;
      localStorage.setItem('uzay_savascisi_rekor', String(Game.best));
    }
    Sound.gameover();
  }

  function handleCollisions() {
    const ship = Player.ship;

    // oyuncu mermisi ↔ düşman
    for (const b of Bullets.player) {
      if (!b.active) continue;
      for (const e of Enemies.list) {
        if (e.state === 'enter' && e.t < 0) continue;
        if (Collision.circles(b.x, b.y, b.r, e.x, e.y, e.type.r)) {
          b.active = false;
          if (Enemies.damage(e, 1)) {
            Game.score += e.type.score;
            Particles.explosion(e.x, e.y, '#ffb04f');
            Powerups.maybeDrop(e.x, e.y);
            Sound.explosion();
          } else {
            Particles.explosion(e.x, e.y, '#ffffff', 4);
          }
          break;
        }
      }
    }

    if (!ship.alive) return;

    // düşman mermisi ↔ oyuncu
    for (const b of Bullets.enemy) {
      if (!b.active) continue;
      if (Collision.circles(b.x, b.y, b.r, ship.x, ship.y, ship.r)) {
        b.active = false;
        if (Player.takeHit()) { gameOver(); return; }
      }
    }

    // düşman gövdesi ↔ oyuncu
    for (const e of Enemies.list) {
      if (e.state === 'enter' && e.t < 0) continue;
      if (Collision.circles(e.x, e.y, e.type.r, ship.x, ship.y, ship.r)) {
        if (Enemies.damage(e, 99)) {
          Particles.explosion(e.x, e.y, '#ffb04f');
          Sound.explosion();
        }
        if (Player.takeHit()) { gameOver(); return; }
      }
    }

    // power-up toplama
    for (const id of Powerups.collect(ship.x, ship.y, ship.r)) {
      Player.applyPowerup(id);
      Game.score += 5;
    }
  }

  function update(dt) {
    elapsed += dt;

    // yıldızlar her durumda akar
    for (const s of stars) {
      s.y += s.speed * dt;
      if (s.y > H + 3) {
        s.y = -3;
        s.x = Math.random() * W;
      }
    }

    const taps = Input.consumeTaps();

    if (Game.state === 'MENU' || Game.state === 'GAME_OVER') {
      for (const t of taps) {
        if (HUD.tapOnButton(t)) { startGame(); break; }
      }
      return;
    }

    // PLAYING
    Player.update(dt, W, H);
    Enemies.update(dt, elapsed, W, H);
    Bullets.update(dt, W, H);
    Powerups.update(dt, H);
    Particles.update(dt);
    handleCollisions();
  }

  function draw() {
    ctx.fillStyle = '#050814';
    ctx.fillRect(0, 0, W, H);

    for (const s of stars) {
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = '#cfe8ff';
      ctx.fillRect(s.x, s.y, s.size, s.size);
    }
    ctx.globalAlpha = 1;

    if (Game.state === 'MENU') {
      HUD.drawMenu(ctx, W, H, elapsed);
      return;
    }

    Powerups.draw(ctx);
    Enemies.draw(ctx);
    Bullets.draw(ctx);
    Player.draw(ctx, elapsed);
    Particles.draw(ctx);
    HUD.drawGame(ctx, W, H, elapsed);

    if (Game.state === 'GAME_OVER') {
      HUD.drawGameOver(ctx, W, H, elapsed);
    }
  }

  function loop(now) {
    requestAnimationFrame(loop);
    if (!lastTime) lastTime = now;
    let dt = (now - lastTime) / 1000;
    lastTime = now;
    if (dt > 0.1) dt = 0.1; // sekme arka plana alınırsa büyük sıçramayı önle

    acc += dt;
    while (acc >= STEP) {
      update(STEP);
      acc -= STEP;
    }
    draw();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 200));
  document.addEventListener('visibilitychange', () => { lastTime = 0; });

  Input.init(canvas);
  resize();
  requestAnimationFrame(loop);
})();
