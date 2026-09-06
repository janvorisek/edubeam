/**
 * The subtitle of the selection panel, or nothing when it would only repeat the heading.
 *
 * The panel is headed by what was selected, and the details below it are headed by what the entity
 * calls itself. For an element load those differ - "Element load" over "Trapezoidal load" - but a
 * nodal load and a prescribed displacement are named the same way in both, in every language, and
 * the panel said it twice.
 */
export const selectionSubtitle = (title: string, subtitle: string | null | undefined) =>
  subtitle && subtitle !== title ? subtitle : null;
