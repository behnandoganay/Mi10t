// HUD: skor, dalga, canlar, dokunmatik kontrol görselleri, menü ve
// oyun sonu ekranları. Buton dokunuş testi de burada.
const HUD = (() => {
  const button = { x: 0, y: 0, w: 220, h: 64 }; // menü/gameover ana butonu

  function drawButton(ctx, w, h, label, time) {
    button.x = w / 2 - button.w / 2;
    button.y = h * 0.62 - button.h / 2;
    const pulse = 0.6 + Math.sin(time * 3) * 0.15;
    ctx.fillStyle = `rgba(60, 160, 255, ${pulse * 0.35})`;
    ctx.strokeStyle = '#5ab9ff';
    ctx.lineWidth = 2;
    roundRect(ctx, button.x, button.y, button.w, button.h, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e8f6ff';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, button.y + button.h / 2 + 1);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  return {
    tapOnButton(tap) {
      return tap.x >= button.x && tap.x <= button.x + button.w &&
             tap.y >= button.y && tap.y <= button.y + button.h;
    },

    drawGame(ctx, w, h, time) {
      // skor + dalga + canlar
      ctx.fillStyle = '#e8f6ff';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(String(Game.score).padStart(6, '0'), 14, 12);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#9fd8ff';
      ctx.font = '15px system-ui, sans-serif';
      ctx.fillText('DALGA ' + Game.wave, w / 2, 14);

      // canlar: küçük gemi ikonları sağ üstte
      const s = Sprites.player;
      for (let i = 0; i < Player.ship.lives; i++) {
        ctx.drawImage(s, w - 26 - i * 22, 10, s.width * 0.42, s.height * 0.42);
      }

      // dalga arası duyuru
      if (Enemies.isBetweenWaves()) {
        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 30px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DALGA ' + (Game.wave + 1), w / 2, h * 0.4);
      }

      // sanal joystick
      const joy = Input.joy;
      if (joy.active) {
        ctx.strokeStyle = 'rgba(160, 210, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(joy.ox, joy.oy, 52, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(160, 210, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(joy.x, joy.y, 24, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // ipucu halkası sol altta
        ctx.strokeStyle = 'rgba(160, 210, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(84, h - 100, 44, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ateş butonu
      const fb = Input.fireBtn;
      const firing = Input.fireActive();
      ctx.fillStyle = firing ? 'rgba(255, 110, 80, 0.55)' : 'rgba(255, 110, 80, 0.22)';
      ctx.strokeStyle = 'rgba(255, 140, 110, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(fb.x, fb.y, fb.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 230, 220, 0.9)';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ATEŞ', fb.x, fb.y + 1);
    },

    drawMenu(ctx, w, h, time) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#5ab9ff';
      ctx.font = 'bold 44px system-ui, sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText('UZAY', w / 2, h * 0.26);
      ctx.fillStyle = '#e8f6ff';
      ctx.fillText('SAVAŞÇISI', w / 2, h * 0.26 + 48);

      ctx.fillStyle = '#9fd8ff';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('Sol yarı: hareket (joystick)', w / 2, h * 0.44);
      ctx.fillText('Sağ yarı: ateş', w / 2, h * 0.44 + 26);

      if (Game.best > 0) {
        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 18px system-ui, sans-serif';
        ctx.fillText('REKOR: ' + Game.best, w / 2, h * 0.52 + 10);
      }

      drawButton(ctx, w, h, 'BAŞLA', time);

      const s = Sprites.player;
      ctx.drawImage(s, w / 2 - s.width / 2, h * 0.78 + Math.sin(time * 2) * 6);
    },

    drawGameOver(ctx, w, h, time) {
      ctx.fillStyle = 'rgba(5, 8, 20, 0.75)';
      ctx.fillRect(0, 0, w, h);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ff6b8a';
      ctx.font = 'bold 40px system-ui, sans-serif';
      ctx.fillText('OYUN BİTTİ', w / 2, h * 0.28);

      ctx.fillStyle = '#e8f6ff';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.fillText('SKOR: ' + Game.score, w / 2, h * 0.4);
      ctx.fillStyle = '#ffd166';
      ctx.font = 'bold 18px system-ui, sans-serif';
      const isRecord = Game.score > 0 && Game.score >= Game.best;
      ctx.fillText(isRecord ? 'YENİ REKOR!' : 'REKOR: ' + Game.best, w / 2, h * 0.4 + 36);

      drawButton(ctx, w, h, 'TEKRAR DENE', time);
    },
  };
})();
