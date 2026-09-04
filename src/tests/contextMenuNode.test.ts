import { describe, it, expect } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { LinearStaticSolver, DofID } from 'ts-fem';
import { i18n } from '@/plugins/i18n';
import { useProjectStore } from '@/store/project';
import ContextMenuNode from '@/components/ContextMenuNode.vue';
import { undoRedoManager } from '@/CommandManager';

/** Stands in for the Vuetify field, so a test can type into the LCS angle and commit it. */
const TextFieldStub = defineComponent({
  props: { modelValue: { type: String, default: '' } },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        value: props.modelValue,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        onChange: (e: Event) => emit('change', e),
      });
  },
});

const mountMenu = (label: string | number | null) => {
  setActivePinia(createPinia());

  const projectStore = useProjectStore();
  const solver = new LinearStaticSolver();
  solver.domain.createNode(1, [0, 0, 0], [DofID.Dx, DofID.Dz]);
  projectStore.solver = solver;
  projectStore.selection.type = 'node';
  projectStore.selection.label = label;

  // Shallow: the Vuetify children are stubbed, but the bindings this component passes them
  // - and its onMounted - still run, which is where a missing node blows up.
  return {
    projectStore,
    wrapper: mount(ContextMenuNode, {
      shallow: true,
      global: { plugins: [i18n], stubs: { 'v-text-field': TextFieldStub } },
    }),
  };
};

/** Types into the field without committing: `setValue` would fire the change straight away. */
const typeAngle = async (wrapper: ReturnType<typeof mountMenu>['wrapper'], value: string) => {
  const field = wrapper.find('input');
  (field.element as HTMLInputElement).value = value;
  await field.trigger('input');
};

describe('ContextMenuNode', () => {
  /** The menu renders a v-list for a node it can resolve, and nothing at all otherwise. */
  const isRendered = (wrapper: ReturnType<typeof mountMenu>['wrapper']) => wrapper.find('v-list').exists();

  it('renders for the selected node', () => {
    expect(isRendered(mountMenu('1').wrapper)).toBe(true);
  });

  it('survives a selection label that no longer resolves to a node', () => {
    expect(() => mountMenu(null)).not.toThrow();
    expect(() => mountMenu('does-not-exist')).not.toThrow();
  });

  it('empties itself when the node goes away while it is open', async () => {
    const { projectStore, wrapper } = mountMenu('1');
    expect(isRendered(wrapper)).toBe(true);

    // What clearing the selection, or deleting the node from under the menu, leaves behind.
    projectStore.selection.label = null;
    await wrapper.vm.$nextTick();

    expect(isRendered(wrapper)).toBe(false);
  });

  it('applies a typed angle to the node, and undoes it', async () => {
    const { projectStore, wrapper } = mountMenu('1');
    await typeAngle(wrapper, '30');
    await wrapper.find('input').trigger('change');

    const rotated = projectStore.solver.domain.nodes.get('1')!;
    expect(rotated.hasLcs()).toBe(true);
    expect(Math.atan2(rotated.lcs[0][2], rotated.lcs[0][0]) * (180 / Math.PI)).toBeCloseTo(30, 6);

    undoRedoManager.undo();
    expect(projectStore.solver.domain.nodes.get('1')!.hasLcs()).toBe(false);
  });

  it('leaves the model alone when the node is gone by the time the field commits', async () => {
    const { projectStore, wrapper } = mountMenu('1');
    await typeAngle(wrapper, '30');

    // The selection is cleared - a click elsewhere, Escape - before the field commits.
    projectStore.selection.label = null;

    await expect(wrapper.find('input').trigger('change')).resolves.not.toThrow();
    expect(projectStore.solver.domain.nodes.get('1')!.hasLcs()).toBe(false);
  });

  it('finds the node whether the selection names it as a string or a number', () => {
    expect(isRendered(mountMenu(1).wrapper)).toBe(true);
    expect(isRendered(mountMenu('1').wrapper)).toBe(true);
  });
});
