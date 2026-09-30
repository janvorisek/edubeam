import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { DofID } from 'ts-fem';
import { i18n } from '@/plugins/i18n';
import { useProjectStore } from '@/store/project';
import StiffnessMatrix from '@/components/StiffnessMatrix.vue';

/**
 * The widget is opened for one element and stays open while the model changes. Deleting that
 * element used to throw `Element label N does not exists` from `getElement` on every re-render.
 */
const build = () => {
  const domain = useProjectStore().solver.domain;

  domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
  domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e32 });
  domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
  domain.createNode('2', [4, 0, 0], []);
  domain.createBeam2D('3', ['1', '2'], 'm', 'cs');

  return domain;
};

const mountFor = (label: string | number) =>
  mount(StiffnessMatrix, { props: { label }, shallow: true, global: { plugins: [i18n] } });

describe('StiffnessMatrix', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('lists the 6x6 beam stiffness for a numeric label', () => {
    build();

    const wrapper = mountFor(3);

    expect(wrapper.findAll('tr')).toHaveLength(6);
    // EA / L = 210e9 * 1e-2 / 4
    expect(wrapper.findAll('td')[0].text()).toBe((5.25e8).toExponential(2));
  });

  it('says the element is gone once it is deleted, instead of throwing', async () => {
    const domain = build();
    const wrapper = mountFor('3');

    domain.elements.delete('3');
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('tr')).toHaveLength(0);
    expect(wrapper.text()).toBe(i18n.global.t('warnings.elementMissing', { label: '3' }));
  });
});
