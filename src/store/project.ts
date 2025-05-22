// Utilities
import { defineStore } from 'pinia';
import { LinearStaticSolver, Beam2D, Node } from 'ts-fem';
import { ref, computed, reactive } from 'vue';
import { max, min } from 'mathjs';
import { deleteElement, deleteNode, deserializeModel, serializeModel, throttle } from '@/utils';

export const useProjectStore = defineStore(
  'project',
  () => {
    const model = ref('LinearStaticSolver');
    const _solver = ref('');
    const solver = ref(new LinearStaticSolver());

    const nthEigenVector = ref(1);

    const defoScale = ref(1);
    const normalForceScale = ref(1);
    const bendingMomentScale = ref(1);
    const shearForceScale = ref(1);

    const selection: {
      label: number | string | null;
      type: string | null;
      x: number;
      y: number;
    } = reactive({
      label: null,
      type: null,
      x: -999,
      y: -999,
    });

    const selection2 = reactive<{
      nodes: string[];
      elements: string[];
      nodalLoads: number[];
      elementLoads: number[];
      prescribedBC: number[];
    }>({
      nodes: [],
      elements: [],
      nodalLoads: [],
      elementLoads: [],
      prescribedBC: [],
    });

    const clearSelection = () => {
      selection.label = null;
      selection.type = null;
      selection.x = -999;
      selection.y = -999;
    };

    const clearSelection2 = () => {
      selection2.nodes = [];
      selection2.elements = [];
      selection2.nodalLoads = [];
      selection2.elementLoads = [];
      selection2.prescribedBC = [];
    };

    const isAnythingSelected2 = () => {
      return (
        selection2.nodes.length > 0 ||
        selection2.elements.length > 0 ||
        selection2.nodalLoads.length > 0 ||
        selection2.elementLoads.length > 0 ||
        selection2.prescribedBC.length > 0
      );
    };

    const hover: {
      label: number | string | null;
      type: string | null;
      x: number;
      y: number;
    } = {
      label: null,
      type: null,
      x: -999,
      y: -999,
    };

    const nodes = computed(() => {
      return [...solver.value.domain.nodes.values()];
    });

    const materials = computed(() => {
      return [...solver.value.domain.materials.values()];
    });

    const crossSections = computed(() => {
      return [...solver.value.domain.crossSections.values()];
    });

    const beams = computed(() => {
      const vals = solver.value.domain.elements.values();
      const arr = Array.from(vals);
      const d = solver.value.domain;
      return arr.filter((e) => e instanceof Beam2D && d.nodes.has(e.nodes[0]) && d.nodes.has(e.nodes[1])) as Beam2D[];
    });

    const _solve = () => {
      solver.value.codeNumberGenerated = false;

      if (solver.value.domain.elements.size === 0 || solver.value.domain.nodes.size === 0) return;

      try {
        solver.value.solve();
      } catch (e) {
        solver.value.loadCases[0].solved = false;
        return;
      }

      // Check if at least 3 dofs are supported
      let nSup = 0;

      for (const node of solver.value.domain.nodes.values()) {
        nSup += node.bcs.size;
      }

      if (nSup < 3) {
        solver.value.loadCases[0].solved = false;
        return;
      }

      // Check for large deformations - kinematically indeterminate structures
      const maxU = Math.max(...(solver.value.loadCases[0].r.toArray() as number[]).map((v) => Math.abs(v)));
      if (maxU > 1e6) {
        solver.value.loadCases[0].solved = false;
        return;
      }

      let maxDefo = 1e-32; //Math.max(Math.abs(max(r)), Math.abs(min(r)));
      let maxNormalForce = 1e-32;
      let maxBendingMoment = 1e-32;
      let maxShearForce = 1e-32;

      for (const beam of solver.value.domain.elements.values()) {
        let def = (beam as Beam2D).computeGlobalDefl(solver.value.loadCases[0], 10);

        const n = (beam as Beam2D).computeNormalForce(solver.value.loadCases[0], 10).N as number[];
        const v = (beam as Beam2D).computeShearForce(solver.value.loadCases[0], 10).V as number[];
        const m = (beam as Beam2D).computeBendingMoment(solver.value.loadCases[0], 10).M as number[];

        if (model.value === 'LinearStaticSolver') {
          maxDefo = Math.max(
            maxDefo,
            Math.abs(max(def.u)),
            Math.abs(min(def.u)),
            Math.abs(max(def.w)),
            Math.abs(min(def.w))
          );
        } else if (model.value === 'EigenValueDynamicSolver') {
          def = (beam as Beam2D).computeGlobalEigenMode(
            solver.value.loadCases[0],
            useProjectStore().nthEigenVector - 1,
            10
          );

          maxDefo = Math.max(
            maxDefo,
            Math.abs(max(def.u)),
            Math.abs(min(def.u)),
            Math.abs(max(def.w)),
            Math.abs(min(def.w))
          );
        }

        maxNormalForce = Math.max(maxNormalForce, Math.abs(max(n)), Math.abs(min(n)));

        maxBendingMoment = Math.max(maxBendingMoment, Math.abs(max(m)), Math.abs(min(m)));

        maxShearForce = Math.max(maxShearForce, Math.abs(max(v)), Math.abs(min(v)));
      }

      if (maxDefo === 1e-32 && solver.value.loadCases[0].prescribedBC.length > 0) {
        for (const bc of solver.value.loadCases[0].prescribedBC) {
          const ux = Math.abs(bc.prescribedValues[0]);
          const uz = Math.abs(bc.prescribedValues[2]);
          maxDefo = Math.max(maxDefo, ux, uz);
        }
      }

      useProjectStore().defoScale = 1 / maxDefo;
      useProjectStore().normalForceScale = 1 / maxNormalForce;
      useProjectStore().bendingMomentScale = 1 / maxBendingMoment;
      useProjectStore().shearForceScale = 1 / maxShearForce;
    };

    const solve = throttle(_solve, 50);

    const selectAll2 = () => {
      clearSelection2();

      for (const node of solver.value.domain.nodes.values()) {
        selection2.nodes.push(node.label);
      }

      for (const element of solver.value.domain.elements.values()) {
        selection2.elements.push(element.label);
      }

      for (let i = 0; i < solver.value.loadCases[0].nodalLoadList.length; i++) {
        selection2.nodalLoads.push(i);
      }

      for (let i = 0; i < solver.value.loadCases[0].elementLoadList.length; i++) {
        selection2.elementLoads.push(i);
      }

      for (let i = 0; i < solver.value.loadCases[0].prescribedBC.length; i++) {
        selection2.prescribedBC.push(i);
      }
    };

    const deleteSelection2 = () => {
      // Delete selected elements and corresponding element loads
      let toDelete = [];
      for (const element of selection2.elements) {
        toDelete.push(element);
      }

      for (const element of toDelete) {
        deleteElement(element);
      }

      // Delete selected nodes and corresponding elements & nodal loads
      toDelete = [];
      for (const node of selection2.nodes) {
        toDelete.push(node);
      }

      for (const node of toDelete) {
        deleteNode(node);
      }

      // Delete selected nodal loads
      const loadCase = solver.value.loadCases[0];
      for (const i of selection2.nodalLoads.sort((a, b) => b - a)) {
        if (loadCase.nodalLoadList[i] === undefined) continue;

        loadCase.solved = false;
        loadCase.nodalLoadList.splice(i, 1);
      }

      // Delete selected element loads
      for (const i of selection2.elementLoads.sort((a, b) => b - a)) {
        if (loadCase.elementLoadList[i] === undefined) continue;

        loadCase.solved = false;
        loadCase.elementLoadList.splice(i, 1);
      }

      // Delete selected prescribed BCs
      for (const i of selection2.prescribedBC.sort((a, b) => b - a)) {
        if (loadCase.prescribedBC[i] === undefined) continue;

        loadCase.solved = false;
        loadCase.prescribedBC.splice(i, 1);
      }

      clearSelection();
      clearSelection2();
    };

    const dimensions = ref<{ distance: number; nodes: Node[] }[]>([]);

    return {
      solve,
      model,
      selection,
      selection2,
      clearSelection,
      clearSelection2,
      deleteSelection2,
      selectAll2,
      isAnythingSelected2,
      hover,
      _solver,
      solver,
      nthEigenVector,
      defoScale,
      normalForceScale,
      bendingMomentScale,
      shearForceScale,

      nodes,
      beams,
      materials,
      crossSections,
      dimensions,
    };
  },
  {
    persist: {
      pick: ['_solver', 'solver', 'dimensions'],
      serializer: {
        serialize: (value) => {
          console.log('serializing', value);
          return serializeModel(value.solver, value.dimensions);
        },
        deserialize: (value) => {
          console.log('deserializing', value);
          if (value === undefined) return { _solver: '' };
          return { _solver: value };
        },
      },
      afterHydrate: (ctx) => {
        console.log('afterHydrate', ctx);
        if (ctx.store._solver === '') return;

        try {
          deserializeModel(ctx.store._solver, ctx.store.solver, ctx.store.dimensions);
        } catch (e) {
          console.error(e);
        }
      },
    },
  }
);
