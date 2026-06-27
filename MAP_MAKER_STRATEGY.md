# MapForge Map-Maker Strategy

Fecha: 2026-06-27

## Enfoque

MapForge debe priorizar la creacion de mapas de calidad para D&D antes que convertirse en un VTT completo. La herramienta tiene que ayudar a Santi a componer escenas rapido: elegir una base HD, alinear la grilla, pintar pisos/muros, colocar props, decorar con overlays, exportar una imagen limpia y guardar el proyecto para editarlo despues.

La parte de tokens, iniciativa, dados y modo jugador suma valor, pero no debe dominar el producto. El canvas y la biblioteca de assets tienen que ser el centro.

## Lo que vimos en los assets

### Frames descargados

Los `Frame 239`, `Frame 241`, `Frame 242`, `Frame 243`, `Frame 244`, `Frame 261` y `Frame 262` son buenos como mapas base o referencias visuales:

- Ciudad nevada / canal.
- Distrito nevado.
- Caverna o campo helado.
- Puerto o villa junto al lago.
- Puesto invernal.
- Pueblo verde / villa de verano.

Estos archivos son pesados y no tienen licencia clara, asi que deben quedarse como `local-assets/` o como pack privado importado por el usuario.

### Google Drive compartido

La carpeta de Drive contiene material muy util para la direccion "map maker":

- `Mapping-Pack`: prioridad maxima. Incluye pisos, muros, crypt, sewers, estructuras, objetos, plantas, overlays, interiores, isometricos, armas, tesoros y herramientas.
- `wall&floor complete`: tiles de piso y muro por color/material. Ideal para brocha de tiles y construccion modular.
- `Tileset - Crypt`: paredes interiores/exteriores, objetos de cripta y overlay de grilla.
- `Sewers`: piezas de tuberias y alcantarillas.
- `Objects`: props decorativos por subcarpeta, por ejemplo campfires, crates, barrels, library, bones, chains, treasure, lab, machinery.
- `Token`, `Tokens`, `Token_Bundle_01`, `Token_Bundle_02`: utiles, pero secundarios para el objetivo actual.

Conclusion: necesitamos un sistema de bundles/categorias serio. Importar ZIP como "Packs HD" es un buen comienzo, pero falta convertirlo en biblioteca navegable y herramienta de construccion.

## Politica de assets

No conviene subir todos los assets HD al repo de GitHub hasta auditar licencias y tamanos. Aunque el uso sea privado/local, el repositorio remoto puede terminar redistribuyendo material de terceros.

Regla practica:

- El codigo, docs y assets con licencia clara van al repo.
- Packs privados, zips descargados y frames grandes van en `local-assets/` o se importan con la UI.
- Cada fuente nueva debe quedar anotada en `THIRD_PARTY_ATTRIBUTIONS.md`.
- Cuando un pack no tenga licencia clara, MapForge debe tratarlo como "Bring Your Own Assets".

## Biblioteca ideal de assets

La biblioteca deberia organizar los packs asi:

- Backgrounds: mapas base, frames, battlemaps completos.
- Floors: tiles de suelo, caminos, agua, nieve, lava, madera, piedra.
- Walls: muros, puertas, ventanas, rejas, bordes, columnas.
- Structures: casas, ruinas, puentes, torres, escaleras, techos.
- Interior: mesas, camas, alfombras, estanterias, fogones, decoracion.
- Objects: props sueltos, cofres, barriles, cajas, cadenas, huesos, mecanismos.
- Nature: arboles, arbustos, rocas, plantas, raices.
- Overlays: sombras, luz, humo, sangre, magia, grid, clima.
- Tokens: criaturas, NPCs, heroes, esqueletos, monstruos.
- Symbols: iconos de mapa regional, heraldica, marcadores.

Cada asset deberia tener:

- `packId`
- `name`
- `category`
- `subcategory`
- `tags`
- `sourcePath`
- `width`
- `height`
- `defaultScale`
- `defaultLayer`
- `licenseStatus`

## Flujos principales

### Crear mapa desde frame HD

1. Importar o seleccionar frame.
2. Ajustar escala, recorte y posicion.
3. Alinear grilla con dos puntos o con controles de offset/tamano.
4. Bloquear background.
5. Decorar con props, overlays y tokens.
6. Exportar PNG/WebP con o sin grilla.

### Crear mapa modular desde tiles

1. Elegir tileset: crypt, sewers, stone, forest, snow, etc.
2. Pintar floors con brocha cuadrada.
3. Dibujar walls con brocha de linea o piezas conectables.
4. Colocar puertas, columnas y estructuras.
5. Decorar con props y overlays.
6. Guardar proyecto JSON y exportar imagen.

### Preparar escena para jugar

1. Agregar tokens importantes.
2. Marcar fog opcional.
3. Guardar version GM.
4. Exportar version player sin notas secretas.

## Prioridad de implementacion

### P0 - Ordenar assets para trabajar ya

- Mantener `local-assets/` fuera de git.
- Documentar la carpeta Drive como fuente local/private.
- Permitir importar ZIPs HD desde la UI. Hecho.
- Mostrar packs importados con categorias y thumbnails. Hecho inicial.
- Agregar busqueda por nombre/carpeta. Hecho inicial.
- Permitir usar un asset de fondo importado como mapa base HD. Hecho inicial.

### P1 - Herramientas reales de mapa

- Background HD con transform: mover, escalar, rotar, bloquear.
- Grid aligner: tamano de celda, offset X/Y, opacidad, color, modo square/hex.
- Tile brush para floors.
- Wall brush para muros rectos y piezas modulares.
- Eraser por capa.
- Capas: background, floors, walls, props, overlays, tokens, fog, notes.

### P2 - Calidad de composicion

- Favoritos y recientes.
- Variaciones aleatorias del mismo tile/prop.
- Rotacion aleatoria opcional para props.
- Snap por celda, medio paso y libre.
- Controles rapidos: duplicar, traer al frente, enviar atras, bloquear.
- Sombras/siluetas suaves para integrar props con fondos HD.

### P3 - Exportacion util

- Export PNG/WebP en resolucion original.
- Export con/sin grilla.
- Export solo player view.
- Export paquete `.mapforge.zip`: JSON + assets locales usados.
- Investigar export UVTT cuando walls/lights esten maduros.

## Cambios de UX recomendados

- Separar la izquierda en modos: Build, Assets, Layers, Play.
- Hacer que `Assets` sea una biblioteca potente con tabs por categoria.
- Reducir protagonismo de IA/compendio en la primera pantalla; dejarlo como panel secundario.
- Reemplazar emojis por iconos consistentes.
- Dar al usuario thumbnails grandes y filtros rapidos.
- Crear un boton principal "Importar pack" y otro "Usar mapa base".

## Decision tecnica recomendada

Seguir con vanilla HTML/CSS/JS por ahora, porque el prototipo ya funciona y se puede probar localmente sin build. Si las capas, drag/resize y transform empiezan a doler, evaluar Konva.js antes de migrar toda la app a React/Svelte.

La mejora de codigo actual convierte los assets importados en una biblioteca categorizada por carpetas, con busqueda y seleccion por subcarpeta. La proxima mejora de mayor impacto es agregar `Tile Brush` para que los packs de `wall&floor complete`, `Tileset - Crypt` y `Sewers` sean realmente utiles para construir mapas modulares, no solo para colocar imagenes sueltas.

## Checklist para Santi

- Puede importar un ZIP grande sin romper la app?
- Puede encontrar rapido pisos, muros, objetos y overlays?
- Puede usar un frame HD como base y ajustar grilla sin frustrarse?
- Puede construir una habitacion completa con floors/walls/props?
- Puede exportar una imagen lista para mostrar a jugadores?
- Puede guardar el proyecto y retomarlo despues?

Si estas respuestas empiezan a ser "si", MapForge ya esta funcionando como map maker.
