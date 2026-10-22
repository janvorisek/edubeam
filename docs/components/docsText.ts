import { computed } from 'vue';
import { useData } from 'vitepress';
import { i18n } from '../../src/plugins/i18n';

/**
 * Text for the interactive components on the docs pages, in the language of the page.
 *
 * Whatever the app already says (load types, quantities, example titles) comes from the app's own
 * locale files, so the two never disagree. Only sentences the app has no use for are kept here.
 */
type DocsLanguage = 'en' | 'cs' | 'de' | 'es' | 'fr' | 'hi' | 'pl' | 'pt' | 'ru' | 'uk' | 'zh';

/** The app's locale for each docs language; there is no Hindi app, and the app says cn for zh. */
const APP_LOCALE: Record<DocsLanguage, string> = {
  en: 'en',
  cs: 'cs',
  de: 'de',
  es: 'es',
  fr: 'fr',
  hi: 'en',
  pl: 'pl',
  pt: 'pt',
  ru: 'ru',
  uk: 'uk',
  zh: 'cn',
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
    udlBlurb: 'कीलकित और रोलर आधार पर 12 kN/m भार: अपरूपण बल और बंकन आघूर्ण के पारंपरिक आरेख।',
    trapezoidalBlurb: 'दाएँ स्पैन पर 4 से 14 kN/m तक बढ़ता हुआ भार।',
    concentratedBlurb: 'स्पैन के मध्य में नीचे की ओर 18 kN का एकल भार, बिना अतिरिक्त नोड के।',
    nodalBlurb: 'प्रतिक्रियाओं और विक्षेपों की जाँच के लिए आंतरिक आधार पर 20 kN भार।',
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
