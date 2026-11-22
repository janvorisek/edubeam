import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useViewerStore } from '@/store/viewer';

/** Settings read back from storage are what the user's browser holds: written by hand, or by a later version */
describe('the stored drawing and report settings', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('go back to their defaults when they cannot be what they are', () => {
    const viewer = useViewerStore();
    // As a corrupt storage entry would restore them
    Object.assign(viewer.$state, {
      renderer: 'webgl',
      reportFigures: 'M',
      reportPaper: 'a0',
      reportLayout: 'grid',
      reportOrientation: 'upside-down',
      showReadout: 'yes',
      reportGuides: 1,
    });

    viewer.sanitizeStored();

    expect(viewer.renderer).toBe('classic');
    expect(viewer.reportFigures).toEqual(['loads', 'N', 'V', 'M', 'w']);
    expect(viewer.reportPaper).toBe('a4');
    expect(viewer.reportLayout).toBe('column');
    expect(viewer.reportOrientation).toBe('portrait');
    expect(viewer.showReadout).toBe(true);
    expect(viewer.reportGuides).toBe(true);
  });

  it('keep the figures it knows and drop the ones it does not', () => {
    const viewer = useViewerStore();
    Object.assign(viewer.$state, { reportFigures: ['M', 'torsion', 'w'], renderer: 'plot' });

    viewer.sanitizeStored();

    expect(viewer.reportFigures).toEqual(['M', 'w']);
    expect(viewer.renderer).toBe('plot');
  });
});
