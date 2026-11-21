export enum MouseMode {
  NONE,
  SELECTING,
  HOVER,
  MOVING,
  ADD_NODE,
  ADD_ELEMENT,
  ADD_DIMLINE,
  PASTE_CLIPBOARD,
  /** Dragging a rectangle over the drawing to choose what an image export shows. */
  PICK_WINDOW,
  /** The support tool: a click on a node gives it the chosen support. */
  ADD_SUPPORT,
  /** The load tool: a click on a node or a member puts the chosen load on it. */
  ADD_LOAD,
}
