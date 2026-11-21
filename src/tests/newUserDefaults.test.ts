import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useViewerStore } from '@/store/viewer';

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
