// main.js — Uygulamayı başlatır.
document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('app');
  // Mobil tarayıcıların ses kilidini ilk dokunuşta aç.
  const unlock = () => { Sound.unlock(); document.removeEventListener('pointerdown', unlock); };
  document.addEventListener('pointerdown', unlock);
  // Çevrimdışı oyun: service worker tüm dosyaları önbelleğe alır.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* file:// gibi ortamlarda sessizce geç */ });
  }
  UI.init(mount);
});
