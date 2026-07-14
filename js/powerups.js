// Power-up'lar: ölen düşmanlardan rastgele düşer, aşağı süzülür.
const Powerups = (() => {
  const DROP_CHANCE = 0.13;
  const FALL_SPEED = 95;
  const TYPES = [
    { id: 'double', sprite: () => Sprites.orbDouble, weight: 34 },
    { id: 'speed', sprite: () => Sprites.orbSpeed, weight: 30 },
    { id: 'shield', sprite: () => Sprites.orbShield, weight: 26 },
    { id: 'life', sprite: () => Sprites.orbLife, weight: 10 },
  ];
  const TOTAL_WEIGHT = TYPES.reduce((s, t) => s + t.weight, 0);

  let items = [];

  function pickType() {
    let r = Math.random() * TOTAL_WEIGHT;
    for (const t of TYPES) {
      r -= t.weight;
      if (r <= 0) return t;
    }
    return TYPES[0];
  }

  return {
    items,
    maybeDrop(x, y) {
      if (Math.random() > DROP_CHANCE) return;
      items.push({ type: pickType(), x, y, t: Math.random() * 6, r: 15 });
    },
    update(dt, h) {
      for (let i = items.length - 1; i >= 0; i--) {
        const p = items[i];
        p.t += dt;
        p.y += FALL_SPEED * dt;
        p.x += Math.sin(p.t * 2.2) * 30 * dt;
        if (p.y > h + 24) items.splice(i, 1);
      }
    },
    // Oyuncuyla çarpışanları toplar, toplanan tip id'lerini döndürür
    collect(px, py, pr) {
      const got = [];
      for (let i = items.length - 1; i >= 0; i--) {
        const p = items[i];
        if (Collision.circles(px, py, pr + 6, p.x, p.y, p.r)) {
          got.push(p.type.id);
          items.splice(i, 1);
        }
      }
      return got;
    },
    reset() {
      items.length = 0;
    },
    draw(ctx) {
      for (const p of items) {
        const s = p.type.sprite();
        const bob = Math.sin(p.t * 4) * 2;
        ctx.drawImage(s, p.x - s.width / 2, p.y - s.height / 2 + bob);
      }
    },
  };
})();
