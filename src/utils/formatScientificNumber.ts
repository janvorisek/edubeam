export const formatScientificNumber = (n: number, digs = 4) => {
  if (n === 0) return new Number(0).toFixed(digs);

  if (n > 1000 || n < 0.01) return n.toExponential(digs);

  return n.toFixed(digs);
};
