import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { h, nextTick, provide, ref } from 'vue';
import { DofID } from 'ts-fem';
import HoveredElement from '@/components/HoveredElement.vue';
import { intersectedKey, type Intersected } from '@/types/hover';
import { useProjectStore } from '@/store/project';

const twoBeams = () => {
  const projectStore = useProjectStore();
  const domain = projectStore.solver.domain;

  domain.createNode(1, [0, 0, 0], [DofID.Dx, DofID.Dz]);
  domain.createNode(2, [4, 0, 0], []);
  domain.createNode(3, [8, 0, 0], [DofID.Dz]);
  domain.createMaterial(1, { e: 210000e6, g: 8.75e10, alpha: 12e-6, d: 4000 });
  domain.createCrossSection(1, { a: 1, iy: 8.356e-5, iz: 1, dyz: 999991, h: 1, k: 1e32, j: 99999 });
  domain.createBeam2D(1, [1, 2], 1, 1);
  domain.createBeam2D(2, [2, 3], 1, 1);

  return projectStore;
};

const hover = (intersected: ReturnType<typeof ref<Intersected>>) => {
  let sceneRenders = 0;

  const wrapper = mount({
    setup: () => provide(intersectedKey, intersected as never),
    render() {
      sceneRenders++;
      return h('svg', [
        h('g', 'the whole model'),
        h(HoveredElement, { scale: 10, isZooming: false, resultLabelMode: 'axis' }),
      ]);
    },
  });

  return { wrapper, renders: () => sceneRenders };
};

describe('the hovered element highlight', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('draws nothing until an element is hovered', async () => {
    const projectStore = twoBeams();
    const intersected = ref<Intersected>({ type: null, index: null, originalPosition: { x: 0, y: 0 } });
    const { wrapper } = hover(intersected);

    expect(wrapper.findAll('g.element')).toHaveLength(0);

    intersected.value = { type: 'element', index: projectStore.beams[0].label, originalPosition: { x: 0, y: 0 } };
    await nextTick();

    // the geometry copy and the results copy
    expect(wrapper.findAll('g.element')).toHaveLength(2);
  });

  it('follows the pointer across the model without rendering the scene again', async () => {
    twoBeams();
    const intersected = ref<Intersected>({ type: null, index: null, originalPosition: { x: 0, y: 0 } });
    const { renders } = hover(intersected);

    await nextTick();
    const rendersBeforeTheHover = renders();

    const labels = useProjectStore().beams.map((e) => e.label);

    for (const index of [...labels, ...labels]) {
      intersected.value = { type: 'element', index, originalPosition: { x: 0, y: 0 } };
      await nextTick();
    }

    intersected.value = { type: null, index: null, originalPosition: { x: 0, y: 0 } };
    await nextTick();

    expect(renders()).toBe(rendersBeforeTheHover);
  });

  it('ignores a hover that is not an element', async () => {
    twoBeams();
    const intersected = ref<Intersected>({ type: 'node', index: 2, originalPosition: { x: 0, y: 0 } });
    const { wrapper } = hover(intersected);

    expect(wrapper.findAll('g.element')).toHaveLength(0);
  });
});
