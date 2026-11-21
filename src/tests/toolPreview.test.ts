import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { computed } from 'vue';
import { DofID } from '@edubeam/fem';
import ToolPreview from '@/components/ToolPreview.vue';
import { useProjectStore } from '@/store/project';
import { snapKey } from '@/types/snap';
import { snapPoint } from '@/utils/snap';
import { toolTakes, type ToolLoad } from '@/utils/toolTarget';

/** What the support and load tools would add is drawn where a click would put it, before the click */
const mountAt = (x: number, y: number, props: { tool: 'support' | 'load'; loads?: readonly ToolLoad[] }) => {
  const loads = props.loads ?? [{ kind: 'force', fx: 0, fz: 10e3, local: false }];
  // The viewer's snap for the tool, as it provides it
  const snap = computed(() => {
    const store = useProjectStore();
    return snapPoint({
      nodes: store.solver.domain.nodes,
      beams: store.beams,
      exact: { x, y },
      grid: { x, y },
      reach: 0.12,
      takes: props.tool === 'support' ? 'node' : toolTakes('load', loads[0]),
      snapping: true,
    });
  });
  return mount(ToolPreview, {
    props: { scale: 100, support: 'pin', ...props, loads },
    global: { provide: { [snapKey as symbol]: snap } },
  });
};

describe('the preview of a support or a load', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const domain = useProjectStore().solver.domain;
    domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
    domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e32 });
    domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]);
    domain.createNode('2', [4, 0, 0], []);
    domain.createBeam2D('a', ['1', '2'], 'm', 'cs');
  });

  it('puts a force on the node under the pointer, as the drawing draws one', () => {
    const preview = mountAt(4.05, 0.02, { tool: 'load' });

    expect(preview.find('.tool-preview').classes()).toContain('lands');
    expect(preview.findAll('path').length).toBeGreaterThan(0);
  });

  it('draws a distributed load along the whole member under the pointer', () => {
    const along = mountAt(1.3, 0.05, { tool: 'load', loads: [{ kind: 'udl', qx: 0, qz: 5e3, local: true }] });
    const away = mountAt(1.3, 2, { tool: 'load', loads: [{ kind: 'udl', qx: 0, qz: 5e3, local: true }] });

    expect(along.find('.tool-preview').classes()).toContain('lands');
    expect(away.find('.tool-preview').classes()).not.toContain('lands');
    // Arrows over the member's 4 m, against a short stretch at the pointer
    expect(along.html().length).toBeGreaterThan(away.html().length);
  });

  it('shows a support fainter at the pointer where a click adds nothing, and on a node where it does', () => {
    expect(mountAt(2, 2, { tool: 'support' }).find('.tool-preview').classes()).not.toContain('lands');
    expect(mountAt(0, 0, { tool: 'support' }).find('.tool-preview').classes()).toContain('lands');
  });
});
