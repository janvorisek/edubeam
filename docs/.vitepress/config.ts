import { defineConfig } from 'vitepress';
import markdownItKatex from 'markdown-it-katex';
import implicitFigures from 'markdown-it-implicit-figures';
import path from 'path';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

const customElements = [
  'math',
  'maction',
  'maligngroup',
  'malignmark',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mi',
  'mlongdiv',
  'mmultiscripts',
  'mn',
  'mo',
  'mover',
  'mpadded',
  'mphantom',
  'mroot',
  'mrow',
  'ms',
  'mscarries',
  'mscarry',
  'mscarries',
  'msgroup',
  'mstack',
  'mlongdiv',
  'msline',
  'mstack',
  'mspace',
  'msqrt',
  'msrow',
  'mstack',
  'mstack',
  'mstyle',
  'msub',
  'msup',
  'msubsup',
  'mtable',
  'mtd',
  'mtext',
  'mtr',
  'munder',
  'munderover',
  'semantics',
  'math',
  'mi',
  'mn',
  'mo',
  'ms',
  'mspace',
  'mtext',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mpadded',
  'mphantom',
  'mroot',
  'mrow',
  'msqrt',
  'mstyle',
  'mmultiscripts',
  'mover',
  'mprescripts',
  'msub',
  'msubsup',
  'msup',
  'munder',
  'munderover',
  'none',
  'maligngroup',
  'malignmark',
  'mtable',
  'mtd',
  'mtr',
  'mlongdiv',
  'mscarries',
  'mscarry',
  'msgroup',
  'msline',
  'msrow',
  'mstack',
  'maction',
  'semantics',
  'annotation',
  'annotation-xml',
];

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'EduBeam',
  description: 'Learn, Contribute, Excel in Structural Analysis!',
  sitemap: {
    hostname: 'https://www.edubeam.app',
  },
  //cleanUrls: true,
  lastUpdated: true,
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'FAQ', link: '/faq/' },
          { text: 'Examples', link: '/examples/' },
        ],
        sidebar: [
          {
            text: 'Getting started',
            items: [
              { text: 'Introduction', link: '/guide/introduction' },
              { text: 'Quick start (10 min)', link: '/guide/quick-start' },
              { text: 'Examples', link: '/examples/' },
            ],
          },
          {
            text: 'Modeling',
            items: [
              { text: 'User interface', link: '/essentials/user-interface' },
              { text: 'Nodes & supports', link: '/essentials/nodes-supports' },
              { text: 'Elements, materials & sections', link: '/essentials/elements' },
              { text: 'Loads', link: '/essentials/loads' },
              { text: 'Units & settings', link: '/essentials/units-settings' },
            ],
          },
          {
            text: 'Results',
            items: [
              { text: 'Results & diagrams', link: '/essentials/results' },
              { text: 'Checking results by hand', link: '/guide/verification' },
            ],
          },
          {
            text: 'Files & sharing',
            items: [{ text: 'Import, export & sharing', link: '/essentials/import-export' }],
          },
          {
            text: 'Reference',
            items: [
              { text: 'Keyboard & mouse', link: '/reference/shortcuts' },
              { text: 'Troubleshooting', link: '/reference/troubleshooting' },
              { text: 'FAQ', link: '/faq/' },
            ],
          },
          {
            text: 'Theory manual',
            items: [
              { text: 'Coordinate system & sign conventions', link: '/elements/conventions' },
              { text: 'Beam', link: '/elements/beam' },
              { text: 'Truss', link: '/elements/truss' },
            ],
            collapsed: true,
          },
        ],
      },
    },
    de: {
      label: 'Deutsch',
      lang: 'de',
      description: 'Baustatik online – ebene Balken, Rahmen und Fachwerke im Browser.',
      themeConfig: {
        nav: [
          { text: 'Startseite', link: '/de/' },
          { text: 'FAQ', link: '/de/faq/' },
          { text: 'Beispiele', link: '/de/examples/' },
        ],
        outline: { label: 'Auf dieser Seite' },
        docFooter: { prev: 'Vorherige Seite', next: 'Nächste Seite' },
        lastUpdated: { text: 'Zuletzt aktualisiert' },
        sidebar: [
          {
            text: 'Erste Schritte',
            items: [
              { text: 'Einführung', link: '/de/guide/introduction' },
              { text: 'Schnellstart (10 min)', link: '/de/guide/quick-start' },
              { text: 'Beispiele', link: '/de/examples/' },
            ],
          },
          {
            text: 'Modellierung',
            items: [
              { text: 'Benutzeroberfläche', link: '/de/essentials/user-interface' },
              { text: 'Knoten & Lager', link: '/de/essentials/nodes-supports' },
              { text: 'Elemente, Materialien & Querschnitte', link: '/de/essentials/elements' },
              { text: 'Lasten', link: '/de/essentials/loads' },
              { text: 'Einheiten & Einstellungen', link: '/de/essentials/units-settings' },
            ],
          },
          {
            text: 'Ergebnisse',
            items: [
              { text: 'Ergebnisse & Diagramme', link: '/de/essentials/results' },
              { text: 'Ergebnisse von Hand prüfen', link: '/de/guide/verification' },
            ],
          },
          {
            text: 'Dateien & Teilen',
            items: [{ text: 'Import, Export & Teilen', link: '/de/essentials/import-export' }],
          },
          {
            text: 'Referenz',
            items: [
              { text: 'Tastatur & Maus', link: '/de/reference/shortcuts' },
              { text: 'Fehlerbehebung', link: '/de/reference/troubleshooting' },
              { text: 'FAQ', link: '/de/faq/' },
            ],
          },
          {
            text: 'Theoriehandbuch',
            items: [
              { text: 'Koordinatensystem & Vorzeichenkonvention', link: '/de/elements/conventions' },
              { text: 'Balkenelement', link: '/de/elements/beam' },
              { text: 'Fachwerkstab', link: '/de/elements/truss' },
            ],
            collapsed: true,
          },
        ],
      },
    },
    es: {
      label: 'Español',
      lang: 'es',
      description: 'Análisis de estructuras en línea: vigas, pórticos y celosías planos en el navegador.',
      themeConfig: {
        nav: [
          { text: 'Inicio', link: '/es/' },
          { text: 'FAQ', link: '/es/faq/' },
          { text: 'Ejemplos', link: '/es/examples/' },
        ],
        outline: { label: 'En esta página' },
        docFooter: { prev: 'Página anterior', next: 'Página siguiente' },
        lastUpdated: { text: 'Última actualización' },
        sidebar: [
          {
            text: 'Primeros pasos',
            items: [
              { text: 'Introducción', link: '/es/guide/introduction' },
              { text: 'Inicio rápido (10 min)', link: '/es/guide/quick-start' },
              { text: 'Ejemplos', link: '/es/examples/' },
            ],
          },
          {
            text: 'Modelado',
            items: [
              { text: 'Interfaz de usuario', link: '/es/essentials/user-interface' },
              { text: 'Nodos y apoyos', link: '/es/essentials/nodes-supports' },
              { text: 'Elementos, materiales y secciones', link: '/es/essentials/elements' },
              { text: 'Cargas', link: '/es/essentials/loads' },
              { text: 'Unidades y ajustes', link: '/es/essentials/units-settings' },
            ],
          },
          {
            text: 'Resultados',
            items: [
              { text: 'Resultados y diagramas', link: '/es/essentials/results' },
              { text: 'Comprobar resultados a mano', link: '/es/guide/verification' },
            ],
          },
          {
            text: 'Archivos y compartir',
            items: [{ text: 'Importar, exportar y compartir', link: '/es/essentials/import-export' }],
          },
          {
            text: 'Referencia',
            items: [
              { text: 'Teclado y ratón', link: '/es/reference/shortcuts' },
              { text: 'Solución de problemas', link: '/es/reference/troubleshooting' },
              { text: 'FAQ', link: '/es/faq/' },
            ],
          },
          {
            text: 'Manual teórico',
            items: [
              { text: 'Sistema de coordenadas y convenio de signos', link: '/es/elements/conventions' },
              { text: 'Elemento viga', link: '/es/elements/beam' },
              { text: 'Barra de celosía', link: '/es/elements/truss' },
            ],
            collapsed: true,
          },
        ],
      },
    },
    pt: {
      label: 'Português',
      lang: 'pt-BR',
      description: 'Análise estrutural online: vigas, pórticos e treliças planos no navegador.',
      themeConfig: {
        nav: [
          { text: 'Início', link: '/pt/' },
          { text: 'FAQ', link: '/pt/faq/' },
          { text: 'Exemplos', link: '/pt/examples/' },
        ],
        outline: { label: 'Nesta página' },
        docFooter: { prev: 'Página anterior', next: 'Próxima página' },
        lastUpdated: { text: 'Última atualização' },
        sidebar: [
          {
            text: 'Primeiros passos',
            items: [
              { text: 'Introdução', link: '/pt/guide/introduction' },
              { text: 'Início rápido (10 min)', link: '/pt/guide/quick-start' },
              { text: 'Exemplos', link: '/pt/examples/' },
            ],
          },
          {
            text: 'Modelagem',
            items: [
              { text: 'Interface do usuário', link: '/pt/essentials/user-interface' },
              { text: 'Nós e apoios', link: '/pt/essentials/nodes-supports' },
              { text: 'Elementos, materiais e seções', link: '/pt/essentials/elements' },
              { text: 'Cargas', link: '/pt/essentials/loads' },
              { text: 'Unidades e configurações', link: '/pt/essentials/units-settings' },
            ],
          },
          {
            text: 'Resultados',
            items: [
              { text: 'Resultados e diagramas', link: '/pt/essentials/results' },
              { text: 'Conferir resultados à mão', link: '/pt/guide/verification' },
            ],
          },
          {
            text: 'Arquivos e compartilhamento',
            items: [{ text: 'Importar, exportar e compartilhar', link: '/pt/essentials/import-export' }],
          },
          {
            text: 'Referência',
            items: [
              { text: 'Teclado e mouse', link: '/pt/reference/shortcuts' },
              { text: 'Solução de problemas', link: '/pt/reference/troubleshooting' },
              { text: 'FAQ', link: '/pt/faq/' },
            ],
          },
          {
            text: 'Manual teórico',
            items: [
              { text: 'Sistema de coordenadas e convenção de sinais', link: '/pt/elements/conventions' },
              { text: 'Elemento de viga', link: '/pt/elements/beam' },
              { text: 'Barra de treliça', link: '/pt/elements/truss' },
            ],
            collapsed: true,
          },
        ],
      },
    },
    fr: {
      label: 'Français',
      lang: 'fr',
      description: 'Calcul des structures en ligne : poutres, portiques et treillis plans dans le navigateur.',
      themeConfig: {
        nav: [
          { text: 'Accueil', link: '/fr/' },
          { text: 'FAQ', link: '/fr/faq/' },
          { text: 'Exemples', link: '/fr/examples/' },
        ],
        outline: { label: 'Sur cette page' },
        docFooter: { prev: 'Page précédente', next: 'Page suivante' },
        lastUpdated: { text: 'Dernière mise à jour' },
        sidebar: [
          {
            text: 'Premiers pas',
            items: [
              { text: 'Introduction', link: '/fr/guide/introduction' },
              { text: 'Démarrage rapide (10 min)', link: '/fr/guide/quick-start' },
              { text: 'Exemples', link: '/fr/examples/' },
            ],
          },
          {
            text: 'Modélisation',
            items: [
              { text: 'Interface utilisateur', link: '/fr/essentials/user-interface' },
              { text: 'Nœuds et appuis', link: '/fr/essentials/nodes-supports' },
              { text: 'Éléments, matériaux et sections', link: '/fr/essentials/elements' },
              { text: 'Charges', link: '/fr/essentials/loads' },
              { text: 'Unités et paramètres', link: '/fr/essentials/units-settings' },
            ],
          },
          {
            text: 'Résultats',
            items: [
              { text: 'Résultats et diagrammes', link: '/fr/essentials/results' },
              { text: 'Vérifier les résultats à la main', link: '/fr/guide/verification' },
            ],
          },
          {
            text: 'Fichiers et partage',
            items: [{ text: 'Import, export et partage', link: '/fr/essentials/import-export' }],
          },
          {
            text: 'Référence',
            items: [
              { text: 'Clavier et souris', link: '/fr/reference/shortcuts' },
              { text: 'Dépannage', link: '/fr/reference/troubleshooting' },
              { text: 'FAQ', link: '/fr/faq/' },
            ],
          },
          {
            text: 'Manuel théorique',
            items: [
              { text: 'Repère et conventions de signe', link: '/fr/elements/conventions' },
              { text: 'Élément poutre', link: '/fr/elements/beam' },
              { text: 'Barre de treillis', link: '/fr/elements/truss' },
            ],
            collapsed: true,
          },
        ],
      },
    },
    cs: {
      label: 'Čeština',
      lang: 'cs',
      description: 'Stavební mechanika online – rovinné nosníky, rámy a příhradové konstrukce v prohlížeči.',
      themeConfig: {
        nav: [
          { text: 'Domů', link: '/cs/' },
          { text: 'FAQ', link: '/cs/faq/' },
          { text: 'Příklady', link: '/cs/examples/' },
        ],
        outline: { label: 'Na této stránce' },
        docFooter: { prev: 'Předchozí', next: 'Další' },
        lastUpdated: { text: 'Naposledy upraveno' },
        sidebar: [
          {
            text: 'Začínáme',
            items: [
              { text: 'Úvod', link: '/cs/guide/introduction' },
              { text: 'Rychlý start (10 min)', link: '/cs/guide/quick-start' },
              { text: 'Příklady', link: '/cs/examples/' },
            ],
          },
          {
            text: 'Modelování',
            items: [
              { text: 'Uživatelské rozhraní', link: '/cs/essentials/user-interface' },
              { text: 'Uzly a podpory', link: '/cs/essentials/nodes-supports' },
              { text: 'Prvky, materiály a průřezy', link: '/cs/essentials/elements' },
              { text: 'Zatížení', link: '/cs/essentials/loads' },
              { text: 'Jednotky a nastavení', link: '/cs/essentials/units-settings' },
            ],
          },
          {
            text: 'Výsledky',
            items: [
              { text: 'Výsledky a průběhy', link: '/cs/essentials/results' },
              { text: 'Ověření výsledků ručně', link: '/cs/guide/verification' },
            ],
          },
          {
            text: 'Soubory a sdílení',
            items: [{ text: 'Import, export a sdílení', link: '/cs/essentials/import-export' }],
          },
          {
            text: 'Reference',
            items: [
              { text: 'Klávesnice a myš', link: '/cs/reference/shortcuts' },
              { text: 'Řešení problémů', link: '/cs/reference/troubleshooting' },
              { text: 'FAQ', link: '/cs/faq/' },
            ],
          },
          {
            text: 'Teoretický manuál',
            items: [
              { text: 'Souřadný systém a znaménková konvence', link: '/cs/elements/conventions' },
              { text: 'Prutový prvek (nosník)', link: '/cs/elements/beam' },
              { text: 'Příhradový prut', link: '/cs/elements/truss' },
            ],
            collapsed: true,
          },
        ],
      },
    },
    zh: {
      label: '中文',
      lang: 'zh',
      description: '免费的在线平面结构分析工具——在浏览器中即时求解梁、刚架和桁架。',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: 'FAQ', link: '/zh/faq/' },
          { text: '示例', link: '/zh/examples/' },
        ],
        outline: { label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdated: { text: '最后更新' },
        sidebar: [
          { text: '入门', items: [
            { text: '简介', link: '/zh/guide/introduction' },
            { text: '快速入门（10 分钟）', link: '/zh/guide/quick-start' },
            { text: '示例', link: '/zh/examples/' } ] },
          { text: '建模', items: [
            { text: '用户界面', link: '/zh/essentials/user-interface' },
            { text: '节点与支座', link: '/zh/essentials/nodes-supports' },
            { text: '单元、材料与截面', link: '/zh/essentials/elements' },
            { text: '荷载', link: '/zh/essentials/loads' },
            { text: '单位与设置', link: '/zh/essentials/units-settings' } ] },
          { text: '结果', items: [
            { text: '结果与内力图', link: '/zh/essentials/results' },
            { text: '手算校核', link: '/zh/guide/verification' } ] },
          { text: '文件与分享', items: [
            { text: '导入、导出与分享', link: '/zh/essentials/import-export' } ] },
          { text: '参考', items: [
            { text: '键盘与鼠标', link: '/zh/reference/shortcuts' },
            { text: '故障排除', link: '/zh/reference/troubleshooting' },
            { text: 'FAQ', link: '/zh/faq/' } ] },
          { text: '理论手册', collapsed: true, items: [
            { text: '坐标系与符号约定', link: '/zh/elements/conventions' },
            { text: '梁单元', link: '/zh/elements/beam' },
            { text: '桁架单元', link: '/zh/elements/truss' } ] },
        ],
      },
    },
    hi: {
      label: 'हिन्दी',
      lang: 'hi',
      description: 'ब्राउज़र में निःशुल्क 2D संरचनात्मक विश्लेषण – बीम, फ्रेम और ट्रस के लिए तुरंत FEM परिणाम',
      themeConfig: {
        nav: [
          { text: 'मुख्य पृष्ठ', link: '/hi/' },
          { text: 'FAQ', link: '/hi/faq/' },
          { text: 'उदाहरण', link: '/hi/examples/' },
        ],
        outline: { label: 'इस पृष्ठ पर' },
        docFooter: { prev: 'पिछला पृष्ठ', next: 'अगला पृष्ठ' },
        lastUpdated: { text: 'अंतिम अद्यतन' },
        sidebar: [
          { text: 'शुरुआत', items: [
            { text: 'परिचय', link: '/hi/guide/introduction' },
            { text: 'त्वरित शुरुआत (10 मिनट)', link: '/hi/guide/quick-start' },
            { text: 'उदाहरण', link: '/hi/examples/' } ] },
          { text: 'मॉडलिंग', items: [
            { text: 'यूज़र इंटरफ़ेस', link: '/hi/essentials/user-interface' },
            { text: 'नोड और आधार', link: '/hi/essentials/nodes-supports' },
            { text: 'अवयव, सामग्री और अनुप्रस्थ काट', link: '/hi/essentials/elements' },
            { text: 'भार', link: '/hi/essentials/loads' },
            { text: 'इकाइयाँ और सेटिंग्स', link: '/hi/essentials/units-settings' } ] },
          { text: 'परिणाम', items: [
            { text: 'परिणाम और आरेख', link: '/hi/essentials/results' },
            { text: 'परिणामों की हाथ से जाँच', link: '/hi/guide/verification' } ] },
          { text: 'फाइलें और साझाकरण', items: [
            { text: 'आयात, निर्यात और साझाकरण', link: '/hi/essentials/import-export' } ] },
          { text: 'संदर्भ', items: [
            { text: 'कीबोर्ड और माउस', link: '/hi/reference/shortcuts' },
            { text: 'समस्या निवारण', link: '/hi/reference/troubleshooting' },
            { text: 'FAQ', link: '/hi/faq/' } ] },
          { text: 'सिद्धांत पुस्तिका', collapsed: true, items: [
            { text: 'निर्देशांक तंत्र और चिह्न परिपाटी', link: '/hi/elements/conventions' },
            { text: 'बीम', link: '/hi/elements/beam' },
            { text: 'ट्रस', link: '/hi/elements/truss' } ] },
        ],
      },
    },
    pl: {
      label: 'Polski',
      lang: 'pl',
      description: 'Darmowa analiza statyczna belek, ram i kratownic w przeglądarce — bez instalacji i bez konta.',
      themeConfig: {
        nav: [
          { text: 'Strona główna', link: '/pl/' },
          { text: 'FAQ', link: '/pl/faq/' },
          { text: 'Przykłady', link: '/pl/examples/' },
        ],
        outline: { label: 'Na tej stronie' },
        docFooter: { prev: 'Poprzednia strona', next: 'Następna strona' },
        lastUpdated: { text: 'Ostatnia aktualizacja' },
        sidebar: [
          { text: 'Pierwsze kroki', items: [
            { text: 'Wprowadzenie', link: '/pl/guide/introduction' },
            { text: 'Szybki start (10 min)', link: '/pl/guide/quick-start' },
            { text: 'Przykłady', link: '/pl/examples/' } ] },
          { text: 'Modelowanie', items: [
            { text: 'Interfejs użytkownika', link: '/pl/essentials/user-interface' },
            { text: 'Węzły i podpory', link: '/pl/essentials/nodes-supports' },
            { text: 'Elementy, materiały i przekroje', link: '/pl/essentials/elements' },
            { text: 'Obciążenia', link: '/pl/essentials/loads' },
            { text: 'Jednostki i ustawienia', link: '/pl/essentials/units-settings' } ] },
          { text: 'Wyniki', items: [
            { text: 'Wyniki i wykresy', link: '/pl/essentials/results' },
            { text: 'Sprawdzanie wyników ręcznie', link: '/pl/guide/verification' } ] },
          { text: 'Pliki i udostępnianie', items: [
            { text: 'Import, eksport i udostępnianie', link: '/pl/essentials/import-export' } ] },
          { text: 'Odniesienie', items: [
            { text: 'Klawiatura i mysz', link: '/pl/reference/shortcuts' },
            { text: 'Rozwiązywanie problemów', link: '/pl/reference/troubleshooting' },
            { text: 'FAQ', link: '/pl/faq/' } ] },
          { text: 'Podręcznik teoretyczny', collapsed: true, items: [
            { text: 'Układ współrzędnych i konwencje znaków', link: '/pl/elements/conventions' },
            { text: 'Belka', link: '/pl/elements/beam' },
            { text: 'Kratownica', link: '/pl/elements/truss' } ] },
        ],
      },
    },
    uk: {
      label: 'Українська',
      lang: 'uk',
      description: 'Безкоштовний розрахунок плоских балок, рам і ферм онлайн — миттєві епюри просто у браузері.',
      themeConfig: {
        nav: [
          { text: 'Головна', link: '/uk/' },
          { text: 'FAQ', link: '/uk/faq/' },
          { text: 'Приклади', link: '/uk/examples/' },
        ],
        outline: { label: 'На цій сторінці' },
        docFooter: { prev: 'Попередня сторінка', next: 'Наступна сторінка' },
        lastUpdated: { text: 'Останнє оновлення' },
        sidebar: [
          { text: 'Початок роботи', items: [
            { text: 'Вступ', link: '/uk/guide/introduction' },
            { text: 'Швидкий старт (10 хв)', link: '/uk/guide/quick-start' },
            { text: 'Приклади', link: '/uk/examples/' } ] },
          { text: 'Моделювання', items: [
            { text: 'Інтерфейс користувача', link: '/uk/essentials/user-interface' },
            { text: 'Вузли та опори', link: '/uk/essentials/nodes-supports' },
            { text: 'Елементи, матеріали та перерізи', link: '/uk/essentials/elements' },
            { text: 'Навантаження', link: '/uk/essentials/loads' },
            { text: 'Одиниці та налаштування', link: '/uk/essentials/units-settings' } ] },
          { text: 'Результати', items: [
            { text: 'Результати та епюри', link: '/uk/essentials/results' },
            { text: 'Перевірка результатів вручну', link: '/uk/guide/verification' } ] },
          { text: 'Файли та обмін', items: [
            { text: 'Імпорт, експорт та обмін', link: '/uk/essentials/import-export' } ] },
          { text: 'Довідник', items: [
            { text: 'Клавіатура та миша', link: '/uk/reference/shortcuts' },
            { text: 'Усунення проблем', link: '/uk/reference/troubleshooting' },
            { text: 'FAQ', link: '/uk/faq/' } ] },
          { text: 'Теоретичний посібник', collapsed: true, items: [
            { text: 'Система координат і правила знаків', link: '/uk/elements/conventions' },
            { text: 'Балка', link: '/uk/elements/beam' },
            { text: 'Ферма', link: '/uk/elements/truss' } ] },
        ],
      },
    },
    ru: {
      label: 'Русский',
      lang: 'ru',
      description: 'Бесплатный онлайн-расчёт балок, рам и ферм — эпюры внутренних усилий и прогибы прямо в браузере.',
      themeConfig: {
        nav: [
          { text: 'Главная', link: '/ru/' },
          { text: 'FAQ', link: '/ru/faq/' },
          { text: 'Примеры', link: '/ru/examples/' },
        ],
        outline: { label: 'На этой странице' },
        docFooter: { prev: 'Предыдущая страница', next: 'Следующая страница' },
        lastUpdated: { text: 'Последнее обновление' },
        sidebar: [
          { text: 'Начало работы', items: [
            { text: 'Введение', link: '/ru/guide/introduction' },
            { text: 'Быстрый старт (10 минут)', link: '/ru/guide/quick-start' },
            { text: 'Примеры', link: '/ru/examples/' } ] },
          { text: 'Моделирование', items: [
            { text: 'Интерфейс', link: '/ru/essentials/user-interface' },
            { text: 'Узлы и опоры', link: '/ru/essentials/nodes-supports' },
            { text: 'Элементы, материалы и сечения', link: '/ru/essentials/elements' },
            { text: 'Нагрузки', link: '/ru/essentials/loads' },
            { text: 'Единицы и настройки', link: '/ru/essentials/units-settings' } ] },
          { text: 'Результаты', items: [
            { text: 'Результаты и эпюры', link: '/ru/essentials/results' },
            { text: 'Проверка результатов вручную', link: '/ru/guide/verification' } ] },
          { text: 'Файлы и обмен', items: [
            { text: 'Импорт, экспорт и обмен', link: '/ru/essentials/import-export' } ] },
          { text: 'Справочник', items: [
            { text: 'Клавиатура и мышь', link: '/ru/reference/shortcuts' },
            { text: 'Решение проблем', link: '/ru/reference/troubleshooting' },
            { text: 'FAQ', link: '/ru/faq/' } ] },
          { text: 'Теоретическое руководство', collapsed: true, items: [
            { text: 'Система координат и правила знаков', link: '/ru/elements/conventions' },
            { text: 'Балка', link: '/ru/elements/beam' },
            { text: 'Ферма', link: '/ru/elements/truss' } ] },
        ],
      },
    },
  },
  themeConfig: {
    outline: 'deep',
    search: {
      provider: 'local',
      options: {
        locales: {
          cs: {
            translations: {
              button: {
                buttonText: 'Vyhledat v dokumentaci',
                buttonAriaLabel: 'Vyhledat v dokumentaci',
              },
              modal: {
                noResultsText: 'Nenalezeny žádné výsledky pro',
                resetButtonTitle: 'Vymazat vyhledávací podmínky',
                footer: {
                  selectText: 'Vybrat',
                  navigateText: 'Přepnout',
                  closeText: 'Zavřít',
                },
              },
            },
          },
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
          hi: {
            translations: {
              button: {
                buttonText: 'दस्तावेज़ खोजें',
                buttonAriaLabel: 'दस्तावेज़ खोजें',
              },
              modal: {
                noResultsText: 'कोई परिणाम नहीं मिला',
                resetButtonTitle: 'खोज शर्तें साफ़ करें',
                footer: {
                  selectText: 'चुनें',
                  navigateText: 'स्विच करें',
                  closeText: 'बंद करें',
                },
              },
            },
          },
          pt: {
            translations: {
              button: {
                buttonText: 'Pesquisar na documentação',
                buttonAriaLabel: 'Pesquisar na documentação',
              },
              modal: {
                noResultsText: 'Nenhum resultado encontrado para',
                resetButtonTitle: 'Limpar pesquisa',
                footer: {
                  selectText: 'Selecionar',
                  navigateText: 'Navegar',
                  closeText: 'Fechar',
                },
              },
            },
          },
        },
        pl: {
          translations: {
            button: {
              buttonText: 'Szukaj w dokumentacji',
              buttonAriaLabel: 'Szukaj w dokumentacji',
            },
            modal: {
              noResultsText: 'Brak wyników dla zapytania',
              resetButtonTitle: 'Wyczyść zapytanie',
              footer: {
                selectText: 'Wybierz',
                navigateText: 'Nawiguj',
                closeText: 'Zamknij',
              },
            },
          },
        },
        uk: {
          translations: {
            button: {
              buttonText: 'Пошук у документації',
              buttonAriaLabel: 'Пошук у документації',
            },
            modal: {
              noResultsText: 'Нічого не знайдено за запитом',
              resetButtonTitle: 'Очистити запит',
              footer: {
                selectText: 'Обрати',
                navigateText: 'Перейти',
                closeText: 'Закрити',
              },
            },
          },
        },
        ru: {
          translations: {
            button: {
              buttonText: 'Поиск по документации',
              buttonAriaLabel: 'Поиск по документации',
            },
            modal: {
              noResultsText: 'Ничего не найдено по запросу',
              resetButtonTitle: 'Очистить запрос',
              footer: {
                selectText: 'Выбрать',
                navigateText: 'Перейти',
                closeText: 'Закрыть',
              },
            },
          },
        },
      },
    },
    editLink: {
      pattern: 'https://github.com/janvorisek/edubeam/edit/main/docs/:path',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/janvorisek/edubeam' },
      { icon: 'twitter', link: 'https://twitter.com/EdubeamApp' },
    ],
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    [
      'script',
      {
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=G-FGX9PYDV0G',
      },
    ],
    [
      'script',
      {},
      "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-FGX9PYDV0G');",
    ],
    [
      'script',
      {
        async: '',
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3761845630657739',
        crossorigin: 'anonymous',
      },
    ],
  ],
  markdown: {
    config: (md) => {
      md.use(markdownItKatex);
      md.use(implicitFigures, {
        figcaption: true,
        copyAttrs: '^class$',
      });
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag),
      },
    },
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../../src'),
      },
    },
    plugins: [
      VueI18nPlugin({
        include: path.resolve(__dirname, '../../src/locales/**'),
        runtimeOnly: false,
        strictMessage: false,
      }),
    ],
  },
});
