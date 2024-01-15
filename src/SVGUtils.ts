import { Node, DofID, Beam2D, NodalLoad, BeamElementUniformEdgeLoad } from "ts-fem";
import { useProjectStore } from "./store/project";
import { useAppStore } from "./store/app";

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
  const nseg = 1;
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
  const nseg = 1;
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
  let neloads = 0;

  for (const eload of el.domain.solver.loadCases[0].elementLoadList) {
    if (eload.target === el.label) neloads++;
  }

  let result = "";
  const nseg = neloads === 0 ? 1 : 20;
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

export function formatMomentsLabels(el: Beam2D, scale: number) {
  const result = [];
  const nseg = 1;
  const scaleBy = (useProjectStore().resultsScalePx * useProjectStore().bendingMomentScale) / scale;
  const n1 = el.domain.getNode(el.nodes[0]);
  const forces = el.computeBendingMoment(el.domain.solver.loadCases[0], nseg);
  const geo = el.computeGeo();
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;
  const nx = -geo.dz / geo.l;
  const ny = geo.dx / geo.l;

  for (let s = 0; s <= nseg; s++) {
    const xc = n1.coords[0] + (cos * geo.l * s) / nseg;
    const zc = n1.coords[2] + (sin * geo.l * s) / nseg;

    if (Math.abs(forces.M[s]) < 1e-6) continue;

    result.push([
      xc + forces.M[s] * nx * scaleBy,
      zc + forces.M[s] * ny * scaleBy,
      useAppStore().convertForce(forces.M[s]),
    ]);
  }

  return result;
}

export function formatNormalForceLabels(el: Beam2D, scale: number) {
  const result = [];
  const nseg = 1;
  const scaleBy = (useProjectStore().resultsScalePx * useProjectStore().normalForceScale) / scale;
  const n1 = el.domain.getNode(el.nodes[0]);
  const forces = el.computeNormalForce(el.domain.solver.loadCases[0], nseg);
  const geo = el.computeGeo();
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;
  const nx = -geo.dz / geo.l;
  const ny = geo.dx / geo.l;

  for (let s = 0; s <= nseg; s++) {
    const xc = n1.coords[0] + (cos * geo.l * s) / nseg;
    const zc = n1.coords[2] + (sin * geo.l * s) / nseg;

    result.push([
      xc - forces.N[s] * nx * scaleBy,
      zc - forces.N[s] * ny * scaleBy,
      useAppStore().convertForce(forces.N[s]),
    ]);
  }

  return result;
}

export function formatShearForceLabels(el: Beam2D, scale: number) {
  const result = [];
  const nseg = 1;
  const scaleBy = (useProjectStore().resultsScalePx * useProjectStore().shearForceScale) / scale;
  const n1 = el.domain.getNode(el.nodes[0]);
  const forces = el.computeShearForce(el.domain.solver.loadCases[0], nseg);
  const geo = el.computeGeo();
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;
  const nx = -geo.dz / geo.l;
  const ny = geo.dx / geo.l;

  for (let s = 0; s <= nseg; s++) {
    const xc = n1.coords[0] + (cos * geo.l * s) / nseg;
    const zc = n1.coords[2] + (sin * geo.l * s) / nseg;

    result.push([
      xc - forces.V[s] * nx * scaleBy,
      zc - forces.V[s] * ny * scaleBy,
      useAppStore().convertForce(forces.V[s]),
    ]);
  }

  return result;
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
  const geo = el.computeGeo();
  return Math.atan2(geo.dz, geo.dx) * (180 / Math.PI);
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

export function formatNodalLoad(nl: NodalLoad, scale: number) {
  const size = Math.sqrt(nl.values[0]! * nl.values[0]! + nl.values[2]! * nl.values[2]!);
  const sx = -nl.values[0]! / size;
  const sz = -nl.values[2]! / size;

  return `${nl.domain.nodes.get(nl.target)!.coords[0]},${nl.domain.nodes.get(nl.target)!.coords[2]} ${
    nl.domain.nodes.get(nl.target)!.coords[0] + (sx * 40) / scale
  },${nl.domain.nodes.get(nl.target)!.coords[2] + (sz * 40) / scale}`;
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
  if (eload.values[0] === 0 && eload.values[1] === 0) return "";

  const target = eload.domain.elements.get(eload.target) as Beam2D;

  const n1 = eload.domain.nodes.get(target.nodes[0]) as Node;
  const n2 = eload.domain.nodes.get(target.nodes[1]) as Node;

  const geo = target.computeGeo();

  const smallestsize = eload.values[0] !== 0 && eload.values[1] === 0 ? 20 : 40;

  const nx = (geo.dz * smallestsize) / geo.l / scale;
  const nz = (-geo.dx * smallestsize) / geo.l / scale;
  const nx2 = (geo.dz * 60) / geo.l / scale;
  const nz2 = (-geo.dx * 60) / geo.l / scale;

  let line1 = "",
    line2 = "",
    line3 = "";

  if (eload.lcs) {
    line1 = `${n1.coords[0]},${n1.coords[2]} ${n2.coords[0]},${n2.coords[2]}`;

    line2 = `${n2.coords[0] + nx},${n2.coords[2] + nz} ${n1.coords[0] + nx},${n1.coords[2] + nz} ${n1.coords[0]},${
      n1.coords[2]
    }`;

    line3 =
      eload.values[0] !== 0 && eload.values[1] !== 0
        ? `${n2.coords[0]},${n2.coords[2]} ${n2.coords[0] + nx2},${n2.coords[2] + nz2} ${n1.coords[0] + nx2},${
            n1.coords[2] + nz2
          }`
        : ``;
  } else {
    if (eload.values[1] !== 0) {
      line1 = `${n1.coords[0]},${n1.coords[2]} ${n1.coords[0]},${n1.coords[2] - 40 / scale} ${n2.coords[0]},${
        n2.coords[2] - 40 / scale
      } ${n2.coords[0]},${n2.coords[2]}`;
    }

    if (eload.values[0] !== 0) {
      line2 = `${n1.coords[0]},${n1.coords[2]} ${n1.coords[0] - (Math.sign(nx) * 40) / scale},${n1.coords[2]} ${
        n2.coords[0] - (Math.sign(nx) * 40) / scale
      },${n2.coords[2]} ${n2.coords[0]},${n2.coords[2]}`;
    }
  }

  return line1 + " " + line2 + " " + line3;
}

export function formatElementLoadForces(eload: BeamElementUniformEdgeLoad, scale: number, component: number) {
  const target = eload.domain.elements.get(eload.target) as Beam2D;

  const n1 = eload.domain.nodes.get(target.nodes[0]) as Node;

  const geo = target.computeGeo();
  const nx = geo.dz / geo.l / scale;
  const nz = -geo.dx / geo.l / scale;
  const nnx = (geo.dz * 40) / geo.l / scale;
  const nnz = (-geo.dx * 40) / geo.l / scale;

  let nseg = Math.ceil((geo.l * scale) / 20);
  let segsize = geo.l / nseg;
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;

  const pts: [number, number][] = [];

  if (eload.lcs) {
    if (component === 1) {
      const moveDist = eload.values[1] >= 0 ? 0 : 2;

      for (let s = 0; s <= nseg; s++) {
        pts.push([
          n1.coords[0] + s * cos * segsize + nx * 20 + nx * moveDist,
          n1.coords[2] + s * sin * segsize + nz * 20 + nz * moveDist,
        ]);
      }
    }
    if (component === 0) {
      nseg = Math.floor((geo.l * scale) / 45);
      segsize = geo.l / nseg;
      const mx = (cos * segsize) / 2;
      const mz = (sin * segsize) / 2;
      const moveDist = eload.values[0] !== 0 && eload.values[1] === 0 ? 10 : 50;
      for (let s = 0; s < nseg; s++) {
        pts.push([
          n1.coords[0] + mx + s * cos * segsize + nx * moveDist,
          mz + n1.coords[2] + s * sin * segsize + nz * moveDist,
        ]);
      }
    }
  } else {
    if (component === 1) {
      for (let s = 0; s <= nseg; s++) {
        pts.push([n1.coords[0] + s * cos * segsize, n1.coords[2] + s * sin * segsize - 20 / scale]);
      }
    }
    if (component === 0) {
      for (let s = 0; s <= nseg; s++) {
        pts.push([n1.coords[0] + s * cos * segsize - (Math.sign(nx) * 20) / scale, n1.coords[2] + s * sin * segsize]);
      }
    }
  }

  return pts;
}

export function formatElementLoadLabel(eload: BeamElementUniformEdgeLoad, scale: number, component: number) {
  const target = eload.domain.elements.get(eload.target) as Beam2D;
  const geo = target.computeGeo();
  const nz = geo.dx / geo.l;
  const nx = -geo.dz / geo.l;

  const n1 = eload.domain.nodes.get(target.nodes[0]) as Node;
  const n2 = eload.domain.nodes.get(target.nodes[1]) as Node;

  const ncx = n1.coords[0]; //(n1.coords[0] + n2.coords[0]) / 2;
  const ncz = n1.coords[2]; //(n1.coords[2] + n2.coords[2]) / 2;

  const angle = 0; //Math.atan2(geo.dz, geo.dx) * (180 / Math.PI);
  const dist = 40;
  const dist2 = eload.values[1] !== 0 ? 60 : 20;

  const dx = eload.lcs ? (-nx * dist) / scale : 0;
  const dz = eload.lcs ? (-nz * dist) / scale : -dist / scale;

  const dx3 = -(nz * 5) / scale;
  const dz3 = (nx * 5) / scale;

  if (eload.lcs) {
    const dx2 = (-nx * dist2) / scale;
    const dz2 = (-nz * dist2) / scale;

    if (component === 0) return `translate(${ncx + dx2 + dx3}, ${ncz + dz2 + dz3}) rotate(${angle})`;
    if (component === 1) return `translate(${ncx + dx + dx3}, ${ncz + dz + dz3}) rotate(${angle})`;
  } else {
    if (component === 0) return `translate(${ncx - dist / scale + dx3}, ${ncz + dz3}) rotate(${angle})`;
    if (component === 1) return `translate(${ncx + dx3}, ${ncz - dist / scale + dz3}) rotate(${angle})`;
  }

  return `translate(${ncx + dx}, ${ncz + dz}) rotate(${angle})`;
}

export function formatElementLoadForcesAngle(eload: BeamElementUniformEdgeLoad, component: number) {
  if (!eload.lcs) {
    if (component === 0) return eload.values[0] < 0 ? 90 : 270;
    else if (component === 1) return eload.values[1] > 0 ? 0 : 180;
  }

  const target = eload.domain.elements.get(eload.target) as Beam2D;
  const geo = target.computeGeo();

  if (component === 0) return (Math.atan2(geo.dz, geo.dx) * 180) / Math.PI - 90 * Math.sign(eload.values[0]);

  if (eload.values[1] < 0) return (Math.atan2(geo.dz, geo.dx) * 180) / Math.PI + 180;
  return (Math.atan2(geo.dz, geo.dx) * 180) / Math.PI;
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

  if (eload.values[1] !== 0) {
    for (let s = 0; s <= nseg; s++) {
      const xc = n1.coords[0] + (cos * geo.l * s) / nseg;
      const zc = n1.coords[2] + (sin * geo.l * s) / nseg;

      if (eload.values[1] > 0) {
        result += `M${xc + nx * 10 - (geo.dx * 5) / geo.l / scale},${
          zc - (geo.dz / geo.l / scale) * 5 + nz * 10
        } L${xc},${zc} L${xc + nx * 10 + ((geo.dx / geo.l) * 5) / scale},${
          zc + (geo.dz / geo.l / scale) * 5 + nz * 10
        } `;
      } else {
        result += `M${xc + nnx * sizeScale - nx * 10 - ((geo.dx / geo.l) * 5) / scale},${
          zc + nnz * sizeScale - nz * 10 - ((geo.dz / geo.l) * 5) / scale
        }`;

        result += `L${xc + nnx * sizeScale},${zc + nnz * sizeScale}`;

        result += `L${xc + nnx * sizeScale - nx * 10 + ((geo.dx / geo.l) * 5) / scale},${
          zc + nnz * sizeScale - nz * 10 + ((geo.dz / geo.l) * 5) / scale
        }`;
      }

      result += `M${xc},${zc} L${xc + nnx * sizeScale},${zc + nnz * sizeScale}`;
    }
  }

  if (eload.values[0] !== 0) {
    let dfromfz = 0;
    if (eload.values[1] !== 0) dfromfz = 40;
    const nseg2 = Math.ceil((geo.l * scale) / 40);
    for (let s = 0; s < nseg2; s++) {
      const xc = n1.coords[0] + (cos * geo.l * s) / nseg2 + nx * dfromfz;
      const zc = n1.coords[2] + (sin * geo.l * s) / nseg2 + nz * dfromfz;

      if (eload.values[0] < 0) {
        result += `M${xc + nx * 20}, ${zc + nz * 20} L${xc + nx * 25 - nz * 10},${zc + nz * 25 + nx * 10}`;
        result += `M${xc + nx * 20}, ${zc + nz * 20} L${xc + nx * 15 - nz * 10},${zc + nz * 15 + nx * 10}`;
      } else {
        result += `M${xc + nx * 20 - nz * 30},${zc + nz * 20 + nx * 30} L${xc + nx * 25 - nz * 20},${
          zc + nz * 25 + nx * 20
        }`;
        result += `M${xc + nx * 20 - nz * 30},${zc + nz * 20 + nx * 30} L${xc + nx * 15 - nz * 20},${
          zc + nz * 15 + nx * 20
        }`;
      }

      result += `M${xc + nx * 20}, ${zc + nz * 20} L${xc + nx * 20 - nz * 30},${zc + nz * 20 + nx * 30}`;
    }
  }
  return result;
}

export function formatExpValueAsHTML(n: number, decimals: number) {
  let str = n >= 0 ? '<span style=" width: 5px;"></span>' : "";
  str += n.toExponential(decimals);
  str = str.replace("e-", " &middot; 10<sup>-");
  str = str.replace("e+", " &middot; 10<sup>");
  str = str + "</sup>"; //.replace('10')

  return str;
}

export function formatMeasureAsHTML(s: string) {
  if (s === "1/K") return "K<sup>-1</sup>";

  // find string before fist number
  const n = s.search(/\d/);

  if (n === -1) return s;

  const prefix = s.substring(0, n);
  const suffix = s.substring(n);

  return `${prefix}<sup>${suffix}</sup>`;
}
