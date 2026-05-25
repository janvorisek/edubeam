import type { LinearStaticSolver } from 'ts-fem';

export type SolveIssueLevel = 'error' | 'warning';

export interface SolveIssue {
  level: SolveIssueLevel;
  code: string;
  message: string;
}

export interface SolveDiagnostics {
  errors: SolveIssue[];
  warnings: SolveIssue[];
}

const toLabel = (value: unknown) => String(value ?? '?');

const isFiniteNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value);

export const validateSolverModel = (solver: LinearStaticSolver): SolveDiagnostics => {
  const diagnostics: SolveDiagnostics = {
    errors: [],
    warnings: [],
  };

  const domain = solver.domain;
  const loadCase = solver.loadCases[0];

  for (const element of domain.elements.values()) {
    const elementLabel = toLabel((element as { label?: unknown }).label);
    const elementNodes = Array.isArray((element as { nodes?: unknown[] }).nodes)
      ? ((element as { nodes?: unknown[] }).nodes as unknown[])
      : [];

    if (elementNodes.length !== 2) {
      diagnostics.errors.push({
        level: 'error',
        code: 'ELEMENT_INVALID_NODE_COUNT',
        message: `Element ${elementLabel} must reference exactly 2 nodes.`,
      });
      continue;
    }

    if (elementNodes[0] === elementNodes[1]) {
      diagnostics.warnings.push({
        level: 'warning',
        code: 'ELEMENT_DUPLICATE_NODE_REFERENCE',
        message: `Element ${elementLabel} references the same node at both ends.`,
      });
    }

    for (const nodeLabel of elementNodes) {
      const normalizedNodeLabel = toLabel(nodeLabel);
      if (!domain.nodes.has(normalizedNodeLabel)) {
        diagnostics.errors.push({
          level: 'error',
          code: 'ELEMENT_MISSING_NODE',
          message: `Element ${elementLabel} references missing node ${normalizedNodeLabel}.`,
        });
      }
    }

    const materialLabel = (element as { mat?: unknown }).mat;
    if (materialLabel !== undefined && materialLabel !== null && !domain.materials.has(toLabel(materialLabel))) {
      diagnostics.errors.push({
        level: 'error',
        code: 'ELEMENT_MISSING_MATERIAL',
        message: `Element ${elementLabel} references missing material ${toLabel(materialLabel)}.`,
      });
    }

    const crossSectionLabel = (element as { cs?: unknown }).cs;
    if (
      crossSectionLabel !== undefined &&
      crossSectionLabel !== null &&
      !domain.crossSections.has(toLabel(crossSectionLabel))
    ) {
      diagnostics.errors.push({
        level: 'error',
        code: 'ELEMENT_MISSING_CROSS_SECTION',
        message: `Element ${elementLabel} references missing cross section ${toLabel(crossSectionLabel)}.`,
      });
    }
  }

  for (let i = 0; i < loadCase.nodalLoadList.length; i++) {
    const load = loadCase.nodalLoadList[i];

    if (!domain.nodes.has(load.target)) {
      diagnostics.errors.push({
        level: 'error',
        code: 'NODAL_LOAD_MISSING_TARGET',
        message: `Nodal load #${i + 1} references missing node ${toLabel(load.target)}.`,
      });
    }

    const values = Object.values(load.values);
    if (values.some((value) => !isFiniteNumber(value))) {
      diagnostics.warnings.push({
        level: 'warning',
        code: 'NODAL_LOAD_NON_FINITE_VALUES',
        message: `Nodal load #${i + 1} contains invalid values.`,
      });
    }
  }

  for (let i = 0; i < loadCase.prescribedBC.length; i++) {
    const prescribed = loadCase.prescribedBC[i];

    if (!domain.nodes.has(prescribed.target)) {
      diagnostics.errors.push({
        level: 'error',
        code: 'PRESCRIBED_DISPLACEMENT_MISSING_TARGET',
        message: `Prescribed displacement #${i + 1} references missing node ${toLabel(prescribed.target)}.`,
      });
    }

    if (Object.values(prescribed.prescribedValues).some((value) => !isFiniteNumber(value))) {
      diagnostics.warnings.push({
        level: 'warning',
        code: 'PRESCRIBED_DISPLACEMENT_NON_FINITE_VALUES',
        message: `Prescribed displacement #${i + 1} contains invalid values.`,
      });
    }
  }

  for (let i = 0; i < loadCase.elementLoadList.length; i++) {
    const load = loadCase.elementLoadList[i];

    if (!domain.elements.has(load.target)) {
      diagnostics.errors.push({
        level: 'error',
        code: 'ELEMENT_LOAD_MISSING_TARGET',
        message: `Element load #${i + 1} references missing element ${toLabel(load.target)}.`,
      });
    }
  }

  if (domain.nodes.size > 0 && domain.elements.size > 0) {
    let totalSupportedDofs = 0;
    for (const node of domain.nodes.values()) {
      totalSupportedDofs += node.bcs.size;
    }

    if (totalSupportedDofs < 3) {
      diagnostics.errors.push({
        level: 'error',
        code: 'INSUFFICIENT_SUPPORTS',
        message: 'Model needs at least 3 constrained DOFs to be stable in 2D analysis.',
      });
    }
  }

  return diagnostics;
};
