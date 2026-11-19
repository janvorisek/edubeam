import {
  BeamConcentratedLoad,
  BeamElementTrapezoidalEdgeLoad,
  BeamElementUniformEdgeLoad,
  BeamTemperatureLoad,
  type Beam2D,
  type LinearStaticSolver,
} from '@edubeam/fem';

/**
 * Where a node lies along a beam, as a fraction of its length from the start node: the node projected
 * onto the beam's axis, kept within the beam.
 */
export const splitRatioAlongBeam = (
  start: readonly number[],
  end: readonly number[],
  point: readonly number[]
): number => {
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const lengthSquared = dx * dx + dz * dz;
  if (lengthSquared === 0) return 0.5;

  const t = ((point[0] - start[0]) * dx + (point[2] - start[2]) * dz) / lengthSquared;
  return Math.min(Math.max(t, 0), 1);
};

/**
 * Replaces `beam` by two beams meeting at `nodeLabel`, `<label>a` from its start node and `<label>b`
 * to its end node, each keeping the end hinge it inherits. Every element load moves with the part
 * of the beam it acts on, so the structure carries exactly the same loads as before:
 *
 * - a uniform load and a temperature load act on the whole length, so both parts get one;
 * - a trapezoidal load is cut at the split, both parts sharing the intensity at that point;
 * - a concentrated load goes to the part its position falls on, measured from that part's start. One
 *   exactly at the split stays at the end of the first part.
 *
 * Mutates the solver; the caller wraps it in `executeModelMutationWithUndo`.
 */
export const splitBeamAtNode = (solver: LinearStaticSolver, beam: Beam2D, nodeLabel: string): void => {
  const domain = solver.domain;
  const [startLabel, endLabel] = beam.nodes;
  const start = domain.getNode(startLabel).coords;
  const end = domain.getNode(endLabel).coords;
  const ratio = splitRatioAlongBeam(start, end, domain.getNode(nodeLabel).coords);
  // Positions of concentrated loads are distances along the beam in metres.
  const firstLength = ratio * Math.hypot(end[0] - start[0], end[2] - start[2]);

  const first = `${beam.label}a`;
  const second = `${beam.label}b`;
  const [startHinge, endHinge] = beam.hinges;

  domain.createBeam2D(first, [startLabel, nodeLabel], beam.mat, beam.cs, [startHinge, false]);
  domain.createBeam2D(second, [nodeLabel, endLabel], beam.mat, beam.cs, [false, endHinge]);

  for (const loadCase of solver.loadCases) {
    loadCase.solved = false;

    // Only the loads that were on the beam before the split; the ones created below are already done.
    const loads = loadCase.elementLoadList.filter((load) => load.target === beam.label);

    for (const load of loads) {
      if (load instanceof BeamElementUniformEdgeLoad) {
        load.target = first;
        loadCase.createBeamElementUniformEdgeLoad(second, [...load.values], load.lcs);
      } else if (load instanceof BeamElementTrapezoidalEdgeLoad) {
        const atSplit: [number, number] = [
          load.startValues[0] + (load.endValues[0] - load.startValues[0]) * ratio,
          load.startValues[1] + (load.endValues[1] - load.startValues[1]) * ratio,
        ];
        const endValues: [number, number] = [load.endValues[0], load.endValues[1]];
        load.change(first, [load.startValues[0], load.startValues[1]], [...atSplit], load.lcs);
        loadCase.createBeamElementTrapezoidalEdgeLoad(second, [...atSplit], endValues, load.lcs);
      } else if (load instanceof BeamTemperatureLoad) {
        load.target = first;
        loadCase.createBeamTemperatureLoad(second, [...load.values]);
      } else if (load instanceof BeamConcentratedLoad) {
        const position = load.values[3];
        if (position <= firstLength) {
          load.target = first;
        } else {
          const values = [...load.values];
          values[3] = position - firstLength;
          load.change(second, values, load.lcs);
        }
      } else {
        // Every element load the solver has is handled above; a new kind should be added there, and
        // until then it at least stays in the model.
        load.target = first;
      }
    }
  }

  domain.elements.delete(beam.label);
};
