import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createApp } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import { DofID } from 'ts-fem';
import { i18n } from '@/plugins/i18n';
import Share from '@/components/dialogs/Share.vue';
import { useAppStore } from '@/store/app';
import { useViewerStore } from '@/store/viewer';
import { useProjectStore } from '@/store/project';
import { fromShareParam, serializeModel } from '@/utils/serializeModel';

/**
 * The plain link is what every copy of the app ever released can open, so it stays the default.
 * The shorter one is a choice, and has to carry the same model.
 */
const build = () => {
  const domain = useProjectStore().solver.domain;

  domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
  domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e6 });
  domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]);
  domain.createNode('2', [4, 0, 0], [DofID.Dz]);
  domain.createBeam2D('b', ['1', '2'], 'm', 'cs');
};

/** The dialog teleports out of the component, so its parts are found in the document. */
const openShare = async () => {
  document.body.innerHTML = '';

  mount(Share, {
    global: { plugins: [createVuetify({ components }), i18n] },
    attachTo: document.body,
  });

  await new Promise((r) => setTimeout(r, 0));
};

const sharedParam = () => {
  const field = document.querySelector<HTMLTextAreaElement>('.share-textarea textarea');
  expect(field, 'no link field rendered').toBeTruthy();

  return new URL(field!.value).searchParams.get('model')!;
};

describe('the share dialog', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    build();
  });

  it('gives the shorter link by default, carrying the same model', async () => {
    await openShare();

    const store = useProjectStore();
    const plain = serializeModel(store.solver, store.dimensions);
    const short = sharedParam();

    expect(short.length).toBeLessThan(plain.length);
    expect(fromShareParam(short)).toBe(plain);
  });

  it('gives the plain link, which every version ever released opens, when turned off', async () => {
    useAppStore().shortShareLinks = false;
    await openShare();

    const store = useProjectStore();
    expect(sharedParam()).toBe(serializeModel(store.solver, store.dimensions));
  });

  it('carries the layers the sharer has on only when asked to', async () => {
    const viewer = useViewerStore();
    Object.assign(viewer, { showBendingMoment: true, showReactions: true, showLoads: true, showShearForce: false });
    Object.assign(viewer, { showNormalForce: false, showDeformedShape: false, showSupports: true });
    Object.assign(viewer, { showNodeLabels: false, showElementLabels: false });
    await openShare();

    const link = () => new URL(document.querySelector<HTMLTextAreaElement>('.share-textarea textarea')!.value);
    const settle = () => new Promise((r) => setTimeout(r, 0));
    expect(link().searchParams.has('show')).toBe(false);

    useAppStore().shareLayers = true;
    await settle();
    expect(link().searchParams.get('show')).toBe('MRLS');

    useAppStore().shareLayers = false;
    await settle();
    expect(link().searchParams.has('show')).toBe(false);
  });

  it('keeps what a returning user has saved, and gives a new one short links', () => {
    // Pinia applies plugins once it is installed into an app, so the store is made inside one.
    const persisted = () => {
      const pinia = createPinia();
      pinia.use(piniaPluginPersistedstate);
      createApp({}).use(pinia);
      setActivePinia(pinia);
      return useAppStore();
    };

    localStorage.setItem('app', JSON.stringify({ shortShareLinks: false, locale: 'en' }));
    expect(persisted().shortShareLinks).toBe(false);

    localStorage.removeItem('app');
    expect(persisted().shortShareLinks).toBe(true);

    localStorage.removeItem('app');
  });
});
