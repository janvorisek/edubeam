import { defineConfig } from "vitepress";
import markdownItKatex from "markdown-it-katex";
import implicitFigures from 'markdown-it-implicit-figures'

const customElements = [
  "math",
  "maction",
  "maligngroup",
  "malignmark",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mi",
  "mlongdiv",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mroot",
  "mrow",
  "ms",
  "mscarries",
  "mscarry",
  "mscarries",
  "msgroup",
  "mstack",
  "mlongdiv",
  "msline",
  "mstack",
  "mspace",
  "msqrt",
  "msrow",
  "mstack",
  "mstack",
  "mstyle",
  "msub",
  "msup",
  "msubsup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "semantics",
  "math",
  "mi",
  "mn",
  "mo",
  "ms",
  "mspace",
  "mtext",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mpadded",
  "mphantom",
  "mroot",
  "mrow",
  "msqrt",
  "mstyle",
  "mmultiscripts",
  "mover",
  "mprescripts",
  "msub",
  "msubsup",
  "msup",
  "munder",
  "munderover",
  "none",
  "maligngroup",
  "malignmark",
  "mtable",
  "mtd",
  "mtr",
  "mlongdiv",
  "mscarries",
  "mscarry",
  "msgroup",
  "msline",
  "msrow",
  "mstack",
  "maction",
  "semantics",
  "annotation",
  "annotation-xml",
];

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "edubeam",
  description: "Learn, Contribute, Excel in Structural Analysis!",
  sitemap: {
    hostname: 'https://www.edubeam.app'
  },
  //cleanUrls: true,
  lastUpdated: true,
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: "Home", link: "/" },
          { text: "FAQ", link: "/faq/" },
          { text: "Examples", link: "/examples/" },
        ],
        sidebar: [
          {
            text: "Getting started",
            items: [
              { text: "Introduction", link: "/guide/introduction" },
              { text: "User Interface", link: "/guide/user-interface" },
              { text: "Examples", link: "/examples/" },
            ],
          },
          {
            text: "Essentials",
            items: [
              { text: "Elements", link: "/essentials/elements" },
              { text: "Loads", link: "/essentials/loads" },
              { text: "Results", link: "/essentials/results" },
              { text: "Import, Export & Sharing", link: "/essentials/import-export" },
            ],
          },
          {
            text: "Theory manual",
            items: [
              { text: "Beam", link: "/elements/beam" },
              { text: "Truss", link: "/elements/truss" },
            ],
            collapsed: true,
          },
          
        ],
      }
    },
    de: {
      label: 'Deutsch',
      lang: 'de',
      themeConfig: {
        nav: [
          { text: "Startseite", link: "/de/" },
          { text: "FAQ", link: "/de/faq" },
          { text: "Beispiele", link: "/de/examples" },
        ]
      }
    },
    es: {
      label: 'Español',
      lang: 'es',
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
          { text: "Domů", link: "/cs/" },
          { text: "FAQ", link: "/cs/faq" },
          { text: "Příklady", link: "/cs/examples" },
        ]
      }
    },
    zh: {
      label: '中文',
      lang: 'zh',
    },
  },
  themeConfig: {
    outline: "deep",
    search: {
      provider: 'local',
      options: {
        locales: {
          cs: {
            translations: {
              button: {
                buttonText: 'Vyhledat v dokumentaci',
                buttonAriaLabel: 'Vyhledat v dokumentaci'
              },
              modal: {
                noResultsText: 'Nenalezeny žádné výsledky pro',
                resetButtonTitle: 'Vymazat vyhledávací podmínky',
                footer: {
                  selectText: 'Vybrat',
                  navigateText: 'Přepnout',
                  closeText: 'Zavřít'
                }
              }
            }
          },
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },
    editLink: {
      pattern: 'https://github.com/janvorisek/edubeam/edit/main/docs/:path'
    },
    socialLinks: [{ icon: "github", link: "https://github.com/janvorisek/edubeam" }, { icon: "twitter", link: "https://twitter.com/EdubeamApp" }],
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
      md.use(markdownItKatex);
      md.use(implicitFigures, {
        figcaption: true,
        copyAttrs: '^class$'
      })
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag),
      },
    },
  },
});
