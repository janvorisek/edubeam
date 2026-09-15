import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { DofID } from 'ts-fem';
import { useProjectStore } from '@/store/project';
import { useClipboardStore } from '@/store/clipboard';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Pasting by pointing needs the place to be on screen already. On a touch screen it needs more than
 * that: moving the view to bring the place into sight ends the paste, so anything further away than
 * one screen cannot be reached by pointing at all. An offset typed in reaches anywhere.
 */
const build = () => {
  const store = useProjectStore();
  const domain = store.solver.domain;

  domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
  domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e6 });
  domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]);
  domain.createNode('2', [4, 0, 0], [DofID.Dz]);
  domain.createBeam2D('b', ['1', '2'], 'm', 'cs');

  return store;
};

const coordinatesOf = (store: ReturnType<typeof useProjectStore>) =>
  [...store.solver.domain.nodes.values()].map((node) => [node.coords[0], node.coords[2]]);

describe('pasting at an offset', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('puts the copy that far from the original', () => {
    const store = build();
    const clipboard = useClipboardStore();

    clipboard.select({
      nodes: ['1', '2'],
      elements: ['b'],
      nodalLoads: [],
      elementLoads: [],
      prescribedBC: [],
      dimensions: [],
    });
    clipboard.paste({ x: 0, z: 3 });

    // the two originals where they were, and two more three metres below them
    expect(coordinatesOf(store)).toEqual([
      [0, 0],
      [4, 0],
      [0, 3],
      [4, 3],
    ]);
  });

  it('copies the elements between the copied nodes, not back to the originals', () => {
    const store = build();
    const clipboard = useClipboardStore();

    clipboard.select({
      nodes: ['1', '2'],
      elements: ['b'],
      nodalLoads: [],
      elementLoads: [],
      prescribedBC: [],
      dimensions: [],
    });
    clipboard.paste({ x: 0, z: 3 });

    const copied = [...store.solver.domain.elements.values()].find((element) => element.label !== 'b')!;

    expect(copied.nodes).not.toContain('1');
    expect(copied.nodes).not.toContain('2');
  });

  it('leaves the model alone when nothing was copied', () => {
    const store = build();

    useClipboardStore().paste({ x: 0, z: 3 });

    expect(coordinatesOf(store)).toHaveLength(2);
  });

  it('is offered by the banner of the paste mode, not by a dialog of its own', () => {
    const viewer = readFileSync(join(process.cwd(), 'src/components/SVGViewer.vue'), 'utf-8');
    const banner = viewer.slice(viewer.indexOf('id="addModeBanner"'), viewer.indexOf('<context-menu'));

    /*
     * Pressing paste is what a reader does first; offering the offset there means the two ways of
     * placing a copy - pointing at it and saying how far - stand together rather than one of them
     * being behind a second entry that does the same thing.
     */
    expect(banner).toContain('MouseMode.PASTE_CLIPBOARD');
    expect(banner).toContain('pasteOffsetX');
    expect(banner).toContain('pasteOffsetZ');
  });
});
