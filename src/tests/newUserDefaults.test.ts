import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useViewerStore } from '@/store/viewer';
import { useAppStore } from '@/store/app';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';

/**
 * Someone new starts on the plot renderer with hatched diagrams. Anyone who used EduBeam in this
 * browser before keeps what they had: their saved settings may predate these, and must not switch.
 */
describe('what the drawing starts with', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });
  afterEach(() => localStorage.clear());

  it('is the plot renderer and hatched diagrams for someone new', () => {
    const viewer = useViewerStore();
    expect(viewer.renderer).toBe('plot');
    expect(viewer.diagramStyle.fill).toBe('hatch');
  });

  it('stays the classic renderer and solid fill for someone whose settings were saved before', () => {
    // Saved by an earlier version, without the renderer
    localStorage.setItem('viewer', JSON.stringify({ showGrid: true }));
    setActivePinia(createPinia());
    const viewer = useViewerStore();
    expect(viewer.renderer).toBe('classic');
    expect(viewer.diagramStyle.fill).toBe('solid');
  });
});

/**
 * A phone has no room beside the drawing: someone new on one starts with the display options and
 * the bottom bar put away, the drawing in full. Held sideways counts, and so does a phone asking for
 * the desktop site, which the size gives away where the browser's name does not.
 */
describe('what the drawing starts with on a small screen', () => {
  /** A window that matches the compact query, or not, whatever else is asked */
  const screen = (compact: boolean) =>
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: compact && query.includes('max-width'),
          media: query,
          addEventListener() {},
          removeEventListener() {},
        }) as unknown as MediaQueryList
    );

  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('puts the display options away on a phone, and leaves them open elsewhere', () => {
    screen(true);
    setActivePinia(createPinia());
    expect(useViewerStore().settingsOpen).toBe(false);

    screen(false);
    setActivePinia(createPinia());
    expect(useViewerStore().settingsOpen).toBe(true);
  });

  it('keeps the choice of someone who opened them before', () => {
    localStorage.setItem('viewer', JSON.stringify({ settingsOpen: true }));
    screen(true);
    // Read back from storage, as the app does: Pinia runs its plugins once installed in an app
    const pinia = createPinia();
    pinia.use(piniaPluginPersistedstate);
    createApp({}).use(pinia);
    setActivePinia(pinia);
    expect(useViewerStore().settingsOpen).toBe(true);
  });

  it('starts the bottom bar collapsed on a phone with a desktop browser name', () => {
    screen(true);
    setActivePinia(createPinia());
    expect(useAppStore().bottomBarOpen).toBe(false);
  });
});
