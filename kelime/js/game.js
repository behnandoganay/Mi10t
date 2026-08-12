// game.js — Saf oyun mantığı: doğrulama, sıra, ğ kuralı, skor. DOM'a dokunmaz.

const Game = (() => {
  const DEFAULT_TURN_SECONDS = 10;
  const VALID = /^[abcçdefgğhıijklmnoöprsştuüvyz]+$/;

  // Kullanıcı şapkalı yazarsa sözlükteki şapkasız halle eşleşsin (kâğıt → kağıt).
  function normalize(raw) {
    return String(raw || '')
      .trim()
      .toLocaleLowerCase('tr')
      .replace(/[âîûô]/g, (c) => ({ 'â': 'a', 'î': 'i', 'û': 'u', 'ô': 'o' }[c]));
  }

  function upper(s) {
    return String(s).toLocaleUpperCase('tr');
  }

  let state = null;

  // turnSeconds: saniye cinsinden tur süresi; null → süresiz (tur sadece pes ile biter).
  function newMatch(names, turnSeconds) {
    state = {
      players: names,
      turnSeconds: turnSeconds === null ? null : (Number(turnSeconds) || DEFAULT_TURN_SECONDS),
      scores: [0, 0],
      round: 0,
      current: 0,
      chain: [],      // { word, player }
      used: new Set(),
      required: null, // null → serbest harf (el başı veya ğ sonrası)
      freeBecauseGh: false,
      phase: 'playing',
      winner: null,
      loseReason: null, // 'timeout' | 'giveup'
    };
    newRound();
    return state;
  }

  function newRound() {
    // İlk eli 1. oyuncu, sonraki elleri bir önceki elin kaybedeni başlatır.
    const starter = state.winner === null ? 0 : 1 - state.winner;
    state.round += 1;
    state.current = starter;
    state.chain = [];
    state.used = new Set();
    state.required = null;
    state.freeBecauseGh = false;
    state.phase = 'playing';
    state.winner = null;
    state.loseReason = null;
    return state;
  }

  function submitWord(raw) {
    const w = normalize(raw);
    if (w.length < 2) {
      return { ok: false, reason: 'short', msg: 'En az 2 harfli bir kelime yaz' };
    }
    if (!VALID.test(w)) {
      return { ok: false, reason: 'chars', msg: 'Sadece Türkçe harfler kullan' };
    }
    if (state.required && w[0] !== state.required) {
      return { ok: false, reason: 'letter', msg: `Kelime "${upper(state.required)}" ile başlamalı` };
    }
    if (state.used.has(w)) {
      return { ok: false, reason: 'used', msg: 'Bu kelime bu elde zaten kullanıldı' };
    }
    if (!WORDS.has(w)) {
      return { ok: false, reason: 'dict', msg: 'Sözlükte böyle bir kelime yok' };
    }

    state.used.add(w);
    state.chain.push({ word: w, player: state.current });
    const last = w[w.length - 1];
    state.freeBecauseGh = last === 'ğ'; // ğ ile kelime başlamaz → rakip serbest
    state.required = state.freeBecauseGh ? null : last;
    state.current = 1 - state.current;
    return { ok: true, word: w };
  }

  // Sırası gelen eli kaybeder (süre doldu ya da pes etti).
  function endRound(reason) {
    state.phase = 'over';
    state.loseReason = reason;
    state.winner = 1 - state.current;
    state.scores[state.winner] += 1;
    return state;
  }

  const timeout = () => endRound('timeout');
  const giveUp = () => endRound('giveup');

  return {
    DEFAULT_TURN_SECONDS,
    normalize,
    upper,
    newMatch,
    newRound,
    submitWord,
    timeout,
    giveUp,
    get state() { return state; },
  };
})();
