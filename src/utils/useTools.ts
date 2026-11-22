import { computed, type ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { MouseMode } from '@/mouse';
import { useAppStore } from '@/store/app';
import { useProjectStore } from '@/store/project';

/**
 * The drawing's tools: what a click on the drawing does. Select is the default; the others are the
 * placing modes, each left by choosing it again, by Select, or by Esc.
 */
export type Tool = 'select' | 'node' | 'element' | 'support' | 'load' | 'dimension';

/** The placing mode each tool puts the drawing in */
const MODES: Readonly<Record<Exclude<Tool, 'select'>, MouseMode>> = {
  node: MouseMode.ADD_NODE,
  element: MouseMode.ADD_ELEMENT,
  support: MouseMode.ADD_SUPPORT,
  load: MouseMode.ADD_LOAD,
  dimension: MouseMode.ADD_DIMLINE,
};

/** What a click does while the drawing is in no placing mode: select, hover, drag, box select */
const SELECTING: ReadonlySet<MouseMode> = new Set([
  MouseMode.NONE,
  MouseMode.HOVER,
  MouseMode.SELECTING,
  MouseMode.MOVING,
]);

export const useTools = (): {
  /** The tool in use; null while something else holds the pointer (a paste, picking a window) */
  readonly active: ComputedRef<Tool | null>;
  /** Takes up a tool, or puts it down for Select when it is the one in use */
  readonly choose: (tool: Tool) => void;
} => {
  const appStore = useAppStore();
  const projectStore = useProjectStore();
  const { t } = useI18n();

  const active = computed((): Tool | null => {
    const mode = appStore.mouseMode;
    if (SELECTING.has(mode)) return 'select';
    const placing = (Object.keys(MODES) as Exclude<Tool, 'select'>[]).find((tool) => MODES[tool] === mode);
    return placing ?? null;
  });

  const choose = (tool: Tool) => {
    if (tool === 'select' || active.value === tool) {
      appStore.mouseMode = MouseMode.NONE;
      return;
    }
    // An element needs something to be made of
    if (tool === 'element') {
      if (projectStore.solver.domain.materials.size === 0) return alert(t('warnings.addMaterialFirst'));
      if (projectStore.solver.domain.crossSections.size === 0) return alert(t('warnings.addCrossSectionFirst'));
    }
    appStore.mouseMode = MODES[tool];
  };

  return { active, choose };
};
