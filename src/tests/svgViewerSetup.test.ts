import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { DofID } from 'ts-fem';
import { MouseMode } from '@/mouse';
import { useAppStore } from '@/store/app';
import { useClipboardStore } from '@/store/clipboard';
import { i18n } from '@/plugins/i18n';
import SVGViewer from '@/components/SVGViewer.vue';
import { useProjectStore } from '@/store/project';

/**
 * The drawing hands parts of its state to the overlays that draw on top of it, and a watch or a
 * provide written above the thing it reads throws while the component is being set up - which
 * shows up only as a warning in the console, with the drawing half built. So does a prop handed
 * over with the wrong type. Mounting it here says so as a failure instead.
 */
const mountViewer = () => {
  const errors: unknown[] = [];

  const wrapper = mount(SVGViewer, {
    props: { id: 'viewer' },
    global: {
      plugins: [createVuetify(), i18n],
      config: {
        errorHandler: (e: unknown) => errors.push(e),
        // Vue reports a bad prop or a missing injection as a warning, not an error. Components the
        // harness does not register are the test's own doing and say nothing about the drawing, and
        // left as plain elements they refuse props named like a DOM property (`prefix`).
        warnHandler: (message: string) => {
          if (message.startsWith('Failed to resolve component')) return;
          if (/^Failed setting prop "\w+" on <v-/.test(message)) return;
          errors.push(message);
        },
      },
    },
  });

  return { wrapper, errors };
};

describe('the drawing', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('sets up without an error on an empty model', () => {
    const { wrapper, errors } = mountViewer();

    expect(errors).toEqual([]);
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('sets up without an error on a model with something in it', () => {
    const projectStore = useProjectStore();
    const domain = projectStore.solver.domain;

    domain.createNode(1, [0, 0, 0], [DofID.Dx, DofID.Dz]);
    domain.createNode(2, [4, 0, 0], [DofID.Dz]);
    domain.createMaterial(1, { e: 210000e6, g: 8.75e10, alpha: 12e-6, d: 4000 });
    domain.createCrossSection(1, { a: 1, iy: 8.356e-5, iz: 1, dyz: 999991, h: 1, k: 1e32, j: 99999 });
    domain.createBeam2D(1, [1, 2], 1, 1);

    const { wrapper, errors } = mountViewer();

    expect(errors).toEqual([]);
    expect(wrapper.findAll('g.element').length).toBeGreaterThan(0);
  });

  /**
   * A model can hold an element whose node is gone: saved by a version that let one through, or in
   * an old link. The solver reports it; the drawing has to leave it out rather than fail on it.
   */
  const withMissingNode = () => {
    const domain = useProjectStore().solver.domain;

    domain.createNode(1, [0, 0, 0], [DofID.Dx, DofID.Dz]);
    domain.createNode(2, [4, 0, 0], [DofID.Dz]);
    domain.createMaterial(1, { e: 210000e6, g: 8.75e10, alpha: 12e-6, d: 4000 });
    domain.createCrossSection(1, { a: 1, iy: 8.356e-5, iz: 1, dyz: 999991, h: 1, k: 1e32, j: 99999 });
    domain.createBeam2D(1, [1, 2], 1, 1);
    domain.createBeam2D(2, [2, 10], 1, 1);

    const loadCase = useProjectStore().solver.loadCases[0];
    loadCase.createBeamElementUniformEdgeLoad('2', [0, 1000], true);
    loadCase.createBeamConcentratedLoad('2', [0.5, 0, 1000], true);
    loadCase.createBeamTemperatureLoad('2', [10, 0]);
    // and one on an element that is not there at all
    loadCase.createBeamElementUniformEdgeLoad('7', [0, 1000], true);
  };

  it('draws a model with an element whose node is gone, leaving that element out', () => {
    withMissingNode();

    const { wrapper, errors } = mountViewer();

    expect(errors).toEqual([]);
    expect(wrapper.findAll('g.element').length).toBeGreaterThan(0);
  });

  it('previews a paste of such an element without failing on it', async () => {
    withMissingNode();
    useClipboardStore().select({
      nodes: ['1', '2'],
      elements: ['1', '2'],
      nodalLoads: [],
      elementLoads: [],
      prescribedBC: [],
      dimensions: [],
    });

    const { errors } = mountViewer();
    useAppStore().mouseMode = MouseMode.PASTE_CLIPBOARD;
    await new Promise((r) => setTimeout(r, 0));

    expect(errors).toEqual([]);
  });
});
