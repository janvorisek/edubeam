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
              { text: 'Examples', link: '/examples/' },
            ],
          },
          {
            text: 'Essentials',
            items: [
              { text: 'User Interface', link: '/essentials/user-interface' },
              { text: 'Elements', link: '/essentials/elements' },
              { text: 'Loads', link: '/essentials/loads' },
              { text: 'Results', link: '/essentials/results' },
              { text: 'Import, Export & Sharing', link: '/essentials/import-export' },
            ],
          },
          {
            text: 'Theory manual',
            items: [
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
      themeConfig: {
        nav: [
          { text: 'Startseite', link: '/de/' },
          { text: 'FAQ', link: '/de/faq' },
          { text: 'Beispiele', link: '/de/examples' },
        ],
      },
    },
    es: {
      label: 'Español',
      lang: 'es',
    },
    pt: {
      label: 'Português',
      lang: 'pt',
      themeConfig: {
        nav: [
          { text: 'Início', link: '/pt/' },
          { text: 'FAQ', link: '/pt/faq' },
          { text: 'Exemplos', link: '/pt/examples' },
        ],
      },
    },
    fr: {
      label: 'Français',
      lang: 'fr',
    },
    cs: {
      label: 'Čeština',
      lang: 'cs',
      themeConfig: {
        nav: [
          { text: 'Domů', link: '/cs/' },
          { text: 'FAQ', link: '/cs/faq' },
          { text: 'Příklady', link: '/cs/examples' },
        ],
      },
    },
    zh: {
      label: '中文',
      lang: 'zh',
    },
    hi: {
      label: 'हिन्दी',
      lang: 'hi',
    },
    pl: {
      label: 'Polski',
      lang: 'pl',
      themeConfig: {
        nav: [
          { text: 'Strona główna', link: '/pl/' },
          { text: 'FAQ', link: '/pl/faq' },
          { text: 'Przykłady', link: '/pl/examples' },
        ],
      },
    },
    uk: {
      label: 'Українська',
      lang: 'uk',
      themeConfig: {
        nav: [
          { text: 'Головна', link: '/uk/' },
          { text: 'FAQ', link: '/uk/faq' },
          { text: 'Приклади', link: '/uk/examples' },
        ],
      },
    },
    ru: {
      label: 'Русский',
      lang: 'ru',
      themeConfig: {
        nav: [
          { text: 'Главная', link: '/ru/' },
          { text: 'FAQ', link: '/ru/faq' },
          { text: 'Примеры', link: '/ru/examples' },
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
