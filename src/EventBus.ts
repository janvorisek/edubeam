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
  FIT_CONTENT = "FIT_CONTENT",
}

export const eventBus = new EventBus();
