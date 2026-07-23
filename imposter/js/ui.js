// ui.js — Ekranlar ve gezinme. #app kabına içerik basar, olayları bağlar.

const UI = (() => {
  let root;

  // Küçük yardımcılar
  const el = (sel) => root.querySelector(sel);
  const els = (sel) => Array.from(root.querySelectorAll(sel));
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }
  function screen(html) { root.innerHTML = html; window.scrollTo(0, 0); }

  // ===================== ANA MENÜ =====================
  function home() {
    screen(`
      <div class="screen home">
        <h1 class="logo">🕵️ Aramızdaki<br><span>İMPOSTER</span></h1>
        <p class="tagline">Tek telefon, elden ele. Herkes kelimeyi bilir —
          biri hariç. Hain kim?</p>
        <div class="menu">
          <button class="btn primary big" data-go="setup">🎮 Oyna</button>
          <button class="btn" data-go="categories">📚 Kategoriler</button>
          <button class="btn" data-go="howto">❓ Nasıl Oynanır</button>
        </div>
        <p class="foot">Tüm kategoriler ücretsiz &amp; sınırsız · kendi kategorini ekle</p>
      </div>
    `);
    el('[data-go="setup"]').onclick = setup;
    el('[data-go="categories"]').onclick = categories;
    el('[data-go="howto"]').onclick = howto;
  }

  // ===================== NASIL OYNANIR =====================
  function howto() {
    screen(`
      <div class="screen">
        ${backBar('Nasıl Oynanır')}
        <div class="card prose">
          <p><b>Amaç:</b> Grup arasına gizlenmiş <b>imposter</b>(ler)i bulmak.
            İmposter ise yakalanmadan kelimeyi tahmin etmeye çalışır.</p>
          <ol>
            <li>Oyuncu ve imposter sayısını seç, kategorileri belirle.</li>
            <li>Telefon sırayla herkese verilir. Herkes kendi kartına bakar:
              çoğu oyuncu <b>gizli kelimeyi</b> görür; imposter ise
              <b>"SEN İMPOSTER'SİN"</b> yazısını görür (kurulumda açtıysanız
              imposter'a <b>aynı temadan bir ipucu kelimesi</b> de gösterilir).</li>
            <li>Sırayla herkes kelimeyle ilgili <b>tek kelimelik bir ipucu</b> söyler.
              İmposter yakalanmamak için blöf yapar.</li>
            <li>Tartışın ve oylayın. Sonra şüphelendiğiniz kişiyi seçin.</li>
            <li>Uygulama imposteri açıklar. Doğru kişiyi elediyseniz <b>ekip kazanır</b>.</li>
          </ol>
          <p class="hint">İpucu: İmposter'ın kelimeyi tahmin etmesini zorlaştırmak için
            çok belirgin ipuçları vermeyin!</p>
        </div>
      </div>
    `);
    bindBack(home);
  }

  // ===================== OYUN KURULUMU =====================
  function setup() {
    const s = Storage.getSettings();
    const cats = Storage.allCategories();
    // Seçili kategoriler: kayıtlı seçim geçerliyse onu, yoksa hepsini kullan.
    const validIds = new Set(cats.map((c) => c.id));
    let selected = Array.isArray(s.selected)
      ? s.selected.filter((id) => validIds.has(id))
      : cats.map((c) => c.id);
    if (selected.length === 0) selected = cats.map((c) => c.id);

    screen(`
      <div class="screen">
        ${backBar('Oyun Kurulumu')}

        <div class="card">
          <div class="stepper">
            <span class="lbl">Oyuncu sayısı</span>
            <div class="stepper-ctrl">
              <button class="round" data-dec="players">−</button>
              <span class="num" id="players">${s.players}</span>
              <button class="round" data-inc="players">+</button>
            </div>
          </div>
          <div class="stepper">
            <span class="lbl">İmposter sayısı</span>
            <div class="stepper-ctrl">
              <button class="round" data-dec="imposters">−</button>
              <span class="num" id="imposters">${s.imposters}</span>
              <button class="round" data-inc="imposters">+</button>
            </div>
          </div>
          <label class="toggle">
            <input type="checkbox" id="impHint" ${s.imposterGetsHint ? 'checked' : ''}>
            <span>İmpostere ipucu ver <em>(aynı temadan bir kelime)</em></span>
          </label>
        </div>

        <div class="card">
          <div class="row-between">
            <b>Kategoriler</b>
            <span class="mini-actions">
              <button class="link" id="selAll">Tümü</button>
              <button class="link" id="selNone">Hiçbiri</button>
            </span>
          </div>
          <div class="cat-picker" id="catPicker">
            ${cats.map((c) => `
              <label class="chip">
                <input type="checkbox" value="${c.id}" ${selected.includes(c.id) ? 'checked' : ''}>
                <span>${esc(c.name)} <em>${c.words.length}</em></span>
              </label>
            `).join('')}
          </div>
          ${cats.length === 0 ? '<p class="hint">Hiç kategori yok. "Kategoriler"den ekle.</p>' : ''}
        </div>

        <p class="err" id="err"></p>
        <button class="btn primary big" id="startBtn">🚀 Başlat</button>
      </div>
    `);
    bindBack(home);

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const step = (key, delta) => {
      const node = el('#' + key);
      let v = parseInt(node.textContent, 10) + delta;
      if (key === 'players') v = clamp(v, 3, 20);
      if (key === 'imposters') v = clamp(v, 1, 9);
      node.textContent = v;
    };
    els('[data-inc]').forEach((b) => (b.onclick = () => step(b.dataset.inc, 1)));
    els('[data-dec]').forEach((b) => (b.onclick = () => step(b.dataset.dec, -1)));

    el('#selAll').onclick = () => els('#catPicker input').forEach((i) => (i.checked = true));
    el('#selNone').onclick = () => els('#catPicker input').forEach((i) => (i.checked = false));

    el('#startBtn').onclick = () => {
      const players = parseInt(el('#players').textContent, 10);
      const imposters = parseInt(el('#imposters').textContent, 10);
      const imposterGetsHint = el('#impHint').checked;
      const selIds = els('#catPicker input:checked').map((i) => i.value);
      const chosen = cats.filter((c) => selIds.includes(c.id));

      // Ayarları kaydet (bir dahaki sefere hatırlanır).
      Storage.saveSettings({ players, imposters, imposterGetsHint, selected: selIds });

      const res = Game.start({ players, imposters, imposterGetsHint, categories: chosen });
      if (!res.ok) { el('#err').textContent = res.error; return; }
      reveal();
    };
  }

  // ===================== ROL DAĞITIMI (elden ele) =====================
  function reveal() {
    const g = Game.get();
    const idx = g.revealIndex;

    // "Telefonu N. oyuncuya ver" ara ekranı.
    screen(`
      <div class="screen center">
        <div class="pass">
          <div class="pass-icon">📲</div>
          <h2>Telefonu ver:</h2>
          <div class="pass-player">Oyuncu ${idx + 1}</div>
          <p class="hint">Kimse bakmasın! Hazır olunca kartını aç.</p>
          <button class="btn primary big" id="showCard">Kartımı Gör</button>
        </div>
      </div>
    `);
    el('#showCard').onclick = () => showCard(idx);
  }

  function showCard(idx) {
    const r = Game.roleFor(idx);
    const isImp = r.imposter;
    const body = isImp
      ? `
        <div class="role-tag imposter">SEN İMPOSTER'SİN 🤫</div>
        <p class="role-sub">Kelimeyi bilmiyorsun. Belli etmeden idare et!</p>
        ${r.hint ? `
          <div class="role-hint">💡 İpucu: <b>${esc(r.hint)}</b></div>
          <p class="role-hint-note">Gizli kelime bu değil — sadece aynı temadan bir örnek.</p>
        ` : ''}
      `
      : `
        <div class="role-tag crew">Kelime</div>
        <div class="role-word">${esc(r.word)}</div>
        <p class="role-sub">Kategori: ${esc(r.category)}</p>
      `;

    screen(`
      <div class="screen center">
        <div class="card role-card ${isImp ? 'imp' : 'crew'}">
          <div class="role-who">Oyuncu ${idx + 1}</div>
          ${body}
        </div>
        <button class="btn primary big" id="hideCard">Gizle &amp; Sıradaki ▶</button>
      </div>
    `);
    el('#hideCard').onclick = () => {
      Game.advanceReveal();
      if (Game.revealDone()) discuss();
      else reveal();
    };
  }

  // ===================== TARTIŞMA =====================
  function discuss() {
    const g = Game.get();
    screen(`
      <div class="screen center">
        <div class="card">
          <h2>🗣️ Tartışma Zamanı</h2>
          <p>Sırayla herkes kelimeyle ilgili <b>tek kelimelik ipucu</b> versin.
            İmposter'ı bulmaya çalışın!</p>
          <div class="timer" id="timer">01:00</div>
          <div class="row">
            <button class="btn" id="timerToggle">▶ Süreyi Başlat</button>
            <button class="btn" id="timerReset">↺</button>
          </div>
        </div>
        <button class="btn primary big" id="toVote">🗳️ Oylamaya Geç</button>
      </div>
    `);

    let remaining = 60, running = false, handle = null;
    const disp = el('#timer');
    const fmt = (t) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
    const render = () => (disp.textContent = fmt(remaining));
    const tick = () => {
      remaining--;
      render();
      if (remaining <= 0) { stop(); disp.classList.add('done'); }
    };
    const stop = () => { running = false; clearInterval(handle); el('#timerToggle').textContent = '▶ Devam'; };
    el('#timerToggle').onclick = () => {
      if (running) { stop(); return; }
      running = true; el('#timerToggle').textContent = '⏸ Duraklat';
      handle = setInterval(tick, 1000);
    };
    el('#timerReset').onclick = () => { stop(); remaining = 60; disp.classList.remove('done'); render(); };
    el('#toVote').onclick = () => { clearInterval(handle); vote(); };
  }

  // ===================== OYLAMA =====================
  function vote() {
    const g = Game.get();
    screen(`
      <div class="screen">
        ${backBar('Oylama')}
        <div class="card">
          <p>Tartışıp oyladıktan sonra, grubun <b>en çok şüphelendiği</b> oyuncuya
            dokunun:</p>
        </div>
        <div class="vote-grid">
          ${Array.from({ length: g.players }, (_, i) => `
            <button class="vote-btn" data-p="${i}">Oyuncu ${i + 1}</button>
          `).join('')}
        </div>
        <button class="btn ghost" id="skipVote">Kimse — Direkt Açıkla</button>
      </div>
    `);
    bindBack(() => discuss());
    els('.vote-btn').forEach((b) => (b.onclick = () => {
      Game.setVote(parseInt(b.dataset.p, 10));
      result();
    }));
    el('#skipVote').onclick = () => { Game.setVote(null); result(); };
  }

  // ===================== SONUÇ =====================
  function result() {
    const r = Game.result();
    const impNames = r.imposters.map((i) => `Oyuncu ${i + 1}`).join(', ');
    let banner;
    if (r.votedOut == null) {
      banner = `<div class="verdict neutral">İmposter açıklanıyor…</div>`;
    } else if (r.crewWins) {
      banner = `<div class="verdict win">✅ Ekip Kazandı! Doğru kişiyi elediniz.</div>`;
    } else {
      banner = `<div class="verdict lose">😈 İmposter Kaçtı! Yanlış kişiyi elediniz.</div>`;
    }

    screen(`
      <div class="screen center">
        ${banner}
        <div class="card result-card">
          <div class="result-row"><span>Gizli kelime</span><b>${esc(r.word)}</b></div>
          <div class="result-row"><span>Kategori</span><b>${esc(r.category)}</b></div>
          <div class="result-row"><span>İmposter${r.imposters.length > 1 ? 'lar' : ''}</span>
            <b class="imp-name">${esc(impNames)}</b></div>
          ${r.votedOut != null ? `<div class="result-row"><span>Elenen</span><b>Oyuncu ${r.votedOut + 1}</b></div>` : ''}
        </div>
        <button class="btn primary big" id="again">🔄 Tekrar Oyna</button>
        <button class="btn" id="toHome">🏠 Ana Menü</button>
      </div>
    `);
    el('#again').onclick = () => {
      // Aynı ayarlarla yeni tur.
      const s = Storage.getSettings();
      const all = Storage.allCategories();
      const validIds = new Set(all.map((c) => c.id));
      const selIds = Array.isArray(s.selected) ? s.selected.filter((id) => validIds.has(id)) : null;
      const chosen = selIds && selIds.length ? all.filter((c) => selIds.includes(c.id)) : all;
      const res = Game.start({
        players: s.players, imposters: s.imposters,
        imposterGetsHint: s.imposterGetsHint, categories: chosen,
      });
      if (res.ok) reveal(); else setup();
    };
    el('#toHome').onclick = home;
  }

  // ===================== KATEGORİ YÖNETİMİ =====================
  function categories() {
    const all = Storage.allCategoriesIncludingHidden();
    screen(`
      <div class="screen">
        ${backBar('Kategoriler')}
        <button class="btn primary" id="addCat">➕ Yeni Kategori</button>
        <div class="cat-list">
          ${all.map((c) => {
            const hidden = c.builtin && Storage.isBuiltinHidden(c.id);
            return `
              <div class="cat-item ${hidden ? 'off' : ''}">
                <div class="cat-info">
                  <div class="cat-name">${esc(c.name)}</div>
                  <div class="cat-meta">${c.words.length} kelime ·
                    ${c.builtin ? 'hazır' : '<span class="own">senin</span>'}</div>
                </div>
                <div class="cat-buttons">
                  ${c.builtin
                    ? `<button class="round toggle-on ${hidden ? '' : 'active'}"
                         data-toggle="${c.id}">${hidden ? 'Aç' : 'Kapat'}</button>`
                    : `<button class="round" data-edit="${c.id}">✏️</button>
                       <button class="round danger" data-del="${c.id}">🗑️</button>`}
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>
    `);
    bindBack(home);
    el('#addCat').onclick = () => editCategory(null);
    els('[data-toggle]').forEach((b) => (b.onclick = () => {
      const id = b.dataset.toggle;
      Storage.setBuiltinHidden(id, !Storage.isBuiltinHidden(id));
      categories();
    }));
    els('[data-edit]').forEach((b) => (b.onclick = () => editCategory(b.dataset.edit)));
    els('[data-del]').forEach((b) => (b.onclick = () => {
      if (confirm('Bu kategoriyi silmek istediğine emin misin?')) {
        Storage.deleteCategory(b.dataset.del);
        categories();
      }
    }));
  }

  function editCategory(id) {
    const cat = id ? Storage.findCategory(id) : null;
    const name = cat ? cat.name : '';
    const words = cat ? cat.words.join('\n') : '';
    screen(`
      <div class="screen">
        ${backBar(id ? 'Kategoriyi Düzenle' : 'Yeni Kategori')}
        <div class="card">
          <label class="field">
            <span>Kategori adı</span>
            <input type="text" id="catName" placeholder="Örn: 🎵 Şarkıcılar" value="${esc(name)}">
          </label>
          <label class="field">
            <span>Kelimeler <em>(her satıra bir tane, ya da virgülle ayır)</em></span>
            <textarea id="catWords" rows="10" placeholder="Tarkan&#10;Sezen Aksu&#10;Barış Manço">${esc(words)}</textarea>
          </label>
          <p class="err" id="err"></p>
          <button class="btn primary big" id="saveCat">💾 Kaydet</button>
        </div>
      </div>
    `);
    bindBack(categories);
    el('#saveCat').onclick = () => {
      const nm = el('#catName').value.trim();
      const wd = el('#catWords').value;
      const wordCount = wd.split(/[\n,;]+/).map((w) => w.trim()).filter(Boolean).length;
      if (!nm) { el('#err').textContent = 'Kategori adı gir.'; return; }
      if (wordCount < 2) { el('#err').textContent = 'En az 2 kelime gir.'; return; }
      if (id) Storage.updateCategory(id, nm, wd);
      else Storage.addCategory(nm, wd);
      categories();
    };
  }

  // ===================== ortak parçalar =====================
  function backBar(title) {
    return `
      <div class="topbar">
        <button class="round back" id="backBtn">‹</button>
        <h2 class="topbar-title">${esc(title)}</h2>
      </div>`;
  }
  function bindBack(fn) {
    const b = el('#backBtn');
    if (b) b.onclick = fn;
  }

  function init(mount) { root = mount; home(); }
  return { init };
})();
