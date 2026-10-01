import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { defineComponent, h, onMounted } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { LinearStaticSolver, DofID } from 'ts-fem';
import { i18n } from '@/plugins/i18n';
import { useProjectStore } from '@/store/project';
import { useAppStore } from '@/store/app';
import { angle, axisConvention, axisLetters, vertical } from '@/utils/axisConvention';
import { buildElementResultRows, buildNodeResultRows, type ResultUnits } from '@/utils/exportResults';
import { findMechanismIssues } from '@/utils/validateSolverModel';
import { nodeLcsAngle } from '@/utils/nodalLcs';
import ContextMenuNode from '@/components/ContextMenuNode.vue';
import EditNode from '@/components/dialogs/EditNode.vue';

afterEach(() => {
  axisConvention.value = 'z-down';
});

const SI: ResultUnits = {
  lengthLabel: 'm',
  displacementLabel: 'm',
  angleLabel: 'rad',
  forceLabel: 'kN',
  momentLabel: 'kNm',
  length: (v) => v,
  displacement: (v) => v,
  force: (v) => v / 1000,
  moment: (v) => v / 1000,
};

/** Cantilever pointing right from a support 3 m up, with 1 kN of gravity at the tip. */
const buildSolved = () => {
  const ls = new LinearStaticSolver();
  const d = ls.domain;
  d.createMaterial('m', { d: 7850, e: 210e9, g: 80e9, alpha: 12e-6 });
  d.createCrossSection('cs', { a: 0.01, iy: 8e-5, h: 0.2, k: 1e32 });
  d.createNode('1', [0, 0, -3], [DofID.Dx, DofID.Dz, DofID.Ry]);
  d.createNode('2', [3, 0, -3], []);
  d.createBeam2D('B1', ['1', '2'], 'm', 'cs');
  ls.loadCases[0].createNodalLoad('2', [0, 0, 1000, 0, 0, 0]);
  ls.solve();
  return ls;
};

describe('axis convention helpers', () => {
  it('leave everything alone for z down', () => {
    expect(vertical(3, 'z-down')).toBe(3);
    expect(angle(30, 'z-down')).toBe(30);
    expect(axisLetters('z-down')).toEqual({ v: 'z', r: 'y' });
  });

  it('flip vertical components and angles for y up, and swap the letters', () => {
    expect(vertical(3, 'y-up')).toBe(-3);
    expect(vertical(vertical(3, 'y-up'), 'y-up')).toBe(3);
    expect(angle(30, 'y-up')).toBe(-30);
    expect(axisLetters('y-up')).toEqual({ v: 'y', r: 'z' });
  });

  it('never show a negative zero, and keep NaN for validation', () => {
    expect(Object.is(vertical(0, 'y-up'), 0)).toBe(true);
    expect(vertical(NaN, 'y-up')).toBeNaN();
  });
});

describe('results export', () => {
  it('reads the same cantilever in both conventions', () => {
    const zDown = buildNodeResultRows(buildSolved(), SI);
    axisConvention.value = 'y-up';
    const yUp = buildNodeResultRows(buildSolved(), SI);

    expect(yUp[0]).toEqual([
      'Node',
      'x [m]',
      'y [m]',
      'Dx [m]',
      'Dy [m]',
      'Rz [rad]',
      'Rx [kN]',
      'Ry [kN]',
      'Mz [kNm]',
    ]);

    const [support, tip] = [yUp[1], yUp[2]];
    const deflection = (1000 * 3 ** 3) / (3 * 210e9 * 8e-5);

    // A node 3 m above the origin is at y = +3, and gravity deflects the tip downward: negative.
    expect(support[2]).toBe(3);
    expect(tip[4]).toBeCloseTo(-deflection, 9);
    // The support pushes up with the whole 1 kN.
    expect(support[7]).toBeCloseTo(1, 9);

    // Vertical columns flip sign, everything else - x, rotations, moments - reads the same.
    for (const row of [1, 2]) {
      for (const col of [1, 3, 5, 6, 8]) expect(yUp[row][col]).toEqual(zDown[row][col]);
      for (const col of [2, 4, 7]) {
        if (zDown[row][col] === null) expect(yUp[row][col]).toBeNull();
        else expect(yUp[row][col]).toBeCloseTo(-(zDown[row][col] as number), 12);
      }
    }
  });

  it('flips only the vertical end forces', () => {
    const zDown = buildElementResultRows(buildSolved(), SI)[1];
    axisConvention.value = 'y-up';
    const yUp = buildElementResultRows(buildSolved(), SI)[1];

    // [label, node 1, node 2, N1, V1, M1, N2, V2, M2]
    for (const col of [3, 5, 6, 8]) expect(yUp[col]).toEqual(zDown[col]);
    for (const col of [4, 7]) expect(yUp[col]).toBeCloseTo(-(zDown[col] as number), 12);
  });
});

describe('solve diagnostics', () => {
  /** What a mechanism leaves behind: node 2 free to drop and spin, by an absurd amount. */
  const runaway = {
    loadCases: [{ r: { toArray: () => [1e12, 1e12] } }],
    nodeCodeNumbers: new Map([['2', { [DofID.Dz]: 0, [DofID.Ry]: 1 }]]),
    neq: 2,
  } as unknown as LinearStaticSolver;

  it('names the DOFs with the letters on screen', () => {
    const [issue] = findMechanismIssues(runaway);

    expect(issue.message).toContain('(Dz)');
    expect(issue.message).toContain('(Ry)');

    // Messages are read when shown, so switching relabels an issue already on screen.
    axisConvention.value = 'y-up';
    expect(issue.message).toContain('(Dy)');
    expect(issue.message).toContain('(Rz)');
  });
});

/** Stands in for the Vuetify field, so a test can type into it and commit. */
const TextFieldStub = defineComponent({
  props: { modelValue: { type: String, default: '' }, label: { type: String, default: '' } },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        value: props.modelValue,
        'data-label': props.label,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        onChange: (e: Event) => emit('change', e),
      });
  },
});

/** A form that reports itself valid, as the real one does once its rules pass. */
const FormStub = defineComponent({
  emits: ['update:modelValue'],
  setup(_, { emit, slots }) {
    onMounted(() => emit('update:modelValue', true));
    return () => h('form', slots.default?.());
  },
});

const typeInto = async (field: ReturnType<ReturnType<typeof mount>['find']>, value: string) => {
  (field.element as HTMLInputElement).value = value;
  await field.trigger('input');
};

describe('editing in y up', () => {
  const setUp = () => {
    setActivePinia(createPinia());
    useAppStore().axisConvention = 'y-up';

    const projectStore = useProjectStore();
    const solver = new LinearStaticSolver();
    // 2 m above the origin, with a support tilted 20° clockwise on screen.
    solver.domain.createNode(1, [1, 0, -2], [DofID.Dx, DofID.Dz]);
    projectStore.solver = solver;

    const node = solver.domain.nodes.get('1')!;
    node.updateLcs({ locx: [Math.cos(Math.PI / 9), 0, Math.sin(Math.PI / 9)], locy: [0, 1, 0] });

    return { projectStore, node };
  };

  it('the store and the helpers share one setting', () => {
    setUp();
    expect(axisConvention.value).toBe('y-up');
    expect(useAppStore().axes).toEqual({ v: 'y', r: 'z' });
  });

  it('shows and takes back the node coordinates and support angle', async () => {
    const { node } = setUp();

    const wrapper = mount(EditNode, {
      props: { label: '1' },
      shallow: true,
      global: {
        plugins: [i18n],
        renderStubDefaultSlot: true,
        stubs: { 'v-text-field': TextFieldStub, 'v-form': FormStub },
      },
    });
    await wrapper.vm.$nextTick();

    const [x, y, alpha] = wrapper.findAll('input');
    expect(y.attributes('data-label')).toBe('Y-coordinate');
    expect((y.element as HTMLInputElement).value).toBe('2');
    expect(Number((alpha.element as HTMLInputElement).value)).toBeCloseTo(-20, 6);
    expect(wrapper.text()).not.toContain('Dz');

    await typeInto(x, '1');
    await typeInto(y, '5');
    await typeInto(alpha, '45');
    // Vuetify is not installed here, so the buttons render as bare elements that keep their listeners.
    await wrapper.findAll('v-btn')[0].trigger('click');

    expect(node.coords).toEqual([1, 0, -5]);
    expect(nodeLcsAngle(node)).toBeCloseTo(-45, 6);
  });

  it('applies a typed support angle through the node menu', async () => {
    const { projectStore, node } = setUp();
    projectStore.selection.type = 'node';
    projectStore.selection.label = '1';

    const wrapper = mount(ContextMenuNode, {
      shallow: true,
      global: { plugins: [i18n], stubs: { 'v-text-field': TextFieldStub } },
    });

    const field = wrapper.find('input');
    expect(Number((field.element as HTMLInputElement).value)).toBeCloseTo(-20, 6);

    await typeInto(field, '30');
    await field.trigger('change');

    expect(nodeLcsAngle(node)).toBeCloseTo(-30, 6);
  });
});

/**
 * A letter typed straight into a label shows z-down names in the y-up convention. Axis letters
 * come from `axes` in the store or `axisLetters()`, and locale texts take them as {v} and {r}.
 */
describe('axis letters', () => {
  const src = join(process.cwd(), 'src');
  const skipped = [
    // Nothing opens the dialogs in Dialogs.vue any more, and Results.vue is not mounted anywhere.
    'components/Dialogs.vue',
    'components/Results.vue',
    // Iy and Iz there are the section's own axes, whichever way the global ones point.
    'components/dialogs/PolygonSectionEditor.vue',
    // Parses the old XML format, whose names are fixed.
    'utils/loadXmlFile.ts',
  ];
  const hardcoded = /<sub>[yz]\d?<\/sub>|\blabel="[DFMRV][yz]\b|'[DFMRV][yz]'|>[DFMRV][yz]</;

  it('are never hardcoded in components', () => {
    const offenders = readdirSync(src, { recursive: true, encoding: 'utf-8' })
      .filter((path) => /\.(vue|ts)$/.test(path) && !path.startsWith('tests') && !skipped.includes(path))
      .filter((path) => hardcoded.test(readFileSync(join(src, path), 'utf-8')));

    expect(offenders).toEqual([]);
  });
});
