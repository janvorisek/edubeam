import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { useProjectStore } from './project';
import { Beam2D, BeamConcentratedLoad, BeamElementUniformEdgeLoad, BeamTemperatureLoad } from 'ts-fem';
import { copyNode, loadType, setUnsolved, solve } from '@/utils';

type Selection = {
  nodes: string[];
  elements: string[];
  nodalLoads: number[];
  elementLoads: number[];
  prescribedBC: number[];
};

export const useClipboardStore = defineStore('clipboard', () => {
  const selection = reactive<Selection>({
    nodes: [],
    elements: [],
    nodalLoads: [],
    elementLoads: [],
    prescribedBC: [],
  });

  const select = (sel: Selection) => {
    selection.nodes = sel.nodes;
    selection.elements = sel.elements;
    selection.nodalLoads = sel.nodalLoads;
    selection.elementLoads = sel.elementLoads;
    selection.prescribedBC = sel.prescribedBC;
  };

  const paste = (d: { x: number; z: number } = { x: 0, z: 0 }) => {
    const projectStore = useProjectStore();
    setUnsolved();
    const nodeMap = new Map<string, string>();
    const elMap = new Map<string, string>();

    // Loop and and nodes
    for (const node of selection.nodes) {
      const n = projectStore.solver.domain.nodes.get(node);

      const newNodeId = copyNode(n, d);
      nodeMap.set(node, newNodeId.toString());
    }

    // Loop and add elements
    for (const element of selection.elements) {
      const e = projectStore.solver.domain.elements.get(element) as Beam2D;

      const nodes = e.nodes.map((n) => nodeMap.get(n) ?? copyNode(projectStore.solver.domain.nodes.get(n)!, d));

      let newElId = projectStore.solver.domain.elements.size + 1;

      while (projectStore.solver.domain.elements.has(newElId.toString())) {
        newElId++;
      }

      elMap.set(element, newElId.toString());

      projectStore.solver.domain.createBeam2D(newElId.toString(), nodes, e.mat, e.cs, e.hinges);
    }

    for (const load of selection.nodalLoads) {
      const l = projectStore.solver.loadCases[0].nodalLoadList[load];
      projectStore.solver.loadCases[0].createNodalLoad(nodeMap.get(l.target)!, l.values);
    }

    for (const load of selection.prescribedBC) {
      const l = projectStore.solver.loadCases[0].prescribedBC[load];
      projectStore.solver.loadCases[0].createPrescribedDisplacement(nodeMap.get(l.target)!, l.prescribedValues);
    }

    for (const load of selection.elementLoads) {
      const l = projectStore.solver.loadCases[0].elementLoadList[load];
      if (l instanceof BeamConcentratedLoad) {
        projectStore.solver.loadCases[0].createBeamConcentratedLoad(elMap.get(l.target)!, l.values, l.lcs);
      } else if (l instanceof BeamElementUniformEdgeLoad) {
        projectStore.solver.loadCases[0].createBeamElementUniformEdgeLoad(elMap.get(l.target)!, l.values, l.lcs);
      } else if (l instanceof BeamTemperatureLoad) {
        projectStore.solver.loadCases[0].createBeamTemperatureLoad(elMap.get(l.target)!, l.values);
      }
    }

    solve();
  };

  const midpoint = () => {
    let min = [Infinity, Infinity, Infinity];
    let max = [-Infinity, -Infinity, -Infinity];

    for (const node of selection.nodes) {
      const n = useProjectStore().solver.domain.nodes.get(node)!;
      min = [Math.min(min[0], n.coords[0]), Math.min(min[1], n.coords[1]), Math.min(min[2], n.coords[2])];
      max = [Math.max(max[0], n.coords[0]), Math.max(max[1], n.coords[1]), Math.max(max[2], n.coords[2])];
    }

    // loop elements
    for (const element of selection.elements) {
      const e = useProjectStore().solver.domain.elements.get(element) as Beam2D;
      for (const n of e.nodes) {
        const node = useProjectStore().solver.domain.nodes.get(n)!;
        min = [Math.min(min[0], node.coords[0]), Math.min(min[1], node.coords[1]), Math.min(min[2], node.coords[2])];
        max = [Math.max(max[0], node.coords[0]), Math.max(max[1], node.coords[1]), Math.max(max[2], node.coords[2])];
      }
    }

    return [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
  };

  const isAnythingInClipboard = () => {
    return (
      selection.nodes.length > 0 ||
      selection.elements.length > 0 ||
      selection.nodalLoads.length > 0 ||
      selection.elementLoads.length > 0 ||
      selection.prescribedBC.length > 0
    );
  };

  return {
    selection,
    select,
    paste,
    midpoint,
    isAnythingInClipboard,
  };
});
