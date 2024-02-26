import EventBus from "@knighttower/js-event-bus";

export enum EventType {
  FIT_CONTENT = "FIT_CONTENT",
}

export const eventBus = new EventBus();
