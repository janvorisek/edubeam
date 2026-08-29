export const formatScientificNumber = (n: number, digs = 4) => {
  if (n === 0) return new Number(0).toFixed(digs);

  if (Math.abs(n) > 1000 || Math.abs(n) < 0.01) return n.toExponential(digs);

  return n.toFixed(digs);
};
