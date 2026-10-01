import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { LinearStaticSolver, DofID } from 'ts-fem';
import { useProjectStore } from '@/store/project';
import { RECENT_STRUCTURES_KEY, RECENT_STRUCTURES_LIMIT, useRecentStructuresStore } from '@/store/recentStructures';
import { deserializeModel, replaceModel, resetModel, serializeModel, undoModelChange } from '@/utils';
import { buildStarterModel } from '@/utils/starterModel';
import { undoRedoManager } from '@/CommandManager';
import type { DimensionLine } from '@/types/dimension';

/** A beam of `span` metres, so models built with different spans differ. */
const beamModel = (span: number) => {
  const solver = new LinearStaticSolver();
  solver.domain.createNode(1, [0, 0, 0], [DofID.Dx, DofID.Dz]);
  solver.domain.createNode(2, [span, 0, 0], [DofID.Dz]);
  solver.domain.createMaterial(1, { e: 210e9, g: 80e9, alpha: 1.2e-5, d: 7850 });
  solver.domain.createCrossSection(1, { a: 0.01, iy: 1e-5, h: 0.2, k: 1e32 });
  solver.domain.createBeam2D(1, [1, 2], 1, 1);
  return serializeModel(solver, [])!;
};

const loadIntoProject = (span: number) => {
  const projectStore = useProjectStore();
  projectStore.solver = new LinearStaticSolver();
  projectStore.dimensions = [];
  deserializeModel(beamModel(span), projectStore.solver, projectStore.dimensions);
  return projectStore;
};

describe('the recent structures', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    undoRedoManager.clearHistory();
  });

  it('keeps a replaced model, newest first, and survives a reload', () => {
    const store = useRecentStructuresStore();

    expect(store.remember(beamModel(3), 'clear')).toBe(true);
    expect(store.remember(beamModel(4), 'link')).toBe(true);

    setActivePinia(createPinia());
    const reloaded = useRecentStructuresStore();

    expect(reloaded.entries.map((e) => e.reason)).toEqual(['link', 'clear']);
    expect(reloaded.entries[0]).toMatchObject({ nodes: 2, elements: 1 });
  });

  it(`keeps at most ${RECENT_STRUCTURES_LIMIT}`, () => {
    const store = useRecentStructuresStore();

    for (let span = 1; span <= RECENT_STRUCTURES_LIMIT + 3; span++) store.remember(beamModel(span), 'clear');

    expect(store.entries).toHaveLength(RECENT_STRUCTURES_LIMIT);
    expect(store.entries[0].model).toBe(beamModel(RECENT_STRUCTURES_LIMIT + 3));
  });

  it('moves a model already in the list to the top instead of repeating it', () => {
    const store = useRecentStructuresStore();

    store.remember(beamModel(3), 'clear');
    store.remember(beamModel(4), 'clear');
    store.remember(beamModel(3), 'link');

    expect(store.entries.map((e) => [e.model, e.reason])).toEqual([
      [beamModel(3), 'link'],
      [beamModel(4), 'clear'],
    ]);
  });

  it('skips empty models and the untouched starter frame', () => {
    const store = useRecentStructuresStore();

    expect(store.remember(serializeModel(new LinearStaticSolver(), []), 'clear')).toBe(false);
    expect(store.remember(null, 'clear')).toBe(false);

    // Built twice, so the dimension ids differ as they would across sessions.
    const solver = new LinearStaticSolver();
    const dimensions: DimensionLine[] = [];
    buildStarterModel(solver, dimensions);
    expect(store.remember(serializeModel(solver, dimensions), 'clear')).toBe(false);

    // As it comes back from localStorage after a reload.
    const reloaded = new LinearStaticSolver();
    const reloadedDimensions: DimensionLine[] = [];
    deserializeModel(serializeModel(solver, dimensions)!, reloaded, reloadedDimensions);
    expect(store.remember(serializeModel(reloaded, reloadedDimensions), 'clear')).toBe(false);

    // The frame a first visit in US units opens with is no more worth keeping
    const us = new LinearStaticSolver();
    const usDimensions: DimensionLine[] = [];
    buildStarterModel(us, usDimensions, 'us');
    expect(store.remember(serializeModel(us, usDimensions), 'clear')).toBe(false);

    expect(store.entries).toEqual([]);
  });

  it('drops the oldest entries when storage is full, instead of failing', () => {
    const store = useRecentStructuresStore();
    store.remember(beamModel(3), 'clear');

    const setItem = localStorage.setItem.bind(localStorage);
    const spy = vi.spyOn(localStorage, 'setItem').mockImplementation((key: string, value: string) => {
      if (key === RECENT_STRUCTURES_KEY && JSON.parse(value).length > 1) throw new Error('QuotaExceededError');
      setItem(key, value);
    });

    try {
      expect(store.remember(beamModel(4), 'clear')).toBe(true);
    } finally {
      spy.mockRestore();
    }

    expect(store.entries.map((e) => e.model)).toEqual([beamModel(4)]);
  });

  it('ignores whatever else is stored under its key', () => {
    localStorage.setItem(RECENT_STRUCTURES_KEY, '{"not": "a list"}');
    expect(useRecentStructuresStore().entries).toEqual([]);

    setActivePinia(createPinia());
    localStorage.setItem(RECENT_STRUCTURES_KEY, '[{"id": 1}]');
    expect(useRecentStructuresStore().entries).toEqual([]);
  });
});

describe('replacing the model', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    undoRedoManager.clearHistory();
  });

  it('can be undone after a clear, and keeps the cleared model', () => {
    const projectStore = loadIntoProject(5);
    const before = serializeModel(projectStore.solver, projectStore.dimensions);

    expect(replaceModel('clear', () => resetModel())).toBe(true);
    expect(projectStore.solver.domain.nodes.size).toBe(0);

    undoModelChange();

    expect(serializeModel(projectStore.solver, projectStore.dimensions)).toBe(before);
    expect(useRecentStructuresStore().entries[0]).toMatchObject({ reason: 'clear', model: before });
  });

  it('puts the model back when the replacement fails halfway', () => {
    const projectStore = loadIntoProject(5);
    const before = serializeModel(projectStore.solver, projectStore.dimensions);

    expect(() =>
      replaceModel('file', () => {
        resetModel();
        throw new Error('broken file');
      })
    ).toThrow('broken file');

    expect(serializeModel(projectStore.solver, projectStore.dimensions)).toBe(before);
    expect(useRecentStructuresStore().entries).toEqual([]);
  });

  it('saves nothing when the model did not change', () => {
    loadIntoProject(5);

    expect(replaceModel('restore', () => {})).toBe(false);
    expect(useRecentStructuresStore().entries).toEqual([]);
  });
});
