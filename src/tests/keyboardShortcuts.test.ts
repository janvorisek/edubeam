import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { nextTick } from 'vue';
import { DofID } from 'ts-fem';
import { i18n } from '@/plugins/i18n';
import SVGViewer from '@/components/SVGViewer.vue';
import { useProjectStore } from '@/store/project';
import { useViewerStore } from '@/store/viewer';
import { hasShortcutModifier } from '@/utils/keyboard';

/**
 * Shortcuts checked `ctrlKey` only, so on a Mac, where Cmd does what Ctrl does elsewhere, none of
 * them worked. And the single-letter shortcuts ignored modifiers altogether: Ctrl+S saved the
 * project and toggled snap to grid with it.
 */
describe('hasShortcutModifier', () => {
  it('takes Ctrl, or Cmd on a Mac', () => {
    expect(hasShortcutModifier({ ctrlKey: true, metaKey: false })).toBe(true);
    expect(hasShortcutModifier({ ctrlKey: false, metaKey: true })).toBe(true);
    expect(hasShortcutModifier({ ctrlKey: false, metaKey: false })).toBe(false);
  });
});

/** Presses keys in order and lets them go in reverse, as fingers do. */
const press = async (...keys: string[]) => {
  const event = (type: string, key: string) =>
    new KeyboardEvent(type, {
      key,
      code: key.length === 1 ? `Key${key.toUpperCase()}` : key,
      ctrlKey: keys.includes('Control'),
      metaKey: keys.includes('Meta'),
      bubbles: true,
    });

  for (const key of keys) window.dispatchEvent(event('keydown', key));
  await nextTick();
  for (const key of [...keys].reverse()) window.dispatchEvent(event('keyup', key));
  await nextTick();
};

describe('shortcuts in the drawing', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
    const domain = useProjectStore().solver.domain;
    domain.createNode(1, [0, 0, 0], [DofID.Dx, DofID.Dz]);
    domain.createNode(2, [4, 0, 0], [DofID.Dz]);
    // The grid redraws on a snap toggle with SVG matrix maths happy-dom does not have.
    useViewerStore().showGrid = false;
    wrapper = mount(SVGViewer, { props: { id: 'viewer' }, global: { plugins: [createVuetify(), i18n] } });
  });

  afterEach(() => wrapper.unmount());

  it('toggles snap with S alone', async () => {
    const viewer = useViewerStore();
    const before = viewer.snapToGrid;

    await press('s');

    expect(viewer.snapToGrid).toBe(!before);
  });

  it('leaves snap alone on Ctrl+S and Cmd+S, which save the project', async () => {
    const viewer = useViewerStore();
    const before = viewer.snapToGrid;

    await press('Control', 's');
    expect(viewer.snapToGrid).toBe(before);

    await press('Meta', 's');
    expect(viewer.snapToGrid).toBe(before);
  });

  it('leaves the grid alone on Cmd+G', async () => {
    const viewer = useViewerStore();

    await press('Meta', 'g');

    expect(viewer.showGrid).toBe(false);
  });

  it('selects everything with Cmd+A as with Ctrl+A', async () => {
    const project = useProjectStore();

    await press('Meta', 'a');
    expect(project.selection2.nodes).toHaveLength(2);

    project.clearSelection2();
    await press('Control', 'a');
    expect(project.selection2.nodes).toHaveLength(2);
  });
});
