import type { ComputedRef, InjectionKey } from 'vue';
import type { Snap } from '@/utils/snap';

/**
 * Where the point the active tool puts down goes, or null while no tool puts one down: provided as
 * the ref, so that reading it belongs to the preview and the snap mark, which follow every pointer
 * report, and not to the drawing, which renders every node, element and load at once.
 */
export const snapKey = Symbol('snap') as InjectionKey<ComputedRef<Snap | null>>;
