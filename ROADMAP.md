# MapForge Roadmap

This roadmap is meant to guide the next rounds with Santi/GM feedback. It favors small, testable improvements over big rewrites.

## Phase 0 - Stabilize The Prototype

- Confirm the app loads from a clean clone with `python -m http.server`.
- Verify no broken asset paths in the browser console.
- Document all bundled assets and known license constraints.
- Decide whether the project remains private-only or will target public redistribution.
- Keep `local-assets/` out of git unless each asset has a clear license.

## Phase 1 - GM Usability

- Reorganize tools into clearer groups: Build, Play, Assets, Export.
- Replace remaining emoji UI icons with a consistent icon set.
- Improve the object picker with search, filters, favorites, and recent assets.
- Add better empty states and small hints for core workflows.
- Add a "GM test session" checklist directly in the UI or docs.

## Phase 2 - Map Editing Power

- Move stamp definitions from hardcoded HTML into structured data.
- Add proper layers: background, terrain, walls, objects, tokens, fog, notes.
- Add object locking, z-order controls, and multi-select.
- Add doors/windows as wall subtypes.
- Improve grid snapping and free placement controls.

## Phase 3 - Play Mode

- Better player view export/share.
- Line-of-sight improvements.
- Token vision presets.
- Initiative tracker tied more directly to tokens.
- Conditions, HP markers, and turn highlighting on map.

## Phase 4 - Assets And Generators

- Harden ZIP asset import and add pack metadata.
- Add asset tags and search across DawnLike, map icons, symbols, HD packs.
- Add procedural dungeon presets: cave, crypt, fortress, sewer, temple.
- Add procedural region presets: coast, mountains, desert, swamp, trade route.
- Evaluate whether `rot.js`, `visibility-polygon-js`, or Konva should become deeper dependencies.

## Phase 5 - Interoperability

- Improve JSON schema/versioning.
- Export/import Universal VTT-like data: image, walls, doors, lights, notes.
- Investigate Foundry/Owlbear/Roll20-friendly exports.
- Add a migration path when old saved JSON files change shape.

## Design Direction

Target feel: modern arcane cartographer workbench.

- Keep the UI dark, quiet, and tool-focused.
- Use gold as a state/accent color, not a full theme.
- Prefer SVG/icon-font consistency over mixed emojis.
- Make the canvas the main character.
- Keep panels dense but scannable, because this is a GM tool, not a landing page.

## Open Questions

- Should this remain purely static HTML/CSS/JS, or eventually move to Vite/React/Svelte?
- Should imported HD assets stay only in IndexedDB, or can packs be exported/imported as project files?
- Which VTT export target matters most: Foundry, Owlbear, Roll20, or generic UVTT?
- What does Santi actually need at the table first: faster map creation, better play mode, or better asset management?
