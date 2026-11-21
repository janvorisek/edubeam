<script setup lang="ts">
/**
 * The results as a student hands them in: the structure with its loads, then the same structure
 * again with each internal force and the deformed shape, one figure each, all at one scale and
 * frame - in a column, as on a sheet of paper, or side by side in a row.
 *
 * Drawn by @edubeam/plot in the editor's look, whichever renderer the canvas uses.
 */
import { computed, shallowRef, useTemplateRef, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { pieceExtrema, type Fit, type PlotLayer, type PlotModel } from '@edubeam/plot';
import { useAppStore } from '@/store/app';
import { useProjectStore } from '@/store/project';
import { useViewerStore, type ReportFigure, type ReportPaper } from '@/store/viewer';
import {
  editorFigureSvg,
  chainDimensions,
  editorSheet,
  extremeDimensions,
  guideMarkup,
  readEditorModel,
  sheetGuides,
} from '@/utils/plotDrawing';
import { useEditorDiagramScales, useEditorLook } from '@/utils/useEditorLook';
import { useI18n } from 'vue-i18n';
import { fontFaceCss } from '@/utils/exportImage';
import ChipCheck from './ChipCheck.vue';

const appStore = useAppStore();
const projectStore = useProjectStore();
const viewerStore = useViewerStore();
const look = useEditorLook();
const diagramScales = useEditorDiagramScales();
const { t } = useI18n();

/** Laid out only while the tab is open: kept alive behind the others, it need not follow every edit */
const open = computed(() => appStore.openedTab?.props.id === 'report');

/* ── The model, read again after every solve ─────────────────────────────────────────────── */
const model = shallowRef<PlotModel | null>(null);
watch(
  [() => projectStore.solveDiagnostics, open],
  () => {
    if (!open.value) return;
    try {
      model.value = readEditorModel(projectStore.solver);
    } catch (error) {
      console.warn('[report] cannot read the model', error);
      model.value = null;
    }
  },
  { immediate: true }
);

/* ── The figures ─────────────────────────────────────────────────────────────────────────── */
const FIGURES: readonly ReportFigure[] = ['loads', 'reactions', 'N', 'V', 'M', 'w'];
const RESULTS: ReadonlySet<ReportFigure> = new Set(['reactions', 'N', 'V', 'M', 'w']);

/** Each figure's layers: the structure as the editor shows it, and what the figure is about */
const layersOf = (figure: ReportFigure): ReadonlySet<PlotLayer> => {
  const on: PlotLayer[] = ['members'];
  if (viewerStore.showSupports) on.push('supports');
  // The nodes are named where the structure is given, as on a sheet: the guide lines lead the eye
  // down to the diagrams, which keep the room by the nodes for their values
  if (viewerStore.showNodeLabels && (figure === 'loads' || figure === 'reactions')) on.push('nodeLabels');
  if (figure === 'loads') {
    on.push('loads');
    if (viewerStore.showElementLabels) on.push('memberLabels');
  } else on.push(figure);
  return new Set(on);
};

/** A figure's title: what it shows, with the unit its values are in (they are bare numbers) */
const titleOf = (figure: ReportFigure): { label: string; sub?: string; unit?: string } => {
  const u = appStore.units;
  switch (figure) {
    case 'loads':
      return { label: t('sideSettings.loads') };
    case 'reactions':
      return { label: t('sideSettings.showReactions'), unit: `${u.Force}, ${u.Moment}` };
    case 'N':
      return { label: 'N', unit: u.Force };
    case 'V':
      return { label: 'V', sub: appStore.axes.v, unit: u.Force };
    case 'M':
      return { label: 'M', sub: appStore.axes.r, unit: u.Moment };
    case 'w':
      return { label: t('sideSettings.showDeformedShape'), unit: u.Displacement };
  }
};

/** A figure's chip in the colour it is drawn in */
const colorOf = (figure: ReportFigure): string => {
  const c = viewerStore.colors;
  return {
    loads: c.loads,
    reactions: c.reactions,
    N: c.normalForce,
    V: c.shearForce,
    M: c.bendingMoment,
    w: c.deformedShape,
  }[figure];
};

const shown = computed(() => FIGURES.filter((f) => viewerStore.reportFigures.includes(f)));

/* ── The paper: what is on screen is what prints ─────────────────────────────────────────── */
/** Paper sizes, portrait, mm: the ISO ones and the American */
const PAPERS: Record<ReportPaper, readonly [number, number]> = {
  a4: [210, 297],
  a3: [297, 420],
  letter: [215.9, 279.4],
  legal: [215.9, 355.6],
};
const PAPER_NAMES: Record<ReportPaper, string> = { a4: 'A4', a3: 'A3', letter: 'Letter', legal: 'Legal' };
const paperItems = (Object.keys(PAPERS) as ReportPaper[]).map((value) => ({ title: PAPER_NAMES[value], value }));
const MARGIN_MM = 15;
/** A browser lays out and prints at 96 px to the inch */
const PX_PER_MM = 96 / 25.4;

const paper = computed(() => {
  const [short, long] = PAPERS[viewerStore.reportPaper] ?? PAPERS.a4;
  const [w, h] = viewerStore.reportOrientation === 'landscape' ? [long, short] : [short, long];
  const margin = MARGIN_MM * PX_PER_MM;
  return {
    mm: { width: w, height: h },
    width: w * PX_PER_MM,
    height: h * PX_PER_MM,
    margin,
    inner: { width: Math.floor(w * PX_PER_MM - 2 * margin), height: Math.floor(h * PX_PER_MM - 2 * margin) },
  };
});

/** The narrowest a figure side by side with others gets, px */
const ROW_MIN_WIDTH = 300;

/** A row of dimensions under a figure, px (see chainDimensions, extremeDimensions) */
const STRIP_ROW = 18;
/**
 * A figure may shrink to this share of the size it would have alone on the page, to fit more: its
 * arrows, diagrams and labels keep their size, so the structure gives up all the height a page
 * shares out - three to a page leaves a frame at about two thirds, as a student draws it.
 */
const SHRINK = 0.6;

/** What a figure keeps under it for its dimensions, px: the loads' chain, the moment's extremes */
const stripOf = (m: PlotModel, figure: ReportFigure): number => {
  if (figure === 'loads') return TITLE_BAND + 2 * STRIP_ROW;
  if (figure !== 'V' && figure !== 'M') return TITLE_BAND;
  const extreme = m.members.some((member) =>
    (m.results?.members[member.id]?.M ?? []).some((p) => pieceExtrema(p).length > 0)
  );
  return TITLE_BAND + (extreme ? STRIP_ROW : 0);
};

/**
 * The band at a figure's top its title stands in, px: inset in the figure, but with the drawing
 * below it, so the title never covers a value the drawing put in its corner
 */
const TITLE_BAND = 26;

/**
 * Each figure's size: the page's width, or a share of it side by side; and as tall as lets the
 * most of them share a page while the structure keeps `SHRINK` of its size. A flat beam fits five
 * to a page, a tall frame perhaps two.
 */
const box = computed(() => {
  const { width, height } = paper.value.inner;
  const n = Math.max(1, shown.value.length);
  const perLine = viewerStore.reportLayout === 'row' ? Math.max(1, Math.min(n, Math.floor(width / ROW_MIN_WIDTH))) : 1;
  const each = Math.floor(width / perLine);
  const m = model.value;
  const lines = Math.ceil(n / perLine);
  // Not on show: no layouts run for a hidden tab, which stays mounted once opened, on every solve
  if (!open.value || !m || m.nodes.length === 0) {
    return { width: each, maxHeight: Math.floor(height / Math.min(lines, 2)), perLine };
  }
  // The most a page's figures keep for dimensions: the largest strips, one a line
  const strips = shown.value.map((f) => stripOf(m, f)).sort((a, b) => b - a);
  const heightFor = (perPage: number) =>
    Math.floor((height - strips.slice(0, perPage).reduce((sum, strip) => sum + strip, 0)) / perPage);
  const all = new Set(shown.value.flatMap((f) => [...layersOf(f)]));
  // Measured as the sheet lays them out, labels and all
  const scaleAt = (maxHeight: number) =>
    editorSheet(m, look.value, [all], { width: each, maxHeight, padding: 12 }, diagramScales.value)[0].fit.s;
  // Alone, no taller than wide
  const alone = Math.min(heightFor(1), each);
  const full = scaleAt(alone);
  for (let perPage = lines; perPage >= 2; perPage--) {
    const maxHeight = heightFor(perPage);
    if (maxHeight > 0 && scaleAt(maxHeight) >= SHRINK * full) {
      // As few pages as that takes, the lines shared evenly between them, each figure as large as
      // its page's share allows: three and two, not four and one left alone
      const even = Math.ceil(lines / Math.ceil(lines / perPage));
      return { width: each, maxHeight: Math.min(heightFor(even), alone), perLine };
    }
  }
  return { width: each, maxHeight: alone, perLine };
});

/** The guide lines, the same in every figure, which all share one frame */
const guides = (fit: Fit): string =>
  viewerStore.reportGuides && model.value ? guideMarkup(sheetGuides(model.value, fit), fit) : '';

interface DrawnFigure {
  readonly figure: ReportFigure;
  readonly title: { readonly label: string; readonly sub?: string; readonly unit?: string };
  /** null when it needs results the model does not have */
  readonly svg: string | null;
  /** px */
  readonly height: number;
}

/** What a figure without results takes on the page, px */
const EMPTY_HEIGHT = 80;

/** The figures on show, each `width` px wide and at most `maxHeight` tall, all in one frame */
const drawFigures = (m: PlotModel, width: number, maxHeight: number): DrawnFigure[] => {
  const solved = m.results !== undefined;
  const wanted = shown.value.filter((f) => solved || !RESULTS.has(f));
  const drawn = editorSheet(
    m,
    look.value,
    wanted.map(layersOf),
    { width, maxHeight, padding: 12 },
    diagramScales.value
  );
  const made = new Map(
    wanted.map((f, i) => {
      // Under the loads the given sizes; under the shear and moment where the moment is largest. On a
      // strip of their own, so they take nothing from the frame every figure shares
      const extremes =
        f === 'loads'
          ? chainDimensions(m, drawn[i].fit, look.value)
          : f === 'V' || f === 'M'
            ? extremeDimensions(m, drawn[i].fit, look.value)
            : null;
      const fit = extremes ? { ...drawn[i].fit, height: drawn[i].fit.height + extremes.height } : drawn[i].fit;
      // The guides run the whole figure, title band and all, so they go on from one figure into the next
      const whole = { ...fit, ty: fit.ty + TITLE_BAND, height: fit.height + TITLE_BAND };
      const svg = editorFigureSvg({ ...drawn[i], fit }, look.value, viewerStore.colors, {
        background: false,
        under: guides(whole),
        over: extremes?.markup,
        shift: TITLE_BAND,
      });
      return [f, { svg, height: whole.height }];
    })
  );
  return shown.value.map((f) => ({
    figure: f,
    title: titleOf(f),
    svg: made.get(f)?.svg ?? null,
    height: made.get(f)?.height ?? EMPTY_HEIGHT,
  }));
};

const figures = computed((): DrawnFigure[] => {
  const m = model.value;
  if (!open.value || !m || m.nodes.length === 0) return [];
  try {
    return drawFigures(m, box.value.width, box.value.maxHeight);
  } catch (error) {
    console.warn('[report] cannot draw the model', error);
    return [];
  }
});

/**
 * The figures on pages, as they print: whole lines of them, a page filled before the next starts.
 * Within a page they meet edge to edge, so the guide lines run on from one into the next.
 */
const pages = computed((): DrawnFigure[][] => {
  if (!open.value) return [];
  const { perLine } = box.value;
  const room = paper.value.inner.height;
  const lines: DrawnFigure[][] = [];
  figures.value.forEach((f, i) => {
    if (i % perLine === 0) lines.push([]);
    lines[lines.length - 1].push(f);
  });
  const heights = lines.map((line) => Math.max(...line.map((f) => f.height)));
  // Filled in order, a page at most `most` lines
  const fill = (most: number) => {
    const out: DrawnFigure[][] = [];
    let used = Infinity;
    let count = 0;
    lines.forEach((line, i) => {
      if (used + heights[i] > room || count >= most) {
        out.push([]);
        used = 0;
        count = 0;
      }
      out[out.length - 1].push(...line);
      used += heights[i];
      count++;
    });
    return out;
  };
  // As few pages as they need, and the lines shared evenly between them: three and two, not four
  // and one left alone on the last
  const fewest = fill(Infinity).length;
  return fill(Math.ceil(lines.length / fewest));
});

/** The pages shrunk to the window when it is narrower than the paper */
const sheet = useTemplateRef<HTMLElement>('sheet');
const { width: sheetWidth } = useElementSize(sheet);
const zoom = computed(() => Math.min(1, (sheetWidth.value - 32) / paper.value.width) || 1);

/* ── Printing ────────────────────────────────────────────────────────────────────────────── */
const html = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const titleHtml = (title: DrawnFigure['title']) =>
  html(title.label) +
  (title.sub ? `<sub>${html(title.sub)}</sub>` : '') +
  (title.unit ? ` <span class="unit">[${html(title.unit)}]</span>` : '');

/**
 * The pages on screen, printed from a frame of their own: the paper size and every page break as
 * shown, whatever the window - and "Save as PDF" in the print dialog makes the file to hand in.
 */
/** The frame printing now: one at a time, a second Print replaces it */
let printFrame: HTMLIFrameElement | null = null;

const print = async () => {
  printFrame?.remove();
  const { mm } = paper.value;
  const css = `
@page { size: ${mm.width}mm ${mm.height}mm; margin: 0; }
body { font-family: Barlow, sans-serif; font-size: 11pt; color: #000; margin: 0; }
.page { width: ${mm.width}mm; height: ${mm.height}mm; padding: ${MARGIN_MM}mm; box-sizing: border-box; overflow: hidden; break-after: page; }
.page:last-child { break-after: auto; }
.content { display: flex; flex-wrap: wrap; align-content: flex-start; }
figure { position: relative; margin: 0; }
figcaption { position: absolute; top: 8px; left: 10px; padding: 0 4px; background: #fff; font-weight: 500; }
.unit { color: #555; font-weight: 400; }
figure svg { display: block; }
.empty { width: ${box.value.width}px; height: ${EMPTY_HEIGHT}px; padding: 40px 14px 0; box-sizing: border-box; color: #555; }
`;
  const body = pages.value
    .map(
      (page) =>
        `<div class="page"><div class="content">${page
          .map(
            (f) =>
              `<figure><figcaption>${titleHtml(f.title)}</figcaption>${f.svg ?? `<div class="empty">${html(t('report.no_results'))}</div>`}</figure>`
          )
          .join('')}</div></div>`
    )
    .join('');
  const doc = `<!doctype html><html lang="${html(appStore.locale)}"><head><meta charset="utf-8"><title>${html(t('tabView.report'))}</title><style>${fontFaceCss()}${css}</style></head><body>${body}</body></html>`;

  const frame = document.createElement('iframe');
  printFrame = frame;
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
  frame.srcdoc = doc;
  document.body.appendChild(frame);
  await new Promise<void>((resolve) => frame.addEventListener('load', () => resolve(), { once: true }));
  const win = frame.contentWindow;
  if (!win) return frame.remove();
  // The typeface first, or the labels print in a fallback
  await win.document.fonts?.ready;
  win.addEventListener('afterprint', () => frame.remove(), { once: true });
  win.focus();
  win.print();
  // Browsers that print without telling: the frame goes anyway
  // (long after: where print() does not wait, the dialog may stay open a while over the frame)
  window.setTimeout(() => frame.remove(), 10 * 60_000);
};
</script>

<template>
  <div class="report d-flex flex-column fill-height">
    <div class="report-bar d-flex flex-wrap align-center ga-3 px-4 py-2">
      <v-btn-toggle
        v-model="viewerStore.reportLayout"
        color="primary"
        density="compact"
        variant="outlined"
        divided
        mandatory
      >
        <v-btn value="column" prepend-icon="mdi-view-sequential-outline">{{ $t('report.column') }}</v-btn>
        <v-btn value="row" prepend-icon="mdi-view-column-outline">{{ $t('report.row') }}</v-btn>
      </v-btn-toggle>
      <!-- As the export dialog's layers: a chip in the figure's colour, filled while it is on -->
      <v-chip-group v-model="viewerStore.reportFigures" multiple class="report-chips">
        <v-chip
          v-for="f in FIGURES"
          :key="f"
          :value="f"
          size="small"
          :color="colorOf(f)"
          :variant="viewerStore.reportFigures.includes(f) ? 'flat' : 'tonal'"
        >
          <ChipCheck :on="viewerStore.reportFigures.includes(f)" />
          {{ titleOf(f).label }}<sub v-if="titleOf(f).sub">{{ titleOf(f).sub }}</sub>
        </v-chip>
      </v-chip-group>
      <v-spacer />
      <v-select
        v-model="viewerStore.reportPaper"
        :items="paperItems"
        :aria-label="$t('report.paper')"
        density="compact"
        variant="outlined"
        hide-details
        class="report-paper flex-grow-0"
      />
      <v-btn-toggle v-model="viewerStore.reportOrientation" density="compact" variant="outlined" divided mandatory>
        <v-btn
          value="portrait"
          icon="mdi-crop-portrait"
          :title="$t('report.portrait')"
          :aria-label="$t('report.portrait')"
        />
        <v-btn
          value="landscape"
          icon="mdi-crop-landscape"
          :title="$t('report.landscape')"
          :aria-label="$t('report.landscape')"
        />
      </v-btn-toggle>
      <v-btn variant="tonal" prepend-icon="mdi-printer" :disabled="figures.length === 0" @click="print">
        {{ $t('report.print') }}
      </v-btn>
      <v-switch
        v-model="viewerStore.reportGuides"
        :label="$t('report.guides')"
        color="primary"
        density="compact"
        hide-details
        class="flex-grow-0"
      />
    </div>
    <div ref="sheet" class="report-sheet flex-grow-1">
      <div class="report-pages" :style="{ zoom }">
        <div
          v-for="(page, p) in pages"
          :key="p"
          class="report-page"
          :style="{ width: `${paper.width}px`, height: `${paper.height}px`, padding: `${paper.margin}px` }"
        >
          <div class="report-page-content">
            <figure v-for="f in page" :key="f.figure" class="report-figure" :style="{ width: `${box.width}px` }">
              <figcaption class="report-title">
                {{ f.title.label }}<sub v-if="f.title.sub">{{ f.title.sub }}</sub>
                <span v-if="f.title.unit" class="report-unit">[{{ f.title.unit }}]</span>
              </figcaption>
              <!-- Plot's writer escapes every text it writes -->
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-if="f.svg" class="report-drawing" v-html="f.svg" />
              <div v-else class="report-empty text-medium-emphasis" :style="{ height: `${f.height}px` }">
                {{ $t('report.no_results') }}
              </div>
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.report {
  background: rgb(var(--v-theme-surface));
}

/* Spaced as the export dialog's layer chips */
.report-chips :deep(.v-chip) {
  margin-right: 4px;
  padding: 0 7px;
}

.report-bar {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

/* The desk the paper lies on */
.report-sheet {
  min-height: 0;
  overflow: auto;
  padding: 16px;
  background: rgba(var(--v-theme-on-surface), 0.06);
}

.report-pages {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* A sheet of paper: its edge and a little shadow, as it will print */
.report-page {
  flex: none;
  box-sizing: border-box;
  overflow: hidden;
  background: #fff;
  /* An outline, not a border: the page's full width is the paper's, to the last px */
  outline: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

/* Edge to edge, with nothing between them: the guide lines run on from one figure into the next */
.report-page-content {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.report-figure {
  position: relative;
  margin: 0;
  flex: none;
}

/* Its title inside, in the top left corner, over whatever guide line runs there */
.report-title {
  position: absolute;
  top: 8px;
  left: 10px;
  z-index: 1;
  padding: 0 4px;
  background: #fff;
  color: #000;
  font-weight: 500;
  line-height: 1.4;
  pointer-events: none;
}

.report-paper {
  width: 110px;
}

.report-unit {
  margin-left: 4px;
  color: #555;
}

.report-drawing :deep(svg) {
  display: block;
}

.report-empty {
  box-sizing: border-box;
  padding: 40px 14px 0;
  color: #555;
}
</style>
