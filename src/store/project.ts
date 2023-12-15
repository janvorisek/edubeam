// Utilities
import { defineStore } from "pinia";
import { LinearStaticSolver, Beam2D } from "ts-fem";
import { ref, computed } from "vue";
import { max, min } from "mathjs";

export const useProjectStore = defineStore("project", () => {
  const model = ref("LinearStaticSolver");
  const solver = ref(new LinearStaticSolver());

  const nthEigenVector = ref(1);

  const defoScale = ref(1);
  const normalForceScale = ref(1);
  const bendingMomentScale = ref(1);
  const shearForceScale = ref(1);

  const resultsScalePx = ref(64);

  const selection: {
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

  const clearSelection = () => {
    selection.label = null;
    selection.type = null;
    selection.x = -999;
    selection.y = -999;
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

  const beams = computed(() => {
    const vals = solver.value.domain.elements.values();
    const arr = Array.from(vals);
    return arr.filter((e) => e instanceof Beam2D) as Beam2D[];
  });

  const solve = () => {
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

    solver.value.nodeCodeNumbers = new Map();
    solver.value.loadCases[0].solved = false;
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

  return {
    solve,
    model,
    selection,
    clearSelection,
    hover,
    solver,
    nthEigenVector,
    resultsScalePx,
    defoScale,
    normalForceScale,
    bendingMomentScale,
    shearForceScale,
    beams,
  };
});
