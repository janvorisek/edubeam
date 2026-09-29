/**
 * The "draw your first beam" task the welcome dialog offers.
 *
 * Each step is done when the model says so, not when a button is pressed, so the task follows
 * whatever the user actually does - an undo takes it back a step, and someone who adds the
 * supports before the load is not held up by the order written here.
 *
 * The tips in between point at the viewer's own buttons. There is nothing in the model to show
 * that someone has learned where one is, so a tip is done once its button or Next is pressed.
 */
import type { LinearStaticSolver } from 'ts-fem';
import { MouseMode } from '@/mouse';
import { createExampleLibrary } from './examples';

export type FirstBeamStepId = 'tool' | 'draw' | 'supports' | 'load' | 'display' | 'fit' | 'results';

export interface FirstBeamState {
  mouseMode: MouseMode;
  elements: number;
  loads: number;
  /** Solved without errors, which for this task means the beam is supported well enough to stand. */
  stable: boolean;
  settingsOpen: boolean;
  /** Steps whose button, or Next, has been pressed. */
  seen: ReadonlySet<FirstBeamStepId>;
}

export interface FirstBeamStep {
  id: FirstBeamStepId;
  /** What the step asks the user to press, highlighted while the step is current. */
  target?: string;
  /** Moved past with Next rather than by changing the model. */
  tip?: boolean;
  done: (state: FirstBeamState) => boolean;
}

export const firstBeamSteps: FirstBeamStep[] = [
  {
    id: 'tool',
    target: '#addElementUsingMouse',
    done: (s) => s.mouseMode === MouseMode.ADD_ELEMENT || s.elements > 0,
  },
  { id: 'draw', done: (s) => s.elements > 0 },
  { id: 'supports', done: (s) => s.elements > 0 && s.stable },
  { id: 'load', done: (s) => s.elements > 0 && s.stable && s.loads > 0 },
  {
    id: 'display',
    target: '#viewerSettingsToggle',
    tip: true,
    done: (s) => s.settingsOpen || s.seen.has('display'),
  },
  // Last, when the diagrams have made the drawing bigger than the beam and there is something to fit.
  { id: 'fit', target: '#fitContentButton', tip: true, done: (s) => s.seen.has('fit') },
  // Nothing to do but read the diagrams; the user closes the task from here.
  { id: 'results', done: () => false },
];

/** The first step not done yet. */
export const currentFirstBeamStep = (state: FirstBeamState) => firstBeamSteps.find((step) => !step.done(state))!;

export const firstBeamState = (
  solver: LinearStaticSolver,
  mouseMode: MouseMode,
  errors: number,
  settingsOpen: boolean,
  seen: ReadonlySet<FirstBeamStepId>
): FirstBeamState => {
  const loadCase = solver.loadCases[0];

  return {
    mouseMode,
    elements: solver.domain.elements.size,
    loads: loadCase.nodalLoadList.length + loadCase.elementLoadList.length,
    stable: loadCase.solved && errors === 0,
    settingsOpen,
    seen,
  };
};

/**
 * Empties the model for the task, keeping a material and a cross section for the new beam to use.
 * The caller wraps it in an undoable mutation, so starting the task never loses a model.
 */
export const clearForFirstBeam = (solver: LinearStaticSolver) => {
  const loadCase = solver.loadCases[0];

  loadCase.solved = false;
  loadCase.prescribedBC = [];
  loadCase.nodalLoadList = [];
  loadCase.elementLoadList = [];

  solver.domain.elements.clear();
  solver.domain.nodes.clear();

  if (solver.domain.materials.size === 0 || solver.domain.crossSections.size === 0) {
    solver.domain.materials.clear();
    solver.domain.crossSections.clear();
    createExampleLibrary(solver);
  }
};
