// data.js — Yerleşik (hazır) kategoriler.
// Her kelime bir çift olarak yazılır: ['Kelime', 'ipucu'].
// İPUCU KURALLARI (zorluk ayarı):
//   - Tek kelime.
//   - İlk akla gelen gönderme OLMAZ (Portekiz → Siuuu gibi).
//   - Nesnenin kendi aleti/parçası OLMAZ (Fırın → kürek, Keman → yay gibi).
//   - Bir adım öteden çağrışım tercih edilir: deyim, tarih, ikinci dereceden
//     bağlantı, kelime oyunu (Ayı → borsa, Kanun → madde, Nike → zafer).
// Kendi kategorilerinde "Kelime | ipucu" biçimini kullanabilirsin (opsiyonel).

const BUILTIN_CATEGORIES = [
  {
    id: 'b_hayvanlar',
    name: '🐾 Hayvanlar',
    words: [
      ['Aslan', 'Narnia'], ['Kaplan', 'kağıttan'], ['Fil', 'Dumbo'], ['Zürafa', 'atkı'],
      ['Zebra', 'geçit'], ['Panda', 'WWF'], ['Kanguru', 'Migros'], ['Timsah', 'gözyaşı'],
      ['Penguen', 'belgesel'], ['Baykuş', 'Duolingo'], ['Kartal', 'semt'], ['Yunus', 'Emre'],
      ['Köpekbalığı', 'bebek'], ['Ahtapot', 'Paul'], ['Yılan', 'Medusa'], ['Kaplumbağa', 'yarış'],
      ['Tavşan', 'Duracell'], ['Sincap', 'Alvin'], ['Kirpi', 'Sega'], ['Yarasa', 'Transilvanya'],
      ['Deve', 'kervan'], ['Su aygırı', 'esneme'], ['Gorilla', 'gökdelen'], ['Şempanze', 'uzay'],
      ['Kurt', 'dolunay'], ['Tilki', 'kümes'], ['Ayı', 'borsa'], ['Geyik', 'muhabbet'],
      ['Karınca', 'ağustosböceği'], ['Arı', 'Maya'],
    ],
  },
  {
    id: 'b_meyve_sebze',
    name: '🍎 Meyve & Sebze',
    words: [
      ['Elma', 'Newton'], ['Armut', 'piş'], ['Muz', 'cumhuriyet'], ['Çilek', 'silgi'],
      ['Karpuz', 'davul'], ['Kavun', 'kelek'], ['Üzüm', 'sirke'], ['Portakal', 'vitamin'],
      ['Mandalina', 'soba'], ['Kiraz', 'küpe'], ['Vişne', 'likör'], ['Şeftali', 'emoji'],
      ['Kayısı', 'zerdali'], ['Nar', 'yılbaşı'], ['İncir', 'çekirdek'], ['Kivi', 'Zelanda'],
      ['Ananas', 'pizza'], ['Avokado', 'tost'], ['Domates', 'İspanya'], ['Salatalık', 'kedi'],
      ['Patates', 'baskı'], ['Soğan', 'zam'], ['Havuç', 'motivasyon'], ['Biber', 'gaz'],
      ['Patlıcan', 'imam'], ['Kabak', 'tadı'], ['Ispanak', 'Popeye'], ['Marul', 'göbek'],
      ['Mısır', 'sinema'], ['Sarımsak', 'vampir'],
    ],
  },
  {
    id: 'b_ulkeler',
    name: '🌍 Ülkeler',
    words: [
      ['Türkiye', 'hindi'], ['Almanya', 'gurbet'], ['Fransa', 'devrim'], ['İtalya', 'çizme'],
      ['İspanya', 'armada'], ['İngiltere', 'Brexit'], ['Hollanda', 'lale'], ['Yunanistan', 'komşu'],
      ['Rusya', 'matruşka'], ['Çin', 'kopya'], ['Japonya', 'origami'], ['Güney Kore', 'kimchi'],
      ['Hindistan', 'Ganj'], ['Brezilya', 'Amazon'], ['Arjantin', 'pampa'], ['Meksika', 'kaktüs'],
      ['Kanada', 'özür'], ['Amerika', 'rüya'], ['Mısır', 'mumya'], ['Fas', 'Kazablanka'],
      ['Nijerya', 'prens'], ['Avustralya', 'ters'], ['İsveç', 'Nobel'], ['Norveç', 'somon'],
      ['Portekiz', 'fado'], ['Polonya', 'Lehçe'], ['İsviçre', 'çakı'], ['Belçika', 'Tenten'],
    ],
  },
  {
    id: 'b_sehirler',
    name: '🏙️ Türkiye Şehirleri',
    words: [
      ['İstanbul', 'trafik'], ['Ankara', 'memur'], ['İzmir', 'kordon'], ['Bursa', 'ipek'],
      ['Antalya', 'Kaleiçi'], ['Adana', 'şalgam'], ['Konya', 'semazen'], ['Gaziantep', 'Zeugma'],
      ['Trabzon', 'Sümela'], ['Samsun', 'Bandırma'], ['Eskişehir', 'lületaşı'], ['Kayseri', 'Erciyes'],
      ['Mersin', 'cezerye'], ['Diyarbakır', 'sur'], ['Erzurum', 'oltu'], ['Van', 'kahvaltı'],
      ['Muğla', 'bal'], ['Aydın', 'efe'], ['Denizli', 'horoz'], ['Sakarya', 'meydan'],
      ['Malatya', 'Aslantepe'], ['Rize', 'Ayder'], ['Sivas', 'kangal'], ['Çanakkale', 'geçilmez'],
      ['Balıkesir', 'Ayvalık'], ['Kocaeli', 'pişmaniye'], ['Şanlıurfa', 'Göbeklitepe'],
      ['Hatay', 'mozaik'], ['Mardin', 'Mezopotamya'], ['Bolu', 'aşçı'],
    ],
  },
  {
    id: 'b_meslekler',
    name: '👔 Meslekler',
    words: [
      ['Doktor', 'yazı'], ['Öğretmen', 'Kasım'], ['Mühendis', 'damat'], ['Avukat', 'baro'],
      ['Polis', '155'], ['İtfaiyeci', '110'], ['Aşçı', 'MasterChef'], ['Garson', 'bahşiş'],
      ['Berber', 'ense'], ['Terzi', 'sökük'], ['Marangoz', 'Geppetto'], ['Elektrikçi', 'sigorta'],
      ['Pilot', 'türbülans'], ['Hostes', 'anons'], ['Kaptan', 'köşk'], ['Şoför', 'dolmuş'],
      ['Hemşire', 'serum'], ['Eczacı', 'muadil'], ['Diş hekimi', 'dolgu'], ['Mimar', 'Sinan'],
      ['Ressam', 'kulak'], ['Müzisyen', 'turne'], ['Oyuncu', 'motor'], ['Yazar', 'daktilo'],
      ['Gazeteci', 'manşet'], ['Çiftçi', 'efendi'], ['Balıkçı', 'palamut'], ['Kasap', 'antrikot'],
      ['Fırıncı', 'francala'], ['Veteriner', 'pati'],
    ],
  },
  {
    id: 'b_filmler',
    name: '🎬 Ünlü Filmler',
    words: [
      ['Titanik', 'kapı'], ['Avatar', 'Pandora'], ['Yüzüklerin Efendisi', 'kıymetlim'],
      ['Harry Potter', 'şimşek'], ['Yıldız Savaşları', 'Jedi'], ['Matrix', 'hap'],
      ['Jurassic Park', 'kehribar'], ['Aslan Kral', 'hakuna'], ['Buz Devri', 'Scrat'],
      ['Şrek', 'bataklık'], ['Karayip Korsanları', 'pusula'], ['Örümcek Adam', 'radyoaktif'],
      ['Batman', 'sinyal'], ['Süpermen', 'kripton'], ['İyi Kötü Çirkin', 'ıslık'],
      ['Esaretin Bedeli', 'IMDb'], ['Baba', 'teklif'], ['Forrest Gump', 'çikolata'],
      ['Interstellar', 'kitaplık'], ['Başlangıç', 'topaç'], ['Joker', 'basamak'],
      ['Gladyatör', 'başparmak'], ['Terminatör', 'döneceğim'], ['Rocky', 'Adrian'],
      ['Rambo', 'bandana'],
    ],
  },
  {
    id: 'b_spor',
    name: '⚽ Spor Dalları',
    words: [
      ['Futbol', 'VAR'], ['Basketbol', '12'], ['Voleybol', 'sultanlar'], ['Tenis', 'Wimbledon'],
      ['Yüzme', 'klor'], ['Boks', 'Ali'], ['Güreş', 'kispet'], ['Karate', 'Miyagi'],
      ['Judo', 'tatami'], ['Tekvando', 'Kore'], ['Halter', 'Naim'], ['Atletizm', 'Bolt'],
      ['Bisiklet', 'Fransa'], ['Kayak', 'Uludağ'], ['Buz pateni', 'piruet'], ['Golf', 'Tiger'],
      ['Hokey', 'Kanada'], ['Beyzbol', 'Yankees'], ['Rugby', 'oval'], ['Masa tenisi', 'Çin'],
      ['Badminton', 'tüy'], ['Okçuluk', 'Gazoz'], ['Eskrim', 'tuşe'], ['Binicilik', 'engel'],
      ['Dalış', 'Cousteau'], ['Sörf', 'Alaçatı'], ['Kürek', 'Oxford'], ['Hentbol', 'yedi'],
    ],
  },
  {
    id: 'b_ev_esya',
    name: '🛋️ Ev Eşyaları',
    words: [
      ['Koltuk', 'kumanda'], ['Masa', 'yuvarlak'], ['Sandalye', 'kapmaca'], ['Yatak', 'pazartesi'],
      ['Dolap', 'çevirmek'], ['Buzdolabı', 'gece'], ['Fırın', 'Hansel'], ['Çamaşır makinesi', 'çorap'],
      ['Bulaşık makinesi', 'parlatıcı'], ['Televizyon', 'dantel'], ['Halı', 'saha'], ['Perde', 'tiyatro'],
      ['Ayna', 'kraliçe'], ['Lamba', 'cin'], ['Vantilatör', 'temmuz'], ['Ütü', 'priz'],
      ['Süpürge', 'cadı'], ['Tencere', 'kapak'], ['Tava', 'krep'], ['Bardak', 'yarısı'],
      ['Tabak', 'porselen'], ['Çatal', 'yol'], ['Kaşık', 'elmas'], ['Bıçak', 'kemik'],
      ['Yastık', 'kavga'], ['Battaniye', 'dizi'], ['Saat', 'kule'], ['Klima', 'ofis'],
    ],
  },
  {
    id: 'b_yiyecek',
    name: '🍔 Yiyecek & İçecek',
    words: [
      ['Pizza', 'makas'], ['Hamburger', 'çeyrek'], ['Döner', 'Berlin'], ['Lahmacun', 'roka'],
      ['Pide', 'Ramazan'], ['Köfte', 'piyaz'], ['Kebap', 'ocakbaşı'], ['Mantı', 'kırk'],
      ['Börek', 'sigara'], ['Simit', 'vapur'], ['Baklava', 'fıstık'], ['Künefe', 'tel'],
      ['Dondurma', 'Maraş'], ['Çikolata', 'fondü'], ['Kek', 'mermer'], ['Pasta', 'mum'],
      ['Makarna', 'öğrenci'], ['Pilav', 'fasulye'], ['Çorba', 'tuz'], ['Salata', 'diyet'],
      ['Menemen', 'soğan'], ['Omlet', 'kolesterol'], ['Çay', 'tavşankanı'], ['Kahve', 'hatır'],
      ['Ayran', 'köpük'], ['Limonata', 'nane'], ['Kola', 'Mentos'], ['Meyve suyu', 'pipet'],
    ],
  },
  {
    id: 'b_kahraman',
    name: '🦸 Süper Kahramanlar',
    words: [
      ['Örümcek Adam', 'radyoaktif'], ['Demir Adam', '3000'], ['Kaptan Amerika', 'buz'],
      ['Thor', 'Asgard'], ['Hulk', 'gama'], ['Batman', 'mağara'], ['Süpermen', 'Kent'],
      ['Wonder Woman', 'kement'], ['Flash', 'bellek'], ['Aquaman', 'Atlantis'],
      ['Kara Panter', 'Wakanda'], ['Doktor Strange', 'portal'], ['Ant-Man', 'kuantum'],
      ['Wolverine', 'Logan'], ['Deadpool', 'geveze'], ['Green Lantern', 'irade'],
      ['Yeşil Ok', 'kapüşon'], ['Kara Dul', 'Budapeşte'], ['Şazam', 'uygulama'], ['Venom', 'dil'],
      ['Hawkeye', 'sağır'], ['Vizyon', 'android'], ['Scarlet Witch', 'kaos'], ['Star-Lord', 'kasetçalar'],
    ],
  },
  {
    id: 'b_muzik',
    name: '🎸 Müzik & Çalgılar',
    words: [
      ['Gitar', 'kamp'], ['Piyano', 'kuyruklu'], ['Keman', 'Stradivarius'], ['Davul', 'sahur'],
      ['Flüt', 'Hamelin'], ['Trompet', 'Armstrong'], ['Saksafon', 'caz'], ['Bağlama', 'aşık'],
      ['Ud', 'perdesiz'], ['Kanun', 'madde'], ['Ney', 'sema'], ['Darbuka', 'kına'],
      ['Zurna', 'sünnet'], ['Klarnet', 'Hüsnü'], ['Akordeon', 'Paris'], ['Arp', 'melek'],
      ['Çello', 'Bach'], ['Kontrbas', 'ayakta'], ['Trombon', 'sürgü'], ['Org', 'kilise'],
      ['Mandolin', 'İtalyan'], ['Ksilofon', 'anaokulu'], ['Zil', 'teneffüs'], ['Tef', 'oryantal'],
    ],
  },
  {
    id: 'b_diziler',
    name: '📺 Türk Dizileri',
    words: [
      ['Kurtlar Vadisi', 'cenaze'], ['Ezel', 'Monte'], ['Aşk-ı Memnu', 'Bihter'],
      ['Muhteşem Yüzyıl', 'harem'], ['Diriliş Ertuğrul', 'oba'], ['Çukur', 'mahalle'],
      ['Leyla ile Mecnun', 'bakkal'], ['Avrupa Yakası', 'Burhan'], ['Çocuklar Duymasın', 'tiki'],
      ['Seksenler', 'kaset'], ['Arka Sokaklar', 'bitmeyen'], ['Kara Sevda', 'Emmy'],
      ['Kuruluş Osman', 'beylik'], ['Gibi', 'absürt'], ['Behzat Ç.', 'Ankara'],
      ['Yaprak Dökümü', 'Fikret'], ['Kuzey Güney', 'kardeş'], ['Fatmagül', 'suç'],
      ['Aşk Yeniden', 'uçak'], ['Yalı Çapkını', 'Ferit'],
    ],
  },
  {
    id: 'b_sarkicilar',
    name: '🎤 Şarkıcılar',
    words: [
      ['Tarkan', 'Şımarık'], ['Sezen Aksu', 'serçe'], ['Barış Manço', 'Gülpembe'],
      ['Ajda Pekkan', 'Palavra'], ['İbrahim Tatlıses', 'Urfa'], ['Müslüm Gürses', 'baba'],
      ['Zeki Müren', 'güneş'], ['Orhan Gencebay', 'batsın'], ['Neşet Ertaş', 'bozkır'],
      ['Cem Karaca', 'tamirci'], ['Ahmet Kaya', 'kum'], ['Sertab Erener', 'Eurovision'],
      ['MFÖ', 'yağmur'], ['Teoman', 'paramparça'], ['Sıla', 'hasret'], ['Mabel Matiz', 'masal'],
      ['Edis', 'Martılar'], ['Hadise', 'dümtektek'], ['Kenan Doğulu', 'şekerim'],
      ['Aleyna Tilki', 'Gesi'],
    ],
  },
  {
    id: 'b_oyunlar',
    name: '🎮 Video Oyunları',
    words: [
      ['Minecraft', 'creeper'], ['Super Mario', 'tesisatçı'], ['Tetris', 'Sovyet'], ['GTA', 'aranma'],
      ['PUBG', 'tavuk'], ['Fortnite', 'dans'], ['Among Us', 'görev'], ['Candy Crush', 'davet'],
      ['Angry Birds', 'sapan'], ['Subway Surfers', 'tren'], ['Pac-Man', 'hayalet'], ['Yılan', 'Nokia'],
      ['FIFA', 'paket'], ['Counter-Strike', 'rush'], ['League of Legends', 'toksik'],
      ['The Sims', 'havuz'], ['Zelda', 'prenses'], ['God of War', 'Olympos'],
      ['Red Dead', 'kovboy'], ['Witcher', 'iksir'],
    ],
  },
  {
    id: 'b_markalar',
    name: '🏷️ Markalar',
    words: [
      ['Nike', 'zafer'], ['Adidas', 'Puma'], ['Apple', 'ısırık'], ['Samsung', 'Galaxy'],
      ['Coca-Cola', 'Noel'], ['Pepsi', 'tadım'], ["McDonald's", 'palyaço'], ['Starbucks', 'isim'],
      ['Mercedes', 'Stuttgart'], ['Ferrari', 'Schumacher'], ['Lamborghini', 'traktör'],
      ['LEGO', 'Danimarka'], ['IKEA', 'alyan'], ['Google', 'amca'], ['YouTube', 'abone'],
      ['Instagram', 'filtre'], ['Netflix', 'maraton'], ['Türk Hava Yolları', 'lokum'],
      ['Arçelik', 'robot'], ['Ülker', 'gofret'], ['BİM', 'aktüel'], ['Migros', 'sanal'],
    ],
  },
  {
    id: 'b_vucut',
    name: '🖐️ Vücut Bölümleri',
    words: [
      ['Baş', 'taç'], ['Saç', 'Rapunzel'], ['Göz', 'nazar'], ['Kulak', 'çınlama'],
      ['Burun', 'havada'], ['Ağız', 'birlik'], ['Dil', 'kemiksiz'], ['Diş', 'peri'],
      ['Boyun', 'borç'], ['Omuz', 'apolet'], ['Kol', 'saat'], ['Dirsek', 'temas'],
      ['El', 'falcı'], ['Parmak', 'iz'], ['Tırnak', 'alıntı'], ['Göğüs', 'kafes'],
      ['Karın', 'guruldama'], ['Sırt', 'pehlivan'], ['Bel', 'kemer'], ['Bacak', 'kadar'],
      ['Diz', 'çökmek'], ['Ayak', 'uydurmak'], ['Topuk', 'Aşil'], ['Kaş', 'hilal'],
      ['Kirpik', 'dilek'], ['Yanak', 'bayram'], ['Çene', 'düşük'], ['Alın', 'ter'],
    ],
  },
];
