# Open-source integration notes

## Reuse policy

- Prefer MIT-licensed code/data with attribution.
- Do not copy assets from repositories without an explicit license.
- Treat Creative Commons BY-NC/ND/SA material with care. Use as reference-only unless we fully accept the license constraints and document attribution/share-alike requirements.
- Keep third-party material isolated under a source/attribution manifest before bundling it into the app.

## Reviewed repositories

| Repository | License signal | Useful for | Recommended use |
| --- | --- | --- | --- |
| https://github.com/Azgaar/Fantasy-Map-Generator | MIT license file for repository; mixed embedded metadata in some SVG charges | World-generation architecture, biome/world data model, routes, settlements, heraldic SVG charges | Reuse ideas and MIT-compatible code with attribution. Treat copied SVG charges as mixed-license art until individually audited. |
| https://github.com/andyaiken/dojo | MIT in package/license | GM workflows: monsters, encounter builder, adventure flow, combat manager, references, tactical map UX | Reuse code patterns and inspect SRD/OGL data carefully before bundling monster/reference content. |
| https://github.com/MlakarT/DnD-project | MIT license file | Seeded path/dungeon generation prototype | Reuse algorithmic idea for quick corridor/path generation, with attribution if code is ported. |
| https://github.com/gitUmaru/dnd | CC BY-NC-ND 4.0 license file | Adventure/note structure | Reference only. Do not derive or redistribute adapted adventure text. |
| https://github.com/itSatoriCode/dnd-assets | No repository license found | Images, PDFs, handouts | Do not copy into this app unless the author adds/clarifies a license. Can use as inspiration for our own original asset categories. |

## Suggested next build phases

1. Asset registry: move stamp definitions out of `index.html` into structured JSON with category, tags, default lore template, scale, and visibility defaults.
2. Scenario packs: keep templates as data, not inline JS, with `terrainMap`, travel scale, landmarks, hooks, and encounter suggestions.
3. Procedural exploration generator: inspired by Azgaar, generate biomes, rivers, roads, settlements, and landmarks as separate layers.
4. Encounter integration: inspired by Dojo, add monster search, CR/difficulty hints, encounter waves, initiative import, and conditions.
5. Attribution manifest: if any MIT code/data is ported, add source, license, and modification notes.

## Implemented in this pass

- Copied a curated SVG symbol pack from Azgaar into `assets/azgaar-charges/`; these symbols need individual license review because some SVG files include CC/GFDL/non-commercial metadata.
- Added a `Símbolos` stamp tab that places those SVGs as image stamps with default landmark descriptions.
- Added `THIRD_PARTY_ATTRIBUTIONS.md` with source and license details.
- Added a procedural exploration-region generator using original code inspired by the reviewed generator architecture.
- Added a procedural dungeon/path generator adapted from the MIT-licensed MlakarT/DnD-project seed/path approach.
- Added DawnLike sprites, RPG Awesome icons, game-icons.net SVGs, and rot.js; see `THIRD_PARTY_ATTRIBUTIONS.md`.
- Added research notes in `research-mapforge-opportunities.md`, plus collaboration docs in `README.md`, `ROADMAP.md`, and `FEEDBACK_CHECKLIST.md`.
- Continued to avoid copying `itSatoriCode/dnd-assets` because no license file was found.
