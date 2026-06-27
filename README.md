# DnD Map Maker Project

MapForge is a local browser-based D&D map maker first, with lightweight VTT experiments around tokens, fog of war, dice, and GM/player views. The main goal is to help a GM build good-looking maps from HD backgrounds, modular tiles, props, overlays, and local asset packs.

This is a personal/local project for tabletop sessions with friends. Treat the current version as an active prototype.

## Quick Start

```bash
git clone https://github.com/MarcoDF29/DnD-Map-Maker-Project.git
cd DnD-Map-Maker-Project
python -m http.server 8099
```

Open:

```text
http://localhost:8099
```

Any static server works. The app is vanilla HTML/CSS/JS, so there is no npm install step.

## Current Highlights

- Square, hex, and region map modes.
- Built-in templates for dungeons, forests, caves, taverns, ruins, and regional exploration.
- Local HD ready-to-play templates for selected downloaded frames when `local-assets/` is present.
- Terrain painting, walls, fog of war, ruler, stamps, tokens, and initiative tracker.
- Animated dice roller with an on-map roll overlay.
- GM/player view toggle.
- JSON save/load and PNG export.
- Local map library in the browser.
- Compendium/search panel and simulated DM assistant panel.
- DawnLike sprite picker with 1300+ pixel-art sprites.
- Game-icons, RPG Awesome, Azgaar heraldic symbols, map icons, and local battlemaps.
- Experimental HD asset pack import from `.zip` files using browser IndexedDB.
- Imported HD packs are auto-categorized by folder/name into backgrounds, floors, walls, structures, objects, nature, overlays, and tokens.
- Background assets from imported packs can be used as editable map bases.
- Local/private asset workflow for large packs and downloaded battlemaps that should not be committed to git.
- Experimental VTT-oriented export/import work.

## Suggested Test Flow

1. Load a preset map.
2. Switch between square, hex, and region modes.
3. Paint terrain and draw walls.
4. Open `Objetos` and try the `DL` DawnLike tab.
5. Place tokens, HD stamps, map icons, and symbols.
6. Import a private HD ZIP pack and try the category filters/search.
7. Use a background asset as the map base, then place props/tokens over it.
8. Move, rotate, duplicate, and delete stamps.
9. Try fog of war and GM/player view.
10. Roll dice and confirm the on-map animation.
11. Save JSON, reload it, and export PNG.
12. Try the local library save/load flow.

Use [FEEDBACK_CHECKLIST.md](FEEDBACK_CHECKLIST.md) for a structured review.

## Collaboration Notes

- Main app files: `index.html`, `style.css`, `app.js`.
- Bundled assets live in `assets/`.
- `local-assets/` is intentionally ignored because it may contain downloaded material without clear redistribution rights.
- Keep new third-party assets documented in [THIRD_PARTY_ATTRIBUTIONS.md](THIRD_PARTY_ATTRIBUTIONS.md).
- Do not add a repository-wide license until the bundled third-party asset situation is fully audited.

## Licensing Status

This repository currently bundles assets and code from multiple sources with different licenses. The project is suitable for private/local testing, but it is not ready for commercial redistribution.

Before publishing a public release, review:

- DawnLike CC BY-SA 3.0 share-alike implications.
- Game-icons.net CC BY 3.0 attribution.
- Azgaar heraldic SVG metadata, including some CC BY-NC-SA/GFDL sources.
- OGL/SRD content inside `assets/monsters.json`.
- Any generated or downloaded HD image assets.

See [THIRD_PARTY_ATTRIBUTIONS.md](THIRD_PARTY_ATTRIBUTIONS.md) for current notes.

## Research And Roadmap

- [research-mapforge-opportunities.md](research-mapforge-opportunities.md): open-source/VTT research notes.
- [MAP_MAKER_STRATEGY.md](MAP_MAKER_STRATEGY.md): product direction for Santi's map-maker-first workflow.
- [ROADMAP.md](ROADMAP.md): practical next steps.
- [open-source-integration.md](open-source-integration.md): earlier source review notes.
