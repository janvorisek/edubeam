import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { DofID } from 'ts-fem';
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
        // harness does not register are the test's own doing and say nothing about the drawing.
        warnHandler: (message: string) => {
          if (!message.startsWith('Failed to resolve component')) errors.push(message);
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
});
