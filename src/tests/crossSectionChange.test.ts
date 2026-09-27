import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createPinia, setActivePinia } from 'pinia';
import { DofID } from 'ts-fem';
import { useProjectStore } from '@/store/project';

/**
 * The domain keys its materials and cross sections by the label as text - `label.toString()` - so
 * an element that holds the number 2 where it should hold "2" belongs to neither, and everything
 * that asks the element what it is made of is told nothing.
 */
const model = () => {
  const store = useProjectStore();
  const domain = store.solver.domain;

  domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
  domain.createMaterial(2, { e: 70e9, g: 26e9, alpha: 2.3e-5, d: 2700 });
  domain.createCrossSection(1, { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e6 });
  domain.createCrossSection(2, { a: 2e-2, iy: 4e-5, h: 0.3, k: 1e6 });
  domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]);
  domain.createNode('2', [4, 0, 0], [DofID.Dz]);
  domain.createBeam2D('b', ['1', '2'], 1, 1);

  return store;
};

const beam = (store: ReturnType<typeof useProjectStore>) => store.solver.domain.getElement('b');

describe('an element after its cross section or material is changed', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('is found again when the label is kept as text', () => {
    const store = model();

    beam(store).cs = '2';
    beam(store).mat = '2';

    expect(store.solver.domain.crossSections.get(beam(store).cs)).toBeDefined();
    expect(store.solver.domain.materials.get(beam(store).mat)).toBeDefined();
  });

  it('is found by nothing when the label is turned into a number', () => {
    const store = model();

    // what `v-model.number` on the select did
    (beam(store) as unknown as { cs: unknown }).cs = 2;

    expect(store.solver.domain.crossSections.get(beam(store).cs)).toBeUndefined();
  });

  it('can still be solved with the new section', () => {
    const store = model();

    store.solver.loadCases[0].createBeamElementUniformEdgeLoad('b', [0, 1000], true);
    beam(store).cs = '2';
    store.solve();

    expect(store.solver.loadCases[0].solved).toBe(true);
  });
});

describe('the editors that change them', () => {
  const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf-8');

  it('keep the label as text in the bottom bar', () => {
    const bar = read('src/components/BottomBar.vue');

    expect(bar).not.toContain('v-model.number="item.cs"');
    expect(bar).not.toContain('v-model.number="item.mat"');
  });

  it('solve again after the context menu changes one', () => {
    const menu = read('src/components/ContextMenuElement.vue');
    const selects = menu.split('<v-select').slice(1);
    const forElement = selects.filter((block) => /v-model="element\.(mat|cs)"/.test(block));

    expect(forElement).toHaveLength(2);
    forElement.forEach((block) => expect(block).toContain('@update:model-value="resolveAgain"'));
  });
});
