// ui.js — Ekranlar ve gezinme. #app kabına içerik basar, olayları bağlar.
// İki mod: yerel (tek telefon, elden ele) ve online (iki telefon, WebRTC/PeerJS).

const UI = (() => {
  let root;
  const RING = 2 * Math.PI * 54; // SVG halka çevresi (r=54)

  // Online oturum: null → yerel mod.
  // { myIndex: 0|1, myName, oppName, rematchMine, rematchTheirs }
  let online = null;

  const el = (sel) => root.querySelector(sel);
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }
  function screen(html) { root.innerHTML = html; window.scrollTo(0, 0); }

  function backBar(title) {
    return `
      <div class="scorebar">
        <button class="round back" data-back>‹</button>
        <h2 class="bar-title">${esc(title)}</h2>
      </div>`;
  }
  function bindBack(fn) { el('[data-back]').onclick = fn; }

  function leaveOnline() {
    if (online) { Net.send({ type: 'bye' }); Net.destroy(); online = null; }
  }

  // ===================== ANA MENÜ =====================
  function home() {
    Timer.stop();
    leaveOnline();
    screen(`
      <div class="screen home">
        <h1 class="logo">🔤 Kelime<br><span>TÜRETMECE</span></h1>
        <p class="tagline">Klasik kelime zinciri: son harften yeni kelime türet.
          10 saniyede bulamayan kaybeder!</p>

        <div class="menu">
          <button class="btn primary big" id="mode-local">📱 Aynı Telefonda</button>
          <button class="btn big" id="mode-online">📶 İki Telefonla (Online)</button>
        </div>

        <div class="card prose">
          <p><b>Nasıl oynanır?</b></p>
          <ol>
            <li>1. oyuncu istediği bir kelimeyle başlar (ör. <b>araç</b>).</li>
            <li>Sıradaki, kelimenin <b>son harfiyle</b> başlayan yeni bir kelime
              yazar (araç → <b>ç</b>ay → <b>y</b>...).</li>
            <li>Her kelime bir kez kullanılır ve sözlükte olmalıdır.</li>
            <li>Kelime <b>ğ</b> ile biterse sıradaki istediği harfle başlar.</li>
            <li><b>10 saniyede</b> kelime bulamayan eli kaybeder.</li>
          </ol>
        </div>
        <p class="foot">Tamamen çevrimdışı oynanabilir (yerel mod) · ~48 bin kelimelik Türkçe sözlük</p>
      </div>
    `);
    el('#mode-local').onclick = localSetup;
    el('#mode-online').onclick = onlineMenu;
  }

  // ===================== YEREL MOD KURULUMU =====================
  function localSetup() {
    screen(`
      <div class="screen">
        ${backBar('Aynı Telefonda')}
        <div class="card">
          <label class="field">
            <span>1. Oyuncu</span>
            <input id="name1" type="text" maxlength="14" placeholder="Oyuncu 1" autocomplete="off">
          </label>
          <label class="field">
            <span>2. Oyuncu</span>
            <input id="name2" type="text" maxlength="14" placeholder="Oyuncu 2" autocomplete="off">
          </label>
          <button class="btn primary big" id="start">🎮 Başla</button>
        </div>
      </div>
    `);
    bindBack(home);
    el('#start').onclick = () => {
      const n1 = el('#name1').value.trim() || 'Oyuncu 1';
      const n2 = el('#name2').value.trim() || 'Oyuncu 2';
      online = null;
      Game.newMatch([n1, n2]);
      game();
    };
  }

  // ===================== ONLINE MENÜ =====================
  function onlineMenu() {
    screen(`
      <div class="screen">
        ${backBar('İki Telefonla (Online)')}
        <div class="card">
          <label class="field">
            <span>Adın</span>
            <input id="my-name" type="text" maxlength="14" placeholder="Adını yaz" autocomplete="off">
          </label>
          <button class="btn primary big" id="host">🏠 Oda Kur</button>
          <div class="join-row">
            <input id="join-code" type="text" maxlength="4" placeholder="KOD"
              autocapitalize="characters" autocomplete="off" spellcheck="false">
            <button class="btn" id="join">Odaya Katıl</button>
          </div>
          <p class="err" id="err"></p>
        </div>
        <div class="card prose">
          <p><b>Nasıl çalışır?</b> Bir telefon <b>oda kurar</b> ve 4 harflik kod alır;
            diğer telefon kodu girip <b>katılır</b>. Bağlantı telefondan telefona
            kurulur (internet gerekir). Bağlantı kurulamazsa iki telefonu aynı
            Wi-Fi'ye bağlayıp tekrar deneyin.</p>
        </div>
      </div>
    `);
    bindBack(home);
    if (!navigator.onLine) el('#err').textContent = 'İnternet bağlantısı yok — online mod için internet gerekli.';

    const myName = () => el('#my-name').value.trim() || 'Oyuncu';
    el('#host').onclick = () => hostRoom(myName());
    el('#join').onclick = () => {
      const code = el('#join-code').value.trim();
      if (code.length !== 4) { el('#err').textContent = '4 karakterlik oda kodunu gir.'; return; }
      joinRoom(myName(), code);
    };
  }

  // ===================== ODA KUR / KATIL =====================
  function hostRoom(myName) {
    online = { myIndex: 0, myName, oppName: null, rematchMine: false, rematchTheirs: false };
    screen(`
      <div class="screen">
        ${backBar('Oda Kuruldu')}
        <div class="card word-card">
          <div class="prev-label">Oda Kodu</div>
          <div class="room-code" id="code">····</div>
          <button class="btn" id="copy" hidden>📋 Kodu Kopyala</button>
          <div class="need" id="status">Sinyal sunucusuna bağlanılıyor…</div>
        </div>
        <div class="card prose">
          <p>Bu kodu rakibine söyle; o da <b>Odaya Katıl</b>'a kodu girsin.
            Bağlanınca oyun kendiliğinden başlar — <b>ilk kelimeyi sen yazacaksın</b>.</p>
        </div>
      </div>
    `);
    bindBack(() => { Net.destroy(); online = null; onlineMenu(); });

    Net.host({
      onReady(code) {
        el('#code').textContent = code;
        el('#status').textContent = 'Rakip bekleniyor…';
        const copy = el('#copy');
        copy.hidden = false;
        copy.onclick = () => navigator.clipboard && navigator.clipboard.writeText(code);
      },
      onConnect() {
        el('#status').textContent = 'Rakip bağlandı!';
        Net.send({ type: 'hello', name: online.myName });
      },
      onMessage: handleNet,
      onClose: handleDisconnect,
      onError(msg) { if (el('#status')) el('#status').textContent = msg; },
    });
  }

  function joinRoom(myName, code) {
    online = { myIndex: 1, myName, oppName: null, rematchMine: false, rematchTheirs: false };
    screen(`
      <div class="screen">
        ${backBar('Odaya Katılınıyor')}
        <div class="card word-card">
          <div class="prev-label">Oda Kodu</div>
          <div class="room-code">${esc(code.toUpperCase())}</div>
          <div class="need" id="status">Bağlanılıyor…</div>
        </div>
      </div>
    `);
    bindBack(() => { Net.destroy(); online = null; onlineMenu(); });

    Net.join(code, {
      onConnect() {
        el('#status').textContent = 'Bağlandı! Oyun başlıyor…';
        Net.send({ type: 'hello', name: online.myName });
      },
      onMessage: handleNet,
      onClose: handleDisconnect,
      onError(msg) { if (el('#status')) el('#status').textContent = msg; },
    });
  }

  // ===================== ONLINE MESAJ YÖNLENDİRME =====================
  function handleNet(msg) {
    if (!online || !msg || typeof msg !== 'object') return;
    switch (msg.type) {
      case 'hello': {
        online.oppName = String(msg.name || 'Rakip').slice(0, 14);
        // Kurucu: iki isim de belli olunca maçı kurar ve başlatır.
        if (online.myIndex === 0) {
          Game.newMatch([online.myName, online.oppName]);
          Net.send({ type: 'start' });
          game();
        }
        break;
      }
      case 'start': {
        // Katılan: kurucu 0. oyuncudur.
        Game.newMatch([online.oppName || 'Rakip', online.myName]);
        game();
        break;
      }
      case 'word': {
        const res = Game.submitWord(msg.word);
        if (!res.ok) { desync(); return; }
        Sound.ok();
        if (el('#word-input')) {
          el('#err').textContent = '';
          renderTurn();
          startTurnTimer();
          const input = el('#word-input');
          input.value = '';
          input.focus();
        }
        break;
      }
      case 'timeout': {
        // Rakip süresinin dolduğunu bildirdi (sırası ondaydı).
        if (Game.state && Game.state.phase === 'playing') {
          Timer.stop();
          Game.timeout();
          Sound.win();
          end();
        }
        break;
      }
      case 'rematch': {
        online.rematchTheirs = true;
        const note = el('#rematch-note');
        if (note) note.textContent = `${online.oppName} tekrar oynamak istiyor!`;
        maybeRematch();
        break;
      }
      case 'bye': {
        handleDisconnect();
        break;
      }
      default: break;
    }
  }

  function maybeRematch() {
    if (online && online.rematchMine && online.rematchTheirs) {
      online.rematchMine = false;
      online.rematchTheirs = false;
      Game.newRound();
      game();
    }
  }

  function desync() {
    Timer.stop();
    leaveOnline();
    screen(`
      <div class="screen">
        <div class="verdict p2" style="margin-top:32vh">⚠️ Oyun durumu eşitlenemedi</div>
        <p class="lose-detail">İki telefonun oyun sürümleri farklı olabilir.
          Sayfayı yenileyip tekrar deneyin.</p>
        <div class="menu"><button class="btn primary big" id="menu">Ana Menü</button></div>
      </div>
    `);
    el('#menu').onclick = home;
  }

  function handleDisconnect() {
    if (!online) return;
    Timer.stop();
    const opp = online.oppName || 'Rakip';
    Net.destroy();
    online = null;
    screen(`
      <div class="screen">
        <div class="verdict p2" style="margin-top:32vh">📡 Bağlantı koptu</div>
        <p class="lose-detail">${esc(opp)} ile bağlantı kesildi ya da rakip oyundan ayrıldı.</p>
        <div class="menu"><button class="btn primary big" id="menu">Ana Menü</button></div>
      </div>
    `);
    el('#menu').onclick = home;
  }

  // ===================== OYUN EKRANI =====================
  function game() {
    const s = Game.state;
    screen(`
      <div class="screen game">
        <div class="scorebar">
          <div class="pscore p1" id="ps1">${esc(s.players[0])} <b>${s.scores[0]}</b></div>
          <button class="round back" id="quit" title="Ana menü">✕</button>
          <div class="pscore p2" id="ps2"><b>${s.scores[1]}</b> ${esc(s.players[1])}</div>
        </div>

        <div class="turn-banner" id="turn"></div>

        <div class="card word-card">
          <div class="prev-label" id="prev-label"></div>
          <div class="prev-word" id="prev-word"></div>
          <div class="need" id="need"></div>
        </div>

        <div class="timer-wrap">
          <svg viewBox="0 0 120 120" class="timer-svg">
            <circle class="ring-bg" cx="60" cy="60" r="54"></circle>
            <circle class="ring" id="ring" cx="60" cy="60" r="54"
              stroke-dasharray="${RING}" stroke-dashoffset="0"></circle>
          </svg>
          <div class="timer-num" id="timer-num">${Game.TURN_SECONDS}</div>
        </div>

        <form id="word-form" autocomplete="off">
          <input id="word-input" type="text" inputmode="text" enterkeyhint="send"
            autocapitalize="none" autocomplete="off" autocorrect="off"
            spellcheck="false" maxlength="30" placeholder="Kelimeni yaz...">
          <button type="submit" class="btn primary" id="send">Gönder</button>
        </form>
        <p class="err" id="err"></p>

        <div class="chain-strip" id="chain"></div>
      </div>
    `);

    const input = el('#word-input');
    const err = el('#err');

    el('#quit').onclick = () => { Timer.stop(); home(); };

    el('#word-form').onsubmit = (e) => {
      e.preventDefault();
      if (online && Game.state.current !== online.myIndex) return;
      const res = Game.submitWord(input.value);
      if (!res.ok) {
        Sound.bad();
        err.textContent = res.msg;
        input.classList.remove('shake');
        void input.offsetWidth; // animasyonu yeniden tetikle
        input.classList.add('shake');
        input.select();
        return;
      }
      Sound.ok();
      if (online) Net.send({ type: 'word', word: res.word });
      err.textContent = '';
      input.value = '';
      renderTurn();
      startTurnTimer();
      if (!online) input.focus();
    };

    renderTurn();
    startTurnTimer();
    if (!online || Game.state.current === online.myIndex) input.focus();
  }

  function renderTurn() {
    const s = Game.state;
    const cls = s.current === 0 ? 'p1' : 'p2';
    const myTurn = !online || s.current === online.myIndex;
    const turn = el('#turn');
    turn.className = `turn-banner ${cls}`;
    turn.textContent = online
      ? (myTurn ? 'Sıra sende!' : `Sıra rakipte: ${s.players[s.current]}`)
      : `Sıra: ${s.players[s.current]}`;
    el('#ps1').classList.toggle('active', s.current === 0);
    el('#ps2').classList.toggle('active', s.current === 1);
    el('#ps1').innerHTML = `${esc(s.players[0])} <b>${s.scores[0]}</b>`;
    el('#ps2').innerHTML = `<b>${s.scores[1]}</b> ${esc(s.players[1])}`;

    const input = el('#word-input');
    const send = el('#send');
    input.disabled = !myTurn;
    send.disabled = !myTurn;
    input.placeholder = myTurn ? 'Kelimeni yaz...' : 'Rakibin kelimesi bekleniyor…';

    const last = s.chain[s.chain.length - 1];
    if (!last) {
      el('#prev-label').textContent = 'İlk kelime';
      el('#prev-word').textContent = '—';
      el('#need').innerHTML = myTurn
        ? '<span class="badge free">İstediğin kelimeyle başla!</span>'
        : '<span class="badge free">Rakip ilk kelimeyi yazıyor…</span>';
    } else {
      el('#prev-label').textContent = 'Son kelime';
      const w = Game.upper(last.word);
      el('#prev-word').innerHTML =
        `${esc(w.slice(0, -1))}<span class="hot">${esc(w.slice(-1))}</span>`;
      el('#need').innerHTML = s.required === null
        ? '<span class="badge free">Ğ ile kelime başlamaz — istediğin harfle başla!</span>'
        : `<span class="need-letter ${s.current === 0 ? 'p1' : 'p2'}">${esc(Game.upper(s.required))}</span> ile başlayan bir kelime`;
    }

    el('#chain').innerHTML = s.chain
      .slice(-12)
      .map((c) => `<span class="chip-word ${c.player === 0 ? 'p1' : 'p2'}">${esc(c.word)}</span>`)
      .reverse()
      .join('');
  }

  function startTurnTimer() {
    const ring = el('#ring');
    const num = el('#timer-num');
    Timer.start(Game.TURN_SECONDS, {
      onTick(remain, frac) {
        num.textContent = Math.ceil(remain);
        ring.style.strokeDashoffset = String(RING * (1 - frac));
        const danger = remain <= 3;
        ring.classList.toggle('danger', danger);
        num.classList.toggle('danger', danger);
      },
      onWarn() { Sound.tick(); },
      onExpire() {
        // Online modda bağlayıcı karar sırası gelen tarafındır: rakibin süresi
        // bizim saatimize göre dolduysa onun 'timeout' (veya son anda 'word')
        // mesajını bekleriz — ağ gecikmesi haksız yenilgi üretmesin.
        if (online && Game.state.current !== online.myIndex) {
          num.textContent = '0';
          return;
        }
        if (online) Net.send({ type: 'timeout' });
        Game.timeout();
        Sound.win();
        end();
      },
    });
  }

  function loseDetail() {
    const s = Game.state;
    const loser = esc(s.players[1 - s.winner]);
    if (s.chain.length === 0) return `${loser} 10 saniyede hiç kelime yazamadı.`;
    if (s.required === null) return `${loser} 10 saniyede kelime bulamadı (harf serbestti!).`;
    return `${loser} 10 saniyede "${Game.upper(s.required)}" ile başlayan kelime bulamadı.`;
  }

  // ===================== EL SONU =====================
  function end() {
    const s = Game.state;
    const winCls = s.winner === 0 ? 'p1' : 'p2';
    if (online) { online.rematchMine = false; }
    screen(`
      <div class="screen">
        <div class="verdict ${winCls}">🏆 ${esc(s.players[s.winner])} kazandı!</div>
        <p class="lose-detail">${loseDetail()}</p>

        <div class="card score-card">
          <div class="result-row">
            <span class="pname p1">${esc(s.players[0])}</span><b>${s.scores[0]}</b>
          </div>
          <div class="result-row">
            <span class="pname p2">${esc(s.players[1])}</span><b>${s.scores[1]}</b>
          </div>
        </div>

        ${s.chain.length ? `
        <div class="card">
          <div class="prev-label">Bu elin zinciri · ${s.chain.length} kelime</div>
          <ol class="chain-list">
            ${s.chain.map((c) => `
              <li class="${c.player === 0 ? 'p1' : 'p2'}">
                <span class="who">${esc(s.players[c.player])}</span>${esc(c.word)}
              </li>`).join('')}
          </ol>
        </div>` : ''}

        <div class="menu">
          <button class="btn primary big" id="again">🔁 ${online ? 'Tekrar Oyna' : `Yeni El <em>(${esc(s.players[1 - s.winner])} başlar)</em>`}</button>
          <p class="err" id="rematch-note">${online && online.rematchTheirs ? esc(online.oppName) + ' tekrar oynamak istiyor!' : ''}</p>
          <button class="btn ghost" id="menu">Ana Menü</button>
        </div>
      </div>
    `);
    el('#again').onclick = () => {
      if (online) {
        online.rematchMine = true;
        Net.send({ type: 'rematch' });
        el('#again').disabled = true;
        el('#again').textContent = '⏳ Rakip bekleniyor…';
        maybeRematch();
      } else {
        Game.newRound();
        game();
      }
    };
    el('#menu').onclick = home;
  }

  function init(mount) {
    root = mount;
    home();
  }

  return { init };
})();
