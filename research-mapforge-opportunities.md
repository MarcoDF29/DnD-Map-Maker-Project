# D&D MapForge - investigacion de mejoras

Fecha: 2026-06-27

## Objetivo

Revisar repositorios open source, plataformas VTT/map maker y documentacion publica para identificar mejoras posibles para D&D MapForge.

## Repos open source utiles

### Alta prioridad para reutilizar o estudiar

- Azgaar Fantasy Map Generator
  - Uso: generacion de mapas regionales/overworld, biomas, politicas, rutas, iconografia y exportaciones.
  - Licencia: MIT.
  - Fuente: https://github.com/Azgaar/Fantasy-Map-Generator

- Mipui
  - Uso: editor colaborativo web de mapas grid-based; buen modelo para mapas rapidos, almacenamiento simple y UX minimalista.
  - Licencia: MIT.
  - Fuente: https://github.com/amishne/mipui
  - Developer guide: https://www.mipui.net/docs/developer_guide.html

- PlanarAlly
  - Uso: VTT self-hosted/offline con vision, luces y herramientas de inmersion.
  - Fuente: https://github.com/Kruptein/planarally
  - Docs: https://www.planarally.io/

- Auto-Wall
  - Uso: deteccion automatica de muros en battlemaps y exportacion VTT/UVTT.
  - Licencia: MIT.
  - Fuente: https://github.com/ThreeHats/auto-wall

- Universal Battlemap Importer / FVTT-DD-Import
  - Uso: referencia para formato Universal VTT, importacion de paredes, puertas y luces.
  - Licencia: MIT.
  - Fuente: https://github.com/moo-man/FVTT-DD-Import

- Dungeon Scrawl Importer
  - Uso: interpretar archivos `.ds` de Dungeon Scrawl y convertirlos en paredes/luces en Foundry.
  - Licencia: MIT.
  - Fuente: https://github.com/kid2407/DungeonScrawlImporter

- rot.js
  - Uso: generadores de mazmorras, FOV, pathfinding, RNG y utilidades roguelike.
  - Licencia: BSD-3-Clause.
  - Fuente: https://github.com/ondras/rot.js/

- visibility-polygon-js
  - Uso: vision real por segmentos para fog/line-of-sight.
  - Licencia: public domain.
  - Fuente: https://github.com/byronknoll/visibility-polygon-js

- Tiled
  - Uso: formato y UX de editor de tiles/layers/object layers; posible import/export JSON/TMX.
  - Fuente: https://github.com/mapeditor/tiled
  - Web: https://www.mapeditor.org/

- Konva.js
  - Uso: si se migra a canvas por objetos/layers con drag, transform, cache, export y eventos.
  - Licencia: MIT.
  - Fuente: https://konvajs.org/docs/about.html

### Repos/plataformas interesantes pero con cautela de licencia

- MapTool
  - Uso: VTT maduro para estudiar macros, tokens, fog, campaign file model y recursos.
  - Licencia: AGPL-3.0; mejor estudiar patrones, no copiar codigo sin aceptar implicaciones.
  - Fuente: https://github.com/RPTools/maptool

- Watabou Medieval Fantasy City Generator
  - Uso: generacion de ciudades, distritos, murallas y exportacion visual.
  - Licencia: GPL-3.0; estudiar ideas/algoritmos, cuidado con integrar codigo.
  - Fuente: https://github.com/watabou/TownGeneratorOS

- Donjon Random Dungeon Generator
  - Uso: referencia clasica de parametros de generacion.
  - Fuente/codigo simplificado: https://donjon.bin.sh/code/dungeon/
  - Nota: revisar terminos concretos antes de incorporar codigo.

## Plataformas y funciones inspiradoras

- Dungeon Scrawl
  - Ideas: dibujo rapidisimo, estilos/presets, export PNG/WebP/PDF, conexion directa con Roll20, workflow de improvisacion.
  - Fuentes:
    - https://www.dungeonscrawl.com/
    - https://help.roll20.net/hc/en-us/articles/16979743281943-What-is-Dungeon-Scrawl
    - https://help.roll20.net/hc/en-us/articles/29069123512471-Connect-to-Roll20

- Owlbear Rodeo
  - Ideas: simplicidad, escenas, biblioteca de mapas reutilizables, fog manual por ejemplos, extension de dynamic fog/trailing fog.
  - Fuentes:
    - https://docs.owlbear.rodeo/docs/getting-started/
    - https://docs.owlbear.rodeo/docs/fog/
    - https://docs.owlbear.rodeo/docs/scenes/
    - https://extensions.owlbear.rodeo/smoke

- Foundry VTT
  - Ideas: walls layer, tipos de muro, vision, luces, oscuridad, escena como contenedor de config.
  - Fuentes:
    - https://foundryvtt.com/article/walls/
    - https://foundryvtt.com/article/lighting/
    - https://foundryvtt.com/article/scenes/

- D&D Beyond Maps
  - Ideas: fog con Cover All/Reveal All, pincel/erase/brush shape/size; encuentros auto-populados desde tokens y tracking de iniciativa.
  - Fuentes:
    - https://dndbeyond-support.wizards.com/hc/en-us/articles/46385202659732-Fog-of-War
    - https://dndbeyond-support.wizards.com/hc/en-us/articles/46385529638164-Combat-Encounters-on-Maps

- Fantasy Grounds Unity
  - Ideas: imagen como workspace con capas, paint mode, tiles, stamps, line-of-sight por layer, XML metadata junto a imagen.
  - Fuentes:
    - https://fantasygroundsunity.atlassian.net/wiki/spaces/FGCP/pages/996640166/Working+with+Images+as+the+GM
    - https://fantasygroundsunity.atlassian.net/wiki/spaces/FGCP/pages/996645681/Module+-+Image+Line+of+Sight+Data
    - https://fantasygroundsunity.atlassian.net/wiki/spaces/FGCP/pages/996645724/Making+an+Asset+Pack+Tiles+Symbols+Brushes+Decorations

- Dungeondraft / DungeonFog / UVTT ecosystem
  - Ideas: exportar `Universal VTT` con imagen + muros + puertas + luces, para no redibujar paredes en cada VTT.
  - Fuentes:
    - https://dungeondraft.net/
    - https://dungeondraft-encyclopaedia.gitbook.io/guide/final-steps/exporting-your-map/universal-vtt
    - https://www.dungeonfog.com/news/campaigns-update/

- Inkarnate
  - Ideas: scene stamps reutilizables, custom assets, art manager, capas/presets; inspiracion de UX de asset library.
  - Fuentes:
    - https://inkarnate.com/updates
    - https://inkarnate.com/faq

## Assets e iconografia

- Game-icons.net
  - +4000 iconos de juego/fantasia.
  - Licencia: CC-BY o public domain segun icono; requiere atribucion cuando aplique.
  - Fuente: https://game-icons.net/faq.html

- RPG Awesome
  - Icon font fantasia/RPG, aprox. 495 iconos.
  - Licencia repo: BSD-2-Clause.
  - Fuente: https://github.com/nagoshiashumari/Rpg-Awesome

- OpenGameArt
  - Tilesets dungeon, props, monstruos, etc. Licencias mixtas: filtrar por CC0 o CC-BY y generar atribuciones.
  - Fuentes:
    - https://opengameart.org/content/dungeon-tileset
    - https://opengameart.org/content/dungeon-crawl-32x32-tiles
    - https://opengameart.org/content/cc0-tiles-tilesets

- Kenney
  - Assets UI, iconos, cartografia, packs limpios para prototipar.
  - Fuente: https://kenney.nl/

## Mejoras candidatas para MapForge

### Corto plazo

1. Sustituir emojis por iconos consistentes: RPG Awesome o Game-icons.net.
2. Crear biblioteca local de assets con tags, favoritos y busqueda.
3. Mejorar fog manual: pincel cuadrado/circular, borrar/revelar, opacidad GM.
4. Crear presets de escena reutilizables al estilo "Scene Stamps".
5. Exportar/importar un formato propio versionado con capas, muros, tokens, luces y notas.

### Medio plazo

1. Line-of-sight real con `visibility-polygon-js`.
2. Puertas, ventanas, muros secretos y terreno bloqueante.
3. Generador de mazmorras con rot.js o algoritmo propio inspirado en BSP/drunkard walk/cellular automata.
4. Export/import Universal VTT (`.dd2vtt`/UVTT-like) para interoperar con Foundry, Dungeondraft, DungeonFog, etc.
5. Deteccion asistida de muros a partir de imagen usando Auto-Wall como referencia.

### Largo plazo

1. Motor de capas serio: fondo, terreno, paredes, objetos, tokens, fog, luces, anotaciones.
2. Migracion a Konva.js si el canvas actual empieza a ser dificil de mantener.
3. Modo "GM play": iniciativa, condiciones, vision de jugador, encuentros, notas y compendio conectados a tokens.
4. Generadores por tipo: region, ciudad, dungeon, cueva, bosque, taberna, ruinas.
5. Sistema de plugins/local packs: assets, generadores, estilos visuales y exportadores.

## Direccion visual sugerida

Evitar una UI generica medieval con demasiados pergaminos. Mejor: "mesa de cartografo arcana moderna".

- Base: oscuro, metal/pizarra, dorado controlado.
- Iconografia: SVG uniforme en vez de emoji.
- Texturas: mapas, sellos, tinta, grid tenue; no sobrecargar paneles.
- Flujo de UX: separar "Construir mapa", "Dirigir partida", "Biblioteca" y "Exportar".
- Herramientas de diseno: Figma para wireframes; Game-icons/RPG Awesome para iconos; Kenney/OpenGameArt para assets iniciales; Konva si se reestructura el editor.

## Nota sobre PDFs

No aparecieron PDFs claramente superiores a las guias oficiales. La documentacion mas util esta en HTML con capturas y ejemplos vivos, sobre todo Fantasy Grounds, Foundry, Owlbear Rodeo, Roll20/Dungeon Scrawl y D&D Beyond Maps.
