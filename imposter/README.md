# Aramızdaki İmposter 🕵️

Tek telefonla, elden ele oynanan bir parti/blöf oyunu ("Aramızdaki Hain" /
Undercover / Spyfall türü). Herkese gizli bir kelime gösterilir — biri (ya da
birkaçı) hariç. İmposter kelimeyi bilmez ve yakalanmamaya çalışır.

Saf HTML + CSS + JavaScript. Bağımlılık yok, build yok, görsel/ses dosyası yok.
**Tüm kategoriler ücretsiz ve açık; üstelik kendi kategorilerini ekleyebilirsin.**

## Nasıl Oynanır?

1. **Kurulum:** Oyuncu sayısını (3–20), imposter sayısını ve kategorileri seç.
2. **Rol dağıtımı:** Telefon sırayla herkese verilir. Herkes kendi kartına bakar:
   çoğu oyuncu **gizli kelimeyi** görür, imposter ise **"SEN İMPOSTER'SİN"**
   yazısını görür. Kurulumda açtıysan imposter'a **kelimeyi çağrıştıran küçük bir
   ipucu** gösterilir (kelimenin kendisi değil) — ör. "Buzdolabı" → "soğuk",
   "Türk kahvesi" → "köpük", "Elma" → "Newton".
3. **Tartışma:** Sırayla herkes kelimeyle ilgili **tek kelimelik ipucu** söyler.
   İsteğe bağlı geri sayım sayacı vardır.
4. **Oylama:** Grup şüphelendiği kişiye dokunur.
5. **Sonuç:** İmposter açıklanır. Doğru kişiyi elediyseniz ekip kazanır.

## Kendi Kategorini Ekle

Ana menüde **Kategoriler → ➕ Yeni Kategori**. Kelimeleri her satıra bir tane
gir. İmposter'a özel ipucu vermek istersen `Kelime | ipucu` biçimini kullan:

```
Buzdolabı | soğuk
Elma | Newton
Türk kahvesi | köpük
```

İpucu yazmazsan, imposter o kelime için aynı kategoriden başka bir kelimeyi
ipucu olarak görür. Eklediğin kategoriler telefonda kalıcı olarak saklanır
(`localStorage`). Hazır kategorileri **Kapat/Aç** ile oyundan çıkarabilir,
kendi kategorilerini düzenleyip silebilirsin.

## Çalıştırma

Herhangi bir statik sunucuyla:

```bash
python3 -m http.server 8000
```

Sonra tarayıcıda `http://localhost:8000/imposter/` adresini aç. `index.html`
dosyasını doğrudan tarayıcıda açmak da çalışır (build gerekmez).

Telefonda oynamak için repoyu GitHub Pages ile yayınlayıp telefondan
`.../imposter/` adresini aç.

## Dosya Yapısı

```
imposter/
  index.html        — Giriş noktası
  css/style.css     — Mobil öncelikli koyu tema
  js/data.js        — Hazır kategoriler (Türkçe kelime listeleri)
  js/storage.js     — localStorage (kendi kategorilerin + ayarlar)
  js/game.js        — Oyun mantığı (rol dağıtımı, kazanan hesabı)
  js/ui.js          — Ekranlar ve akış
  js/main.js        — Başlatıcı
```
