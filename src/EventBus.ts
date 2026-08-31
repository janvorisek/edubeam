type EventHandler = (...args: any[]) => void;

class EventBus {
  private events: { [key: string]: EventHandler[] };

  constructor() {
    this.events = {};
  }

  on(eventType: string, handler: EventHandler): void {
    this.subscribe(eventType, handler);
  }

  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.events[eventType]) {
      this.events[eventType] = [];
    }
    this.events[eventType].push(handler);
  }

  off(eventType: string, handler: EventHandler): void {
    this.unsubscribe(eventType, handler);
  }

  unsubscribe(eventType: string, handler: EventHandler): void {
    if (!this.events[eventType]) return;
    this.events[eventType] = this.events[eventType].filter((h) => h !== handler);
  }

  emit(eventType: string, ...args: any[]): void {
    if (!this.events[eventType]) return;
    this.events[eventType].forEach((handler) => handler(...args));
  }
}

export const enum EventType {
  FIT_CONTENT = 'FIT_CONTENT',
  REQUEST_VIEWER_SVG = 'REQUEST_VIEWER_SVG',
}

export const eventBus = new EventBus();

/**
 * Hands back the live viewer `<svg>` without parking a DOM node in a store.
 *
 * `emit` is synchronous, so the viewer answers before this returns; callers outside the
 * editor (a dialog, a menu action) get the element they need to export.
 */
export const getViewerSvg = (): SVGSVGElement | null => {
  let element: SVGSVGElement | null = null;

  eventBus.emit(EventType.REQUEST_VIEWER_SVG, (svg: SVGSVGElement | null) => {
    if (svg) element = svg;
  });

  return element;
};
