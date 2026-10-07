// What the documentation shows, one entry per image in docs/public/screenshots.
//
// A shot: { name, model?, width?, height?, app?, viewer?, firstVisit?, url?, setup?(page, helpers),
//           clip?(page, helpers) → selector(s) or boxes, pad? }
// Models are files in ./models; `viewer` and `app` seed the persisted stores before the app loads.

/** The app's messages in the language being shot; labels are looked up, never written out. */
let messages = {};

export const setMessages = (m) => {
  messages = m;
};

/** A label of the app in the current language, by its key in src/locales. */
const t = (key) => {
  const value = key.split('.').reduce((node, part) => node?.[part], messages);
  if (typeof value !== 'string') throw new Error(`No message ${key}`);
  return value;
};

const drawer = '.v-navigation-drawer--active';
const dialog = '.v-overlay--active > .v-overlay__content > .v-card';

const wait = (page, ms = 400) => page.waitForTimeout(ms);

const openMenu = async (page) => {
  await page.click('#appMenu');
  await wait(page);
};

const menuItem = async (page, label) => {
  await openMenu(page);
  await page.locator(drawer).getByText(label, { exact: true }).click();
  await wait(page, 700);
};

const bottomTab = async (page, label) => {
  await page.locator('#bottomBar .v-tab').filter({ hasText: label }).first().click();
  await wait(page, 300);
};

/** The n-th bottom-bar toolbar button with this label (both "Add node" buttons share one). */
const toolbarButton = async (page, label, n = 0) => {
  await page.locator('#bottomBar .v-btn').filter({ hasText: label }).nth(n).click();
  await wait(page, 700);
};

/** Read from the DOM, because a node is a zero-height polyline that Playwright counts as hidden. */
const rectOf = (page, selector) =>
  page.evaluate((selector) => {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`Not found: ${selector}`);
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: Math.max(r.width, 1), height: Math.max(r.height, 1) };
  }, selector);

const centerOf = async (page, selector) => {
  const box = await rectOf(page, selector);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

const nodeSel = (label) => `polyline[data-label="${label}"]`;
const elementSel = (label) => `[data-element-id="${label}"]`;

const clickNode = async (page, label) => {
  const { x, y } = await centerOf(page, nodeSel(label));
  await page.mouse.click(x, y);
  await wait(page, 500);
};

const clickElement = async (page, label, at = 0.3) => {
  const box = await rectOf(page, elementSel(label));
  await page.mouse.click(box.x + box.width * at, box.y + box.height * at);
  await wait(page, 500);
};

const hoverNode = async (page, label) => {
  const { x, y } = await centerOf(page, nodeSel(label));
  await page.mouse.move(x, y);
  await wait(page, 600);
};

/** Picks an option of the Vuetify select labelled `label` inside `scope`. */
const choose = async (page, scope, label, option) => {
  await page.locator(scope).locator('.v-input').filter({ hasText: label }).first().locator('.v-field').click();
  await wait(page, 300);
  await page.locator('.v-overlay--active .v-list-item').filter({ hasText: option }).first().click();
  await wait(page, 400);
};

/** Types into the text field labelled `label` inside `scope`. */
const type = async (page, scope, label, value, n = 0) => {
  const input = page.locator(scope).locator('.v-input').filter({ hasText: label }).nth(n).locator('input');
  await input.fill(String(value));
  await wait(page, 150);
};

const fit = async (page) => {
  await page.keyboard.press('f');
  await wait(page, 500);
};

/** Fit, then one zoom step out, so labels at the edges are not cut off by a tight crop. */
const fitLoose = async (page) => {
  await fit(page);
  await page.keyboard.press('Control+Minus');
  await wait(page, 500);
};

/** Numbered markers drawn over the app, for images whose text refers to their parts by number. */
const callouts = async (page, items) => {
  for (const { selector, n, at = 'left', box: given } of items) {
    const box = given ?? (await page.locator(selector).first().boundingBox());
    if (!box) throw new Error(`No callout target: ${selector}`);
    await page.evaluate(
      ({ box, n, at }) => {
        const size = 26;
        const outline = document.createElement('div');
        Object.assign(outline.style, {
          position: 'fixed',
          left: `${box.x - 3}px`,
          top: `${box.y - 3}px`,
          width: `${box.width + 6}px`,
          height: `${box.height + 6}px`,
          border: '2px solid #ff4f00',
          borderRadius: '6px',
          zIndex: 100000,
          pointerEvents: 'none',
        });
        const pos = {
          left: { left: box.x - size - 8, top: box.y + box.height / 2 - size / 2 },
          right: { left: box.x + box.width + 8, top: box.y + box.height / 2 - size / 2 },
          top: { left: box.x + box.width / 2 - size / 2, top: box.y - size - 8 },
          bottom: { left: box.x + box.width / 2 - size / 2, top: box.y + box.height + 8 },
          corner: { left: box.x + box.width - size / 2, top: box.y - size / 2 },
          inside: { left: box.x + box.width - size - 12, top: box.y + 8 },
        }[at];
        const badge = document.createElement('div');
        badge.textContent = String(n);
        Object.assign(badge.style, {
          position: 'fixed',
          left: `${pos.left}px`,
          top: `${pos.top}px`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: '#ff4f00',
          color: 'white',
          font: '700 15px/26px system-ui, sans-serif',
          textAlign: 'center',
          zIndex: 100001,
          boxShadow: '0 1px 4px rgba(0,0,0,.35)',
          pointerEvents: 'none',
        });
        document.body.append(outline, badge);
      },
      { box, n, at }
    );
  }
};

/** Overlays for a result shot: the display panel closed and only the listed results drawn. */
const only = (...flags) => ({
  settingsOpen: false,
  showDeformedShape: false,
  showNormalForce: false,
  showShearForce: false,
  showBendingMoment: false,
  showReactions: false,
  ...Object.fromEntries(flags.map((f) => [f, true])),
});

/** The drawing area between the overlay buttons and the bottom bar. */
const viewerArea = async (page) => {
  const top = await page.locator('#undoRedo').boundingBox();
  const bottom = await page.locator('#bottomBar').boundingBox();
  const width = page.viewportSize().width;
  return { x: 24, y: top.y - 8, width: width - 48, height: bottom.y - top.y - 24 };
};

/** The drawn model (labels, loads and diagrams included) with a margin, inside the drawing area. */
const contentArea = async (page) => {
  const area = await viewerArea(page);
  const box = await page.evaluate(() => {
    const r = document.querySelector('.elements-layer').parentElement.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  const margin = 32;
  const x = Math.max(area.x, box.x - margin);
  const y = Math.max(area.y, box.y - margin);
  const right = Math.min(area.x + area.width, box.x + box.width + margin);
  const bottom = Math.min(area.y + area.height, box.y + box.height + margin);
  return { x, y, width: right - x, height: bottom - y };
};

/** The page under the Viewer / Settings tabs, down to the bottom bar. */
const settingsArea = async (page) => {
  const tabs = await page.locator('.v-tabs').first().boundingBox();
  const bottom = await page.locator('#bottomBar').boundingBox();
  return { x: 0, y: tabs.y + tabs.height, width: page.viewportSize().width, height: bottom.y - tabs.y - tabs.height };
};

const fitAndCrop = (name, model, flags, size = {}) => ({
  name,
  model,
  width: 1100,
  height: 820,
  ...size,
  viewer: only(...flags),
  setup: fitLoose,
  clip: contentArea,
  pad: 0,
});

/** A bottom-bar tab, tall enough for its rows. */
const table = (name, model, setup, app = {}, width = 1200) => ({
  name,
  model,
  width,
  height: 820,
  app: { bottomBarHeight: 300, ...app },
  setup,
  clip: () => '#bottomBar',
  pad: 0,
});

/** Fills the n-th text field of a dialog, counting from the top and skipping selects. */
const fillNth = async (page, n, value) => {
  await page.locator(`${dialog} .v-text-field:not(.v-select):not(.v-autocomplete) input`).nth(n).fill(String(value));
  await wait(page, 200);
};

export const shots = [
  // ---------------------------------------------------------------- home & introduction
  {
    name: 'hero',
    model: 'three-hinged-frame',
    height: 760,
    viewer: { settingsOpen: false },
    setup: fit,
  },

  // ---------------------------------------------------------------- getting started
  {
    name: 'welcome',
    firstVisit: true,
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'first-beam-task',
    model: 'beam',
    width: 1100,
    height: 720,
    setup: (page) => menuItem(page, t('welcome.drawFirstBeam')),
    // The card and the toolbar button it points to
    clip: () => ['.first-beam-task', '#bottomBar .v-btn >> nth=1'],
    pad: 16,
  },
  {
    name: 'tour',
    model: 'beam',
    setup: async (page) => {
      await menuItem(page, t('welcome.showAround'));
      for (let i = 0; i < 3; i++) {
        await page.getByRole('button', { name: t('tour.nextButton'), exact: true }).first().click();
        await wait(page, 400);
      }
    },
  },
  {
    name: 'qs-material',
    setup: async (page) => {
      await bottomTab(page, t('tabs.materials'));
      await toolbarButton(page, t('materials.addMaterial'));
    },
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'qs-material-library',
    setup: async (page) => {
      await bottomTab(page, t('tabs.materials'));
      await toolbarButton(page, t('materials.material_library'));
    },
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'qs-cross-section',
    setup: async (page) => {
      await bottomTab(page, t('tabs.crossSections'));
      await toolbarButton(page, t('crossSections.addCrossSection'));
    },
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'qs-node',
    model: 'beam',
    setup: (page) => toolbarButton(page, t('nodes.addNode'), 0),
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'qs-element',
    model: 'beam',
    setup: async (page) => {
      await bottomTab(page, t('tabs.elements'));
      await toolbarButton(page, t('elements.addElement'), 0);
    },
    clip: () => dialog,
    pad: 0,
  },
  table('qs-supports', 'beam', undefined, {}, 960),
  {
    name: 'qs-load',
    model: 'beam',
    setup: async (page) => {
      await bottomTab(page, t('tabs.loads'));
      await toolbarButton(page, t('loads.addElementLoad'));
      await fillNth(page, 1, 12);
    },
    clip: () => dialog,
    pad: 0,
  },
  fitAndCrop('qs-results', 'beam', ['showShearForce', 'showBendingMoment', 'showReactions', 'showDeformedShape']),

  // ---------------------------------------------------------------- user interface
  {
    name: 'ui-overview',
    model: 'three-hinged-frame',
    setup: async (page, { clipOf }) => {
      await fit(page);
      const appBarButtons = await clipOf(page, ['header .v-btn >> nth=1', 'header .v-btn >> nth=2'], 0);
      await callouts(page, [
        { selector: '#appMenu', n: 1, at: 'right' },
        { box: appBarButtons, n: 2, at: 'right' },
        { selector: '#undoRedo', n: 3, at: 'right' },
        { selector: '#viewerControls', n: 4, at: 'left' },
        { selector: '#viewerSettings', n: 5, at: 'left' },
        { selector: '#gridAndUnits', n: 6, at: 'left' },
        { selector: '#bottomBar .v-tabs', n: 7, at: 'right' },
        { selector: '#bottomBar table', n: 8, at: 'inside' },
      ]);
    },
  },
  {
    name: 'ui-app-menu',
    model: 'beam',
    setup: openMenu,
    clip: () => `${drawer} .v-list`,
    pad: 0,
  },
  {
    name: 'ui-display-settings',
    model: 'beam',
    clip: () => ['#viewerControls', '#viewerSettings'],
  },
  {
    name: 'ui-grid-units',
    model: 'beam',
    clip: () => '#gridAndUnits',
    pad: 4,
  },
  {
    name: 'ui-node-menu',
    model: 'beam',
    viewer: { settingsOpen: false },
    setup: (page) => clickNode(page, '1'),
    clip: async (page) => [await rectOf(page, nodeSel('1')), '.selection-tooltip'],
    pad: 24,
  },
  {
    name: 'ui-element-menu',
    model: 'beam',
    viewer: { settingsOpen: false },
    setup: (page) => clickElement(page, '1', 0.35),
    clip: () => '.selection-tooltip',
    pad: 24,
  },
  {
    name: 'ui-canvas-menu',
    model: 'beam',
    viewer: { settingsOpen: false },
    setup: async (page) => {
      await page.mouse.click(400, 250, { button: 'right' });
      await wait(page);
    },
    clip: () => '.mx-context-menu',
    pad: 4,
  },
  {
    name: 'ui-hover',
    model: 'beam',
    viewer: { settingsOpen: false },
    setup: (page) => hoverNode(page, '2'),
    clip: async (page) => [await rectOf(page, nodeSel('2')), '.tooltip'],
    pad: 30,
  },
  {
    name: 'ui-mechanism',
    model: 'mechanism',
    width: 1000,
    height: 760,
    viewer: { settingsOpen: false },
    setup: async (page) => {
      await fit(page);
      await wait(page, 1500);
    },
    clip: viewerArea,
    pad: 0,
  },
  {
    name: 'ui-diagnostics',
    model: 'mechanism',
    viewer: { settingsOpen: false },
    setup: async (page) => {
      await page.getByText(t('solveDiagnostics.showDetails')).first().click();
      await wait(page, 600);
    },
    clip: () => dialog,
    pad: 0,
  },

  // ---------------------------------------------------------------- nodes & supports
  {
    name: 'nodes-support-picker',
    model: 'beam',
    viewer: { settingsOpen: false },
    setup: async (page) => {
      await clickNode(page, '1');
      await page.locator('.selection-tooltip').getByText(t('nodes.defineSupports')).click();
      await wait(page, 500);
    },
    clip: async (page) => [
      await rectOf(page, nodeSel('1')),
      '.selection-tooltip',
      '.v-overlay--active .v-overlay__content',
    ],
    pad: 16,
  },
  {
    name: 'nodes-add-banner',
    model: 'beam',
    viewer: { settingsOpen: false },
    setup: async (page) => {
      await toolbarButton(page, t('nodes.addNode'), 1);
      await page.mouse.move(700, 300);
      await wait(page);
    },
    clip: () => '#addModeBanner',
    pad: 8,
  },
  {
    name: 'nodes-edit',
    model: 'beam',
    setup: async (page) => {
      await page.locator('#bottomBar .mdi-pencil').first().click();
      await wait(page, 700);
    },
    clip: () => dialog,
    pad: 0,
  },

  // ---------------------------------------------------------------- elements, materials, sections
  table('elements-table', 'three-hinged-frame', (page) => bottomTab(page, t('tabs.elements'))),
  {
    name: 'sections-library',
    setup: async (page) => {
      await bottomTab(page, t('tabs.crossSections'));
      await toolbarButton(page, t('materials.section_library'));
    },
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'sections-polygon',
    width: 1360,
    height: 900,
    setup: async (page) => {
      await bottomTab(page, t('tabs.crossSections'));
      await toolbarButton(page, t('crossSections.addPolygonal'));
      await choose(page, dialog, t('dialogs.polygonSection.preset'), t('dialogs.polygonSection.presets.iSection'));
      await page
        .locator(dialog)
        .getByRole('button', { name: t('dialogs.polygonSection.apply') })
        .click();
      await wait(page, 500);
    },
    clip: () => dialog,
    pad: 0,
  },

  // ---------------------------------------------------------------- loads
  fitAndCrop('loads-overview', 'loads', [], { width: 1200, height: 760 }),
  ...[
    ['loads-udl', 'loadType.udl', { 1: 12 }],
    ['loads-trapezoidal', 'loadType.trapezoidal', { 2: 4, 3: 12 }],
    ['loads-concentrated', 'loadType.concentrated', { 1: 20, 3: 2 }],
    ['loads-temperature', 'loadType.temperature', { 1: 10 }],
  ].map(([name, loadType, values]) => ({
    name,
    model: 'beam',
    setup: async (page) => {
      await bottomTab(page, t('tabs.loads'));
      await toolbarButton(page, t('loads.addElementLoad'));
      await choose(page, dialog, t('loadType.loadType'), t(loadType));
      for (const [n, value] of Object.entries(values)) await fillNth(page, Number(n), value);
    },
    clip: () => dialog,
    pad: 0,
  })),
  {
    name: 'loads-nodal',
    model: 'cantilever',
    setup: async (page) => {
      await bottomTab(page, t('tabs.loads'));
      await toolbarButton(page, t('loads.addNodalLoad'));
      await fillNth(page, 1, 10);
    },
    clip: () => dialog,
    pad: 0,
  },
  table('loads-table', 'loads', (page) => bottomTab(page, t('tabs.loads'))),

  // ---------------------------------------------------------------- results
  fitAndCrop('results-normal', 'three-hinged-frame', ['showNormalForce']),
  fitAndCrop('results-shear', 'three-hinged-frame', ['showShearForce']),
  fitAndCrop('results-moment', 'three-hinged-frame', ['showBendingMoment']),
  fitAndCrop('results-deformed', 'three-hinged-frame', ['showDeformedShape']),
  fitAndCrop('results-reactions', 'three-hinged-frame', ['showReactions']),
  // Automatic number format, so 40 kN reads as 40 and not 4 · 10¹
  table('results-nodal', 'three-hinged-frame', (page) => bottomTab(page, t('tabs.results')), { numberStyle: 'auto' }),
  table(
    'results-element',
    'three-hinged-frame',
    async (page) => {
      await bottomTab(page, t('tabs.results'));
      await toolbarButton(page, t('results.element_results'));
    },
    { numberStyle: 'auto' }
  ),

  // ---------------------------------------------------------------- units & settings
  {
    name: 'settings-language',
    model: 'beam',
    width: 1200,
    height: 900,
    app: { bottomBarHeight: 100 },
    setup: async (page) => {
      await page
        .locator('.v-tab')
        .filter({ hasText: t('tabView.settings') })
        .first()
        .click();
      await wait(page, 600);
    },
    clip: settingsArea,
    pad: 0,
  },
  {
    name: 'settings-viewer',
    model: 'beam',
    width: 1200,
    height: 900,
    app: { bottomBarHeight: 100 },
    setup: async (page) => {
      await page
        .locator('.v-tab')
        .filter({ hasText: t('tabView.settings') })
        .first()
        .click();
      await page.getByText(t('settings.viewer_settings'), { exact: true }).first().click();
      await wait(page, 600);
    },
    clip: settingsArea,
    pad: 0,
  },
  // The whole drawing area, so the axis indicator in the corner shows y up
  {
    ...fitAndCrop('settings-y-up', 'three-hinged-frame', ['showShearForce', 'showReactions'], {
      app: { axisConvention: 'y-up' },
    }),
    clip: viewerArea,
  },

  // ---------------------------------------------------------------- files & sharing
  {
    name: 'share',
    model: 'beam',
    setup: (page) =>
      page
        .locator('header .v-btn')
        .filter({ hasText: t('common.shareModel') })
        .click(),
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'export-image',
    model: 'three-hinged-frame',
    height: 900,
    setup: (page) => menuItem(page, t('exportImage.title')),
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'examples',
    model: 'beam',
    height: 900,
    setup: (page) => menuItem(page, t('examples.title')),
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'recent',
    model: 'beam',
    setup: async (page) => {
      // Open two more models over the beam so the list has something in it.
      for (const model of ['truss', 'three-hinged-frame']) {
        await page.setInputFiles('input[type=file]', new URL(`./models/${model}.json`, import.meta.url).pathname);
        await wait(page, 500);
      }
      await menuItem(page, t('recentStructures.title'));
    },
    clip: () => dialog,
    pad: 0,
  },
  {
    name: 'viewer-mode',
    url: '?viewer=1',
    model: 'three-hinged-frame',
    width: 960,
    height: 560,
    setup: fit,
  },

  // ---------------------------------------------------------------- tutorials
  fitAndCrop('tut-frame-moment', 'three-hinged-frame', ['showBendingMoment', 'showReactions']),
  fitAndCrop('tut-frame-normal', 'three-hinged-frame', ['showNormalForce']),
  fitAndCrop('tut-truss-model', 'truss', [], { width: 1200 }),
  fitAndCrop('tut-truss', 'truss', ['showNormalForce', 'showReactions'], { width: 1200 }),
];
