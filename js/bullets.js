// Oyuncu ve düşman mermileri — obje havuzu ile (GC baskısını azaltır).
const Bullets = (() => {
  const POOL_SIZE = 96;

  function makePool() {
    const arr = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      arr.push({ active: false, x: 0, y: 0, vx: 0, vy: 0, r: 4 });
    }
    return arr;
  }

  const player = makePool();
  const enemy = makePool();

  function spawn(pool, x, y, vx, vy, r) {
    for (const b of pool) {
      if (!b.active) {
        b.active = true;
        b.x = x;
        b.y = y;
        b.vx = vx;
        b.vy = vy;
        b.r = r;
        return b;
      }
    }
    return null;
  }

  function updatePool(pool, dt, w, h) {
    for (const b of pool) {
      if (!b.active) continue;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.y < -20 || b.y > h + 20 || b.x < -20 || b.x > w + 20) b.active = false;
    }
  }

  return {
    player,
    enemy,
    firePlayer(x, y) {
      spawn(player, x, y, 0, -640, 4);
    },
    fireEnemy(x, y, vx, vy) {
      spawn(enemy, x, y, vx, vy, 5);
    },
    update(dt, w, h) {
      updatePool(player, dt, w, h);
      updatePool(enemy, dt, w, h);
    },
    reset() {
      for (const b of player) b.active = false;
      for (const b of enemy) b.active = false;
    },
    draw(ctx) {
      ctx.fillStyle = '#8fe9ff';
      for (const b of player) {
        if (!b.active) continue;
        ctx.fillRect(b.x - 2, b.y - 9, 4, 14);
      }
      for (const b of enemy) {
        if (!b.active) continue;
        const grad = ctx.createRadialGradient(b.x, b.y, 1, b.x, b.y, b.r + 2);
        grad.addColorStop(0, '#fff2b0');
        grad.addColorStop(1, '#ff5a3c');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r + 1, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  };
})();
