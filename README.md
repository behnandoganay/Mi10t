# Mi10t — Oyunlar 🎮

Bu depoda bağımlılıksız, saf HTML/CSS/JS ile yazılmış mobil oyunlar var:

- **[Uzay Savaşçısı](#uzay-savaşçısı-)** — Warblade/Galaga tarzı uzay shooter (kök dizin).
- **[Aramızdaki İmposter](imposter/)** — Tek telefonla oynanan "Aramızdaki Hain"
  parti oyunu; tüm kategoriler açık, kendi kategorini de ekleyebilirsin.
  → `imposter/` klasörü, detaylar için [imposter/README.md](imposter/README.md).
- **[Kelime Türetmece](kelime/)** — Klasik kelime zinciri: son harften yeni
  kelime türet, seçilen sürede (5–30 sn ya da süresiz) bulamayan kaybeder.
  Tek telefonda 2 kişi **veya
  iki telefonla online** (oda koduyla, WebRTC/P2P). Gömülü ~48 bin kelimelik
  Türkçe sözlük, krem tonlu açık tema. PWA: bir kez açınca yerel mod tamamen
  **çevrimdışı** oynanabilir, ana ekrana eklenebilir.
  → `kelime/` klasörü, detaylar için [kelime/README.md](kelime/README.md).

Depo, GitHub Pages ile yayınlanır (Settings → Pages, "Deploy from a branch"):
`https://<kullanıcı>.github.io/Mi10t/`. Kaynak dalın `main` seçilmesi önerilir;
böylece site her merge'de kendiliğinden güncellenir.

---

# Uzay Savaşçısı 🚀

Warblade / Galaga tarzı, mobil için tasarlanmış bir uzay shooter oyunu.
Saf HTML5 + Canvas + JavaScript — hiçbir bağımlılık, görsel veya ses dosyası
gerekmez (tüm grafikler ve sesler kodla üretilir).

## Nasıl Oynanır?

- **Sol yarı:** Parmağını bastığın yerde sanal joystick belirir, gemiyi yönlendirir.
- **Sağ yarı:** Ateş butonu — basılı tut, sürekli ateş et.
- **Klavye (masaüstü):** Ok tuşları / WASD hareket, Boşluk ateş.

Dalgalar halinde gelen uzaylıları yok et. Dalga numarası arttıkça düşmanlar
hızlanır ve çoğalır. Ölen düşmanlardan düşen güçlendirmeleri topla:

| Güçlendirme | Etkisi |
|---|---|
| **Ç** (mavi) | Çift atış |
| **H** (yeşil) | Hareket hızı artar |
| **K** (sarı) | Kalkan — bir vuruş emer |
| **♥** (pembe) | Ekstra can |

## Çalıştırma

Herhangi bir statik sunucuyla servis et:

```bash
python3 -m http.server 8000
```

Sonra tarayıcıda `http://localhost:8000` adresini aç. `index.html` dosyasını
doğrudan tarayıcıda açmak da çalışır (build gerekmez).

Telefonda oynamak için repoyu GitHub Pages ile yayınlayıp telefonun
tarayıcısından açman yeterli.

## Dosya Yapısı

```
index.html      — Giriş noktası
css/style.css   — Tam ekran canvas, dokunma ayarları
js/main.js      — Oyun döngüsü ve durum makinesi
js/input.js     — Sanal joystick + ateş butonu + klavye
js/player.js    — Oyuncu gemisi
js/enemies.js   — Düşman tipleri ve dalga sistemi
js/bullets.js   — Mermiler (obje havuzu)
js/powerups.js  — Güçlendirmeler
js/collision.js — Çarpışma testleri
js/hud.js       — Skor, canlar, menüler
js/audio.js     — Web Audio ile sentez sesler
js/sprites.js   — Kodla çizilen sprite'lar
```
