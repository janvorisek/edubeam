# AGENTS.md

edubeam is a live, in-browser 2D structural analysis app used in real classrooms. Share links and project files are embedded in lecture notes and assignments. Optimize for correctness, clarity, and velocity, in that order.

## Core Principles

- Use modern TypeScript only.
- Prefer direct refactors over compatibility layers in code.
- Remove dead code aggressively.
- Fail fast on invalid input inside the app. At the edges (share links, opened files, local storage), reject bad data without wiping the user's current model.
- Old share links and project files must always keep working (see Backward Compatibility Policy).

## Commands

```bash
npm run dev          # Vite dev server
npm run test:run     # Vitest, once
npm run lint         # ESLint on src/ (lint:fix to apply fixes)
npm run build        # production bundle in dist/
npm run docs:dev     # VitePress docs
```

Run `test:run` and `lint` before calling a change done.

## TypeScript Standards

- `tsconfig.json` still has `strict: false`. Write new and edited code as if it were strict.
- No `any` (except tightly justified boundary shims, with a TODO to remove). Prefer `unknown` at external boundaries.
- Use discriminated unions, literal types, and `satisfies` where helpful.
- Fully type function params, returns, events, and store state.
- Avoid type assertions (`as`) unless unavoidable; narrow with runtime checks first.
- Prefer `readonly` for immutable data and function inputs where practical.

## Modern JS/TS Style

- ESM only, `const` over `let`, `===`/`!==` always, optional chaining and `??` where they fit.
- Prefer composable functions over classes, unless a class clearly improves the design.
- Use async/await and small pure helpers.
- Formatting is Prettier: single quotes, semicolons, ES5 trailing commas, 120 columns, 2-space indent, LF.
- Vue 3 with `<script setup>`, Vuetify 3, and Pinia. Import from `src/` through the `@/` alias.

## Architecture

- The FE solver lives in the separate [ts-fem](https://github.com/janvorisek/ts-fem) package. Keep solver math out of components.
- Model state is in `src/store/project.ts`. View state is in `viewer.ts` and `layout.ts`.
- Every user edit to the model must be undoable. Wrap it in `executeModelMutationWithUndo` (`src/utils/index.ts`), which snapshots the project and pushes a command to `undoRedoManager`. Don't write your own undo.
- Stored values are SI (m, N, Pa, rad). Unit conversion happens only for display and input (`src/utils/unitConversions.ts`).
- Name units and coordinate systems explicitly in code. The model is x-right/z-down. y-up is a display convention (`src/utils/axisConvention.ts`).
- Keep modules small and focused, with explicit data flow over hidden mutation.
- Add concise comments only where math or logic is non-obvious. Explain *why*, not *what*.

## Backward Compatibility Policy

**Backward compatibility is crucial.** A share link in a lecture note from years ago has to open exactly the same model today. A broken link or file is a critical bug, however clean the refactor that caused it.

These must always keep loading, with the same results:

- `?model=` share links, including the older Latin-1 encoding (`src/utils/serializeModel.ts`)
- `?viewer=1` and `?lang=` links, including `lang` codes such as `cn`
- `project.json` files from every released version
- the model and settings saved in local storage, so returning users don't lose their work
- legacy EduBeam XML sessions (`src/utils/loadXmlFile.ts`)

Rules:

- Add to these formats; don't rename or repurpose existing fields. If a shape has to change, keep a decode path for the old shape and migrate on load.
- Every format change comes with a test that loads a fixture in the *old* format (see `serializeModel.test.ts`).
- Apply the same care to user-facing behavior that people rely on: keyboard shortcuts, URL parameters, units, and sign conventions.
- Internal code has no such constraint. Refactor freely, without transitional aliases, and update all call sites in the same change.

## Quality Bar

- New behavior includes or updates tests in `src/tests/` when practical.
- Keep lint and type checks clean for the files you touch.
- Prefer deleting unclear code over keeping speculative abstractions.
- Check numerical changes against a hand calculation. `docs/en/guide/verification.md` has closed-form reference cases.

## UI Changes

- Additive UI (new dialogs, guided steps, options) is fine to build.
- **Ask before removing, hiding, or closing-by-default anything users see today** (tabs, the tab strip, panels, buttons), even if an issue or review asks for it.
- Show UI changes with before/after screenshots. Playwright against the dev server works well; crop to the feature.
- The app must work with mouse, keyboard, and touch.

## Translations

- `src/locales/en.json` is the source. `locales.test.ts` fails unless **every** locale has every English key, no extra keys, and the same `{placeholders}`. A new string means adding it to all 12 locale files.
- Where academic and software terminology differ, use the terms structural analysis software (SAP2000, ETABS, …) uses in that language.
- Docs live in `docs/<lang>/`. English is in `docs/en/` but is served from the root (`/guide/…`, not `/en/guide/…`) through `rewrites` in `docs/.vitepress/config.ts`. Help links in the app go through `docsUrl` (`src/utils/docs.ts`).
- Every language has the same pages; the nav and sidebar are built once in `docs/.vitepress/navigation.ts`. Translated headings keep the English id (`## Podpory {#supports}`), because the app's help links point to those anchors in every language.
- Docs screenshots come from `npm run docs:screenshots` (with `npm run dev` running): `--lang cs` or `--lang all` for the translations, `--missing` to fill gaps. Regenerate them when the UI they show changes.

## Export

- SVG export (`src/utils/exportImage.ts`) is validated against Word and Inkscape/Overleaf. Don't change serialization rules on theory alone: export a real file, inspect it, and render it (e.g. with `cairosvg`) before and after.

## Commits, PRs and Releases

- Work on `dev`. `main` is production (run.edubeam.app); both branches deploy to Cloudflare Pages on push.
- Commit subject: `type: lowercase summary` (`feat`, `fix`, `docs`, `chore`, `test`, `ci`, `i18n`, `release`). If there's a body, write it as prose explaining the cause, not a bullet list.
- **No AI attribution.** No `Co-Authored-By` trailers and no "Generated with" footers.
- Keep changes focused, with clear intent. Include a short rationale for non-obvious design choices.
- If a constraint blocks ideal typing, document the limitation inline with next-step cleanup.
- Release notes live in `public/changelog/en.json` and `cs.json`. List only major, useful points, fold the rest into one "Also: …" line, and add screenshots to `public/changelog/media/`. Run `npm run contributors -- --write` to fill in contributors.
