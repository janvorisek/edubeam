// Utilities
import { defineStore } from "pinia";
import { LinearStaticSolver, Beam2D } from "ts-fem";
import { ref, computed, reactive } from "vue";
import { max, min } from "mathjs";
import { deleteElement, deleteNode, deserializeModel, serializeModel, throttle } from "@/utils";

export const useProjectStore = defineStore(
  "project",
  () => {
    const model = ref("LinearStaticSolver");
    const _solver = ref("");
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
      /*if (model === "LinearStaticSolver") {
      const tmp = new LinearStaticSolver();
      tmp.domain = solver.domain;
      tmp.domain.solver = tmp;
      tmp.loadCases = solver.loadCases;
      solver = tmp;
    } else if (model === "EigenValueDynamicSolver") {
      const tmp = new EigenValueDynamicSolver();
      tmp.domain = solver.domain;
      tmp.domain.solver = tmp;
      tmp.loadCases = solver.loadCases;
      tmp.n = this.$store.state.settings.evdN;
      tmp.tol = this.$store.state.settings.evdTol;
      solver = tmp;
    }*/

      //this.$store.state.fem.solver = solver;

      //solver.value.nodeCodeNumbers = new Map();
      //solver.value.loadCases[0].solved = false;
      solver.value.codeNumberGenerated = false;

      if (solver.value.domain.elements.size === 0 || solver.value.domain.nodes.size === 0) return;

      try {
        solver.value.solve();
      } catch (e) {
        solver.value.loadCases[0].solved = false;
        return;
      }
      /*if (this.$store.state.fem.model === "EigenValueDynamicSolver") {
      this.$store.state.settings.showNormalForce = false;
      this.$store.state.settings.showShearForce = false;
      this.$store.state.settings.showBendingMoment = false;

      this.$store.state.settings.showLoads = false;

      if (result > this.$store.state.settings.evdN)
        alert(
          "Sturm sequence control failed! There are " +
            result +
            " eigen numbers below the highest eigen value, but we only found 10."
        );
    }*/

      //const r = solver.value.loadCases[0].r as number[];

      let maxDefo = 0; //Math.max(Math.abs(max(r)), Math.abs(min(r)));
      let maxNormalForce = 0;
      let maxBendingMoment = 0;
      let maxShearForce = 0;

      for (const beam of solver.value.domain.elements.values()) {
        let def = (beam as Beam2D).computeGlobalDefl(solver.value.loadCases[0], 10);

        const n = (beam as Beam2D).computeNormalForce(solver.value.loadCases[0], 10).N as number[];
        const v = (beam as Beam2D).computeShearForce(solver.value.loadCases[0], 10).V as number[];
        const m = (beam as Beam2D).computeBendingMoment(solver.value.loadCases[0], 10).M as number[];

        if (model.value === "LinearStaticSolver") {
          maxDefo = Math.max(
            maxDefo,
            Math.abs(max(def.u)),
            Math.abs(min(def.u)),
            Math.abs(max(def.w)),
            Math.abs(min(def.w))
          );
        } else if (model.value === "EigenValueDynamicSolver") {
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
      console.log("deleteselection2");
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
      console.log(selection2.nodalLoads.sort((a, b) => b - a));
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
    };
  },
  {
    persist: [
      {
        paths: ["solver"],
        serializer: {
          serialize: (value) => {
            return serializeModel(value.solver);
          },
          deserialize: (value) => {
            if (value === undefined) return { _solver: "" };
            return { _solver: value };
          },
        },
        afterRestore: (ctx) => {
          if (ctx.store._solver === "") return;

          try {
            deserializeModel(ctx.store._solver, ctx.store.solver);
          } catch (e) {
            console.error(e);
          }
        },
      },
    ],
  }
);
