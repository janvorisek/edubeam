import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { BeamConcentratedLoad, BeamElementUniformEdgeLoad, DofID } from '@edubeam/fem';
import { useProjectStore } from '@/store/project';
import { applyNodeLcsAngle } from '@/utils';
import type { Beam2D, Node } from '@edubeam/fem';
import { asToolLoads, movableTakes, moveLoad, putToolLoad, targetOf, toolLoadFits } from '@/utils/toolTarget';
import { snapPoint, type ModelPoint, type SnapTakes } from '@/utils/snap';

/** What a click lands on, as the viewer works it out: the snap engine's point, as a tool's target */
const toolTarget = (
  nodes: ReadonlyMap<string, Node>,
  beams: readonly Beam2D[],
  exact: ModelPoint,
  grid: ModelPoint,
  reach: number,
  takes: SnapTakes = 'either',
  snapping = true
) => targetOf(snapPoint({ nodes, beams, exact, grid, reach, takes, snapping }));

/** A 4 m beam on the x axis and a 3 m column up from its end (z down, so up is -z) */
const build = () => {
  const store = useProjectStore();
  const domain = store.solver.domain;
  domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
  domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e32 });
  domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]);
  domain.createNode('2', [4, 0, 0], [DofID.Dz]);
  domain.createNode('3', [4, 0, -3], []);
  domain.createBeam2D('a', ['1', '2'], 'm', 'cs');
  domain.createBeam2D('b', ['2', '3'], 'm', 'cs');
  return store;
};

describe('what a support or load tool click lands on', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('takes the nearest node within reach before any member', () => {
    const store = build();
    const target = toolTarget(store.solver.domain.nodes, store.beams, { x: 3.9, y: 0.05 }, { x: 4, y: 0 }, 0.2);

    expect(target && 'node' in target && target.node.label).toBe('2');
  });

  it('takes a member where the snapped pointer projects onto it', () => {
    const store = build();
    // Decided by where the pointer is, placed where it snaps to
    const target = toolTarget(store.solver.domain.nodes, store.beams, { x: 0.68, y: 0.1 }, { x: 0.75, y: 0 }, 0.2);

    expect(target && 'beam' in target && target.beam.label).toBe('a');
    expect(target && 'beam' in target && target.at).toBeCloseTo(0.75);
  });

  it('measures along a member from its first node, kept within its length', () => {
    const store = build();
    const up = toolTarget(store.solver.domain.nodes, store.beams, { x: 4.1, y: -1 }, { x: 4, y: -1 }, 0.2);
    const past = toolTarget(store.solver.domain.nodes, store.beams, { x: 4.05, y: -2.9 }, { x: 4, y: -3.5 }, 0.05);

    expect(up && 'beam' in up && up.beam.label).toBe('b');
    expect(up && 'beam' in up && up.at).toBeCloseTo(1);
    // Past the member's end: kept within it, where its node is - and so that node
    expect(past && 'node' in past && past.node.label).toBe('3');
  });

  it('snaps a load on a member to its middle and its thirds, within reach', () => {
    const store = build();
    const nodes = store.solver.domain.nodes;
    const near = (x: number) => toolTarget(nodes, store.beams, { x, y: 0.05 }, { x, y: 0 }, 0.2);

    expect(near(2.1)).toMatchObject({ at: 2 });
    expect(near(1.25)).toMatchObject({ at: 4 / 3 });
    expect(near(2.75)).toMatchObject({ at: 8 / 3 });
    // Away from any mark it lands where the pointer is
    expect(near(0.8)).toMatchObject({ at: 0.8 });
  });

  it('leaves the marks alone with snapping off', () => {
    const store = build();
    const target = toolTarget(
      store.solver.domain.nodes,
      store.beams,
      { x: 2.1, y: 0.05 },
      { x: 2.1, y: 0 },
      0.2,
      'either',
      false
    );

    expect(target).toMatchObject({ at: 2.1 });
  });

  it('puts a load along a member on the member, even right at its node', () => {
    const store = build();
    const target = toolTarget(
      store.solver.domain.nodes,
      store.beams,
      { x: 0.1, y: 0 },
      { x: 0, y: 0 },
      0.2,
      'whole-member'
    );

    expect(target && 'beam' in target && target.beam.label).toBe('a');
  });

  it('lands on nothing away from the structure', () => {
    const store = build();

    expect(toolTarget(store.solver.domain.nodes, store.beams, { x: 2, y: 1 }, { x: 2, y: 1 }, 0.2)).toBeNull();
  });
});

describe('the load a load tool click puts on', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('is a nodal force or moment on a node, in global axes', () => {
    const store = build();
    const lc = store.solver.loadCases[0];
    const node = store.solver.domain.nodes.get('3')!;

    putToolLoad(lc, { node }, { kind: 'force', fx: 0, fz: 10e3, local: false });
    putToolLoad(lc, { node }, { kind: 'moment', my: 5e3 });

    expect(lc.nodalLoadList.map((l) => [l.target, l.values[DofID.Dz], l.values[DofID.Ry], l.lcs])).toEqual([
      ['3', 10e3, 0, false],
      ['3', 0, 5e3, false],
    ]);
  });

  it('is a point load where it was put on a member, or a distributed load along it, in the axes asked for', () => {
    const store = build();
    const lc = store.solver.loadCases[0];
    const beam = store.beams.find((b) => b.label === 'b')!;

    putToolLoad(lc, { beam, at: 1 }, { kind: 'force', fx: 2e3, fz: 0, local: false });
    putToolLoad(lc, { beam, at: 1 }, { kind: 'udl', qx: 0, qz: 4e3, local: true });

    const [point, udl] = lc.elementLoadList;
    if (!(point instanceof BeamConcentratedLoad) || !(udl instanceof BeamElementUniformEdgeLoad)) {
      throw new Error('expected a point load and a distributed one');
    }
    expect(point.values).toEqual([2e3, 0, 0, 1]);
    expect(point.lcs).toBe(false);
    expect(udl.values).toEqual([0, 4e3]);
    expect(udl.lcs).toBe(true);
  });

  it('is not put on when it is zero, or distributed on a node', () => {
    const store = build();
    const node = store.solver.domain.nodes.get('2')!;
    const beam = store.beams[0];

    expect(toolLoadFits({ node }, { kind: 'force', fx: 0, fz: 0, local: false })).toBe(false);
    expect(toolLoadFits({ node }, { kind: 'moment', my: Number.NaN })).toBe(false);
    expect(toolLoadFits({ node }, { kind: 'udl', qx: 0, qz: 1, local: true })).toBe(false);
    expect(toolLoadFits({ beam, at: 0 }, { kind: 'udl', qx: 0, qz: 1, local: true })).toBe(true);
  });
});

describe('moving a load already on the model', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('moves a nodal load to another node, and nothing else', () => {
    const store = build();
    const lc = store.solver.loadCases[0];
    lc.createNodalLoad('2', { [DofID.Dz]: 10e3 });
    const load = lc.nodalLoadList[0];

    expect(movableTakes(load)).toBe('node');
    expect(moveLoad(load, { node: store.solver.domain.nodes.get('2')! })).toBe(false);
    expect(moveLoad(load, { beam: store.beams[0], at: 1 })).toBe(false);
    expect(moveLoad(load, { node: store.solver.domain.nodes.get('3')! })).toBe(true);
    expect(load.target).toBe('3');
  });

  it('keeps a force given in node axes pointing the same way on a node without them', () => {
    const store = build();
    const lc = store.solver.loadCases[0];
    // Node 2 turned 90 degrees: its own x runs down the screen (global +z)
    applyNodeLcsAngle(store.solver.domain.nodes.get('2')!, 90);
    lc.createNodalLoad('2', { [DofID.Dx]: 10e3, [DofID.Dz]: 0 }, true);
    const load = lc.nodalLoadList[0];

    moveLoad(load, { node: store.solver.domain.nodes.get('1')! });

    expect(load.values[DofID.Dx]).toBeCloseTo(0);
    expect(load.values[DofID.Dz]).toBeCloseTo(10e3);
  });

  it('slides a point load along its member and onto another, keeping its values', () => {
    const store = build();
    const lc = store.solver.loadCases[0];
    lc.createBeamConcentratedLoad('a', [0, 5e3, 2e3, 1], true);
    const load = lc.elementLoadList[0];
    const [a, b] = store.beams;

    expect(moveLoad(load, { beam: a, at: 1 })).toBe(false);
    expect(moveLoad(load, { beam: a, at: 2 })).toBe(true);
    expect(moveLoad(load, { beam: b, at: 1.5 })).toBe(true);
    expect([load.target, ...(load as BeamConcentratedLoad).values]).toEqual(['b', 0, 5e3, 2e3, 1.5]);
    // Drawn as a force and a moment together
    expect(asToolLoads(load).map((l) => l.kind)).toEqual(['force', 'moment']);
  });

  it('moves a load along a whole member to another member', () => {
    const store = build();
    const lc = store.solver.loadCases[0];
    lc.createBeamElementUniformEdgeLoad('a', [0, 4e3], true);
    const load = lc.elementLoadList[0];

    expect(movableTakes(load)).toBe('whole-member');
    expect(moveLoad(load, { beam: store.beams[0], at: 0 })).toBe(false);
    expect(moveLoad(load, { beam: store.beams[1], at: 0 })).toBe(true);
    expect(load.target).toBe('b');
    expect(asToolLoads(load)).toEqual([{ kind: 'udl', qx: 0, qz: 4e3, local: true }]);
  });
});
