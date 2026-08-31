<script setup lang="ts">
import { type Node, type Element, type NodalLoad, type BeamElementLoad } from 'ts-fem';
import SVGElementViewer from '../../src/components/SVGElementViewer.vue';
import { serializeModel } from '../../src/utils/serializeModel';
// Single source of truth, shared with the Examples panel inside the app.
import { buildExampleSolver, examples, type ExampleViewerFlags } from '../../src/utils/examples';

type Sample = {
  id: string;
  title: string;
  blurb: string;
  solver: ReturnType<typeof buildExampleSolver>;
  nodes: Node[];
  elements: Element[];
  nodalLoads: NodalLoad[];
  elementLoads: BeamElementLoad[];
  viewer: ExampleViewerFlags;
  openUrl: string;
};

const convertForce = (value: number) => value / 1000; // N → kN
const convertMoment = (value: number) => value / 1000; // N·m → kN·m

const samples: Sample[] = examples.map((example) => {
  const solver = buildExampleSolver(example);

  return {
    id: example.id,
    title: example.title,
    blurb: example.blurb,
    viewer: example.viewer,
    solver,
    nodes: [...solver.domain.nodes.values()],
    elements: [...solver.domain.elements.values()],
    nodalLoads: solver.loadCases[0].nodalLoadList,
    elementLoads: solver.loadCases[0].elementLoadList,
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
              :padding="6"
              :mobile-padding="6"
              :results-scale-px="32"
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
