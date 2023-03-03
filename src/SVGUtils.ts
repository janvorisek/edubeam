import { Node, DofID, Beam2D, NodalLoad, BeamElementUniformEdgeLoad } from "ts-fem";
import { useProjectStore } from "./store/project";

export function supportMarker(node: Node) {
  const sdofs = Array.from(node.bcs);

  // cantilever
  if (sdofs.includes(DofID.Dx) && sdofs.includes(DofID.Dz) && sdofs.includes(DofID.Ry)) return `url(#dot)`;

  // Hinge XY
  if (sdofs.includes(DofID.Dx) && sdofs.includes(DofID.Dz)) return `url(#hinge-xy)`;

  // Hinge X
  if (sdofs.includes(DofID.Dx)) return `url(#hinge-y)`;

  // Hinge Z
  if (sdofs.includes(DofID.Dz)) return `url(#hinge-x)`;

  return `none`;
}

export function formatNode(node: number[]): string {
  return `${node[0]},${node[2]} ${node[0]},${node[2]}`;
}

export function formatSupportNode(node: Node): string {
  // find first element which has this node
  const elements = node.domain.elements.values();

  for (const el of elements) {
    if (el.nodes.includes(node.label)) {
      const idx = el.nodes.indexOf(node.label);
      const geo = el.computeGeo();
      const sx = geo.dx / geo.l;
      const sy = geo.dz / geo.l;

      if (idx === 0) {
        const node2 = node.domain.nodes.get(el.nodes[1])!;
        const n2x = (node2.coords[0] + node.coords[0]) / 2;
        const n2z = (node2.coords[2] + node.coords[2]) / 2;

        return `${node.coords[0]},${node.coords[2]} ${n2x},${n2z}`;
      }

      const node2 = node.domain.nodes.get(el.nodes[0])!;
      const n2x = (node2.coords[0] + node.coords[0]) / 2;
      const n2z = (node2.coords[2] + node.coords[2]) / 2;

      return `${node.coords[0]},${node.coords[2]} ${n2x},${n2z}`;
    }
  }

  return `${node.coords[0]},${node.coords[2]} ${node.coords[0]},${node.coords[2]}`;
}

export function formatResults(el: Beam2D, scale: number) {
  let result = "";
  let nseg = 20;
  const scaleBy = (useProjectStore().resultsScalePx * useProjectStore().defoScale) / scale;
  const n1 = el.domain.getNode(el.nodes[0]);
  let def = null;

  if (useProjectStore().model === "LinearStaticSolver") {
    def = el.computeGlobalDefl(el.domain.solver.loadCases[0], nseg);
  } else {
    nseg = 10;
    def = el.computeGlobalEigenMode(el.domain.solver.loadCases[0], useProjectStore().nthEigenVector - 1, nseg);
  }

  const geo = el.computeGeo();
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;
  for (let s = 0; s <= nseg; s++) {
    const xc = n1.coords[0] + (cos * geo.l * s) / nseg;
    const zc = n1.coords[2] + (sin * geo.l * s) / nseg;

    result += `${xc + def.u[s] * scaleBy},${zc + def.w[s] * scaleBy} `;
  }

  return result;
}

export function formatNormalForces(el: Beam2D, scale: number) {
  let result = "";
  const nseg = 30;
  const scaleBy = (useProjectStore().resultsScalePx * useProjectStore().normalForceScale) / scale;
  const n1 = el.domain.getNode(el.nodes[0]);
  const n2 = el.domain.getNode(el.nodes[1]);
  const forces = el.computeNormalForce(el.domain.solver.loadCases[0], nseg);
  const geo = el.computeGeo();
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;
  for (let s = 0; s <= nseg; s++) {
    const xc = n1.coords[0] + (cos * geo.l * s) / nseg;
    const zc = n1.coords[2] + (sin * geo.l * s) / nseg;

    const nx = geo.dz / geo.l;
    const ny = -geo.dx / geo.l;

    result += `${xc + forces.N[s] * nx * scaleBy},${zc + forces.N[s] * ny * scaleBy} `;
  }

  //console.log(scale);

  return `${n1.coords[0]},${n1.coords[2]} ${result}${n2.coords[0]},${n2.coords[2]}`;
}

export function formatShearForces(el: Beam2D, scale: number) {
  let result = "";
  const nseg = 30;
  const scaleBy = (useProjectStore().resultsScalePx * useProjectStore().shearForceScale) / scale;
  const n1 = el.domain.getNode(el.nodes[0]);
  const n2 = el.domain.getNode(el.nodes[1]);
  const forces = el.computeShearForce(el.domain.solver.loadCases[0], nseg);
  const geo = el.computeGeo();
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;
  for (let s = 0; s <= nseg; s++) {
    const xc = n1.coords[0] + (cos * geo.l * s) / nseg;
    const zc = n1.coords[2] + (sin * geo.l * s) / nseg;

    const nx = geo.dz / geo.l;
    const ny = -geo.dx / geo.l;

    result += `${xc + forces.V[s] * nx * scaleBy},${zc + forces.V[s] * ny * scaleBy} `;
  }

  return `${n1.coords[0]},${n1.coords[2]} ${result}${n2.coords[0]},${n2.coords[2]}`;
}

export function formatMoments(el: Beam2D, scale: number) {
  let result = "";
  const nseg = 30;
  const scaleBy = (useProjectStore().resultsScalePx * useProjectStore().bendingMomentScale) / scale;
  const n1 = el.domain.getNode(el.nodes[0]);
  const n2 = el.domain.getNode(el.nodes[1]);
  const forces = el.computeBendingMoment(el.domain.solver.loadCases[0], nseg);
  const geo = el.computeGeo();
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;
  for (let s = 0; s <= nseg; s++) {
    const xc = n1.coords[0] + (cos * geo.l * s) / nseg;
    const zc = n1.coords[2] + (sin * geo.l * s) / nseg;

    const nx = -geo.dz / geo.l;
    const ny = geo.dx / geo.l;

    result += `${xc + forces.M[s] * nx * scaleBy},${zc + forces.M[s] * ny * scaleBy} `;
  }

  return `${n1.coords[0]},${n1.coords[2]} ${result}${n2.coords[0]},${n2.coords[2]}`;
}

export function elementStartMarker(el: Beam2D) {
  if (el.hinges[0]) {
    return `url(#hinge-start)`;
  }

  return `none`;
}

export function elementEndMarker(el: Beam2D) {
  if (el.hinges[1]) {
    return `url(#hinge-end)`;
  }

  return `none`;
}

export function formatElement(nodes: number[][]) {
  return nodes.map((n: number[]) => `${n[0]},${n[2]}`).join(" ");
}

export function formatElementFibers(el: Beam2D, scale) {
  const geo = el.computeGeo();
  const nz = geo.dx / geo.l;
  const nx = -geo.dz / geo.l;

  const nodes = [el.domain.nodes.get(el.nodes[0])!.coords, el.domain.nodes.get(el.nodes[1])!.coords];

  return nodes.map((n: number[]) => `${n[0] + (nx * 3) / scale},${n[2] + (nz * 3) / scale}`).join(" ");
}

export function formatElementAngle(el: Beam2D) {
  return Math.atan2(el.computeGeo().dz, el.computeGeo().dx) * (180 / Math.PI);
}

export function formatElementLabel(el: Beam2D, scale: number, amount = 10) {
  const geo = el.computeGeo();
  const ny = geo.dx / geo.l;
  const nx = -geo.dz / geo.l;

  return `translate(${(-amount * nx) / scale}, ${(-amount * ny) / scale})`;
}

export function formatElementHinge(target: Beam2D, i: number, scale: number) {
  const n = target.domain.nodes.get(target.nodes[i]) as Node;

  const geo = target.computeGeo();
  const k = i === 0 ? 1 : -1;
  const nx = ((geo.dx * 9) / geo.l / scale) * k;
  const nz = ((geo.dz * 9) / geo.l / scale) * k;

  const line1 = `${n.coords[0] + nx}, ${n.coords[2] + nz}`;

  return line1;
}

export function formatNodalLoadAngle(nl: NodalLoad) {
  /*const dofs = this.domain.solver.getNodeDofIDs(nl.target);
  const ans = Array<number>();
  for (const idof of dofs) {
    if (idof in nl.values) {
      ans.push(nl.values[idof]);
    } else {
      ans.push(0.0);
    }
  }*/

  const angle = -(Math.atan2(nl.values[0]!, nl.values[2]!) * 180) / Math.PI;

  return angle;
}

export function formatElementLoad(eload: BeamElementUniformEdgeLoad, scale: number) {
  const target = eload.domain.elements.get(eload.target) as Beam2D;

  const n1 = eload.domain.nodes.get(target.nodes[0]) as Node;
  const n2 = eload.domain.nodes.get(target.nodes[1]) as Node;

  const geo = target.computeGeo();
  const nx = (geo.dz * 40) / geo.l / scale;
  const nz = (-geo.dx * 40) / geo.l / scale;

  const line1 = `${n1.coords[0]},${n1.coords[2]} ${n2.coords[0]},${n2.coords[2]}`;
  const line2 = `${n2.coords[0] + nx},${n2.coords[2] + nz} ${n1.coords[0] + nx},${n1.coords[2] + nz} ${n1.coords[0]},${
    n1.coords[2]
  }`;

  return line1 + " " + line2;
}

export function formatElementLoadHatch(eload: BeamElementUniformEdgeLoad, scale: number) {
  let result = "";
  const target = eload.domain.elements.get(eload.target) as Beam2D;

  const n1 = eload.domain.nodes.get(target.nodes[0]) as Node;

  const geo = target.computeGeo();
  const nx = geo.dz / geo.l / scale;
  const nz = -geo.dx / geo.l / scale;
  const nnx = (geo.dz * 40) / geo.l / scale;
  const nnz = (-geo.dx * 40) / geo.l / scale;

  const nseg = Math.ceil((geo.l * scale) / 20);
  const sizeScale = 1;
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;
  for (let s = 0; s <= nseg; s++) {
    const xc = n1.coords[0] + (cos * geo.l * s) / nseg;
    const zc = n1.coords[2] + (sin * geo.l * s) / nseg;

    result += `M${xc + nx * 10 - (geo.dx * 5) / geo.l / scale},${
      zc - (geo.dz / geo.l / scale) * 5 + nz * 10
    } L${xc},${zc} L${xc + nx * 10 + ((geo.dx / geo.l) * 5) / scale},${
      zc + (geo.dz / geo.l / scale) * 5 + nz * 10
    } M${xc},${zc} L${xc + nnx * sizeScale},${zc + nnz * sizeScale}`;
  }

  return result;
}
