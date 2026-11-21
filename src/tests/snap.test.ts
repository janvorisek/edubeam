import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { DofID } from '@edubeam/fem';
import { useProjectStore } from '@/store/project';
import { snapPoint, type SnapInput } from '@/utils/snap';

/** One engine for every tool: what a point put down near a 6 m beam snaps to, and so shows */
describe('the snapping engine', () => {
  let input: (x: number, y: number, more?: Partial<SnapInput>) => SnapInput;

  beforeEach(() => {
    setActivePinia(createPinia());
    const store = useProjectStore();
    const domain = store.solver.domain;
    domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
    domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e32 });
    domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]);
    domain.createNode('2', [6, 0, 0], [DofID.Dz]);
    domain.createBeam2D('a', ['1', '2'], 'm', 'cs');
    input = (x, y, more = {}) => ({
      nodes: domain.nodes,
      beams: store.beams,
      exact: { x, y },
      grid: { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 },
      reach: 0.2,
      takes: 'either',
      snapping: true,
      ...more,
    });
  });

  it('takes a node first, then a member’s middle, its thirds, anywhere on it, the grid', () => {
    expect(snapPoint(input(5.9, 0.1))).toMatchObject({ kind: 'node', x: 6, y: 0 });
    expect(snapPoint(input(3.25, 0.1))).toMatchObject({ kind: 'middle', x: 3, y: 0 });
    expect(snapPoint(input(2.15, 0.1))).toMatchObject({ kind: 'third', x: 2, y: 0 });
    expect(snapPoint(input(1.04, 0.1))).toMatchObject({ kind: 'member', x: 1, y: 0 });
    expect(snapPoint(input(1.04, 2.03))).toMatchObject({ kind: 'grid', x: 1, y: 2 });
  });

  it('pulls to the middle from further than to a node', () => {
    // 0.25 m off the middle: beyond a node's reach of 0.2, within the middle's
    expect(snapPoint(input(3.25, 0))).toMatchObject({ kind: 'middle' });
  });

  it('with snapping off, keeps the marks and the grid out, but not nodes and members', () => {
    const onMember = snapPoint(input(3.05, 0.1, { snapping: false }));
    expect(onMember.kind).toBe('member');
    expect(onMember.x).toBeCloseTo(3.1);
    expect(snapPoint(input(5.9, 0.1, { snapping: false }))).toMatchObject({ kind: 'node' });
    expect(snapPoint(input(1.04, 2.03, { snapping: false })).kind).toBe('free');
  });

  it('puts a load over a whole member on it without a mark along it', () => {
    expect(snapPoint(input(3.05, 0.1, { takes: 'whole-member' })).kind).toBe('member');
    expect(snapPoint(input(5.95, 0.05, { takes: 'whole-member' })).kind).toBe('member');
  });

  it('is the node where a grid point or a member end comes out on one', () => {
    // Out of the node's reach, on the member, its grid point projected to the member's end
    expect(snapPoint(input(5.7, 0.1, { grid: { x: 6, y: 0 } }))).toMatchObject({ kind: 'node', x: 6 });
    // Off the structure, on the grid point that is a node
    expect(snapPoint(input(0.5, -0.5, { grid: { x: 0, y: 0 } }))).toMatchObject({ kind: 'node', x: 0 });
  });

  it('only on what the tool takes', () => {
    expect(snapPoint(input(5.9, 0.1, { takes: 'member' }))).toMatchObject({ kind: 'member' });
    expect(snapPoint(input(3.05, 0.1, { takes: 'node' })).kind).toBe('grid');
  });
});
