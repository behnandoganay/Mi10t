// net.js — PeerJS sarmalayıcı: oda kur / odaya katıl, JSON mesajlaşma, kopma yönetimi.
// Üretimde PeerJS'in ücretsiz genel sinyal sunucusu kullanılır (yalnız eşleşme için;
// oyun verisi P2P gider). Test/geliştirmede window.PEER_CONFIG ile özel sunucu verilebilir.

const Net = (() => {
  // Karışmayan karakterler: 0/O, 1/I, B/8 gibi ikililer alfabede yok.
  const CODE_ALPHABET = 'ACDEFGHKLMNPRSTUVYZ23456789';
  const ID_PREFIX = 'mi10t-kelime-';

  let peer = null;
  let conn = null;
  let handlers = {};
  let closedByUs = false;

  function makeCode() {
    let code = '';
    const rnd = new Uint32Array(4);
    crypto.getRandomValues(rnd);
    for (let i = 0; i < 4; i++) code += CODE_ALPHABET[rnd[i] % CODE_ALPHABET.length];
    return code;
  }

  function newPeer(id) {
    const cfg = window.PEER_CONFIG || {};
    return id ? new Peer(id, cfg) : new Peer(cfg);
  }

  function wireConn(c) {
    conn = c;
    c.on('data', (msg) => { if (handlers.onMessage) handlers.onMessage(msg); });
    c.on('close', () => { if (!closedByUs && handlers.onClose) handlers.onClose(); });
    c.on('error', () => { if (!closedByUs && handlers.onClose) handlers.onClose(); });
  }

  // Oda kur: kod üret, o kodla peer aç, karşı tarafın bağlanmasını bekle.
  // h: { onReady(code), onConnect(), onMessage(msg), onClose(), onError(msg) }
  function host(h) {
    handlers = h;
    closedByUs = false;
    const code = makeCode();
    peer = newPeer(ID_PREFIX + code);
    peer.on('open', () => { if (h.onReady) h.onReady(code); });
    peer.on('connection', (c) => {
      c.on('open', () => {
        wireConn(c);
        if (h.onConnect) h.onConnect();
      });
    });
    peer.on('error', (err) => {
      // unavailable-id: kod çakışması (çok nadir) — yeni kodla tekrar dene.
      if (err.type === 'unavailable-id') { destroy(); host(h); return; }
      if (!closedByUs && h.onError) h.onError(errText(err));
    });
    peer.on('disconnected', () => { if (peer && !closedByUs) peer.reconnect(); });
  }

  // Odaya katıl: koddaki peer'e bağlan.
  function join(code, h) {
    handlers = h;
    closedByUs = false;
    peer = newPeer(null);
    peer.on('open', () => {
      const c = peer.connect(ID_PREFIX + code.trim().toUpperCase(), { reliable: true });
      c.on('open', () => {
        wireConn(c);
        if (h.onConnect) h.onConnect();
      });
      c.on('error', () => { if (!closedByUs && h.onError) h.onError('Odaya bağlanılamadı.'); });
    });
    peer.on('error', (err) => {
      if (!closedByUs && h.onError) h.onError(errText(err));
    });
    peer.on('disconnected', () => { if (peer && !closedByUs) peer.reconnect(); });
  }

  function errText(err) {
    switch (err && err.type) {
      case 'peer-unavailable': return 'Bu kodla açık bir oda bulunamadı. Kodu kontrol et.';
      case 'network': return 'Sinyal sunucusuna ulaşılamıyor. İnternet bağlantını kontrol et.';
      case 'browser-incompatible': return 'Tarayıcın WebRTC desteklemiyor.';
      default: return 'Bağlantı hatası: ' + (err && err.type ? err.type : 'bilinmeyen');
    }
  }

  function send(msg) {
    if (conn && conn.open) conn.send(msg);
  }

  function connected() {
    return !!(conn && conn.open);
  }

  function destroy() {
    closedByUs = true;
    if (conn) { try { conn.close(); } catch (e) { /* zaten kapalı */ } conn = null; }
    if (peer) { try { peer.destroy(); } catch (e) { /* zaten kapalı */ } peer = null; }
    handlers = {};
  }

  return { host, join, send, connected, destroy };
})();
