// game.js — Oyun mantığı ve durumu. Ekranlardan (ui.js) bağımsızdır.

const Game = (() => {
  let state = null;

  function rand(n) { return Math.floor(Math.random() * n); }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Yeni tur başlat. cfg: { players, imposters, imposterSeesCategory, categories:[cat...] }
  // Döner: { ok:true } ya da { ok:false, error:'...' }
  function start(cfg) {
    const { players, imposters, imposterSeesCategory } = cfg;
    const cats = (cfg.categories || []).filter((c) => c.words && c.words.length > 0);

    if (players < 3) return { ok: false, error: 'En az 3 oyuncu gerekli.' };
    if (imposters < 1) return { ok: false, error: 'En az 1 imposter olmalı.' };
    if (imposters >= players) return { ok: false, error: 'İmposter sayısı oyuncudan az olmalı.' };
    if (cats.length === 0) return { ok: false, error: 'İçinde kelime olan en az bir kategori seç.' };

    // Kategori ve kelime seç.
    const category = cats[rand(cats.length)];
    const word = category.words[rand(category.words.length)];

    // İmposter olacak oyuncuları seç.
    const order = shuffle(
      Array.from({ length: players }, (_, i) => i)
    );
    const imposterSet = new Set(order.slice(0, imposters));

    state = {
      players,
      imposters,
      imposterSeesCategory,
      category,
      word,
      imposterSet,
      revealIndex: 0,     // sırada rolünü görecek oyuncu
      votedOut: null,     // oylamada elenen oyuncu (index) ya da null
    };
    return { ok: true };
  }

  function get() { return state; }

  function isImposter(playerIndex) {
    return state && state.imposterSet.has(playerIndex);
  }

  // Bir oyuncunun rol kartı bilgisi.
  function roleFor(playerIndex) {
    if (!state) return null;
    const imposter = isImposter(playerIndex);
    return {
      playerIndex,
      imposter,
      category: state.category.name,
      // İmposter kelimeyi görmez; ayara göre kategoriyi görebilir.
      word: imposter ? null : state.word,
      showCategory: imposter ? state.imposterSeesCategory : true,
    };
  }

  function advanceReveal() {
    if (!state) return;
    state.revealIndex++;
  }
  function revealDone() {
    return state && state.revealIndex >= state.players;
  }

  // Oylama sonucu: grup birini eledi. index verilir.
  function setVote(playerIndex) {
    if (state) state.votedOut = playerIndex;
  }

  // Sonuç bilgisi.
  function result() {
    if (!state) return null;
    const imposters = Array.from(state.imposterSet).sort((a, b) => a - b);
    const caughtImposter = state.votedOut != null && state.imposterSet.has(state.votedOut);
    return {
      imposters,
      word: state.word,
      category: state.category.name,
      votedOut: state.votedOut,
      caughtImposter,
      // Tek imposterlı klasik kural: doğru kişiyi elediyseniz ekip kazanır.
      crewWins: caughtImposter,
    };
  }

  return {
    start, get, isImposter, roleFor,
    advanceReveal, revealDone, setVote, result,
  };
})();
