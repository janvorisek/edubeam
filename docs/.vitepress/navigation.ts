import type { DefaultTheme } from 'vitepress';

/**
 * Every language has the same pages, so the nav and the sidebar are built once from the page list
 * and only their labels differ. A page added here appears in every language at once.
 */
export interface NavigationLabels {
  nav: { guide: string; tutorials: string; examples: string; faq: string; openApp: string };
  groups: {
    gettingStarted: string;
    tutorials: string;
    modeling: string;
    results: string;
    filesSharing: string;
    reference: string;
    theory: string;
  };
  items: {
    introduction: string;
    quickStart: string;
    examples: string;
    threeHingedFrame: string;
    truss: string;
    userInterface: string;
    nodesSupports: string;
    elements: string;
    loads: string;
    unitsSettings: string;
    resultsDiagrams: string;
    verification: string;
    importExport: string;
    teaching: string;
    shortcuts: string;
    troubleshooting: string;
    faq: string;
    conventions: string;
    beam: string;
    trussElement: string;
  };
}

/** The app opens in the language of the docs; the docs say zh where the app says cn. */
const appUrl = (lang: string) => (lang === 'en' ? 'https://run.edubeam.app' : `https://run.edubeam.app/?lang=${lang}`);

/** `prefix` is '' for English, served from the root, and '/cs' and so on for the rest. */
export const navFor = (prefix: string, appLang: string, l: NavigationLabels): DefaultTheme.NavItem[] => [
  { text: l.nav.guide, link: `${prefix}/guide/introduction` },
  { text: l.nav.tutorials, link: `${prefix}/tutorials/three-hinged-frame` },
  { text: l.nav.examples, link: `${prefix}/examples/` },
  { text: l.nav.faq, link: `${prefix}/faq/` },
  { text: l.nav.openApp, link: appUrl(appLang) },
];

export const sidebarFor = (prefix: string, l: NavigationLabels): DefaultTheme.SidebarItem[] => {
  const item = (text: string, path: string) => ({ text, link: `${prefix}${path}` });

  return [
    {
      text: l.groups.gettingStarted,
      items: [
        item(l.items.introduction, '/guide/introduction'),
        item(l.items.quickStart, '/guide/quick-start'),
        item(l.items.examples, '/examples/'),
      ],
    },
    {
      text: l.groups.tutorials,
      items: [item(l.items.threeHingedFrame, '/tutorials/three-hinged-frame'), item(l.items.truss, '/tutorials/truss')],
    },
    {
      text: l.groups.modeling,
      items: [
        item(l.items.userInterface, '/essentials/user-interface'),
        item(l.items.nodesSupports, '/essentials/nodes-supports'),
        item(l.items.elements, '/essentials/elements'),
        item(l.items.loads, '/essentials/loads'),
        item(l.items.unitsSettings, '/essentials/units-settings'),
      ],
    },
    {
      text: l.groups.results,
      items: [item(l.items.resultsDiagrams, '/essentials/results'), item(l.items.verification, '/guide/verification')],
    },
    {
      text: l.groups.filesSharing,
      items: [item(l.items.importExport, '/essentials/import-export'), item(l.items.teaching, '/guide/teaching')],
    },
    {
      text: l.groups.reference,
      items: [
        item(l.items.shortcuts, '/reference/shortcuts'),
        item(l.items.troubleshooting, '/reference/troubleshooting'),
        item(l.items.faq, '/faq/'),
      ],
    },
    {
      text: l.groups.theory,
      items: [
        item(l.items.conventions, '/elements/conventions'),
        item(l.items.beam, '/elements/beam'),
        item(l.items.trussElement, '/elements/truss'),
      ],
      collapsed: true,
    },
  ];
};

export const english: NavigationLabels = {
  nav: { guide: 'Guide', tutorials: 'Tutorials', examples: 'Examples', faq: 'FAQ', openApp: 'Open the app' },
  groups: {
    gettingStarted: 'Getting started',
    tutorials: 'Tutorials',
    modeling: 'Modeling',
    results: 'Results',
    filesSharing: 'Files & sharing',
    reference: 'Reference',
    theory: 'Theory manual',
  },
  items: {
    introduction: 'Introduction',
    quickStart: 'Quick start (10 min)',
    examples: 'Examples',
    threeHingedFrame: 'Three-hinged frame',
    truss: 'Plane truss',
    userInterface: 'User interface',
    nodesSupports: 'Nodes & supports',
    elements: 'Elements, materials & sections',
    loads: 'Loads',
    unitsSettings: 'Units & settings',
    resultsDiagrams: 'Results & diagrams',
    verification: 'Checking results by hand',
    importExport: 'Import, export & sharing',
    teaching: 'Teaching with EduBeam',
    shortcuts: 'Keyboard, mouse & touch',
    troubleshooting: 'Troubleshooting',
    faq: 'FAQ',
    conventions: 'Coordinate system & sign conventions',
    beam: 'Beam',
    trussElement: 'Truss',
  },
};

export const cs: NavigationLabels = {
  nav: {
    guide: 'Příručka',
    tutorials: 'Návody',
    examples: 'Příklady',
    faq: 'FAQ',
    openApp: 'Otevřít aplikaci',
  },
  groups: {
    gettingStarted: 'Začínáme',
    tutorials: 'Návody',
    modeling: 'Modelování',
    results: 'Výsledky',
    filesSharing: 'Soubory a sdílení',
    reference: 'Reference',
    theory: 'Teoretický manuál',
  },
  items: {
    introduction: 'Úvod',
    quickStart: 'Rychlý start (10 min)',
    examples: 'Příklady',
    threeHingedFrame: 'Trojkloubový rám',
    truss: 'Rovinná příhradová konstrukce',
    userInterface: 'Uživatelské rozhraní',
    nodesSupports: 'Uzly a podpory',
    elements: 'Prvky, materiály a průřezy',
    loads: 'Zatížení',
    unitsSettings: 'Jednotky a nastavení',
    resultsDiagrams: 'Výsledky a průběhy',
    verification: 'Ověření výsledků ručně',
    importExport: 'Import, export a sdílení',
    teaching: 'Výuka s EduBeamem',
    shortcuts: 'Klávesnice, myš a dotyk',
    troubleshooting: 'Řešení problémů',
    faq: 'Často kladené otázky',
    conventions: 'Souřadný systém a znaménková konvence',
    beam: 'Prutový prvek (nosník)',
    trussElement: 'Příhradový prut',
  },
};

export const de: NavigationLabels = {
  nav: {
    guide: 'Anleitung',
    tutorials: 'Tutorials',
    examples: 'Beispiele',
    faq: 'FAQ',
    openApp: 'App öffnen',
  },
  groups: {
    gettingStarted: 'Erste Schritte',
    tutorials: 'Tutorials',
    modeling: 'Modellierung',
    results: 'Ergebnisse',
    filesSharing: 'Dateien & Teilen',
    reference: 'Referenz',
    theory: 'Theoriehandbuch',
  },
  items: {
    introduction: 'Einführung',
    quickStart: 'Schnellstart (10 min)',
    examples: 'Beispiele',
    threeHingedFrame: 'Dreigelenkrahmen',
    truss: 'Ebenes Fachwerk',
    userInterface: 'Benutzeroberfläche',
    nodesSupports: 'Knoten & Lager',
    elements: 'Elemente, Materialien & Querschnitte',
    loads: 'Lasten',
    unitsSettings: 'Einheiten & Einstellungen',
    resultsDiagrams: 'Ergebnisse & Diagramme',
    verification: 'Ergebnisse von Hand prüfen',
    importExport: 'Import, Export & Teilen',
    teaching: 'Lehren mit EduBeam',
    shortcuts: 'Tastatur, Maus & Touch',
    troubleshooting: 'Fehlerbehebung',
    faq: 'FAQ',
    conventions: 'Koordinatensystem & Vorzeichenkonventionen',
    beam: 'Balken',
    trussElement: 'Fachwerkstab',
  },
};

export const es: NavigationLabels = {
  nav: {
    guide: 'Guía',
    tutorials: 'Tutoriales',
    examples: 'Ejemplos',
    faq: 'Preguntas frecuentes',
    openApp: 'Abrir la aplicación',
  },
  groups: {
    gettingStarted: 'Primeros pasos',
    tutorials: 'Tutoriales',
    modeling: 'Modelado',
    results: 'Resultados',
    filesSharing: 'Archivos y compartir',
    reference: 'Referencia',
    theory: 'Manual teórico',
  },
  items: {
    introduction: 'Introducción',
    quickStart: 'Inicio rápido (10 min)',
    examples: 'Ejemplos',
    threeHingedFrame: 'Pórtico triarticulado',
    truss: 'Celosía plana',
    userInterface: 'Interfaz de usuario',
    nodesSupports: 'Nodos y apoyos',
    elements: 'Elementos, materiales y secciones',
    loads: 'Cargas',
    unitsSettings: 'Unidades y ajustes',
    resultsDiagrams: 'Resultados y diagramas',
    verification: 'Comprobar resultados a mano',
    importExport: 'Importar, exportar y compartir',
    teaching: 'Enseñar con EduBeam',
    shortcuts: 'Teclado, ratón y pantalla táctil',
    troubleshooting: 'Solución de problemas',
    faq: 'Preguntas frecuentes',
    conventions: 'Sistema de coordenadas y convenio de signos',
    beam: 'Viga',
    trussElement: 'Barra de celosía',
  },
};

export const fr: NavigationLabels = {
  nav: {
    guide: 'Guide',
    tutorials: 'Tutoriels',
    examples: 'Exemples',
    faq: 'FAQ',
    openApp: 'Ouvrir l’application',
  },
  groups: {
    gettingStarted: 'Premiers pas',
    tutorials: 'Tutoriels',
    modeling: 'Modélisation',
    results: 'Résultats',
    filesSharing: 'Fichiers et partage',
    reference: 'Référence',
    theory: 'Manuel théorique',
  },
  items: {
    introduction: 'Introduction',
    quickStart: 'Démarrage rapide (10 min)',
    examples: 'Exemples',
    threeHingedFrame: 'Portique à trois articulations',
    truss: 'Treillis plan',
    userInterface: 'Interface utilisateur',
    nodesSupports: 'Nœuds et appuis',
    elements: 'Éléments, matériaux et sections',
    loads: 'Charges',
    unitsSettings: 'Unités et paramètres',
    resultsDiagrams: 'Résultats et diagrammes',
    verification: 'Vérifier les résultats à la main',
    importExport: 'Import, export et partage',
    teaching: 'Enseigner avec EduBeam',
    shortcuts: 'Clavier, souris et tactile',
    troubleshooting: 'Dépannage',
    faq: 'FAQ',
    conventions: 'Repère et conventions de signe',
    beam: 'Poutre',
    trussElement: 'Treillis',
  },
};

export const hi: NavigationLabels = {
  nav: {
    guide: 'मार्गदर्शिका',
    tutorials: 'ट्यूटोरियल',
    examples: 'उदाहरण',
    faq: 'प्रश्नोत्तर',
    openApp: 'ऐप खोलें',
  },
  groups: {
    gettingStarted: 'शुरुआत',
    tutorials: 'ट्यूटोरियल',
    modeling: 'मॉडलिंग',
    results: 'परिणाम',
    filesSharing: 'फ़ाइलें और साझाकरण',
    reference: 'संदर्भ',
    theory: 'सैद्धांतिक मैनुअल',
  },
  items: {
    introduction: 'परिचय',
    quickStart: 'त्वरित शुरुआत (10 मिनट)',
    examples: 'उदाहरण',
    threeHingedFrame: 'त्रि-हिंज फ्रेम',
    truss: 'समतल ट्रस',
    userInterface: 'यूज़र इंटरफ़ेस',
    nodesSupports: 'नोड और आधार',
    elements: 'अवयव, सामग्री और अनुप्रस्थ काट',
    loads: 'भार',
    unitsSettings: 'इकाइयाँ और सेटिंग्स',
    resultsDiagrams: 'परिणाम और आरेख',
    verification: 'परिणामों की हाथ से जाँच',
    importExport: 'आयात, निर्यात और साझाकरण',
    teaching: 'EduBeam के साथ पढ़ाना',
    shortcuts: 'कीबोर्ड, माउस और टच',
    troubleshooting: 'समस्या निवारण',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    conventions: 'निर्देशांक तंत्र और चिह्न परिपाटी',
    beam: 'बीम',
    trussElement: 'ट्रस',
  },
};

export const pl: NavigationLabels = {
  nav: {
    guide: 'Przewodnik',
    tutorials: 'Samouczki',
    examples: 'Przykłady',
    faq: 'FAQ',
    openApp: 'Otwórz aplikację',
  },
  groups: {
    gettingStarted: 'Pierwsze kroki',
    tutorials: 'Samouczki',
    modeling: 'Modelowanie',
    results: 'Wyniki',
    filesSharing: 'Pliki i udostępnianie',
    reference: 'Informacje dodatkowe',
    theory: 'Podręcznik teoretyczny',
  },
  items: {
    introduction: 'Wprowadzenie',
    quickStart: 'Szybki start (10 min)',
    examples: 'Przykłady',
    threeHingedFrame: 'Rama trójprzegubowa',
    truss: 'Kratownica płaska',
    userInterface: 'Interfejs użytkownika',
    nodesSupports: 'Węzły i podpory',
    elements: 'Elementy, materiały i przekroje',
    loads: 'Obciążenia',
    unitsSettings: 'Jednostki i ustawienia',
    resultsDiagrams: 'Wyniki i wykresy',
    verification: 'Sprawdzanie wyników ręcznie',
    importExport: 'Import, eksport i udostępnianie',
    teaching: 'Nauczanie z EduBeam',
    shortcuts: 'Klawiatura, mysz i dotyk',
    troubleshooting: 'Rozwiązywanie problemów',
    faq: 'FAQ',
    conventions: 'Układ współrzędnych i konwencje znaków',
    beam: 'Belka',
    trussElement: 'Kratownica',
  },
};

export const pt: NavigationLabels = {
  nav: {
    guide: 'Guia',
    tutorials: 'Tutoriais',
    examples: 'Exemplos',
    faq: 'FAQ',
    openApp: 'Abrir o aplicativo',
  },
  groups: {
    gettingStarted: 'Primeiros passos',
    tutorials: 'Tutoriais',
    modeling: 'Modelagem',
    results: 'Resultados',
    filesSharing: 'Arquivos e compartilhamento',
    reference: 'Referência',
    theory: 'Manual teórico',
  },
  items: {
    introduction: 'Introdução',
    quickStart: 'Início rápido (10 min)',
    examples: 'Exemplos',
    threeHingedFrame: 'Pórtico triarticulado',
    truss: 'Treliça plana',
    userInterface: 'Interface do usuário',
    nodesSupports: 'Nós e apoios',
    elements: 'Elementos, materiais e seções',
    loads: 'Cargas',
    unitsSettings: 'Unidades e configurações',
    resultsDiagrams: 'Resultados e diagramas',
    verification: 'Conferir resultados à mão',
    importExport: 'Importar, exportar e compartilhar',
    teaching: 'Ensinar com o EduBeam',
    shortcuts: 'Teclado, mouse e toque',
    troubleshooting: 'Solução de problemas',
    faq: 'Perguntas frequentes',
    conventions: 'Sistema de coordenadas e convenções de sinais',
    beam: 'Viga',
    trussElement: 'Treliça',
  },
};

export const ru: NavigationLabels = {
  nav: {
    guide: 'Руководство',
    tutorials: 'Учебные примеры',
    examples: 'Примеры',
    faq: 'FAQ',
    openApp: 'Открыть приложение',
  },
  groups: {
    gettingStarted: 'Начало работы',
    tutorials: 'Учебные примеры',
    modeling: 'Моделирование',
    results: 'Результаты',
    filesSharing: 'Файлы и обмен',
    reference: 'Справочник',
    theory: 'Теоретическое руководство',
  },
  items: {
    introduction: 'Введение',
    quickStart: 'Быстрый старт (10 мин)',
    examples: 'Примеры',
    threeHingedFrame: 'Трёхшарнирная рама',
    truss: 'Плоская ферма',
    userInterface: 'Интерфейс',
    nodesSupports: 'Узлы и опоры',
    elements: 'Элементы, материалы и сечения',
    loads: 'Нагрузки',
    unitsSettings: 'Единицы и настройки',
    resultsDiagrams: 'Результаты и эпюры',
    verification: 'Проверка результатов вручную',
    importExport: 'Импорт, экспорт и обмен',
    teaching: 'Преподавание с EduBeam',
    shortcuts: 'Клавиатура, мышь и сенсорный экран',
    troubleshooting: 'Устранение неполадок',
    faq: 'FAQ',
    conventions: 'Система координат и правила знаков',
    beam: 'Балка',
    trussElement: 'Ферма',
  },
};

export const uk: NavigationLabels = {
  nav: {
    guide: 'Посібник',
    tutorials: 'Покрокові приклади',
    examples: 'Приклади',
    faq: 'FAQ',
    openApp: 'Відкрити застосунок',
  },
  groups: {
    gettingStarted: 'Початок роботи',
    tutorials: 'Покрокові приклади',
    modeling: 'Моделювання',
    results: 'Результати',
    filesSharing: 'Файли та обмін',
    reference: 'Довідник',
    theory: 'Теоретичний посібник',
  },
  items: {
    introduction: 'Вступ',
    quickStart: 'Швидкий старт (10 хв)',
    examples: 'Приклади',
    threeHingedFrame: 'Тришарнірна рама',
    truss: 'Плоска ферма',
    userInterface: 'Інтерфейс користувача',
    nodesSupports: 'Вузли та опори',
    elements: 'Елементи, матеріали та перерізи',
    loads: 'Навантаження',
    unitsSettings: 'Одиниці та налаштування',
    resultsDiagrams: 'Результати та епюри',
    verification: 'Перевірка результатів вручну',
    importExport: 'Імпорт, експорт та обмін',
    teaching: 'Навчання з EduBeam',
    shortcuts: 'Клавіатура, миша та сенсорний екран',
    troubleshooting: 'Усунення несправностей',
    faq: 'Часті запитання',
    conventions: 'Система координат і правила знаків',
    beam: 'Балка',
    trussElement: 'Ферма',
  },
};

export const zh: NavigationLabels = {
  nav: {
    guide: '指南',
    tutorials: '教程',
    examples: '示例',
    faq: '常见问题',
    openApp: '打开应用',
  },
  groups: {
    gettingStarted: '入门',
    tutorials: '教程',
    modeling: '建模',
    results: '结果',
    filesSharing: '文件与分享',
    reference: '参考',
    theory: '理论手册',
  },
  items: {
    introduction: '简介',
    quickStart: '快速入门（10 分钟）',
    examples: '示例',
    threeHingedFrame: '三铰刚架',
    truss: '平面桁架',
    userInterface: '用户界面',
    nodesSupports: '节点与支座',
    elements: '单元、材料与截面',
    loads: '荷载',
    unitsSettings: '单位与设置',
    resultsDiagrams: '结果与内力图',
    verification: '手算校核结果',
    importExport: '导入、导出与分享',
    teaching: '用 EduBeam 教学',
    shortcuts: '键盘、鼠标与触控',
    troubleshooting: '疑难解答',
    faq: '常见问题',
    conventions: '坐标系与符号约定',
    beam: '梁单元',
    trussElement: '桁架单元',
  },
};
