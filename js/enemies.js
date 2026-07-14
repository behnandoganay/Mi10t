// Düşmanlar ve dalga (wave) sistemi.
// Her düşman formasyondaki yerine bir bezier yolu üzerinden uçarak girer
// (state: 'enter'), sonra formasyonda salınır ('formation'). Dalıcılar
// zaman zaman oyuncuya pike yapar ('dive'), atıcılar formasyondan ateş eder.
const Enemies = (() => {
  const TYPES = {
    basic:   { sprite: () => Sprites.enemyBasic,   r: 14, hp: 1, score: 10 },
    diver:   { sprite: () => Sprites.enemyDiver,   r: 13, hp: 1, score: 15 },
    shooter: { sprite: () => Sprites.enemyShooter, r: 15, hp: 2, score: 20 },
  };

  let list = [];
  let waveTimer = 0;   // dalga arası geri sayım
  let betweenWaves = false;

  function bezier(p0, p1, p2, p3, t) {
    const u = 1 - t;
    const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    return {
      x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
      y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
    };
  }

  function difficulty(wave) {
    return {
      count: Math.min(8 + wave * 2, 26),
      speedMul: Math.min(1 + wave * 0.06, 2.0),
      shootInterval: Math.max(3.2 - wave * 0.15, 1.1),
      diveInterval: Math.max(5.5 - wave * 0.25, 2.0),
      shooterHp: wave >= 8 ? 3 : 2,
    };
  }

  function spawnWave(wave, w) {
    const diff = difficulty(wave);
    const cols = 6;
    const rows = Math.ceil(diff.count / cols);
    const spacing = Math.min((w - 60) / (cols - 1), 62);
    const left = w / 2 - spacing * (cols - 1) / 2;
    const fromLeft = wave % 2 === 0;

    for (let i = 0; i < diff.count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      // satıra göre tip: üst satır atıcı, orta dalıcı, alt temel
      let typeId = 'basic';
      if (row === 0 && wave >= 2) typeId = 'shooter';
      else if (row === 1 && wave >= 1) typeId = 'diver';
      const type = TYPES[typeId];

      const slotX = left + col * spacing;
      const slotY = 100 + row * 56;
      const startX = fromLeft ? -40 : w + 40;
      const start = { x: startX, y: 180 + row * 30 };

      list.push({
        typeId,
        type,
        hp: typeId === 'shooter' ? diff.shooterHp : type.hp,
        x: start.x,
        y: start.y,
        slotX,
        slotY,
        state: 'enter',
        t: -(i * 0.12),          // sıralı giriş için negatif gecikme
        enterPath: [
          start,
          { x: w / 2 + (fromLeft ? 120 : -120), y: 420 },
          { x: slotX + (fromLeft ? -160 : 160), y: slotY + 180 },
          { x: slotX, y: slotY },
        ],
        phase: Math.random() * Math.PI * 2,
        shootTimer: diff.shootInterval * (0.5 + Math.random()),
        diveTimer: diff.diveInterval * (0.8 + Math.random() * 1.2),
        divePath: null,
        speedMul: diff.speedMul,
        shootInterval: diff.shootInterval,
        diveInterval: diff.diveInterval,
      });
    }
  }

  function startDive(e, w, h) {
    const ship = Player.ship;
    e.state = 'dive';
    e.t = 0;
    e.divePath = [
      { x: e.x, y: e.y },
      { x: e.x + (Math.random() < 0.5 ? -140 : 140), y: e.y + 120 },
      { x: ship.x, y: ship.y - 60 },
      { x: ship.x + (Math.random() * 160 - 80), y: h + 60 },
    ];
  }

  function update(dt, time, w, h) {
    if (betweenWaves) {
      waveTimer -= dt;
      if (waveTimer <= 0) {
        betweenWaves = false;
        Game.wave++;
        spawnWave(Game.wave, w);
      }
      return;
    }

    for (const e of list) {
      if (e.state === 'enter') {
        e.t += dt * 0.85 * e.speedMul;
        if (e.t < 0) continue; // sıra gecikmesi
        const t = Math.min(e.t, 1);
        const p = bezier(e.enterPath[0], e.enterPath[1], e.enterPath[2], e.enterPath[3], t);
        e.x = p.x;
        e.y = p.y;
        if (e.t >= 1) e.state = 'formation';
      } else if (e.state === 'formation') {
        e.x = e.slotX + Math.sin(time * 1.6 + e.phase) * 14;
        e.y = e.slotY + Math.sin(time * 2.3 + e.phase) * 6;

        if (e.typeId === 'shooter') {
          e.shootTimer -= dt;
          if (e.shootTimer <= 0) {
            e.shootTimer = e.shootInterval * (0.7 + Math.random() * 0.6);
            const ship = Player.ship;
            const dx = ship.x - e.x;
            const dy = ship.y - e.y;
            const len = Math.hypot(dx, dy) || 1;
            const spd = 210 * e.speedMul;
            Bullets.fireEnemy(e.x, e.y + 10, dx / len * spd, dy / len * spd);
          }
        }
        if (e.typeId === 'diver') {
          e.diveTimer -= dt;
          if (e.diveTimer <= 0) startDive(e, w, h);
        }
      } else if (e.state === 'dive') {
        e.t += dt * 0.55 * e.speedMul;
        const t = Math.min(e.t, 1);
        const p = bezier(e.divePath[0], e.divePath[1], e.divePath[2], e.divePath[3], t);
        e.x = p.x;
        e.y = p.y;
        if (e.t >= 1) {
          // ekranın altından çıktı; üstten formasyona geri dön
          e.state = 'return';
          e.x = e.slotX;
          e.y = -40;
          e.diveTimer = e.diveInterval * (0.8 + Math.random() * 1.2);
        }
      } else if (e.state === 'return') {
        const dy = e.slotY - e.y;
        e.y += Math.min(dy, 160 * dt);
        if (dy < 2) e.state = 'formation';
      }
    }
  }

  return {
    list,
    isBetweenWaves: () => betweenWaves,
    waveCountdown: () => waveTimer,
    reset(w) {
      list.length = 0;
      betweenWaves = false;
      spawnWave(Game.wave, w);
    },
    update(dt, time, w, h) {
      update(dt, time, w, h);
      // dalga temizlendi mi?
      if (!betweenWaves && list.length === 0) {
        betweenWaves = true;
        waveTimer = 2.0;
      }
    },
    // Mermiyle vurulma; öldüyse true döner
    damage(e, amount) {
      e.hp -= amount;
      if (e.hp <= 0) {
        const i = list.indexOf(e);
        if (i >= 0) list.splice(i, 1);
        return true;
      }
      return false;
    },
    draw(ctx) {
      for (const e of list) {
        if (e.state === 'enter' && e.t < 0) continue;
        const s = e.type.sprite();
        ctx.drawImage(s, e.x - s.width / 2, e.y - s.height / 2);
      }
    },
  };
})();
