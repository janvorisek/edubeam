import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useViewerStore } from '@/store/viewer';
import { isTryItId, triedFeature, tryFeature, undoTriedFeature } from '@/utils/tryIt';

describe('trying a feature from the changelog', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    triedFeature.value = null;
  });

  it('knows only the features the app defines', () => {
    expect(isTryItId('diagramStyles')).toBe(true);
    expect(isTryItId('constructor')).toBe(false);
    expect(isTryItId('somethingNewer')).toBe(false);
    expect(isTryItId(undefined)).toBe(false);
  });

  it('switches the diagram styles on, and undo puts back exactly what was there', () => {
    const viewer = useViewerStore();
    viewer.diagramStyle.momentOnTensionSide = false;
    viewer.showBendingMoment = false;
    const before = { ...viewer.diagramStyle };

    tryFeature('diagramStyles');
    expect(viewer.diagramStyle.fill).toBe('hatch');
    expect(viewer.diagramStyle.showDegrees).toBe(true);
    expect(viewer.showBendingMoment).toBe(true);
    // What it does not touch stays as the reader had it
    expect(viewer.diagramStyle.momentOnTensionSide).toBe(false);

    undoTriedFeature();
    expect({ ...viewer.diagramStyle }).toEqual(before);
    expect(viewer.showBendingMoment).toBe(false);
    expect(triedFeature.value).toBeNull();
  });
});
