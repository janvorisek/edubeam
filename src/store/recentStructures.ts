import { defineStore } from 'pinia';
import { ref } from 'vue';
import { LinearStaticSolver } from 'ts-fem';
import { parseSerializedModel, serializeModel } from '@/utils/serializeModel';
import { buildStarterModel } from '@/utils/starterModel';
import type { DimensionLine } from '@/types/dimension';

/** What replaced the structure that was saved. */
export type RecentStructureReason = 'clear' | 'link' | 'file' | 'example' | 'firstBeam' | 'restore';

export type RecentStructure = {
  id: string;
  savedAt: number;
  reason: RecentStructureReason;
  /** The share-link encoding, the same one the project store keeps in localStorage. */
  model: string;
  nodes: number;
  elements: number;
};

export const RECENT_STRUCTURES_LIMIT = 10;
export const RECENT_STRUCTURES_KEY = 'recentStructures';

const reasons: RecentStructureReason[] = ['clear', 'link', 'file', 'example', 'firstBeam', 'restore'];

const isEntry = (v: unknown): v is RecentStructure => {
  if (typeof v !== 'object' || v === null) return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.savedAt === 'number' &&
    reasons.includes(e.reason as RecentStructureReason) &&
    typeof e.model === 'string' &&
    typeof e.nodes === 'number' &&
    typeof e.elements === 'number'
  );
};

const readStorage = (): RecentStructure[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_STRUCTURES_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isEntry).slice(0, RECENT_STRUCTURES_LIMIT) : [];
  } catch {
    return [];
  }
};

/** Writes what fits: when storage is full, the oldest entries go first. Returns what was kept. */
const writeStorage = (entries: RecentStructure[]): RecentStructure[] => {
  const kept = [...entries];
  for (;;) {
    try {
      localStorage.setItem(RECENT_STRUCTURES_KEY, JSON.stringify(kept));
      return kept;
    } catch {
      if (kept.length === 0) return kept;
      kept.pop();
    }
  }
};

/**
 * Two encodings of the same structure differ in their dimension ids, which are random. Compare
 * with those left out, so re-saving an unchanged model is recognised as a duplicate.
 */
export const modelFingerprint = (model: string): string | null => {
  const parsed = parseSerializedModel(model);
  if (parsed === null) return null;
  if (Array.isArray(parsed.d)) parsed.d = parsed.d.map((d: unknown[]) => d.filter((_, i) => i !== 2));
  return JSON.stringify(parsed);
};

let starterFingerprints: string[] | undefined;

/** Either starter frame, the SI or the US one, untouched. */
const isStarterModel = (fingerprint: string) => {
  starterFingerprints ??= (['si', 'us'] as const).map((system) => {
    const solver = new LinearStaticSolver();
    const dimensions: DimensionLine[] = [];
    buildStarterModel(solver, dimensions, system);
    return modelFingerprint(serializeModel(solver, dimensions) ?? '');
  });

  return starterFingerprints.includes(fingerprint);
};

/** Whether a serialized model is one of the starter frames, as a first visit opens it. */
export const isUntouchedStarterModel = (model: string | null) => {
  const fingerprint = model === null ? null : modelFingerprint(model);
  return fingerprint !== null && isStarterModel(fingerprint);
};

const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * The last few structures that were replaced - cleared, or overwritten by a link, a file, an
 * example or the first-beam task - so none of those ever costs someone their work, even after a
 * reload. Kept apart from the undo history, which lives only as long as the tab.
 */
export const useRecentStructuresStore = defineStore('recentStructures', () => {
  const entries = ref<RecentStructure[]>(readStorage());

  // Another tab may have saved since this one loaded, so each write starts from what is stored.
  const update = (change: (current: RecentStructure[]) => RecentStructure[]) => {
    entries.value = writeStorage(change(readStorage()).slice(0, RECENT_STRUCTURES_LIMIT));
  };

  /**
   * Saves `model` as about to be replaced. Empty models and the untouched starter frame are not
   * worth keeping; a model already in the list moves to the top instead of appearing twice.
   * Returns whether anything was saved.
   */
  const remember = (model: string | null, reason: RecentStructureReason): boolean => {
    if (!model) return false;

    const parsed = parseSerializedModel(model);
    if (parsed === null || !Array.isArray(parsed.n) || parsed.n.length === 0) return false;

    const fingerprint = modelFingerprint(model);
    if (fingerprint === null || isStarterModel(fingerprint)) return false;

    const entry: RecentStructure = {
      id: createId(),
      savedAt: Date.now(),
      reason,
      model,
      nodes: parsed.n.length,
      elements: Array.isArray(parsed.e) ? parsed.e.length : 0,
    };

    update((current) => [entry, ...current.filter((e) => modelFingerprint(e.model) !== fingerprint)]);
    return entries.value.some((e) => e.id === entry.id);
  };

  const remove = (id: string) => {
    update((current) => current.filter((e) => e.id !== id));
  };

  return { entries, remember, remove };
});
