import type { SectionShape } from '@/utils/sectionProperties';

declare module '@edubeam/fem' {
  interface CrossSection {
    /** Polygonal geometry the section properties were derived from (optional). */
    shape?: SectionShape;
  }
}

export {};
