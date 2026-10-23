import { computed } from 'vue';
import { useData } from 'vitepress';
import { i18n } from '../../src/plugins/i18n';

/**
 * Text for the interactive components on the docs pages, in the language of the page.
 *
 * Whatever the app already says (load types, quantities, example titles) comes from the app's own
 * locale files, so the two never disagree. Only sentences the app has no use for are kept here.
 */
type DocsLanguage =
  | 'en'
  | 'cs'
  | 'de'
  | 'es'
  | 'fr'
  | 'hi'
  | 'pl'
  | 'pt'
  | 'ru'
  | 'uk'
  | 'zh'
  | 'tr'
  | 'th'
  | 'vi'
  | 'it'
  | 'id'
  | 'ja'
  | 'ko';

/** The app's locale for each docs language; the app says cn for zh. */
const APP_LOCALE: Record<DocsLanguage, string> = {
  en: 'en',
  cs: 'cs',
  de: 'de',
  es: 'es',
  fr: 'fr',
  hi: 'hi',
  pl: 'pl',
  pt: 'pt',
  ru: 'ru',
  uk: 'uk',
  zh: 'cn',
  tr: 'tr',
  th: 'th',
  vi: 'vi',
  it: 'it',
  id: 'id',
  ja: 'ja',
  ko: 'ko',
};

export interface DocsStrings {
  loadsTitle: string;
  loadsLede: string;
  openInApp: string;
  simplySupportedBeam: string;
  udlBlurb: string;
  trapezoidalBlurb: string;
  concentratedBlurb: string;
  nodalBlurb: string;
  temperatureBlurb: string;
  promoTitle: string;
  promoAccent: string;
  promoSubtitle: string;
  promoCta: string;
}

const strings: Record<DocsLanguage, DocsStrings> = {
  en: {
    loadsTitle: 'Load type previews',
    loadsLede:
      'How the common load types look in EduBeam. Each card is a live, solved model and opens in the app exactly as set up.',
    openInApp: 'Open in EduBeam',
    simplySupportedBeam: 'Simply supported beam',
    udlBlurb: 'Pinned–roller span under 12 kN/m: the classic shear and moment diagrams.',
    trapezoidalBlurb: 'A load rising from 4 to 14 kN/m across the right span.',
    concentratedBlurb: 'A single 18 kN downward load at mid-span, with no extra node.',
    nodalBlurb: 'A 20 kN load at the interior support, to check reactions and deflections.',
    temperatureBlurb: 'A temperature difference across the depth (top warmer than bottom) and the curvature it causes.',
    promoTitle: 'Take your frames',
    promoAccent: 'into 3D.',
    promoSubtitle: 'slabs, shells & steel checks in your browser',
    promoCta: 'Try it free',
  },
  cs: {
    loadsTitle: 'Ukázky typů zatížení',
    loadsLede:
      'Jak v EduBeamu vypadají běžné typy zatížení. Každá karta je živý, vyřešený model a otevře se v aplikaci přesně tak, jak je nastavená.',
    openInApp: 'Otevřít v EduBeamu',
    simplySupportedBeam: 'Prostý nosník',
    udlBlurb:
      'Nosník na pevném a posuvném kloubu se zatížením 12 kN/m: klasické průběhy posouvajících sil a ohybových momentů.',
    trapezoidalBlurb: 'Zatížení rostoucí ze 4 na 14 kN/m v pravém poli.',
    concentratedBlurb: 'Jediná síla 18 kN dolů uprostřed rozpětí, bez dalšího uzlu.',
    nodalBlurb: 'Síla 20 kN nad vnitřní podporou – vhodná pro kontrolu reakcí a průhybů.',
    temperatureBlurb: 'Rozdíl teplot po výšce průřezu (nahoře tepleji než dole) a zakřivení, které způsobí.',
    promoTitle: 'Posuňte své rámy',
    promoAccent: 'do 3D.',
    promoSubtitle: 'desky, skořepiny a posudky ocelových prvků v prohlížeči',
    promoCta: 'Vyzkoušet zdarma',
  },
  de: {
    loadsTitle: 'Lastarten im Überblick',
    loadsLede:
      'So sehen die üblichen Lastarten in EduBeam aus. Jede Karte ist ein gelöstes Live-Modell und öffnet sich in der App genau so, wie sie aufgebaut ist.',
    openInApp: 'In EduBeam öffnen',
    simplySupportedBeam: 'Einfeldträger',
    udlBlurb: 'Fest- und Loslager unter 12 kN/m: die klassischen Querkraft- und Momentenlinien.',
    trapezoidalBlurb: 'Eine Last, die im rechten Feld von 4 auf 14 kN/m ansteigt.',
    concentratedBlurb: 'Eine einzelne Last von 18 kN nach unten in Feldmitte, ohne zusätzlichen Knoten.',
    nodalBlurb: 'Eine Last von 20 kN am Innenlager, um Auflagerkräfte und Durchbiegungen zu prüfen.',
    temperatureBlurb:
      'Ein Temperaturunterschied über die Querschnittshöhe (oben wärmer als unten) und die Krümmung, die er erzeugt.',
    promoTitle: 'Bringen Sie Ihre Rahmen',
    promoAccent: 'in 3D.',
    promoSubtitle: 'Platten, Schalen und Stahlnachweise im Browser',
    promoCta: 'Kostenlos testen',
  },
  es: {
    loadsTitle: 'Vista previa de los tipos de carga',
    loadsLede:
      'Así se ven los tipos de carga habituales en EduBeam. Cada tarjeta es un modelo resuelto en vivo y se abre en la aplicación tal como está configurado.',
    openInApp: 'Abrir en EduBeam',
    simplySupportedBeam: 'Viga simplemente apoyada',
    udlBlurb: 'Vano articulado y con rodillo bajo 12 kN/m: los diagramas clásicos de cortante y momento.',
    trapezoidalBlurb: 'Una carga que crece de 4 a 14 kN/m en el vano derecho.',
    concentratedBlurb: 'Una sola carga de 18 kN hacia abajo en el centro del vano, sin nodo adicional.',
    nodalBlurb: 'Una carga de 20 kN en el apoyo intermedio para comprobar reacciones y flechas.',
    temperatureBlurb:
      'Una diferencia de temperatura en el canto (arriba más caliente que abajo) y la curvatura que produce.',
    promoTitle: 'Lleve sus pórticos',
    promoAccent: 'a 3D.',
    promoSubtitle: 'losas, láminas y comprobaciones de acero en el navegador',
    promoCta: 'Pruébelo gratis',
  },
  fr: {
    loadsTitle: 'Aperçu des types de charges',
    loadsLede:
      'Voici à quoi ressemblent les types de charges courants dans EduBeam. Chaque carte est un modèle résolu en direct et s’ouvre dans l’application exactement tel qu’il est défini.',
    openInApp: 'Ouvrir dans EduBeam',
    simplySupportedBeam: 'Poutre sur deux appuis',
    udlBlurb:
      'Travée sur articulation et appui simple sous 12 kN/m : les diagrammes classiques d’effort tranchant et de moment.',
    trapezoidalBlurb: 'Une charge qui croît de 4 à 14 kN/m sur la travée de droite.',
    concentratedBlurb: 'Une seule charge de 18 kN vers le bas à mi-travée, sans nœud supplémentaire.',
    nodalBlurb: 'Une charge de 20 kN sur l’appui intermédiaire, pour vérifier réactions et flèches.',
    temperatureBlurb:
      'Une différence de température sur la hauteur (dessus plus chaud que dessous) et la courbure qu’elle provoque.',
    promoTitle: 'Passez vos portiques',
    promoAccent: 'en 3D.',
    promoSubtitle: 'dalles, coques et vérifications acier dans votre navigateur',
    promoCta: 'Essayer gratuitement',
  },
  hi: {
    loadsTitle: 'भार प्रकारों का पूर्वावलोकन',
    loadsLede:
      'EduBeam में सामान्य भार प्रकार ऐसे दिखते हैं। हर कार्ड एक हल किया हुआ जीवंत मॉडल है और ऐप में ठीक वैसे ही खुलता है जैसा वह बना है।',
    openInApp: 'EduBeam में खोलें',
    simplySupportedBeam: 'सरल आलंबित बीम',
    udlBlurb: 'पिन और रोलर सपोर्ट पर 12 kN/m भार: अपरूपण बल और बंकन आघूर्ण के पारंपरिक आरेख।',
    trapezoidalBlurb: 'दाएँ स्पैन पर 4 से 14 kN/m तक बढ़ता हुआ भार।',
    concentratedBlurb: 'स्पैन के मध्य में नीचे की ओर 18 kN का एकल भार, बिना अतिरिक्त नोड के।',
    nodalBlurb: 'प्रतिक्रियाओं और विक्षेपों की जाँच के लिए आंतरिक सपोर्ट पर 20 kN भार।',
    temperatureBlurb: 'गहराई के आर-पार तापमान का अंतर (ऊपर नीचे से अधिक गर्म) और उससे उत्पन्न वक्रता।',
    promoTitle: 'अपने फ्रेम',
    promoAccent: '3D में ले जाएँ।',
    promoSubtitle: 'ब्राउज़र में स्लैब, शेल और स्टील जाँच',
    promoCta: 'मुफ़्त आज़माएँ',
  },
  pl: {
    loadsTitle: 'Podgląd rodzajów obciążeń',
    loadsLede:
      'Tak wyglądają typowe rodzaje obciążeń w EduBeam. Każda karta to rozwiązany model na żywo, który otwiera się w aplikacji dokładnie tak, jak go ustawiono.',
    openInApp: 'Otwórz w EduBeam',
    simplySupportedBeam: 'Belka swobodnie podparta',
    udlBlurb:
      'Przęsło na podporze przegubowej nieprzesuwnej i przesuwnej pod 12 kN/m: klasyczne wykresy sił tnących i momentów.',
    trapezoidalBlurb: 'Obciążenie rosnące od 4 do 14 kN/m w prawym przęśle.',
    concentratedBlurb: 'Pojedyncza siła 18 kN w dół w środku rozpiętości, bez dodatkowego węzła.',
    nodalBlurb: 'Siła 20 kN na podporze pośredniej, do sprawdzenia reakcji i ugięć.',
    temperatureBlurb: 'Różnica temperatur na wysokości przekroju (u góry cieplej niż u dołu) i wywołana nią krzywizna.',
    promoTitle: 'Przenieś swoje ramy',
    promoAccent: 'do 3D.',
    promoSubtitle: 'płyty, powłoki i wymiarowanie stali w przeglądarce',
    promoCta: 'Wypróbuj za darmo',
  },
  pt: {
    loadsTitle: 'Prévia dos tipos de carga',
    loadsLede:
      'É assim que os tipos de carga mais comuns aparecem no EduBeam. Cada cartão é um modelo resolvido ao vivo e abre no aplicativo exatamente como foi montado.',
    openInApp: 'Abrir no EduBeam',
    simplySupportedBeam: 'Viga biapoiada',
    udlBlurb: 'Vão com apoio fixo e apoio móvel sob 12 kN/m: os diagramas clássicos de cortante e momento.',
    trapezoidalBlurb: 'Uma carga que cresce de 4 a 14 kN/m no vão da direita.',
    concentratedBlurb: 'Uma única carga de 18 kN para baixo no meio do vão, sem nó extra.',
    nodalBlurb: 'Uma carga de 20 kN no apoio intermediário, para conferir reações e deslocamentos.',
    temperatureBlurb:
      'Uma diferença de temperatura ao longo da altura (em cima mais quente que embaixo) e a curvatura que ela causa.',
    promoTitle: 'Leve seus pórticos',
    promoAccent: 'para o 3D.',
    promoSubtitle: 'lajes, cascas e verificações de aço no navegador',
    promoCta: 'Experimente grátis',
  },
  ru: {
    loadsTitle: 'Примеры видов нагрузок',
    loadsLede:
      'Так распространённые виды нагрузок выглядят в EduBeam. Каждая карточка — решённая живая модель, которая открывается в приложении в точности так, как она задана.',
    openInApp: 'Открыть в EduBeam',
    simplySupportedBeam: 'Однопролётная шарнирно опёртая балка',
    udlBlurb: 'Пролёт на шарнирно-неподвижной и подвижной опорах под нагрузкой 12 кН/м: классические эпюры Q и M.',
    trapezoidalBlurb: 'Нагрузка, растущая от 4 до 14 кН/м в правом пролёте.',
    concentratedBlurb: 'Одна сила 18 кН вниз в середине пролёта, без дополнительного узла.',
    nodalBlurb: 'Сила 20 кН на промежуточной опоре для проверки реакций и прогибов.',
    temperatureBlurb: 'Перепад температур по высоте сечения (сверху теплее, чем снизу) и вызванная им кривизна.',
    promoTitle: 'Перенесите свои рамы',
    promoAccent: 'в 3D.',
    promoSubtitle: 'плиты, оболочки и проверки стальных элементов в браузере',
    promoCta: 'Попробовать бесплатно',
  },
  uk: {
    loadsTitle: 'Приклади видів навантажень',
    loadsLede:
      'Так поширені види навантажень виглядають в EduBeam. Кожна картка — розв’язана жива модель, яка відкривається в застосунку саме так, як її задано.',
    openInApp: 'Відкрити в EduBeam',
    simplySupportedBeam: 'Однопрогінна шарнірно оперта балка',
    udlBlurb: 'Прогін на шарнірно-нерухомій і рухомій опорах під навантаженням 12 kN/m: класичні епюри Q і M.',
    trapezoidalBlurb: 'Навантаження, що зростає від 4 до 14 kN/m у правому прогоні.',
    concentratedBlurb: 'Одна сила 18 kN донизу посередині прогону, без додаткового вузла.',
    nodalBlurb: 'Сила 20 kN на проміжній опорі для перевірки реакцій і прогинів.',
    temperatureBlurb: 'Перепад температур по висоті перерізу (зверху тепліше, ніж знизу) і кривина, яку він спричиняє.',
    promoTitle: 'Перенесіть свої рами',
    promoAccent: 'у 3D.',
    promoSubtitle: 'плити, оболонки та перевірки сталевих елементів у браузері',
    promoCta: 'Спробувати безкоштовно',
  },
  zh: {
    loadsTitle: '荷载类型预览',
    loadsLede: '常见荷载类型在 EduBeam 中的样子。每张卡片都是已求解的实时模型，点击即可在应用中按原样打开。',
    openInApp: '在 EduBeam 中打开',
    simplySupportedBeam: '简支梁',
    udlBlurb: '固定铰支座与滑动铰支座上的 12 kN/m 均布荷载：经典的剪力图和弯矩图。',
    trapezoidalBlurb: '右跨上从 4 kN/m 增大到 14 kN/m 的荷载。',
    concentratedBlurb: '跨中一个向下 18 kN 的集中荷载，无需额外节点。',
    nodalBlurb: '中间支座上的 20 kN 荷载，用于检查支座反力和挠度。',
    temperatureBlurb: '沿截面高度的温差（上表面比下表面热）及其引起的曲率。',
    promoTitle: '将您的框架',
    promoAccent: '带入 3D。',
    promoSubtitle: '在浏览器中完成楼板、壳体和钢结构验算',
    promoCta: '免费试用',
  },
  tr: {
    loadsTitle: 'Yük türlerine ön bakış',
    loadsLede:
      "Yaygın yük türleri EduBeam'de böyle görünür. Her kart çözülmüş, canlı bir modeldir ve uygulamada tam olarak kurulduğu gibi açılır.",
    openInApp: "EduBeam'de aç",
    simplySupportedBeam: 'Basit mesnetli kiriş',
    udlBlurb:
      'Mafsallı ve kayıcı mesnetli kiriş, 12 kN/m yük altında: klasik kesme kuvveti ve eğilme momenti diyagramları.',
    trapezoidalBlurb: "Sağ açıklık boyunca 4 kN/m'den 14 kN/m'ye artan bir yük.",
    concentratedBlurb: "Açıklık ortasında aşağı yönlü tek bir 18 kN'lik yük, ek düğüm gerekmeden.",
    nodalBlurb: "Mesnet tepkilerini ve sehimleri kontrol etmek için ara mesnete etkiyen 20 kN'lik yük.",
    temperatureBlurb:
      'Kesit yüksekliği boyunca sıcaklık farkı (üst taraf alttan daha sıcak) ve bunun oluşturduğu eğrilik.',
    promoTitle: 'Çerçevelerinizi',
    promoAccent: "3B'ye taşıyın.",
    promoSubtitle: 'döşemeler, kabuklar ve çelik kontrolleri tarayıcınızda',
    promoCta: 'Ücretsiz deneyin',
  },
  th: {
    loadsTitle: 'ตัวอย่างประเภทแรงกระทำ',
    loadsLede:
      'แรงกระทำประเภทที่ใช้บ่อยมีหน้าตาอย่างไรใน EduBeam การ์ดแต่ละใบคือโมเดลที่คำนวณแล้วและโต้ตอบได้ และเปิดในแอปได้ตรงตามที่ตั้งค่าไว้',
    openInApp: 'เปิดใน EduBeam',
    simplySupportedBeam: 'คานช่วงเดียวแบบรองรับธรรมดา',
    udlBlurb: 'คานบนหมุดและล้อเลื่อนรับแรง 12 kN/m: แผนภาพแรงเฉือนและโมเมนต์ดัดแบบคลาสสิก',
    trapezoidalBlurb: 'แรงแผ่กระจายที่เพิ่มจาก 4 เป็น 14 kN/m ตลอดช่วงด้านขวา',
    concentratedBlurb: 'แรงกระทำเป็นจุดขนาด 18 kN ทิศลงที่กึ่งกลางช่วง โดยไม่ต้องเพิ่มโหนด',
    nodalBlurb: 'แรง 20 kN ที่จุดรองรับภายใน สำหรับตรวจสอบแรงปฏิกิริยาและการโก่งตัว',
    temperatureBlurb: 'ผลต่างอุณหภูมิตามความลึกของหน้าตัด (ด้านบนร้อนกว่าด้านล่าง) และความโค้งที่เกิดขึ้น',
    promoTitle: 'ยกระดับโครงข้อแข็งของคุณ',
    promoAccent: 'สู่ 3 มิติ',
    promoSubtitle: 'แผ่นพื้น เปลือกบาง และการตรวจสอบเหล็กโครงสร้างบนเบราว์เซอร์',
    promoCta: 'ลองใช้ฟรี',
  },
  vi: {
    loadsTitle: 'Xem trước các loại tải trọng',
    loadsLede:
      'Các loại tải trọng thông dụng trông như thế nào trong EduBeam. Mỗi thẻ là một mô hình đã giải, tương tác được, và mở trong ứng dụng đúng như đã thiết lập.',
    openInApp: 'Mở trong EduBeam',
    simplySupportedBeam: 'Dầm đơn giản',
    udlBlurb: 'Nhịp gối cố định – gối di động chịu 12 kN/m: biểu đồ lực cắt và mô men kinh điển.',
    trapezoidalBlurb: 'Tải tăng từ 4 đến 14 kN/m trên nhịp bên phải.',
    concentratedBlurb: 'Một tải tập trung 18 kN hướng xuống tại giữa nhịp, không cần thêm nút.',
    nodalBlurb: 'Tải 20 kN tại gối tựa giữa, để kiểm tra phản lực và độ võng.',
    temperatureBlurb:
      'Chênh lệch nhiệt độ theo chiều cao tiết diện (thớ trên nóng hơn thớ dưới) và độ cong mà nó gây ra.',
    promoTitle: 'Đưa khung của bạn',
    promoAccent: 'lên 3D.',
    promoSubtitle: 'bản sàn, vỏ mỏng và kiểm tra kết cấu thép ngay trên trình duyệt',
    promoCta: 'Dùng thử miễn phí',
  },
  it: {
    loadsTitle: 'Anteprima dei tipi di carico',
    loadsLede:
      "Come appaiono in EduBeam i tipi di carico più comuni. Ogni scheda è un modello risolto e interattivo e si apre nell'app esattamente come è impostato.",
    openInApp: 'Apri in EduBeam',
    simplySupportedBeam: 'Trave semplicemente appoggiata',
    udlBlurb: 'Campata cerniera–carrello con 12 kN/m: i classici diagrammi di taglio e momento.',
    trapezoidalBlurb: 'Un carico che cresce da 4 a 14 kN/m sulla campata destra.',
    concentratedBlurb: 'Un unico carico di 18 kN verso il basso in mezzeria, senza nodi aggiuntivi.',
    nodalBlurb: "Un carico di 20 kN sull'appoggio intermedio, per controllare reazioni e frecce.",
    temperatureBlurb:
      "Una differenza di temperatura lungo l'altezza della sezione (fibre superiori più calde di quelle inferiori) e la curvatura che provoca.",
    promoTitle: 'Porta i tuoi telai',
    promoAccent: 'in 3D.',
    promoSubtitle: "solai, gusci e verifiche dell'acciaio nel browser",
    promoCta: 'Provalo gratis',
  },
  id: {
    loadsTitle: 'Pratinjau tipe beban',
    loadsLede:
      'Seperti apa tipe beban umum di EduBeam. Setiap kartu adalah model hidup yang sudah dihitung dan terbuka di aplikasi persis seperti yang diatur.',
    openInApp: 'Buka di EduBeam',
    simplySupportedBeam: 'Balok sederhana',
    udlBlurb: 'Bentang sendi–rol dengan beban 12 kN/m: diagram gaya geser dan momen lentur klasik.',
    trapezoidalBlurb: 'Beban yang naik dari 4 hingga 14 kN/m di sepanjang bentang kanan.',
    concentratedBlurb: 'Satu beban 18 kN ke bawah di tengah bentang, tanpa joint tambahan.',
    nodalBlurb: 'Beban 20 kN di tumpuan tengah, untuk memeriksa reaksi dan lendutan.',
    temperatureBlurb:
      'Perbedaan suhu sepanjang tinggi penampang (atas lebih panas daripada bawah) dan kelengkungan yang ditimbulkannya.',
    promoTitle: 'Bawa portal Anda',
    promoAccent: 'ke 3D.',
    promoSubtitle: 'pelat, cangkang & pemeriksaan baja di browser Anda',
    promoCta: 'Coba gratis',
  },
  ja: {
    loadsTitle: '荷重の種類のプレビュー',
    loadsLede:
      'EduBeam で代表的な荷重がどのように表示されるかを紹介します。各カードは解析済みのライブなモデルで、設定どおりの状態でアプリに開きます。',
    openInApp: 'EduBeam で開く',
    simplySupportedBeam: '単純梁',
    udlBlurb: 'ピン–ローラー支持のスパンに 12 kN/m：おなじみのせん断力図と曲げモーメント図。',
    trapezoidalBlurb: '右スパンで 4 kN/m から 14 kN/m まで増加する荷重。',
    concentratedBlurb: 'スパン中央に下向き 18 kN の集中荷重を 1 つ。追加の節点は不要です。',
    nodalBlurb: '中間支点に 20 kN の荷重。反力とたわみの確認に。',
    temperatureBlurb: '断面の高さ方向の温度差（上側が下側より高温）と、それによって生じる曲率。',
    promoTitle: 'あなたの骨組を',
    promoAccent: '3D へ。',
    promoSubtitle: 'スラブ、シェル、鋼構造の断面検定をブラウザで',
    promoCta: '無料で試す',
  },
  ko: {
    loadsTitle: '하중 유형 미리보기',
    loadsLede:
      '자주 쓰는 하중 유형이 EduBeam에서 어떻게 보이는지 확인하세요. 각 카드는 해석이 끝난 실시간 모델이며, 설정된 그대로 앱에서 열립니다.',
    openInApp: 'EduBeam에서 열기',
    simplySupportedBeam: '단순보',
    udlBlurb: '12 kN/m를 받는 힌지–롤러 보: 전형적인 전단력도와 휨모멘트도.',
    trapezoidalBlurb: '오른쪽 경간에서 4 kN/m부터 14 kN/m까지 증가하는 하중.',
    concentratedBlurb: '절점을 추가하지 않고 경간 중앙에 가한 아래 방향 18 kN 집중하중 하나.',
    nodalBlurb: '내부 지점에 가한 20 kN 하중으로 반력과 처짐을 확인합니다.',
    temperatureBlurb: '단면 높이에 따른 온도차(상연이 하연보다 따뜻함)와 그로 인한 곡률.',
    promoTitle: '골조 해석을',
    promoAccent: '3D로.',
    promoSubtitle: '슬래브, 쉘, 강구조 검토까지 브라우저에서',
    promoCta: '무료로 사용해 보기',
  },
};

export const useDocsText = () => {
  const { localeIndex } = useData();
  const lang = computed<DocsLanguage>(() =>
    localeIndex.value in strings ? (localeIndex.value as DocsLanguage) : 'en'
  );

  /** A label the app itself shows, in the page's language. */
  const app = (key: string) => i18n.global.t(key, {}, { locale: APP_LOCALE[lang.value] });

  /** A sentence only the docs need. */
  const docs = (key: keyof DocsStrings) => strings[lang.value][key];

  /** The app's locale for this page, for `lang=` on links into the app. */
  const appLocale = computed(() => APP_LOCALE[lang.value]);

  /** Diagram values written the way the page's language writes numbers (12,5 in Czech, 12.5 in English). */
  const numberFormat = computed(
    () => new Intl.NumberFormat(lang.value === 'hi' ? 'en' : lang.value, { maximumFractionDigits: 3 })
  );

  return { lang, app, docs, appLocale, numberFormat };
};
