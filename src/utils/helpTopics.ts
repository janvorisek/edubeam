/**
 * Registry of in-app help topics.
 *
 * Every topic is a short blurb shown in a `<HelpTip>` popover plus a deep link into
 * the documentation. Keeping them in one place means the docs paths are maintained
 * here only and the components stay a single attribute long.
 */
export interface HelpTopic {
  /** i18n key of the popover heading */
  title: string;
  /** i18n key of the one or two sentence explanation */
  body: string;
  /** documentation path without locale prefix, may contain an anchor */
  path: string;
}

export const helpTopics = {
  nodes: { title: 'help.nodes.title', body: 'help.nodes.body', path: '/essentials/nodes-supports' },
  supports: { title: 'help.supports.title', body: 'help.supports.body', path: '/essentials/nodes-supports#supports' },
  elements: { title: 'help.elements.title', body: 'help.elements.body', path: '/essentials/elements' },
  loads: { title: 'help.loads.title', body: 'help.loads.body', path: '/essentials/loads' },
  nodalLoads: { title: 'help.nodalLoads.title', body: 'help.nodalLoads.body', path: '/essentials/loads#nodal-loads' },
  elementLoads: {
    title: 'help.elementLoads.title',
    body: 'help.elementLoads.body',
    path: '/essentials/loads#element-loads',
  },
  materials: { title: 'help.materials.title', body: 'help.materials.body', path: '/essentials/elements#materials' },
  crossSections: {
    title: 'help.crossSections.title',
    body: 'help.crossSections.body',
    path: '/essentials/elements#cross-sections',
  },
  hinges: { title: 'help.hinges.title', body: 'help.hinges.body', path: '/essentials/elements#end-hinges' },
  signConvention: {
    title: 'help.signConvention.title',
    body: 'help.signConvention.body',
    path: '/elements/conventions#loads',
  },
  results: { title: 'help.results.title', body: 'help.results.body', path: '/essentials/results' },
  diagrams: {
    title: 'help.diagrams.title',
    body: 'help.diagrams.body',
    path: '/essentials/results#overlays-in-the-viewer',
  },
  endForces: {
    title: 'help.endForces.title',
    body: 'help.endForces.body',
    path: '/elements/conventions#end-forces-element-results-table',
  },
  settings: { title: 'help.settings.title', body: 'help.settings.body', path: '/essentials/units-settings' },
  sharing: { title: 'help.sharing.title', body: 'help.sharing.body', path: '/essentials/import-export' },
} satisfies Record<string, HelpTopic>;

export type HelpTopicKey = keyof typeof helpTopics;
