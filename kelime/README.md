# Kelime Türetmece 🔤

Klasik kelime zinciri oyununun mobil sürümü. Tek telefonda 2 kişi, karşılıklı
oynanır. Saf HTML/CSS/JS — bağımlılık yok, krem tonlu açık tema.

## Çevrimdışı Oynama (PWA)

Oyun bir PWA'dır: sayfayı bir kez açtıktan sonra service worker tüm dosyaları
(sözlük dahil) önbelleğe alır ve oyun **internetsiz** çalışır.

- Telefonda tarayıcı menüsünden **"Ana ekrana ekle"** dersen oyun, kendi
  simgesiyle tam ekran bir uygulama gibi açılır.
- Uçakta, metroda, internetsiz her yerde oynanabilir.

## Kurallar

1. 1. oyuncu istediği bir kelimeyle başlar (ör. **araç**).
2. Sıradaki oyuncu, önceki kelimenin **son harfiyle** başlayan yeni bir kelime
   yazar: araç → **ç**ay → **y**at → **t**arak...
3. Kelime geçerli sayılır ⇔ doğru harfle başlıyor, sözlükte var, bu elde daha
   önce kullanılmamış ve en az 2 harfli.
4. Geçersiz kelimede süre **işlemeye devam eder**, tekrar denenebilir.
5. **10 saniyede** kelime bulamayan eli kaybeder; rakip 1 puan alır.
6. Türkçede hiçbir kelime **ğ** ile başlamadığı için, kelime ğ ile biterse
   (dağ, bağ...) sıradaki oyuncu **istediği harfle** başlayabilir.
7. Yeni eli bir önceki elin kaybedeni başlatır. Skor, sayfa açık kaldığı sürece
   birikir.

Şapkalı harfler şapkasıza normalize edilir: "kâğıt" yazsan da "kağıt" yazsan da
kabul edilir. Büyük/küçük harf dönüşümü Türkçe kurallarıyla yapılır (İ→i, I→ı).

## Sözlük

`js/words.js` içinde ~48 bin kelimelik gömülü Türkçe kelime listesi vardır.
Kaynak: [mertemin/turkish-word-list](https://github.com/mertemin/turkish-word-list)
(TDK Güncel Türkçe Sözlük tabanlı). Çok kelimeli deyimler ve Türkçe alfabe
dışı karakter içeren girişler filtrelenmiştir.

## Çalıştırma

Depo kökünden herhangi bir statik sunucuyla servis et:

```bash
python3 -m http.server 8000
```

Sonra tarayıcıda `http://localhost:8000/kelime/` adresini aç. `index.html`
dosyasını doğrudan açmak da çalışır (build gerekmez).

## Dosya Yapısı

```
index.html           — Giriş noktası
manifest.webmanifest — PWA manifesti (ana ekrana ekleme)
sw.js                — Service worker: çevrimdışı önbellek
icon-192/512.png     — Uygulama simgeleri
css/style.css        — Mobil öncelikli krem/açık tema
js/words.js          — Gömülü Türkçe kelime listesi (Set)
js/game.js           — Saf oyun mantığı: doğrulama, sıra, ğ kuralı, skor
js/timer.js          — requestAnimationFrame ile 10 sn geri sayım
js/audio.js          — Web Audio ile sentez sesler
js/ui.js             — Ekranlar ve DOM güncellemeleri
js/main.js           — Başlatma + service worker kaydı
```
