// data.js — Yerleşik (hazır) kategoriler.
// Her kategori bir id, ad ve kelime listesinden oluşur. Tümü ücretsiz ve açıktır.
// Kendi kategorilerini "Kategoriler" ekranından ekleyebilirsin; onlar ayrıca saklanır.

const BUILTIN_CATEGORIES = [
  {
    id: 'b_hayvanlar',
    name: '🐾 Hayvanlar',
    words: [
      'Aslan', 'Kaplan', 'Fil', 'Zürafa', 'Zebra', 'Panda', 'Kanguru', 'Timsah',
      'Penguen', 'Baykuş', 'Kartal', 'Yunus', 'Köpekbalığı', 'Ahtapot', 'Yılan',
      'Kaplumbağa', 'Tavşan', 'Sincap', 'Kirpi', 'Yarasa', 'Deve', 'Su aygırı',
      'Gorilla', 'Şempanze', 'Kurt', 'Tilki', 'Ayı', 'Geyik', 'Karınca', 'Arı',
    ],
  },
  {
    id: 'b_meyve_sebze',
    name: '🍎 Meyve & Sebze',
    words: [
      'Elma', 'Armut', 'Muz', 'Çilek', 'Karpuz', 'Kavun', 'Üzüm', 'Portakal',
      'Mandalina', 'Kiraz', 'Vişne', 'Şeftali', 'Kayısı', 'Nar', 'İncir', 'Kivi',
      'Ananas', 'Avokado', 'Domates', 'Salatalık', 'Patates', 'Soğan', 'Havuç',
      'Biber', 'Patlıcan', 'Kabak', 'Ispanak', 'Marul', 'Mısır', 'Sarımsak',
    ],
  },
  {
    id: 'b_ulkeler',
    name: '🌍 Ülkeler',
    words: [
      'Türkiye', 'Almanya', 'Fransa', 'İtalya', 'İspanya', 'İngiltere', 'Hollanda',
      'Yunanistan', 'Rusya', 'Çin', 'Japonya', 'Güney Kore', 'Hindistan', 'Brezilya',
      'Arjantin', 'Meksika', 'Kanada', 'Amerika', 'Mısır', 'Fas', 'Nijerya',
      'Avustralya', 'İsveç', 'Norveç', 'Portekiz', 'Polonya', 'İsviçre', 'Belçika',
    ],
  },
  {
    id: 'b_sehirler',
    name: '🏙️ Türkiye Şehirleri',
    words: [
      'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep',
      'Trabzon', 'Samsun', 'Eskişehir', 'Kayseri', 'Mersin', 'Diyarbakır', 'Erzurum',
      'Van', 'Muğla', 'Aydın', 'Denizli', 'Sakarya', 'Malatya', 'Rize', 'Sivas',
      'Çanakkale', 'Balıkesir', 'Kocaeli', 'Şanlıurfa', 'Hatay', 'Mardin', 'Bolu',
    ],
  },
  {
    id: 'b_meslekler',
    name: '👔 Meslekler',
    words: [
      'Doktor', 'Öğretmen', 'Mühendis', 'Avukat', 'Polis', 'İtfaiyeci', 'Aşçı',
      'Garson', 'Berber', 'Terzi', 'Marangoz', 'Elektrikçi', 'Pilot', 'Hostes',
      'Kaptan', 'Şoför', 'Hemşire', 'Eczacı', 'Diş hekimi', 'Mimar', 'Ressam',
      'Müzisyen', 'Oyuncu', 'Yazar', 'Gazeteci', 'Çiftçi', 'Balıkçı', 'Kasap',
      'Fırıncı', 'Veteriner',
    ],
  },
  {
    id: 'b_filmler',
    name: '🎬 Ünlü Filmler',
    words: [
      'Titanik', 'Avatar', 'Yüzüklerin Efendisi', 'Harry Potter', 'Yıldız Savaşları',
      'Matrix', 'Jurassic Park', 'Aslan Kral', 'Buz Devri', 'Şrek', 'Karayip Korsanları',
      'Örümcek Adam', 'Batman', 'Süpermen', 'İyi Kötü Çirkin', 'Esaretin Bedeli',
      'Baba', 'Forrest Gump', 'Interstellar', 'Başlangıç', 'Joker', 'Gladyatör',
      'Terminatör', 'Rocky', 'Rambo',
    ],
  },
  {
    id: 'b_spor',
    name: '⚽ Spor Dalları',
    words: [
      'Futbol', 'Basketbol', 'Voleybol', 'Tenis', 'Yüzme', 'Boks', 'Güreş', 'Karate',
      'Judo', 'Tekvando', 'Halter', 'Atletizm', 'Bisiklet', 'Kayak', 'Buz pateni',
      'Golf', 'Hokey', 'Beyzbol', 'Rugby', 'Masa tenisi', 'Badminton', 'Okçuluk',
      'Eskrim', 'Binicilik', 'Dalış', 'Sörf', 'Kürek', 'Hentbol',
    ],
  },
  {
    id: 'b_ev_esya',
    name: '🛋️ Ev Eşyaları',
    words: [
      'Koltuk', 'Masa', 'Sandalye', 'Yatak', 'Dolap', 'Buzdolabı', 'Fırın', 'Çamaşır makinesi',
      'Bulaşık makinesi', 'Televizyon', 'Halı', 'Perde', 'Ayna', 'Lamba', 'Vantilatör',
      'Ütü', 'Süpürge', 'Tencere', 'Tava', 'Bardak', 'Tabak', 'Çatal', 'Kaşık', 'Bıçak',
      'Yastık', 'Battaniye', 'Saat', 'Klima',
    ],
  },
  {
    id: 'b_yiyecek',
    name: '🍔 Yiyecek & İçecek',
    words: [
      'Pizza', 'Hamburger', 'Döner', 'Lahmacun', 'Pide', 'Köfte', 'Kebap', 'Mantı',
      'Börek', 'Simit', 'Baklava', 'Künefe', 'Dondurma', 'Çikolata', 'Kek', 'Pasta',
      'Makarna', 'Pilav', 'Çorba', 'Salata', 'Menemen', 'Omlet', 'Çay', 'Kahve',
      'Ayran', 'Limonata', 'Kola', 'Meyve suyu',
    ],
  },
  {
    id: 'b_kahraman',
    name: '🦸 Süper Kahramanlar',
    words: [
      'Örümcek Adam', 'Demir Adam', 'Kaptan Amerika', 'Thor', 'Hulk', 'Batman',
      'Süpermen', 'Wonder Woman', 'Flash', 'Aquaman', 'Kara Panter', 'Doktor Strange',
      'Ant-Man', 'Wolverine', 'Deadpool', 'Green Lantern', 'Yeşil Ok', 'Kara Dul',
      'Şazam', 'Venom', 'Hawkeye', 'Vizyon', 'Scarlet Witch', 'Star-Lord',
    ],
  },
  {
    id: 'b_muzik',
    name: '🎸 Müzik & Çalgılar',
    words: [
      'Gitar', 'Piyano', 'Keman', 'Davul', 'Flüt', 'Trompet', 'Saksafon', 'Bağlama',
      'Ud', 'Kanun', 'Ney', 'Darbuka', 'Zurna', 'Klarnet', 'Akordeon', 'Arp',
      'Çello', 'Kontrbas', 'Trombon', 'Org', 'Mandolin', 'Ksilofon', 'Zil', 'Tef',
    ],
  },
  {
    id: 'b_vucut',
    name: '🖐️ Vücut Bölümleri',
    words: [
      'Baş', 'Saç', 'Göz', 'Kulak', 'Burun', 'Ağız', 'Dil', 'Diş', 'Boyun', 'Omuz',
      'Kol', 'Dirsek', 'El', 'Parmak', 'Tırnak', 'Göğüs', 'Karın', 'Sırt', 'Bel',
      'Bacak', 'Diz', 'Ayak', 'Topuk', 'Kaş', 'Kirpik', 'Yanak', 'Çene', 'Alın',
    ],
  },
];
