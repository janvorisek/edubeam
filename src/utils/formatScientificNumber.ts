export const formatScientificNumber = (n: number, digs = 4) => {
  if (n === 0) return new Number(0).toFixed(digs);

  if (Math.abs(n) > 1000 || Math.abs(n) < 0.01) return n.toExponential(digs);

  return n.toFixed(digs);
};

/**
 * Human-friendly number for coordinates and dimensions: no exponent in the everyday range,
 * trailing zeros trimmed (0.003 → "0.003", 0.1 → "0.1", 1234.5 → "1234.5").
 */
export const formatCompactNumber = (n: number, significant = 6) => {
  if (n === 0 || Math.abs(n) < 1e-12) return '0';
  if (Math.abs(n) >= 1e-4 && Math.abs(n) < 1e7) return parseFloat(n.toPrecision(significant)).toString();
  return n.toExponential(3);
};
