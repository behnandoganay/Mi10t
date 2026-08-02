// main.js — Uygulamayı başlatır.
document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('app');
  // Mobil tarayıcıların ses kilidini ilk dokunuşta aç.
  const unlock = () => { Sound.unlock(); document.removeEventListener('pointerdown', unlock); };
  document.addEventListener('pointerdown', unlock);
  UI.init(mount);
});
