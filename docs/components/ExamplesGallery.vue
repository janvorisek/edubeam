<script setup lang="ts">
import { LinearStaticSolver, DofID, type Node, type Element, type NodalLoad, type BeamElementLoad } from 'ts-fem';
import SVGElementViewer from '../../src/components/SVGElementViewer.vue';
import { serializeModel } from '../../src/utils/serializeModel';

type ExampleViewerOptions = {
  showLoads?: boolean;
  showReactions?: boolean;
  showDeformedShape?: boolean;
  showNormalForce?: boolean;
  showShearForce?: boolean;
  showMoments?: boolean;
};

type ViewerSettings = Required<ExampleViewerOptions>;

type ExampleSeed = {
  id: string;
  title: string;
  headline: string;
  description: string;
  tags: string[];
  highlights: string[];
  viewer?: Partial<ViewerSettings>;
  setup: (solver: LinearStaticSolver) => void;
};

type ExampleCard = ExampleSeed & {
  solver: LinearStaticSolver;
  nodes: Node[];
  elements: Element[];
  nodalLoads: NodalLoad[];
  elementLoads: BeamElementLoad[];
  openUrl: string;
  viewer: ViewerSettings;
};

const defaultViewerOptions: ViewerSettings = {
  showLoads: true,
  showReactions: true,
  showDeformedShape: false,
  showNormalForce: false,
  showShearForce: false,
  showMoments: false,
};

const convertForce = (value: number) => value / 1000;
const convertMoment = (value: number) => value / 1000;

const createBaseSolver = () => {
  const solver = new LinearStaticSolver();
  const domain = solver.domain;

  domain.createCrossSection(1, {
    a: 1,
    iy: 8.356e-5,
    iz: 1.0,
    dyz: 999991.0,
    h: 1,
    k: 1e32,
    j: 99999.0,
  });

  domain.createMaterial(1, {
    e: 210000e6,
    g: 210000e6 / (2 * (1 + 0.2)),
    alpha: 1.0,
    d: 4000,
  });

  return solver;
};

const makeExample = (seed: ExampleSeed): ExampleCard => {
  const solver = createBaseSolver();
  seed.setup(solver);
  solver.solve();

  return {
    ...seed,
    solver,
    nodes: [...solver.domain.nodes.values()],
    elements: [...solver.domain.elements.values()],
    nodalLoads: solver.loadCases[0].nodalLoadList,
    elementLoads: solver.loadCases[0].elementLoadList,
    openUrl: `https://run.edubeam.app/?model=${encodeURIComponent(serializeModel(solver))}`,
    viewer: { ...defaultViewerOptions, ...(seed.viewer ?? {}) },
  };
};

const examples: ExampleCard[] = [
  makeExample({
    id: 'simply-supported-beam',
    title: 'Simply Supported Beam',
    headline: 'Uniform line load across a 6 m span',
    description: 'Classic bending case to inspect shear, moment, and support reactions.',
    tags: ['beam', 'uniform load', 'starter'],
    highlights: ['Span 6 m', 'Pinned + roller supports', '12 kN/m UDL'],
    viewer: { showMoments: true },
    setup: (solver) => {
      const domain = solver.domain;
      domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]);
      domain.createNode('B', [6, 0, 0], [DofID.Dz]);
      domain.createBeam2D('E1', ['A', 'B'], 1, 1);
      solver.loadCases[0].createBeamElementUniformEdgeLoad('E1', [0, 12000], true);
    },
  }),
  makeExample({
    id: 'cantilever-point-load',
    title: 'Cantilever With Tip Load',
    headline: 'Fixed base resisting an 18 kN downward load',
    description: 'Explore curvature and tip deflection under a single nodal load.',
    tags: ['beam', 'point load', 'deflection'],
    highlights: ['Span 4 m', 'Fixed support at root', '18 kN tip load'],
    viewer: { showDeformedShape: true },
    setup: (solver) => {
      const domain = solver.domain;
      domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
      domain.createNode('B', [4, 0, 0], []);
      domain.createBeam2D('E1', ['A', 'B'], 1, 1);
      solver.loadCases[0].createNodalLoad('B', { [DofID.Dz]: -18000 });
    },
  }),
  makeExample({
    id: 'portal-frame',
    title: 'Portal Frame Load Case',
    headline: 'Rigid frame under combined horizontal and vertical actions',
    description: 'Great for sway, moment redistribution, and reaction checks.',
    tags: ['frame', 'lateral load', 'moment'],
    highlights: ['Clear height 3 m', 'Fixed footings', 'Fx + Fz at knee'],
    viewer: { showDeformedShape: true, showMoments: true },
    setup: (solver) => {
      const domain = solver.domain;
      domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
      domain.createNode('B', [0, 0, -3], []);
      domain.createNode('C', [4, 0, -3], []);
      domain.createNode('D', [4, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);

      domain.createBeam2D('E1', ['A', 'B'], 1, 1);
      domain.createBeam2D('E2', ['B', 'C'], 1, 1);
      domain.createBeam2D('E3', ['C', 'D'], 1, 1);

      solver.loadCases[0].createNodalLoad('C', {
        [DofID.Dx]: 8000,
        [DofID.Dz]: -12000,
      });
    },
  }),
  makeExample({
    id: 'warren-truss',
    title: 'Three-Panel Warren Truss',
    headline: 'Deck truss with panel point loads',
    description: 'Shows axial force flow through triangular bracing.',
    tags: ['truss', 'axial', 'study set'],
    highlights: ['Panel length 3 m', 'Pinned + roller bearings', 'Panel point deck loads'],
    viewer: { showNormalForce: true, showDeformedShape: true, showReactions: true },
    setup: (solver) => {
      const domain = solver.domain;
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
        solver.loadCases[0].createNodalLoad(nodeId, { [DofID.Dz]: -8000 });
      });
    },
  }),
];
</script>

<template>
  <ClientOnly>
    <section class="examples-gallery">
      <article v-for="example in examples" :key="example.id" class="example-card">
        <header>
          <p class="eyebrow">{{ example.headline }}</p>
          <h3>{{ example.title }}</h3>
          <p class="description">{{ example.description }}</p>
        </header>

        <div class="viewer-shell">
          <SVGElementViewer
            class="viewer"
            :solver="example.solver"
            :nodes="example.nodes"
            :elements="example.elements"
            :nodal-loads="example.nodalLoads"
            :element-loads="example.elementLoads"
            :show-loads="example.viewer.showLoads"
            :show-reactions="example.viewer.showReactions"
            :show-deformed-shape="example.viewer.showDeformedShape"
            :show-normal-force="example.viewer.showNormalForce"
            :show-shear-force="example.viewer.showShearForce"
            :show-moments="example.viewer.showMoments"
            :padding="20"
            :mobile-padding="12"
            :results-scale-px="40"
            :convert-force="convertForce"
            :convert-moment="convertMoment"
            :zoom-enabled="false"
          />
        </div>

        <ul class="highlights">
          <li v-for="item in example.highlights" :key="item">{{ item }}</li>
        </ul>

        <footer>
          <div class="tag-list">
            <span v-for="tag in example.tags" :key="`${example.id}-${tag}`">{{ tag }}</span>
          </div>
          <a class="cta" :href="example.openUrl" target="_blank" rel="noreferrer">Open in edubeam</a>
        </footer>
      </article>
    </section>
  </ClientOnly>
</template>

<style scoped>
.examples-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.example-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(12, 19, 38, 0.08), rgba(12, 19, 38, 0.02));
  box-shadow: 0 18px 40px rgba(7, 12, 27, 0.12);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 100%;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin: 0 0 0.25rem;
}

h3 {
  font-size: 1.35rem;
  margin: 0;
  color: var(--vp-c-text-1);
}

.description {
  margin: 0;
  color: var(--vp-c-text-2);
}

.viewer-shell {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.5rem;
  min-height: 200px;
}

.viewer {
  width: 100%;
  height: 200px;
}

.highlights {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.5rem;
}

.highlights li {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 0.35rem 0.65rem;
  font-size: 0.85rem;
}

footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag-list span {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(74, 136, 255, 0.18);
  color: #2c63f0;
  font-weight: 600;
}

.cta {
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  background: #2c63f0;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(44, 99, 240, 0.35);
}

@media (max-width: 600px) {
  .viewer-shell {
    min-height: 160px;
  }

  .viewer {
    height: 160px;
  }
}
</style>
