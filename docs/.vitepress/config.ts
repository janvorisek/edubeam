import { defineConfig } from 'vitepress';
import markdownItKatex from 'markdown-it-katex';
import implicitFigures from 'markdown-it-implicit-figures';
import path from 'path';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { cs, de, english, es, fr, hi, navFor, pl, pt, ru, sidebarFor, uk, zh } from './navigation';

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
  // English lives in en/ beside the other languages but is served from the root, as it always was.
  rewrites: {
    'en/:rest*': ':rest*',
  },
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
        nav: navFor('', 'en', english),
        sidebar: sidebarFor('', english),
      },
    },
    de: {
      label: 'Deutsch',
      lang: 'de',
      description: 'Baustatik online – ebene Balken, Rahmen und Fachwerke im Browser.',
      themeConfig: {
        nav: navFor('/de', 'de', de),
        outline: { label: 'Auf dieser Seite' },
        docFooter: { prev: 'Vorherige Seite', next: 'Nächste Seite' },
        lastUpdated: { text: 'Zuletzt aktualisiert' },
        sidebar: sidebarFor('/de', de),
      },
    },
    es: {
      label: 'Español',
      lang: 'es',
      description: 'Análisis de estructuras en línea: vigas, pórticos y celosías planos en el navegador.',
      themeConfig: {
        nav: navFor('/es', 'es', es),
        outline: { label: 'En esta página' },
        docFooter: { prev: 'Página anterior', next: 'Página siguiente' },
        lastUpdated: { text: 'Última actualización' },
        sidebar: sidebarFor('/es', es),
      },
    },
    pt: {
      label: 'Português',
      lang: 'pt-BR',
      description: 'Análise estrutural online: vigas, pórticos e treliças planos no navegador.',
      themeConfig: {
        nav: navFor('/pt', 'pt', pt),
        outline: { label: 'Nesta página' },
        docFooter: { prev: 'Página anterior', next: 'Próxima página' },
        lastUpdated: { text: 'Última atualização' },
        sidebar: sidebarFor('/pt', pt),
      },
    },
    fr: {
      label: 'Français',
      lang: 'fr',
      description: 'Calcul des structures en ligne : poutres, portiques et treillis plans dans le navigateur.',
      themeConfig: {
        nav: navFor('/fr', 'fr', fr),
        outline: { label: 'Sur cette page' },
        docFooter: { prev: 'Page précédente', next: 'Page suivante' },
        lastUpdated: { text: 'Dernière mise à jour' },
        sidebar: sidebarFor('/fr', fr),
      },
    },
    cs: {
      label: 'Čeština',
      lang: 'cs',
      description: 'Stavební mechanika online – rovinné nosníky, rámy a příhradové konstrukce v prohlížeči.',
      themeConfig: {
        nav: navFor('/cs', 'cs', cs),
        outline: { label: 'Na této stránce' },
        docFooter: { prev: 'Předchozí', next: 'Další' },
        lastUpdated: { text: 'Naposledy upraveno' },
        sidebar: sidebarFor('/cs', cs),
      },
    },
    zh: {
      label: '中文',
      lang: 'zh',
      description: '免费的在线平面结构分析工具——在浏览器中即时求解梁、刚架和桁架。',
      themeConfig: {
        nav: navFor('/zh', 'cn', zh),
        outline: { label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdated: { text: '最后更新' },
        sidebar: sidebarFor('/zh', zh),
      },
    },
    hi: {
      label: 'हिन्दी',
      lang: 'hi',
      description: 'ब्राउज़र में निःशुल्क 2D संरचनात्मक विश्लेषण – बीम, फ्रेम और ट्रस के लिए तुरंत FEM परिणाम',
      themeConfig: {
        nav: navFor('/hi', 'en', hi),
        outline: { label: 'इस पृष्ठ पर' },
        docFooter: { prev: 'पिछला पृष्ठ', next: 'अगला पृष्ठ' },
        lastUpdated: { text: 'अंतिम अद्यतन' },
        sidebar: sidebarFor('/hi', hi),
      },
    },
    pl: {
      label: 'Polski',
      lang: 'pl',
      description: 'Darmowa analiza statyczna belek, ram i kratownic w przeglądarce — bez instalacji i bez konta.',
      themeConfig: {
        nav: navFor('/pl', 'pl', pl),
        outline: { label: 'Na tej stronie' },
        docFooter: { prev: 'Poprzednia strona', next: 'Następna strona' },
        lastUpdated: { text: 'Ostatnia aktualizacja' },
        sidebar: sidebarFor('/pl', pl),
      },
    },
    uk: {
      label: 'Українська',
      lang: 'uk',
      description: 'Безкоштовний розрахунок плоских балок, рам і ферм онлайн — миттєві епюри просто у браузері.',
      themeConfig: {
        nav: navFor('/uk', 'uk', uk),
        outline: { label: 'На цій сторінці' },
        docFooter: { prev: 'Попередня сторінка', next: 'Наступна сторінка' },
        lastUpdated: { text: 'Останнє оновлення' },
        sidebar: sidebarFor('/uk', uk),
      },
    },
    ru: {
      label: 'Русский',
      lang: 'ru',
      description: 'Бесплатный онлайн-расчёт балок, рам и ферм — эпюры внутренних усилий и прогибы прямо в браузере.',
      themeConfig: {
        nav: navFor('/ru', 'ru', ru),
        outline: { label: 'На этой странице' },
        docFooter: { prev: 'Предыдущая страница', next: 'Следующая страница' },
        lastUpdated: { text: 'Последнее обновление' },
        sidebar: sidebarFor('/ru', ru),
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
  // VitePress renders hero `name` and `text` as adjacent <span>s inside one <h1> with no
  // whitespace between them, so search engines read "EduBeamFree structural analysis online".
  // Append a space to the name; `.VPHero .name { white-space: normal }` collapses it visually.
  transformPageData(pageData) {
    const hero = pageData.frontmatter.hero;
    if (hero?.name && hero.text && !hero.name.endsWith(' ')) {
      hero.name += ' ';
    }
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
  ],
  markdown: {
    config: (md) => {
      // <Edubeam /> starts many paragraphs, and a line that starts with a component is taken for raw
      // HTML: the paragraph lost its <p>, so it sat right under the heading. As a plain span the logo
      // stays inline and the paragraph is a paragraph.
      md.core.ruler.before('normalize', 'edubeam-logo', (state) => {
        state.src = state.src.replaceAll('<Edubeam />', '<span class="edubeam">EduBeam</span>');
      });
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
