import {
  Node,
  LinearStaticSolver,
  Beam2D,
  BeamElementUniformEdgeLoad,
  BeamConcentratedLoad,
  BeamTemperatureLoad,
} from 'ts-fem';

type DimLine = { distance: number; nodes: Node[] };

function objectToBase64(obj: unknown) {
  try {
    // Convert the object to a JSON string
    const jsonString = JSON.stringify(obj);

    // Use btoa to convert the JSON string to base64
    const base64String = btoa(jsonString);

    return base64String;
  } catch (error) {
    console.error('Error converting object to base64:', error);
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
    console.warn('Error decoding base64 to object:', error);
    return null;
  }
}

export const serializeModel = (ls: LinearStaticSolver, dims: DimLine[]) => {
  const _nodes = [];
  const _elements = [];
  const _materials = [];
  const _css = [];
  const eloads = [];
  const ecloads = [];
  const etloads = [];
  const nloads = [];
  const pd = [];

  ls.domain.nodes.forEach((node, id) => {
    _nodes.push([
      id,
      node.coords,
      Array.from(node.bcs.values()),
      node.hasLcs() ? [...node.lcs[0], ...node.lcs[1]] : null,
    ]);
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

  ls.loadCases[0].elementLoadList
    .filter((el) => el instanceof BeamElementUniformEdgeLoad)
    .forEach((load: BeamElementUniformEdgeLoad) => {
      eloads.push([load.target, load.values, load.lcs]);
    });

  ls.loadCases[0].elementLoadList
    .filter((el) => el instanceof BeamConcentratedLoad)
    .forEach((load: BeamConcentratedLoad) => {
      ecloads.push([load.target, load.values, load.lcs]);
    });

  ls.loadCases[0].elementLoadList
    .filter((el) => el instanceof BeamTemperatureLoad)
    .forEach((load: BeamTemperatureLoad) => {
      etloads.push([load.target, load.values]);
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
    ecl?: unknown[];
    etl?: unknown[];
    nl?: unknown[];
    pd?: unknown[];
    d?: unknown[];
  } = {};

  if (_nodes.length > 0) obj.n = _nodes;
  if (_elements.length > 0) obj.e = _elements;
  if (_materials.length > 0) obj.m = _materials;
  if (_css.length > 0) obj.cs = _css;
  if (eloads.length > 0) obj.el = eloads;
  if (ecloads.length > 0) obj.ecl = ecloads;
  if (etloads.length > 0) obj.etl = etloads;
  if (nloads.length > 0) obj.nl = nloads;
  if (pd.length > 0) obj.pd = pd;

  obj.d = dims.map((e) => {
    return [e.distance, e.nodes.map((n) => n.label)];
  });

  return objectToBase64(obj);
};

export const deserializeModel = (base64String: string, ls: LinearStaticSolver, dims) => {
  const tmp = base64ToObject(base64String);

  ls.domain.nodes.clear();
  ls.domain.elements.clear();

  if (tmp === null) return;

  if ('n' in tmp) {
    for (const e of tmp.n) {
      const node = ls.domain.createNode(e[0], e[1], e[2]);

      if (e[3] !== undefined && e[3] !== null) {
        const locx = e[3].slice(0, 3);
        const locy = e[3].slice(3, 6);

        node.updateLcs({ locx, locy });
      }
    }
  }

  if ('e' in tmp) {
    for (const e of tmp.e) {
      ls.domain.createBeam2D(e[0], e[1], e[2], e[3], e[4]);
    }
  }

  if ('m' in tmp) {
    for (const e of tmp.m) {
      ls.domain.createMaterial(e[0], { d: e[1], e: e[2], g: e[3], alpha: e[4] });
    }
  }

  if ('cs' in tmp) {
    for (const e of tmp.cs) {
      ls.domain.createCrossSection(e[0], { a: e[1], iy: e[2], h: e[3], k: e[4] });
    }
  }

  if ('el' in tmp) {
    for (const e of tmp.el) {
      const lcs = e[2] !== undefined ? e[2] : true;
      ls.loadCases[0].createBeamElementUniformEdgeLoad(e[0], e[1], lcs);
    }
  }

  if ('ecl' in tmp) {
    for (const e of tmp.ecl) {
      const lcs = e[2] !== undefined ? e[2] : true;
      ls.loadCases[0].createBeamConcentratedLoad(e[0], e[1], lcs);
    }
  }

  if ('etl' in tmp) {
    for (const e of tmp.etl) {
      ls.loadCases[0].createBeamTemperatureLoad(e[0], e[1]);
    }
  }

  if ('nl' in tmp) {
    for (const e of tmp.nl) {
      ls.loadCases[0].createNodalLoad(e[0], e[1]);
    }
  }

  if ('pd' in tmp) {
    for (const e of tmp.pd) {
      ls.loadCases[0].createPrescribedDisplacement(e[0], e[1]);
    }
  }

  if ('d' in tmp) {
    for (const e of tmp.d) {
      try {
        dims.push({ distance: e[0], nodes: e[1].map((n) => ls.domain.getNode(n)) });
      } catch (e) {
        console.warn('Error deserializing dimensions: ', e);
      }
    }
  }
};
