import { computed, ref, type ComputedRef, type Ref } from 'vue';
import { useAppStore } from '@/store/app';

/** The two looks the app has */
export type ThemeName = 'light' | 'dark';
/** What the user chose: one of them, or whatever the system is set to */
export type ThemePreference = 'system' | ThemeName;

export const THEME_PREFERENCES: readonly ThemePreference[] = ['system', 'light', 'dark'];

export const isThemePreference = (value: unknown): value is ThemePreference =>
  value === 'system' || value === 'light' || value === 'dark';

/**
 * The drawing's own colours: what a structure is drawn in, the canvas under it and its grid. The dark
 * ones are the website's night theme (www.edubeam.app), its OKLCH tokens in hex: the canvas a little
 * lighter than the page, the figure ink a softened grey rather than white.
 */
export interface DrawingPalette {
  /** Members, nodes, supports, labels */
  readonly ink: string;
  /** The canvas: under the drawing, and the halo around its labels */
  readonly paper: string;
  /** Secondary marks: rulers, hints */
  readonly muted: string;
  /** The grid's lines */
  readonly grid: string;
}

export const DRAWING_PALETTES: Readonly<Record<ThemeName, DrawingPalette>> = {
  light: { ink: '#000000', paper: '#ffffff', muted: '#666666', grid: '#cccccc' },
  // The website's night figures, on a canvas darker than the chrome around it: the drawing stands out
  dark: {
    ink: '#c5cad6', // the website's --figure-ink, a touch lighter on the darker canvas
    paper: '#090b14',
    muted: '#8a91a8',
    // Plain on the canvas, as the light grid is on white, without drawing graph paper over the model
    grid: '#151927',
  },
};

/**
 * The default colours that read poorly on the dark canvas, and what stands in for them there: the
 * normal force's deep blue lightened as the website does, the deformed shape's and the classic
 * drawing's near-black lifted to the figure ink. A colour the user picked is theirs, and kept.
 */
const DARK_STANDINS: Readonly<Record<string, string>> = {
  '#2222ff': '#7d7dff', // --color-normal at night
  '#555555': '#8f96ab',
  '#000000': DRAWING_PALETTES.dark.ink,
  // The reactions' purple, too dark to read on the navy-black, lifted
  '#a020f0': '#bd6bff',
};

/** The colours a drawing uses under a theme: under the dark one, with the stand-ins for the defaults */
export const themedColors = <T extends Readonly<Record<string, string>>>(colors: T, theme: ThemeName): T =>
  theme === 'light'
    ? colors
    : (Object.fromEntries(
        Object.entries(colors).map(([key, value]) => [key, DARK_STANDINS[value.toLowerCase()] ?? value])
      ) as T);

/**
 * The drawing's colours as the custom properties its styles read, for its root element. Set there, not
 * on the page: an export renders a viewer of its own outside the page's, and keeps the light colours
 * every style falls back to.
 */
export const drawingVars = (theme: ThemeName): Record<string, string> => {
  const p = DRAWING_PALETTES[theme];
  const dark = theme === 'dark';
  return {
    '--eb-ink': p.ink,
    // A hovered line, a step stronger than the ink
    '--eb-ink-hover': dark ? '#e3e6ef' : '#222222',
    '--eb-paper': p.paper,
    '--eb-muted': p.muted,
    '--eb-grid': p.grid,
    // The rulers' inner edge: the light theme's grey, and on the dark canvas a quiet line a step above
    // the grid, where the muted grey was the brightest line on the screen
    '--eb-frame': dark ? '#2c3247' : '#666666',
    // The rulers' numbers: black in the light theme, a step behind the drawing in the dark one
    '--eb-ruler': dark ? '#646b80' : p.ink,
    // The selection's blue, lightened to read on the night canvas
    '--eb-select': dark ? '#6ea8ff' : 'rgb(0, 94, 255)',
    '--eb-select-strong': dark ? '#8fbcff' : 'rgb(0, 55, 149)',
    '--eb-select-fill': dark ? 'rgba(110, 168, 255, 0.2)' : 'rgba(0, 55, 149, 0.15)',
    // The snap marks' green (see SnapMark), brighter at night
    '--eb-snap': dark ? '#3ddc84' : '#0f9d58',
  };
};

/** Whether the system asks for dark, followed as it changes (a laptop going into night mode) */
const systemDark: Ref<boolean> = (() => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return ref(false);
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const dark = ref(media.matches);
  media.addEventListener?.('change', () => (dark.value = media.matches));
  return dark;
})();

/**
 * The theme on show. A `?viewer=1` link is always light: it is embedded in lecture notes and pages
 * of their own colours, and has to look there as it always has.
 */
export const resolveTheme = (preference: ThemePreference, prefersDark: boolean, viewerMode: boolean): ThemeName =>
  viewerMode ? 'light' : preference === 'system' ? (prefersDark ? 'dark' : 'light') : preference;

export const useThemeName = (): ComputedRef<ThemeName> => {
  const appStore = useAppStore();
  return computed(() => resolveTheme(appStore.theme, systemDark.value, appStore.inViewerMode));
};
