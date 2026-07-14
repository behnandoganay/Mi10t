// Oyuncu gemisi: hareket, ateş, can, dokunulmazlık, power-up durumları.
const Player = (() => {
  const BASE_SPEED = 300;
  const FIRE_COOLDOWN = 0.18;
  const INVULN_TIME = 2.2;
  const MAX_LIVES = 5;

  const ship = {
    x: 0, y: 0, r: 14,
    lives: 3,
    speedLevel: 0,     // her seviye +%20 hız (en fazla 3)
    doubleShot: false,
    shield: false,
    invuln: 0,
    fireTimer: 0,
    alive: true,
  };

  return {
    ship,
    reset(w, h) {
      ship.x = w / 2;
      ship.y = h - 140;
      ship.lives = 3;
      ship.speedLevel = 0;
      ship.doubleShot = false;
      ship.shield = false;
      ship.invuln = 0;
      ship.fireTimer = 0;
      ship.alive = true;
    },
    update(dt, w, h) {
      if (!ship.alive) return;
      const mv = Input.getMove();
      const speed = BASE_SPEED * (1 + ship.speedLevel * 0.2);
      ship.x += mv.x * speed * dt;
      ship.y += mv.y * speed * dt;
      ship.x = Math.max(26, Math.min(w - 26, ship.x));
      ship.y = Math.max(60, Math.min(h - 34, ship.y));

      if (ship.invuln > 0) ship.invuln -= dt;
      ship.fireTimer -= dt;
      if (Input.isFiring() && ship.fireTimer <= 0) {
        ship.fireTimer = FIRE_COOLDOWN;
        if (ship.doubleShot) {
          Bullets.firePlayer(ship.x - 9, ship.y - 16);
          Bullets.firePlayer(ship.x + 9, ship.y - 16);
        } else {
          Bullets.firePlayer(ship.x, ship.y - 20);
        }
        Sound.shoot();
      }
    },
    // Vuruş alındığında çağrılır; oyun bittiyse true döner
    takeHit() {
      if (ship.invuln > 0 || !ship.alive) return false;
      if (ship.shield) {
        ship.shield = false;
        ship.invuln = 1.2;
        Sound.hit();
        return false;
      }
      ship.lives--;
      Sound.hit();
      Particles.explosion(ship.x, ship.y, '#5ab9ff', 22);
      if (ship.lives <= 0) {
        ship.alive = false;
        return true;
      }
      ship.invuln = INVULN_TIME;
      // güç kaybı: warblade tarzı — vurulunca çift atış gider
      ship.doubleShot = false;
      return false;
    },
    applyPowerup(id) {
      switch (id) {
        case 'double': ship.doubleShot = true; break;
        case 'speed': ship.speedLevel = Math.min(3, ship.speedLevel + 1); break;
        case 'shield': ship.shield = true; break;
        case 'life': ship.lives = Math.min(MAX_LIVES, ship.lives + 1); break;
      }
      Sound.powerup();
    },
    draw(ctx, time) {
      if (!ship.alive) return;
      // dokunulmazlıkta yanıp sönme
      if (ship.invuln > 0 && Math.floor(time * 12) % 2 === 0) return;
      const s = Sprites.player;
      ctx.drawImage(s, ship.x - s.width / 2, ship.y - s.height / 2);
      if (ship.shield) {
        ctx.strokeStyle = 'rgba(255, 209, 102, 0.8)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, 26 + Math.sin(time * 6) * 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
  };
})();
