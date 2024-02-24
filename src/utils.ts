import { Beam2D, BeamElementUniformEdgeLoad, LinearStaticSolver, NodalLoad, Node } from "ts-fem";
import { Ref } from "vue";
import { availableLocales, i18n } from "./plugins/i18n";
import { useProjectStore } from "./store/project";
import { Command, IKeyValue, undoRedoManager } from "./CommandManager";
import { useViewerStore } from "./store/viewer";

export type EntityWithLabel = { label: string & { [key: string]: unknown } };

export const throttle = (fn: Function, wait = 300) => {
  let inThrottle: boolean, lastFn: ReturnType<typeof setTimeout>, lastTime: number;
  return function (this: any) {
    const context = this,
      // eslint-disable-next-line prefer-rest-params
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(
        () => {
          if (Date.now() - lastTime >= wait) {
            fn.apply(context, args);
            lastTime = Date.now();
          }
        },
        Math.max(wait - (Date.now() - lastTime), 0)
      );
    }
  };
};

export const debounce = (fn: Function, wait = 300) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any) {
    const context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
};

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

function objectToBase64(obj: unknown) {
  try {
    // Convert the object to a JSON string
    const jsonString = JSON.stringify(obj);

    // Use btoa to convert the JSON string to base64
    const base64String = btoa(jsonString);

    return base64String;
  } catch (error) {
    console.error("Error converting object to base64:", error);
    return null;
  }
}

function base64ToObject(base64String) {
  try {
    // Use atob to decode the base64 string
    const jsonString = atob(base64String);

    // Parse the JSON string to get the original object
    const obj = JSON.parse(jsonString);

    return obj;
  } catch (error) {
    console.error("Error decoding base64 to object:", error);
    return null;
  }
}

export const serializeModel = (ls: LinearStaticSolver) => {
  const _nodes = [];
  const _elements = [];
  const _materials = [];
  const _css = [];
  const eloads = [];
  const nloads = [];
  const pd = [];

  ls.domain.nodes.forEach((node, id) => {
    _nodes.push([id, node.coords, Array.from(node.bcs.values())]);
  });

  ls.domain.elements.forEach((element: Beam2D, id) => {
    _elements.push([id, element.nodes, element.mat, element.cs, element.hinges]);
  });

  ls.domain.materials.forEach((material, id) => {
    _materials.push([id, material.d, material.e, material.g, material.alpha]);
  });

  ls.domain.crossSections.forEach((cs, id) => {
    _css.push([id, cs.a, cs.iy, cs.h, cs.k]);
  });

  ls.loadCases[0].elementLoadList.forEach((load) => {
    eloads.push([load.target, load.values]);
  });

  ls.loadCases[0].nodalLoadList.forEach((load) => {
    nloads.push([load.target, load.values]);
  });

  ls.loadCases[0].prescribedBC.forEach((load) => {
    pd.push([load.target, load.prescribedValues]);
  });

  const obj: {
    n?: unknown[];
    e?: unknown[];
    m?: unknown[];
    cs?: unknown[];
    el?: unknown[];
    nl?: unknown[];
    pd?: unknown[];
  } = {};

  if (_nodes.length > 0) obj.n = _nodes;
  if (_elements.length > 0) obj.e = _elements;
  if (_materials.length > 0) obj.m = _materials;
  if (_css.length > 0) obj.cs = _css;
  if (eloads.length > 0) obj.el = eloads;
  if (nloads.length > 0) obj.nl = nloads;
  if (pd.length > 0) obj.pd = pd;

  return objectToBase64(obj);
};

export const deserializeModel = (base64String: string, ls: LinearStaticSolver) => {
  const tmp = base64ToObject(base64String);
  console.log(tmp);

  ls.domain.nodes.clear();
  ls.domain.elements.clear();

  if ("n" in tmp) {
    for (const e of tmp.n) {
      ls.domain.createNode(e[0], e[1], e[2]);
    }
  }

  if ("e" in tmp) {
    for (const e of tmp.e) {
      ls.domain.createBeam2D(e[0], e[1], e[2], e[3], e[4]);
    }
  }

  if ("m" in tmp) {
    for (const e of tmp.m) {
      ls.domain.createMaterial(e[0], { d: e[1], e: e[2], g: e[3], alpha: e[4] });
    }
  }

  if ("cs" in tmp) {
    for (const e of tmp.cs) {
      ls.domain.createCrossSection(e[0], { a: e[1], iy: e[2], h: e[3], k: e[4] });
    }
  }

  if ("el" in tmp) {
    for (const e of tmp.el) {
      ls.loadCases[0].createBeamElementUniformEdgeLoad(e[0], e[1], true);
    }
  }

  if ("nl" in tmp) {
    for (const e of tmp.nl) {
      ls.loadCases[0].createNodalLoad(e[0], e[1]);
    }
  }

  if ("pd" in tmp) {
    for (const e of tmp.pd) {
      ls.loadCases[0].createPrescribedDisplacement(e[0], e[1]);
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

export const formatScientificNumber = (n: number) => {
  if (n > 1000 || n < 0.001) return n.toExponential(4);

  return n;
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
};

export const deleteCrossSection = (id: string) => {
  setUnsolved();
  useProjectStore().solver.domain.crossSections.delete(id);
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
