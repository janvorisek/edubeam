import {
  Beam2D,
  BeamConcentratedLoad,
  BeamElementUniformEdgeLoad,
  BeamElementTrapezoidalEdgeLoad,
  BeamTemperatureLoad,
  DofID,
  LinearStaticSolver,
  Load,
  NodalLoad,
  Node,
  PrescribedDisplacement,
} from 'ts-fem';
import { Ref } from 'vue';
import { availableLocales, i18n } from '../plugins/i18n';
import { useProjectStore } from '../store/project';
import { Command, IKeyValue, undoRedoManager } from '../CommandManager';
import { useViewerStore } from '../store/viewer';

import { loadType } from './loadType';
import { ensureDimensionId, createDimensionId } from './id';
import { deserializeModel, parseSerializedModel, serializeModel } from './serializeModel';
import { deserializeShape, serializeShape } from './sectionProperties';
import { createDimensionPoint, createDimensionPointFromNode, type DimensionPoint } from '@/types/dimension';

export type EntityWithLabel = { label: string & { [key: string]: unknown } };

export { throttle } from './throttle';
export { debounce } from './debounce';

export { serializeModel };
export { deserializeModel };
export { parseSerializedModel };

export { smoothPath } from './smoothPath';
export { loadType } from './loadType';

export { loadXmlFile } from './loadXmlFile';

export { formatScientificNumber, formatCompactNumber } from './formatScientificNumber';

type ProjectSnapshot = {
  model: string | null;
  selection: {
    label: number | string | null;
    type: string | null;
    x: number;
    y: number;
  };
  selection2: {
    nodes: string[];
    elements: string[];
    nodalLoads: number[];
    elementLoads: number[];
    prescribedBC: number[];
    dimensions: string[];
  };
};

let modelMutationDepth = 0;

const captureProjectSnapshot = (): ProjectSnapshot => {
  const projectStore = useProjectStore();

  return {
    model: serializeModel(projectStore.solver, projectStore.dimensions),
    selection: {
      label: projectStore.selection.label,
      type: projectStore.selection.type,
      x: projectStore.selection.x,
      y: projectStore.selection.y,
    },
    selection2: {
      nodes: [...projectStore.selection2.nodes],
      elements: [...projectStore.selection2.elements],
      nodalLoads: [...projectStore.selection2.nodalLoads],
      elementLoads: [...projectStore.selection2.elementLoads],
      prescribedBC: [...projectStore.selection2.prescribedBC],
      dimensions: [...projectStore.selection2.dimensions],
    },
  };
};

const restoreProjectSnapshot = (snapshot: ProjectSnapshot) => {
  const projectStore = useProjectStore();

  for (const loadCase of projectStore.solver.loadCases) {
    loadCase.solved = false;
    loadCase.prescribedBC = [];
    loadCase.nodalLoadList = [];
    loadCase.elementLoadList = [];
  }

  projectStore.solver.domain.elements.clear();
  projectStore.solver.domain.nodes.clear();
  projectStore.solver.domain.materials.clear();
  projectStore.solver.domain.crossSections.clear();
  projectStore.dimensions = [];

  if (snapshot.model && !deserializeModel(snapshot.model, projectStore.solver, projectStore.dimensions)) {
    console.error('Could not restore project snapshot');
  }

  projectStore.selection.label = snapshot.selection.label;
  projectStore.selection.type = snapshot.selection.type;
  projectStore.selection.x = snapshot.selection.x;
  projectStore.selection.y = snapshot.selection.y;

  projectStore.selection2.nodes = [...snapshot.selection2.nodes];
  projectStore.selection2.elements = [...snapshot.selection2.elements];
  projectStore.selection2.nodalLoads = [...snapshot.selection2.nodalLoads];
  projectStore.selection2.elementLoads = [...snapshot.selection2.elementLoads];
  projectStore.selection2.prescribedBC = [...snapshot.selection2.prescribedBC];
  projectStore.selection2.dimensions = [...snapshot.selection2.dimensions];

  solve();
};

export const executeModelMutationWithUndo = (mutate: () => void) => {
  if (modelMutationDepth > 0) {
    mutate();
    return;
  }

  const prev = captureProjectSnapshot();

  modelMutationDepth++;

  try {
    mutate();
  } finally {
    modelMutationDepth--;
  }

  const next = captureProjectSnapshot();
  if (prev.model === null || next.model === null || prev.model === next.model) {
    solve();
    return;
  }

  const setCommand = new Command<IKeyValue>(
    (value) => {
      restoreProjectSnapshot((value as { prev: ProjectSnapshot; next: ProjectSnapshot }).next);
    },
    (value) => {
      restoreProjectSnapshot((value as { prev: ProjectSnapshot; next: ProjectSnapshot }).prev);
    },
    { prev, next }
  );

  undoRedoManager.executeCommand(setCommand);
};

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const checkNumber = (e: KeyboardEvent) => {
  if (e.key === 'Escape') if ('activeElement' in document) (document.activeElement as HTMLElement).blur();

  const isNumber = !isNaN(e.key as unknown as number);

  const isActionKey =
    (e.ctrlKey && e.key === 'a') ||
    (e.ctrlKey && e.key === 'c') ||
    (e.ctrlKey && e.key === 'v') ||
    (e.ctrlKey && e.key === 'x') ||
    e.key === 'Escape' ||
    e.key === 'Delete' ||
    e.key === 'Backspace' ||
    e.key === 'Enter' ||
    e.key === 'Tab' ||
    e.key === 'ArrowRight' ||
    e.key === 'ArrowLeft' ||
    e.key === 'End' ||
    e.key === 'Home' ||
    e.key === 'e' ||
    e.key === '-';

  const isComma = e.key === ',' || e.key === '.';

  if (isNumber || isActionKey || isComma) return;

  e.stopPropagation();
  e.preventDefault();
};

export const download = (filename: string, text: string) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const exportJSON = () => {
  const nodes = [...useProjectStore().solver.domain.nodes.values()].map((n) => {
    return {
      label: n.label,
      coords: n.coords,
      bcs: [...n.bcs.values()],
      lcs: n.lcs,
    };
  });

  const elements = [...useProjectStore().beams].map((e) => {
    return {
      label: e.label,
      nodes: e.nodes,
      mat: e.mat,
      cs: e.cs,
      hinges: e.hinges,
    };
  });

  const materials = [...useProjectStore().solver.domain.materials.values()].map((m) => {
    return {
      label: m.label,
      d: m.d,
      e: m.e,
      g: m.g,
      alpha: m.alpha,
    };
  });

  const crossSections = [...useProjectStore().solver.domain.crossSections.values()].map((cs) => {
    return {
      label: cs.label,
      a: cs.a,
      iy: cs.iy,
      h: cs.h,
      k: cs.k,
      ...(cs.shape ? { shape: serializeShape(cs.shape) } : {}),
    };
  });

  const loadCases = [...useProjectStore().solver.loadCases].map((lc) => {
    return {
      label: lc.label,
      nodalLoads: lc.nodalLoadList.map((nl) => {
        return {
          target: nl.target,
          values: nl.values,
        };
      }),
      elementLoads: lc.elementLoadList.map((el) => {
        const base = {
          type: loadType(el),
          target: el.target,
          lcs: el.lcs,
        };

        if (el instanceof BeamElementTrapezoidalEdgeLoad) {
          return {
            ...base,
            startValues: [...el.startValues],
            endValues: [...el.endValues],
          };
        }

        return {
          ...base,
          values: el.values,
        };
      }),
      prescribedBC: lc.prescribedBC.map((pbc) => {
        return {
          target: pbc.target,
          prescribedValues: pbc.prescribedValues,
        };
      }),
    };
  });

  const dimensions = useProjectStore().dimensions.map((dim) => {
    const id = ensureDimensionId(dim);
    return {
      id,
      distance: dim.distance,
      distanceUnit: dim.distanceUnit ?? 'world',
      points: dim.points.map((point) => ({
        x: point.x,
        y: point.y,
        sourceNodeLabel: point.sourceNodeLabel ?? null,
      })),
    };
  });

  return {
    edubeam: true,
    date: new Date(),
    version: APP_VERSION,
    commit: APP_COMMIT,
    domain: {
      materials,
      crossSections,
      nodes,
      elements,
      loadCases,
    },
    dimensions,
  };
};

export const importJSON = (json: any) => {
  const jObj = json;

  useProjectStore().dimensions = [];

  // Parse materials
  if (jObj.domain.materials) {
    for (const material of jObj.domain.materials) {
      useProjectStore().solver.domain.createMaterial(material.label, material);
    }
  }

  // Parse cross sections
  if (jObj.domain.crossSections) {
    for (const cs of jObj.domain.crossSections) {
      const { shape, ...params } = cs;
      const created = useProjectStore().solver.domain.createCrossSection(cs.label, params);
      const parsed = deserializeShape(shape);
      if (parsed) created.shape = parsed;
    }
  }

  // Parse nodes
  if (jObj.domain.nodes) {
    for (const node of jObj.domain.nodes) {
      const n = useProjectStore().solver.domain.createNode(node.label, node.coords, node.bcs);

      if (node.lcs) n.updateLcs({ locx: node.lcs[0], locy: node.lcs[1] });
    }
  }

  // Parse elements
  if (jObj.domain.elements) {
    for (const element of jObj.domain.elements) {
      useProjectStore().solver.domain.createBeam2D(
        element.label,
        element.nodes,
        element.mat,
        element.cs,
        element.hinges
      );
    }
  }

  // Parse load cases
  if (jObj.domain.loadCases) {
    for (const loadCase of jObj.domain.loadCases) {
      useProjectStore().solver.loadCases[0].label = loadCase.label;

      for (const nl of loadCase.nodalLoads) {
        useProjectStore().solver.loadCases[0].createNodalLoad(nl.target, nl.values);
      }

      for (const el of loadCase.elementLoads) {
        if (!('type' in el) || el.type === 'udl')
          useProjectStore().solver.loadCases[0].createBeamElementUniformEdgeLoad(el.target, el.values, el.lcs ?? true);
        else if ('type' in el && el.type === 'concentrated')
          useProjectStore().solver.loadCases[0].createBeamConcentratedLoad(el.target, el.values, el.lcs ?? true);
        else if ('type' in el && el.type === 'trapezoidal') {
          const startValues = Array.isArray(el.startValues)
            ? el.startValues
            : Array.isArray(el.values)
              ? el.values
              : [0, 0];
          const endValues = Array.isArray(el.endValues) ? el.endValues : startValues;

          useProjectStore().solver.loadCases[0].createBeamElementTrapezoidalEdgeLoad(
            el.target,
            startValues,
            endValues,
            el.lcs ?? true
          );
        } else if ('type' in el && el.type === 'temperature')
          useProjectStore().solver.loadCases[0].createBeamTemperatureLoad(el.target, el.values);
      }

      for (const pbc of loadCase.prescribedBC) {
        useProjectStore().solver.loadCases[0].createPrescribedDisplacement(pbc.target, pbc.prescribedValues);
      }
    }
  }

  if (Array.isArray(jObj.dimensions)) {
    const restoredDimensions = [];
    const nodeMap = useProjectStore().solver.domain.nodes;

    for (const dim of jObj.dimensions) {
      if (!dim) continue;

      let points: DimensionPoint[] = [];

      if (Array.isArray(dim.points) && dim.points.length >= 2) {
        points = dim.points.slice(0, 2).map((point) => {
          if (Array.isArray(point) && point.length >= 2) {
            return createDimensionPoint(point[0], point[1]);
          }

          return createDimensionPoint(point.x, point.y, point.sourceNodeLabel ?? null);
        });
      } else if (Array.isArray(dim.nodes) && dim.nodes.length >= 2) {
        const nodes = dim.nodes.map((label) => nodeMap.get(label)).filter((node): node is Node => Boolean(node));
        if (nodes.length !== dim.nodes.length) continue;
        points = nodes.slice(0, 2).map((node) => createDimensionPointFromNode(node));
      }

      if (points.length < 2) continue;

      restoredDimensions.push({
        id: typeof dim.id === 'string' ? dim.id : createDimensionId(),
        distance: typeof dim.distance === 'number' ? dim.distance : 0,
        distanceUnit: dim.distanceUnit === 'pixel' ? 'pixel' : 'world',
        points: [points[0], points[1]] as [DimensionPoint, DimensionPoint],
      });
    }

    useProjectStore().dimensions = restoredDimensions;
  }
};

export const suggestLanguage = () => {
  const langs = navigator.languages || [navigator.language];

  for (const lang of langs) {
    if (availableLocales.some((l) => l.code === lang)) return lang;
  }

  return 'en';
};

export const parseFloat2 = (s: string | number) => {
  s = s.toString();

  if (s === '') return 0;
  if (s === '-') return 0;

  s = s.replaceAll(/\s/g, '');

  let tmp = parseFloat(s.replace(',', '.'));

  tmp = isNaN(tmp) ? 0 : tmp;

  return tmp;
};

export const setUnsolved = () => {
  useProjectStore().solver.loadCases[0].solved = false;
};

export const solve = () => {
  useProjectStore().solve();
};

export const swapNodes = (el: Beam2D) => {
  el.nodes = el.nodes.reverse();

  el.hinges = [el.hinges[1], el.hinges[0]];
  solve();
};

/**
 * Puts back the value Vue last rendered into the input. Inline fields show unit converted (and often
 * formatted) values, so rejecting an invalid entry must not write the raw model value into them.
 * The rendered value is kept by the runtime as `_value` when the input is bound with `:value`;
 * the model value is only a fallback for inputs that are not.
 */
const restoreRenderedValue = (el: HTMLInputElement, modelValue: unknown) => {
  const rendered = (el as HTMLInputElement & { _value?: unknown })._value;

  el.value = String(rendered ?? modelValue ?? '');
};

export const changeSetArrayItem = (
  item: unknown,
  set: string,
  value: number,
  el?: HTMLInputElement,
  formatter?: (v: number) => number
) => {
  if (el.value === '') el.value = '0';

  const val = parseFloat(el.value.replace(/\s/g, '').replace(',', '.'));
  if (!Number.isFinite(val)) return restoreRenderedValue(el, item[set][value]);

  executeModelMutationWithUndo(() => {
    setUnsolved();
    item[set][value] = formatter ? formatter(val) : val;
  });
};

export const changeRefNumValue = (value: string) => {
  const val = parseFloat(value.replace(/\s/g, '').replace(',', '.'));
  if (isNaN(val)) return 0;

  return val;
};

/**
 * A field hands its rules whatever its model holds: a string, or a number where the template uses
 * `v-model.number`. Returns NaN for anything that is not a number, so the rules can tell the two
 * failure cases apart.
 */
const ruleValueAsNumber = (v: unknown) => {
  if (typeof v === 'number') return v;
  if (typeof v !== 'string') return NaN;

  const normalized = v.replace(/\s/g, '').replace(',', '.');
  if (normalized === '') return NaN;

  // Number(), not parseFloat(): trailing junk like "5abc" has to stay invalid
  return Number(normalized);
};

const isEmptyRuleValue = (v: unknown) => v === '' || v === null || v === undefined;

export const numberRules = [
  (v: unknown) => {
    if (isEmptyRuleValue(v)) return i18n.global.t('validators.enterValue');

    if (!Number.isFinite(ruleValueAsNumber(v))) return i18n.global.t('validators.invalidNumber');

    return true;
  },
];

/** Like `numberRules`, but additionally requires a finite value strictly greater than zero. */
export const positiveNumberRules = [
  ...numberRules,
  (v: unknown) => {
    const val = ruleValueAsNumber(v);
    if (!Number.isFinite(val) || val <= 0) return i18n.global.t('validators.positiveNumber');

    return true;
  },
];

export const changeItem = (item: object, value: string, el?: HTMLInputElement, formatter?: (v: number) => number) => {
  if (el.value === '') el.value = '0';

  const val = parseFloat(el.value.replace(/\s/g, '').replace(',', '.'));
  if (!Number.isFinite(val)) return restoreRenderedValue(el, item[value]);

  executeModelMutationWithUndo(() => {
    setUnsolved();
    item[value] = formatter ? formatter(val) : val;
  });
};

export const changeLabel = (map: string, item: EntityWithLabel, el?: HTMLInputElement) => {
  setUnsolved();

  const _showLoads = useViewerStore().showLoads;
  useViewerStore().showLoads = false;

  //if (isNaN(parseInt(el.value))) return;
  if (useProjectStore().solver.domain[map].has(el.value)) {
    alert('ERROR: Label ' + el.value + ' already used!');
    el.value = item.label;
    return;
  }

  const prevId = item.label;

  item.label = el.value;
  useProjectStore().solver.domain[map].set(item.label, item);

  if (map === 'nodes') {
    for (const [key, element] of useProjectStore().solver.domain.elements) {
      const idtomodify = element.nodes.findIndex((nid) => nid == prevId);
      if (idtomodify > -1) {
        element.nodes[idtomodify] = item.label;
      }
    }

    for (const load of useProjectStore().solver.loadCases[0].nodalLoadList) {
      if (load.target == prevId) {
        load.target = item.label;
      }
    }
  }

  if (map === 'elements') {
    for (const load of useProjectStore().solver.loadCases[0].elementLoadList) {
      if (load.target == prevId) {
        load.target = item.label;
      }
    }
  }

  if (map === 'materials') {
    for (const [key, element] of useProjectStore().solver.domain.elements) {
      if (element.mat == prevId) {
        element.mat = item.label;
      }
    }
  }

  if (map === 'crossSections') {
    for (const [key, element] of useProjectStore().solver.domain.elements) {
      if (element.cs == prevId) {
        element.cs = item.label;
      }
    }
  }

  // delete current
  useProjectStore().solver.domain[map].delete(prevId);

  useViewerStore().showLoads = _showLoads;

  solve();
};

export const toggleSet = (item: unknown, set: string, value: number) => {
  executeModelMutationWithUndo(() => {
    setUnsolved();

    if (item[set].has(value)) item[set].delete(value);
    else item[set].add(value);

    item[set] = new Set(item[set].values());
  });
};

export const toggleArray = (item: unknown, set: string, value: number) => {
  executeModelMutationWithUndo(() => {
    setUnsolved();
    item[set][value] = !item[set][value];
  });
};

export const toggleBoolean = (item: unknown, value: string) => {
  executeModelMutationWithUndo(() => {
    setUnsolved();
    item[value] = !item[value];
  });
};

const removeElementFromModel = (id: string) => {
  setUnsolved();

  // delete element load
  for (const lc of useProjectStore().solver.loadCases) {
    for (let i = 0; i < lc.elementLoadList.length; i++) {
      if (lc.elementLoadList[i].target === id) {
        lc.elementLoadList.splice(i, 1);
        i--;
      }
    }
  }

  // Remove from selections
  const index = useProjectStore().selection2.elements.indexOf(id);
  if (index > -1) useProjectStore().selection2.elements.splice(index, 1);
  useProjectStore().clearSelection();

  useProjectStore().solver.domain.elements.delete(id);
};

export const deleteElement = (id: string, trackHistory = true) => {
  if (!trackHistory) {
    removeElementFromModel(id);
    return;
  }

  executeModelMutationWithUndo(() => removeElementFromModel(id));
};

const removeNodeFromModel = (id: string) => {
  setUnsolved();
  useProjectStore().clearSelection();

  // delete relevant dimensioning
  const removedDimensionIds: string[] = [];
  useProjectStore().dimensions = useProjectStore().dimensions.filter((dim) => {
    const shouldRemove = dim.points.some((point) => String(point.sourceNodeLabel ?? '') === id);
    if (shouldRemove) removedDimensionIds.push(ensureDimensionId(dim));
    return !shouldRemove;
  });

  if (removedDimensionIds.length > 0) {
    useProjectStore().selection2.dimensions = useProjectStore().selection2.dimensions.filter(
      (dimId) => !removedDimensionIds.includes(dimId)
    );
  }

  // delete elements first
  for (const [key, value] of useProjectStore().solver.domain.elements) {
    if (value.nodes[0] === id || value.nodes[1] === id) {
      removeElementFromModel(key);
    }
  }

  // delete all loads on this node
  for (const loadCase of useProjectStore().solver.loadCases) {
    loadCase.solved = false;
    for (let i = loadCase.nodalLoadList.length - 1; i >= 0; i--) {
      if (loadCase.nodalLoadList[i].target === id) {
        loadCase.nodalLoadList.splice(i, 1);
      }
    }

    for (let i = loadCase.prescribedBC.length - 1; i >= 0; i--) {
      if (loadCase.prescribedBC[i].target === id) {
        loadCase.prescribedBC.splice(i, 1);
      }
    }
  }

  // Remove from selections
  const index = useProjectStore().selection2.nodes.indexOf(id);
  if (index > -1) useProjectStore().selection2.nodes.splice(index, 1);
  useProjectStore().clearSelection();

  useProjectStore().solver.domain.nodes.delete(id);
};

export const deleteNode = (id: string, trackHistory = true) => {
  if (!trackHistory) {
    removeNodeFromModel(id);
    return;
  }

  executeModelMutationWithUndo(() => removeNodeFromModel(id));
};

const removeMaterialFromModel = (id: string) => {
  setUnsolved();
  useProjectStore().solver.domain.materials.delete(id);
};

/** Labels of elements that reference the given material. */
export const elementsUsingMaterial = (id: string) =>
  [...useProjectStore().solver.domain.elements.values()]
    .filter((e) => String(e.mat) === String(id))
    .map((e) => e.label);

/** Labels of elements that reference the given cross-section. */
export const elementsUsingCrossSection = (id: string) =>
  [...useProjectStore().solver.domain.elements.values()].filter((e) => String(e.cs) === String(id)).map((e) => e.label);

/** Deletes a material. Refuses (returns `false`) while any element still references it. */
export const deleteMaterial = (id: string, trackHistory = true) => {
  const used = elementsUsingMaterial(id);
  if (used.length > 0) {
    alert(i18n.global.t('validators.materialInUse', { elements: used.join(', ') }));
    return false;
  }

  if (!trackHistory) {
    removeMaterialFromModel(id);
    return true;
  }

  executeModelMutationWithUndo(() => removeMaterialFromModel(id));
  return true;
};

const removeCrossSectionFromModel = (id: string) => {
  setUnsolved();
  useProjectStore().solver.domain.crossSections.delete(id);
};

/** Deletes a cross-section. Refuses (returns `false`) while any element still references it. */
export const deleteCrossSection = (id: string, trackHistory = true) => {
  const used = elementsUsingCrossSection(id);
  if (used.length > 0) {
    alert(i18n.global.t('validators.crossSectionInUse', { elements: used.join(', ') }));
    return false;
  }

  if (!trackHistory) {
    removeCrossSectionFromModel(id);
    return true;
  }

  executeModelMutationWithUndo(() => removeCrossSectionFromModel(id));
  return true;
};

/** Removes `load` from `list` by identity; the row index in a (sortable) table is not a model index. */
const removeLoadFromList = (list: unknown[], load: unknown) => {
  const index = list.indexOf(load);
  if (index < 0) return;

  setUnsolved();
  useProjectStore().clearSelection();
  list.splice(index, 1);
};

const removeNodalLoadFromModel = (load: NodalLoad) => {
  removeLoadFromList(useProjectStore().solver.loadCases[0].nodalLoadList, load);
};

export const deleteNodalLoad = (load: NodalLoad, _id?: number, trackHistory = true) => {
  if (!trackHistory) {
    removeNodalLoadFromModel(load);
    return;
  }

  executeModelMutationWithUndo(() => removeNodalLoadFromModel(load));
};

const removeElementLoadFromModel = (load: unknown) => {
  removeLoadFromList(useProjectStore().solver.loadCases[0].elementLoadList, load);
};

export const deleteElementLoad = (load: unknown, _id?: number, trackHistory = true) => {
  if (!trackHistory) {
    removeElementLoadFromModel(load);
    return;
  }

  executeModelMutationWithUndo(() => removeElementLoadFromModel(load));
};

const removePrescribedDisplacementFromModel = (load: unknown) => {
  removeLoadFromList(useProjectStore().solver.loadCases[0].prescribedBC, load);
};

export const deletePrescribedDisplacement = (load: unknown, _id?: number, trackHistory = true) => {
  if (!trackHistory) {
    removePrescribedDisplacementFromModel(load);
    return;
  }

  executeModelMutationWithUndo(() => removePrescribedDisplacementFromModel(load));
};

export const nameBeamForce = (dof: number) => {
  if (dof === 0) return 'X';
  if (dof === 1) return 'Z';
  if (dof === 2) return 'M';
  if (dof === 3) return 'X';
  if (dof === 4) return 'Z';
  if (dof === 5) return 'M';
  return '';
};

export function decimalCount(number) {
  // Convert to String
  const numberAsString = number.toString();
  // String Contains Decimal
  if (numberAsString.includes('.')) {
    return numberAsString.split('.')[1].length;
  }
  // String Does Not Contain Decimal
  return 0;
}

export function float2String(v: number) {
  const numDec = decimalCount(v);
  let s = v.toString();
  if (numDec > 15) s = s.substr(0, s.length - 1);

  // now count zeros at end
  let zeros = 0;
  for (let c = 1; c < numDec; c++) {
    if (s[s.length - c] === '0') zeros++;
    else break;
  }

  if (zeros > 0) return parseFloat(s.substr(0, s.length - zeros));

  return v;
}

export function isMobile(): boolean {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  // Adjust this value as per your requirements
  const mobileScreenWidthThreshold = 768;

  return isMobile || screenWidth < mobileScreenWidthThreshold;
}

export const copyNode = (n: Node, d: { x: number; z: number }) => {
  let newNodeId = n.domain.nodes.size + 1;

  while (n.domain.nodes.has(newNodeId.toString())) {
    newNodeId++;
  }

  // Add node
  n.domain.createNode(newNodeId.toString(), [n.coords[0] + d.x, n.coords[1], n.coords[2] + d.z], [...n.bcs.values()]);

  if (n.hasLcs()) n.domain.nodes.get(newNodeId.toString()).updateLcs({ locx: n.lcs[0], locy: n.lcs[1] });

  return newNodeId.toString();
};
