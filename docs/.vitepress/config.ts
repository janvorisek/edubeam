import { defineConfig } from "vitepress";
import markdownItKatex from "markdown-it-katex";

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
      { text: "Examples", link: "/examples" },
    ],
    sidebar: [
      {
        text: "Getting started",
        items: [
          { text: "Introduction", link: "/guide/introduction" },
          { text: "Quick start", link: "/guide/user-interface" },
          { text: "Examples", link: "/examples" },
        ],
      },
      {
        text: "Essentials",
        items: [
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
  markdown: {
    config: (md) => {
      md.use(markdownItKatex);
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
