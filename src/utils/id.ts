export const createDimensionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const randomSuffix = Math.random().toString(36).slice(2, 10);
  return `dim-${Date.now().toString(36)}-${randomSuffix}`;
};

export const ensureDimensionId = <T extends { id?: string }>(dimension: T): string => {
  if (!dimension.id) {
    dimension.id = createDimensionId();
  }

  return dimension.id;
};
