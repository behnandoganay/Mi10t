// storage.js — Kalıcı veri (localStorage). Kendi kategorilerin ve ayarların
// tarayıcıda/telefonda saklanır; uygulamayı kapatıp açsan da kaybolmaz.

const Storage = (() => {
  const K_CUSTOM = 'imposter_custom_categories'; // [{id, name, words:[]}]
  const K_HIDDEN = 'imposter_hidden_builtins';   // [id, ...] kapatılan hazır kategoriler
  const K_SETTINGS = 'imposter_settings';        // { players, imposters, imposterGetsHint, selected:[ids] }

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* dolu/engelli */ }
  }

  // --- Kendi kategoriler ---
  function getCustom() { return read(K_CUSTOM, []); }
  function saveCustom(list) { write(K_CUSTOM, list); }

  function addCategory(name, words) {
    const list = getCustom();
    const cat = { id: 'c_' + Date.now(), name: name.trim(), words: cleanWords(words) };
    list.push(cat);
    saveCustom(list);
    return cat;
  }
  function updateCategory(id, name, words) {
    const list = getCustom();
    const cat = list.find((c) => c.id === id);
    if (!cat) return null;
    cat.name = name.trim();
    cat.words = cleanWords(words);
    saveCustom(list);
    return cat;
  }
  function deleteCategory(id) {
    saveCustom(getCustom().filter((c) => c.id !== id));
  }

  function cleanWords(words) {
    // Girdi ya bir dizi (['Kelime','ipucu'] çiftleri/düz metinler) ya da metin
    // olabilir. Metinde her satır bir kelime; istenirse "Kelime | ipucu" (veya
    // "Kelime = ipucu") biçiminde ipucu eklenebilir. İpucu içermeyen satırlar
    // virgülle çoklu kelime de içerebilir.
    const lines = Array.isArray(words) ? words : String(words).split(/\n/);
    const out = [];
    for (const raw of lines) {
      if (Array.isArray(raw)) {
        const w = String(raw[0] || '').trim();
        if (!w) continue;
        const h = raw[1] ? String(raw[1]).trim() : '';
        out.push(h ? [w, h] : w);
        continue;
      }
      const line = String(raw);
      if (/[|=]/.test(line)) {
        const idx = line.search(/[|=]/);
        const w = line.slice(0, idx).trim();
        const h = line.slice(idx + 1).trim();
        if (w) out.push(h ? [w, h] : w);
      } else {
        line.split(/[,;]+/).forEach((p) => {
          const t = p.trim();
          if (t) out.push(t);
        });
      }
    }
    return out;
  }

  // "Kelime | ipucu" satırlarına geri çevir (düzenleme ekranı için).
  function wordsToText(list) {
    return (list || [])
      .map((e) => (Array.isArray(e) ? (e[1] ? `${e[0]} | ${e[1]}` : e[0]) : e))
      .join('\n');
  }

  // --- Hazır kategorileri açma/kapama ---
  function getHidden() { return read(K_HIDDEN, []); }
  function isBuiltinHidden(id) { return getHidden().includes(id); }
  function setBuiltinHidden(id, hidden) {
    let list = getHidden();
    if (hidden) { if (!list.includes(id)) list.push(id); }
    else { list = list.filter((x) => x !== id); }
    write(K_HIDDEN, list);
  }

  // --- Tüm kategoriler (hazır + kendi), kapatılanlar hariç ---
  function allCategories() {
    const hidden = getHidden();
    const builtin = BUILTIN_CATEGORIES
      .filter((c) => !hidden.includes(c.id))
      .map((c) => ({ ...c, builtin: true }));
    const custom = getCustom().map((c) => ({ ...c, builtin: false }));
    return [...builtin, ...custom];
  }

  // Yönetim ekranı için: kapatılanlar dahil hepsi.
  function allCategoriesIncludingHidden() {
    const builtin = BUILTIN_CATEGORIES.map((c) => ({ ...c, builtin: true }));
    const custom = getCustom().map((c) => ({ ...c, builtin: false }));
    return [...builtin, ...custom];
  }

  function findCategory(id) {
    return allCategoriesIncludingHidden().find((c) => c.id === id) || null;
  }

  // --- Ayarlar ---
  function getSettings() {
    return read(K_SETTINGS, {
      players: 4,
      imposters: 1,
      imposterGetsHint: true, // imposter kelimeyi çağrıştıran tek kelimelik ipucu görsün mü
      names: [],      // oyuncu isimleri (boşlar "Oyuncu N" olur)
      selected: null, // null => tüm açık kategoriler
    });
  }
  function saveSettings(s) { write(K_SETTINGS, s); }

  return {
    allCategories,
    allCategoriesIncludingHidden,
    findCategory,
    getCustom,
    addCategory,
    updateCategory,
    deleteCategory,
    isBuiltinHidden,
    setBuiltinHidden,
    getSettings,
    saveSettings,
    cleanWords,
    wordsToText,
  };
})();
