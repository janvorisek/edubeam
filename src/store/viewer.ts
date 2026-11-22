// Utilities
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import type { ViewBox } from '@/utils/fitBounds';
import { defaultGridStep } from '@/utils/grid';
import { DEFAULT_DIAGRAM_STYLE, type DiagramStyle } from '@/utils/diagramStyle';
import { useAppStore } from './app';
import { compactScreen, hasStoredSettings } from '@/utils';

/** A figure of the Report tab: the structure with its loads, its reactions, a diagram, its deformed shape */
export type ReportFigure = 'loads' | 'reactions' | 'N' | 'V' | 'M' | 'w';
/** A paper the Report tab is laid out on */
export type ReportPaper = 'a4' | 'a3' | 'letter' | 'legal';
const DEFAULT_REPORT_FIGURES: readonly ReportFigure[] = ['loads', 'N', 'V', 'M', 'w'];
const REPORT_FIGURES: ReadonlySet<unknown> = new Set<ReportFigure>(['loads', 'reactions', 'N', 'V', 'M', 'w']);
const REPORT_PAPERS: ReadonlySet<unknown> = new Set<ReportPaper>(['a4', 'a3', 'letter', 'legal']);

/**
 * What someone new starts with where it differs from what was offered before: the plot renderer and
 * hatched diagrams. Anyone who has used EduBeam in this browser keeps what they had - their saved
 * settings are read back over these, and those saved before these settings existed did not have
 * them, so for them the old defaults stand.
 */
const NEW_USER_DEFAULTS = { renderer: 'plot', fill: 'hatch' } as const;
const OLD_DEFAULTS = { renderer: 'classic', fill: DEFAULT_DIAGRAM_STYLE.fill } as const;

export const useViewerStore = defineStore(
  'viewer',
  () => {
    const defaults = hasStoredSettings('viewer') ? OLD_DEFAULTS : NEW_USER_DEFAULTS;
    const resultLabelMode = ref<'axis' | 'horizontal'>('axis');
    /** Sides, fill and degree labels of the internal force diagrams. */
    const diagramStyle = reactive<DiagramStyle>({ ...DEFAULT_DIAGRAM_STYLE, fill: defaults.fill });
    const showSupports = ref(true);
    const showNodeLabels = ref(true);
    const showElementLabels = ref(true);

    const showLoads = ref(true);

    const showNormalForce = ref(false);
    const showShearForce = ref(false);
    const showBendingMoment = ref(true);
    const showDeformedShape = ref(true);
    const showReactions = ref(true);

    const colors = reactive({
      normalForce: '#2222ff', // used
      shearForce: '#00af00', // used
      bendingMoment: '#ff2222', // used
      deformedShape: '#555555', // used
      loads: '#ff8700', // used
      nodes: '#000000',
      elements: '#000000',
      reactions: '#a020f0', // used
    });

    const showGrid = ref(true);
    const snapToGrid = ref(true);
    // In metres, like the model; a fresh grid starts at a round step of the length unit
    const gridStep = ref(defaultGridStep(useAppStore().units.Length));
    const showCrosshair = ref(true);
    /** Outline how a structure that is not held can still move. */
    const showMechanisms = ref(true);
    /** Swing that outline; off, it is drawn standing still. */
    const animateMechanisms = ref(true);
    const resultsScalePx_ = ref(48);
    const supportSize = ref(1);

    const fontSize = ref(14);

    /**
     * Who draws the model. `plot` is the drawing by @edubeam/plot, which places labels where they do
     * not collide: what someone new starts with, while those who were here before keep the classic
     * one until they switch (see NEW_USER_DEFAULTS). `?renderer=` in a link sets it too.
     */
    const renderer = ref<'classic' | 'plot'>(defaults.renderer);

    /** The plot renderer reads the values of the member under the pointer beside its diagrams */
    const showReadout = ref(true);

    /** The Report tab: its figures one under another, or side by side */
    const reportLayout = ref<'column' | 'row'>('column');
    /** and which figures it shows */
    const reportFigures = ref<ReportFigure[]>([...DEFAULT_REPORT_FIGURES]);
    /** and the guide lines across them, through member ends, load points and moment extremes */
    const reportGuides = ref(true);
    /** and the paper it is laid out on, as it prints: ISO where the units are metric, US Letter else */
    const reportPaper = ref<ReportPaper>(useAppStore().unitSystem === 'us' ? 'letter' : 'a4');
    const reportOrientation = ref<'portrait' | 'landscape'>('portrait');

    /** The display options: open where there is room for them beside the drawing, which a phone has not */
    const settingsOpen = ref(!compactScreen());

    /**
     * The settings this version added, as read back from storage: what one cannot be (written by
     * hand, or by a later version) goes back to its default rather than break the Report tab.
     */
    const sanitizeStored = () => {
      if (renderer.value !== 'classic' && renderer.value !== 'plot') renderer.value = 'classic';
      if (typeof showReadout.value !== 'boolean') showReadout.value = true;
      if (reportLayout.value !== 'column' && reportLayout.value !== 'row') reportLayout.value = 'column';
      const figures: unknown = reportFigures.value;
      reportFigures.value = Array.isArray(figures)
        ? figures.filter((f): f is ReportFigure => REPORT_FIGURES.has(f))
        : [...DEFAULT_REPORT_FIGURES];
      if (typeof reportGuides.value !== 'boolean') reportGuides.value = true;
      if (!REPORT_PAPERS.has(reportPaper.value)) reportPaper.value = 'a4';
      if (reportOrientation.value !== 'portrait' && reportOrientation.value !== 'landscape') {
        reportOrientation.value = 'portrait';
      }
    };

    const reset = () => {
      resultLabelMode.value = 'axis';
      // The look someone new starts with
      Object.assign(diagramStyle, DEFAULT_DIAGRAM_STYLE, { fill: NEW_USER_DEFAULTS.fill });
      showSupports.value = true;
      showNodeLabels.value = true;
      showElementLabels.value = true;

      showLoads.value = true;

      showNormalForce.value = false;
      showShearForce.value = false;
      showBendingMoment.value = true;
      showDeformedShape.value = true;
      showReactions.value = true;

      colors.normalForce = '#2222ff';
      colors.shearForce = '#00af00';
      colors.bendingMoment = '#ff2222';
      colors.deformedShape = '#555555';
      colors.loads = '#ff8700';
      colors.nodes = '#000000';
      colors.elements = '#000000';
      colors.reactions = '#a020f0';

      showGrid.value = true;
      snapToGrid.value = true;
      gridStep.value = defaultGridStep(useAppStore().units.Length);
      showCrosshair.value = true;
      showMechanisms.value = true;
      animateMechanisms.value = true;
      resultsScalePx_.value = 48;
      supportSize.value = 1;

      fontSize.value = 14;
      renderer.value = NEW_USER_DEFAULTS.renderer;
      showReadout.value = true;
      reportLayout.value = 'column';
      reportFigures.value = [...DEFAULT_REPORT_FIGURES];
      reportGuides.value = true;

      settingsOpen.value = !compactScreen();
    };

    /**
     * The export dialog asking the drawing for a window.
     *
     * The dialog steps aside, the viewer switches to `MouseMode.PICK_WINDOW`, and the
     * rectangle the user drags is handed back through here — `null` when they cancel.
     * A plain resolver rather than state, because nothing needs to render it.
     */
    let windowPickResolver: ((box: ViewBox | null) => void) | null = null;

    const pickWindow = () =>
      new Promise<ViewBox | null>((resolve) => {
        windowPickResolver?.(null);
        windowPickResolver = resolve;
      });

    const finishWindowPick = (box: ViewBox | null) => {
      const resolve = windowPickResolver;

      windowPickResolver = null;
      resolve?.(box);
    };

    return {
      pickWindow,
      finishWindowPick,
      resultLabelMode,
      diagramStyle,
      colors,
      showNodeLabels,
      showLoads,
      showElementLabels,
      showSupports,
      showNormalForce,
      showShearForce,
      showBendingMoment,
      showDeformedShape,
      showReactions,

      showGrid,
      snapToGrid,
      gridStep,
      showCrosshair,
      showMechanisms,
      animateMechanisms,
      resultsScalePx_: resultsScalePx_,

      fontSize,
      renderer,
      showReadout,
      reportLayout,
      reportFigures,
      reportGuides,
      reportPaper,
      reportOrientation,

      supportSize,

      settingsOpen,

      reset,
      sanitizeStored,
    };
  },
  { persist: { afterHydrate: ({ store }) => store.sanitizeStored() } }
);
