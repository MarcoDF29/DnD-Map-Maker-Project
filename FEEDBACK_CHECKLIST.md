# Feedback Checklist For Santi

Goal: test MapForge as a GM, not as a developer. Focus on what feels useful, confusing, slow, or missing during an actual D&D prep/play flow.

## Setup

```bash
git clone https://github.com/MarcoDF29/DnD-Map-Maker-Project.git
cd DnD-Map-Maker-Project
python -m http.server 8099
```

Open:

```text
http://localhost:8099
```

## First Impression

- Does the interface feel clear enough on first load?
- Is the map/canvas visually prominent enough?
- Are the side panels too dense, too wide, or comfortable?
- Do the labels make sense in Spanish for a GM?

## Map Creation

- Load at least two templates.
- Try square grid, hex grid, and region mode.
- Paint terrain.
- Draw walls.
- Place map icons/symbols/props.
- Try the Dyson style toggle.

Questions:

- What took too many clicks?
- What was hard to discover?
- Which tools should be grouped differently?

## Assets

- Open `Objetos`.
- Test the `DL` DawnLike tab.
- Place humanoids, monsters, items, weapons, potions, and props.
- Try HD stamps if visible.
- Try importing a `.zip` pack only with assets you are allowed to use locally.

Questions:

- Is the picker fast enough?
- Do we need search/filter/favorites urgently?
- Which asset categories are missing?

## Play Mode

- Place hero and enemy tokens.
- Move tokens around.
- Toggle GM/player view.
- Try fog of war.
- Roll dice.
- Add entries to initiative.

Questions:

- Does it feel useful at the table?
- Is fog/vision understandable?
- Does initiative need to be more connected to tokens?

## Saving And Export

- Save JSON.
- Reload JSON.
- Export PNG.
- Save/load from local library.

Questions:

- Did anything fail or disappear?
- Is the exported map good enough to share?
- What should export include next: walls, fog, notes, tokens, lights?

## Bugs To Report

For each issue, capture:

- What you clicked.
- What you expected.
- What happened.
- Browser used.
- Screenshot if useful.
- JSON file if it only happens after loading a map.

## Priority Vote

Pick the top 3:

- Better asset search.
- Better fog/vision.
- Better map generators.
- Better UI organization.
- Foundry/Owlbear/Roll20 export.
- More HD assets.
- Better token/initiative combat mode.
- More templates/scenarios.
