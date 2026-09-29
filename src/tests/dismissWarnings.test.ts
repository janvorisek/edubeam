import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { DofID } from 'ts-fem';
import { useProjectStore } from '@/store/project';

/** A properly held cantilever, so the only diagnostics are the warnings the tests add. */
const build = () => {
  const store = useProjectStore();
  const domain = store.solver.domain;

  domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
  domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e-3 });
  domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
  domain.createNode('2', [4, 0, 0], []);
  domain.createBeam2D('b', ['1', '2'], 'm', 'cs');

  return store;
};

/** `solve` is throttled; let each call through as a separate edit would. */
const solve = (store: ReturnType<typeof useProjectStore>) => {
  store.solve();
  vi.advanceTimersByTime(100);
};

describe('dismissing warnings', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it('keeps a closed kind of warning quiet while more of it is added', () => {
    const store = build();
    store.solver.domain.createNode('3', [6, 0, 0], []);
    solve(store);
    expect(store.visibleWarnings.map((w) => w.code)).toEqual(['NODE_NOT_CONNECTED']);

    store.dismissWarnings();

    // Adding nodes one at a time is how a model gets drawn; it must not bring the banner back.
    store.solver.domain.createNode('4', [7, 0, 0], []);
    store.solver.domain.createNode('5', [8, 0, 0], []);
    solve(store);

    expect(store.solveDiagnostics.warnings).toHaveLength(3);
    expect(store.visibleWarnings).toEqual([]);
  });

  it('still shows a different kind of warning', () => {
    const store = build();
    store.solver.domain.createNode('3', [6, 0, 0], []);
    solve(store);
    store.dismissWarnings();

    store.solver.domain.createNode('4', [7, 0, 0], [DofID.Dz]);
    solve(store);

    expect(store.visibleWarnings.map((w) => w.code)).toEqual(['SUPPORTED_NODE_NOT_CONNECTED']);
  });
});
