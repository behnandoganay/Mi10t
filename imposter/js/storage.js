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
    // Dizi ya da satır/virgülle ayrılmış metin kabul et.
    let arr = Array.isArray(words)
      ? words
      : String(words).split(/[\n,;]+/);
    return arr.map((w) => w.trim()).filter((w) => w.length > 0);
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
      imposterGetsHint: true, // imposter aynı temadan bir ipucu kelimesi görsün mü
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
  };
})();
