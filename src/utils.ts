import { Beam2D, LinearStaticSolver, Node } from "ts-fem";
import { Ref } from "vue";
import { availableLocales } from "./plugins/i18n";

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

  return objectToBase64({ n: _nodes, e: _elements, m: _materials, cs: _css, el: eloads, nl: nloads });
};

export const deserializeModel = (base64String: string, ls: LinearStaticSolver) => {
  const tmp = base64ToObject(base64String);
  console.log(tmp);

  ls.domain.nodes.clear();
  ls.domain.elements.clear();

  for (const e of tmp.n) {
    ls.domain.createNode(e[0], e[1], e[2]);
  }

  for (const e of tmp.e) {
    ls.domain.createBeam2D(e[0], e[1], e[2], e[3], e[4]);
  }

  for (const e of tmp.m) {
    ls.domain.createMaterial(e[0], { d: e[1], e: e[2], g: e[3], alpha: e[4] });
  }

  for (const e of tmp.cs) {
    ls.domain.createCrossSection(e[0], { a: e[1], iy: e[2], h: e[3], k: e[4] });
  }

  for (const e of tmp.el) {
    ls.loadCases[0].createBeamElementUniformEdgeLoad(e[0], e[1], true);
  }

  for (const e of tmp.nl) {
    ls.loadCases[0].createNodalLoad(e[0], e[1]);
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
