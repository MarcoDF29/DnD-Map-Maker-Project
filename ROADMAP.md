# MapForge Roadmap

This roadmap is meant to guide the next rounds with Santi/GM feedback. It favors MapForge as a map maker first: high-quality backgrounds, local asset packs, tile/wall tools, layers, and exports. Play/VTT features stay useful, but they should not crowd out map creation.

## Phase 0 - Stabilize The Prototype

- Confirm the app loads from a clean clone with `python -m http.server`.
- Verify no broken asset paths in the browser console.
- Document all bundled assets and known license constraints.
- Decide whether the project remains private-only or will target public redistribution.
- Keep `local-assets/` out of git unless each asset has a clear license.

## Phase 1 - Map Maker Foundation

- Treat HD frames/battlemaps as first-class background assets.
- Add background transform controls: move, scale, rotate, lock, reset.
- Add grid alignment controls: cell size, offset X/Y, opacity, color, square/hex.
- Reorganize tools into clearer groups: Build, Assets, Layers, Play, Export.
- Keep the AI/compendium panel useful but secondary to map creation.

## Phase 2 - Asset Library And Packs

- Harden ZIP asset import and add pack metadata.
- Preserve folder hierarchy from imported packs.
- Add categories: backgrounds, floors, walls, structures, interior, objects, nature, overlays, tokens, symbols.
- Add search, filters, favorites, and recent assets.
- Add pack export/import for private local bundles without committing assets to git.

## Phase 3 - Map Editing Power

- Add proper layers: background, floors, walls, props, overlays, tokens, fog, notes.
- Add a tile brush for floors and terrain.
- Add a wall brush for straight walls and modular wall pieces.
- Add object locking, z-order controls, duplicate, and multi-select.
- Add doors/windows as wall subtypes.
- Improve grid snapping, half-step snapping, and free placement controls.

## Phase 4 - Export Quality And Interoperability

- Export high-resolution PNG/WebP with and without grid.
- Export a player-safe version without GM notes/fog internals.
- Export a `.mapforge.zip` containing JSON plus used local assets.
- Improve JSON schema/versioning.
- Investigate Universal VTT-like data: image, walls, doors, lights, notes.
- Investigate Foundry/Owlbear/Roll20-friendly exports.

## Phase 5 - Play Mode And Generators

- Better player view export/share.
- Line-of-sight improvements.
- Token vision presets.
- Initiative tracker tied more directly to tokens.
- Procedural dungeon presets: cave, crypt, fortress, sewer, temple.
- Procedural region presets: coast, mountains, desert, swamp, trade route.
- Evaluate whether `rot.js`, `visibility-polygon-js`, or Konva should become deeper dependencies.

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
- Should private Drive/local asset packs be documented as source folders, import recipes, or `.mapforge.zip` bundles?
- Which map creation workflow matters most to Santi first: HD frame alignment, modular dungeon tiles, or prop decoration?
