import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { h, nextTick, provide, ref } from 'vue';
import SelectionBox from '@/components/SelectionBox.vue';
import WindowPickRect from '@/components/WindowPickRect.vue';
import { windowDragKey, windowPickBox, type WindowDrag } from '@/types/windowPick';
import { useAppStore } from '@/store/app';
import { MouseMode } from '@/mouse';

/**
 * Both overlays follow a gesture, so they change on every pointer report. They are separate
 * components so that the drawing they sit in is not rendered again for each one; a scene that
 * counted its renders stands in for it here.
 */
describe('the gesture overlays', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('moves the selection box without rendering the scene again', async () => {
    const appStore = useAppStore();
    let sceneRenders = 0;

    const wrapper = mount({
      render() {
        sceneRenders++;
        return h('div', [h('span', 'the drawing'), h(SelectionBox)]);
      },
    });

    appStore.mouseMode = MouseMode.SELECTING;
    appStore.mouse.sx = 10;
    appStore.mouse.sy = 20;
    await nextTick();

    const rendersBeforeTheDrag = sceneRenders;

    for (const x of [30, 40, 50, 60]) {
      appStore.mouse.x = x;
      appStore.mouse.y = x + 5;
      await nextTick();
    }

    expect(sceneRenders).toBe(rendersBeforeTheDrag);
    expect(wrapper.find('.selecting').attributes('style')).toContain('width: 50px');
  });

  it('moves the window pick without rendering the scene again', async () => {
    const drag = ref<WindowDrag>(null);
    let sceneRenders = 0;

    const wrapper = mount({
      setup: () => provide(windowDragKey, drag),
      render() {
        sceneRenders++;
        return h('svg', [h(WindowPickRect)]);
      },
    });

    drag.value = { x0: 1, y0: 1, x1: 1, y1: 1 };
    await nextTick();

    const rendersBeforeTheDrag = sceneRenders;

    for (const x of [2, 3, 4, 5]) {
      drag.value = { ...drag.value!, x1: x };
      await nextTick();
    }

    expect(sceneRenders).toBe(rendersBeforeTheDrag);
    expect(wrapper.find('rect').attributes('width')).toBe('4');
  });
});

describe('windowPickBox', () => {
  it('gives the same window whichever corner the drag started from', () => {
    expect(windowPickBox({ x0: 5, y0: 6, x1: 1, y1: 2 })).toEqual({ x: 1, y: 2, w: 4, h: 4 });
    expect(windowPickBox({ x0: 1, y0: 2, x1: 5, y1: 6 })).toEqual({ x: 1, y: 2, w: 4, h: 4 });
  });

  it('has no window without a drag', () => {
    expect(windowPickBox(null)).toBeNull();
  });
});
