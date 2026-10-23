import { defineConfig, type HeadConfig, type TransformContext } from 'vitepress';
import { katex } from '@mdit/plugin-katex';
import implicitFigures from 'markdown-it-implicit-figures';
import path from 'path';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import {
  cs,
  de,
  english,
  es,
  fr,
  hi,
  id,
  it,
  ja,
  navFor,
  pl,
  pt,
  ru,
  sidebarFor,
  th,
  tr,
  uk,
  vi,
  zh,
} from './navigation';

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

const SITE_URL = 'https://www.edubeam.app';

/** Public URL of a page from its (rewritten) path, as served with `cleanUrls`. */
function pageUrl(relativePath: string): string {
  return `${SITE_URL}/${relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`;
}

/**
 * Canonical URL, hreflang alternates, Open Graph / Twitter cards and, on home pages, structured data.
 * The sitemap already lists the alternates; repeating them in the page head covers crawlers that
 * never read the sitemap, and link previews in LMSs and chat apps read the Open Graph tags.
 */
function seoHead({ pageData, siteConfig, siteData, title, description }: TransformContext): HeadConfig[] {
  if (pageData.isNotFound) return [];

  const locales = siteData.locales;
  const localeOf = (page: string) => {
    const dir = page.split('/')[0];
    return dir in locales && dir !== 'root' ? dir : 'root';
  };
  const locale = localeOf(pageData.relativePath);
  const key = locale === 'root' ? pageData.relativePath : pageData.relativePath.slice(locale.length + 1);
  const lang = locales[locale].lang ?? 'en';
  const url = pageUrl(pageData.relativePath);

  const pages = new Set(siteConfig.pages.map((page) => siteConfig.rewrites.map[page] ?? page));
  const alternates = Object.keys(locales)
    .map((loc) => ({ loc, page: loc === 'root' ? key : `${loc}/${key}` }))
    .filter(({ page }) => pages.has(page));

  const head: HeadConfig[] = [['link', { rel: 'canonical', href: url }]];
  if (alternates.length > 1) {
    for (const { loc, page } of alternates) {
      head.push(['link', { rel: 'alternate', hreflang: locales[loc].lang ?? 'en', href: pageUrl(page) }]);
    }
    if (alternates.some(({ loc }) => loc === 'root')) {
      head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: pageUrl(key) }]);
    }
  }

  head.push(
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'EduBeam' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:locale', content: lang.replace('-', '_') }],
    ['meta', { property: 'og:image', content: `${SITE_URL}/og-image.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@EdubeamApp' }]
  );

  if (pageData.frontmatter.layout === 'home') {
    const app = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'EduBeam',
      url: 'https://run.edubeam.app',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any (web browser)',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      inLanguage: lang,
      description,
    };
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify(app)]);
  }

  return head;
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'EduBeam',
  description: 'Free 2D structural analysis online – beams, frames and trusses solved instantly in your browser.',
  // English lives in en/ beside the other languages but is served from the root, as it always was.
  rewrites: {
    'en/:rest*': ':rest*',
  },
  sitemap: {
    hostname: SITE_URL,
    // English is served from the root, so it is also the page for languages we don't have.
    transformItems: (items) =>
      items.map((item) => {
        const links = item.links ?? [];
        const english = links.find((link) => link.lang === 'en');
        return english ? { ...item, links: [...links, { lang: 'x-default', url: english.url }] } : item;
      }),
  },
  // Cloudflare Pages serves `page.html` at `/page` and redirects the `.html` form there, so every
  // link and sitemap entry should already use the clean form. Old `.html` links keep working.
  cleanUrls: true,
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
        nav: navFor('/hi', 'hi', hi),
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
    th: {
      label: 'ไทย',
      lang: 'th',
      description: 'วิเคราะห์โครงสร้างออนไลน์ฟรี – คาน โครงข้อแข็ง และโครงถักในระนาบ ได้ผลทันทีบนเบราว์เซอร์',
      themeConfig: {
        nav: navFor('/th', 'th', th),
        outline: { label: 'ในหน้านี้' },
        docFooter: { prev: 'หน้าก่อนหน้า', next: 'หน้าถัดไป' },
        lastUpdated: { text: 'อัปเดตล่าสุด' },
        sidebar: sidebarFor('/th', th),
      },
    },
    tr: {
      label: 'Türkçe',
      lang: 'tr',
      description: 'Çevrim içi yapı analizi – düzlem kirişler, çerçeveler ve kafes sistemler doğrudan tarayıcıda.',
      themeConfig: {
        nav: navFor('/tr', 'tr', tr),
        outline: { label: 'Bu sayfada' },
        docFooter: { prev: 'Önceki sayfa', next: 'Sonraki sayfa' },
        lastUpdated: { text: 'Son güncelleme' },
        sidebar: sidebarFor('/tr', tr),
      },
    },
    vi: {
      label: 'Tiếng Việt',
      lang: 'vi',
      description:
        'Phân tích kết cấu trực tuyến miễn phí – dầm, khung và dàn phẳng, có kết quả tức thì ngay trên trình duyệt.',
      themeConfig: {
        nav: navFor('/vi', 'vi', vi),
        outline: { label: 'Trên trang này' },
        docFooter: { prev: 'Trang trước', next: 'Trang sau' },
        lastUpdated: { text: 'Cập nhật lần cuối' },
        sidebar: sidebarFor('/vi', vi),
      },
    },
    it: {
      label: 'Italiano',
      lang: 'it',
      description:
        "Analisi strutturale 2D gratuita online – travi, telai e travature reticolari risolti all'istante nel browser.",
      themeConfig: {
        nav: navFor('/it', 'it', it),
        outline: { label: 'In questa pagina' },
        docFooter: { prev: 'Pagina precedente', next: 'Pagina successiva' },
        lastUpdated: { text: 'Ultimo aggiornamento' },
        sidebar: sidebarFor('/it', it),
      },
    },
    id: {
      label: 'Bahasa Indonesia',
      lang: 'id',
      description: 'Analisis struktur online gratis – balok, portal, dan rangka batang 2D langsung di browser.',
      themeConfig: {
        nav: navFor('/id', 'id', id),
        outline: { label: 'Di halaman ini' },
        docFooter: { prev: 'Sebelumnya', next: 'Berikutnya' },
        lastUpdated: { text: 'Terakhir diperbarui' },
        sidebar: sidebarFor('/id', id),
      },
    },
    ja: {
      label: '日本語',
      lang: 'ja',
      description: '無料のオンライン 2D 構造解析。ブラウザで梁、ラーメン、トラスをすぐに解析できます。',
      themeConfig: {
        nav: navFor('/ja', 'ja', ja),
        outline: { label: 'このページの内容' },
        docFooter: { prev: '前のページ', next: '次のページ' },
        lastUpdated: { text: '最終更新' },
        sidebar: sidebarFor('/ja', ja),
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
          th: {
            translations: {
              button: {
                buttonText: 'ค้นหาในเอกสาร',
                buttonAriaLabel: 'ค้นหาในเอกสาร',
              },
              modal: {
                noResultsText: 'ไม่พบผลลัพธ์สำหรับ',
                resetButtonTitle: 'ล้างคำค้นหา',
                footer: {
                  selectText: 'เลือก',
                  navigateText: 'เลื่อน',
                  closeText: 'ปิด',
                },
              },
            },
          },
          tr: {
            translations: {
              button: {
                buttonText: 'Dokümantasyonda ara',
                buttonAriaLabel: 'Dokümantasyonda ara',
              },
              modal: {
                noResultsText: 'Sonuç bulunamadı:',
                resetButtonTitle: 'Aramayı temizle',
                footer: {
                  selectText: 'Seç',
                  navigateText: 'Gezin',
                  closeText: 'Kapat',
                },
              },
            },
          },
          vi: {
            translations: {
              button: {
                buttonText: 'Tìm trong tài liệu',
                buttonAriaLabel: 'Tìm trong tài liệu',
              },
              modal: {
                noResultsText: 'Không tìm thấy kết quả cho',
                resetButtonTitle: 'Xóa nội dung tìm kiếm',
                footer: {
                  selectText: 'Chọn',
                  navigateText: 'Di chuyển',
                  closeText: 'Đóng',
                },
              },
            },
          },
          it: {
            translations: {
              button: {
                buttonText: 'Cerca',
                buttonAriaLabel: 'Cerca nella documentazione',
              },
              modal: {
                noResultsText: 'Nessun risultato per',
                resetButtonTitle: 'Cancella la ricerca',
                footer: {
                  selectText: 'Seleziona',
                  navigateText: 'Naviga',
                  closeText: 'Chiudi',
                },
              },
            },
          },
          id: {
            translations: {
              button: {
                buttonText: 'Cari di dokumentasi',
                buttonAriaLabel: 'Cari di dokumentasi',
              },
              modal: {
                noResultsText: 'Tidak ada hasil untuk',
                resetButtonTitle: 'Hapus kata pencarian',
                footer: {
                  selectText: 'Pilih',
                  navigateText: 'Navigasi',
                  closeText: 'Tutup',
                },
              },
            },
          },
          ja: {
            translations: {
              button: {
                buttonText: 'ドキュメントを検索',
                buttonAriaLabel: 'ドキュメントを検索',
              },
              modal: {
                noResultsText: '一致する結果が見つかりません',
                resetButtonTitle: '検索条件をクリア',
                footer: {
                  selectText: '選択',
                  navigateText: '移動',
                  closeText: '閉じる',
                },
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
  transformPageData(pageData) {
    const hero = pageData.frontmatter.hero;
    // VitePress renders hero `name` and `text` as adjacent <span>s inside one <h1> with no
    // whitespace between them, so search engines read "EduBeamFree structural analysis online".
    // Append a space to the name; `.VPHero .name { white-space: normal }` collapses it visually.
    if (hero?.name && hero.text && !hero.name.endsWith(' ')) {
      hero.name += ' ';
    }
    // Home pages have no heading of their own, so their <title> would be a bare "EduBeam".
    if (hero?.text && !pageData.title) {
      pageData.title = hero.text;
    }
  },
  transformHead: seoHead,
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
      md.use(katex);
      md.use(implicitFigures, {
        figcaption: true,
        // The plugin empties alt once the text becomes the caption; image search only reads alt.
        keepAlt: true,
        lazyLoading: true,
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
