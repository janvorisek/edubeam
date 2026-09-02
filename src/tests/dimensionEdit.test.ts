import { describe, it, expect } from 'vitest';
import { computed, reactive, watch, nextTick } from 'vue';
import { createDimensionPoint, resolveDimensionPoints, type DimensionLine } from '../types/dimension';
import { parseFloat2 } from '../utils';

/** Enough of a ts-fem node for the lookup: a label and coordinates. */
type TestNode = { label: string; coords: [number, number, number] };

type NodeLookup = Parameters<typeof resolveDimensionPoints>[1];

const lookup = (nodes: Map<string, TestNode>) => nodes as unknown as NodeLookup;

const model = (p1: ReturnType<typeof createDimensionPoint>, p2: ReturnType<typeof createDimensionPoint>) => {
  const nodes = reactive(
    new Map<string, TestNode>([
      ['1', { label: '1', coords: [0, 0, 0] }],
      ['2', { label: '2', coords: [4, 0, 0] }],
    ])
  );

  const dimension = reactive({ distance: 1, points: [p1, p2] } as DimensionLine);

  return { nodes, dimension };
};

describe('resolveDimensionPoints', () => {
  it('reads a snapped end from its node, not from the stored coordinates', () => {
    const { nodes, dimension } = model(createDimensionPoint(0, 0, '1'), createDimensionPoint(4, 0, '2'));

    nodes.get('1')!.coords[0] = 7;
    nodes.get('1')!.coords[2] = -2;

    const points = resolveDimensionPoints(dimension, lookup(nodes))!;

    expect([points[0].x, points[0].y]).toEqual([7, -2]);
    expect([points[1].x, points[1].y]).toEqual([4, 0]);
  });

  it('keeps the stored coordinates of an end that snaps to nothing', () => {
    const { nodes, dimension } = model(createDimensionPoint(1.5, 2.5, null), createDimensionPoint(4, 0, '2'));

    nodes.get('2')!.coords[0] = 9;

    const points = resolveDimensionPoints(dimension, lookup(nodes))!;

    expect([points[0].x, points[0].y]).toEqual([1.5, 2.5]);
    expect(points[1].x).toBe(9);
  });

  it('falls back to the stored coordinates when the node is gone', () => {
    const { nodes, dimension } = model(createDimensionPoint(3, 1, '404'), createDimensionPoint(4, 0, '2'));

    expect(resolveDimensionPoints(dimension, lookup(nodes))![0].x).toBe(3);
  });

  it('gives nothing for a dimension with only one end, as the preview of one being drawn has', () => {
    const { nodes } = model(createDimensionPoint(0, 0, '1'), createDimensionPoint(4, 0, '2'));
    const halfBuilt = { points: [createDimensionPoint(0, 0, '1')] } as unknown as DimensionLine;

    expect(resolveDimensionPoints(halfBuilt, lookup(nodes))).toBeNull();
  });
});

/** The edit panel's field sync, wired the way ContextMenuDimension.vue wires it. */
const editPanel = (dimension: DimensionLine, nodes: Map<string, TestNode>) => {
  const fields = reactive({ x1: '', y1: '', x2: '', y2: '' });
  const resolvedPoints = computed(() => resolveDimensionPoints(dimension, lookup(nodes)));

  const setInput = (key: keyof typeof fields, value: number | undefined) => {
    if (value !== undefined && fields[key] !== '' && parseFloat2(fields[key]) === value) return;
    fields[key] = value?.toString() ?? '';
  };

  watch(
    resolvedPoints,
    () => {
      const points = resolvedPoints.value;
      setInput('x1', points?.[0].x);
      setInput('y1', points?.[0].y);
      setInput('x2', points?.[1].x);
      setInput('y2', points?.[1].y);
    },
    { immediate: true }
  );

  /** Editing any field pins both ends where the fields say they are. */
  const commit = () => {
    dimension.points = [
      { ...dimension.points[0], x: parseFloat2(fields.x1), y: parseFloat2(fields.y1), sourceNodeLabel: null },
      { ...dimension.points[1], x: parseFloat2(fields.x2), y: parseFloat2(fields.y2), sourceNodeLabel: null },
    ];
  };

  return { fields, commit };
};

describe('the dimension edit panel', () => {
  it('follows a snapped node moved while it is open', async () => {
    const { nodes, dimension } = model(createDimensionPoint(0, 0, '1'), createDimensionPoint(4, 0, '2'));
    const { fields } = editPanel(dimension, nodes);

    expect([fields.x1, fields.y1, fields.x2, fields.y2]).toEqual(['0', '0', '4', '0']);

    nodes.get('1')!.coords[0] = 7;
    nodes.get('1')!.coords[2] = -2;
    await nextTick();

    expect([fields.x1, fields.y1]).toEqual(['7', '-2']);
    expect([fields.x2, fields.y2]).toEqual(['4', '0']);
  });

  it('pins the other end where its node is, not where the dimension last cached it', async () => {
    const { nodes, dimension } = model(createDimensionPoint(0, 0, null), createDimensionPoint(4, 0, '2'));
    const { fields, commit } = editPanel(dimension, nodes);

    nodes.get('2')!.coords[0] = 9;
    await nextTick();

    // editing the free end unsnaps both; the snapped one must stay at 9, not fall back to 4
    fields.x1 = '1';
    commit();
    await nextTick();

    expect(dimension.points[1].x).toBe(9);
    expect(fields.x2).toBe('9');
  });

  it('leaves a half typed value alone when it already means the stored number', async () => {
    const { nodes, dimension } = model(createDimensionPoint(1, 0, null), createDimensionPoint(4, 0, '2'));
    const { fields } = editPanel(dimension, nodes);

    // "1." parses to the 1 the point already holds, so the trailing dot survives the sync
    fields.x1 = '1.';
    await nextTick();

    expect(fields.x1).toBe('1.');
  });
});
