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

const buildSamples = (): Sample[] =>
  ['udl', 'trapezoidal', 'concentrated', 'nodal', 'temperature'].map((id) => {
    const solver = createBaseSolver();
    const domain = solver.domain;

    // Pinned–roller beam baseline
    domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]);
    domain.createNode('B', [4, 0, 0], []);
    domain.createNode('C', [8, 0, 0], [DofID.Dz]);
    domain.createBeam2D('E1', ['A', 'B'], 1, 1);
    domain.createBeam2D('E2', ['B', 'C'], 1, 1);

    if (id === 'udl') {
      solver.loadCases[0].createBeamElementUniformEdgeLoad('E1', [0, 12000], true);
    }

    if (id === 'trapezoidal') {
      solver.loadCases[0].createBeamElementTrapezoidalEdgeLoad('E2', [0, 4000], [0, 14000], true);
    }

    if (id === 'concentrated') {
      solver.loadCases[0].createBeamConcentratedLoad('E1', [0, -18000, 0, 2.5], true);
    }

    if (id === 'nodal') {
      solver.loadCases[0].createNodalLoad('B', { [DofID.Dz]: -20000 });
    }

    if (id === 'temperature') {
      solver.loadCases[0].createBeamTemperatureLoad('E2', [20, -10, 0]);
    }

    solver.solve();

    const configs: Record<
      string,
      Omit<Sample, 'solver' | 'nodes' | 'elements' | 'nodalLoads' | 'elementLoads' | 'openUrl' | 'viewer'>
    > = {
      udl: {
        id: 'udl',
        title: 'Uniform distributed load',
        blurb: 'Pinned–roller span with 12 kN/m UDL for classic SFD/BMD envelopes.',
      },
      trapezoidal: {
        id: 'trapezoidal',
        title: 'Trapezoidal line load',
        blurb: 'Tapered load rising from 4 to 14 kN/m across the right span.',
      },
      concentrated: {
        id: 'concentrated',
        title: 'Concentrated element load',
        blurb: 'Single 18 kN downward load applied at midspan along the element axis.',
      },
      nodal: {
        id: 'nodal',
        title: 'Nodal point load',
        blurb: '20 kN nodal load at the interior support for reaction and deflection checks.',
      },
      temperature: {
        id: 'temperature',
        title: 'Temperature gradient',
        blurb: 'ΔT across the depth (top hotter than bottom) to show induced curvature.',
      },
    };

    const viewerConfigs: Record<string, ViewerFlags> = {
      udl: {
        showLoads: true,
        showReactions: true,
        showDeformedShape: true,
        showNormalForce: false,
        showShearForce: true,
        showMoments: true,
      },
      trapezoidal: {
        showLoads: true,
        showReactions: true,
        showDeformedShape: true,
        showNormalForce: false,
        showShearForce: true,
        showMoments: true,
      },
      concentrated: {
        showLoads: true,
        showReactions: true,
        showDeformedShape: true,
        showNormalForce: false,
        showShearForce: true,
        showMoments: true,
      },
      nodal: {
        showLoads: true,
        showReactions: true,
        showDeformedShape: true,
        showNormalForce: false,
        showShearForce: true,
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

const samples: Sample[] = import.meta.env.SSR ? [] : buildSamples();
</script>

<template>
  <ClientOnly>
    <section class="load-showcase">
      <header class="ls-header">
        <div>
          <h3>Load type previews</h3>
          <p class="lede">
            See how common load types render in EduBeam. Each card is an interactive FEM preview and opens directly in
            the app with the exact solver setup.
          </p>
        </div>
      </header>

      <div class="ls-grid">
        <article v-for="sample in samples" :key="sample.id" class="ls-card">
          <div class="ls-viewer-shell" aria-hidden="true">
            <span class="ls-label">{{ sample.title }}</span>
            <SVGElementViewer
              :id="`load-${sample.id}`"
              class="ls-viewer"
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
              :padding="26"
              :mobile-padding="18"
              :results-scale-px="42"
              :convert-force="convertForce"
              :convert-moment="convertMoment"
              :zoom-enabled="false"
            />
          </div>
          <div class="ls-copy">
            <p class="eyebrow">{{ sample.title }}</p>
            <p class="description">{{ sample.blurb }}</p>
          </div>
          <a class="cta" :href="sample.openUrl" target="_blank" rel="noreferrer">
            <span>Open in EduBeam</span>
            <span class="cta-arrow">→</span>
          </a>
        </article>
      </div>
    </section>
  </ClientOnly>
</template>

<style scoped>
.load-showcase {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0;
}

.ls-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.eyebrow {
  font-weight: 600;
  margin: 0 0 0.35rem;
  font-family: 'Lobster', 'Barlow', sans-serif;
  font-size: 16px;
}

.ls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.ls-card {
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
}

.ls-copy {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.cta {
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 0.35rem;
  padding: 6px 12px;
  border-radius: 8px;
  background: #2c63f0;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  width: 100%;
  margin-top: auto;
  box-shadow: 0 10px 24px rgba(44, 99, 240, 0.28);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 32px rgba(44, 99, 240, 0.32);
  background: #244fcb;
}

.cta-arrow {
  font-size: 1rem;
}

.description {
  margin: 0;
  color: var(--vp-c-text-2);
}

.ls-viewer-shell {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.5rem;
  min-height: 200px;
  position: relative;
  overflow: hidden;
  pointer-events: none;
}

.ls-viewer {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 7;
  min-height: 180px;
}

.ls-label {
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
  .ls-viewer {
    min-height: 160px;
  }
}
</style>
