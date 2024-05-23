import {
  Beam2D,
  BeamConcentratedLoad,
  BeamElementUniformEdgeLoad,
  BeamTemperatureLoad,
  DofID,
  LinearStaticSolver,
  Load,
  NodalLoad,
  Node,
  PrescribedDisplacement,
} from "ts-fem";
import { Ref } from "vue";
import { availableLocales, i18n } from "../plugins/i18n";
import { useProjectStore } from "../store/project";
import { Command, IKeyValue, undoRedoManager } from "../CommandManager";
import { useViewerStore } from "../store/viewer";

import { loadType } from "./loadType";

export type EntityWithLabel = { label: string & { [key: string]: unknown } };

export { throttle } from "./throttle";
export { debounce } from "./debounce";

export { serializeModel } from "./serializeModel";
export { deserializeModel } from "./serializeModel";

export { smoothPath } from "./smoothPath";
export { loadType } from "./loadType";

export { loadXmlFile } from "./loadXmlFile";

export { formatScientificNumber } from "./formatScientificNumber";

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const checkNumber = (e: KeyboardEvent) => {
  if (e.key === "Escape") if ("activeElement" in document) (document.activeElement as HTMLElement).blur();

  const isNumber = !isNaN(e.key as unknown as number);

  const isActionKey =
    (e.ctrlKey && e.key === "a") ||
    (e.ctrlKey && e.key === "c") ||
    (e.ctrlKey && e.key === "v") ||
    (e.ctrlKey && e.key === "x") ||
    e.key === "Escape" ||
    e.key === "Delete" ||
    e.key === "Backspace" ||
    e.key === "Enter" ||
    e.key === "Tab" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowLeft" ||
    e.key === "End" ||
    e.key === "Home" ||
    e.key === "e" ||
    e.key === "-";

  const isComma = e.key === "," || e.key === ".";

  if (isNumber || isActionKey || isComma) return;

  e.stopPropagation();
  e.preventDefault();
};

export const download = (filename: string, text: string) => {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", filename);

  element.style.display = "none";
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
        return {
          type: loadType(el),
          target: el.target,
          values: el.values,
          lcs: el.lcs,
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
  };
};

export const importJSON = (json: any) => {
  const jObj = json;

  // Parse materials
  if (jObj.domain.materials) {
    for (const material of jObj.domain.materials) {
      useProjectStore().solver.domain.createMaterial(material.label, material);
    }
  }

  // Parse cross sections
  if (jObj.domain.crossSections) {
    for (const cs of jObj.domain.crossSections) {
      useProjectStore().solver.domain.createCrossSection(cs.label, cs);
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
        if (!("type" in el) || el.type === "udl")
          useProjectStore().solver.loadCases[0].createBeamElementUniformEdgeLoad(el.target, el.values, el.lcs ?? true);
        else if ("type" in el && el.type === "concentrated")
          useProjectStore().solver.loadCases[0].createBeamConcentratedLoad(el.target, el.values, el.lcs ?? true);
        else if ("type" in el && el.type === "temperature")
          useProjectStore().solver.loadCases[0].createBeamTemperatureLoad(el.target, el.values);
      }

      for (const pbc of loadCase.prescribedBC) {
        useProjectStore().solver.loadCases[0].createPrescribedDisplacement(pbc.target, pbc.prescribedValues);
      }
    }
  }
};

export const suggestLanguage = () => {
  const langs = navigator.languages || [navigator.language];

  for (const lang of langs) {
    if (availableLocales.some((l) => l.code === lang)) return lang;
  }

  return "en";
};

export const parseFloat2 = (s: string | number) => {
  s = s.toString();

  if (s === "") return 0;
  if (s === "-") return 0;

  s = s.replaceAll(/\s/g, "");

  let tmp = parseFloat(s.replace(",", "."));

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

export const changeSetArrayItem = (
  item: unknown,
  set: string,
  value: number,
  el?: HTMLInputElement,
  formatter?: (v: number) => number
) => {
  setUnsolved();

  const prevVal = item[set][value];

  if (el.value === "") el.value = "0";

  const val = parseFloat(el.value.replace(/\s/g, "").replace(",", "."));
  if (isNaN(val)) return (el.value = item[set][value]);

  if (formatter) item[set][value] = formatter(val);
  else item[set][value] = val;

  // undo/redo
  {
    const setCommand = new Command<IKeyValue>(
      (value) => {
        value.item[value.set][value.value] = value.next as number;
        solve();
      },
      (value) => {
        value.item[value.set][value.value] = value.prev as number;
        solve();
      },
      { item, set, value, prev: prevVal, next: item[set][value] }
    );

    undoRedoManager.executeCommand(setCommand); // execute command
  }

  solve();
};

export const changeRefNumValue = (value: string) => {
  const val = parseFloat(value.replace(/\s/g, "").replace(",", "."));
  if (isNaN(val)) return 0;

  return val;
};

export const numberRules = [
  (v: string) => {
    if (v === "") return i18n.global.t("validators.enterValue");

    const tmp = v.replace(/\s/g, "").replace(",", ".");

    // isNaN accepts a string, the types are wrong
    if (isNaN(tmp as unknown as number)) return i18n.global.t("validators.invalidNumber");

    return true;
  },
];

export const changeItem = (item: object, value: string, el?: HTMLInputElement, formatter?: (v: number) => number) => {
  setUnsolved();

  const prevVal = item[value];

  if (el.value === "") el.value = "0";

  const val = parseFloat(el.value.replace(/\s/g, "").replace(",", "."));
  //if (isNaN(val)) return (el.value = item[value]);

  if (formatter) item[value] = formatter(val);
  else item[value] = val;

  // undo/redo
  {
    const setCommand = new Command<IKeyValue>(
      (value) => {
        value.item[value.value] = value.next as number;
        solve();
      },
      (value) => {
        value.item[value.value] = value.prev as number;
        solve();
      },
      { item, value, prev: prevVal, next: item[value] }
    );

    undoRedoManager.executeCommand(setCommand); // execute command
  }

  solve();
};

export const changeLabel = (map: string, item: EntityWithLabel, el?: HTMLInputElement) => {
  setUnsolved();

  const _showLoads = useViewerStore().showLoads;
  useViewerStore().showLoads = false;

  //if (isNaN(parseInt(el.value))) return;
  if (useProjectStore().solver.domain[map].has(el.value)) {
    alert("ERROR: Label " + el.value + " already used!");
    el.value = item.label;
    return;
  }

  const prevId = item.label;

  item.label = el.value;
  useProjectStore().solver.domain[map].set(item.label, item);

  if (map === "nodes") {
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

  if (map === "elements") {
    for (const load of useProjectStore().solver.loadCases[0].elementLoadList) {
      if (load.target == prevId) {
        load.target = item.label;
      }
    }
  }

  if (map === "materials") {
    for (const [key, element] of useProjectStore().solver.domain.elements) {
      if (element.mat == prevId) {
        element.mat = item.label;
      }
    }
  }

  if (map === "crossSections") {
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
  setUnsolved();

  const prevVal = new Set(Array.from(item[set]));

  if (item[set].has(value)) item[set].delete(value);
  else item[set].add(value);

  item[set] = new Set(item[set].values());

  const nextVal = new Set(Array.from(item[set]));

  // undo/redo
  {
    const setCommand = new Command<IKeyValue>(
      (value) => {
        setUnsolved();
        value.item[value.set] = value.next;
        solve();
      },
      (value) => {
        setUnsolved();
        value.item[value.set] = value.prev;
        solve();
      },
      { item, set, prev: prevVal, next: nextVal }
    );

    undoRedoManager.executeCommand(setCommand); // execute command
  }

  solve();
};

export const toggleArray = (item: unknown, set: string, value: number) => {
  setUnsolved();

  const prevVal = item[set][value];
  item[set][value] = !item[set][value];

  // undo/redo
  {
    const setCommand = new Command<IKeyValue>(
      (value) => {
        setUnsolved();
        value.item[value.set][value.value] = value.next as number;
        solve();
      },
      (value) => {
        setUnsolved();
        value.item[value.set][value.value] = value.prev as number;
        solve();
      },
      { item, set, value, prev: prevVal, next: item[set][value] }
    );

    undoRedoManager.executeCommand(setCommand); // execute command
  }

  solve();
};

export const toggleBoolean = (item: unknown, value: string) => {
  setUnsolved();
  const prevVal = item[value];

  item[value] = !item[value];

  // undo/redo
  {
    const setCommand = new Command<IKeyValue>(
      (value) => {
        setUnsolved();
        value.item[value.value] = value.next as number;
        solve();
      },
      (value) => {
        setUnsolved();
        value.item[value.value] = value.prev as number;
        solve();
      },
      { item, value, prev: prevVal, next: item[value] }
    );

    undoRedoManager.executeCommand(setCommand); // execute command
  }

  solve();
};

export const deleteElement = (id: string) => {
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

  solve();
};

export const deleteNode = (id: string) => {
  setUnsolved();
  useProjectStore().clearSelection();

  // delete relevant dimensioning
  useProjectStore().dimensions = useProjectStore().dimensions.filter(
    (dim) => dim.nodes[0].label !== id && dim.nodes[1].label !== id
  );

  // delete elements first
  for (const [key, value] of useProjectStore().solver.domain.elements) {
    if (value.nodes[0] === id || value.nodes[1] === id) {
      deleteElement(key);
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

  solve();
};

export const deleteMaterial = (id: string) => {
  setUnsolved();
  useProjectStore().solver.domain.materials.delete(id);
  solve();
};

export const deleteCrossSection = (id: string) => {
  setUnsolved();
  useProjectStore().solver.domain.crossSections.delete(id);
  solve();
};

export const deleteNodalLoad = (load: NodalLoad, id: number) => {
  setUnsolved();
  useProjectStore().clearSelection();
  const _id =
    id -
    useProjectStore().solver.loadCases[0].elementLoadList.length -
    useProjectStore().solver.loadCases[0].prescribedBC.length;
  useProjectStore().solver.loadCases[0].nodalLoadList.splice(_id, 1);
  solve();
};

export const deleteElementLoad = (load: BeamElementUniformEdgeLoad, id: number) => {
  setUnsolved();
  useProjectStore().clearSelection();
  useProjectStore().solver.loadCases[0].elementLoadList.splice(id, 1);
  solve();
};

export const deletePrescribedDisplacement = (load: BeamElementUniformEdgeLoad, id: number) => {
  setUnsolved();
  useProjectStore().clearSelection();
  const _id = id - useProjectStore().solver.loadCases[0].elementLoadList.length;
  useProjectStore().solver.loadCases[0].prescribedBC.splice(_id, 1);
  solve();
};

export const nameBeamForce = (dof: number) => {
  if (dof === 0) return "X";
  if (dof === 1) return "Z";
  if (dof === 2) return "M";
  if (dof === 3) return "X";
  if (dof === 4) return "Z";
  if (dof === 5) return "M";
  return "";
};

export function decimalCount(number) {
  // Convert to String
  const numberAsString = number.toString();
  // String Contains Decimal
  if (numberAsString.includes(".")) {
    return numberAsString.split(".")[1].length;
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
    if (s[s.length - c] === "0") zeros++;
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
