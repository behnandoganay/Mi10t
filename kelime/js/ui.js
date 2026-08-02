// ui.js — Ekranlar ve gezinme. #app kabına içerik basar, olayları bağlar.

const UI = (() => {
  let root;
  const RING = 2 * Math.PI * 54; // SVG halka çevresi (r=54)

  const el = (sel) => root.querySelector(sel);
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }
  function screen(html) { root.innerHTML = html; window.scrollTo(0, 0); }

  // ===================== ANA MENÜ =====================
  function home() {
    Timer.stop();
    screen(`
      <div class="screen home">
        <h1 class="logo">🔤 Kelime<br><span>TÜRETMECE</span></h1>
        <p class="tagline">Klasik kelime zinciri: son harften yeni kelime türet.
          10 saniyede bulamayan kaybeder!</p>

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
        <p class="foot">Tamamen çevrimdışı · ~48 bin kelimelik Türkçe sözlük</p>
      </div>
    `);
    el('#start').onclick = () => {
      const n1 = el('#name1').value.trim() || 'Oyuncu 1';
      const n2 = el('#name2').value.trim() || 'Oyuncu 2';
      Game.newMatch([n1, n2]);
      game();
    };
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
      err.textContent = '';
      input.value = '';
      renderTurn();
      startTurnTimer();
      input.focus();
    };

    renderTurn();
    startTurnTimer();
    input.focus();
  }

  function renderTurn() {
    const s = Game.state;
    const cls = s.current === 0 ? 'p1' : 'p2';
    const turn = el('#turn');
    turn.className = `turn-banner ${cls}`;
    turn.textContent = `Sıra: ${s.players[s.current]}`;
    el('#ps1').classList.toggle('active', s.current === 0);
    el('#ps2').classList.toggle('active', s.current === 1);
    el('#ps1').innerHTML = `${esc(s.players[0])} <b>${s.scores[0]}</b>`;
    el('#ps2').innerHTML = `<b>${s.scores[1]}</b> ${esc(s.players[1])}`;

    const last = s.chain[s.chain.length - 1];
    if (!last) {
      el('#prev-label').textContent = 'İlk kelime';
      el('#prev-word').textContent = '—';
      el('#need').innerHTML = '<span class="badge free">İstediğin kelimeyle başla!</span>';
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
        Game.timeout();
        Sound.win();
        end();
      },
    });
  }

  // Sıradaki `required` harfini eldeki son kelimeden türetip mesaj kurar.
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
          <button class="btn primary big" id="again">🔁 Yeni El <em>(${esc(s.players[1 - s.winner])} başlar)</em></button>
          <button class="btn ghost" id="menu">Ana Menü</button>
        </div>
      </div>
    `);
    el('#again').onclick = () => { Game.newRound(); game(); };
    el('#menu').onclick = home;
  }

  function init(mount) {
    root = mount;
    home();
  }

  return { init };
})();
