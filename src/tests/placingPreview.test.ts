import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { computed, h, nextTick, provide, ref } from 'vue';
import PlacingPreview from '@/components/PlacingPreview.vue';
import { placingKey, type PlacingStartNode } from '@/types/placing';
import { useAppStore } from '@/store/app';
import { MouseMode } from '@/mouse';

/**
 * The preview follows the pointer, so it changes on every report while a placing mode is on. It is
 * a separate component so that the drawing it sits in is not rendered again for each one; a scene
 * that counts its renders stands in for it here.
 */
const scene = (x: ReturnType<typeof ref<number>>, y: ReturnType<typeof ref<number>>, startNode: PlacingStartNode) => {
  let sceneRenders = 0;

  const wrapper = mount({
    setup: () =>
      provide(placingKey, {
        x: x as never,
        y: y as never,
        startNode: ref(startNode),
        snappedToNode: computed(() => false),
      }),
    render() {
      sceneRenders++;
      return h('svg', [h('g', 'the whole model'), h(PlacingPreview, { scale: 10 })]);
    },
  });

  return { wrapper, renders: () => sceneRenders };
};

describe('the placing preview', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('draws nothing when no placing mode is on', () => {
    const { wrapper } = scene(ref(0), ref(0), null);

    expect(wrapper.find('rect').exists()).toBe(false);
    expect(wrapper.find('line').exists()).toBe(false);
  });

  it('marks where the next node would land', async () => {
    useAppStore().mouseMode = MouseMode.ADD_NODE;
    const { wrapper } = scene(ref(3), ref(-4), null);
    await nextTick();

    expect(wrapper.find('rect').attributes('x')).toBe('3');
    expect(wrapper.find('rect').attributes('y')).toBe('-4');
  });

  it('draws the rubber line from the end already placed', async () => {
    useAppStore().mouseMode = MouseMode.ADD_ELEMENT;
    const { wrapper } = scene(ref(3), ref(-4), { label: '1', x: 0, y: 0 });
    await nextTick();

    const line = wrapper.find('line');
    expect([line.attributes('x1'), line.attributes('x2')]).toEqual(['0', '3']);
  });

  it('follows the pointer without rendering the scene again', async () => {
    useAppStore().mouseMode = MouseMode.ADD_ELEMENT;
    const x = ref(0);
    const y = ref(0);
    const { wrapper, renders } = scene(x, y, { label: '1', x: 0, y: 0 });
    await nextTick();

    const rendersBeforeTheMove = renders();

    for (const step of [1, 2, 3, 4]) {
      x.value = step;
      y.value = -step;
      await nextTick();
    }

    expect(renders()).toBe(rendersBeforeTheMove);
    expect(wrapper.find('line').attributes('x2')).toBe('4');
  });
});
