import { describe, it, expect, afterEach } from 'vitest';
import { defineComponent, h, reactive } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { LinearStaticSolver, DofID } from 'ts-fem';
import { i18n } from '@/plugins/i18n';
import { useProjectStore } from '@/store/project';
import { useAppStore } from '@/store/app';
import { undoRedoManager } from '@/CommandManager';
import { axisConvention } from '@/utils/axisConvention';
import ContextMenuDimension from '@/components/ContextMenuDimension.vue';
import {
  createDimensionPoint,
  resolveDimensionPoints,
  type DimensionLine,
  type DimensionPoint,
} from '../types/dimension';

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

/** Stands in for the Vuetify field, so a test can type into a coordinate and commit it. */
const TextFieldStub = defineComponent({
  props: { modelValue: { type: String, default: '' }, label: { type: String, default: '' } },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        'data-label': props.label,
        value: props.modelValue,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        onChange: (e: Event) => emit('change', e),
      });
  },
});

const mountPanel = (p1: DimensionPoint, p2: DimensionPoint) => {
  setActivePinia(createPinia());

  const projectStore = useProjectStore();
  const solver = new LinearStaticSolver();
  solver.domain.createNode(1, [0, 0, 0], [DofID.Dx, DofID.Dz]);
  solver.domain.createNode(2, [4, 0, 0], [DofID.Dx, DofID.Dz]);
  projectStore.solver = solver;

  const dimension: DimensionLine = { id: 'd1', distance: 1, points: [p1, p2] };
  projectStore.dimensions = [dimension];
  projectStore.selection.type = 'dimension';
  projectStore.selection.label = 'd1';

  const wrapper = mount(ContextMenuDimension, {
    shallow: true,
    global: { plugins: [i18n], stubs: { 'v-text-field': TextFieldStub } },
  });

  const field = (label: string) => wrapper.find(`input[data-label="${label}"]`);
  const value = (label: string) => (field(label).element as HTMLInputElement).value;

  /** Types without committing, as a person does before pressing Enter. */
  const type = async (label: string, text: string) => {
    (field(label).element as HTMLInputElement).value = text;
    await field(label).trigger('input');
  };

  const commit = (label: string) => field(label).trigger('change');

  return { projectStore, appStore: useAppStore(), wrapper, value, type, commit };
};

describe('the dimension edit panel', () => {
  afterEach(() => {
    axisConvention.value = 'z-down';
    undoRedoManager.clearHistory();
  });

  it('follows a snapped node moved while it is open', async () => {
    const { projectStore, wrapper, value } = mountPanel(
      createDimensionPoint(0, 0, '1'),
      createDimensionPoint(4, 0, '2')
    );

    expect(['X1', 'Z1', 'X2', 'Z2'].map(value)).toEqual(['0', '0', '4', '0']);

    projectStore.solver.domain.nodes.get('1')!.coords[0] = 7;
    projectStore.solver.domain.nodes.get('1')!.coords[2] = -2;
    projectStore.solver.domain.nodes = new Map(projectStore.solver.domain.nodes);
    await wrapper.vm.$nextTick();

    expect([value('X1'), value('Z1')]).toEqual(['7', '-2']);
  });

  it('pins the other end where its node is, not where the dimension last cached it', async () => {
    const { projectStore, wrapper, type, commit } = mountPanel(
      createDimensionPoint(0, 0, null),
      createDimensionPoint(4, 0, '2')
    );

    projectStore.solver.domain.nodes.get('2')!.coords[0] = 9;
    projectStore.solver.domain.nodes = new Map(projectStore.solver.domain.nodes);
    await wrapper.vm.$nextTick();

    // editing the free end unsnaps both; the snapped one must stay at 9, not fall back to 4
    await type('X1', '1');
    await commit('X1');

    expect(projectStore.dimensions[0].points[0].x).toBe(1);
    expect(projectStore.dimensions[0].points[1]).toMatchObject({ x: 9, sourceNodeLabel: null });
  });

  it('leaves the model alone until the field is committed, and a half typed value with it', async () => {
    const { projectStore, wrapper, value, type } = mountPanel(
      createDimensionPoint(1, 0, null),
      createDimensionPoint(4, 0, null)
    );

    await type('X1', '1.');
    await wrapper.vm.$nextTick();

    expect(value('X1')).toBe('1.');
    expect(projectStore.dimensions[0].points[0].x).toBe(1);
  });

  it('makes each committed edit one step to undo', async () => {
    const { projectStore, wrapper, value, type, commit } = mountPanel(
      createDimensionPoint(0, 0, null),
      createDimensionPoint(4, 0, null)
    );

    await type('X2', '6');
    await commit('X2');
    expect(projectStore.dimensions[0].points[1].x).toBe(6);

    undoRedoManager.undo();
    await wrapper.vm.$nextTick();

    expect(projectStore.dimensions[0].points[1].x).toBe(4);
    // The field has to follow, or the next commit would bring the undone value back
    expect(value('X2')).toBe('4');
  });

  it('reads and writes the vertical coordinate in the axis convention: y up is minus z', async () => {
    axisConvention.value = 'y-up';
    const { projectStore, value, type, commit } = mountPanel(
      createDimensionPoint(0, -3, null),
      createDimensionPoint(4, 0, null)
    );

    // 3 m above the origin is z = -3 in the model, y = 3 on screen
    expect(value('Y1')).toBe('3');

    await type('Y1', '5');
    await commit('Y1');

    expect(projectStore.dimensions[0].points[0].y).toBe(-5);
  });

  it('shows and takes the coordinates in the display length unit', async () => {
    const { projectStore, appStore, wrapper, value, type, commit } = mountPanel(
      createDimensionPoint(0, 0, null),
      createDimensionPoint(3.048, 0, null)
    );

    appStore.units.Length = 'ft';
    await wrapper.vm.$nextTick();
    expect(value('X2')).toBe('10');

    await type('X2', '20');
    await commit('X2');

    expect(projectStore.dimensions[0].points[1].x).toBeCloseTo(6.096, 12);
  });
});
