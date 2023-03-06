# To-do list

## General

- show nodal values for N, V, M, u etc.
- calculate and show extrema for element values
- analytical analysis for elements (`u(x)` etc.)
- make structural dynamics solver work again

## UX
- zoom using touch is much less performant than mousewheel - no idea why - INVESTIGATE!
-  delete on load doesn't work - loads need to have label in `ts-fem`
- need a way to validate structure before solve or handle solve errors (e.g., unstable structure, supported nodes not connected to the structure)
- make settings page work again - language, grid snap etc.
- add nodes and elements using mouse - optional to the dialogs

## Errors

- `SVGViewer` sometimes throws errors (NaNs in transformations and position) - INVESTIGATE!
- Warnings in add node dialog
