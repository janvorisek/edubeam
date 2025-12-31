<script setup lang="ts">
import { LinearStaticSolver, DofID, type Node, type Element, type NodalLoad, type BeamElementLoad } from 'ts-fem';
import SVGElementViewer from '../../src/components/SVGElementViewer.vue';
import { serializeModel } from '../../src/utils/serializeModel';

type ViewerFlags = {
  showLoads: boolean;
  showReactions: boolean;
  showDeformedShape: boolean;
  showNormalForce: boolean;
  showShearForce: boolean;
  showMoments: boolean;
};

type Sample = {
  id: string;
  title: string;
  blurb: string;
  solver: LinearStaticSolver;
  nodes: Node[];
  elements: Element[];
  nodalLoads: NodalLoad[];
  elementLoads: BeamElementLoad[];
  viewer: ViewerFlags;
  openUrl: string;
};

const convertForce = (value: number) => value / 1000; // N → kN
const convertMoment = (value: number) => value / 1000; // N·m → kN·m

const baseSection = {
  a: 1,
  iy: 8.356e-5,
  iz: 1.0,
  dyz: 999991.0,
  h: 1,
  k: 1e32,
  j: 99999.0,
};

const baseMaterial = {
  e: 210000e6,
  g: 210000e6 / (2 * (1 + 0.2)),
  alpha: 1.0,
  d: 4000,
};

const createBaseSolver = () => {
  const solver = new LinearStaticSolver();
  const domain = solver.domain;
  domain.createCrossSection(1, baseSection);
  domain.createMaterial(1, baseMaterial);
  return solver;
};

const samples: Sample[] = ['welcome', 'cantilever', 'pratt', 'continuous', 'portal', 'temperature'].map((id) => {
  const solver = createBaseSolver();
  const domain = solver.domain;

  if (id === 'welcome') {
    domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
    domain.createNode('B', [3, 0, 0], [DofID.Dz]);
    domain.createBeam2D('E1', ['A', 'B'], 1, 1);
    solver.loadCases[0].createBeamElementUniformEdgeLoad('E1', [0, 10000], true);
  }

  if (id === 'cantilever') {
    domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
    domain.createNode('B', [4, 0, 0], []);
    domain.createBeam2D('E1', ['A', 'B'], 1, 1);
    solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 0, [DofID.Dz]: -18000, [DofID.Ry]: 0 });
  }

  if (id === 'pratt') {
    const nodes = [
      { id: 'A', coords: [0, 0, 0], dofs: [DofID.Dx, DofID.Dz] },
      { id: 'B', coords: [3, 0, 0], dofs: [] },
      { id: 'C', coords: [6, 0, 0], dofs: [] },
      { id: 'D', coords: [9, 0, 0], dofs: [DofID.Dz] },
      { id: 'E', coords: [1.5, 0, -1.8], dofs: [] },
      { id: 'F', coords: [4.5, 0, -1.8], dofs: [] },
      { id: 'G', coords: [7.5, 0, -1.8], dofs: [] },
    ];

    nodes.forEach((node) => domain.createNode(node.id, node.coords, node.dofs));

    const elements: [string, string, string][] = [
      ['E1', 'A', 'B'],
      ['E2', 'B', 'C'],
      ['E3', 'C', 'D'],
      ['E4', 'E', 'F'],
      ['E5', 'F', 'G'],
      ['E6', 'A', 'E'],
      ['E7', 'E', 'B'],
      ['E8', 'B', 'F'],
      ['E9', 'F', 'C'],
      ['E10', 'C', 'G'],
      ['E11', 'G', 'D'],
    ];

    elements.forEach(([label, start, end]) => domain.createBeam2D(label, [start, end], 1, 1));

    ['E', 'F', 'G'].forEach((nodeId) => {
      solver.loadCases[0].createNodalLoad(nodeId, { [DofID.Dx]: 0, [DofID.Dz]: 8000, [DofID.Ry]: 0 });
    });
  }

  if (id === 'continuous') {
    domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]);
    domain.createNode('B', [5, 0, 0], []);
    domain.createNode('C', [11, 0, 0], []);
    domain.createNode('D', [16, 0, 0], [DofID.Dz]);

    domain.createBeam2D('E1', ['A', 'B'], 1, 1);
    domain.createBeam2D('E2', ['B', 'C'], 1, 1);
    domain.createBeam2D('E3', ['C', 'D'], 1, 1);

    solver.loadCases[0].createBeamElementUniformEdgeLoad('E1', [0, 8000], true);
    solver.loadCases[0].createNodalLoad('C', { [DofID.Dx]: 0, [DofID.Dz]: -20000, [DofID.Ry]: 0 });
    solver.loadCases[0].createBeamElementUniformEdgeLoad('E3', [0, 6000], true);
  }

  if (id === 'portal') {
    domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
    domain.createNode('B', [0, 0, -6], []);
    domain.createNode('C', [8, 0, -6], []);
    domain.createNode('D', [8, 0, 0], [DofID.Dz]);

    domain.createBeam2D('E1', ['A', 'B'], 1, 1);
    domain.createBeam2D('E2', ['B', 'C'], 1, 1);
    domain.createBeam2D('E3', ['C', 'D'], 1, 1);

    solver.loadCases[0].createBeamElementUniformEdgeLoad('E2', [0, 10000], true);
    solver.loadCases[0].createNodalLoad('C', { [DofID.Dx]: -8000, [DofID.Dz]: 10000, [DofID.Ry]: 0 });
  }

  if (id === 'temperature') {
    domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]);
    domain.createNode('B', [8, 0, 0], [DofID.Dz]);

    domain.createBeam2D('E1', ['A', 'B'], 1, 1);

    solver.loadCases[0].createBeamTemperatureLoad('E1', [20, -10, 0]);
  }

  solver.solve();

  const configs: Record<
    string,
    Omit<Sample, 'solver' | 'nodes' | 'elements' | 'nodalLoads' | 'elementLoads' | 'openUrl' | 'viewer'>
  > = {
    welcome: {
      id: 'welcome',
      title: 'Indeterminate beam',
      blurb: 'Statically indeterminate 3 m fixed–roller beam under 10 kN/m UDL.',
    },
    cantilever: {
      id: 'cantilever',
      title: 'Cantilever',
      blurb: '4 m cantilever resisting an 18 kN downward nodal load, highlighting curvature and tip deflection.',
    },
    pratt: {
      id: 'pratt',
      title: 'Pratt truss',
      blurb: 'Simple Pratt truss with 8 kN joint loads showing axial force distribution and displacements.',
    },
    continuous: {
      id: 'continuous',
      title: 'Three-span continuous beam',
      blurb: '5+6+5 m spans with UDL + point + UDL to compare curvature and support rotations.',
    },
    portal: {
      id: 'portal',
      title: 'Portal frame load case',
      blurb: '8 m beam on 6 m columns under roof UDL and lateral + vertical knee loads for sway and bending checks.',
    },
    temperature: {
      id: 'temperature',
      title: 'Temperature load',
      blurb: 'Simply supported 8 m beam with uniform and non-uniform temperature load.',
    },
  };

  const viewerConfigs: Record<string, ViewerFlags> = {
    welcome: {
      showLoads: true,
      showReactions: true,
      showDeformedShape: true,
      showNormalForce: false,
      showShearForce: true,
      showMoments: true,
    },
    cantilever: {
      showLoads: true,
      showReactions: true,
      showDeformedShape: true,
      showNormalForce: false,
      showShearForce: false,
      showMoments: true,
    },
    pratt: {
      showLoads: true,
      showReactions: true,
      showDeformedShape: true,
      showNormalForce: false,
      showShearForce: false,
      showMoments: false,
    },
    continuous: {
      showLoads: true,
      showReactions: true,
      showDeformedShape: true,
      showNormalForce: false,
      showShearForce: true,
      showMoments: true,
    },
    portal: {
      showLoads: true,
      showReactions: true,
      showDeformedShape: true,
      showNormalForce: false,
      showShearForce: false,
      showMoments: true,
    },
    temperature: {
      showLoads: true,
      showReactions: true,
      showDeformedShape: true,
      showNormalForce: false,
      showShearForce: false,
      showMoments: true,
    },
  };

  return {
    ...configs[id],
    solver,
    nodes: [...domain.nodes.values()],
    elements: [...domain.elements.values()],
    nodalLoads: solver.loadCases[0].nodalLoadList,
    elementLoads: solver.loadCases[0].elementLoadList,
    viewer: viewerConfigs[id],
    openUrl: `https://run.edubeam.app/?model=${encodeURIComponent(serializeModel(solver, []))}`,
  };
});
</script>

<template>
  <ClientOnly>
    <section class="feature-structures">
      <div class="fs-grid">
        <a
          v-for="sample in samples"
          :key="sample.id"
          class="fs-card"
          :href="sample.openUrl"
          target="_blank"
          rel="noreferrer"
        >
          <div class="fs-viewer-shell" aria-hidden="true">
            <span class="fs-label">{{ sample.title }}</span>
            <SVGElementViewer
              :id="sample.id"
              class="fs-viewer"
              :solver="sample.solver"
              :nodes="sample.nodes"
              :elements="sample.elements"
              :nodal-loads="sample.nodalLoads"
              :element-loads="sample.elementLoads"
              :show-loads="sample.viewer.showLoads"
              :show-reactions="sample.viewer.showReactions"
              :show-deformed-shape="sample.viewer.showDeformedShape"
              :show-normal-force="sample.viewer.showNormalForce"
              :show-shear-force="sample.viewer.showShearForce"
              :show-moments="sample.viewer.showMoments"
              :padding="28"
              :mobile-padding="18"
              :results-scale-px="44"
              :convert-force="convertForce"
              :convert-moment="convertMoment"
              :zoom-enabled="false"
              :support-size="0.5"
            />
          </div>
          <div class="fs-copy">
            <p class="eyebrow">{{ sample.title }}</p>
            <p class="description">{{ sample.blurb }}</p>
          </div>
        </a>
      </div>
    </section>
  </ClientOnly>
</template>

<style scoped>
.feature-structures {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0;
}

.fs-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.eyebrow {
  font-weight: 600;
  margin: 0 0 0.35rem;
  font-family: 'Lobster', 'Barlow', sans-serif;
  font-size: 18px;
}

.fs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.fs-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1rem;
  background:
    radial-gradient(circle at 30% 20%, rgba(44, 99, 240, 0.08), transparent 40%),
    radial-gradient(circle at 80% 0%, rgba(255, 255, 255, 0.06), transparent 35%), rgba(255, 255, 255, 0.03);
  box-shadow: 0 12px 30px rgba(7, 12, 27, 0.14);
  z-index: 1;
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.fs-copy {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.fs-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 32px rgba(44, 99, 240, 0.22);
  border-color: rgba(255, 255, 255, 0.16);
}

.description {
  margin: 0;
  color: var(--vp-c-text-2);
}

.fs-viewer-shell {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.5rem;
  min-height: 220px;
  pointer-events: none;
  position: relative;
  overflow: hidden;
}

.fs-viewer {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 7;
  min-height: 200px;
}

.fs-label {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .fs-viewer {
    min-height: 180px;
  }
}
</style>
