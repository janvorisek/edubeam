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
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "FAQ", link: "/faq" },
      { text: "Examples", link: "/examples" },
    ],
    sidebar: [
      {
        text: "Getting started",
        items: [
          { text: "Introduction", link: "/guide/introduction" },
          { text: "User Interface", link: "/guide/user-interface" },
          { text: "Examples", link: "/examples" },
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

    socialLinks: [{ icon: "github", link: "https://github.com/janvorisek/edubeam" }],
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
