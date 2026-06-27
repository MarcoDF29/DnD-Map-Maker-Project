# Third-party attributions

This project is currently a private/local D&D table tool prototype. It bundles material with different licenses. Do not assume the repository as a whole is ready for commercial use or broad redistribution until this file is audited again.

## DawnLike sprites

- Source: https://opengameart.org/content/dawnlike-16x16-universal-rogue-like-tileset-v181
- Author: DragonDePlatino
- License: CC BY-SA 3.0
- Local files:
  - `assets/dawnlike/Characters/*.png`
  - `assets/dawnlike/Items/*.png`
- Usage: DawnLike sprite picker (`DL`) for tokens, monsters, items, weapons, potions, and props.

Attribution: DawnLike 16x16 Universal Rogue-like Tileset by DragonDePlatino, licensed under CC BY-SA 3.0.

## game-icons.net

- Source: https://game-icons.net/
- Authors: Delapouite, Lorc, and contributors
- License: CC BY 3.0
- Local files:
  - `assets/game-icons/*.svg`
- Usage: vector map-location and fantasy stamps.

Attribution: Icons from game-icons.net by Delapouite, Lorc, and contributors, licensed under CC BY 3.0.

## RPG Awesome icon font

- Source: https://github.com/nagoshiashumari/Rpg-Awesome
- License: see bundled font/CSS metadata and upstream repository
- Local files:
  - `assets/rpg-awesome/*`
- Usage: RPG/fantasy UI icons.

## rot.js

- Source: https://github.com/ondras/rot.js
- License: BSD-3-Clause
- Local files:
  - `assets/rot.min.js`
- Usage: field-of-view / roguelike utility foundation for map visibility work.

## JSZip

- Source: https://stuk.github.io/jszip/
- License: MIT
- Current usage:
  - Loaded from CDN in `index.html`.
  - Used by the experimental `.zip` HD asset-pack importer.

Note: for better offline behavior, vendor a reviewed local copy before treating ZIP import as production-ready.

## Azgaar/Fantasy-Map-Generator and heraldic charges

- Source repository: https://github.com/Azgaar/Fantasy-Map-Generator
- Repository license: MIT
- Local files:
  - `assets/azgaar-charges/*.svg`
- Usage: heraldic/map symbol stamps.

Important license note: the Azgaar repository is MIT, but many individual SVG files contain embedded metadata pointing to original sources such as WappenWiki, Wikimedia Commons, CC BY-SA, CC BY-NC-SA, GFDL, or public-domain/CC0 sources. Treat this folder as mixed-license art. Keep individual SVG metadata intact and do not use these files commercially until each symbol is audited or replaced with CC0/MIT alternatives.

## MlakarT/DnD-project

- Source: https://github.com/MlakarT/DnD-project
- License: MIT
- Local reference copy:
  - `local-assets/DnD-project-main/` (ignored by git)
- Ported/adapted logic:
  - procedural dungeon/path generation concepts in `app.js`

The procedural dungeon generator adapts the seed/path idea into MapForge-specific browser-side JavaScript with its own terrain, fog, stamps, and lore integration.

## D&D / SRD / OGL-derived monster data

- Local file:
  - `assets/monsters.json`
- Usage: compendium/search data.
- License signal: file contains Open Game License text.

Do not mix product identity or proprietary D&D Beyond/Wizards text into this file. Keep OGL/SRD notice text intact and audit the source before public redistribution.

## Map icons and generated/curated images

- Local files:
  - `assets/map-icons/*.png`
  - `assets/battlemap_forest.png`
  - `assets/battlemap_lava.png`
  - `assets/fantasy_bg.jpg`
  - `assets/parchment-title.png`
  - `assets/campfire_stamp.png`
  - `assets/dnd_dragon_token.png`
  - `assets/dnd_treasure_chest.png`

These assets need final source/license verification before public or commercial redistribution. They are acceptable for private/local testing in the current project context, but should be replaced, documented, or removed before a public release.

## Local-only downloaded assets

- Folder:
  - `local-assets/`

This folder is intentionally ignored by git. It may contain downloaded zips or reference material without clear redistribution rights.
