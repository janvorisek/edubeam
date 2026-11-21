import { computed, type ComputedRef } from 'vue';
import { resolveUnits, type PlotLayer, type ReadoutQuantity, type Units } from '@edubeam/plot';
import { useAppStore } from '@/store/app';
import { useViewerStore } from '@/store/viewer';
import { useProjectStore } from '@/store/project';
import { displacementWriter, editorLayers, type EditorLook } from '@/utils/plotDrawing';

/** The project's units in plot's terms: a display value is the SI value times the converter's factor */
const unitsOf = (appStore: ReturnType<typeof useAppStore>): Units => ({
  force: { symbol: appStore.units.Force, scale: appStore.convertForce(1) },
  moment: { symbol: appStore.units.Moment, scale: appStore.convertMoment(1) },
  distributed: { symbol: appStore.units.ForceDistance, scale: appStore.convertForceDistance(1) },
  length: { symbol: appStore.units.Length, scale: appStore.convertLength(1) },
  displacement: { symbol: appStore.units.Displacement, scale: appStore.convertDisplacement(1) },
  rotation: { symbol: 'mrad', scale: 1e3 },
  // Temperature loads are differences: a kelvin is a degree Celsius
  temperature: { symbol: appStore.units.Temperature, scale: 1 },
});

/** The settings every plot drawing follows, as they are now */
export const useEditorLook = (): ComputedRef<EditorLook> => {
  const appStore = useAppStore();
  const viewerStore = useViewerStore();
  return computed((): EditorLook => ({
    units: unitsOf(appStore),
    numberFormat: appStore.numberFormatter,
    loadNumberFormat: appStore.loadFormatter,
    displacementText: displacementWriter(appStore.numberFormatter, appStore.numberStyle),
    fontSize: viewerStore.fontSize,
    resultsScalePx: viewerStore.resultsScalePx_,
    diagramStyle: { ...viewerStore.diagramStyle },
    supportSize: viewerStore.supportSize,
    resultLabelMode: viewerStore.resultLabelMode,
  }));
};

/**
 * The look of a small preview tile (examples, recent structures) when the plot renderer is on, or
 * null for the editor's own drawing. In SI, so a tile reads the same whatever units the project uses.
 */
export const useTileLook = (): ComputedRef<EditorLook | null> => {
  const viewerStore = useViewerStore();
  const look = useEditorLook();
  return computed(() =>
    viewerStore.renderer === 'plot'
      ? { ...look.value, units: resolveUnits(), resultsScalePx: 28, supportSize: 0.5, fontSize: 13 }
      : null
  );
};

/** The layers the editor's switches show, in plot's terms */
export const useEditorLayers = (): ComputedRef<ReadonlySet<PlotLayer>> => {
  const viewerStore = useViewerStore();
  return computed(() =>
    editorLayers({
      supports: viewerStore.showSupports,
      loads: viewerStore.showLoads,
      reactions: viewerStore.showReactions,
      nodeLabels: viewerStore.showNodeLabels,
      memberLabels: viewerStore.showElementLabels,
      normalForce: viewerStore.showNormalForce,
      shearForce: viewerStore.showShearForce,
      bendingMoment: viewerStore.showBendingMoment,
      deformedShape: viewerStore.showDeformedShape,
    })
  );
};

/** The editor's diagram scales, px per SI unit: each diagram's largest value at the results scale */
export const useEditorDiagramScales = (): ComputedRef<Readonly<Record<ReadoutQuantity, number>>> => {
  const viewerStore = useViewerStore();
  const projectStore = useProjectStore();
  return computed(() => ({
    N: viewerStore.resultsScalePx_ * projectStore.normalForceScale,
    V: viewerStore.resultsScalePx_ * projectStore.shearForceScale,
    M: viewerStore.resultsScalePx_ * projectStore.bendingMomentScale,
    w: viewerStore.resultsScalePx_ * projectStore.defoScale,
  }));
};
