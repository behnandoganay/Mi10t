// Dokunmatik kontroller: sol yarıda dinamik sanal joystick, sağ yarıda ateş.
// Multi-touch: her kontrol kendi touch id'sini takip eder.
// Masaüstü testi için klavye (ok tuşları / WASD + boşluk) da desteklenir.
const Input = (() => {
  const JOY_RADIUS = 60;   // joystick maksimum sapma (px)
  const DEAD_ZONE = 8;     // ölü bölge (px)

  const joy = { active: false, id: null, ox: 0, oy: 0, x: 0, y: 0, dx: 0, dy: 0 };
  const fire = { active: false, id: null };
  const fireBtn = { x: 0, y: 0, r: 44 }; // hud.js çizer, resize'da konumlanır
  const keys = {};
  let taps = []; // menü/buton tıklamaları için {x, y}
  let canvas = null;

  function pos(touch) {
    const rect = canvas.getBoundingClientRect();
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }

  function updateJoyVector() {
    let dx = joy.x - joy.ox;
    let dy = joy.y - joy.oy;
    const len = Math.hypot(dx, dy);
    if (len < DEAD_ZONE) {
      joy.dx = 0;
      joy.dy = 0;
      return;
    }
    if (len > JOY_RADIUS) {
      dx = dx / len * JOY_RADIUS;
      dy = dy / len * JOY_RADIUS;
      joy.x = joy.ox + dx;
      joy.y = joy.oy + dy;
    }
    joy.dx = dx / JOY_RADIUS;
    joy.dy = dy / JOY_RADIUS;
  }

  function onTouchStart(e) {
    e.preventDefault();
    Sound.unlock();
    for (const t of e.changedTouches) {
      const p = pos(t);
      taps.push({ x: p.x, y: p.y });
      if (Game.state !== 'PLAYING') continue;
      if (p.x < canvas.clientWidth * 0.5 && !joy.active) {
        joy.active = true;
        joy.id = t.identifier;
        joy.ox = p.x;
        joy.oy = p.y;
        joy.x = p.x;
        joy.y = p.y;
        joy.dx = 0;
        joy.dy = 0;
      } else if (p.x >= canvas.clientWidth * 0.5 && !fire.active) {
        fire.active = true;
        fire.id = t.identifier;
      }
    }
  }

  function onTouchMove(e) {
    e.preventDefault();
    for (const t of e.changedTouches) {
      if (joy.active && t.identifier === joy.id) {
        const p = pos(t);
        joy.x = p.x;
        joy.y = p.y;
        updateJoyVector();
      }
    }
  }

  function onTouchEnd(e) {
    e.preventDefault();
    for (const t of e.changedTouches) {
      if (joy.active && t.identifier === joy.id) {
        joy.active = false;
        joy.id = null;
        joy.dx = 0;
        joy.dy = 0;
      }
      if (fire.active && t.identifier === fire.id) {
        fire.active = false;
        fire.id = null;
      }
    }
  }

  function onKey(e, down) {
    if (down && e.repeat) return;
    keys[e.code] = down;
    if (down) Sound.unlock();
    if (down && (e.code === 'Space' || e.code === 'Enter')) {
      // klavyede menü onayı: ekran ortasına tap gibi davran
      if (Game.state !== 'PLAYING') taps.push({ x: canvas.clientWidth / 2, y: canvas.clientHeight * 0.62 });
    }
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
  }

  return {
    joy,
    fireBtn,
    init(cv) {
      canvas = cv;
      canvas.addEventListener('touchstart', onTouchStart, { passive: false });
      canvas.addEventListener('touchmove', onTouchMove, { passive: false });
      canvas.addEventListener('touchend', onTouchEnd, { passive: false });
      canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
      canvas.addEventListener('mousedown', (e) => {
        Sound.unlock();
        const rect = canvas.getBoundingClientRect();
        taps.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      });
      window.addEventListener('keydown', (e) => onKey(e, true));
      window.addEventListener('keyup', (e) => onKey(e, false));
    },
    layout(w, h) {
      fireBtn.x = w - 74;
      fireBtn.y = h - 90;
    },
    // Hareket vektörü: joystick öncelikli, yoksa klavye
    getMove() {
      if (joy.active && (joy.dx || joy.dy)) return { x: joy.dx, y: joy.dy };
      let x = 0, y = 0;
      if (keys.ArrowLeft || keys.KeyA) x -= 1;
      if (keys.ArrowRight || keys.KeyD) x += 1;
      if (keys.ArrowUp || keys.KeyW) y -= 1;
      if (keys.ArrowDown || keys.KeyS) y += 1;
      if (x && y) { x *= 0.7071; y *= 0.7071; }
      return { x, y };
    },
    isFiring() {
      return fire.active || !!keys.Space;
    },
    fireActive() {
      return fire.active;
    },
    consumeTaps() {
      const t = taps;
      taps = [];
      return t;
    },
  };
})();
