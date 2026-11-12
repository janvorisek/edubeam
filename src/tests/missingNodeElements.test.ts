import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import { DofID } from 'ts-fem';
import { i18n } from '@/plugins/i18n';
import AddElement from '@/components/dialogs/AddElement.vue';
import AddElementLoad from '@/components/dialogs/AddElementLoad.vue';
import EditElementLoad from '@/components/dialogs/EditElementLoad.vue';
import { useProjectStore } from '@/store/project';
import { drawableBeam, isDrawableBeam } from '@/utils/drawableBeam';

/**
 * An element whose node is not in the model. Add element made one whenever only one of its two node
 * selects was filled in - with fewer than two nodes both start empty - and the element then ended at
 * node "". The drawing leaves such an element out and the solver reports it, but opening a load on it
 * threw "Node label  does not exists" from the load preview (Sentry EDUBEAM-APP-FC and its siblings).
 */
const buildModel = () => {
  const domain = useProjectStore().solver.domain;

  domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
  domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e6 });
  domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]);
  domain.createNode('2', [4, 0, 0], [DofID.Dz]);
  domain.createBeam2D('ok', ['1', '2'], 'm', 'cs');
  domain.createBeam2D('broken', ['1', ''], 'm', 'cs');
};

let errors: unknown[] = [];
let wrapper: VueWrapper | null = null;

/** Dialogs teleport out of the component; errors in their render are collected, not thrown. */
const mountDialog = async (component: unknown, props: Record<string, unknown> = {}) => {
  document.body.innerHTML = '';

  wrapper = mount(component as Parameters<typeof mount>[0], {
    props,
    global: {
      plugins: [createVuetify({ components }), i18n],
      config: { errorHandler: (e: unknown) => errors.push(e) },
    },
    attachTo: document.body,
  });

  await new Promise((r) => setTimeout(r, 0));
  return wrapper;
};

const buttonNamed = (text: string) =>
  Array.from(document.querySelectorAll<HTMLButtonElement>('.v-dialog button')).find((b) =>
    b.textContent?.toLowerCase().includes(text.toLowerCase())
  );

describe('which beams can be drawn', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    buildModel();
  });

  it('takes a beam with both nodes and leaves out one with a node missing', () => {
    const domain = useProjectStore().solver.domain;

    expect(drawableBeam(domain, 'ok')?.label).toBe('ok');
    expect(drawableBeam(domain, 'broken')).toBeUndefined();
    expect(drawableBeam(domain, 'nope')).toBeUndefined();
    expect(drawableBeam(domain, undefined)).toBeUndefined();
    expect(isDrawableBeam(domain, domain.elements.get('broken'))).toBe(false);
  });

  it('leaves out a beam whose two nodes are at the same point', () => {
    const domain = useProjectStore().solver.domain;
    domain.createNode('3', [4, 0, 0], []);
    domain.createBeam2D('zero', ['2', '3'], 'm', 'cs');

    expect(drawableBeam(domain, 'zero')).toBeUndefined();
  });

  it('is what the drawing draws', () => {
    expect(useProjectStore().beams.map((b) => b.label)).toEqual(['ok']);
  });
});

describe('adding an element', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    errors = [];
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
    vi.unstubAllGlobals();
  });

  it('refuses an element with only one of its nodes picked', async () => {
    const domain = useProjectStore().solver.domain;
    domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
    domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e6 });
    domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]);
    const alert = vi.fn();
    vi.stubGlobal('alert', alert);

    const dialog = await mountDialog(AddElement);
    // one node, so both selects start empty; pick the start only
    dialog.findAllComponents({ name: 'VSelect' })[0].vm.$emit('update:modelValue', '1');
    await new Promise((r) => setTimeout(r, 0));

    buttonNamed('add element')!.click();

    expect(alert).toHaveBeenCalledWith(i18n.global.t('validators.sameNodes'));
    expect(domain.elements.size).toBe(0);
    expect(errors).toEqual([]);
  });

  it('still adds an element between two nodes', async () => {
    const domain = useProjectStore().solver.domain;
    domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
    domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e6 });
    domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]);
    domain.createNode('2', [4, 0, 0], [DofID.Dz]);

    await mountDialog(AddElement);
    buttonNamed('add element')!.click();

    const added = [...domain.elements.values()];
    expect(added.map((e) => [...e.nodes])).toEqual([['1', '2']]);
    expect(errors).toEqual([]);
  });
});

describe('a load on an element whose node is missing', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    buildModel();
    errors = [];
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
  });

  it('opens the add dialog from its row without a preview or a stand-in element', async () => {
    await mountDialog(AddElementLoad, { label: 'broken' });

    expect(errors).toEqual([]);
    expect(document.querySelector('.element-load-preview')).toBeNull();

    // nothing chosen, so nothing can be added to the wrong element
    const before = useProjectStore().solver.loadCases[0].elementLoadList.length;
    buttonNamed('add')?.click();
    await new Promise((r) => setTimeout(r, 0));
    expect(useProjectStore().solver.loadCases[0].elementLoadList.length).toBe(before);
  });

  it('opens the edit dialog of a load already on it', async () => {
    const loadCase = useProjectStore().solver.loadCases[0];
    loadCase.createBeamConcentratedLoad('broken', [0, -1000, 0, 1], true);

    await mountDialog(EditElementLoad, { index: loadCase.elementLoadList.length - 1 });

    expect(errors).toEqual([]);
    expect(document.querySelector('.element-load-preview')).toBeNull();
  });

  it('still previews a load on an element that can be drawn', async () => {
    await mountDialog(AddElementLoad, { label: 'ok' });

    expect(errors).toEqual([]);
    expect(document.querySelector('.element-load-preview')).not.toBeNull();
  });
});
