// D&D MAPFORGE - ENGINE & STATE V2
document.addEventListener("DOMContentLoaded", () => {
    // --- DOM ELEMENTS ---
    const canvas = document.getElementById("mapCanvas");
    const ctx = canvas.getContext("2d");
    const viewport = document.getElementById("canvasViewport");
    
    const btnUndo = document.getElementById("btnUndo");
    const btnRedo = document.getElementById("btnRedo");
    const zoomDisplay = document.getElementById("zoomDisplay");
    const btnZoomIn = document.getElementById("btnZoomIn");
    const btnZoomOut = document.getElementById("btnZoomOut");
    const btnZoomReset = document.getElementById("btnZoomReset");
    
    const fileInput = document.getElementById("fileInput");
    const btnSaveJson = document.getElementById("btnSaveJson");
    const btnExportPng = document.getElementById("btnExportPng");
    const btnClearMap = document.getElementById("btnClearMap");
    
    const toolBtns = document.querySelectorAll(".tool-btn");
    const optionGroups = document.querySelectorAll(".options-group");
    
    // Header VTT tools
    const mapTemplateSelect = document.getElementById("mapTemplate");
    const mapModeSelect = document.getElementById("mapMode");
    
    // Terrain tools
    const terrainOptions = document.querySelectorAll(".terrain-option");
    const btnBrushPaint = document.getElementById("btnBrushPaint");
    const btnBrushFill = document.getElementById("btnBrushFill");
    
    // Wall tools
    const wallWidthInput = document.getElementById("wallWidth");
    const wallWidthVal = document.getElementById("wallWidthVal");
    const wallColorInput = document.getElementById("wallColor");
    
    // Stamp tools
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const stampItems = document.querySelectorAll(".stamp-item");
    const stampEditControls = document.getElementById("stampEditControls");
    const stampSizeInput = document.getElementById("stampSize");
    const stampSizeVal = document.getElementById("stampSizeVal");
    const stampRotationInput = document.getElementById("stampRotation");
    const stampRotationVal = document.getElementById("stampRotationVal");
    const btnDeleteStamp = document.getElementById("btnDeleteStamp");
    const btnDuplicateStamp = document.getElementById("btnDuplicateStamp");
    
    // Token / D&D options
    const tokenTypeSelect = document.getElementById("tokenType");
    const visionRadiusSetting = document.getElementById("visionRadiusSetting");
    const tokenVisionInput = document.getElementById("tokenVision");
    const tokenVisionVal = document.getElementById("tokenVisionVal");
    
    // Fog tools
    const btnFogAdd = document.getElementById("btnFogAdd");
    const btnFogRemove = document.getElementById("btnFogRemove");
    const btnFogAll = document.getElementById("btnFogAll");
    const btnFogClear = document.getElementById("btnFogClear");
    const chkDynamicFog = document.getElementById("chkDynamicFog");
    
    // Grid settings
    const gridColsInput = document.getElementById("gridCols");
    const gridRowsInput = document.getElementById("gridRows");
    const btnApplyGridSize = document.getElementById("btnApplyGridSize");
    const chkShowGrid = document.getElementById("chkShowGrid");
    
    // Help Modal
    const btnOpenHelp = document.getElementById("btnOpenHelp");
    const helpModal = document.getElementById("helpModal");
    const btnCloseHelp = document.getElementById("btnCloseHelp");
    const btnCloseHelpOk = document.getElementById("btnCloseHelpOk");
    
    // Dice Roller
    const diceBtns = document.querySelectorAll(".dice-btn");
    const diceConsole = document.getElementById("diceConsole");
    let diceOverlayCleanupTimer = null;

    // New DOM elements for D&D additions
    const viewModeSelect = document.getElementById("viewMode");
    const tokenNameInput = document.getElementById("tokenName");
    const tokenIsSecretChk = document.getElementById("tokenIsSecret");
    const tokenHpCurrentInput = document.getElementById("tokenHpCurrent");
    const tokenHpMaxInput = document.getElementById("tokenHpMax");
    const conditionChks = document.querySelectorAll(".condition-chk");
    const btnAddToInitiative = document.getElementById("btnAddToInitiative");
    
    const btnInitNext = document.getElementById("btnInitNext");
    const btnInitClear = document.getElementById("btnInitClear");
    const initiativeList = document.getElementById("initiativeList");
    const initAddName = document.getElementById("initAddName");
    const initAddValue = document.getElementById("initAddValue");
    const btnInitAdd = document.getElementById("btnInitAdd");

    const travelScaleValueInput = document.getElementById("travelScaleValue");
    const travelScaleUnitSelect = document.getElementById("travelScaleUnit");
    const travelMethodSelect = document.getElementById("travelMethodSelect");
    const tokenDescriptionInput = document.getElementById("tokenDescription");
    const tokenShowDescToPlayersChk = document.getElementById("tokenShowDescToPlayers");

    // --- APPLICATION STATE ---
    let state = {
        cols: 25,
        rows: 20,
        cellSize: 60,
        terrain: [],  // cols * rows
        walls: [],    // {x1, y1, x2, y2, width, color}
        stamps: [],   // {id, emoji, x, y, size, rotation, isToken, isHero, visionRadius, name, hpCurrent, hpMax, conditions, isSecret, image}
        fog: [],      // cols * rows (booleans)
        initiative: [], // {id, name, value}
        bgImage: "",
        bgScale: 1.0,
        bgX: 0,
        bgY: 0,
        bgOpacity: 0.8,
        showBg: false,
        weather: "",
        travelScaleValue: 10,
        travelScaleUnit: "millas",
        travelMethod: "foot"
    };

    const bgTemplates = {
        forest: { src: "assets/battlemap_forest.png", scale: 1, x: 0, y: 0 },
        lava: { src: "assets/battlemap_lava.png", scale: 1, x: 0, y: 0 },
        "local-winter-camp": { src: "local-assets/dnd-assets-main/winter camp.jpg", scale: 0.62, x: 0, y: 0 },
        "local-night-roofs-1": { src: "local-assets/dnd-assets-main/VTT GRIDDED NIGHT ROOFS Village on Lake 1.jpg", scale: 0.44, x: 0, y: 0 },
        "local-night-roofs-2": { src: "local-assets/dnd-assets-main/VTT GRIDDED NIGHT ROOFS Village on Lake 2.jpg", scale: 0.44, x: 0, y: 0 },
        "local-city-snow": { src: "local-assets/dnd-assets-main/Frame 239.jpg", scale: 0.36, x: 0, y: 0 },
        "local-lake-village": { src: "local-assets/dnd-assets-main/Frame 243.jpg", scale: 0.46, x: 0, y: 0 },
        "local-icy-cavern": { src: "local-assets/dnd-assets-main/Frame 242.jpg", scale: 0.48, x: 0, y: 0 },
        "local-village-blocks": { src: "local-assets/dnd-assets-main/Frame 261.jpg", scale: 0.5, x: 0, y: 0 },
        "local-sketch": { src: "local-assets/dnd-assets-main/sketch.jpg", scale: 0.72, x: 0, y: 0 },
        "fantasy_bg":          { src: "assets/fantasy_bg.jpg", scale: 0.6, x: 0, y: 0 },
        "local-snowy-city":    { src: "local-assets/dnd-assets-main/Frame 241.jpg", scale: 0.44, x: 0, y: 0 },
        "local-winter-outpost":{ src: "local-assets/dnd-assets-main/Frame 244.jpg", scale: 0.44, x: 0, y: 0 },
        "local-summer-town":   { src: "local-assets/dnd-assets-main/Frame 262.jpg", scale: 0.50, x: 0, y: 0 }
    };

    let activeInitIdx = 0;

    let activeTool = "pan";
    let activeTerrain = "stone";
    let terrainPaintMode = "paint"; // paint, fill
    let brushRadius = 0; // 0 = single cell, 1/2/3 = radius in cells
    let dysonMode = false; // Dyson Logos B&W classic cartography style
    let activeStamp = null;
    let activeStampImage = null;
    let activeStampName = "";
    let activeStampDescription = "";
    let selectedStampId = null;
    let activeFogMode = "add"; // add, remove

    // Navigation / Camera
    let zoom = 1.0;
    let panX = 0;
    let panY = 0;
    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let panClickStart = null; // tracks mousedown position to distinguish click vs drag
    
    // Interaction drawing states
    let isDrawing = false;
    let wallStart = null;
    let rulerStart = null;
    let mouseGridPos = {x: 0, y: 0};
    let mouseCellPos = {col: 0, row: 0};
    let draggedStamp = null;

    // Undo/Redo
    let undoStack = [];
    let redoStack = [];

    // --- TEMPLATE DATA ---
    const charMap = { s: 'stone', d: 'wood', g: 'grass', w: 'water', l: 'lava', a: 'abyss' };
    
    function decodeTerrain(str, cols, rows, terrainMap = charMap) {
        const decoded = Array(cols * rows).fill("stone");
        const chars = str.replace(/\s+/g, ''); // remove newlines/whitespace
        for (let i = 0; i < Math.min(chars.length, cols * rows); i++) {
            decoded[i] = terrainMap[chars[i]] || 'stone';
        }
        return decoded;
    }

    const mapTemplates = {
        dungeon: {
            cols: 25,
            rows: 20,
            terrainStr: `
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
                ssaassssssssssssssssssass
                ssaassssssssssssssssssass
                ssssssssssdddddssssssssss
                ssssssssssdddddssssssssss
                ssssssssssdddddssssssssss
                ssssssssssssddsssssssssss
                ssssssssssssddsssssssssss
                ssssssssssssddsssssssssss
                ssssssssssdddddddssssssss
                ssssssssssdddddddssssssss
                ssssssssssdddddddssssssss
                sssssssssssssssssssssssss
                sssssssswswsssssswswsssss
                sssssssswwsssssswwssssss
                sssssssswswsssssswswsssss
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
            `,
            walls: [
                // Outer boundaries
                {x1: 1, y1: 1, x2: 24, y2: 1, width: 8, color: "#1c1c1f"},
                {x1: 24, y1: 1, x2: 24, y2: 19, width: 8, color: "#1c1c1f"},
                {x1: 24, y1: 19, x2: 1, y2: 19, width: 8, color: "#1c1c1f"},
                {x1: 1, y1: 19, x2: 1, y2: 1, width: 8, color: "#1c1c1f"},
                // Main room division
                {x1: 9, y1: 3, x2: 9, y2: 8, width: 8, color: "#1c1c1f"},
                {x1: 9, y1: 8, x2: 15, y2: 8, width: 8, color: "#1c1c1f"},
                {x1: 15, y1: 8, x2: 15, y2: 3, width: 8, color: "#1c1c1f"},
                {x1: 15, y1: 3, x2: 9, y2: 3, width: 8, color: "#1c1c1f"},
                // Lower division
                {x1: 9, y1: 10, x2: 9, y2: 14, width: 8, color: "#1c1c1f"},
                {x1: 9, y1: 14, x2: 17, y2: 14, width: 8, color: "#1c1c1f"},
                {x1: 17, y1: 14, x2: 17, y2: 10, width: 8, color: "#1c1c1f"},
                {x1: 17, y1: 10, x2: 9, y2: 10, width: 8, color: "#1c1c1f"}
            ],
            stamps: [
                {id: "d1", emoji: "🧙", x: 4.5, y: 16.5, size: 1.0, rotation: 0, isToken: true, isHero: true, visionRadius: 5, name: "Mago", hpCurrent: 24, hpMax: 24, conditions: []},
                {id: "d2", emoji: "🛡️", x: 5.5, y: 16.5, size: 1.0, rotation: 0, isToken: true, isHero: true, visionRadius: 4, name: "Guerrero", hpCurrent: 36, hpMax: 36, conditions: []},
                {id: "d3", emoji: "🚪", x: 12.0, y: 8.0, size: 1.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "d4", emoji: "🚪", x: 13.0, y: 10.0, size: 1.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "d5", emoji: "📦", x: 12.0, y: 5.5, size: 0.9, rotation: 15, isToken: false, isHero: false, visionRadius: 0},
                {id: "d6", emoji: "💀", x: 13.5, y: 12.5, size: 0.8, rotation: 45, isToken: true, isHero: false, visionRadius: 0, name: "Esqueleto", hpCurrent: 12, hpMax: 12, conditions: []},
                {id: "d7", emoji: "💀", x: 20.5, y: 6.5, size: 0.8, rotation: 180, isToken: true, isHero: false, visionRadius: 0, name: "Esqueleto", hpCurrent: 12, hpMax: 12, conditions: []},
                {id: "d8", emoji: "🏛️", x: 10.5, y: 11.5, size: 1.1, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "d9", emoji: "🏛️", x: 15.5, y: 11.5, size: 1.1, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "d10", emoji: "🕯️", x: 12.0, y: 11.5, size: 0.7, rotation: 0, isToken: false, isHero: false, visionRadius: 0}
            ]
        },
        forest: {
            cols: 25,
            rows: 20,
            terrainStr: `
                gggggggggwwgggggggggggggg
                ggggggggwwggggggggggggggg
                ggggggggwwggggggggggggggg
                gggggggwwgggggggggggggggg
                gggggggwwgggggggggggggggg
                ggggggwwggggggggggggggggg
                ggggggwwggggggggggggggggg
                gggggwwgggggggggggggggggg
                gggggwwgggggggggggggggggg
                gggggwwgggggggggggggggggg
                ggggggwwggggggggggggggggg
                ggggggwwggggggggggggggggg
                gggggggwwgggggggggggggggg
                gggggggwwgggggggggggggggg
                ggggggggwwggggggggggggggg
                ggggggggwwggggggggggggggg
                gggggggggwwgggggggggggggg
                gggggggggwwgggggggggggggg
                ggggggggggwwggggggggggggg
                ggggggggggwwggggggggggggg
            `,
            walls: [
                {x1: 2, y1: 5, x2: 6, y2: 5, width: 6, color: "#8b5a2b"}, // bridge fences
                {x1: 2, y1: 8, x2: 6, y2: 8, width: 6, color: "#8b5a2b"}
            ],
            stamps: [
                {id: "f1", emoji: "🏹", x: 5.5, y: 10.5, size: 1.0, rotation: 0, isToken: true, isHero: true, visionRadius: 6, name: "Arquero", hpCurrent: 20, hpMax: 20, conditions: []},
                {id: "f2", emoji: "🧝", x: 4.5, y: 11.5, size: 1.0, rotation: 0, isToken: true, isHero: true, visionRadius: 5, name: "Elfo", hpCurrent: 18, hpMax: 18, conditions: []},
                {id: "f3", emoji: "🔥", x: 5.0, y: 6.5, size: 1.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "f4", emoji: "🪵", x: 6.5, y: 6.5, size: 0.9, rotation: 90, isToken: false, isHero: false, visionRadius: 0},
                {id: "f5", emoji: "🌳", x: 3.5, y: 3.5, size: 1.5, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "f6", emoji: "🌳", x: 18.5, y: 4.5, size: 1.6, rotation: 25, isToken: false, isHero: false, visionRadius: 0},
                {id: "f7", emoji: "🌳", x: 21.5, y: 15.5, size: 1.4, rotation: 115, isToken: false, isHero: false, visionRadius: 0},
                {id: "f8", emoji: "🌲", x: 15.5, y: 8.5, size: 1.3, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "f9", emoji: "🌲", x: 17.5, y: 12.5, size: 1.3, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "f10", emoji: "👹", x: 19.5, y: 8.5, size: 1.1, rotation: 0, isToken: true, isHero: false, visionRadius: 0, name: "Orco A", hpCurrent: 15, hpMax: 15, conditions: []},
                {id: "f11", emoji: "👹", x: 21.5, y: 9.5, size: 1.1, rotation: 0, isToken: true, isHero: false, visionRadius: 0, name: "Orco B", hpCurrent: 15, hpMax: 15, conditions: []},
                {id: "f12", emoji: "🐺", x: 18.5, y: 10.5, size: 0.9, rotation: -30, isToken: true, isHero: false, visionRadius: 0, name: "Lobo", hpCurrent: 11, hpMax: 11, conditions: []}
            ]
        },
        swamp: {
            cols: 25,
            rows: 20,
            mode: "region",
            travelScaleValue: 6,
            travelScaleUnit: "millas",
            travelMethod: "foot",
            terrainMap: { g: "swamp", w: "ocean", a: "hills" },
            terrainStr: `
                ggggwggggggggggggggwggggg
                ggwwwwwgggggggggwwwwwwggg
                gwwawwwggggggggwwawaawwgg
                gwwawwwggggggggwwawaawwgg
                ggwwwwwgggggggggwwwwwwggg
                ggggwggggggggggggggwggggg
                ggggggggggggggggggggggggg
                gggggggaaaggggggggggggggg
                gggggggaaaggggggggggggggg
                gggggggaaaggggggggggggggg
                ggggggggggggggggggggggggg
                gwwwwwggggggggggggwwwwwgg
                wwawwwggggggggggggwwawwwg
                wwawwwggggggggggggwwawwwg
                gwwwwwggggggggggggwwwwwgg
                ggggggggggggggggggggggggg
                ggggggggggggggggggggggggg
                ggggggggggggggggggggggggg
                ggggggggggggggggggggggggg
                ggggggggggggggggggggggggg
            `,
            walls: [],
            stamps: [
                {id: "s1", emoji: "🧙", x: 12.5, y: 16.5, size: 1.0, rotation: 0, isToken: true, isHero: true, visionRadius: 5, name: "Druida", hpCurrent: 22, hpMax: 22, conditions: []},
                {id: "s2", emoji: "🧟", x: 4.5, y: 3.5, size: 1.0, rotation: 0, isToken: true, isHero: false, visionRadius: 0, name: "Zombi", hpCurrent: 22, hpMax: 22, conditions: []},
                {id: "s3", emoji: "🧟", x: 21.5, y: 3.5, size: 1.0, rotation: 0, isToken: true, isHero: false, visionRadius: 0, name: "Zombi", hpCurrent: 22, hpMax: 22, conditions: []},
                {id: "s4", emoji: "🧟", x: 12.5, y: 8.5, size: 1.0, rotation: 0, isToken: true, isHero: false, visionRadius: 0, name: "Zombi", hpCurrent: 22, hpMax: 22, conditions: []},
                {id: "s5", emoji: "🏚️", x: 12.5, y: 3.5, size: 2.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "s6", emoji: "🪨", x: 8.5, y: 8.5, size: 1.2, rotation: 45, isToken: false, isHero: false, visionRadius: 0},
                {id: "s7", emoji: "🪨", x: 16.5, y: 8.5, size: 1.2, rotation: 270, isToken: false, isHero: false, visionRadius: 0},
                {id: "s8", emoji: "💀", x: 12.5, y: 5.5, size: 0.8, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "s9", emoji: "🐉", x: 12.5, y: 2.5, size: 1.8, rotation: 180, isToken: true, isHero: false, visionRadius: 0, name: "Dragón del Pantano", hpCurrent: 90, hpMax: 90, conditions: []}
            ]
        },
        overworld: {
            cols: 30,
            rows: 20,
            mode: "region",
            travelScaleValue: 12,
            travelScaleUnit: "millas",
            travelMethod: "foot",
            terrainMap: { g: "plains", w: "ocean" },
            terrainStr: `
                ggggggggggggggggggggggwwwwwwww
                ggggggggggggggggggggwwwwwwwwww
                ggggggggggggggggggwwwwwwwwwwww
                gggggggggggggggggwwwwwwwwwwwww
                ggggggggggggggggwwwwwwwwwwwwww
                ggggggggggggggwwwwwwwwwwwwwwww
                ggggggggggggwwwwwwwwwwwwwwwwww
                gggggggggggwwwwwwwwwwwwwwwwwww
                ggggggggggwwwwwwwwwwwwwwwwwwww
                gggggggggwwwwwwwwwwwwwwwwwwwww
                ggggggggwwwwwwwwwwwwwwwwwwwwww
                gggggggwwwwwwwwwwwwwwwwwwwwwww
                ggggggwwwwwwwwwwwwwwwwwwwwwwww
                ggggggggwwwwwwwwwwwwwwwwwwwwww
                gggggggggwwwwwwwwwwwwwwwwwwwww
                ggggggggggwwwwwwwwwwwwwwwwwwww
                gggggggggggwwwwwwwwwwwwwwwwwww
                ggggggggggggwwwwwwwwwwwwwwwwww
                gggggggggggggwwwwwwwwwwwwwwwww
                ggggggggggggggwwwwwwwwwwwwwwww
            `,
            walls: [],
            stamps: [
                {id: "o1", emoji: "🏰", x: 6.5, y: 5.5, size: 1.6, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Valdheim", description: "Ciudad amurallada que custodia el paso norte. Sus torres gemelas son visibles desde tres días de marcha. El Lord-Comandante cobra peaje a todo viajero armado.", showDescToPlayers: true},
                {id: "o2", emoji: "🛖", x: 13.5, y: 11.5, size: 1.1, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Aldea de Brome", description: "Una docena de casas, un herrero que trabaja de noche y una posada con buena cerveza. Los aldeanos evitan mencionar el bosque del este.", showDescToPlayers: true},
                {id: "o3", emoji: "🛖", x: 5.5, y: 14.5, size: 1.1, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Puesto del Ancla", description: "Comunidad de pescadores sin nombre oficial. Desconfían de los forasteros pero venden pescado salado a buen precio.", showDescToPlayers: true},
                {id: "o4", emoji: "🏚️", x: 12.5, y: 3.5, size: 1.2, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Ruinas de Eldoria Vieja", description: "Piedras calcinadas de una ciudad destruida hace dos siglos. Se dice que hay una cámara sellada bajo los escombros con el tesoro del último alcalde.", showDescToPlayers: true, isSecret: false},
                {id: "o5", emoji: "⛰️", x: 2.5, y: 2.5, size: 1.5, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "o6", emoji: "⛰️", x: 4.0, y: 2.5, size: 1.5, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "o7", emoji: "⛰️", x: 3.0, y: 4.0, size: 1.5, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Paso de las Cimas Grises", description: "El único paso transitable en invierno. Una cadena de postas lo mantiene abierto, pero en las últimas semanas dos mensajeros desaparecieron.", showDescToPlayers: true},
                {id: "o8", emoji: "🌲", x: 9.5, y: 8.5, size: 1.2, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "o9", emoji: "🌲", x: 10.5, y: 9.5, size: 1.2, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "o10", emoji: "🌲", x: 9.5, y: 10.5, size: 1.2, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Bosque de Agujas", description: "Los árboles aquí crecen demasiado juntos. Los lugareños no cazan dentro. Un druida visitó el pueblo hace un mes preguntando por rastros de bestias.", showDescToPlayers: true},
                {id: "o11", emoji: "⛺", x: 16.5, y: 6.5, size: 1.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Campamento del Rey", description: "Exploradores reales cartografiando la costa. Llevan tres semanas aquí y empiezan a quedarse sin provisiones.", showDescToPlayers: true},
                {id: "o12", emoji: "⚓", x: 9.5, y: 13.5, size: 1.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Puerto Ancla Rota", description: "Un solo barco puede amarrar aquí. El faro lleva meses apagado. El encargado jura que escuchó voces bajo el embarcadero.", showDescToPlayers: true},
                {id: "o13", emoji: "⛵", x: 17.5, y: 12.5, size: 1.1, rotation: -20, isToken: true, isHero: true, visionRadius: 4, name: "El Viento Gris", description: "Carabel mercante de capitana Rena. Transporte de confianza, pero sus tarifas han subido sin explicación."}
            ]
        },
        tradeRoute: {
            cols: 30,
            rows: 20,
            mode: "region",
            travelScaleValue: 8,
            travelScaleUnit: "millas",
            travelMethod: "wagon",
            terrainMap: { p: "plains", f: "forest", h: "hills", m: "mountain", s: "swamp", o: "ocean", d: "desert" },
            terrainStr: `
                ffffffhhhhpppppppppppppooooooo
                fffffhhhhpppppppppppppoooooooo
                ffffhhhhpppppppppppppooooooooo
                fffhhhhhpppppppppppppooooooooo
                ffhhhhppppppppppppppoooooooooo
                fhhhhpppppppoopppppooooooooooo
                hhhhpppppppoooopppoooooooooooo
                hhhpppppppoooooopooooooooooooo
                hhpppppppoooooooopoooooooooooo
                hpppppppoooooooooppsoooooooooo
                pppppppoooooooooppsssooooooooo
                ppppppooooooooppppsssooooooooo
                pppppooooooopppppppsssoooooooo
                ppppoooooopppppppppsssoooooooo
                pppoooooppppppppppppssoooooooo
                pppppppppppppppffpppppoooooooo
                pppppppppppppfffffpppppooooooo
                pppppppppppfffffffppppppoooooo
                pppppppppfffffffffpppppppooooo
                pppppppfffffffffffppppppppoooo
            `,
            walls: [],
            stamps: [
                {id: "tr1", emoji: "🏰", x: 5.5, y: 4.5, size: 1.4, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Fortaleza de Valdoro", description: "Peaje fortificado que protege la ruta fluvial. Los guardias sospechan de una caravana desaparecida río abajo.", showDescToPlayers: true},
                {id: "tr2", emoji: "🌉", x: 13.5, y: 8.5, size: 1.2, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Puente de los Tres Arcos", description: "Un puente antiguo con marcas de reparación reciente. Debajo se escucha maquinaria, aunque nadie admite haber trabajado allí.", showDescToPlayers: true},
                {id: "tr3", emoji: "🛒", x: 10.5, y: 13.5, size: 1.1, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Mercado de Ribera", description: "Mercaderes, barqueros y rumores. Buen lugar para comprar provisiones o conseguir información sobre bandidos del delta.", showDescToPlayers: true},
                {id: "tr4", emoji: "⚓", x: 21.5, y: 10.5, size: 1.1, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Puerto de Juncos", description: "Muelle pantanoso donde las barcas de fondo plano salen al amanecer. Una luz azul aparece algunas noches sobre el agua.", showDescToPlayers: true},
                {id: "tr5", emoji: "🏴", x: 17.5, y: 15.5, size: 1.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Campamento Marcado", description: "Señales de rueda, cenizas frías y una bandera negra clavada al revés. Podría ser advertencia o invitación.", showDescToPlayers: false, isSecret: true}
            ]
        },
        mountainPass: {
            cols: 30,
            rows: 20,
            mode: "region",
            travelScaleValue: 5,
            travelScaleUnit: "millas",
            travelMethod: "foot",
            terrainMap: { p: "plains", f: "forest", h: "hills", m: "mountain", s: "swamp", o: "ocean", d: "desert" },
            terrainStr: `
                mmmmmmmmmmmmmhhhhhhffffffffffff
                mmmmmmmmmmmmhhhhhhhffffffffffff
                mmmmmmmmmmhhhhhhhhhhffffffffff
                mmmmmmmmhhhhhhpphhhhhfffffffff
                mmmmmmhhhhhhpppphhhhhhffffffff
                mmmmmhhhhhhpppppphhhhhhfffffff
                mmmmhhhhhhpppppppphhhhhhffffff
                mmmhhhhhhpppphppppphhhhhhfffff
                mmhhhhhhpppphhhppppphhhhhfffff
                mmhhhhhpppphhmhhppppphhhhhffff
                mhhhhhhppphhmmmhhpppphhhhhhfff
                mhhhhhppphhmmmmmhhpppphhhhhhff
                mhhhhpppphhmmmmmhhppppphhhhhff
                mhhhppppphhmmmmhhpppppphhhhfff
                mhhppppppphhhhhhppppppphhhffff
                hhpppppppppppppppppppppphfffff
                hppppppppfffffppppppppppffffff
                pppppppfffffffffppppppppffffff
                ppppppfffffffffffpppppppffffff
                pppppfffffffffffffppppppffffff
            `,
            walls: [],
            stamps: [
                {id: "mp1", emoji: "🗼", x: 12.5, y: 4.5, size: 1.2, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Atalaya del Cuervo", description: "Torre abandonada con vista a ambos valles. En los cristales rotos hay runas de alarma aún activas.", showDescToPlayers: true},
                {id: "mp2", emoji: "⛏️", x: 8.5, y: 9.5, size: 1.1, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Mina Cerrada", description: "La entrada está bloqueada con tablones recientes. Desde dentro llega aire caliente y olor a azufre.", showDescToPlayers: true},
                {id: "mp3", emoji: "🕌", x: 17.5, y: 11.5, size: 1.1, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Santuario del Paso", description: "Pequeño refugio de piedra donde los viajeros dejan cintas y monedas para pedir buen clima.", showDescToPlayers: true},
                {id: "mp4", emoji: "🕳️", x: 14.5, y: 7.5, size: 1.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Grieta del Eco", description: "Una grieta estrecha repite las voces con unos segundos de retraso. A veces responde con palabras que nadie pronunció.", showDescToPlayers: false, isSecret: true},
                {id: "mp5", emoji: "🌋", x: 15.5, y: 11.0, size: 1.3, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Caldera Dormida", description: "Nieve ennegrecida y respiraderos calientes. Cruzarla ahorra un día, pero cada descanso aquí es peligroso.", showDescToPlayers: true}
            ]
        },
        desertOasis: {
            cols: 30,
            rows: 20,
            mode: "region",
            travelScaleValue: 10,
            travelScaleUnit: "millas",
            travelMethod: "foot",
            terrainMap: { p: "plains", f: "forest", h: "hills", m: "mountain", s: "swamp", o: "ocean", d: "desert" },
            terrainStr: `
                dddddddddddddddddddddddddddddd
                dddddddddddddddddddddddddddddd
                ddddddddddddhhhddddddddddddddd
                ddddddddddhhhhhhhddddddddddddd
                ddddddddhhhhmmmmhhhddddddddddd
                dddddddhhhhmmmmmmhhhdddddddddd
                ddddddhhhmmddddmmhhhddddddddd
                dddddhhhmmddppddmmhhhdddddddd
                ddddhhhmmddpoopddmmhhhddddddd
                ddddhhmmdddpoopdddmmhhddddddd
                ddddhhhmmddppppddmmhhhddddddd
                dddddhhhmmddddddmmhhhdddddddd
                ddddddhhhmmmmmmmmhhhddddddddd
                dddddddhhhhmmmmhhhhdddddddddd
                ddddddddhhhhhhhhhhddddddddddd
                dddddddddddhhhhdddddddddddddd
                dddddddddddddddddddddddddddddd
                dddddddddddddddddddddddddddddd
                dddddddddddddddddddddddddddddd
                dddddddddddddddddddddddddddddd
            `,
            walls: [],
            stamps: [
                {id: "do1", emoji: "💧", x: 14.5, y: 9.5, size: 1.2, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Manantial de la Media Luna", description: "Agua fría y dulce en pleno desierto. Sus reflejos muestran constelaciones aunque sea de día.", showDescToPlayers: true},
                {id: "do2", emoji: "🛖", x: 12.5, y: 10.5, size: 1.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Caravasar Sellado", description: "Puertas atrancadas desde dentro. Hay huellas de camello alrededor, pero ninguna sale del patio.", showDescToPlayers: true},
                {id: "do3", emoji: "🗽", x: 17.5, y: 8.5, size: 1.2, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Estatua Sin Rostro", description: "Una estatua erosionada mira hacia el oeste. Al atardecer su sombra señala una duna concreta.", showDescToPlayers: true},
                {id: "do4", emoji: "🌌", x: 15.5, y: 5.5, size: 1.1, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Espejismo Estelar", description: "A distancia parece agua; de cerca, una ventana hacia un cielo nocturno imposible.", showDescToPlayers: false, isSecret: true},
                {id: "do5", emoji: "🏴", x: 20.5, y: 13.5, size: 1.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Bandera de los Saqueadores", description: "Marca territorial de una banda nómada. Los lugareños evitan estas dunas incluso cuando el camino es más corto.", showDescToPlayers: true}
            ]
        },
        ruins: {
            cols: 25,
            rows: 20,
            terrainStr: `
                ggggggggggggggggggggggggg
                ggggggggggggggggggggggggg
                gggggssssssssssssssgggggg
                gggggssssssssssssssgggggg
                gggggssaaasssssssssgggggg
                gggggssaaasssssssssgggggg
                gggggssssssssssssssgggggg
                gggggssssssssssssssgggggg
                gggggssssssssssssssgggggg
                ggggggggggggsssssssgggggg
                ggggggggggggsssssssgggggg
                ggggggggggggsssssssgggggg
                gggggssssssssssssssgggggg
                gggggssssssssssssssgggggg
                gggggssssssssssssssgggggg
                ggggggggggggggggggggggggg
                ggggggggggggggggggggggggg
                ggggggggggggggggggggggggg
                ggggggggggggggggggggggggg
                ggggggggggggggggggggggggg
            `,
            walls: [
                {x1: 5, y1: 2, x2: 19, y2: 2, width: 8, color: "#1c1c1f"},
                {x1: 19, y1: 2, x2: 19, y2: 15, width: 8, color: "#1c1c1f"},
                {x1: 19, y1: 15, x2: 5, y2: 15, width: 8, color: "#1c1c1f"},
                {x1: 5, y1: 15, x2: 5, y2: 2, width: 8, color: "#1c1c1f"},
                {x1: 12, y1: 2, x2: 12, y2: 8, width: 8, color: "#1c1c1f"}
            ],
            stamps: [
                {id: "r1", emoji: "🛡️", x: 7.5, y: 13.5, size: 1.0, rotation: 0, isToken: true, isHero: true, visionRadius: 5, name: "Guerrero", hpCurrent: 36, hpMax: 36, conditions: []},
                {id: "r2", emoji: "✝️", x: 8.5, y: 13.5, size: 1.0, rotation: 0, isToken: true, isHero: true, visionRadius: 4, name: "Clérigo", hpCurrent: 28, hpMax: 28, conditions: []},
                {id: "r3", emoji: "💀", x: 10.5, y: 5.5, size: 1.0, rotation: 15, isToken: true, isHero: false, visionRadius: 0, name: "Esqueleto A", hpCurrent: 12, hpMax: 12, conditions: []},
                {id: "r4", emoji: "💀", x: 14.5, y: 5.5, size: 1.0, rotation: -45, isToken: true, isHero: false, visionRadius: 0, name: "Esqueleto B", hpCurrent: 12, hpMax: 12, conditions: []},
                {id: "r5", emoji: "🧟", x: 16.5, y: 11.5, size: 1.1, rotation: 0, isToken: true, isHero: false, visionRadius: 0, name: "Zombi", hpCurrent: 22, hpMax: 22, conditions: []},
                {id: "r6", emoji: "🚪", x: 12.0, y: 9.0, size: 1.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "r7", emoji: "🏚️", x: 17.5, y: 3.5, size: 1.4, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "r8", emoji: "🧱", x: 7.5, y: 7.5, size: 1.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "r9", emoji: "🧱", x: 16.5, y: 7.5, size: 1.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "r10", emoji: "🕸️", x: 15.5, y: 3.5, size: 1.1, rotation: 30, isToken: false, isHero: false, visionRadius: 0, isSecret: true},
                {id: "r11", emoji: "📦", x: 17.5, y: 4.5, size: 0.9, rotation: 0, isToken: false, isHero: false, visionRadius: 0, isSecret: true}
            ]
        },
        tavern: {
            cols: 25,
            rows: 20,
            terrainStr: `
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
                ddddddddddddddddddddddddd
            `,
            walls: [
                {x1: 2, y1: 2, x2: 23, y2: 2, width: 8, color: "#1c1c1f"},
                {x1: 23, y1: 2, x2: 23, y2: 18, width: 8, color: "#1c1c1f"},
                {x1: 23, y1: 18, x2: 2, y2: 18, width: 8, color: "#1c1c1f"},
                {x1: 2, y1: 18, x2: 2, y2: 2, width: 8, color: "#1c1c1f"},
                {x1: 3, y1: 6, x2: 12, y2: 6, width: 6, color: "#8b5a2b"}
            ],
            stamps: [
                {id: "t1", emoji: "🧙", x: 15.5, y: 10.5, size: 1.0, rotation: 0, isToken: true, isHero: true, visionRadius: 6, name: "Mago", hpCurrent: 24, hpMax: 24, conditions: []},
                {id: "t2", emoji: "👤", x: 14.5, y: 11.5, size: 1.0, rotation: 0, isToken: true, isHero: true, visionRadius: 5, name: "Pícaro", hpCurrent: 20, hpMax: 20, conditions: []},
                {id: "t3", emoji: "🧑‍🍳", x: 7.5, y: 4.5, size: 1.0, rotation: 180, isToken: true, isHero: false, visionRadius: 0, name: "Tabernero", hpCurrent: 30, hpMax: 30, conditions: []},
                {id: "t4", emoji: "🍺", x: 7.5, y: 5.5, size: 0.7, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "t5", emoji: "🍷", x: 8.5, y: 5.5, size: 0.7, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "t6", emoji: "🪵", x: 15.0, y: 11.0, size: 1.4, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "t7", emoji: "🪑", x: 15.0, y: 9.5, size: 0.8, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "t8", emoji: "🪑", x: 15.0, y: 12.5, size: 0.8, rotation: 180, isToken: false, isHero: false, visionRadius: 0},
                {id: "t9", emoji: "🪵", x: 8.0, y: 11.0, size: 1.4, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "t10", emoji: "🪑", x: 8.0, y: 9.5, size: 0.8, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "t11", emoji: "🪑", x: 8.0, y: 12.5, size: 0.8, rotation: 180, isToken: false, isHero: false, visionRadius: 0},
                {id: "t12", emoji: "🔥", x: 21.0, y: 10.0, size: 1.2, rotation: 0, isToken: false, isHero: false, visionRadius: 0}
            ]
        },
        cave: {
            cols: 25,
            rows: 20,
            terrainStr: `
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
                sssssssssslllllllssssssss
                ssssssssslllllllllsssssss
                sssssssslllllllllllssssss
                sssssssslllllllllllssssss
                ssssssssslllllllllsssssss
                sssssssssslllllllssssssss
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
                sssssssssssssssssssssssss
            `,
            walls: [
                {x1: 4, y1: 4, x2: 5, y2: 6, width: 14, color: "#1c1c1f"},
                {x1: 20, y1: 4, x2: 21, y2: 6, width: 14, color: "#1c1c1f"},
                {x1: 4, y1: 14, x2: 5, y2: 16, width: 14, color: "#1c1c1f"},
                {x1: 20, y1: 14, x2: 21, y2: 16, width: 14, color: "#1c1c1f"}
            ],
            stamps: [
                {id: "c1", emoji: "🧙", x: 12.5, y: 16.5, size: 1.0, rotation: 0, isToken: true, isHero: true, visionRadius: 6, name: "Mago", hpCurrent: 24, hpMax: 24, conditions: []},
                {id: "c2", emoji: "🛡️", x: 11.5, y: 16.5, size: 1.0, rotation: 0, isToken: true, isHero: true, visionRadius: 5, name: "Guerrero", hpCurrent: 36, hpMax: 36, conditions: []},
                {id: "c3", emoji: "🐉", x: 12.5, y: 6.5, size: 2.2, rotation: 0, isToken: true, isHero: false, visionRadius: 0, name: "Dragón Rojo", hpCurrent: 180, hpMax: 180, conditions: []},
                {id: "c4", emoji: "🔥", x: 10.5, y: 6.5, size: 0.9, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "c5", emoji: "🔥", x: 14.5, y: 6.5, size: 0.9, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "c6", emoji: "🍄", x: 5.5, y: 10.5, size: 0.8, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "c7", emoji: "🍄", x: 18.5, y: 10.5, size: 0.8, rotation: 0, isToken: false, isHero: false, visionRadius: 0},
                {id: "c8", emoji: "🪙", x: 12.5, y: 3.5, size: 1.3, rotation: 0, isToken: false, isHero: false, visionRadius: 0}
            ]
        }
    };

    // --- INITIALIZE APP ---
    function init() {
        resizeCanvas();
        initMapState(state.cols, state.rows);
        centerMap();
        syncUIForMapMode();
        saveHistory();
        draw();
        
        window.addEventListener("resize", handleWindowResize);
        setupEventListeners();
    }

    function initMapState(cols, rows) {
        state.cols = cols;
        state.rows = rows;
        state.terrain = Array(cols * rows).fill(null).map(() => ({ type: "stone", variation: 0 }));
        state.fog = Array(cols * rows).fill(false);
        state.walls = [];
        state.stamps = [];
        selectedStampId = null;
        updateStampControlUI();
    }

    function resizeCanvas() {
        canvas.width = state.cols * state.cellSize;
        canvas.height = state.rows * state.cellSize;
    }

    function centerMap() {
        const vwWidth = viewport.clientWidth;
        const vwHeight = viewport.clientHeight;
        const mapWidth = canvas.width * zoom;
        const mapHeight = canvas.height * zoom;
        
        panX = (vwWidth - mapWidth) / 2;
        panY = (vwHeight - mapHeight) / 2;
        updateTransform();
    }

    function updateTransform() {
        canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
        zoomDisplay.textContent = `Zoom: ${Math.round(zoom * 100)}%`;
    }

    // --- UNDO / REDO HISTORY ---
    function saveHistory() {
        const serialized = JSON.stringify({
            cols: state.cols,
            rows: state.rows,
            terrain: state.terrain,
            walls: state.walls,
            stamps: state.stamps,
            fog: state.fog,
            initiative: state.initiative,
            bgImage: state.bgImage,
            bgScale: state.bgScale,
            bgX: state.bgX,
            bgY: state.bgY,
            bgOpacity: state.bgOpacity,
            showBg: state.showBg,
            weather: state.weather,
            travelScaleValue: state.travelScaleValue,
            travelScaleUnit: state.travelScaleUnit,
            travelMethod: state.travelMethod
        });
        
        if (undoStack.length > 0 && undoStack[undoStack.length - 1] === serialized) return;
        
        undoStack.push(serialized);
        redoStack = [];
        
        if (undoStack.length > 30) {
            undoStack.shift();
        }
        updateHistoryButtons();
    }

    function undo() {
        if (undoStack.length > 1) {
            const current = undoStack.pop();
            redoStack.push(current);
            
            const previous = undoStack[undoStack.length - 1];
            restoreState(JSON.parse(previous));
            
            draw();
            updateHistoryButtons();
        }
    }

    function redo() {
        if (redoStack.length > 0) {
            const next = redoStack.pop();
            undoStack.push(next);
            
            restoreState(JSON.parse(next));
            
            draw();
            updateHistoryButtons();
        }
    }

    function restoreState(parsed) {
        state.cols = parsed.cols;
        state.rows = parsed.rows;
        
        // Backward compatibility: map strings to objects
        if (parsed.terrain) {
            state.terrain = parsed.terrain.map(cell => {
                if (typeof cell === "string") {
                    return { type: cell, variation: Math.floor(Math.random() * 3) };
                }
                return cell;
            });
        } else {
            state.terrain = [];
        }
        
        state.walls = parsed.walls;
        state.stamps = parsed.stamps;
        state.fog = parsed.fog;
        state.initiative = parsed.initiative || [];
        state.bgImage = parsed.bgImage || "";
        state.bgScale = parsed.bgScale !== undefined ? parsed.bgScale : 1.0;
        state.bgX = parsed.bgX !== undefined ? parsed.bgX : 0;
        state.bgY = parsed.bgY !== undefined ? parsed.bgY : 0;
        state.bgOpacity = parsed.bgOpacity !== undefined ? parsed.bgOpacity : 0.8;
        state.showBg = parsed.showBg !== undefined ? parsed.showBg : false;
        state.weather = parsed.weather || "";
        
        state.travelScaleValue = parsed.travelScaleValue !== undefined ? parsed.travelScaleValue : 10;
        state.travelScaleUnit = parsed.travelScaleUnit !== undefined ? parsed.travelScaleUnit : "millas";
        state.travelMethod = parsed.travelMethod !== undefined ? parsed.travelMethod : "foot";
        
        // Sync UI inputs
        const chkShowBg = document.getElementById("chkShowBg");
        const bgOpacity = document.getElementById("bgOpacity");
        const bgScale = document.getElementById("bgScale");
        const bgX = document.getElementById("bgX");
        const bgY = document.getElementById("bgY");
        const bgTemplateSelect = document.getElementById("bgTemplateSelect");
        const weatherSelect = document.getElementById("weatherSelect");
        
        if (chkShowBg) chkShowBg.checked = state.showBg;
        if (bgOpacity) {
            bgOpacity.value = state.bgOpacity;
            const valEl = document.getElementById("bgOpacityVal");
            if (valEl) valEl.textContent = `${Math.round(state.bgOpacity * 100)}%`;
        }
        if (bgScale) {
            bgScale.value = state.bgScale;
            const valEl = document.getElementById("bgScaleVal");
            if (valEl) valEl.textContent = `${state.bgScale.toFixed(1)}x`;
        }
        if (bgX) {
            bgX.value = state.bgX;
            const valEl = document.getElementById("bgXVal");
            if (valEl) valEl.textContent = `${state.bgX}px`;
        }
        if (bgY) {
            bgY.value = state.bgY;
            const valEl = document.getElementById("bgYVal");
            if (valEl) valEl.textContent = `${state.bgY}px`;
        }
        if (bgTemplateSelect) {
            const template = Object.entries(bgTemplates).find(([, cfg]) => cfg.src === state.bgImage);
            bgTemplateSelect.value = template ? template[0] : "";
        }
        if (weatherSelect) {
            weatherSelect.value = state.weather;
            updateWeatherSystem();
        }
        
        if (travelScaleValueInput) travelScaleValueInput.value = state.travelScaleValue;
        if (travelScaleUnitSelect) travelScaleUnitSelect.value = state.travelScaleUnit;
        if (travelMethodSelect) travelMethodSelect.value = state.travelMethod;
        
        if (selectedStampId) {
            const stillExists = state.stamps.some(s => s.id === selectedStampId);
            if (!stillExists) {
                selectedStampId = null;
            }
        }
        
        syncUIForMapMode();
        
        resizeCanvas();
        updateTransform();
        drawInitiativeList();
    }

    function updateHistoryButtons() {
        btnUndo.disabled = undoStack.length <= 1;
        btnRedo.disabled = redoStack.length === 0;
    }

    // --- RAYCASTING LINE-OF-SIGHT ENGINE ---
    function checkLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
        const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        if (denom === 0) return false;
        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
        const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
        const eps = 0.01;
        return (ua >= eps && ua <= 1.0 - eps && ub >= -eps && ub <= 1.0 + eps);
    }

    function isWallBetween(p1, p2) {
        const size = state.cellSize;
        for (const w of state.walls) {
            const wx1 = w.x1 * size;
            const wy1 = w.y1 * size;
            const wx2 = w.x2 * size;
            const wy2 = w.y2 * size;
            if (checkLineIntersection(p1.x, p1.y, p2.x, p2.y, wx1, wy1, wx2, wy2)) {
                return true;
            }
        }
        return false;
    }

    // --- DYNAMIC FOG OF WAR ENGINE ---
    function revealFogAroundToken(token) {
        const radius = token.visionRadius || 4;
        const size = state.cellSize;
        const hexMode = isHexMode();
        const mapMode = mapModeSelect?.value || "combat";
        const tokenCanvasPos = getTokenCanvasPos(token);
        const tokenCell = hexMode
            ? getTokenHexCell(token)
            : { col: Math.floor(token.x), row: Math.floor(token.y) };
        const centerCol = tokenCell.col;
        const centerRow = tokenCell.row;

        // --- rot.js RecursiveShadowcasting for dungeon (combat, non-hex) mode ---
        // Abyss tiles block light naturally, giving true room-by-room visibility
        if (!hexMode && mapMode === "combat" && typeof ROT !== "undefined" && ROT.FOV) {
            const passable = (x, y) => {
                if (x < 0 || x >= state.cols || y < 0 || y >= state.rows) return false;
                const cell = state.terrain[y * state.cols + x];
                const type = (cell && typeof cell === "object") ? cell.type : cell;
                return type !== "abyss";
            };
            const fov = new ROT.FOV.RecursiveShadowcasting(passable, { topology: 8 });
            fov.compute(centerCol, centerRow, radius, (x, y) => {
                if (x >= 0 && x < state.cols && y >= 0 && y < state.rows) {
                    state.fog[y * state.cols + x] = false;
                }
            });
            return;
        }

        // --- Legacy raycasting for hex/region modes (uses drawn wall segments) ---
        for (let r = Math.max(0, centerRow - radius); r <= Math.min(state.rows - 1, centerRow + radius); r++) {
            for (let c = Math.max(0, centerCol - radius); c <= Math.min(state.cols - 1, centerCol + radius); c++) {
                let dist;
                if (hexMode) {
                    const startCube = oddrToCube(centerCol, centerRow);
                    const endCube   = oddrToCube(c, r);
                    dist = Math.max(
                        Math.abs(startCube.x - endCube.x),
                        Math.abs(startCube.y - endCube.y),
                        Math.abs(startCube.z - endCube.z)
                    );
                } else {
                    dist = Math.sqrt(Math.pow(c + 0.5 - token.x, 2) + Math.pow(r + 0.5 - token.y, 2));
                }

                if (dist <= radius) {
                    const cellCanvasPos = hexMode
                        ? getHexCenter(c, r)
                        : { x: (c + 0.5) * size, y: (r + 0.5) * size };
                    if (!isWallBetween(tokenCanvasPos, cellCanvasPos)) {
                        state.fog[r * state.cols + c] = false;
                    }
                }
            }
        }
    }

    function revealFogAroundTokens() {
        if (!chkDynamicFog.checked) return;
        
        let hasHeros = false;
        state.stamps.forEach(s => {
            if (s.isHero) {
                hasHeros = true;
                revealFogAroundToken(s);
            }
        });
    }

    // --- CACHING VARIABLES FOR RENDERING ---
    let cachedBgImg = null;
    let cachedBgSrc = "";
    const tokenImageCache = {};
    let weatherSystem = null;
    let animFrameId = null;

    // --- GEOMETRY HELPERS FOR HEXAGON GRIDS ---
    function isHexMode() {
        const mode = mapModeSelect?.value || "combat";
        return mode === "hex" || mode === "region";
    }

    function getHexCenter(col, row) {
        const radius = state.cellSize / 2;
        const spacingX = radius * Math.sqrt(3);
        const spacingY = radius * 1.5;
        const cx = col * spacingX + (row % 2) * (spacingX / 2) + spacingX / 2;
        const cy = row * spacingY + radius;
        return { x: cx, y: cy };
    }

    function oddrToCube(col, row) {
        const x = col - (row - (row & 1)) / 2;
        const z = row;
        const y = -x - z;
        return { x, y, z };
    }

    function getHexCoordsFromCanvas(x, y) {
        return {
            col: x / state.cellSize,
            row: y / state.cellSize
        };
    }

    function getClosestHexVertex(x, y) {
        const hex = getClosestHex(x, y);
        const center = getHexCenter(hex.col, hex.row);
        const radius = state.cellSize / 2;
        
        let minD = Infinity;
        let bestX = x;
        let bestY = y;
        
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 180) * (60 * i - 30);
            const vx = center.x + radius * Math.cos(angle);
            const vy = center.y + radius * Math.sin(angle);
            const dist = Math.sqrt((vx - x)**2 + (vy - y)**2);
            if (dist < minD) {
                minD = dist;
                bestX = vx;
                bestY = vy;
            }
        }
        return { x: bestX, y: bestY };
    }

    function getTokenCanvasPos(s) {
        const size = state.cellSize;
        
        if (isHexMode()) {
            if (s.freePosition) {
                return { x: s.x * size, y: s.y * size };
            }

            // s.x and s.y hold grid coordinates col + 0.5 and row + 0.5
            const col = s.x - 0.5;
            const row = s.y - 0.5;
            return getHexCenter(col, row);
        } else {
            return { x: s.x * size, y: s.y * size };
        }
    }

    function getTokenHexCell(token) {
        const pos = getTokenCanvasPos(token);
        return getClosestHex(pos.x, pos.y);
    }

    function setStampFreeCanvasPosition(stamp, canvasX, canvasY) {
        stamp.x = canvasX / state.cellSize;
        stamp.y = canvasY / state.cellSize;
        stamp.freePosition = true;
    }

    function setStampSnappedCellPosition(stamp, col, row) {
        stamp.x = col + 0.5;
        stamp.y = row + 0.5;
        stamp.freePosition = false;
    }

    function getClosestHex(x, y) {
        const radius = state.cellSize / 2;
        const spacingX = radius * Math.sqrt(3);
        const spacingY = radius * 1.5;
        
        // Estimate row and col roughly
        let estRow = Math.round((y - radius) / spacingY);
        let estCol = Math.round((x - spacingX/2) / spacingX);
        
        let minDist = Infinity;
        let bestCol = 0;
        let bestRow = 0;
        
        // Check a 5x5 window around the estimate
        for (let r = Math.max(0, estRow - 2); r <= Math.min(state.rows - 1, estRow + 2); r++) {
            for (let c = Math.max(0, estCol - 2); c <= Math.min(state.cols - 1, estCol + 2); c++) {
                const cx = c * spacingX + (r % 2) * (spacingX / 2) + spacingX / 2;
                const cy = r * spacingY + radius;
                const dist = Math.sqrt((cx - x)**2 + (cy - y)**2);
                if (dist < minDist) {
                    minDist = dist;
                    bestCol = c;
                    bestRow = r;
                }
            }
        }
        return { col: bestCol, row: bestRow };
    }

    function drawHexCell(targetCtx, cx, cy, radius, fillStyle, strokeStyle, lineWidth = 1) {
        targetCtx.fillStyle = fillStyle;
        targetCtx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 180) * (60 * i - 30);
            const px = cx + radius * Math.cos(angle);
            const py = cy + radius * Math.sin(angle);
            if (i === 0) targetCtx.moveTo(px, py);
            else targetCtx.lineTo(px, py);
        }
        targetCtx.closePath();
        targetCtx.fill();
        if (strokeStyle) {
            targetCtx.strokeStyle = strokeStyle;
            targetCtx.lineWidth = lineWidth;
            targetCtx.stroke();
        }
    }

    // --- EXPLORATION BIOMES DRAWING HELPERS ---
    function drawBiomeDecoration(targetCtx, type, variation, cx, cy, radius) {
        targetCtx.save();
        targetCtx.translate(cx, cy);
        
        if (type === "plains") {
            // Llanuras (Hierba / Flores / Arbusto)
            if (variation === 0) {
                // Grass blades
                targetCtx.strokeStyle = "rgba(40, 80, 40, 0.4)";
                targetCtx.lineWidth = 1.5;
                targetCtx.lineCap = "round";
                targetCtx.beginPath();
                targetCtx.moveTo(-3, 4); targetCtx.lineTo(-1, -3);
                targetCtx.moveTo(1, 4); targetCtx.lineTo(3, -4);
                targetCtx.stroke();
            } else if (variation === 1) {
                // Wildflowers
                targetCtx.strokeStyle = "rgba(40, 80, 40, 0.4)";
                targetCtx.lineWidth = 1.2;
                targetCtx.beginPath();
                targetCtx.moveTo(-1, 4); targetCtx.lineTo(0, -1);
                targetCtx.stroke();
                
                targetCtx.fillStyle = "#ef4444"; // red dot
                targetCtx.beginPath(); targetCtx.arc(-4, 0, 1.8, 0, Math.PI * 2); targetCtx.fill();
                targetCtx.fillStyle = "#eab308"; // yellow dot
                targetCtx.beginPath(); targetCtx.arc(4, 2, 1.8, 0, Math.PI * 2); targetCtx.fill();
            } else {
                // Small shrub
                targetCtx.fillStyle = "rgba(22, 101, 52, 0.45)";
                targetCtx.strokeStyle = "rgba(10, 50, 10, 0.35)";
                targetCtx.lineWidth = 1;
                targetCtx.beginPath();
                targetCtx.arc(-2, 1, 3.5, 0, Math.PI * 2);
                targetCtx.arc(2, -1, 3, 0, Math.PI * 2);
                targetCtx.fill();
                targetCtx.stroke();
            }
        }
        else if (type === "forest") {
            // Bosques (Árboles mixtos / Pinos / Bosque denso)
            if (variation === 0) {
                // Leafy oak trees
                targetCtx.strokeStyle = "#451a03"; // brown trunk
                targetCtx.lineWidth = 2;
                targetCtx.beginPath();
                targetCtx.moveTo(-5, 1); targetCtx.lineTo(-5, 6);
                targetCtx.moveTo(5, 1); targetCtx.lineTo(5, 6);
                targetCtx.moveTo(0, -4); targetCtx.lineTo(0, 1);
                targetCtx.stroke();
                
                targetCtx.fillStyle = "#15803d";
                targetCtx.strokeStyle = "rgba(0,0,0,0.2)";
                targetCtx.lineWidth = 1;
                targetCtx.beginPath(); targetCtx.arc(-5, 0, 4.5, 0, Math.PI * 2); targetCtx.fill(); targetCtx.stroke();
                targetCtx.beginPath(); targetCtx.arc(5, 0, 4.5, 0, Math.PI * 2); targetCtx.fill(); targetCtx.stroke();
                targetCtx.beginPath(); targetCtx.arc(0, -5, 5, 0, Math.PI * 2); targetCtx.fill(); targetCtx.stroke();
            } else if (variation === 1) {
                // Coniferous pine trees
                const drawPine = (tx, ty, w, h) => {
                    // trunk
                    targetCtx.strokeStyle = "#451a03";
                    targetCtx.lineWidth = 1.5;
                    targetCtx.beginPath();
                    targetCtx.moveTo(tx, ty); targetCtx.lineTo(tx, ty + 4);
                    targetCtx.stroke();
                    // pine leaves
                    targetCtx.fillStyle = "#064e3b";
                    targetCtx.strokeStyle = "rgba(0,0,0,0.22)";
                    targetCtx.lineWidth = 1;
                    targetCtx.beginPath();
                    targetCtx.moveTo(tx, ty - h);
                    targetCtx.lineTo(tx - w/2, ty);
                    targetCtx.lineTo(tx + w/2, ty);
                    targetCtx.closePath();
                    targetCtx.fill();
                    targetCtx.stroke();
                };
                drawPine(-6, 2, 7, 10);
                drawPine(6, 2, 7, 10);
                drawPine(0, -4, 9, 12);
            } else {
                // Dense grove canopy
                targetCtx.fillStyle = "#0f3e21";
                targetCtx.strokeStyle = "rgba(0,0,0,0.2)";
                targetCtx.lineWidth = 1;
                targetCtx.beginPath();
                targetCtx.arc(-4, -2, 5, 0, Math.PI * 2);
                targetCtx.arc(4, -2, 5, 0, Math.PI * 2);
                targetCtx.arc(0, 3, 5.5, 0, Math.PI * 2);
                targetCtx.fill();
                targetCtx.stroke();
            }
        }
        else if (type === "mountain") {
            // Montañas (Pico simple / Picos nevados / Fila volcánica)
            if (variation === 0) {
                targetCtx.fillStyle = "#cbd5e1";
                targetCtx.strokeStyle = "#1e293b";
                targetCtx.lineWidth = 1.5;
                targetCtx.beginPath();
                targetCtx.moveTo(0, -12);
                targetCtx.lineTo(-10, 8);
                targetCtx.lineTo(10, 8);
                targetCtx.closePath();
                targetCtx.fill();
                targetCtx.stroke();
                
                targetCtx.beginPath();
                targetCtx.moveTo(0, -12);
                targetCtx.lineTo(-1, 8);
                targetCtx.stroke();
            } else if (variation === 1) {
                const drawPeak = (tx, ty, w, h) => {
                    targetCtx.fillStyle = "#64748b";
                    targetCtx.strokeStyle = "#0f172a";
                    targetCtx.lineWidth = 1.2;
                    targetCtx.beginPath();
                    targetCtx.moveTo(tx, ty - h);
                    targetCtx.lineTo(tx - w/2, ty);
                    targetCtx.lineTo(tx + w/2, ty);
                    targetCtx.closePath();
                    targetCtx.fill();
                    targetCtx.stroke();
                    
                    targetCtx.fillStyle = "#f8fafc";
                    targetCtx.beginPath();
                    targetCtx.moveTo(tx, ty - h);
                    targetCtx.lineTo(tx - w/4, ty - h/2);
                    targetCtx.lineTo(tx + w/4, ty - h/2);
                    targetCtx.closePath();
                    targetCtx.fill();
                    targetCtx.stroke();
                };
                drawPeak(-5, 7, 14, 14);
                drawPeak(5, 5, 12, 12);
            } else {
                targetCtx.fillStyle = "#475569";
                targetCtx.strokeStyle = "#020617";
                targetCtx.lineWidth = 1.5;
                targetCtx.beginPath();
                targetCtx.moveTo(-8, 5);
                targetCtx.lineTo(-3, -7);
                targetCtx.lineTo(2, -2);
                targetCtx.lineTo(7, -8);
                targetCtx.lineTo(10, 5);
                targetCtx.closePath();
                targetCtx.fill();
                targetCtx.stroke();
                
                targetCtx.strokeStyle = "#ef4444"; // red lava crack
                targetCtx.lineWidth = 1.2;
                targetCtx.beginPath();
                targetCtx.moveTo(-2, -3); targetCtx.lineTo(0, 3);
                targetCtx.stroke();
            }
        }
        else if (type === "desert") {
            // Desierto (Dunas / Cactus / Suelo quebrado)
            if (variation === 0) {
                targetCtx.strokeStyle = "#b45309";
                targetCtx.lineWidth = 1.5;
                targetCtx.lineCap = "round";
                targetCtx.beginPath();
                targetCtx.moveTo(-8, -3); targetCtx.quadraticCurveTo(-3, -6, 3, -3);
                targetCtx.moveTo(-3, 3); targetCtx.quadraticCurveTo(2, 0, 8, 3);
                targetCtx.stroke();
            } else if (variation === 1) {
                targetCtx.strokeStyle = "#166534";
                targetCtx.lineWidth = 2.5;
                targetCtx.lineCap = "round";
                targetCtx.lineJoin = "round";
                targetCtx.beginPath();
                targetCtx.moveTo(0, 7); targetCtx.lineTo(0, -6);
                targetCtx.moveTo(-4, -1); targetCtx.lineTo(-1, -1); targetCtx.lineTo(-1, -4);
                targetCtx.moveTo(4, 1); targetCtx.lineTo(1, 1); targetCtx.lineTo(1, -2);
                targetCtx.stroke();
            } else {
                targetCtx.strokeStyle = "#ca8a04";
                targetCtx.lineWidth = 0.8;
                targetCtx.beginPath();
                targetCtx.moveTo(-8, -2); targetCtx.lineTo(-3, 1); targetCtx.lineTo(2, -3); targetCtx.lineTo(7, 2);
                targetCtx.moveTo(-3, 1); targetCtx.lineTo(0, 6);
                targetCtx.moveTo(2, -3); targetCtx.lineTo(1, -8);
                targetCtx.stroke();
            }
        }
        else if (type === "swamp") {
            // Pantanos (Charco / Tronco muerto / Arbustos oscuros)
            if (variation === 0) {
                targetCtx.fillStyle = "#1e293b";
                targetCtx.beginPath();
                targetCtx.ellipse(0, 3, 9, 3.5, 0, 0, Math.PI * 2);
                targetCtx.fill();
                
                targetCtx.strokeStyle = "#166534";
                targetCtx.lineWidth = 1.2;
                targetCtx.beginPath();
                targetCtx.moveTo(-3, 3); targetCtx.lineTo(-4, -4);
                targetCtx.moveTo(-1, 3); targetCtx.lineTo(-1, -6);
                targetCtx.moveTo(3, 4); targetCtx.lineTo(4, -3);
                targetCtx.stroke();
            } else if (variation === 1) {
                targetCtx.strokeStyle = "#18181b";
                targetCtx.lineWidth = 2.5;
                targetCtx.lineCap = "round";
                targetCtx.beginPath();
                targetCtx.moveTo(0, 7); targetCtx.lineTo(0, -5);
                targetCtx.moveTo(0, -1); targetCtx.lineTo(-4, -5);
                targetCtx.moveTo(0, -3); targetCtx.lineTo(3, -6);
                targetCtx.stroke();
            } else {
                targetCtx.fillStyle = "#064e3b";
                targetCtx.strokeStyle = "#166534";
                targetCtx.beginPath();
                targetCtx.arc(-2, 4, 4, Math.PI, 0);
                targetCtx.arc(2, 4, 3, Math.PI, 0);
                targetCtx.closePath();
                targetCtx.fill();
                targetCtx.stroke();
            }
        }
        else if (type === "ocean") {
            // Océano (Olas / Isla de arrecife / Remolino)
            if (variation === 0) {
                targetCtx.strokeStyle = "#93c5fd";
                targetCtx.lineWidth = 1.2;
                targetCtx.lineCap = "round";
                targetCtx.beginPath();
                targetCtx.moveTo(-7, -3); targetCtx.quadraticCurveTo(-3, -5, 1, -3); targetCtx.quadraticCurveTo(5, -1, 9, -3);
                targetCtx.moveTo(-5, 3); targetCtx.quadraticCurveTo(-1, 1, 3, 3); targetCtx.quadraticCurveTo(7, 5, 11, 3);
                targetCtx.stroke();
            } else if (variation === 1) {
                targetCtx.fillStyle = "#fef08a"; // coral sand
                targetCtx.beginPath();
                targetCtx.ellipse(-1, -1, 4.5, 2.5, Math.PI / 6, 0, Math.PI * 2);
                targetCtx.fill();
                
                targetCtx.strokeStyle = "#78350f"; // palm trunk
                targetCtx.lineWidth = 1.2;
                targetCtx.beginPath();
                targetCtx.moveTo(-1, 1); targetCtx.quadraticCurveTo(-3, -1, -3, -4);
                targetCtx.stroke();
                
                targetCtx.strokeStyle = "#16a34a"; // palm leaves
                targetCtx.lineWidth = 0.8;
                targetCtx.beginPath();
                targetCtx.moveTo(-3, -4); targetCtx.lineTo(-6, -3);
                targetCtx.moveTo(-3, -4); targetCtx.lineTo(-1, -5);
                targetCtx.moveTo(-3, -4); targetCtx.lineTo(-4, -6);
                targetCtx.stroke();
            } else {
                targetCtx.strokeStyle = "#60a5fa";
                targetCtx.lineWidth = 1.2;
                targetCtx.beginPath();
                targetCtx.arc(0, 0, 7, 0, Math.PI * 1.4);
                targetCtx.stroke();
                targetCtx.beginPath();
                targetCtx.arc(0, 0, 3.5, Math.PI * 0.4, Math.PI * 1.8);
                targetCtx.stroke();
            }
        }
        else if (type === "hills") {
            // Colinas (Lomas / Loma de cueva / Colinas de piedra)
            if (variation === 0) {
                targetCtx.fillStyle = "#65a30d";
                targetCtx.strokeStyle = "#365314";
                targetCtx.lineWidth = 1.5;
                targetCtx.beginPath(); targetCtx.arc(-4, 5, 5, Math.PI, 0); targetCtx.closePath(); targetCtx.fill(); targetCtx.stroke();
                targetCtx.beginPath(); targetCtx.arc(3, 5, 4.2, Math.PI, 0); targetCtx.closePath(); targetCtx.fill(); targetCtx.stroke();
            } else if (variation === 1) {
                targetCtx.fillStyle = "#4d7c0f";
                targetCtx.strokeStyle = "#0f172a";
                targetCtx.lineWidth = 1.5;
                targetCtx.beginPath(); targetCtx.arc(0, 5, 7, Math.PI, 0); targetCtx.closePath(); targetCtx.fill(); targetCtx.stroke();
                targetCtx.fillStyle = "#020617";
                targetCtx.beginPath(); targetCtx.arc(0, 5, 2.5, Math.PI, 0); targetCtx.closePath(); targetCtx.fill();
            } else {
                targetCtx.fillStyle = "#71717a";
                targetCtx.strokeStyle = "#27272a";
                targetCtx.lineWidth = 1.5;
                targetCtx.beginPath();
                targetCtx.moveTo(-8, 5); targetCtx.lineTo(-3, -2); targetCtx.lineTo(3, 1);
                targetCtx.lineTo(7, -3); targetCtx.lineTo(9, 5);
                targetCtx.closePath(); targetCtx.fill(); targetCtx.stroke();
            }
        }
        else if (type === "snow") {
            // Nieve (Cristales de hielo / Campo nevado / Témpano)
            if (variation === 0) {
                // Ice crystals / snowflake
                targetCtx.strokeStyle = "rgba(186, 230, 253, 0.8)";
                targetCtx.lineWidth = 1.2; targetCtx.lineCap = "round";
                for (let a = 0; a < 3; a++) {
                    const angle = (a * Math.PI) / 3;
                    targetCtx.beginPath();
                    targetCtx.moveTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
                    targetCtx.lineTo(Math.cos(angle + Math.PI) * 8, Math.sin(angle + Math.PI) * 8);
                    targetCtx.stroke();
                    targetCtx.beginPath();
                    targetCtx.moveTo(Math.cos(angle) * 4, Math.sin(angle) * 4);
                    targetCtx.lineTo(Math.cos(angle + Math.PI / 6) * 7, Math.sin(angle + Math.PI / 6) * 7);
                    targetCtx.stroke();
                }
            } else if (variation === 1) {
                // Snowy mounds
                targetCtx.fillStyle = "rgba(224, 242, 254, 0.7)";
                targetCtx.strokeStyle = "rgba(147, 197, 253, 0.5)";
                targetCtx.lineWidth = 1;
                targetCtx.beginPath(); targetCtx.arc(-5, 4, 5, Math.PI, 0); targetCtx.closePath(); targetCtx.fill(); targetCtx.stroke();
                targetCtx.beginPath(); targetCtx.arc(4, 4, 4, Math.PI, 0); targetCtx.closePath(); targetCtx.fill(); targetCtx.stroke();
            } else {
                // Cracked ice sheet
                targetCtx.strokeStyle = "rgba(147, 197, 253, 0.6)";
                targetCtx.lineWidth = 0.8;
                targetCtx.beginPath();
                targetCtx.moveTo(-8, -4); targetCtx.lineTo(-2, 0); targetCtx.lineTo(5, -3);
                targetCtx.moveTo(-2, 0); targetCtx.lineTo(1, 7);
                targetCtx.moveTo(5, -3); targetCtx.lineTo(9, 2);
                targetCtx.stroke();
            }
        }
        else if (type === "jungle") {
            // Jungla (Palmas / Helechos / Dosel denso)
            if (variation === 0) {
                // Palm tree
                targetCtx.strokeStyle = "#7c3d12";
                targetCtx.lineWidth = 2; targetCtx.lineCap = "round";
                targetCtx.beginPath(); targetCtx.moveTo(0, 8); targetCtx.quadraticCurveTo(2, 0, 0, -5); targetCtx.stroke();
                targetCtx.strokeStyle = "#16a34a"; targetCtx.lineWidth = 1.5;
                const palmLeaves = [[-10,-8],[10,-6],[0,-12],[-6,-5],[7,-10]];
                palmLeaves.forEach(([lx,ly]) => {
                    targetCtx.beginPath(); targetCtx.moveTo(0,-5); targetCtx.quadraticCurveTo(lx/2, ly/2, lx, ly); targetCtx.stroke();
                });
            } else if (variation === 1) {
                // Giant ferns
                targetCtx.strokeStyle = "#15803d"; targetCtx.lineWidth = 1.2; targetCtx.lineCap = "round";
                [[-6,6],[-2,8],[2,7],[6,6]].forEach(([fx,fy]) => {
                    targetCtx.beginPath(); targetCtx.moveTo(fx, fy); targetCtx.quadraticCurveTo(fx-1, fy-5, fx+2, fy-9); targetCtx.stroke();
                    targetCtx.beginPath(); targetCtx.moveTo(fx, fy-4); targetCtx.lineTo(fx-3, fy-6); targetCtx.stroke();
                    targetCtx.beginPath(); targetCtx.moveTo(fx+1, fy-6); targetCtx.lineTo(fx+4, fy-7); targetCtx.stroke();
                });
            } else {
                // Dense canopy
                targetCtx.fillStyle = "#14532d"; targetCtx.strokeStyle = "rgba(0,0,0,0.3)"; targetCtx.lineWidth = 1;
                targetCtx.beginPath(); targetCtx.arc(-5, -1, 6, 0, Math.PI * 2); targetCtx.fill(); targetCtx.stroke();
                targetCtx.beginPath(); targetCtx.arc(5, -1, 6, 0, Math.PI * 2); targetCtx.fill(); targetCtx.stroke();
                targetCtx.beginPath(); targetCtx.arc(0, -6, 5.5, 0, Math.PI * 2); targetCtx.fill(); targetCtx.stroke();
                targetCtx.fillStyle = "#166534";
                targetCtx.beginPath(); targetCtx.arc(0, 2, 4, 0, Math.PI * 2); targetCtx.fill();
            }
        }
        else if (type === "coast") {
            // Costa / Playa (Orilla arenosa / Rocas costeras / Palmera de playa)
            if (variation === 0) {
                // Sandy ripples
                targetCtx.strokeStyle = "#b45309"; targetCtx.lineWidth = 1; targetCtx.lineCap = "round";
                targetCtx.beginPath(); targetCtx.moveTo(-8, -2); targetCtx.quadraticCurveTo(-2,-5, 4,-2); targetCtx.stroke();
                targetCtx.beginPath(); targetCtx.moveTo(-6, 3); targetCtx.quadraticCurveTo(0, 0, 6, 3); targetCtx.stroke();
                // small pebble
                targetCtx.fillStyle = "#92400e";
                targetCtx.beginPath(); targetCtx.ellipse(-3, 6, 2.5, 1.5, 0.3, 0, Math.PI*2); targetCtx.fill();
            } else if (variation === 1) {
                // Coastal rocks with foam
                targetCtx.fillStyle = "#78716c"; targetCtx.strokeStyle = "#44403c"; targetCtx.lineWidth = 1;
                targetCtx.beginPath(); targetCtx.arc(-5, 3, 4, 0, Math.PI * 2); targetCtx.fill(); targetCtx.stroke();
                targetCtx.beginPath(); targetCtx.arc(4, 2, 3, 0, Math.PI * 2); targetCtx.fill(); targetCtx.stroke();
                targetCtx.strokeStyle = "rgba(255,255,255,0.5)"; targetCtx.lineWidth = 1.2;
                targetCtx.beginPath(); targetCtx.moveTo(-8,-2); targetCtx.quadraticCurveTo(-2,-4, 4,-1); targetCtx.stroke();
            } else {
                // Beach palm
                targetCtx.strokeStyle = "#92400e"; targetCtx.lineWidth = 1.8; targetCtx.lineCap = "round";
                targetCtx.beginPath(); targetCtx.moveTo(-3, 8); targetCtx.quadraticCurveTo(0, 2, 3, -4); targetCtx.stroke();
                targetCtx.strokeStyle = "#15803d"; targetCtx.lineWidth = 1.5;
                [[3,-4],[9,-6],[3,-4],[-3,-8],[3,-4],[7,-1]].reduce((prev, cur, i) => {
                    if (i % 2 === 0) { targetCtx.beginPath(); targetCtx.moveTo(cur[0], cur[1]); }
                    else { targetCtx.lineTo(cur[0], cur[1]); targetCtx.stroke(); }
                    return cur;
                }, []);
            }
        }
        else if (type === "volcanic") {
            // Volcánico (Grieta de lava / Roca ardiente / Géiser)
            if (variation === 0) {
                // Lava cracks
                targetCtx.strokeStyle = "#f97316"; targetCtx.lineWidth = 1.5; targetCtx.lineCap = "round";
                targetCtx.beginPath(); targetCtx.moveTo(-8, 6); targetCtx.lineTo(-3, 0); targetCtx.lineTo(1, 4); targetCtx.lineTo(5, -4); targetCtx.lineTo(8, -1); targetCtx.stroke();
                targetCtx.strokeStyle = "#ef4444"; targetCtx.lineWidth = 0.8;
                targetCtx.beginPath(); targetCtx.moveTo(-3, 0); targetCtx.lineTo(-1, -5); targetCtx.stroke();
                // glow dot
                targetCtx.fillStyle = "rgba(251, 191, 36, 0.6)";
                targetCtx.beginPath(); targetCtx.arc(-3, 0, 2, 0, Math.PI * 2); targetCtx.fill();
            } else if (variation === 1) {
                // Volcanic rock pillar
                targetCtx.fillStyle = "#292524"; targetCtx.strokeStyle = "#ef4444"; targetCtx.lineWidth = 1;
                targetCtx.beginPath(); targetCtx.moveTo(-4,8); targetCtx.lineTo(-6,-2); targetCtx.lineTo(0,-7); targetCtx.lineTo(6,-2); targetCtx.lineTo(4,8); targetCtx.closePath(); targetCtx.fill(); targetCtx.stroke();
                targetCtx.fillStyle = "#f97316";
                targetCtx.beginPath(); targetCtx.arc(0,-7, 2.5, 0, Math.PI * 2); targetCtx.fill();
            } else {
                // Fumarole / gas vent
                targetCtx.fillStyle = "#44403c"; targetCtx.strokeStyle = "#1c1917"; targetCtx.lineWidth = 1;
                targetCtx.beginPath(); targetCtx.ellipse(0, 5, 4, 2, 0, 0, Math.PI * 2); targetCtx.fill(); targetCtx.stroke();
                targetCtx.strokeStyle = "rgba(156,163,175,0.5)"; targetCtx.lineWidth = 1.5; targetCtx.lineCap = "round";
                targetCtx.beginPath(); targetCtx.moveTo(0, 3); targetCtx.quadraticCurveTo(-2, -2, 0, -7); targetCtx.stroke();
                targetCtx.beginPath(); targetCtx.moveTo(0, 3); targetCtx.quadraticCurveTo(3, -1, 2, -8); targetCtx.stroke();
            }
        }
        else if (type === "tundra") {
            // Tundra (Tierra helada / Arbusto ártico / Permafrost)
            if (variation === 0) {
                // Frozen earth cracks
                targetCtx.strokeStyle = "rgba(148, 163, 184, 0.6)"; targetCtx.lineWidth = 0.8;
                targetCtx.beginPath();
                targetCtx.moveTo(-9,0); targetCtx.lineTo(-2,3); targetCtx.lineTo(4,-2); targetCtx.lineTo(9,4);
                targetCtx.moveTo(-2,3); targetCtx.lineTo(0,-4);
                targetCtx.stroke();
            } else if (variation === 1) {
                // Arctic shrub
                targetCtx.fillStyle = "#6b7280"; targetCtx.strokeStyle = "#374151"; targetCtx.lineWidth = 1;
                targetCtx.beginPath(); targetCtx.arc(-3, 3, 4, 0, Math.PI*2); targetCtx.fill(); targetCtx.stroke();
                targetCtx.beginPath(); targetCtx.arc(4, 4, 3, 0, Math.PI*2); targetCtx.fill(); targetCtx.stroke();
                // frost dots
                targetCtx.fillStyle = "rgba(224,242,254,0.7)";
                [[-3,-1],[4,2],[0,0],[-5,5]].forEach(([dx,dy]) => { targetCtx.beginPath(); targetCtx.arc(dx,dy,0.8,0,Math.PI*2); targetCtx.fill(); });
            } else {
                // Permafrost ice lens
                targetCtx.fillStyle = "rgba(186,230,253,0.35)"; targetCtx.strokeStyle = "rgba(147,197,253,0.5)"; targetCtx.lineWidth = 1;
                targetCtx.beginPath(); targetCtx.ellipse(0, 2, 8, 4, 0, 0, Math.PI*2); targetCtx.fill(); targetCtx.stroke();
                targetCtx.strokeStyle = "rgba(147,197,253,0.3)"; targetCtx.lineWidth = 0.7;
                targetCtx.beginPath(); targetCtx.moveTo(-4,2); targetCtx.lineTo(4,2); targetCtx.stroke();
            }
        }
        else if (type === "river") {
            // Río (Corriente / Rápidos / Meandro)
            if (variation === 0) {
                // Flowing stream
                targetCtx.strokeStyle = "#60a5fa"; targetCtx.lineWidth = 1.8; targetCtx.lineCap = "round";
                targetCtx.beginPath(); targetCtx.moveTo(-10, 2); targetCtx.bezierCurveTo(-4,-3, 4,7, 10, 2); targetCtx.stroke();
                targetCtx.strokeStyle = "#93c5fd"; targetCtx.lineWidth = 0.8;
                targetCtx.beginPath(); targetCtx.moveTo(-10, 2); targetCtx.bezierCurveTo(-4,-1, 4,4, 10, 2); targetCtx.stroke();
            } else if (variation === 1) {
                // Rapids / foam
                targetCtx.strokeStyle = "#3b82f6"; targetCtx.lineWidth = 1.5; targetCtx.lineCap = "round";
                targetCtx.beginPath(); targetCtx.moveTo(-10,-2); targetCtx.lineTo(10,-2); targetCtx.stroke();
                targetCtx.beginPath(); targetCtx.moveTo(-10,3); targetCtx.lineTo(10,3); targetCtx.stroke();
                targetCtx.fillStyle = "rgba(255,255,255,0.5)";
                [[-4,0],[0,1],[5,-1]].forEach(([rx,ry]) => { targetCtx.beginPath(); targetCtx.ellipse(rx,ry,1.5,0.8,0.3,0,Math.PI*2); targetCtx.fill(); });
            } else {
                // River bend with bank
                targetCtx.strokeStyle = "#2563eb"; targetCtx.lineWidth = 2;
                targetCtx.beginPath(); targetCtx.moveTo(-10,6); targetCtx.quadraticCurveTo(0,-8,10,6); targetCtx.stroke();
                targetCtx.fillStyle = "#d97706";
                targetCtx.beginPath(); targetCtx.arc(-8,5,1.5,0,Math.PI*2); targetCtx.fill();
                targetCtx.beginPath(); targetCtx.arc(8,5,1.5,0,Math.PI*2); targetCtx.fill();
            }
        }
        targetCtx.restore();
    }

    // --- RENDERING CANVAS ENGINE ---
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 0. Draw Background Image Layer (if enabled)
        if (state.bgImage && state.showBg) {
            if (cachedBgSrc !== state.bgImage) {
                cachedBgImg = new Image();
                cachedBgImg.src = state.bgImage;
                cachedBgImg.onload = () => {
                    cachedBgSrc = state.bgImage;
                    draw();
                };
            }
            
            if (cachedBgImg && cachedBgImg.complete && cachedBgImg.naturalWidth !== 0) {
                ctx.save();
                ctx.globalAlpha = state.bgOpacity !== undefined ? state.bgOpacity : 0.8;
                ctx.drawImage(
                    cachedBgImg, 
                    state.bgX || 0, 
                    state.bgY || 0, 
                    cachedBgImg.width * (state.bgScale || 1.0), 
                    cachedBgImg.height * (state.bgScale || 1.0)
                );
                ctx.restore();
            }
        }
        
        // 1. Draw Terrain Layer (if opacity is less than 1.0 or showBg is false)
        if (!state.showBg || !state.bgImage || state.bgOpacity < 1.0) {
            drawTerrain(ctx);
        }
        
        // 1.5 Dyson Logos overlay (B&W classic cartography)
        if (dysonMode) {
            drawDysonOverlay(ctx);
        }

        // 2. Draw Grid Lines (if enabled)
        if (chkShowGrid.checked) {
            drawGridLines(ctx);
        }
        
        // 3. Draw Walls
        drawWalls(ctx);
        
        // 4. Draw Stamps (Fichas / Objetos)
        drawStamps(ctx);
        
        // 4.5. Draw Weather effects (if active)
        if (state.weather && weatherSystem) {
            weatherSystem.draw(ctx);
        }
        
        // 5. Draw Fog of War Layer
        drawFog(ctx);
        
        // 6. Draw Previews & UI Guides (e.g. wall draft, brush hover)
        drawUIPreviews(ctx);
    }

    // --- DYSON LOGOS STYLE OVERLAY ---
    // Classic B&W hand-drawn dungeon cartography aesthetic
    function drawDysonOverlay(targetCtx) {
        const size   = state.cellSize;
        const mode   = mapModeSelect?.value || "combat";
        const CREAM  = "#f5f0e8";  // parchment floor
        const BLACK  = "#0e0e0e";  // ink wall
        const BORDER = "#c8c0b0";  // light stone

        // Create hatch pattern (diagonal lines at 45°)
        const hatchCanvas = document.createElement("canvas");
        hatchCanvas.width = hatchCanvas.height = 8;
        const hc = hatchCanvas.getContext("2d");
        hc.strokeStyle = "#1a1a1a";
        hc.lineWidth = 0.8;
        hc.beginPath();
        hc.moveTo(0, 8); hc.lineTo(8, 0);
        hc.moveTo(-2, 2); hc.lineTo(2, -2);
        hc.moveTo(6, 10); hc.lineTo(10, 6);
        hc.stroke();
        hc.strokeStyle = "#0e0e0e";
        hc.lineWidth = 0.7;
        hc.beginPath();
        hc.moveTo(0, 0); hc.lineTo(8, 8);
        hc.moveTo(-2, 6); hc.lineTo(2, 10);
        hc.moveTo(6, -2); hc.lineTo(10, 2);
        hc.stroke();
        const hatchPattern = targetCtx.createPattern(hatchCanvas, "repeat");

        if (mode === "combat") {
            // Square grid dungeon map
            for (let r = 0; r < state.rows; r++) {
                for (let c = 0; c < state.cols; c++) {
                    const idx  = r * state.cols + c;
                    const cell = state.terrain[idx];
                    const type = (cell && typeof cell === "object") ? cell.type : (cell || "abyss");
                    const x = c * size, y = r * size;

                    if (type === "abyss") {
                        // Solid black + cross-hatch
                        targetCtx.fillStyle = BLACK;
                        targetCtx.fillRect(x, y, size, size);
                        targetCtx.fillStyle = hatchPattern;
                        targetCtx.globalAlpha = 0.35;
                        targetCtx.fillRect(x, y, size, size);
                        targetCtx.globalAlpha = 1;
                    } else if (type === "stone") {
                        // Stone border — gray
                        targetCtx.fillStyle = BORDER;
                        targetCtx.fillRect(x, y, size, size);
                    } else {
                        // Walkable floor — parchment cream
                        targetCtx.fillStyle = CREAM;
                        targetCtx.fillRect(x, y, size, size);
                        // Subtle floor stippling dots every 4 cells
                        if ((c + r) % 4 === 0) {
                            targetCtx.fillStyle = "rgba(160,150,130,0.3)";
                            targetCtx.beginPath();
                            targetCtx.arc(x + size * 0.5, y + size * 0.5, 1.5, 0, Math.PI * 2);
                            targetCtx.fill();
                        }
                    }
                }
            }
        } else {
            // Hex/region map — parchment wash
            targetCtx.fillStyle = "rgba(245,240,232,0.55)";
            targetCtx.fillRect(0, 0, state.cols * size, state.rows * size);
        }

        // Ink walls (thicker in Dyson mode)
        targetCtx.save();
        for (const w of state.walls) {
            const s = state.cellSize;
            targetCtx.beginPath();
            targetCtx.moveTo(w.x1 * s, w.y1 * s);
            targetCtx.lineTo(w.x2 * s, w.y2 * s);
            targetCtx.strokeStyle = "#000";
            targetCtx.lineWidth = (w.width || 8) * 1.4;
            targetCtx.lineCap = "square";
            targetCtx.stroke();
        }
        targetCtx.restore();
    }

    function drawTerrain(targetCtx = ctx) {
        const size = state.cellSize;
        const mode = mapModeSelect?.value || "combat";
        
        if (mode === "hex" || mode === "region") {
            const radius = size / 2;
            const spacingX = radius * Math.sqrt(3);
            const spacingY = radius * 1.5;
            
            for (let r = 0; r < state.rows; r++) {
                for (let c = 0; c < state.cols; c++) {
                    const idx = r * state.cols + c;
                    const cell = state.terrain[idx];
                    const type = (cell && typeof cell === "object") ? cell.type : cell;
                    const variation = (cell && typeof cell === "object") ? cell.variation : 0;
                    
                    const cx = c * spacingX + (r % 2) * (spacingX / 2) + spacingX / 2;
                    const cy = r * spacingY + radius;
                    
                    let fillStyle = "#363943";
                    let strokeStyle = (mode === "region") ? "rgba(0, 0, 0, 0.04)" : "rgba(0, 0, 0, 0.15)";
                    
                    if (mode === "region") {
                        switch (type) {
                            case "plains":   fillStyle = "#9cd37b"; break;
                            case "forest":   fillStyle = "#1b4e33"; break;
                            case "mountain": fillStyle = "#788896"; break;
                            case "desert":   fillStyle = "#ebd07d"; break;
                            case "swamp":    fillStyle = "#2e3b2b"; break;
                            case "ocean":    fillStyle = "#2060b0"; break;
                            case "hills":    fillStyle = "#b0cf5a"; break;
                            case "snow":     fillStyle = "#cfe8f7"; break;
                            case "jungle":   fillStyle = "#0f3d1a"; break;
                            case "coast":    fillStyle = "#d4a44c"; break;
                            case "volcanic": fillStyle = "#3d1010"; break;
                            case "tundra":   fillStyle = "#8796a0"; break;
                            case "river":    fillStyle = "#3172c8"; break;
                            default: fillStyle = "#9cd37b"; break;
                        }
                    } else {
                        switch (type) {
                            case "stone": fillStyle = "#363943"; break;
                            case "wood": fillStyle = "#6d3e1d"; break;
                            case "grass": fillStyle = "#24502f"; break;
                            case "water": fillStyle = "#152e70"; break;
                            case "lava": fillStyle = "#9c1a08"; break;
                            case "abyss": fillStyle = "#07080b"; break;
                            default: fillStyle = "#363943"; break;
                        }
                    }
                    
                    // Use radius + 0.5 to prevent pixel rendering gaps between cells
                    drawHexCell(targetCtx, cx, cy, radius + 0.5, fillStyle, strokeStyle, 1);
                    
                    if (mode === "region") {
                        drawBiomeDecoration(targetCtx, type, variation, cx, cy, radius);
                    } else {
                        // Draw centered details for combat hexes
                        targetCtx.save();
                        targetCtx.translate(cx, cy);
                        if (type === "water") {
                            targetCtx.strokeStyle = "#2144a0";
                            targetCtx.lineWidth = 1.5;
                            targetCtx.lineCap = "round";
                            targetCtx.beginPath();
                            targetCtx.moveTo(-6, -2);
                            targetCtx.quadraticCurveTo(0, -5, 6, -2);
                            targetCtx.moveTo(-4, 3);
                            targetCtx.quadraticCurveTo(0, 1, 4, 3);
                            targetCtx.stroke();
                        } else if (type === "lava") {
                            targetCtx.strokeStyle = "#e04e0b";
                            targetCtx.lineWidth = 2;
                            targetCtx.beginPath();
                            targetCtx.moveTo(-8, -2); targetCtx.lineTo(0, 4); targetCtx.lineTo(8, -2);
                            targetCtx.stroke();
                            targetCtx.fillStyle = "#facc15";
                            targetCtx.beginPath();
                            targetCtx.arc(0, 0, 2, 0, Math.PI * 2);
                            targetCtx.fill();
                        } else if (type === "grass") {
                            targetCtx.strokeStyle = "#2f633b";
                            targetCtx.lineWidth = 1.5;
                            targetCtx.lineCap = "round";
                            targetCtx.beginPath();
                            targetCtx.moveTo(-3, 3); targetCtx.lineTo(-1, -3);
                            targetCtx.moveTo(0, 3); targetCtx.lineTo(2, -3);
                            targetCtx.stroke();
                        } else if (type === "wood") {
                            targetCtx.strokeStyle = "#4d2912";
                            targetCtx.lineWidth = 1;
                            targetCtx.beginPath();
                            targetCtx.moveTo(-radius * 0.7, -4); targetCtx.lineTo(radius * 0.7, -4);
                            targetCtx.moveTo(-radius * 0.7, 4); targetCtx.lineTo(radius * 0.7, 4);
                            targetCtx.stroke();
                        } else if (type === "stone") {
                            targetCtx.strokeStyle = "#40434e";
                            targetCtx.lineWidth = 1;
                            targetCtx.beginPath();
                            targetCtx.moveTo(-5, -5); targetCtx.lineTo(5, 5);
                            targetCtx.stroke();
                        }
                        targetCtx.restore();
                    }
                }
            }
        } else {
            for (let r = 0; r < state.rows; r++) {
                for (let c = 0; c < state.cols; c++) {
                    const idx = r * state.cols + c;
                    const cell = state.terrain[idx];
                    const type = (cell && typeof cell === "object") ? cell.type : cell;
                    const x = c * size;
                    const y = r * size;
                    
                    switch (type) {
                        case "stone":
                            targetCtx.fillStyle = "#363943";
                            targetCtx.fillRect(x, y, size, size);
                            targetCtx.strokeStyle = "#2b2e36";
                            targetCtx.lineWidth = 1;
                            targetCtx.strokeRect(x, y, size, size);
                            targetCtx.strokeStyle = "#40434e";
                            targetCtx.beginPath();
                            targetCtx.moveTo(x + 5, y + 5); targetCtx.lineTo(x + 15, y + 8);
                            targetCtx.moveTo(x + size - 15, y + size - 8); targetCtx.lineTo(x + size - 5, y + size - 5);
                            targetCtx.stroke();
                            break;
                            
                        case "wood":
                            targetCtx.fillStyle = "#6d3e1d";
                            targetCtx.fillRect(x, y, size, size);
                            targetCtx.strokeStyle = "#4d2912";
                            targetCtx.lineWidth = 1.5;
                            targetCtx.beginPath();
                            targetCtx.moveTo(x, y + size/3); targetCtx.lineTo(x + size, y + size/3);
                            targetCtx.moveTo(x, y + 2*size/3); targetCtx.lineTo(x + size, y + 2*size/3);
                            targetCtx.stroke();
                            
                            targetCtx.beginPath();
                            targetCtx.moveTo(x + size/2, y); targetCtx.lineTo(x + size/2, y + size/3);
                            targetCtx.moveTo(x + size/4, y + size/3); targetCtx.lineTo(x + size/4, y + 2*size/3);
                            targetCtx.moveTo(x + 3*size/4, y + 2*size/3); targetCtx.lineTo(x + 3*size/4, y + size);
                            targetCtx.stroke();
                            break;
                            
                        case "grass":
                            targetCtx.fillStyle = "#24502f";
                            targetCtx.fillRect(x, y, size, size);
                            targetCtx.strokeStyle = "#1b3c23";
                            targetCtx.lineWidth = 1;
                            targetCtx.strokeRect(x, y, size, size);
                            
                            targetCtx.strokeStyle = "#2f633b";
                            targetCtx.beginPath();
                            targetCtx.moveTo(x + 12, y + size/2); targetCtx.lineTo(x + 15, y + size/2 - 8);
                            targetCtx.moveTo(x + 18, y + size/2); targetCtx.lineTo(x + 21, y + size/2 - 8);
                            targetCtx.moveTo(x + size - 18, y + 15); targetCtx.lineTo(x + size - 15, y + 7);
                            targetCtx.stroke();
                            break;
                            
                        case "water":
                            targetCtx.fillStyle = "#152e70";
                            targetCtx.fillRect(x, y, size, size);
                            
                            targetCtx.strokeStyle = "#2144a0";
                            targetCtx.lineWidth = 1.5;
                            targetCtx.lineCap = "round";
                            targetCtx.beginPath();
                            targetCtx.moveTo(x + size/4, y + size/2); 
                            targetCtx.quadraticCurveTo(x + size/2, y + size/2 - 3, x + 3*size/4, y + size/2);
                            targetCtx.moveTo(x + size/8, y + size/4); 
                            targetCtx.quadraticCurveTo(x + size/4, y + size/4 - 2, x + 3*size/8, y + size/4);
                            targetCtx.moveTo(x + 5*size/8, y + 3*size/4); 
                            targetCtx.quadraticCurveTo(x + 3*size/4, y + 3*size/4 - 2, x + 7*size/8, y + 3*size/4);
                            targetCtx.stroke();
                            break;
                            
                        case "lava":
                            targetCtx.fillStyle = "#9c1a08";
                            targetCtx.fillRect(x, y, size, size);
                            
                            targetCtx.strokeStyle = "#e04e0b";
                            targetCtx.lineWidth = 2.5;
                            targetCtx.beginPath();
                            targetCtx.moveTo(x + size/3, y); targetCtx.lineTo(x + size/2, y + size/2); targetCtx.lineTo(x + size, y + 3*size/4);
                            targetCtx.moveTo(x, y + 2*size/3); targetCtx.lineTo(x + size/2, y + size/2);
                            targetCtx.stroke();
                            
                            targetCtx.fillStyle = "#facc15";
                            targetCtx.beginPath();
                            targetCtx.arc(x + size/2, y + size/2, 3, 0, Math.PI * 2);
                            targetCtx.fill();
                            break;
                            
                        case "abyss":
                            targetCtx.fillStyle = "#07080b";
                            targetCtx.fillRect(x, y, size, size);
                            break;
                    }
                }
            }
        }
    }

    function drawGridLines(targetCtx = ctx) {
        targetCtx.strokeStyle = "rgba(212, 175, 55, 0.12)"; // subtle gold grid lines
        targetCtx.lineWidth = 1;
        
        if (isHexMode()) {
            const radius = state.cellSize / 2;
            const spacingX = radius * Math.sqrt(3);
            const spacingY = radius * 1.5;
            
            for (let r = 0; r < state.rows; r++) {
                for (let c = 0; c < state.cols; c++) {
                    const cx = c * spacingX + (r % 2) * (spacingX / 2) + spacingX / 2;
                    const cy = r * spacingY + radius;
                    
                    targetCtx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const angle = (Math.PI / 180) * (60 * i - 30);
                        const px = cx + radius * Math.cos(angle);
                        const py = cy + radius * Math.sin(angle);
                        if (i === 0) targetCtx.moveTo(px, py);
                        else targetCtx.lineTo(px, py);
                    }
                    targetCtx.closePath();
                    targetCtx.stroke();
                }
            }
        } else {
            // Vertical lines
            for (let c = 0; c <= state.cols; c++) {
                targetCtx.beginPath();
                targetCtx.moveTo(c * state.cellSize, 0);
                targetCtx.lineTo(c * state.cellSize, canvas.height);
                targetCtx.stroke();
            }
            
            // Horizontal lines
            for (let r = 0; r <= state.rows; r++) {
                targetCtx.beginPath();
                targetCtx.moveTo(0, r * state.cellSize);
                targetCtx.lineTo(canvas.width, r * state.cellSize);
                targetCtx.stroke();
            }
        }
    }

    function drawWalls(targetCtx = ctx) {
        const size = state.cellSize;
        state.walls.forEach(w => {
            targetCtx.beginPath();
            targetCtx.moveTo(w.x1 * size, w.y1 * size);
            targetCtx.lineTo(w.x2 * size, w.y2 * size);
            targetCtx.lineWidth = w.width;
            targetCtx.strokeStyle = w.color;
            targetCtx.lineCap = "round";
            targetCtx.stroke();
            
            // Draw a inner highlight line to make the wall look 3D / drop-shadowed
            targetCtx.beginPath();
            targetCtx.moveTo(w.x1 * size, w.y1 * size);
            targetCtx.lineTo(w.x2 * size, w.y2 * size);
            targetCtx.lineWidth = Math.max(2, w.width / 4);
            targetCtx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            targetCtx.stroke();
        });
    }

    function drawEmojiGlyph(targetCtx, s, size) {
        targetCtx.font = `${s.size * size * 0.8}px Outfit, Arial, sans-serif`;
        targetCtx.textAlign = "center";
        targetCtx.textBaseline = "middle";
        targetCtx.shadowColor = "rgba(0, 0, 0, 0.45)";
        targetCtx.shadowBlur = 8;
        targetCtx.shadowOffsetY = 4;
        targetCtx.shadowOffsetX = 0;
        targetCtx.fillText(s.emoji, 0, 0);
    }

    function drawStamps(targetCtx = ctx) {
        const size = state.cellSize;
        const viewMode = viewModeSelect?.value || "gm";
        
        state.stamps.forEach(s => {
            // If we are in player view mode, hide all secret stamps
            if (viewMode === "player" && s.isSecret) {
                return;
            }
            
            const pos = getTokenCanvasPos(s);
            const canvasX = pos.x;
            const canvasY = pos.y;
            
            targetCtx.save();
            
            // If it is a secret stamp and we are in GM mode, render it translucent
            if (viewMode === "gm" && s.isSecret) {
                targetCtx.globalAlpha = 0.45;
            }
            
            targetCtx.translate(canvasX, canvasY);
            targetCtx.rotate(s.rotation * Math.PI / 180);
            
            // Selected stamp outline
            if (s.id === selectedStampId && activeTool === "stamp") {
                targetCtx.strokeStyle = "#d4af37";
                targetCtx.lineWidth = 2;
                targetCtx.setLineDash([4, 4]);
                targetCtx.beginPath();
                targetCtx.arc(0, 0, (s.size * size * (s.image ? 0.5 : 0.7)), 0, Math.PI * 2);
                targetCtx.stroke();
                
                // Directional pointer dot
                targetCtx.fillStyle = "#d4af37";
                targetCtx.beginPath();
                targetCtx.arc(0, -(s.size * size * (s.image ? 0.5 : 0.7)), 4, 0, Math.PI * 2);
                targetCtx.fill();
                targetCtx.setLineDash([]); // reset
            }

            // Draw Vision Ring under friendly tokens if Fog of War tool or stamp tool is selected
            if (s.isHero && chkDynamicFog.checked && (activeTool === "stamp" || activeTool === "fog")) {
                targetCtx.strokeStyle = "rgba(16, 185, 129, 0.35)"; // green soft ring
                targetCtx.lineWidth = 1.5;
                targetCtx.beginPath();
                targetCtx.arc(0, 0, s.visionRadius * size, 0, Math.PI * 2);
                targetCtx.stroke();
            }
            
            // Draw custom avatar image if set
            if (s.image) {
                let img = tokenImageCache[s.id];
                if (!img) {
                    img = new Image();
                    img.src = s.image;
                    img.onload = () => {
                        tokenImageCache[s.id] = img;
                        draw();
                    };
                    tokenImageCache[s.id] = img;
                }
                
                if (img.complete && img.naturalWidth !== 0) {
                    const radius = s.size * size * 0.45;
                    targetCtx.save();
                    targetCtx.beginPath();
                    targetCtx.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
                    targetCtx.clip();
                    targetCtx.drawImage(img, -radius * 0.9, -radius * 0.9, radius * 1.8, radius * 1.8);
                    targetCtx.restore();

                    // Token Border Frame
                    targetCtx.strokeStyle = s.isHero ? "#10b981" : "#ef4444";
                    targetCtx.lineWidth = Math.max(2.5, radius * 0.1);
                    targetCtx.shadowColor = "rgba(0, 0, 0, 0.45)";
                    targetCtx.shadowBlur = 8;
                    targetCtx.shadowOffsetY = 4;
                    targetCtx.shadowOffsetX = 0;
                    targetCtx.beginPath();
                    targetCtx.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
                    targetCtx.stroke();
                } else {
                    drawEmojiGlyph(targetCtx, s, size);
                }
            } else {
                drawEmojiGlyph(targetCtx, s, size);
            }
            
            targetCtx.restore();
            
            // --- DRAW NON-ROTATING LABELS & BARS (HP, NAMES, CONDITIONS) ---
            const tokenRadius = s.size * size * 0.5;
            
            // 1. Draw custom GM secret label
            if (viewMode === "gm" && s.isSecret) {
                targetCtx.save();
                targetCtx.font = "bold 9px Outfit, Arial, sans-serif";
                targetCtx.fillStyle = "#d4af37";
                targetCtx.textAlign = "center";
                targetCtx.textBaseline = "top";
                targetCtx.strokeStyle = "#000000";
                targetCtx.lineWidth = 2.5;
                targetCtx.strokeText("👁️ SECRETO", canvasX, canvasY + tokenRadius + (s.isToken ? 12 : 2));
                targetCtx.fillText("👁️ SECRETO", canvasX, canvasY + tokenRadius + (s.isToken ? 12 : 2));
                targetCtx.restore();
            }
            
            // 2. Draw custom token name
            if (s.name) {
                targetCtx.save();
                targetCtx.font = "bold 11px Outfit, Arial, sans-serif";
                targetCtx.textAlign = "center";
                targetCtx.textBaseline = "bottom";
                
                targetCtx.strokeStyle = "#000000";
                targetCtx.lineWidth = 3;
                targetCtx.strokeText(s.name, canvasX, canvasY - tokenRadius - 6);
                
                targetCtx.fillStyle = "#ffffff";
                targetCtx.fillText(s.name, canvasX, canvasY - tokenRadius - 6);
                targetCtx.restore();
            }
            
            // 3. Draw HP Bar
            if (s.isToken && s.hpMax > 0 && s.hpCurrent !== undefined) {
                targetCtx.save();
                const barWidth = Math.max(30, tokenRadius * 1.5);
                const barHeight = 4;
                const barX = canvasX - barWidth / 2;
                const barY = canvasY + tokenRadius + 4;
                
                // Background
                targetCtx.fillStyle = "#ef4444";
                targetCtx.fillRect(barX, barY, barWidth, barHeight);
                
                // Current HP ratio
                const ratio = Math.max(0, Math.min(1, s.hpCurrent / s.hpMax));
                targetCtx.fillStyle = "#10b981";
                targetCtx.fillRect(barX, barY, barWidth * ratio, barHeight);
                
                // Border
                targetCtx.strokeStyle = "#0d0e12";
                targetCtx.lineWidth = 1;
                targetCtx.strokeRect(barX, barY, barWidth, barHeight);
                targetCtx.restore();
            }
            
            // 4. Draw Status Condition badges
            if (s.conditions && s.conditions.length > 0) {
                targetCtx.save();
                let condIdx = 0;
                const condEmojiMap = {
                    dead: "💀",
                    burning: "🔥",
                    unconscious: "💤",
                    blessed: "🛡️",
                    poisoned: "🧪",
                    stunned: "😵"
                };
                
                s.conditions.forEach(cond => {
                    const emoji = condEmojiMap[cond];
                    if (emoji) {
                        const offsetX = tokenRadius - condIdx * 13;
                        const offsetY = -tokenRadius - (s.name ? 16 : 4);
                        
                        targetCtx.font = "12px Outfit, Arial, sans-serif";
                        targetCtx.textAlign = "center";
                        targetCtx.textBaseline = "middle";
                        
                        targetCtx.shadowColor = "rgba(0,0,0,0.85)";
                        targetCtx.shadowBlur = 4;
                        targetCtx.fillText(emoji, canvasX + offsetX, canvasY + offsetY);
                        condIdx++;
                    }
                });
                targetCtx.restore();
            }
        });
    }

    function drawFog(targetCtx = ctx) {
        const size = state.cellSize;
        const viewMode = viewModeSelect?.value || "gm";
        
        const hexMode = isHexMode();
        const fogFill = (viewMode === "gm") ? "rgba(6, 8, 12, 0.35)" : "rgba(6, 8, 12, 1.0)";
        
        for (let r = 0; r < state.rows; r++) {
            for (let c = 0; c < state.cols; c++) {
                const idx = r * state.cols + c;
                if (state.fog[idx]) {
                    if (hexMode) {
                        const center = getHexCenter(c, r);
                        const radius = size / 2;
                        drawHexCell(targetCtx, center.x, center.y, radius + 0.5, fogFill, null);
                    } else {
                        targetCtx.fillStyle = fogFill;
                        targetCtx.fillRect(c * size, r * size, size, size);
                    }
                }
            }
        }
    }

    function drawUIPreviews(targetCtx = ctx) {
        const size = state.cellSize;
        
        // 1. Wall drawing preview
        if (activeTool === "wall" && wallStart && isDrawing) {
            const startX = wallStart.x * size;
            const startY = wallStart.y * size;
            let endX, endY;
            if (isHexMode()) {
                const v = getClosestHexVertex(mouseGridPos.x * size, mouseGridPos.y * size);
                endX = v.x;
                endY = v.y;
            } else {
                endX = Math.round(mouseGridPos.x) * size;
                endY = Math.round(mouseGridPos.y) * size;
            }
            
            targetCtx.strokeStyle = "rgba(212, 175, 55, 0.5)"; // gold dashed preview
            targetCtx.lineWidth = parseInt(wallWidthInput.value);
            targetCtx.lineCap = "round";
            targetCtx.setLineDash([8, 6]);
            targetCtx.beginPath();
            targetCtx.moveTo(startX, startY);
            targetCtx.lineTo(endX, endY);
            targetCtx.stroke();
            targetCtx.setLineDash([]); // reset line dash
        }
        
        // 2. Terrain brush / Fog brush hover overlay
        if ((activeTool === "terrain" || activeTool === "fog") && isMouseOverCanvas()) {
            if (isHexMode()) {
                const center = getHexCenter(mouseCellPos.col, mouseCellPos.row);
                const radius = size / 2;
                drawHexCell(targetCtx, center.x, center.y, radius, "rgba(212, 175, 55, 0.08)", "rgba(212, 175, 55, 0.6)", 2);
            } else {
                const x = mouseCellPos.col * size;
                const y = mouseCellPos.row * size;
                
                targetCtx.strokeStyle = "rgba(212, 175, 55, 0.6)";
                targetCtx.lineWidth = 2;
                targetCtx.strokeRect(x, y, size, size);
                
                targetCtx.fillStyle = "rgba(212, 175, 55, 0.08)";
                targetCtx.fillRect(x, y, size, size);
            }
        }
        
        // 3. Stamp ghost placement preview
        if (activeTool === "stamp" && (activeStamp || activeStampImage) && !selectedStampId && isMouseOverCanvas()) {
            let x, y;
            if (isHexMode()) {
                const center = getHexCenter(mouseCellPos.col, mouseCellPos.row);
                x = center.x;
                y = center.y;
            } else {
                x = mouseCellPos.col * size + size/2;
                y = mouseCellPos.row * size + size/2;
            }
            
            targetCtx.save();
            targetCtx.translate(x, y);
            targetCtx.globalAlpha = 0.4;
            if (activeStampImage) {
                const img = new Image();
                img.src = activeStampImage;
                const previewSize = parseFloat(stampSizeInput.value) * size * 0.9;
                if (img.complete) {
                    targetCtx.drawImage(img, -previewSize / 2, -previewSize / 2, previewSize, previewSize);
                } else {
                    targetCtx.strokeStyle = "#d4af37";
                    targetCtx.strokeRect(-previewSize / 2, -previewSize / 2, previewSize, previewSize);
                    img.onload = draw;
                }
            } else {
                targetCtx.font = `${parseFloat(stampSizeInput.value) * size * 0.8}px Outfit, Arial, sans-serif`;
                targetCtx.textAlign = "center";
                targetCtx.textBaseline = "middle";
                targetCtx.fillText(activeStamp, 0, 0);
            }
            targetCtx.restore();
            
            // Small guide circle
            targetCtx.strokeStyle = "rgba(212, 175, 55, 0.3)";
            targetCtx.lineWidth = 1;
            targetCtx.beginPath();
            targetCtx.arc(x, y, size/2, 0, Math.PI * 2);
            targetCtx.stroke();
        }

        // 4. Ruler drawing preview
        if (activeTool === "ruler" && rulerStart) {
            let startX, startY, endX, endY, cells;
            const mode = mapModeSelect.value;
            const hexMode = isHexMode();
            
            if (hexMode) {
                const startCenter = getHexCenter(rulerStart.col, rulerStart.row);
                startX = startCenter.x;
                startY = startCenter.y;
                
                const endCenter = getHexCenter(mouseCellPos.col, mouseCellPos.row);
                endX = endCenter.x;
                endY = endCenter.y;
                
                const startCube = oddrToCube(rulerStart.col, rulerStart.row);
                const endCube = oddrToCube(mouseCellPos.col, mouseCellPos.row);
                cells = Math.max(
                    Math.abs(startCube.x - endCube.x),
                    Math.abs(startCube.y - endCube.y),
                    Math.abs(startCube.z - endCube.z)
                );
            } else {
                startX = rulerStart.x * size;
                startY = rulerStart.y * size;
                endX = mouseGridPos.x * size;
                endY = mouseGridPos.y * size;
                
                const dx = mouseGridPos.x - rulerStart.x;
                const dy = mouseGridPos.y - rulerStart.y;
                cells = Math.sqrt(dx * dx + dy * dy);
            }
            
            targetCtx.save();
            targetCtx.strokeStyle = "#d4af37";
            targetCtx.lineWidth = 3;
            targetCtx.beginPath();
            targetCtx.moveTo(startX, startY);
            targetCtx.lineTo(endX, endY);
            targetCtx.stroke();
            
            // Start/End point dots
            targetCtx.fillStyle = "#d4af37";
            targetCtx.beginPath();
            targetCtx.arc(startX, startY, 4, 0, Math.PI * 2);
            targetCtx.arc(endX, endY, 4, 0, Math.PI * 2);
            targetCtx.fill();
            
            let distText = "";
            if (mode === "region") {
                const isKm = state.travelScaleUnit === "km";
                let speedPerDay = 24;
                switch (state.travelMethod) {
                    case "foot": speedPerDay = isKm ? 40 : 24; break;
                    case "horse": speedPerDay = isKm ? 50 : 32; break;
                    case "wagon": speedPerDay = isKm ? 25 : 16; break;
                    case "ship": speedPerDay = isKm ? 80 : 48; break;
                    case "flying": speedPerDay = isKm ? 130 : 80; break;
                }
                const distance = cells * state.travelScaleValue;
                const travelDays = distance / speedPerDay;
                let timeText = "";
                if (travelDays >= 1.0) {
                    timeText = `${travelDays.toFixed(1)} días`;
                } else {
                    const hours = travelDays * 8;
                    timeText = `${hours.toFixed(1)} horas`;
                }
                distText = `${cells} hex (${distance.toFixed(1)} ${state.travelScaleUnit}) — ⏱️ ${timeText}`;
            } else if (mode === "hex") {
                const ft = Math.round(cells * 5);
                distText = `${cells} hex (${ft} ft)`;
            } else {
                const ft = Math.round(cells * 5);
                distText = `${cells.toFixed(1)} c (${ft} ft)`;
            }
            
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;
            
            // Draw background badge
            targetCtx.font = "bold 11px Outfit, Arial, sans-serif";
            targetCtx.textAlign = "center";
            targetCtx.textBaseline = "middle";
            const textWidth = targetCtx.measureText(distText).width;
            
            targetCtx.fillStyle = "rgba(13, 14, 18, 0.9)";
            targetCtx.strokeStyle = "#d4af37";
            targetCtx.lineWidth = 1;
            targetCtx.fillRect(midX - textWidth/2 - 6, midY - 10, textWidth + 12, 20);
            targetCtx.strokeRect(midX - textWidth/2 - 6, midY - 10, textWidth + 12, 20);
            
            targetCtx.fillStyle = "#f1cc5b";
            targetCtx.fillText(distText, midX, midY);
            targetCtx.restore();
        }
    }

    function isMouseOverCanvas() {
        return mouseCellPos.col >= 0 && mouseCellPos.col < state.cols &&
               mouseCellPos.row >= 0 && mouseCellPos.row < state.rows;
    }

    // --- CONTROLLER / INTERACTIONS ---
    function setupEventListeners() {
        // --- VTT HEAD ACTIONS ---
        mapTemplateSelect.addEventListener("change", (e) => {
            const name = e.target.value;
            if (!name) return;
            
            if (confirm("¿Quieres cargar esta plantilla? Esto sobrescribirá tu mapa actual.")) {
                if (name === "proceduralRegion") {
                    generateProceduralRegion();
                } else if (name === "proceduralDungeon") {
                    generateProceduralDungeon();
                } else if (name.startsWith("proceduralDungeon:")) {
                    generateProceduralDungeon(name.split(":")[1]);
                } else if (name.startsWith("cave:")) {
                    generateCellularAutomataCave(name.split(":")[1]);
                } else {
                    loadPresetTemplate(name);
                }
            }
            // Reset selector
            mapTemplateSelect.value = "";
        });

        mapModeSelect.addEventListener("change", (e) => {
            const mode = e.target.value;
            if (mode === "region") {
                chkShowGrid.checked = false;
            } else {
                chkShowGrid.checked = true;
            }
            syncUIForMapMode();
            draw();
        });

        // --- NAVIGATION CONTROLS ---
        btnZoomIn.addEventListener("click", () => adjustZoom(1.2));
        btnZoomOut.addEventListener("click", () => adjustZoom(1 / 1.2));
        btnZoomReset.addEventListener("click", () => {
            zoom = 1.0;
            centerMap();
        });

        // --- GRID CONTROLS ---
        btnApplyGridSize.addEventListener("click", () => {
            const cols = Math.max(5, Math.min(80, parseInt(gridColsInput.value) || 25));
            const rows = Math.max(5, Math.min(80, parseInt(gridRowsInput.value) || 20));
            
            gridColsInput.value = cols;
            gridRowsInput.value = rows;
            
            if (confirm(`¿Cambiar tamaño a ${cols}x${rows}? Esto reajustará el mapa.`)) {
                initMapState(cols, rows);
                centerMap();
                saveHistory();
                draw();
            }
        });
        chkShowGrid.addEventListener("change", draw);

        // --- TOOL SELECTION ---
        toolBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                selectTool(btn.dataset.tool);
            });
        });

        // --- TERRAIN SELECTOR ---
        terrainOptions.forEach(opt => {
            opt.addEventListener("click", () => {
                terrainOptions.forEach(o => o.classList.remove("active"));
                opt.classList.add("active");
                activeTerrain = opt.dataset.terrain;
            });
        });
        
        btnBrushPaint.addEventListener("click", () => {
            btnBrushPaint.classList.add("active");
            btnBrushFill.classList.remove("active");
            terrainPaintMode = "paint";
        });
        btnBrushFill.addEventListener("click", () => {
            btnBrushFill.classList.add("active");
            btnBrushPaint.classList.remove("active");
            terrainPaintMode = "fill";
        });

        // Brush size buttons
        document.querySelectorAll("#brushSizeGroup [data-brush-size]").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll("#brushSizeGroup [data-brush-size]").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                brushRadius = parseInt(btn.dataset.brushSize) || 0;
            });
        });

        // --- WALL INPUTS ---
        wallWidthInput.addEventListener("input", (e) => {
            wallWidthVal.textContent = `${e.target.value}px`;
        });

        // --- STAMP SELECTORS & CONTROLS ---
        tabBtns.forEach(tab => {
            tab.addEventListener("click", () => {
                tabBtns.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                
                tabContents.forEach(c => c.classList.remove("active"));
                document.getElementById(tab.dataset.tab).classList.add("active");
            });
        });

        stampItems.forEach(item => {
            item.addEventListener("click", () => {
                stampItems.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                
                activeStamp = item.dataset.emoji || "";
                activeStampImage = item.dataset.image || null;
                activeStampName = item.dataset.name || item.querySelector("small")?.textContent || "";
                activeStampDescription = item.dataset.description || "";
                selectedStampId = null;
                updateStampControlUI();
                draw();
            });
        });
        
        stampSizeInput.addEventListener("input", (e) => {
            const val = parseFloat(e.target.value);
            stampSizeVal.textContent = `${val.toFixed(1)}x`;
            if (selectedStampId) {
                const s = state.stamps.find(x => x.id === selectedStampId);
                if (s) {
                    s.size = val;
                    draw();
                }
            }
        });
        
        stampSizeInput.addEventListener("change", () => {
            if (selectedStampId) saveHistory();
        });

        stampRotationInput.addEventListener("input", (e) => {
            const val = parseInt(e.target.value);
            stampRotationVal.textContent = `${val}°`;
            if (selectedStampId) {
                const s = state.stamps.find(x => x.id === selectedStampId);
                if (s) {
                    s.rotation = val;
                    draw();
                }
            }
        });
        
        stampRotationInput.addEventListener("change", () => {
            if (selectedStampId) saveHistory();
        });

        // Stamp D&D tokens controllers
        tokenTypeSelect.addEventListener("change", (e) => {
            const type = e.target.value;
            if (selectedStampId) {
                const s = state.stamps.find(x => x.id === selectedStampId);
                if (s) {
                    if (type === "hero") {
                        s.isToken = true;
                        s.isHero = true;
                        s.visionRadius = parseInt(tokenVisionInput.value);
                        visionRadiusSetting.style.display = "flex";
                        // Show HP and Conditions settings for Hero
                        document.getElementById("tokenHpSetting").style.display = "flex";
                        document.getElementById("tokenConditionsSetting").style.display = "flex";
                        s.hpCurrent = s.hpCurrent || 20;
                        s.hpMax = s.hpMax || 20;
                        s.conditions = s.conditions || [];
                    } else if (type === "monster") {
                        s.isToken = true;
                        s.isHero = false;
                        s.visionRadius = 0;
                        visionRadiusSetting.style.display = "none";
                        // Show HP and Conditions settings for Monster
                        document.getElementById("tokenHpSetting").style.display = "flex";
                        document.getElementById("tokenConditionsSetting").style.display = "flex";
                        s.hpCurrent = s.hpCurrent || 15;
                        s.hpMax = s.hpMax || 15;
                        s.conditions = s.conditions || [];
                    } else {
                        s.isToken = false;
                        s.isHero = false;
                        s.visionRadius = 0;
                        visionRadiusSetting.style.display = "none";
                        // Hide HP and Conditions settings
                        document.getElementById("tokenHpSetting").style.display = "none";
                        document.getElementById("tokenConditionsSetting").style.display = "none";
                    }
                    revealFogAroundTokens();
                    saveHistory();
                    draw();
                }
            }
        });

        tokenVisionInput.addEventListener("input", (e) => {
            const val = parseInt(e.target.value);
            tokenVisionVal.textContent = `${val}c`;
            if (selectedStampId) {
                const s = state.stamps.find(x => x.id === selectedStampId);
                if (s && s.isHero) {
                    s.visionRadius = val;
                    revealFogAroundTokens();
                    draw();
                }
            }
        });

        tokenVisionInput.addEventListener("change", () => {
            if (selectedStampId) saveHistory();
        });

        // Custom token name, secret checkbox, HP and Conditions listeners
        tokenNameInput.addEventListener("input", (e) => {
            if (selectedStampId) {
                const s = state.stamps.find(x => x.id === selectedStampId);
                if (s) {
                    s.name = e.target.value;
                    draw();
                }
            }
        });
        tokenNameInput.addEventListener("change", () => {
            if (selectedStampId) saveHistory();
        });

        tokenIsSecretChk.addEventListener("change", (e) => {
            if (selectedStampId) {
                const s = state.stamps.find(x => x.id === selectedStampId);
                if (s) {
                    s.isSecret = e.target.checked;
                    draw();
                    saveHistory();
                }
            }
        });

        tokenHpCurrentInput.addEventListener("input", (e) => {
            if (selectedStampId) {
                const s = state.stamps.find(x => x.id === selectedStampId);
                if (s) {
                    s.hpCurrent = parseInt(e.target.value) || 0;
                    draw();
                }
            }
        });
        tokenHpCurrentInput.addEventListener("change", () => {
            if (selectedStampId) saveHistory();
        });

        tokenHpMaxInput.addEventListener("input", (e) => {
            if (selectedStampId) {
                const s = state.stamps.find(x => x.id === selectedStampId);
                if (s) {
                    s.hpMax = parseInt(e.target.value) || 0;
                    draw();
                }
            }
        });
        tokenHpMaxInput.addEventListener("change", () => {
            if (selectedStampId) saveHistory();
        });

        conditionChks.forEach(chk => {
            chk.addEventListener("change", () => {
                if (selectedStampId) {
                    const s = state.stamps.find(x => x.id === selectedStampId);
                    if (s) {
                        s.conditions = [];
                        conditionChks.forEach(c => {
                            if (c.checked) {
                                s.conditions.push(c.value);
                            }
                        });
                        draw();
                        saveHistory();
                    }
                }
            });
        });

        btnAddToInitiative.addEventListener("click", () => {
            if (selectedStampId) {
                const s = state.stamps.find(x => x.id === selectedStampId);
                if (s) {
                    const name = s.name || s.emoji;
                    const roll = Math.floor(Math.random() * 20) + 1;
                    const initVal = prompt(`Ingresa iniciativa para ${name} (d20 = ${roll}):`, roll.toString());
                    if (initVal !== null) {
                        addCreatureToInitiative(name, parseInt(initVal) || 0);
                    }
                }
            }
        });

        btnDeleteStamp.addEventListener("click", deleteSelectedStamp);
        btnDuplicateStamp.addEventListener("click", duplicateSelectedStamp);

        // --- FOG CONTROLS ---
        btnFogAdd.addEventListener("click", () => {
            btnFogAdd.classList.add("active");
            btnFogRemove.classList.remove("active");
            activeFogMode = "add";
        });
        btnFogRemove.addEventListener("click", () => {
            btnFogRemove.classList.add("active");
            btnFogAdd.classList.remove("active");
            activeFogMode = "remove";
        });
        btnFogAll.addEventListener("click", () => {
            state.fog.fill(true);
            revealFogAroundTokens();
            saveHistory();
            draw();
        });
        btnFogClear.addEventListener("click", () => {
            state.fog.fill(false);
            saveHistory();
            draw();
        });
        chkDynamicFog.addEventListener("change", () => {
            if (chkDynamicFog.checked) {
                revealFogAroundTokens();
            }
            draw();
        });

        // --- DICE ROLLER ---
        diceBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const die = parseInt(btn.dataset.die);
                rollDice(die);
            });
        });

        // --- FILE & GLOBAL OPERATIONS ---
        btnSaveJson.addEventListener("click", saveMapJson);
        fileInput.addEventListener("change", loadMapJson);
        btnExportPng.addEventListener("click", exportMapPng);
        document.getElementById("btnExportVtt")?.addEventListener("click", exportUniversalVTT);

        // Dyson Logos toggle
        const btnDyson = document.getElementById("btnDysonMode");
        if (btnDyson) {
            btnDyson.addEventListener("click", () => {
                dysonMode = !dysonMode;
                btnDyson.style.background = dysonMode
                    ? "rgba(255,255,255,0.15)"
                    : "";
                btnDyson.style.borderColor = dysonMode
                    ? "rgba(255,255,255,0.5)"
                    : "";
                btnDyson.style.color = dysonMode ? "#fff" : "";
                draw();
            });
        }
        btnClearMap.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que quieres borrar el mapa entero? Esta acción se puede deshacer.")) {
                initMapState(state.cols, state.rows);
                saveHistory();
                draw();
            }
        });
        
        btnUndo.addEventListener("click", undo);
        btnRedo.addEventListener("click", redo);

        // --- HELP MODAL ---
        btnOpenHelp.addEventListener("click", () => helpModal.classList.add("active"));
        btnCloseHelp.addEventListener("click", () => helpModal.classList.remove("active"));
        btnCloseHelpOk.addEventListener("click", () => helpModal.classList.remove("active"));

        // --- CANVAS WORKSPACE EVENTS ---
        viewport.addEventListener("mousedown", handleMouseDown);
        viewport.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        viewport.addEventListener("wheel", handleWheel, { passive: false });
        viewport.addEventListener("contextmenu", e => e.preventDefault());

        // --- KEYBOARD SHORTCUTS ---
        window.addEventListener("keydown", handleKeyDown);
    }

    function handleWindowResize() {
        updateTransform();
    }

    // --- ZOOM & PAN ---
    function adjustZoom(factor) {
        const newZoom = Math.min(Math.max(zoom * factor, 0.25), 3.0);
        const vwWidth = viewport.clientWidth;
        const vwHeight = viewport.clientHeight;
        const centerX = vwWidth / 2;
        const centerY = vwHeight / 2;
        
        const mapX = (centerX - panX) / zoom;
        const mapY = (centerY - panY) / zoom;
        
        panX = centerX - mapX * newZoom;
        panY = centerY - mapY * newZoom;
        
        zoom = newZoom;
        updateTransform();
        draw();
    }

    function updateMousePositions(e) {
        const rect = canvas.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left) / zoom;
        const canvasY = (e.clientY - rect.top) / zoom;
        
        mouseGridPos.x = canvasX / state.cellSize;
        mouseGridPos.y = canvasY / state.cellSize;
        
        if (isHexMode()) {
            const hex = getClosestHex(canvasX, canvasY);
            mouseCellPos.col = hex.col;
            mouseCellPos.row = hex.row;
        } else {
            mouseCellPos.col = Math.floor(mouseGridPos.x);
            mouseCellPos.row = Math.floor(mouseGridPos.y);
        }
    }

    // --- MOUSE CLICK DRAGS ---
    function handleMouseDown(e) {
        updateMousePositions(e);
        
        // Navigation: Pan
        if (e.button === 2 || e.button === 1 || activeTool === "pan" || e.spaceKey) {
            isPanning = true;
            startX = e.clientX - panX;
            startY = e.clientY - panY;
            panClickStart = { x: e.clientX, y: e.clientY };
            viewport.style.cursor = "grabbing";
            return;
        }

        if (e.button === 0) { // Left click
            isDrawing = true;
            
            if (activeTool === "terrain") {
                if (terrainPaintMode === "paint") {
                    paintTerrainAtMouse();
                } else if (terrainPaintMode === "fill") {
                    floodFillTerrain(mouseCellPos.col, mouseCellPos.row, activeTerrain);
                    saveHistory();
                }
            }
            
            else if (activeTool === "wall") {
                if (isHexMode()) {
                    const rect = canvas.getBoundingClientRect();
                    const canvasX = (e.clientX - rect.left) / zoom;
                    const canvasY = (e.clientY - rect.top) / zoom;
                    const v = getClosestHexVertex(canvasX, canvasY);
                    wallStart = {
                        x: v.x / state.cellSize,
                        y: v.y / state.cellSize
                    };
                } else {
                    wallStart = {
                        x: Math.round(mouseGridPos.x),
                        y: Math.round(mouseGridPos.y)
                    };
                }
            }

            else if (activeTool === "ruler") {
                if (isHexMode()) {
                    rulerStart = {
                        col: mouseCellPos.col,
                        row: mouseCellPos.row
                    };
                } else {
                    rulerStart = {
                        x: mouseGridPos.x,
                        y: mouseGridPos.y
                    };
                }
            }
            
            else if (activeTool === "stamp") {
                const clickedStamp = findStampAt(mouseGridPos.x, mouseGridPos.y);
                if (clickedStamp) {
                    selectedStampId = clickedStamp.id;
                    draggedStamp = clickedStamp;
                    updateStampControlUI();
                    
                    stampItems.forEach(item => {
                        if ((clickedStamp.image && item.dataset.image === clickedStamp.image) ||
                            (!clickedStamp.image && item.dataset.emoji === clickedStamp.emoji)) {
                            item.classList.add("active");
                        } else {
                            item.classList.remove("active");
                        }
                    });
                } else {
                    if (activeStamp || activeStampImage) {
                        const size = parseFloat(stampSizeInput.value);
                        const rotation = parseInt(stampRotationInput.value);
                        
                        let sx, sy, freePosition = false;
                        if (e.altKey) {
                            if (isHexMode()) {
                                const rect = canvas.getBoundingClientRect();
                                const canvasX = (e.clientX - rect.left) / zoom;
                                const canvasY = (e.clientY - rect.top) / zoom;
                                const coords = getHexCoordsFromCanvas(canvasX, canvasY);
                                sx = coords.col;
                                sy = coords.row;
                                freePosition = true;
                            } else {
                                sx = mouseGridPos.x;
                                sy = mouseGridPos.y;
                                freePosition = true;
                            }
                        } else {
                            sx = mouseCellPos.col + 0.5;
                            sy = mouseCellPos.row + 0.5;
                        }
                        
                        const newStamp = {
                            id: Date.now() + Math.random().toString(36).substr(2, 5),
                            emoji: activeStamp || "◆",
                            image: activeStampImage || undefined,
                            x: sx,
                            y: sy,
                            size: size,
                            rotation: rotation,
                            isToken: false,
                            isHero: false,
                            visionRadius: 4,
                            name: activeStampName,
                            hpCurrent: 10,
                            hpMax: 10,
                            conditions: [],
                            isSecret: false,
                            freePosition,
                            description: activeStampDescription,
                            showDescToPlayers: !!activeStampDescription
                        };
                        
                        // Default hero traits to some stamps
                        if (["🧙", "🛡️", "🏹", "🧝", "👤", "✝️", "⛵", "🧙‍♀️", "🤴"].includes(activeStamp)) {
                            newStamp.isToken = true;
                            newStamp.isHero = true;
                            newStamp.hpCurrent = 25;
                            newStamp.hpMax = 25;
                        } else if (["🐉", "🧟", "💀", "👹", "🕷️", "👻", "🐺", "🐻", "🐀", "🦎"].includes(activeStamp)) {
                            newStamp.isToken = true;
                            newStamp.isHero = false;
                            newStamp.visionRadius = 0;
                            newStamp.hpCurrent = 15;
                            newStamp.hpMax = 15;
                        }
                        
                        state.stamps.push(newStamp);
                        selectedStampId = newStamp.id;
                        revealFogAroundTokens();
                        updateStampControlUI();
                        saveHistory();
                    } else {
                        selectedStampId = null;
                        updateStampControlUI();
                    }
                }
            }
            
            else if (activeTool === "fog") {
                paintFogAtMouse();
            }
            
            draw();
        }
    }

    function handleMouseMove(e) {
        updateMousePositions(e);
        
        if (isPanning) {
            panX = e.clientX - startX;
            panY = e.clientY - startY;
            updateTransform();
            return;
        }

        if (isDrawing && e.buttons === 1) { // Left click held
            if (activeTool === "terrain" && terrainPaintMode === "paint") {
                paintTerrainAtMouse();
            }
            else if (activeTool === "fog") {
                paintFogAtMouse();
            }
            else if (activeTool === "stamp" && draggedStamp) {
                if (e.altKey) {
                    if (isHexMode()) {
                        const rect = canvas.getBoundingClientRect();
                        const canvasX = (e.clientX - rect.left) / zoom;
                        const canvasY = (e.clientY - rect.top) / zoom;
                        setStampFreeCanvasPosition(draggedStamp, canvasX, canvasY);
                    } else {
                        draggedStamp.x = mouseGridPos.x;
                        draggedStamp.y = mouseGridPos.y;
                        draggedStamp.freePosition = true;
                    }
                } else {
                    // Snap to cell center (works for both hex and square)
                    setStampSnappedCellPosition(draggedStamp, mouseCellPos.col, mouseCellPos.row);
                }
                revealFogAroundTokens();
            }
        }
        
        draw();
    }

    function handleMouseUp(e) {
        if (isPanning) {
            isPanning = false;
            viewport.style.cursor = "grab";

            // Detect short click (not drag) → show landmark popup in player+region mode
            if (panClickStart) {
                const dx = Math.abs(e.clientX - panClickStart.x);
                const dy = Math.abs(e.clientY - panClickStart.y);
                if (dx < 6 && dy < 6) {
                    const viewMode = viewModeSelect?.value || "gm";
                    const mapMode = mapModeSelect?.value || "combat";
                    if (viewMode === "player" && mapMode === "region") {
                        updateMousePositions(e);
                        const clicked = findStampAt(mouseGridPos.x, mouseGridPos.y);
                        if (clicked && clicked.showDescToPlayers && !clicked.isSecret && (clicked.name || clicked.description)) {
                            showLandmarkPopup(clicked, e.clientX, e.clientY);
                        } else {
                            hideLandmarkPopup();
                        }
                    }
                }
                panClickStart = null;
            }
        }
        
        if (isDrawing) {
            isDrawing = false;
            
            if (activeTool === "terrain" && terrainPaintMode === "paint") {
                saveHistory();
            }
            else if (activeTool === "fog") {
                saveHistory();
            }
            else if (activeTool === "wall" && wallStart) {
                let endX, endY;
                if (isHexMode()) {
                    const rect = canvas.getBoundingClientRect();
                    const canvasX = (e.clientX - rect.left) / zoom;
                    const canvasY = (e.clientY - rect.top) / zoom;
                    const v = getClosestHexVertex(canvasX, canvasY);
                    endX = v.x / state.cellSize;
                    endY = v.y / state.cellSize;
                } else {
                    endX = Math.round(mouseGridPos.x);
                    endY = Math.round(mouseGridPos.y);
                }
                
                if (wallStart.x !== endX || wallStart.y !== endY) {
                    state.walls.push({
                        x1: wallStart.x,
                        y1: wallStart.y,
                        x2: endX,
                        y2: endY,
                        width: parseInt(wallWidthInput.value),
                        color: wallColorInput.value
                    });
                    saveHistory();
                }
                wallStart = null;
            }
            else if (activeTool === "ruler") {
                rulerStart = null;
            }
            else if (activeTool === "stamp" && draggedStamp) {
                draggedStamp = null;
                saveHistory();
            }
            
            draw();
        }
    }

    function handleWheel(e) {
        e.preventDefault();
        
        const zoomFactor = 1.1;
        const newZoom = e.deltaY < 0 ? Math.min(zoom * zoomFactor, 3.0) : Math.max(zoom / zoomFactor, 0.25);
        
        const mouseX = e.clientX - viewport.offsetLeft;
        const mouseY = e.clientY - viewport.offsetTop;
        
        const mapX = (mouseX - panX) / zoom;
        const mapY = (mouseY - panY) / zoom;
        
        panX = mouseX - mapX * newZoom;
        panY = mouseY - mapY * newZoom;
        
        zoom = newZoom;
        updateTransform();
        draw();
    }

    function handleKeyDown(e) {
        if (document.activeElement.tagName === "INPUT" && document.activeElement.type === "number") return;
        if (helpModal.classList.contains("active")) return;
        
        if (e.key.toLowerCase() === "r" && activeTool === "stamp" && selectedStampId) {
            e.preventDefault();
            const s = state.stamps.find(x => x.id === selectedStampId);
            if (s) {
                s.rotation = (s.rotation + 15) % 360;
                stampRotationInput.value = s.rotation;
                stampRotationVal.textContent = `${s.rotation}°`;
                saveHistory();
                draw();
            }
        }
        
        if ((e.key === "Delete" || e.key === "Backspace") && activeTool === "stamp" && selectedStampId) {
            e.preventDefault();
            deleteSelectedStamp();
        }
        
        if (e.ctrlKey && e.key.toLowerCase() === "z") {
            e.preventDefault();
            undo();
        }
        
        if (e.ctrlKey && e.key.toLowerCase() === "y") {
            e.preventDefault();
            redo();
        }

        if (e.ctrlKey && e.key.toLowerCase() === "d" && activeTool === "stamp" && selectedStampId) {
            e.preventDefault();
            duplicateSelectedStamp();
        }
    }

    // --- EDITING CORE LOGIC ---
    function paintTerrainAtMouse() {
        if (!isMouseOverCanvas()) return;
        const isRegion = mapModeSelect?.value === "region";

        // Collect all cells to paint based on brushRadius
        const cells = [];
        for (let dr = -brushRadius; dr <= brushRadius; dr++) {
            for (let dc = -brushRadius; dc <= brushRadius; dc++) {
                if (Math.sqrt(dr * dr + dc * dc) > brushRadius + 0.4) continue;
                const col = mouseCellPos.col + dc;
                const row = mouseCellPos.row + dr;
                if (col < 0 || col >= state.cols || row < 0 || row >= state.rows) continue;
                cells.push(row * state.cols + col);
            }
        }

        let changed = false;
        for (const idx of cells) {
            if (isRegion) {
                const currentCell = state.terrain[idx];
                const currentType = (currentCell && typeof currentCell === "object") ? currentCell.type : currentCell;
                if (currentType !== activeTerrain) {
                    state.terrain[idx] = { type: activeTerrain, variation: Math.floor(Math.random() * 3) };
                    changed = true;
                }
            } else {
                if (state.terrain[idx] !== activeTerrain) {
                    state.terrain[idx] = activeTerrain;
                    changed = true;
                }
            }
        }
        return changed;
    }

    function paintFogAtMouse() {
        if (isMouseOverCanvas()) {
            const idx = mouseCellPos.row * state.cols + mouseCellPos.col;
            const targetVal = (activeFogMode === "add");
            if (state.fog[idx] !== targetVal) {
                state.fog[idx] = targetVal;
                // Keep token vision updated if revealing
                if (!targetVal) {
                    revealFogAroundTokens();
                }
            }
        }
    }

    function findStampAt(gridX, gridY) {
        const size = state.cellSize;
        const px = gridX * size;
        const py = gridY * size;
        
        for (let i = state.stamps.length - 1; i >= 0; i--) {
            const s = state.stamps[i];
            const pos = getTokenCanvasPos(s);
            const dist = Math.sqrt(Math.pow(pos.x - px, 2) + Math.pow(pos.y - py, 2));
            const clickRadius = s.size * size * 0.45;
            if (dist <= clickRadius) {
                return s;
            }
        }
        return null;
    }

    function updateStampControlUI() {
        const viewMode = viewModeSelect?.value || "gm";
        
        if (selectedStampId) {
            const s = state.stamps.find(x => x.id === selectedStampId);
            if (s) {
                // If viewMode is player and showDescToPlayers is false, hide details entirely
                if (viewMode === "player" && !s.showDescToPlayers) {
                    stampEditControls.style.display = "none";
                    return;
                }
                
                stampEditControls.style.display = "block";
                
                // Populate inputs
                stampSizeInput.value = s.size;
                stampSizeVal.textContent = `${s.size.toFixed(1)}x`;
                stampRotationInput.value = s.rotation;
                stampRotationVal.textContent = `${s.rotation}°`;
                tokenNameInput.value = s.name || "";
                tokenIsSecretChk.checked = !!s.isSecret;
                if (tokenDescriptionInput) tokenDescriptionInput.value = s.description || "";
                if (tokenShowDescToPlayersChk) tokenShowDescToPlayersChk.checked = !!s.showDescToPlayers;
                
                const mode = mapModeSelect?.value || "combat";
                const isRegion = mode === "region";
                
                // DOM element wrappers to show/hide
                const nameSetting = tokenNameInput.closest('.setting-item');
                const sizeSetting = stampSizeInput.closest('.setting-item');
                const rotationSetting = stampRotationInput.closest('.setting-item');
                const secretSetting = tokenIsSecretChk.closest('.setting-item');
                const typeSetting = tokenTypeSelect.closest('.setting-item');
                const hpSetting = document.getElementById("tokenHpSetting");
                const conditionsSetting = document.getElementById("tokenConditionsSetting");
                const uploaderSection = document.querySelector(".custom-avatar-uploader");
                const btnGroupEditing = btnDeleteStamp?.closest('.btn-group');
                const helpText = document.querySelector("#optionsStamp .help-text");
                const tokenDescriptionSetting = document.getElementById("tokenDescriptionSetting");
                const tokenShowDescSetting = document.getElementById("tokenShowDescSetting");
                
                if (viewMode === "player") {
                    // Disable editing
                    tokenNameInput.disabled = true;
                    if (tokenDescriptionInput) tokenDescriptionInput.disabled = true;
                    
                    // Show name and description
                    if (nameSetting) nameSetting.style.display = "flex";
                    if (tokenDescriptionSetting) tokenDescriptionSetting.style.display = "flex";
                    
                    // Hide everything else
                    if (sizeSetting) sizeSetting.style.display = "none";
                    if (rotationSetting) rotationSetting.style.display = "none";
                    if (secretSetting) secretSetting.style.display = "none";
                    if (tokenShowDescSetting) tokenShowDescSetting.style.display = "none";
                    if (typeSetting) typeSetting.style.display = "none";
                    if (visionRadiusSetting) visionRadiusSetting.style.display = "none";
                    if (hpSetting) hpSetting.style.display = "none";
                    if (conditionsSetting) conditionsSetting.style.display = "none";
                    if (btnAddToInitiative) btnAddToInitiative.style.display = "none";
                    if (btnGroupEditing) btnGroupEditing.style.display = "none";
                    if (uploaderSection) uploaderSection.style.display = "none";
                    if (helpText) helpText.style.display = "none";
                } else {
                    // GM Mode: Enable editing
                    tokenNameInput.disabled = false;
                    if (tokenDescriptionInput) tokenDescriptionInput.disabled = false;
                    
                    // Show basic controls
                    if (nameSetting) nameSetting.style.display = "flex";
                    if (sizeSetting) sizeSetting.style.display = "flex";
                    if (rotationSetting) rotationSetting.style.display = "flex";
                    if (secretSetting) secretSetting.style.display = "flex";
                    if (btnGroupEditing) btnGroupEditing.style.display = "flex";
                    if (uploaderSection) uploaderSection.style.display = "block";
                    if (helpText) helpText.style.display = "block";
                    
                    if (isRegion) {
                        // Region Exploration Settings
                        if (tokenDescriptionSetting) tokenDescriptionSetting.style.display = "flex";
                        if (tokenShowDescSetting) tokenShowDescSetting.style.display = "flex";
                        
                        if (typeSetting) typeSetting.style.display = "none";
                        if (visionRadiusSetting) visionRadiusSetting.style.display = "none";
                        if (hpSetting) hpSetting.style.display = "none";
                        if (conditionsSetting) conditionsSetting.style.display = "none";
                        if (btnAddToInitiative) btnAddToInitiative.style.display = "none";
                    } else {
                        // Combat Settings
                        if (tokenDescriptionSetting) tokenDescriptionSetting.style.display = "none";
                        if (tokenShowDescSetting) tokenShowDescSetting.style.display = "none";
                        
                        if (typeSetting) typeSetting.style.display = "flex";
                        if (btnAddToInitiative) btnAddToInitiative.style.display = "block";
                        
                        if (s.isHero) {
                            tokenTypeSelect.value = "hero";
                            if (visionRadiusSetting) visionRadiusSetting.style.display = "flex";
                            tokenVisionInput.value = s.visionRadius || 4;
                            tokenVisionVal.textContent = `${s.visionRadius || 4}c`;
                            if (hpSetting) hpSetting.style.display = "flex";
                            if (conditionsSetting) conditionsSetting.style.display = "flex";
                            tokenHpCurrentInput.value = s.hpCurrent !== undefined ? s.hpCurrent : 20;
                            tokenHpMaxInput.value = s.hpMax !== undefined ? s.hpMax : 20;
                            conditionChks.forEach(chk => {
                                chk.checked = s.conditions ? s.conditions.includes(chk.value) : false;
                            });
                        } else if (s.isToken) {
                            tokenTypeSelect.value = "monster";
                            if (visionRadiusSetting) visionRadiusSetting.style.display = "none";
                            if (hpSetting) hpSetting.style.display = "flex";
                            if (conditionsSetting) conditionsSetting.style.display = "flex";
                            tokenHpCurrentInput.value = s.hpCurrent !== undefined ? s.hpCurrent : 15;
                            tokenHpMaxInput.value = s.hpMax !== undefined ? s.hpMax : 15;
                            conditionChks.forEach(chk => {
                                chk.checked = s.conditions ? s.conditions.includes(chk.value) : false;
                            });
                        } else {
                            tokenTypeSelect.value = "prop";
                            if (visionRadiusSetting) visionRadiusSetting.style.display = "none";
                            if (hpSetting) hpSetting.style.display = "none";
                            if (conditionsSetting) conditionsSetting.style.display = "none";
                        }
                    }
                }
                return;
            }
        }
        stampEditControls.style.display = "none";
    }

    function deleteSelectedStamp() {
        if (selectedStampId) {
            state.stamps = state.stamps.filter(x => x.id !== selectedStampId);
            selectedStampId = null;
            updateStampControlUI();
            saveHistory();
            draw();
        }
    }

    function duplicateSelectedStamp() {
        if (selectedStampId) {
            const s = state.stamps.find(x => x.id === selectedStampId);
            if (s) {
                const newStamp = {
                    id: Date.now() + Math.random().toString(36).substr(2, 5),
                    emoji: s.emoji,
                    x: Math.min(state.cols - 0.5, s.x + 0.5),
                    y: Math.min(state.rows - 0.5, s.y + 0.5),
                    size: s.size,
                    rotation: s.rotation,
                    isToken: s.isToken,
                    isHero: s.isHero,
                    visionRadius: s.visionRadius,
                    name: s.name ? s.name + " (Copia)" : "",
                    hpCurrent: s.hpCurrent !== undefined ? s.hpCurrent : 10,
                    hpMax: s.hpMax !== undefined ? s.hpMax : 10,
                    conditions: s.conditions ? [...s.conditions] : [],
                    isSecret: !!s.isSecret,
                    description: s.description || "",
                    showDescToPlayers: !!s.showDescToPlayers,
                    image: s.image || undefined,
                    freePosition: !!s.freePosition
                };
                state.stamps.push(newStamp);
                selectedStampId = newStamp.id;
                revealFogAroundTokens();
                updateStampControlUI();
                saveHistory();
                draw();
            }
        }
    }

    function floodFillTerrain(startCol, startRow, newTerrain) {
        if (startCol < 0 || startCol >= state.cols || startRow < 0 || startRow >= state.rows) return;
        
        const startIdx = startRow * state.cols + startCol;
        const startCell = state.terrain[startIdx];
        const oldTerrainType = (startCell && typeof startCell === "object") ? startCell.type : startCell;
        
        if (oldTerrainType === newTerrain) return;
        
        const queue = [[startCol, startRow]];
        const isRegion = mapModeSelect?.value === "region";
        const isHex = isHexMode();
        
        while (queue.length > 0) {
            const [c, r] = queue.shift();
            const idx = r * state.cols + c;
            const currentCell = state.terrain[idx];
            const currentType = (currentCell && typeof currentCell === "object") ? currentCell.type : currentCell;
            
            if (currentType === oldTerrainType) {
                if (isRegion) {
                    state.terrain[idx] = {
                        type: newTerrain,
                        variation: Math.floor(Math.random() * 3)
                    };
                } else {
                    state.terrain[idx] = newTerrain;
                }
                
                if (isHex) {
                    // Hex grid neighbors (6-connectivity, pointy-topped odd-r vertical layout)
                    const neighbors = [
                        [c - 1, r],
                        [c + 1, r]
                    ];
                    if (r % 2 === 0) {
                        neighbors.push([c - 1, r - 1]);
                        neighbors.push([c, r - 1]);
                        neighbors.push([c - 1, r + 1]);
                        neighbors.push([c, r + 1]);
                    } else {
                        neighbors.push([c, r - 1]);
                        neighbors.push([c + 1, r - 1]);
                        neighbors.push([c, r + 1]);
                        neighbors.push([c + 1, r + 1]);
                    }
                    for (const [nc, nr] of neighbors) {
                        if (nc >= 0 && nc < state.cols && nr >= 0 && nr < state.rows) {
                            queue.push([nc, nr]);
                        }
                    }
                } else {
                    // Square grid neighbors (4-connectivity)
                    if (c > 0) queue.push([c - 1, r]);
                    if (c < state.cols - 1) queue.push([c + 1, r]);
                    if (r > 0) queue.push([c, r - 1]);
                    if (r < state.rows - 1) queue.push([c, r + 1]);
                }
            }
        }
    }
    function selectTool(toolName) {
        const btn = document.querySelector(`.tool-btn[data-tool="${toolName}"]`);
        if (btn) {
            toolBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            activeTool = toolName;
            optionGroups.forEach(g => g.style.display = "none");
            
            if (activeTool === "terrain") {
                document.getElementById("optionsTerrain").style.display = "block";
            } else if (activeTool === "wall") {
                document.getElementById("optionsWall").style.display = "block";
            } else if (activeTool === "stamp") {
                document.getElementById("optionsStamp").style.display = "block";
            } else if (activeTool === "fog") {
                document.getElementById("optionsFog").style.display = "block";
            } else {
                document.getElementById("optionsPan").style.display = "block";
            }
            
            if (activeTool !== "stamp") {
                selectedStampId = null;
                updateStampControlUI();
            }
            draw();
        }
    }

    function syncUIForMapMode() {
        const mode = mapModeSelect?.value || "combat";
        const initiativeTracker = document.querySelector(".initiative-tracker");
        const btnWall = document.getElementById("toolWall");
        const btnFog = document.getElementById("toolFog");
        const combatTerrains = document.getElementById("combatTerrains");
        const explorationBiomes = document.getElementById("explorationBiomes");
        
        if (mode === "region") {
            if (initiativeTracker) initiativeTracker.style.display = "none";
            if (btnWall) btnWall.style.display = "none";
            if (btnFog) btnFog.style.display = "none";
            if (combatTerrains) combatTerrains.style.display = "none";
            if (explorationBiomes) explorationBiomes.style.display = "grid";
            
            if (activeTool === "wall" || activeTool === "fog") {
                selectTool("pan");
            }
            
            const activeBioOpt = document.querySelector("#explorationBiomes .terrain-option.active");
            if (activeBioOpt) {
                activeTerrain = activeBioOpt.dataset.terrain;
            } else {
                const defaultOpt = document.querySelector("#explorationBiomes .terrain-option[data-terrain='plains']");
                if (defaultOpt) {
                    document.querySelectorAll(".terrain-option").forEach(o => o.classList.remove("active"));
                    defaultOpt.classList.add("active");
                    activeTerrain = "plains";
                }
            }
        } else {
            if (initiativeTracker) initiativeTracker.style.display = "block";
            if (btnWall) btnWall.style.display = "block";
            if (btnFog) btnFog.style.display = "block";
            if (combatTerrains) combatTerrains.style.display = "grid";
            if (explorationBiomes) explorationBiomes.style.display = "none";
            
            const activeCombOpt = document.querySelector("#combatTerrains .terrain-option.active");
            if (activeCombOpt) {
                activeTerrain = activeCombOpt.dataset.terrain;
            } else {
                const defaultOpt = document.querySelector("#combatTerrains .terrain-option[data-terrain='stone']");
                if (defaultOpt) {
                    document.querySelectorAll(".terrain-option").forEach(o => o.classList.remove("active"));
                    defaultOpt.classList.add("active");
                    activeTerrain = "stone";
                }
            }
        }
        
        updateStampControlUI();
    }

    function generateProceduralRegion() {
        const cols = 36;
        const rows = 24;
        const seed = Math.floor(Math.random() * 90000) + 10000;
        const rand = (salt = 0) => {
            const x = Math.sin(seed + salt * 999) * 10000;
            return x - Math.floor(x);
        };
        const noise = (c, r, salt = 0) => {
            const v = Math.sin(c * 12.9898 + r * 78.233 + seed * 0.001 + salt * 37.719) * 43758.5453;
            return v - Math.floor(v);
        };

        state.cols = cols;
        state.rows = rows;
        gridColsInput.value = cols;
        gridRowsInput.value = rows;
        mapModeSelect.value = "region";
        chkShowGrid.checked = false;
        state.travelScaleValue = 8;
        state.travelScaleUnit = "millas";
        state.travelMethod = "foot";
        state.walls = [];
        state.fog = Array(cols * rows).fill(false);
        state.terrain = [];

        // Gygax d20 roll table (DMG 1e Appendix B, ported from dangeratio/hex-map-generator CC0)
        // Rows = current terrain [Plains,Scrub,Forest,Rough,Desert,Hills,Mountains,Marsh]
        // Values = next terrain index for each d20 roll (0-19)
        const GYGAX = [
            [0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9], // Plains
            [0,0,0,1,1,1,1,1,1,1,1,2,2,3,4,5,6,7,8,9], // Scrub
            [0,1,1,1,2,2,2,2,2,2,2,2,2,2,3,4,6,7,8,9], // Forest
            [0,0,1,1,2,3,3,3,4,4,5,5,5,5,5,6,6,7,8,9], // Rough
            [0,0,0,1,1,3,3,3,4,4,4,4,4,4,5,6,6,7,8,9], // Desert
            [0,1,1,2,2,3,3,4,5,5,5,5,5,5,6,6,7,8,8,9], // Hills
            [0,1,2,3,3,4,5,5,5,5,6,6,6,6,6,6,6,6,8,9], // Mountains
            [0,0,1,1,2,2,3,5,7,7,7,7,7,7,7,8,8,8,8,9], // Marsh
        ];
        // Gygax index → our terrain type
        const GYGAX_TERRAIN = ["plains","hills","forest","hills","desert","hills","mountain","swamp","ocean","plains"];

        const riverCol  = Math.floor(cols * (0.38 + rand(1) * 0.18));
        const coastStart = Math.floor(cols * (0.70 + rand(2) * 0.12));

        // Grid of Gygax indices (0-9), built left-to-right, top-to-bottom
        const gygaxGrid = new Array(cols * rows).fill(0);

        // Seed the left column: mountains at NW, plains/forest elsewhere
        for (let r = 0; r < rows; r++) {
            const startG = r < rows * 0.35 ? 6 : (r < rows * 0.65 ? 5 : 0); // mountains → hills → plains
            gygaxGrid[r * cols + 0] = startG;
        }

        // Roll forward using Gygax table
        for (let r = 0; r < rows; r++) {
            for (let c = 1; c < cols; c++) {
                const idx = r * cols + c;
                const leftG  = gygaxGrid[r * cols + c - 1];
                const aboveG = r > 0 ? gygaxGrid[(r-1) * cols + c] : leftG;
                // Average of left and above (clamped to 0-7 for table lookup)
                const prevG  = Math.min(7, Math.round((leftG + aboveG) / 2));
                const roll   = Math.floor(noise(c, r, 0) * 20); // 0-19 deterministic roll
                gygaxGrid[idx] = GYGAX[prevG][roll];
            }
        }

        // Override: coast and river columns force ocean/swamp
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const idx = r * cols + c;
                const coast = c > coastStart + Math.round(Math.sin(r * 0.5) * 2);
                const river = Math.abs(c - (riverCol + Math.round(Math.sin(r * 0.55 + seed * 0.001) * 2))) < 1.2;
                if (coast || river) {
                    gygaxGrid[idx] = river && r > rows * 0.5 ? 7 : 8; // swamp/ocean
                }
            }
        }

        // Build terrain array from Gygax grid
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const idx = r * cols + c;
                const g = gygaxGrid[idx];
                const type = GYGAX_TERRAIN[g] || "plains";
                state.terrain[idx] = { type, variation: Math.floor(rand(idx + 10) * 3) };
            }
        }

        const stamp = (id, emoji, x, y, size, name, description, show = true, secret = false) => ({
            id,
            emoji,
            x,
            y,
            size,
            rotation: Math.floor(rand(id.length + x + y) * 40) - 20,
            isToken: false,
            isHero: false,
            visionRadius: 0,
            name,
            description,
            showDescToPlayers: show,
            isSecret: secret
        });

        state.stamps = [
            stamp("pr-castle", "🏰", 6.5, 5.5, 1.4, "Ciudadela de la Frontera", "Bastión que vigila las montañas. La guarnición busca exploradores para revisar pasos cerrados por avalanchas."),
            stamp("pr-town", "🛖", 14.5, 12.5, 1.0, "Aldea de Vado Claro", "Aldea junto al río, conocida por sus barqueros y mapas viejos de rutas secundarias."),
            stamp("pr-bridge", "🌉", riverCol + 0.5, 10.5, 1.1, "Puente Viejo", "El único cruce seguro en muchas millas. Sus pilares tienen marcas de garras antiguas."),
            stamp("pr-forest", "🌳", 12.5, 6.5, 1.2, "Bosque de los Susurros", "En este bosque las voces viajan más lejos que las flechas. Los cazadores vuelven hablando en voz baja."),
            stamp("pr-ruins", "🏚️", 20.5, 8.5, 1.2, "Ruinas del Observatorio", "Círculos de piedra orientados a una estrella que ya no aparece en el cielo."),
            stamp("pr-port", "⚓", coastStart + 2.5, 14.5, 1.0, "Puerto Salobre", "Muelles de madera negra y almacenes de sal. Las mareas traen botellas con mensajes sin remitente."),
            stamp("pr-cave", "🕳️", 4.5, 15.5, 1.0, "Cueva de Humo Frío", "Una boca de cueva que exhala niebla aunque el sol esté alto.", false, true),
            stamp("pr-market", "🛒", 17.5, 16.5, 1.0, "Feria de Camino", "Caravanas, cambistas y rumores. Buen lugar para contratar guías o vender hallazgos."),
            stamp("pr-danger", "🏴", 25.5, 18.5, 1.0, "Territorio Marcado", "Estandartes rotos delimitan una zona que las caravanas rodean incluso con prisa.")
        ];

        selectedStampId = null;
        syncUIForMapMode();
        clearInitiative();
        revealFogAroundTokens();
        centerMap();
        saveHistory();
        draw();
    }

    function generateProceduralDungeon(forcedTheme) {
        // Room-based dungeon generator inspired by donjuan (CC0 public domain)
        // Prim's minimum spanning tree for connectivity + L-shaped hallways
        const THEMES = ["dungeon", "crypt", "prison", "barracks", "arcane"];
        const theme = forcedTheme || THEMES[Math.floor(Math.random() * THEMES.length)];
        const themeNames = { dungeon: "Mazmorra", crypt: "Cripta", prison: "Prisión", barracks: "Cuartel", arcane: "Torre Arcana" };

        const cols = Math.floor(Math.random() * 10) + 22;
        const rows = Math.floor(Math.random() * 8) + 16;
        const maxRooms = Math.floor(Math.random() * 4) + 5;

        state.cols = cols; state.rows = rows;
        gridColsInput.value = cols; gridRowsInput.value = rows;
        mapModeSelect.value = "combat"; chkShowGrid.checked = true;
        state.fog = Array(cols * rows).fill(true);
        state.walls = []; state.stamps = [];
        state.bgImage = ""; state.showBg = false;
        state.terrain = Array(cols * rows).fill(null).map(() => ({ type: "abyss", variation: 0 }));

        const idx = (c, r) => r * cols + c;
        const inBounds = (c, r) => c >= 1 && c < cols - 1 && r >= 1 && r < rows - 1;
        const floorType = theme === "barracks" ? "wood" : "stone";
        const dirs4 = [[1,0],[-1,0],[0,1],[0,-1]];

        // --- 1. PLACE ROOMS (no overlap + 1-cell padding) ---
        const rooms = [];
        const overlaps = (c, r, w, h) => rooms.some(rm =>
            c < rm.c + rm.w + 1 && c + w + 1 > rm.c &&
            r < rm.r + rm.h + 1 && r + h + 1 > rm.r
        );

        let attempts = 0;
        while (rooms.length < maxRooms && attempts < 300) {
            attempts++;
            const w = Math.floor(Math.random() * 4) + 3;
            const h = Math.floor(Math.random() * 3) + 3;
            const c = Math.floor(Math.random() * (cols - w - 2)) + 1;
            const r = Math.floor(Math.random() * (rows - h - 2)) + 1;
            if (!overlaps(c, r, w, h)) {
                rooms.push({ c, r, w, h, cx: Math.floor(c + w / 2), cy: Math.floor(r + h / 2) });
            }
        }
        if (rooms.length === 0) return;

        // --- 2. CARVE ROOMS ---
        const floorSet = new Set();
        for (const rm of rooms) {
            for (let rc = rm.c; rc < rm.c + rm.w; rc++) {
                for (let rr = rm.r; rr < rm.r + rm.h; rr++) {
                    if (inBounds(rc, rr)) {
                        state.terrain[idx(rc, rr)] = { type: floorType, variation: Math.floor(Math.random() * 3) };
                        floorSet.add(`${rc},${rr}`);
                    }
                }
            }
        }

        // --- 3. CONNECT ROOMS (Prim's MST → L-shaped hallways) ---
        const connected = new Set([0]);
        const doorCandidates = [];
        while (connected.size < rooms.length) {
            let bestD = Infinity, bestFrom = -1, bestTo = -1;
            for (const fi of connected) {
                for (let ti = 0; ti < rooms.length; ti++) {
                    if (connected.has(ti)) continue;
                    const d = Math.abs(rooms[fi].cx - rooms[ti].cx) + Math.abs(rooms[fi].cy - rooms[ti].cy);
                    if (d < bestD) { bestD = d; bestFrom = fi; bestTo = ti; }
                }
            }
            if (bestFrom === -1) break;
            connected.add(bestTo);

            // Carve L-shaped hallway
            let hc = rooms[bestFrom].cx, hr = rooms[bestFrom].cy;
            const tc = rooms[bestTo].cx, tr = rooms[bestTo].cy;
            const carve = (cc, cr) => {
                if (inBounds(cc, cr)) {
                    const wasAbyss = state.terrain[idx(cc, cr)].type === "abyss";
                    state.terrain[idx(cc, cr)] = { type: "stone", variation: 0 };
                    floorSet.add(`${cc},${cr}`);
                    if (wasAbyss) return true;
                }
                return false;
            };
            const dcH = tc > hc ? 1 : -1;
            while (hc !== tc) { hc += dcH; const w = carve(hc, hr); if (w && rooms.some(rm => hc >= rm.c && hc < rm.c + rm.w && hr >= rm.r && hr < rm.r + rm.h)) doorCandidates.push({c: hc, r: hr}); }
            const dcV = tr > hr ? 1 : -1;
            while (hr !== tr) { hr += dcV; const w = carve(hc, hr); if (w && rooms.some(rm => hc >= rm.c && hc < rm.c + rm.w && hr >= rm.r && hr < rm.r + rm.h)) doorCandidates.push({c: hc, r: hr}); }
        }

        // --- 4. STONE BORDER around all floor cells ---
        for (const key of floorSet) {
            const [cc, cr] = key.split(",").map(Number);
            for (const [dc, dr] of dirs4) {
                const nc = cc + dc, nr = cr + dr;
                if (inBounds(nc, nr) && state.terrain[idx(nc, nr)].type === "abyss") {
                    state.terrain[idx(nc, nr)] = { type: "stone", variation: 0 };
                }
            }
        }

        // --- 5. DOORS at hallway-room junctions ---
        const placedDoors = new Set();
        for (const { c: dc, r: dr } of doorCandidates.slice(0, 10)) {
            const key = `${dc},${dr}`;
            if (!placedDoors.has(key) && Math.random() > 0.35) {
                placedDoors.add(key);
                const isHoriz = dirs4.some(([ddc, ddr]) => ddr === 0 && inBounds(dc+ddc, dr+ddr) && floorSet.has(`${dc+ddc},${dr+ddr}`));
                state.walls.push(isHoriz
                    ? { x1: dc+0.5, y1: dr, x2: dc+0.5, y2: dr+1, width: 6, color: "#5c3d1a" }
                    : { x1: dc, y1: dr+0.5, x2: dc+1, y2: dr+0.5, width: 6, color: "#5c3d1a" }
                );
            }
        }

        // --- 6. THEMATIC STAMPS ---
        const rng = (n) => Math.floor(Math.random() * n);
        const placeInRoom = (ri, emoji, name, desc, isToken, hp, secret) => {
            const rm = rooms[Math.min(ri, rooms.length - 1)];
            return {
                id: `pd-${theme}-${name.slice(0,4).toLowerCase()}${rng(99)}`,
                emoji, name, description: desc,
                x: rm.c + 1 + rng(Math.max(1, rm.w - 2)) + 0.5,
                y: rm.r + 1 + rng(Math.max(1, rm.h - 2)) + 0.5,
                size: isToken ? 1.0 : 0.8, rotation: rng(20) - 10,
                isToken: !!isToken, isHero: false, visionRadius: 0,
                hpCurrent: hp, hpMax: hp,
                conditions: isToken ? [] : undefined,
                showDescToPlayers: !secret, isSecret: !!secret
            };
        };

        const themeStamps = {
            dungeon:  [["🔥","Antorcha","Titilaante, media velada de aceite.",1,false,0,false],["📦","Cofre sellado","Lacre negro y cuerda de tripas. Probablemente trampeado.",2,false,0,true],["💀","Esqueleto guardián","Armadura oxidada y una mueca que parece permanente.",2,true,13,false],["🐀","Enjambre","El sonido antes de verlos.",3,true,22,false],["🪙","Monedas antiguas","Una cara que no aparece en ningún libro de historia.",4,false,0,false]],
            crypt:    [["⚰️","Sarcófago","Runas de contención en la tapa. Alguien no quería que saliera.",1,false,0,false],["🧟","Muerto ambulante","Lo que fue un clérigo. Todavía sujeta el símbolo sagrado.",2,true,22,false],["🕯️","Candelabro eterno","Las velas llevan siglos encendidas sin gastar.",3,false,0,false],["👻","Espíritu guardián","No ataca. Solo señala hacia atrás.",4,true,45,false]],
            prison:   [["⛓️","Cadenas vacías","Argollas con pelo. Sin restos de quien las llevó.",1,false,0,false],["🔑","Llave oxidada","Abre una celda que no aparece en este mapa.",2,false,0,true],["👹","Carcelero","Orco con manojo de llaves y las peores intenciones.",2,true,42,false],["🧑‍🍳","Prisionero","Habla sin parar de un tesoro enterrado bajo la celda sur.",3,true,8,false]],
            barracks: [["⚔️","Armería","Espadas estándar. Un escudo tiene una fecha de hace 80 años grabada.",1,false,0,false],["🛏️","Catre caliente","Alguien salió hace muy poco.",2,false,0,true],["🛡️","Comandante","Tres cicatrices paralelas. No da el primer golpe.",2,true,55,false],["📜","Órdenes de marcha","Movimiento de tropas hacia el sur. Firma con inicial 'M'.",3,false,0,true]],
            arcane:   [["📚","Librería arcana","Libros encadenados. El más pequeño lleva la cerradura más grande.",1,false,0,false],["🧪","Alambique activo","Burbujea cuando alguien dice un nombre propio.",2,false,0,false],["🤖","Gólem guardián","Arcilla con runas doradas. Todavía en línea.",2,true,65,false],["🌌","Portal inestable","Teletransporta a una sala aleatoria. O fuera. O a otra cosa.",3,false,0,false]]
        };

        // Hero at entrance
        const en = rooms[0];
        state.stamps.push({ id:"pd-hero", emoji:"🛡️", x:en.cx+0.5, y:en.cy+0.5, size:1.0, rotation:0, isToken:true, isHero:true, visionRadius:5, name:"Héroe", hpCurrent:30, hpMax:30, conditions:[], showDescToPlayers:true });

        for (const [emoji, name, desc, ri, isToken, hp, secret] of (themeStamps[theme] || themeStamps.dungeon)) {
            state.stamps.push(placeInRoom(ri, emoji, name, desc, isToken, hp || undefined, secret));
        }

        // Exit at last room
        const ex = rooms[rooms.length - 1];
        state.stamps.push({ id:"pd-exit", emoji:"🚪", x:ex.cx+0.5, y:ex.cy+0.5, size:1.0, rotation:0, isToken:false, isHero:false, visionRadius:0, name:`Salida — ${themeNames[theme]}`, description:"La puerta de salida. Lo que hay detrás es otra pregunta.", showDescToPlayers:true });

        selectedStampId = null;
        syncUIForMapMode();
        clearInitiative();
        revealFogAroundTokens();
        centerMap();
        saveHistory();
        draw();
    }

    // ---------------------------------------------------------------
    // CELLULAR AUTOMATA CAVE GENERATOR
    // Inspired by classic roguelike cave generation (public domain algorithm)
    // Produces organic cave networks — very different look from room-based dungeons
    // ---------------------------------------------------------------
    function generateCellularAutomataCave(forcedTheme) {
        const CAVE_THEMES = ["cave", "mine", "ice", "lava"];
        const theme = forcedTheme || CAVE_THEMES[Math.floor(Math.random() * CAVE_THEMES.length)];

        const themeNames = { cave: "Cueva Natural", mine: "Mina Abandonada", ice: "Caverna Helada", lava: "Gruta Volcánica" };
        const themeFloor = { cave: "stone", mine: "wood", ice: "snow", lava: "volcanic" };
        const themeEmoji = {
            cave: [["💀","Hueso","Un rastro de huesos antiguos. El aire huele a tierra húmeda.",1,false,0,false],
                   ["🐀","Enjambre de Ratas","El susurro antes de verlas.",2,true,22,false],
                   ["🕷️","Araña Gigante","Seda en cada cornisa. No la ves hasta que te toca la cara.",2,true,26,false],
                   ["📦","Suministros",  "Una mochila semidestruida. Contiene algo útil... y algo muy raro.",3,false,0,true]],
            mine:  [["⛏️","Pico abandonado","Está clavado en la roca. Nadie lo quitó.",1,false,0,false],
                   ["💎","Cristal arcano","Un cristal que pulsa en azul. Vale una fortuna o es una trampa.",2,false,0,true],
                   ["👹","Minero muerto","Está de pie. Lleva semanas. No parpadea.",2,true,42,false],
                   ["🔥","Gas inflamable","Un silbido constante cerca de las grietas. Cuidado con las antorchas.",3,false,0,false]],
            ice:   [["🧊","Cámara sellada","Bajo el hielo se ve una silueta congelada.",1,false,0,false],
                   ["🐺","Bestia ártica","Sus huellas todavía humean en el hielo.",2,true,26,false],
                   ["💀","Explorador congelado","En la mano tiene un mapa. Casi ilegible.",3,false,0,true],
                   ["✨","Cristal de luz","Emite calor. No debería existir aquí.",3,false,0,false]],
            lava:  [["🔥","Vent de lava","La roca cruje y se abre. Dentro, lava.",1,false,0,false],
                   ["🦎","Salamandra de fuego","Vive en los charcos de magma. CR alto.",2,true,58,false],
                   ["🪙","Monedas fundidas","Un tesoro antiguo, parcialmente derretido.",3,false,0,true],
                   ["🌋","Núcleo inestable","La cueva entera vibra cuando te acercas.",4,false,0,false]]
        };

        const cols = Math.floor(Math.random() * 8) + 26;  // 26-33
        const rows = Math.floor(Math.random() * 6) + 18;  // 18-23
        const WALL_CHANCE = 0.44;   // initial fill ratio (lower = more open)
        const ITERATIONS = 5;       // CA smoothing passes
        const BIRTH_LIMIT = 4;      // < this many wall neighbors → becomes floor
        const DEATH_LIMIT = 3;      // > this many wall neighbors → becomes wall

        state.cols = cols; state.rows = rows;
        gridColsInput.value = cols; gridRowsInput.value = rows;
        mapModeSelect.value = "combat"; chkShowGrid.checked = true;
        state.fog = Array(cols * rows).fill(true);
        state.walls = []; state.stamps = [];
        state.bgImage = ""; state.showBg = false;

        // Step 1: Random seed
        let grid = Array(cols * rows).fill(false);
        const rng = (x, y) => {
            const v = Math.sin(x * 127.1 + y * 311.7 + Date.now() * 0.001) * 43758.5453;
            return (v - Math.floor(v)) < WALL_CHANCE;
        };
        for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
                grid[r * cols + c] = (r === 0 || r === rows-1 || c === 0 || c === cols-1) ? true : rng(c, r);

        // Step 2: Cellular automata smoothing
        const countWallNeighbors = (g, c, r) => {
            let n = 0;
            for (let dr = -1; dr <= 1; dr++)
                for (let dc = -1; dc <= 1; dc++) {
                    if (dc === 0 && dr === 0) continue;
                    const nc = c + dc, nr = r + dr;
                    if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) n++;
                    else if (g[nr * cols + nc]) n++;
                }
            return n;
        };
        for (let i = 0; i < ITERATIONS; i++) {
            const next = [...grid];
            for (let r = 1; r < rows-1; r++) {
                for (let c = 1; c < cols-1; c++) {
                    const walls = countWallNeighbors(grid, c, r);
                    if (grid[r * cols + c]) next[r * cols + c] = walls >= DEATH_LIMIT;
                    else                    next[r * cols + c] = walls >  BIRTH_LIMIT;
                }
            }
            grid = next;
        }

        // Step 3: Flood fill — keep only the largest connected region
        const visited = new Array(cols * rows).fill(false);
        const floodFill = (sc, sr) => {
            const cells = [];
            const stack = [[sc, sr]];
            while (stack.length) {
                const [cc, cr] = stack.pop();
                const ki = cr * cols + cc;
                if (cc < 0 || cc >= cols || cr < 0 || cr >= rows) continue;
                if (visited[ki] || grid[ki]) continue;
                visited[ki] = true;
                cells.push([cc, cr]);
                stack.push([cc+1,cr],[cc-1,cr],[cc,cr+1],[cc,cr-1]);
            }
            return cells;
        };
        let largest = [];
        for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
                if (!grid[r * cols + c] && !visited[r * cols + c]) {
                    const region = floodFill(c, r);
                    if (region.length > largest.length) largest = region;
                }

        // Step 4: Build terrain — floor in largest region, abyss elsewhere
        const floor = themeFloor[theme] || "stone";
        state.terrain = Array(cols * rows).fill(null).map(() => ({ type: "abyss", variation: 0 }));
        const floorSet = new Set(largest.map(([c, r]) => `${c},${r}`));
        for (const [c, r] of largest) {
            state.terrain[r * cols + c] = { type: floor, variation: Math.floor(Math.random() * 3) };
        }

        // Step 5: Stone border around floor
        const dirs4 = [[1,0],[-1,0],[0,1],[0,-1]];
        for (const [c, r] of largest) {
            for (const [dc, dr] of dirs4) {
                const nc = c + dc, nr = r + dr;
                if (nc >= 0 && nc < cols && nr >= 0 && nr < rows && state.terrain[nr * cols + nc].type === "abyss")
                    state.terrain[nr * cols + nc] = { type: "stone", variation: 0 };
            }
        }

        // Step 6: Find entrance, exit and midpoints
        const floorArr = Array.from(floorSet).map(k => { const [c,r] = k.split(",").map(Number); return {c,r}; });
        floorArr.sort((a,b) => (a.r*cols+a.c) - (b.r*cols+b.c));
        const entrance = floorArr[Math.floor(floorArr.length * 0.08)] || floorArr[0];
        const exitCell = floorArr[Math.floor(floorArr.length * 0.92)] || floorArr[floorArr.length-1];
        const pick = (ratio) => floorArr[Math.floor(floorArr.length * ratio)] || floorArr[0];

        // Step 7: Stamps
        const rngI = (n) => Math.floor(Math.random() * n);
        const defs = themeEmoji[theme] || themeEmoji.cave;

        state.stamps.push({
            id: "ca-hero", emoji: "🛡️",
            x: entrance.c + 0.5, y: entrance.r + 0.5,
            size: 1.0, rotation: 0, isToken: true, isHero: true, visionRadius: 5,
            name: "Héroe", hpCurrent: 30, hpMax: 30, conditions: [], showDescToPlayers: true
        });

        for (const [emoji, name, desc, ri, isToken, hp, secret] of defs) {
            const cell = pick(ri / (defs.length + 1));
            state.stamps.push({
                id: `ca-${name.slice(0,4).toLowerCase()}${rngI(99)}`,
                emoji, name, description: desc,
                x: cell.c + 0.5, y: cell.r + 0.5,
                size: isToken ? 1.0 : 0.8, rotation: rngI(20) - 10,
                isToken: !!isToken, isHero: false, visionRadius: 0,
                hpCurrent: hp || undefined, hpMax: hp || undefined,
                conditions: isToken ? [] : undefined,
                showDescToPlayers: !secret, isSecret: !!secret
            });
        }

        state.stamps.push({
            id: "ca-exit", emoji: "🚪",
            x: exitCell.c + 0.5, y: exitCell.r + 0.5,
            size: 1.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0,
            name: `Salida — ${themeNames[theme]}`,
            description: "Una grieta en la roca lo bastante grande para pasar. O casi.",
            showDescToPlayers: true
        });

        selectedStampId = null;
        syncUIForMapMode();
        clearInitiative();
        revealFogAroundTokens();
        centerMap();
        saveHistory();
        draw();
    }

    function generateProceduralDungeonLegacy() {
        const steps = [
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1]
        ];
        const uid = Math.floor(Math.random() * 89999) + 10000;
        const cols = Math.floor(Math.random() * 9) + 18;
        const rows = Math.floor(Math.random() * 8) + 14;
        const complexity = Math.floor(Math.random() * 5) + 4;
        const seedText = `${String(cols).padStart(2, "0")}${String(rows).padStart(2, "0")}${complexity}${String(uid).padStart(5, "0")}`;
        const digitSum = String(uid).split("").reduce((sum, d) => sum + parseInt(d, 10), 0) || 1;
        const pathLength = Math.min(cols * rows * 0.45, Math.floor((cols + rows + digitSum) * Math.sqrt(complexity)));

        let startCol = 0;
        let startRow = 0;
        if (uid % 2 === 0) {
            startCol = Math.min(cols - 1, Math.max(0, Math.floor(cols * Math.sqrt(complexity / digitSum))));
        } else {
            startRow = Math.min(rows - 1, Math.max(0, Math.floor(rows * Math.sqrt(complexity / digitSum))));
        }

        const path = new Map();
        const key = (c, r) => `${c},${r}`;
        let c = startCol;
        let r = startRow;
        let lcgSeed = parseInt(seedText, 10) >>> 0;
        path.set(key(c, r), 2);

        const nextRandom = () => {
            lcgSeed = (Math.imul(1664525, lcgSeed) + 1013904223) >>> 0;
            return lcgSeed;
        };

        const canStep = (nc, nr) => {
            if (nc < 1 || nc >= cols - 1 || nr < 1 || nr >= rows - 1) return false;
            let adjacent = 0;
            for (const [dc, dr] of steps) {
                if (path.has(key(nc + dc, nr + dr))) adjacent++;
            }
            return adjacent <= 1;
        };

        for (let i = 0; i < pathLength; i++) {
            const preferred = nextRandom() % 4;
            const order = [preferred, (preferred + 1) % 4, (preferred + 3) % 4, (preferred + 2) % 4];
            let moved = false;
            for (const dir of order) {
                const [dc, dr] = steps[dir];
                const nc = c + dc;
                const nr = r + dr;
                if (canStep(nc, nr)) {
                    c = nc;
                    r = nr;
                    path.set(key(c, r), 1);
                    moved = true;
                    break;
                }
            }
            if (!moved) break;
        }
        path.set(key(c, r), 3);

        state.cols = cols;
        state.rows = rows;
        gridColsInput.value = cols;
        gridRowsInput.value = rows;
        mapModeSelect.value = "combat";
        chkShowGrid.checked = true;
        state.bgImage = "";
        state.showBg = false;
        state.travelScaleValue = 5;
        state.travelScaleUnit = "millas";
        state.travelMethod = "foot";
        state.fog = Array(cols * rows).fill(true);
        state.walls = [];
        state.terrain = Array(cols * rows).fill(null).map(() => ({ type: "abyss", variation: 0 }));

        for (const [cell, type] of path.entries()) {
            const [pc, pr] = cell.split(",").map(Number);
            const idx = pr * cols + pc;
            state.terrain[idx] = { type: type === 2 || type === 3 ? "wood" : "stone", variation: 0 };
            state.fog[idx] = false;

            for (const [dc, dr] of steps) {
                const nc = pc + dc;
                const nr = pr + dr;
                if (nc >= 0 && nc < cols && nr >= 0 && nr < rows && !path.has(key(nc, nr))) {
                    const nIdx = nr * cols + nc;
                    if (state.terrain[nIdx].type === "abyss") state.terrain[nIdx] = { type: "stone", variation: 0 };
                }
            }
        }

        const pathCells = Array.from(path.keys()).map(cell => {
            const [pc, pr] = cell.split(",").map(Number);
            return { c: pc, r: pr, type: path.get(cell) };
        });
        const byType = t => pathCells.find(cell => cell.type === t) || pathCells[0];
        const start = byType(2);
        const end = byType(3);
        const pick = ratio => pathCells[Math.min(pathCells.length - 1, Math.max(0, Math.floor(pathCells.length * ratio)))];
        const midA = pick(0.32);
        const midB = pick(0.58);
        const midC = pick(0.78);

        state.stamps = [
            {id: "pd-seed", emoji: "📜", x: start.c + 0.5, y: start.r + 0.5, size: 0.8, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: `Semilla ${seedText}`, description: "Mazmorra procedural inspirada en el generador MIT de MlakarT. Guarda esta semilla en notas si quieres recrear la idea manualmente.", showDescToPlayers: false},
            {id: "pd-hero", emoji: "🛡️", x: start.c + 0.5, y: start.r + 0.5, size: 1.0, rotation: 0, isToken: true, isHero: true, visionRadius: 5, name: "Entrada", hpCurrent: 30, hpMax: 30, conditions: []},
            {id: "pd-exit", emoji: "🚪", x: end.c + 0.5, y: end.r + 0.5, size: 1.0, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Salida mutable", description: "El corredor termina en una puerta que no estaba ahí cuando empezó la expedición.", showDescToPlayers: true},
            {id: "pd-cache", emoji: "📦", x: midA.c + 0.5, y: midA.r + 0.5, size: 0.8, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Cofre oculto", description: "Un cofre encajado entre piedras. Puede contener consumibles, mapas o una pista falsa.", showDescToPlayers: false, isSecret: true},
            {id: "pd-skeleton", emoji: "💀", x: midB.c + 0.5, y: midB.r + 0.5, size: 0.9, rotation: 0, isToken: true, isHero: false, visionRadius: 0, name: "Guardián errante", hpCurrent: 13, hpMax: 13, conditions: []},
            {id: "pd-trap", emoji: "☠️", x: midC.c + 0.5, y: midC.r + 0.5, size: 0.8, rotation: 0, isToken: false, isHero: false, visionRadius: 0, name: "Trampa de bucle", description: "Una trampa que no daña el cuerpo: cambia la orientación del pasillo durante unos minutos.", showDescToPlayers: false, isSecret: true}
        ];

        selectedStampId = null;
        syncUIForMapMode();
        clearInitiative();
        revealFogAroundTokens();
        centerMap();
        saveHistory();
        draw();
    }

    // --- PRESET TEMPLATES LOADER ---
    function loadPresetTemplate(name) {
        const tmpl = mapTemplates[name];
        if (!tmpl) return;
        
        // Clean map state
        state.cols = tmpl.cols;
        state.rows = tmpl.rows;
        gridColsInput.value = tmpl.cols;
        gridRowsInput.value = tmpl.rows;
        
        state.terrain = decodeTerrain(tmpl.terrainStr, tmpl.cols, tmpl.rows, tmpl.terrainMap).map(cell => {
            return { type: cell, variation: Math.floor(Math.random() * 3) };
        });
        state.walls = JSON.parse(JSON.stringify(tmpl.walls));
        state.stamps = JSON.parse(JSON.stringify(tmpl.stamps));
        
        // Initialize Fog of War
        state.fog = Array(tmpl.cols * tmpl.rows).fill(false);
        
        // Set map mode defaults
        if (tmpl.mode === "region") {
            mapModeSelect.value = "region";
            chkShowGrid.checked = false;
            state.travelScaleValue = tmpl.travelScaleValue || 10;
            state.travelScaleUnit = tmpl.travelScaleUnit || "millas";
            state.travelMethod = tmpl.travelMethod || "foot";
        } else {
            mapModeSelect.value = "combat";
            chkShowGrid.checked = true;
            // For combat dungeons, cover everything in fog to test dynamic visibility!
            if (name === "dungeon" || name === "ruins" || name === "cave") {
                state.fog.fill(true);
            }
        }

        if (travelScaleValueInput) travelScaleValueInput.value = state.travelScaleValue;
        if (travelScaleUnitSelect) travelScaleUnitSelect.value = state.travelScaleUnit;
        if (travelMethodSelect) travelMethodSelect.value = state.travelMethod;
        
        selectedStampId = null;
        syncUIForMapMode();
        clearInitiative();
        revealFogAroundTokens();
        
        resizeCanvas();
        centerMap();
        saveHistory();
        draw();
    }

    // --- SYNTHETIC DICE ROLLER WITH AUDIO SYNTH ---
    function rollDice(die) {
        playDiceSound();
        
        // Rolling animation in console
        let rollCount = 0;
        const maxRolls = 8;
        const interval = 60; // ms
        const overlay = startDiceOverlay(die);
        
        diceConsole.innerHTML = `<div class="roll-result">🎲 Lanzando d${die}...</div>`;
        
        const rollTimer = setInterval(() => {
            const tempVal = Math.floor(Math.random() * die) + 1;
            updateDiceOverlay(overlay, tempVal);
            diceConsole.innerHTML = `<div class="roll-result">🎲 Lanzando d${die}: <span class="roll-val">${tempVal}</span></div>`;
            rollCount++;
            
            if (rollCount >= maxRolls) {
                clearInterval(rollTimer);
                
                // Final result
                const resultVal = Math.floor(Math.random() * die) + 1;
                let resultClass = "roll-val";
                let textResult = `${resultVal}`;
                
                if (die === 20) {
                    if (resultVal === 20) {
                        resultClass = "roll-crit";
                        textResult = "🎯 ¡CRÍTICO NAT 20!";
                    } else if (resultVal === 1) {
                        resultClass = "roll-fail";
                        textResult = "💥 ¡PIFIA NAT 1!";
                    }
                } else if (resultVal === die) {
                    resultClass = "roll-crit"; // max result on other dice
                }
                finishDiceOverlay(overlay, die, resultVal, resultClass);
                
                diceConsole.innerHTML = `
                    <div class="roll-result">
                        Lanzó <strong>d${die}</strong>: 
                        <span class="${resultClass}">${textResult}</span>
                    </div>
                `;
            }
        }, interval);
    }

    function getDiceOverlay() {
        let overlay = document.getElementById("diceRollOverlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "diceRollOverlay";
            overlay.className = "dice-roll-overlay";
            overlay.innerHTML = `
                <div class="dice-roll-card">
                    <div class="dice-roll-label">d20</div>
                    <div class="dice-roll-cube">
                        <span class="dice-roll-value">?</span>
                    </div>
                    <div class="dice-roll-caption">Lanzando...</div>
                </div>
            `;
            viewport.appendChild(overlay);
        }
        return overlay;
    }

    // clip-path shapes per die type
    const DICE_SHAPES = {
        4:   "polygon(50% 0%, 0% 100%, 100% 100%)",                                                  // triangle
        6:   "none",                                                                                   // square (default border-radius)
        8:   "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",                                          // diamond
        10:  "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",                                // pentagon
        12:  "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",                         // hexagon
        20:  "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",                         // hexagon (d20)
        100: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",                                // pentagon (d100)
    };

    function startDiceOverlay(die) {
        const overlay = getDiceOverlay();
        if (diceOverlayCleanupTimer) {
            clearTimeout(diceOverlayCleanupTimer);
            diceOverlayCleanupTimer = null;
        }

        const cube = overlay.querySelector(".dice-roll-cube");
        const shape = DICE_SHAPES[die] || "none";
        cube.style.setProperty("--dice-clip", shape);
        cube.style.borderRadius = (die === 6) ? "14px" : (die === 4 ? "4px" : "0px");

        overlay.querySelector(".dice-roll-label").textContent = `d${die}`;
        overlay.querySelector(".dice-roll-value").textContent = "?";
        overlay.querySelector(".dice-roll-caption").textContent = "Lanzando...";
        overlay.className = "dice-roll-overlay visible rolling";
        return overlay;
    }

    function updateDiceOverlay(overlay, value) {
        if (!overlay) return;
        overlay.querySelector(".dice-roll-value").textContent = value;
        overlay.querySelector(".dice-roll-cube").style.setProperty("--roll-spin", `${Math.random() * 60 - 30}deg`);
    }

    function finishDiceOverlay(overlay, die, value, resultClass) {
        if (!overlay) return;
        const isCrit = die === 20 && value === 20;
        const isFail = die === 20 && value === 1;
        const isMax  = !isCrit && !isFail && value === die;

        const caption = isCrit ? "⚡ ¡CRÍTICO NATURAL!" : isFail ? "💀 ¡PIFIA NATURAL!" : isMax ? "✨ Máximo" : "Resultado";
        const displayVal = isCrit ? "20" : isFail ? "1" : String(value);

        overlay.querySelector(".dice-roll-value").textContent = displayVal;
        overlay.querySelector(".dice-roll-caption").textContent = caption;
        overlay.className = `dice-roll-overlay visible reveal ${resultClass}`;

        const holdMs = isCrit || isFail ? 2400 : 1600;
        diceOverlayCleanupTimer = setTimeout(() => {
            overlay.className = "dice-roll-overlay";
        }, holdMs);
    }

    function playDiceSound() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContextClass();
            const now = audioCtx.currentTime;
            
            // Generate 3 rapid thuds/clacks
            for (let i = 0; i < 3; i++) {
                const time = now + i * 0.08;
                
                // Pitch osc
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = "triangle";
                osc.frequency.setValueAtTime(140 - i * 30, time);
                osc.frequency.exponentialRampToValueAtTime(40, time + 0.06);
                
                gain.gain.setValueAtTime(0.18, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.06);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(time);
                osc.stop(time + 0.06);
            }
        } catch (e) {
            // Audio context failed or blocked, swallow silently
        }
    }

    // --- JSON FILE & PNG EXPORT ---
    function saveMapJson() {
        const dataStr = JSON.stringify(state, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = `mapforge-dnd-map-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function loadMapJson(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const parsed = JSON.parse(evt.target.result);
                if (parsed.cols && parsed.rows && parsed.terrain) {
                    restoreState(parsed);
                    saveHistory();
                    centerMap();
                    draw();
                    alert("Mapa cargado con éxito.");
                } else {
                    alert("Archivo JSON inválido. No tiene el formato de MapForge.");
                }
            } catch (err) {
                alert("Error al parsear el archivo JSON: " + err.message);
            }
        };
        reader.readAsText(file);
    }

    function exportMapPng() {
        const expCanvas = document.createElement("canvas");
        const expCtx = expCanvas.getContext("2d");
        
        expCanvas.width = canvas.width;
        expCanvas.height = canvas.height;
        
        const includeGrid = confirm("¿Quieres exportar el mapa INCLUYENDO las líneas de rejilla?");
        
        drawTerrain(expCtx);
        if (includeGrid) {
            drawGridLines(expCtx);
        }
        drawWalls(expCtx);
        drawStamps(expCtx);
        drawFog(expCtx);
        
        const url = expCanvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `mapforge-dnd-export-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // --- INITIATIVE TRACKER ENGINE ---
    function drawInitiativeList() {
        if (!initiativeList) return;
        initiativeList.innerHTML = "";
        
        if (!state.initiative || state.initiative.length === 0) {
            initiativeList.innerHTML = `<div class="init-placeholder">Sin combate activo...</div>`;
            return;
        }
        
        state.initiative.forEach((item, idx) => {
            const isActive = (idx === activeInitIdx);
            const itemEl = document.createElement("div");
            itemEl.className = `init-item ${isActive ? "active" : ""}`;
            
            itemEl.innerHTML = `
                <div class="name-group">
                    ${isActive ? '<span class="active-indicator">➔</span>' : ''}
                    <span>${item.name}</span>
                </div>
                <div class="score-group">
                    <span class="score">${item.value}</span>
                    <button class="btn-remove-init" data-id="${item.id}">×</button>
                </div>
            `;
            
            itemEl.querySelector(".btn-remove-init").addEventListener("click", (e) => {
                e.stopPropagation();
                removeCreatureFromInitiative(item.id);
            });
            
            initiativeList.appendChild(itemEl);
        });
    }

    function sortInitiative() {
        const activeId = state.initiative[activeInitIdx]?.id;
        state.initiative.sort((a, b) => b.value - a.value);
        if (activeId) {
            const newIdx = state.initiative.findIndex(x => x.id === activeId);
            if (newIdx !== -1) {
                activeInitIdx = newIdx;
            }
        }
    }

    function addCreatureToInitiative(name, val) {
        const id = Date.now() + Math.random().toString(36).substr(2, 5);
        state.initiative.push({ id, name, value: val });
        sortInitiative();
        saveHistory();
        drawInitiativeList();
    }

    function removeCreatureFromInitiative(id) {
        const idxToRemove = state.initiative.findIndex(x => x.id === id);
        if (idxToRemove !== -1) {
            state.initiative.splice(idxToRemove, 1);
            if (activeInitIdx >= state.initiative.length) {
                activeInitIdx = 0;
            } else if (idxToRemove < activeInitIdx) {
                activeInitIdx--;
            }
            saveHistory();
            drawInitiativeList();
        }
    }

    function advanceInitiativeTurn() {
        if (!state.initiative || state.initiative.length <= 1) return;
        activeInitIdx = (activeInitIdx + 1) % state.initiative.length;
        drawInitiativeList();
    }

    function clearInitiative() {
        state.initiative = [];
        activeInitIdx = 0;
        saveHistory();
        drawInitiativeList();
    }

    // --- BIND NEW EVENTS ---
    function bindExtraEvents() {
        viewModeSelect.addEventListener("change", () => {
            updateStampControlUI();
            draw();
        });

        if (travelScaleValueInput) {
            travelScaleValueInput.addEventListener("change", (e) => {
                state.travelScaleValue = Math.max(0.1, parseFloat(e.target.value) || 10);
                saveHistory();
                draw();
            });
        }

        if (travelScaleUnitSelect) {
            travelScaleUnitSelect.addEventListener("change", (e) => {
                state.travelScaleUnit = e.target.value;
                saveHistory();
                draw();
            });
        }

        if (travelMethodSelect) {
            travelMethodSelect.addEventListener("change", (e) => {
                state.travelMethod = e.target.value;
                saveHistory();
                draw();
            });
        }

        if (tokenDescriptionInput) {
            tokenDescriptionInput.addEventListener("input", (e) => {
                if (selectedStampId) {
                    const s = state.stamps.find(x => x.id === selectedStampId);
                    if (s) {
                        s.description = e.target.value;
                    }
                }
            });
            tokenDescriptionInput.addEventListener("change", () => {
                if (selectedStampId) saveHistory();
            });
        }

        if (tokenShowDescToPlayersChk) {
            tokenShowDescToPlayersChk.addEventListener("change", (e) => {
                if (selectedStampId) {
                    const s = state.stamps.find(x => x.id === selectedStampId);
                    if (s) {
                        s.showDescToPlayers = e.target.checked;
                        saveHistory();
                    }
                }
            });
        }

        btnInitNext.addEventListener("click", advanceInitiativeTurn);
        btnInitClear.addEventListener("click", clearInitiative);
        btnInitAdd.addEventListener("click", () => {
            const name = initAddName.value.trim();
            const val = parseInt(initAddValue.value);
            if (name) {
                addCreatureToInitiative(name, isNaN(val) ? 10 : val);
                initAddName.value = "";
                initAddValue.value = "";
            }
        });
        initAddName.addEventListener("keydown", (e) => {
            if (e.key === "Enter") btnInitAdd.click();
        });
        initAddValue.addEventListener("keydown", (e) => {
            if (e.key === "Enter") btnInitAdd.click();
        });
    }

    // --- INTEGRACIÓN PANEL DE CAMPAÑA Y HERRAMIENTAS VTT ---
    function setupRightPanel() {
        const rightPanel = document.getElementById("rightPanel");
        const btnToggleRightPanel = document.getElementById("btnToggleRightPanel");
        
        // Pestañas
        const rightTabBtns = document.querySelectorAll(".right-tab-btn");
        const rightTabContents = document.querySelectorAll(".right-tab-content");
        
        // IA Master
        const aiModelSelect = document.getElementById("aiModelSelect");
        const aiChatMessages = document.getElementById("aiChatMessages");
        const aiChatInput = document.getElementById("aiChatInput");
        const btnAiChatSend = document.getElementById("btnAiChatSend");
        const shortcutBtns = document.querySelectorAll(".shortcut-btn");
        
        // Compendio
        const compendiumSearch = document.getElementById("compendiumSearch");
        const compendiumFilter = document.getElementById("compendiumFilter");
        const compendiumResults = document.getElementById("compendiumResults");
        const compendiumDetail = document.getElementById("compendiumDetail");
        const compendiumDetailContent = document.getElementById("compendiumDetailContent");
        const btnBackToResults = document.getElementById("btnBackToResults");
        
        // Notas
        const campaignNotes = document.getElementById("campaignNotes");
        const notesSaveStatus = document.getElementById("notesSaveStatus");
        
        // Biblioteca
        const libSaveName = document.getElementById("libSaveName");
        const btnLibSave = document.getElementById("btnLibSave");
        const libraryList = document.getElementById("libraryList");

        // Fondo de Mapa
        const chkShowBg = document.getElementById("chkShowBg");
        const bgImageInput = document.getElementById("bgImageInput");
        const bgTemplateSelect = document.getElementById("bgTemplateSelect");
        const weatherSelect = document.getElementById("weatherSelect");
        const bgOpacity = document.getElementById("bgOpacity");
        const bgScale = document.getElementById("bgScale");
        const bgX = document.getElementById("bgX");
        const bgY = document.getElementById("bgY");
        
        // Avatar Personalizado
        const customAvatarInput = document.getElementById("customAvatarInput");
        const customAvatarPreview = document.getElementById("customAvatarPreview");
        const imgAvatarPrev = document.getElementById("imgAvatarPrev");
        const customAvatarNameGroup = document.getElementById("customAvatarNameGroup");
        const customAvatarName = document.getElementById("customAvatarName");
        const customAvatarTypeGroup = document.getElementById("customAvatarTypeGroup");
        const customAvatarType = document.getElementById("customAvatarType");
        const btnCreateCustomToken = document.getElementById("btnCreateCustomToken");

        // --- 1. CONTROL COLAPSAR/EXPANDIR ---
        const savedState = localStorage.getItem("rightPanelCollapsed");
        if (savedState === "true") {
            rightPanel.classList.add("collapsed");
            btnToggleRightPanel.textContent = "◀";
        } else {
            rightPanel.classList.remove("collapsed");
            btnToggleRightPanel.textContent = "▶";
        }

        btnToggleRightPanel.addEventListener("click", () => {
            const isCollapsed = rightPanel.classList.toggle("collapsed");
            localStorage.setItem("rightPanelCollapsed", isCollapsed);
            btnToggleRightPanel.textContent = isCollapsed ? "◀" : "▶";
            
            // Re-centrar el mapa y dibujar para evitar huecos en el canvas
            setTimeout(() => {
                handleWindowResize();
                centerMap();
                draw();
            }, 300); // espera a que acabe la animación CSS
        });

        // --- 2. GESTIÓN DE PESTAÑAS ---
        rightTabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                rightTabBtns.forEach(b => b.classList.remove("active"));
                rightTabContents.forEach(c => c.classList.remove("active"));
                
                btn.classList.add("active");
                const tabId = btn.dataset.tab;
                document.getElementById(tabId).classList.add("active");
            });
        });

        // --- 3. NOTAS DE CAMPAÑA AUTO-GUARDADAS ---
        campaignNotes.value = localStorage.getItem("campaignNotes") || "";
        let notesTimeout = null;
        campaignNotes.addEventListener("input", () => {
            notesSaveStatus.textContent = "Guardando...";
            notesSaveStatus.style.opacity = "1";
            
            clearTimeout(notesTimeout);
            notesTimeout = setTimeout(() => {
                localStorage.setItem("campaignNotes", campaignNotes.value);
                notesSaveStatus.textContent = "Nota guardada localmente";
            }, 500);
        });

        // --- 4. BIBLIOTECA DE MAPAS EN LOCALSTORAGE ---
        function getLibraryMaps() {
            try {
                return JSON.parse(localStorage.getItem("mapForgeLibrary")) || [];
            } catch (e) {
                return [];
            }
        }

        function saveLibraryMaps(maps) {
            localStorage.setItem("mapForgeLibrary", JSON.stringify(maps));
        }

        function renderLibrary() {
            libraryList.innerHTML = "";
            const maps = getLibraryMaps();
            if (maps.length === 0) {
                libraryList.innerHTML = '<div class="lib-placeholder">No hay mapas guardados en el navegador...</div>';
                return;
            }

            maps.forEach((item, idx) => {
                const itemEl = document.createElement("div");
                itemEl.className = "lib-item";
                
                // Contar stamps y walls
                const stampsCount = item.state?.stamps?.length || 0;
                const wallsCount = item.state?.walls?.length || 0;
                const sizeStr = `${item.state?.cols || 25}x${item.state?.rows || 20}`;
                
                itemEl.innerHTML = `
                    <div class="name-group">
                        <span class="map-name">${item.name}</span>
                        <span class="map-meta">${sizeStr} | Fichas: ${stampsCount} | Muros: ${wallsCount} | ${item.date}</span>
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-small btn-lib-load" data-idx="${idx}">Cargar</button>
                        <button class="btn btn-danger btn-small btn-lib-del" data-idx="${idx}">🗑️</button>
                    </div>
                `;
                
                itemEl.querySelector(".btn-lib-load").addEventListener("click", () => {
                    if (confirm(`¿Quieres cargar el mapa "${item.name}"? Se perderá el diseño actual no guardado.`)) {
                        restoreState(item.state);
                        saveHistory();
                        centerMap();
                        draw();
                        alert(`Mapa "${item.name}" cargado con éxito.`);
                    }
                });
                
                itemEl.querySelector(".btn-lib-del").addEventListener("click", () => {
                    if (confirm(`¿Eliminar permanentemente "${item.name}" de la biblioteca?`)) {
                        const currentMaps = getLibraryMaps();
                        currentMaps.splice(idx, 1);
                        saveLibraryMaps(currentMaps);
                        renderLibrary();
                    }
                });
                
                libraryList.appendChild(itemEl);
            });
        }

        btnLibSave.addEventListener("click", () => {
            const name = libSaveName.value.trim();
            if (!name) {
                alert("Por favor, ingresa un nombre para el mapa.");
                return;
            }
            
            const currentMaps = getLibraryMaps();
            
            // Deep copy of current state
            const stateCopy = JSON.parse(JSON.stringify({
                cols: state.cols,
                rows: state.rows,
                terrain: state.terrain,
                walls: state.walls,
                stamps: state.stamps,
                fog: state.fog,
                initiative: state.initiative,
                bgImage: state.bgImage,
                bgScale: state.bgScale,
                bgX: state.bgX,
                bgY: state.bgY,
                bgOpacity: state.bgOpacity,
                showBg: state.showBg,
                weather: state.weather,
                travelScaleValue: state.travelScaleValue,
                travelScaleUnit: state.travelScaleUnit,
                travelMethod: state.travelMethod
            }));
            
            currentMaps.push({
                name: name,
                state: stateCopy,
                date: new Date().toLocaleDateString()
            });
            
            saveLibraryMaps(currentMaps);
            renderLibrary();
            libSaveName.value = "";
            alert("Mapa guardado en la biblioteca local.");
        });

        // --- BIND BACKGROUND IMAGE LISTENERS ---
        if (chkShowBg) {
            chkShowBg.addEventListener("change", (e) => {
                state.showBg = e.target.checked;
                saveHistory();
                draw();
            });
        }

        if (bgOpacity) {
            bgOpacity.addEventListener("input", (e) => {
                state.bgOpacity = parseFloat(e.target.value);
                const valEl = document.getElementById("bgOpacityVal");
                if (valEl) valEl.textContent = `${Math.round(state.bgOpacity * 100)}%`;
                draw();
            });
            bgOpacity.addEventListener("change", () => {
                saveHistory();
            });
        }

        if (bgScale) {
            bgScale.addEventListener("input", (e) => {
                state.bgScale = parseFloat(e.target.value);
                const valEl = document.getElementById("bgScaleVal");
                if (valEl) valEl.textContent = `${state.bgScale.toFixed(1)}x`;
                draw();
            });
            bgScale.addEventListener("change", () => {
                saveHistory();
            });
        }

        if (bgX) {
            bgX.addEventListener("input", (e) => {
                state.bgX = parseInt(e.target.value);
                const valEl = document.getElementById("bgXVal");
                if (valEl) valEl.textContent = `${state.bgX}px`;
                draw();
            });
            bgX.addEventListener("change", () => {
                saveHistory();
            });
        }

        if (bgY) {
            bgY.addEventListener("input", (e) => {
                state.bgY = parseInt(e.target.value);
                const valEl = document.getElementById("bgYVal");
                if (valEl) valEl.textContent = `${state.bgY}px`;
                draw();
            });
            bgY.addEventListener("change", () => {
                saveHistory();
            });
        }

        if (bgImageInput) {
            bgImageInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        state.bgImage = event.target.result;
                        state.showBg = true;
                        if (chkShowBg) chkShowBg.checked = true;
                        if (bgTemplateSelect) bgTemplateSelect.value = "";
                        saveHistory();
                        draw();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (bgTemplateSelect) {
            bgTemplateSelect.addEventListener("change", (e) => {
                const val = e.target.value;
                const template = bgTemplates[val];
                if (template) {
                    state.bgImage = template.src;
                    state.bgScale = template.scale;
                    state.bgX = template.x;
                    state.bgY = template.y;
                    state.showBg = true;
                    state.bgOpacity = 0.85;
                    if (chkShowBg) chkShowBg.checked = true;
                    if (bgScale) bgScale.value = state.bgScale;
                    if (bgX) bgX.value = state.bgX;
                    if (bgY) bgY.value = state.bgY;
                    if (bgOpacity) bgOpacity.value = state.bgOpacity;
                    const scaleVal = document.getElementById("bgScaleVal");
                    const xVal = document.getElementById("bgXVal");
                    const yVal = document.getElementById("bgYVal");
                    const opacityVal = document.getElementById("bgOpacityVal");
                    if (scaleVal) scaleVal.textContent = `${state.bgScale.toFixed(1)}x`;
                    if (xVal) xVal.textContent = `${state.bgX}px`;
                    if (yVal) yVal.textContent = `${state.bgY}px`;
                    if (opacityVal) opacityVal.textContent = `${Math.round(state.bgOpacity * 100)}%`;
                } else {
                    state.bgImage = "";
                }
                saveHistory();
                draw();
            });
        }

        if (weatherSelect) {
            weatherSelect.addEventListener("change", (e) => {
                state.weather = e.target.value;
                updateWeatherSystem();
                saveHistory();
                draw();
            });
        }

        // --- BIND CUSTOM AVATAR UPLOADER LISTENERS ---
        if (customAvatarInput) {
            customAvatarInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (imgAvatarPrev) imgAvatarPrev.src = event.target.result;
                        if (customAvatarPreview) customAvatarPreview.style.display = "block";
                        if (customAvatarNameGroup) customAvatarNameGroup.style.display = "flex";
                        if (customAvatarTypeGroup) customAvatarTypeGroup.style.display = "flex";
                        if (btnCreateCustomToken) btnCreateCustomToken.style.display = "block";
                        
                        // Prefill token name from file name if empty
                        if (customAvatarName && !customAvatarName.value.trim()) {
                            const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                            customAvatarName.value = nameWithoutExt.substring(0, 15);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (btnCreateCustomToken) {
            btnCreateCustomToken.addEventListener("click", () => {
                const avatarDataUrl = imgAvatarPrev ? imgAvatarPrev.src : "";
                if (!avatarDataUrl) {
                    alert("Por favor, selecciona una imagen primero.");
                    return;
                }
                
                const name = (customAvatarName && customAvatarName.value.trim()) ? customAvatarName.value.trim() : "Ficha";
                const type = customAvatarType ? customAvatarType.value : "hero";
                const isHero = (type === "hero");
                
                // Calculate position near the center of the viewport
                const viewCanvasX = (-panX + viewport.clientWidth / 2) / zoom;
                const viewCanvasY = (-panY + viewport.clientHeight / 2) / zoom;
                const viewHex = isHexMode() ? getClosestHex(viewCanvasX, viewCanvasY) : null;
                const viewX = viewHex ? viewHex.col + 0.5 : viewCanvasX / state.cellSize;
                const viewY = viewHex ? viewHex.row + 0.5 : viewCanvasY / state.cellSize;
                
                const hp = isHero ? 25 : 15;
                
                const newStamp = {
                    id: Date.now() + Math.random().toString(36).substr(2, 5),
                    emoji: isHero ? "🛡️" : "👹", // Fallback emoji if image fails to render
                    image: avatarDataUrl,
                    x: Math.max(0.5, Math.min(state.cols - 0.5, viewX)),
                    y: Math.max(0.5, Math.min(state.rows - 0.5, viewY)),
                    size: 1.0,
                    rotation: 0,
                    isToken: true,
                    isHero: isHero,
                    visionRadius: isHero ? 4 : 0,
                    name: name,
                    hpCurrent: hp,
                    hpMax: hp,
                    conditions: [],
                    isSecret: false,
                    freePosition: false
                };
                
                state.stamps.push(newStamp);
                selectedStampId = newStamp.id;
                revealFogAroundTokens();
                updateStampControlUI();
                saveHistory();
                draw();
                
                // Clear the uploader elements
                if (customAvatarInput) customAvatarInput.value = "";
                if (imgAvatarPrev) imgAvatarPrev.src = "";
                if (customAvatarName) customAvatarName.value = "";
                if (customAvatarPreview) customAvatarPreview.style.display = "none";
                if (customAvatarNameGroup) customAvatarNameGroup.style.display = "none";
                if (customAvatarTypeGroup) customAvatarTypeGroup.style.display = "none";
                if (btnCreateCustomToken) btnCreateCustomToken.style.display = "none";
                
                alert(`Ficha personalizada "${name}" creada en el mapa.`);
            });
        }

        // --- 4b. ENCOUNTER GENERATOR ---
        (function setupEncounterGenerator() {
            // XP thresholds per character per level [easy, medium, hard, deadly]
            const XP_THRESH = {
                1:[25,50,75,100], 2:[50,100,150,200], 3:[75,150,225,400],
                4:[125,250,375,500], 5:[250,500,750,1100], 6:[300,600,900,1400],
                7:[350,750,1100,1700], 8:[450,900,1400,2100], 9:[550,1100,1600,2400],
                10:[600,1200,1900,2800], 11:[800,1600,2400,3600], 12:[1000,2000,3000,4500],
                13:[1100,2200,3400,5100], 14:[1250,2500,3800,5700], 15:[1400,2800,4300,6400],
                16:[1600,3200,4800,7200], 17:[2000,3900,5900,8800], 18:[2100,4200,6300,9500],
                19:[2400,4900,7300,10900], 20:[2800,5700,8500,12700]
            };
            // CR → XP
            const CR_XP = { "0":10,"1/8":25,"1/4":50,"1/2":100,"1":200,"2":450,"3":700,"4":1100,
                "5":1800,"6":2300,"7":2900,"8":3900,"9":5000,"10":5900,"11":7200,"12":8400,
                "13":10000,"14":11500,"15":13000,"16":15000,"17":18000,"18":20000,"19":22000,"20":25000,
                "21":33000,"22":41000,"23":50000,"24":62000 };
            // Multi-monster XP multipliers [1, 2, 3-6, 7-10, 11-14, 15+]
            const MULTI = [1, 1.5, 2, 2.5, 3, 4];
            const getMulti = (n) => n <= 1 ? MULTI[0] : n === 2 ? MULTI[1] : n <= 6 ? MULTI[2] : n <= 10 ? MULTI[3] : n <= 14 ? MULTI[4] : MULTI[5];
            // Terrain → monster environment hints
            const TERRAIN_TYPES = {
                forest:   ["beast","fey","plant","humanoid"],
                dungeon:  ["undead","construct","aberration","humanoid"],
                plains:   ["humanoid","beast","giant"],
                swamp:    ["beast","humanoid","undead","plant"],
                mountain: ["giant","humanoid","monstrosity","dragon"],
                coast:    ["beast","humanoid","elemental"],
                desert:   ["humanoid","undead","monstrosity","elemental"],
                arctic:   ["beast","giant","humanoid","monstrosity"],
                urban:    ["humanoid","undead","construct"]
            };
            // Monster emoji by type
            const TYPE_EMOJI = { humanoid:"👤", undead:"💀", beast:"🐺", dragon:"🐉", fiend:"😈",
                monstrosity:"🦑", elemental:"🌪️", fey:"✨", giant:"🗿", aberration:"👁️",
                construct:"🤖", plant:"🌿", ooze:"🫧", celestial:"⭐", default:"❓" };

            let lastEncounter = null;

            const btnGen = document.getElementById("btnGenerateEncounter");
            const btnSpawn = document.getElementById("btnSpawnEncounter");
            const btnReroll = document.getElementById("btnRerollEncounter");
            const resultDiv = document.getElementById("encounterResult");
            const emptyDiv = document.getElementById("encounterEmpty");
            const headerDiv = document.getElementById("encounterHeader");
            const listDiv = document.getElementById("encounterMonsterList");

            function crToNum(cr) {
                if (cr === "1/8") return 0.125;
                if (cr === "1/4") return 0.25;
                if (cr === "1/2") return 0.5;
                return parseFloat(cr) || 0;
            }

            function generateEncounter() {
                const monsters = localMonsterDb;
                if (!monsters || monsters.length === 0) {
                    listDiv.innerHTML = '<p style="color:var(--text-muted);font-size:12px;">Cargando bestiario...</p>';
                    loadLocalMonsters().then(generateEncounter);
                    return;
                }

                const level   = parseInt(document.getElementById("encPartyLevel").value) || 5;
                const size    = parseInt(document.getElementById("encPartySize").value) || 4;
                const diff    = document.getElementById("encDifficulty").value || "medium";
                const terrain = document.getElementById("encTerrain").value || "any";
                const mtype   = document.getElementById("encMonsterType").value || "any";

                const diffIdx = { easy:0, medium:1, hard:2, deadly:3 };
                const thresh = XP_THRESH[Math.min(20, Math.max(1, level))] || XP_THRESH[5];
                const budget = thresh[diffIdx[diff] ?? 1] * size;

                // CR range: budget/5 to budget (single monster)
                const maxCR  = budget;
                const minXP  = budget * 0.15;

                // Filter monsters
                let pool = monsters.filter(m => {
                    if (!m.name || !m.challenge_rating) return false;
                    const xp = CR_XP[String(m.challenge_rating)] ?? 0;
                    if (xp < minXP || xp > maxCR) return false;
                    if (mtype !== "any" && m.type !== mtype) return false;
                    if (terrain !== "any") {
                        const allowed = TERRAIN_TYPES[terrain] || [];
                        if (!allowed.includes(m.type)) return false;
                    }
                    return true;
                });

                // Fallback: relax terrain filter if too few options
                if (pool.length < 3) pool = monsters.filter(m => {
                    if (!m.name || !m.challenge_rating) return false;
                    const xp = CR_XP[String(m.challenge_rating)] ?? 0;
                    if (xp < minXP || xp > maxCR) return false;
                    if (mtype !== "any" && m.type !== mtype) return false;
                    return true;
                });

                if (pool.length === 0) {
                    listDiv.innerHTML = '<p style="color:var(--text-muted);font-size:12px;text-align:center;">Sin monstruos para estos parámetros. Prueba cambiando nivel o tipo.</p>';
                    resultDiv.style.display = "block";
                    emptyDiv.style.display = "none";
                    return;
                }

                // Pick 1-3 monster types and fill budget
                const shuffle = arr => { for (let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];} return arr; };
                shuffle(pool);
                const pick = pool[Math.floor(Math.random() * Math.min(pool.length, 8))];

                // Try to fill with multiples of the picked monster
                const pickXP = CR_XP[String(pick.challenge_rating)] || 1;
                let count = 1;
                while (count < 8) {
                    const multi = getMulti(count + 1);
                    if (pickXP * (count + 1) * multi <= budget * 1.2) count++;
                    else break;
                }

                // Optionally add a different monster type
                const groups = [{ monster: pick, count }];
                const usedXP = pickXP * count * getMulti(count);
                const remaining = budget - usedXP;
                if (remaining > 50 && pool.length > 1) {
                    const pool2 = pool.filter(m => m !== pick && (CR_XP[String(m.challenge_rating)] || 0) <= remaining * 1.5);
                    if (pool2.length > 0) {
                        const pick2 = pool2[Math.floor(Math.random() * Math.min(pool2.length, 5))];
                        groups.push({ monster: pick2, count: 1 });
                    }
                }

                const totalMonsters = groups.reduce((a, g) => a + g.count, 0);
                const totalXP = groups.reduce((a, g) => a + (CR_XP[String(g.monster.challenge_rating)] || 0) * g.count, 0);
                const adjustedXP = Math.round(totalXP * getMulti(totalMonsters));

                lastEncounter = { groups, level, size, diff, adjustedXP };
                renderEncounter(lastEncounter);
            }

            function renderEncounter(enc) {
                const diffColors = { easy:"enc-diff-easy", medium:"enc-diff-medium", hard:"enc-diff-hard", deadly:"enc-diff-deadly" };
                const diffNames  = { easy:"FÁCIL", medium:"MEDIA", hard:"DURA", deadly:"MORTAL" };
                headerDiv.innerHTML = `
                    <div class="enc-header-badge">
                        <span class="enc-diff-label ${diffColors[enc.diff] || ''}">${diffNames[enc.diff] || enc.diff}</span>
                        <span class="enc-xp-total">${enc.adjustedXP.toLocaleString()} XP ajustado</span>
                    </div>`;

                listDiv.innerHTML = "";
                enc.groups.forEach(({ monster: m, count }) => {
                    const cr = m.challenge_rating;
                    const hp = m.hit_points || "?";
                    const ac = Array.isArray(m.armor_class) ? (m.armor_class[0]?.value || m.armor_class[0]) : m.armor_class;
                    const emoji = TYPE_EMOJI[m.type] || TYPE_EMOJI.default;
                    const card = document.createElement("div");
                    card.className = "encounter-card";
                    card.innerHTML = `
                        <span class="enc-emoji">${emoji}</span>
                        <div class="enc-info">
                            <div class="enc-name">${m.name}</div>
                            <div class="enc-meta">CR ${cr} · ${m.type} · HP ${hp} · CA ${ac}</div>
                        </div>
                        <span class="enc-count">×${count}</span>`;
                    listDiv.appendChild(card);
                });

                resultDiv.style.display = "block";
                emptyDiv.style.display = "none";
            }

            function spawnEncounterToMap() {
                if (!lastEncounter) return;
                const cellSize = state.cellSize || 60;
                const centerC = Math.floor(state.cols / 2);
                const centerR = Math.floor(state.rows / 2);
                let i = 0;
                lastEncounter.groups.forEach(({ monster: m, count }) => {
                    const emoji = TYPE_EMOJI[m.type] || "❓";
                    for (let k = 0; k < count; k++) {
                        const angle = (i / (lastEncounter.groups.reduce((a,g)=>a+g.count,0))) * Math.PI * 2;
                        const dist  = 2 + Math.floor(i / 6);
                        const sx    = centerC + Math.round(Math.cos(angle) * dist) + 0.5;
                        const sy    = centerR + Math.round(Math.sin(angle) * dist) + 0.5;
                        state.stamps.push({
                            id: `enc-${Date.now()}-${i}`,
                            emoji,
                            x: Math.max(0.5, Math.min(state.cols - 0.5, sx)),
                            y: Math.max(0.5, Math.min(state.rows - 0.5, sy)),
                            size: 1.0, rotation: 0,
                            isToken: true, isHero: false, visionRadius: 0,
                            name: m.name,
                            hpCurrent: m.hit_points || 10,
                            hpMax: m.hit_points || 10,
                            conditions: [],
                            showDescToPlayers: false
                        });
                        i++;
                    }
                });
                saveHistory();
                draw();
            }

            if (btnGen)   btnGen.addEventListener("click", generateEncounter);
            if (btnReroll) btnReroll.addEventListener("click", generateEncounter);
            if (btnSpawn) btnSpawn.addEventListener("click", spawnEncounterToMap);
        })();

        // --- 5. COMPENDIO D&D 5e ---
        // Monsters: loaded from local assets/monsters.json (326 monsters, MIT - andyaiken/dojo)
        // Spells / Magic Items: fetched from dnd5eapi.co when online
        let compendiumCache = { monsters: null, spells: null, "magic-items": null };
        let localMonsterDb = null;

        async function loadLocalMonsters() {
            if (localMonsterDb) return localMonsterDb;
            try {
                const r = await fetch("assets/monsters.json");
                localMonsterDb = await r.json();
            } catch (e) {
                localMonsterDb = [];
            }
            return localMonsterDb;
        }

        async function fetchCompendiumList(category) {
            if (compendiumCache[category]) return compendiumCache[category];

            if (category === "monsters") {
                compendiumResults.innerHTML = '<div class="compendium-placeholder">Cargando bestiario local...</div>';
                const monsters = await loadLocalMonsters();
                compendiumCache.monsters = monsters;
                return monsters;
            }

            // Online fallback for spells & magic items
            compendiumResults.innerHTML = '<div class="compendium-placeholder">Descargando índice...</div>';
            try {
                const r = await fetch(`https://www.dnd5eapi.co/api/${category}`);
                if (!r.ok) throw new Error("Sin conexión");
                const data = await r.json();
                compendiumCache[category] = data.results || [];
                return compendiumCache[category];
            } catch (err) {
                compendiumResults.innerHTML = `<div class="compendium-placeholder" style="color:var(--accent-red);">Requiere internet para conjuros/objetos: ${err.message}</div>`;
                return null;
            }
        }

        let searchTimeout = null;
        compendiumSearch.addEventListener("input", () => {
            clearTimeout(searchTimeout);
            const query = compendiumSearch.value.trim().toLowerCase();
            if (query.length < 2) {
                compendiumResults.innerHTML = '<div class="compendium-placeholder">Escribe al menos 2 letras para buscar...</div>';
                return;
            }
            searchTimeout = setTimeout(async () => {
                const category = compendiumFilter.value;
                const list = await fetchCompendiumList(category);
                if (!list) return;
                const matches = list.filter(item => item.name && item.name.toLowerCase().includes(query));
                renderSearchResults(matches, category);
            }, 300);
        });

        compendiumFilter.addEventListener("change", () => {
            compendiumSearch.value = "";
            compendiumResults.innerHTML = '<div class="compendium-placeholder">Escribe algo para buscar...</div>';
            compendiumDetail.style.display = "none";
            compendiumResults.style.display = "block";
        });

        function renderSearchResults(results, category) {
            compendiumResults.innerHTML = "";
            compendiumDetail.style.display = "none";
            compendiumResults.style.display = "block";

            if (results.length === 0) {
                compendiumResults.innerHTML = '<div class="compendium-placeholder">Sin resultados.</div>';
                return;
            }

            const limited = results.slice(0, 25);
            limited.forEach(item => {
                const row = document.createElement("div");
                row.className = "compendium-item";

                if (category === "monsters") {
                    const cr = item.challenge_rating !== undefined ? `CR ${item.challenge_rating}` : "";
                    const type = item.type || "";
                    row.innerHTML = `<span>${item.name}</span><span class="type-tag">${cr} ${type}</span>`;
                    row.addEventListener("click", () => {
                        renderDetailContent(item, "monsters");
                        compendiumResults.style.display = "none";
                        compendiumDetail.style.display = "block";
                    });
                } else {
                    const label = category === "spells" ? "Conjuro" : "Objeto M.";
                    row.innerHTML = `<span>${item.name}</span><span class="type-tag">${label}</span>`;
                    row.addEventListener("click", () => showCompendiumDetailOnline(item.url, category));
                }
                compendiumResults.appendChild(row);
            });

            if (results.length > 25) {
                const more = document.createElement("div");
                more.className = "compendium-placeholder";
                more.style.padding = "5px";
                more.textContent = `+${results.length - 25} resultados más. Afina la búsqueda.`;
                compendiumResults.appendChild(more);
            }
        }

        async function showCompendiumDetailOnline(url, category) {
            compendiumResults.style.display = "none";
            compendiumDetail.style.display = "block";
            compendiumDetailContent.innerHTML = '<div class="compendium-placeholder">Cargando...</div>';
            try {
                const r = await fetch(`https://www.dnd5eapi.co${url}`);
                if (!r.ok) throw new Error("Error de red");
                renderDetailContent(await r.json(), category);
            } catch (err) {
                compendiumDetailContent.innerHTML = `<div class="compendium-placeholder" style="color:var(--accent-red);">Error: ${err.message}</div>`;
            }
        }

        btnBackToResults.addEventListener("click", () => {
            compendiumDetail.style.display = "none";
            compendiumResults.style.display = "block";
        });

        function renderDetailContent(detail, category) {
            let html = `<h2>${detail.name}</h2>`;
            
            if (category === "monsters") {
                const size = detail.size || "Medio";
                const type = detail.type || "Humanoide";
                const align = detail.alignment || "Neutral";
                const hp = detail.hit_points || 10;
                const hd = detail.hit_dice || "2d6";
                
                // AC parser
                let ac = 10;
                if (detail.armor_class) {
                    if (Array.isArray(detail.armor_class)) {
                        ac = detail.armor_class[0]?.value || detail.armor_class[0] || 10;
                    } else if (typeof detail.armor_class === "number") {
                        ac = detail.armor_class;
                    }
                }
                
                // Speed parser — handles both dojo string format and dnd5eapi object format
                let speedStr = "30 ft.";
                if (detail.speed) {
                    if (typeof detail.speed === "string") {
                        speedStr = detail.speed;
                    } else {
                        speedStr = Object.entries(detail.speed).map(([k, v]) => `${k}: ${v}`).join(", ");
                    }
                }
                
                html += `
                    <div class="meta">${size} ${type}, ${align}</div>
                    
                    <div class="stat-block">
                        <strong>🛡️ Clase de Armadura (AC):</strong> ${ac}<br>
                        <strong>❤️ Puntos de Vida (HP):</strong> ${hp} (${hd})<br>
                        <strong>🏃 Velocidad:</strong> ${speedStr}
                    </div>
                    
                    <div class="stat-block">
                        <div class="stat-grid">
                            <div class="stat-cell"><strong>STR</strong> ${detail.strength} (${getMod(detail.strength)})</div>
                            <div class="stat-cell"><strong>DEX</strong> ${detail.dexterity} (${getMod(detail.dexterity)})</div>
                            <div class="stat-cell"><strong>CON</strong> ${detail.constitution} (${getMod(detail.constitution)})</div>
                            <div class="stat-cell"><strong>INT</strong> ${detail.intelligence} (${getMod(detail.intelligence)})</div>
                            <div class="stat-cell"><strong>WIS</strong> ${detail.wisdom} (${getMod(detail.wisdom)})</div>
                            <div class="stat-cell"><strong>CHA</strong> ${detail.charisma} (${getMod(detail.charisma)})</div>
                        </div>
                    </div>
                `;
                
                // Habilidades especiales
                if (detail.special_abilities && detail.special_abilities.length > 0) {
                    html += `<h3>Habilidades Especiales</h3>`;
                    detail.special_abilities.forEach(ability => {
                        html += `<p><strong>${ability.name}:</strong> ${ability.desc}</p>`;
                    });
                }
                
                // Acciones
                if (detail.actions && detail.actions.length > 0) {
                    html += `<h3>Acciones</h3>`;
                    detail.actions.forEach(act => {
                        html += `<p><strong>${act.name}:</strong> ${act.desc}</p>`;
                    });
                }
                
                // Botones del VTT
                html += `
                    <div class="actions-bar">
                        <button class="btn btn-primary btn-small" id="btnSpawnMonsterToken">🔮 Invocar Token</button>
                        <button class="btn btn-secondary btn-small" id="btnSpawnMonsterInit">⚔️ Añadir a Iniciativa</button>
                    </div>
                `;
            } 
            
            else if (category === "spells") {
                const lvl = detail.level === 0 ? "Truco" : `Nivel ${detail.level}`;
                const school = detail.school?.name || "Evocación";
                const ctime = detail.casting_time || "1 acción";
                const range = detail.range || "Personal";
                const comp = detail.components ? detail.components.join(", ") : "V, S";
                const dur = detail.duration || "Instantáneo";
                const conc = detail.concentration ? " (Concentración)" : "";
                
                html += `
                    <div class="meta">${lvl} de ${school}</div>
                    
                    <div class="stat-block">
                        <strong>Tiem. de Lanzamiento:</strong> ${ctime}<br>
                        <strong>Alcance:</strong> ${range}<br>
                        <strong>Componentes:</strong> ${comp} ${detail.material ? `(${detail.material})` : ""}<br>
                        <strong>Duración:</strong> ${dur}${conc}
                    </div>
                `;
                
                if (detail.desc) {
                    detail.desc.forEach(pText => {
                        html += `<p>${pText}</p>`;
                    });
                }
                
                if (detail.higher_level) {
                    html += `<h3>A Niveles Superiores</h3>`;
                    detail.higher_level.forEach(pText => {
                        html += `<p>${pText}</p>`;
                    });
                }
            } 
            
            else if (category === "magic-items") {
                const rarity = detail.rarity?.name || "Común";
                const type = detail.equipment_category?.name || "Objeto Mágico";
                
                html += `
                    <div class="meta">${type}, Rarity: ${rarity}</div>
                `;
                
                if (detail.desc) {
                    detail.desc.forEach(pText => {
                        html += `<p>${pText}</p>`;
                    });
                }
            }
            
            compendiumDetailContent.innerHTML = html;
            
            // Vincular botones creados dinámicamente para monstruos
            if (category === "monsters") {
                const btnSpawn = document.getElementById("btnSpawnMonsterToken");
                const btnInit = document.getElementById("btnSpawnMonsterInit");
                
                // Determinar emoji del monstruo
                let emoji = "👹";
                const mName = detail.name.toLowerCase();
                if (mName.includes("dragon")) emoji = "🐉";
                else if (mName.includes("spider") || mName.includes("arac")) emoji = "🕷️";
                else if (mName.includes("skeleton") || mName.includes("esquele")) emoji = "💀";
                else if (mName.includes("zombie") || mName.includes("zombi")) emoji = "🧟";
                else if (mName.includes("wolf") || mName.includes("lobo")) emoji = "🐺";
                else if (mName.includes("bear") || mName.includes("oso")) emoji = "🐻";
                else if (mName.includes("rat") || mName.includes("rata")) emoji = "🐀";
                else if (mName.includes("specter") || mName.includes("ghost") || mName.includes("espect")) emoji = "👻";
                else if (mName.includes("witch") || mName.includes("bruja")) emoji = "🧙‍♀️";
                else if (mName.includes("lizard") || mName.includes("saur")) emoji = "🦎";
                
                btnSpawn?.addEventListener("click", () => {
                    // Spawn token en el hex/celda más cercana al centro del viewport visible
                    const viewCanvasX = (-panX + viewport.clientWidth/2) / zoom;
                    const viewCanvasY = (-panY + viewport.clientHeight/2) / zoom;
                    const viewHex = isHexMode() ? getClosestHex(viewCanvasX, viewCanvasY) : null;
                    const viewX = viewHex ? viewHex.col + 0.5 : viewCanvasX / state.cellSize;
                    const viewY = viewHex ? viewHex.row + 0.5 : viewCanvasY / state.cellSize;
                    
                    const hp = detail.hit_points || 15;
                    const newStamp = {
                        id: Date.now() + Math.random().toString(36).substr(2, 5),
                        emoji: emoji,
                        x: Math.max(0.5, Math.min(state.cols - 0.5, viewX)),
                        y: Math.max(0.5, Math.min(state.rows - 0.5, viewY)),
                        size: 1.0,
                        rotation: 0,
                        isToken: true,
                        isHero: false,
                        visionRadius: 0,
                        name: detail.name,
                        hpCurrent: hp,
                        hpMax: hp,
                        conditions: [],
                        isSecret: false,
                        freePosition: false
                    };
                    
                    state.stamps.push(newStamp);
                    selectedStampId = newStamp.id;
                    updateStampControlUI();
                    saveHistory();
                    draw();
                    alert(`Invocado token "${detail.name}" en el mapa.`);
                });
                
                btnInit?.addEventListener("click", () => {
                    const roll = Math.floor(Math.random() * 20) + 1;
                    // Dexterity mod as initiative modifier
                    const dex = detail.dexterity || 10;
                    const mod = Math.floor((dex - 10) / 2);
                    const initVal = roll + mod;
                    
                    addCreatureToInitiative(detail.name, initVal);
                    alert(`Añadido "${detail.name}" a Iniciativa (Tirada d20 + Mod = ${roll} + ${mod} = ${initVal}).`);
                });
            }
        }

        function getMod(val) {
            const mod = Math.floor((val - 10) / 2);
            return mod >= 0 ? `+${mod}` : `${mod}`;
        }

        // --- 6. CHAT DE IA MASTER CON SOPORTE OLLAMA & SIMULACIÓN ---
        function appendChatMessage(sender, text, isUser) {
            const msg = document.createElement("div");
            msg.className = `ai-msg ${isUser ? "user" : "bot"}`;
            msg.innerHTML = `
                <span class="sender">${sender}</span>
                <div>${text.replace(/\n/g, "<br>")}</div>
            `;
            aiChatMessages.appendChild(msg);
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        }

        async function sendAiMessage(promptText) {
            if (!promptText) return;
            appendChatMessage("Tú", promptText, true);
            aiChatInput.value = "";
            
            const model = aiModelSelect.value;
            
            if (model === "simulated") {
                // Simulación offline
                setTimeout(() => {
                    const reply = getSimulatedReply(promptText);
                    appendChatMessage("Dungeon Master", reply, false);
                }, 800);
                return;
            }
            
            // Intentar conectar con Ollama
            appendChatMessage("Dungeon Master", "Pensando... 🧠", false);
            const thinkingMsg = aiChatMessages.lastChild;
            
            try {
                const response = await fetch("http://localhost:11434/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            {
                                role: "system",
                                content: "Eres el Dungeon Master oficial de D&D 5e. Narra con riqueza de vocabulario, tono misterioso, fantástico e inmersivo. Usa segunda persona del plural ('vosotros'). Sin extenderte más de 120 palabras. Responde en español."
                            },
                            {
                                role: "user",
                                content: (() => {
                                    const mapName = mapTemplateSelect.value || "personalizado";
                                    const mode = mapModeSelect?.value || "combat";
                                    const namedPlaces = state.stamps.filter(s => s.name && !s.isSecret).slice(0, 6).map(s => s.name).join(", ");
                                    const terrainInfo = mode === "region" ? "Mapa de exploración con biomas hexagonales." : "Mazmorra/encuentro de combate.";
                                    return `Mapa: "${mapName}" (${terrainInfo}). Lugares visibles: ${namedPlaces || "ninguno aún"}. Pregunta: ${promptText}`;
                                })()
                            }
                        ],
                        stream: false
                    })
                });
                
                if (!response.ok) throw new Error("Servidor Ollama no disponible");
                
                const data = await response.json();
                thinkingMsg.remove(); // quitar mensaje "Pensando..."
                
                const reply = data.message?.content || "No obtuve respuesta del modelo.";
                appendChatMessage("Dungeon Master", reply, false);
            } catch (err) {
                // Quitar "Pensando..." y avisar del fallo
                thinkingMsg.remove();
                
                const warningMsg = `⚠️ No se pudo conectar a Ollama en http://localhost:11434.\n\nError: ${err.message}.\nAsegúrate de tener Ollama instalado y ejecutándose localmente con el modelo '${model}' descargado (ej. 'ollama run ${model}').\n\n*Respuesta simulada para mantener el flujo de juego:*`;
                appendChatMessage("Dungeon Master (Aviso)", warningMsg, false);
                
                // Fallback a simulación
                const reply = getSimulatedReply(promptText);
                appendChatMessage("Dungeon Master", reply, false);
            }
        }

        btnAiChatSend.addEventListener("click", () => {
            const txt = aiChatInput.value.trim();
            sendAiMessage(txt);
        });

        aiChatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const txt = aiChatInput.value.trim();
                sendAiMessage(txt);
            }
        });

        shortcutBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const promptText = btn.dataset.prompt;
                sendAiMessage(promptText);
            });
        });

        function getSimulatedReply(promptText) {
            const p = promptText.toLowerCase();
            const mapName = mapTemplateSelect.value || "dungeon";
            
            // Detectar template actual incluyendo nuevos procedurales
            const dungeonTheme = mapName.includes(":") ? mapName.split(":")[1] : mapName;

            // 1. Respuesta para "Describir zona"
            if (p.includes("describe la zona") || p.includes("describir zona")) {
                if (dungeonTheme === "crypt") {
                    return "📖 *El aire de la cripta pesa sobre vuestros pulmones...*\n\nEl silencio solo es roto por el goteo del agua entre las losas. Sarcófagos de mármol oscuro flanquean el pasillo, sellados con runas de contención que alguien — o algo — ha estado intentando desactivar desde dentro. Una vela de hueso arde sin consumirse en un candelabro triple. En el suelo, marcas de garras frescas apuntan hacia las sombras del fondo.";
                } else if (dungeonTheme === "prison") {
                    return "📖 *Las cadenas oxidadas del suelo cuentan historias que sus prisioneros ya no pueden...*\n\nCeldas de hierro se extienden a ambos lados del pasillo. Algunas están abiertas desde dentro. Hay trozos de pan moldeado junto a una bota con el pie todavía dentro. El guardia enorme que debería estar en el puesto no está, pero su linterna sigue encendida y caliente. Alguien estuvo aquí hace muy poco.";
                } else if (dungeonTheme === "barracks") {
                    return "📖 *La sala huele a cuero viejo y aceite de espadas...*\n\nCatres de madera alineados, algunos con sábanas revueltas como si la partida fue repentina. Mapas clavados en la pared con rutas marcadas en tinta roja hacia el sur. En la mesa central, una partida de cartas interrumpida: alguien tenía una mano ganadora. La fragua al fondo todavía echa humo.";
                } else if (dungeonTheme === "arcane") {
                    return "📖 *El aire chisporrotea con energía contenida...*\n\nLas paredes están cubiertas de ecuaciones que cambian cuando no las miras directamente. Un alambique burbujea solo, destilando algo de color verde que huele a pino y cobre quemado. Libros flotantes se mueven entre los estantes catalogando a los recién llegados. En el centro, un círculo de invocación dibujado con polvo de plata espera, vacío pero activo.";
                } else if (mapName === "ruins") {
                    return "📖 *La penumbra se cierne sobre las ruinas olvidadas...*\n\nAnte vosotros se alzan los vestigios del Templo del Alba. Muros de sillería agrietados, mudos testigos del paso de los siglos, contienen el susurro del viento. Las baldosas de piedra están cubiertas por una fina capa de ceniza y hiedra oscura. En una de las esquinas, una telaraña colosal se mece, ocultando algo en su interior. La atmósfera es gélida y un silencio sepulcral solo es roto por el leve crujir de vuestros pasos.";
                } else if (mapName === "tavern") {
                    return "📖 *El bullicio de la taberna del Dragón Verde os envuelve...*\n\nEl aire huele a leña quemada, cerveza agria y estofado de jabalí. Sentados en las robustas mesas de madera de pino, varios parroquianos ríen y apuestan monedas de cobre. El tabernero limpia incansablemente una jarra detrás de la barra, mientras un hogar de piedra escupe chispas doradas que bailan en las sombras. Sin embargo, en el rincón más oscuro, una figura encapuchada os observa en silencio, ocultando su mano bajo la capa.";
                } else if (mapName === "cave") {
                    return "📖 *Descendéis a la gruta de la lava ardiente...*\n\nUn calor asfixiante y un brillo rojizo saturan vuestra visión. El gorgoteo denso de ríos de lava fluyendo ilumina las estalagmitas que cuelgan del techo como colmillos de piedra. El suelo vibra bajo vuestras botas con una pulsación volcánica constante. Hongos de un brillo azulado crecen en las grietas húmedas de los extremos fríos, y en el corazón de la caverna, una enorme pila de monedas de oro y reliquias centellea bajo el letargo de una sombra alada gigantesca.";
                } else if (mapName === "forest") {
                    return "📖 *Os adentráis en la espesura del bosque frondoso...*\n\nEl dosel de las hojas apenas deja pasar la luz del atardecer. Un riachuelo de aguas rápidas cruza el campamento, produciendo un murmullo constante y relajante. El suelo de césped húmedo absorbe el ruido de vuestras pisadas. Las hogueras crepitan desprendiendo un humo que ahuyenta a los insectos nocturnos, pero el aullido de un lobo en la distancia os recuerda que en el bosque de pinos, la frontera entre el cazador y la presa es sumamente delgada.";
                } else {
                    return "📖 *El pasillo de la mazmorra se abre ante vosotros...*\n\nLas baldosas de piedra fría están manchadas por la humedad de las profundidades del complejo. Muros de piedra maciza bloquean vuestro camino lateral, y un abismo insondable se abre al oeste, del cual surge un viento helado. Una puerta de madera reforzada con hierro cruje levemente a lo lejos. La niebla de guerra flota en las esquinas, ocultando los terrores que aguardan a quienes osen cruzar el umbral del calabozo.";
                }
            }
            
            // 2. Respuesta para "Sugerir encuentro"
            if (p.includes("encuentro") || p.includes("sugerir encuentro")) {
                if (mapName === "ruins") {
                    return "⚔️ *Sugerencia de Encuentro en las Ruinas:*\n\nPara un grupo de nivel 3, un encuentro táctico ideal sería:\n\n- **2 Esqueletos (CR 1/4)** patrullando el pasillo exterior.\n- **1 Zombi (CR 1/4)** que yace bajo los escombros y se alza al ser pisado.\n- **1 Espectro (CR 1)** atrapado en el altar central que drena la fuerza de los héroes.\n\n*Consejo del DM:* Usa los muros derruidos para dar cobertura de +2 a la AC a los arqueros esqueletos.";
                } else if (mapName === "tavern") {
                    return "⚔️ *Sugerencia de Encuentro en la Taberna:*\n\nUna típica pelea de taberna que escala a mayores:\n\n- **3 Matones (Thugs, CR 1/2)** que inician una disputa por trampas en un juego de cartas.\n- **1 Espía (CR 1)** camuflado como cliente que intenta robar las notas del mago durante el caos.\n\n*Consejo del DM:* Los personajes pueden usar mesas como cobertura o lanzar jarras de cerveza como armas improvisadas (d4 daño de golpe).";
                } else if (mapName === "cave") {
                    return "⚔️ *Sugerencia de Encuentro en la Cueva de Lava:*\n\nUn desafío letal de entorno:\n\n- **2 Mephits de Magma (CR 1/2)** que emergen de la lava lanzando ráfagas de fuego.\n- **1 Cría de Dragón Rojo (CR 4)** que defiende su nido de tesoros.\n\n*Consejo del DM:* Cualquier criatura empujada a las casillas de lava sufre 2d10 de daño de fuego al comenzar su turno.";
                } else {
                    return "⚔️ *Sugerencia de Encuentro en la Mazmorra:*\n\n- **3 Goblins (CR 1/4)** emboscando desde detrás de las esquinas oscuras.\n- **1 Araña Gigante (CR 1)** que desciende del techo con telarañas que restringen el movimiento.\n\n*Consejo del DM:* Revela la niebla solo cuando los héroes utilicen antorchas o conjuros de luz.";
                }
            }
            
            // 3. Respuesta para "Reglas cobertura"
            if (p.includes("reglas de cobertura") || p.includes("cobertura") || p.includes("sigilo")) {
                return "📖 *Reglas de Cobertura y Sigilo en D&D 5e:*\n\n- **Media Cobertura (+2 AC y tiradas de salvación de Dex):** Ocurre cuando un obstáculo (como un muro bajo o una mesa) cubre al menos la mitad del cuerpo del objetivo.\n- **Tres Cuartos (+5 AC y salvaciones de Dex):** Ocurre si el 75% del cuerpo está cubierto (por ejemplo, disparar desde detrás de una aspillera o columna gruesa).\n- **Cobertura Total:** El objetivo no puede ser atacado directamente con ataques a distancia o conjuros que requieran línea de visión.\n- **Sigilo:** Para ocultarse, un héroe debe romper la línea de visión total (niebla, muros o cobertura completa) y superar la Sabiduría Pasiva (Percepción) del enemigo con una tirada de Destreza (Sigilo).";
            }
            
            // 4. Tiradas de dados o respuestas generales
            if (p.includes("dado") || p.includes("tirar") || p.includes("roll")) {
                const roll = Math.floor(Math.random() * 20) + 1;
                return `🎲 *Tirada del Destino:* He lanzado un dado de 20 por ti y el resultado es **${roll}** (Modificador no incluido).\n\nNarrativamente: ${roll >= 15 ? "Tu acción progresa de manera espectacular." : roll >= 8 ? "Logras tu objetivo, pero con un precio o complicación menor." : "El destino te es esquivo; algo sale mal y las consecuencias se complican."}`;
            }
            
            // Respuesta genérica de Dungeon Master
            return "🧙 *Escucho tus palabras, aventurero...*\n\nLas sombras del calabozo se alargan y los hilos del destino giran. ¿Qué deseas hacer a continuación? Puedes pedirme que describa las salas, que genere adversarios o que te guíe a través de las intrincadas reglas del combate y la exploración.";
        }

        // Cargar biblioteca y notas
        renderLibrary();
    }

    // --- WEATHER SYSTEM & PARTICLE ENGINE ---
    class WeatherSystem {
        constructor(canvas, type = 'rain') {
            this.canvas = canvas;
            this.type = type; // 'rain', 'snow', or 'fog'
            this.particles = [];
            this.pool = [];
            
            // Calculate dynamic max particles based on canvas area to avoid lag
            const areaScale = (canvas.width * canvas.height) / (1500 * 1200);
            const densityFactor = Math.min(4, Math.max(0.4, Math.sqrt(areaScale)));
            const baseParticles = type === 'rain' ? 120 : (type === 'snow' ? 80 : 12);
            this.maxParticles = Math.round(baseParticles * densityFactor);
            
            this.init();
        }
        
        init() {
            for (let i = 0; i < this.maxParticles; i++) {
                this.particles.push(this.createParticle(true));
            }
        }
        
        createParticle(randomY = false) {
            let p = this.pool.length > 0 ? this.pool.pop() : {};
            p.x = Math.random() * this.canvas.width;
            p.y = randomY ? Math.random() * this.canvas.height : -30;
            
            if (this.type === 'rain') {
                p.vx = 1 + Math.random() * 2; // wind drift
                p.vy = 10 + Math.random() * 6; // speed
                p.length = 12 + Math.random() * 12;
                p.width = 0.8 + Math.random() * 0.8;
                p.alpha = 0.15 + Math.random() * 0.35;
            } else if (this.type === 'snow') {
                p.vx = -0.4 + Math.random() * 0.8;
                p.vy = 0.8 + Math.random() * 1.5;
                p.r = 1.2 + Math.random() * 2.8;
                p.alpha = 0.25 + Math.random() * 0.45;
                p.sway = Math.random() * 100;
                p.swaySpeed = 0.01 + Math.random() * 0.02;
            } else if (this.type === 'fog') {
                p.x = randomY ? Math.random() * this.canvas.width : -250;
                p.y = Math.random() * this.canvas.height;
                p.vx = 0.1 + Math.random() * 0.3; // very slow drift
                p.vy = -0.05 + Math.random() * 0.1;
                p.r = 130 + Math.random() * 120; // large cloud
                p.alpha = 0.0;
                p.maxAlpha = 0.03 + Math.random() * 0.06;
                p.fadeSpeed = 0.0004 + Math.random() * 0.001;
                p.fadeIn = true;
            }
            return p;
        }
        
        update() {
            for (let i = 0; i < this.particles.length; i++) {
                let p = this.particles[i];
                
                if (this.type === 'rain') {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.y > this.canvas.height || p.x > this.canvas.width) {
                        this.pool.push(p);
                        this.particles[i] = this.createParticle(false);
                    }
                } else if (this.type === 'snow') {
                    p.sway += p.swaySpeed;
                    p.x += p.vx + Math.sin(p.sway) * 0.4;
                    p.y += p.vy;
                    if (p.y > this.canvas.height || p.x < -15 || p.x > this.canvas.width + 15) {
                        this.pool.push(p);
                        this.particles[i] = this.createParticle(false);
                    }
                } else if (this.type === 'fog') {
                    p.x += p.vx;
                    p.y += p.vy;
                    
                    if (p.fadeIn) {
                        p.alpha += p.fadeSpeed;
                        if (p.alpha >= p.maxAlpha) {
                            p.alpha = p.maxAlpha;
                            p.fadeIn = false;
                        }
                    } else if (p.x > this.canvas.width - p.r) {
                        p.alpha -= p.fadeSpeed * 1.5;
                    }
                    
                    if (p.alpha <= 0 || p.x > this.canvas.width + p.r) {
                        this.pool.push(p);
                        this.particles[i] = this.createParticle(false);
                    }
                }
            }
        }
        
        draw(targetCtx) {
            targetCtx.save();
            if (this.type === 'rain') {
                targetCtx.strokeStyle = 'rgba(174, 194, 224, 0.4)';
                targetCtx.lineCap = 'round';
                for (let p of this.particles) {
                    targetCtx.lineWidth = p.width;
                    targetCtx.globalAlpha = p.alpha;
                    targetCtx.beginPath();
                    targetCtx.moveTo(p.x, p.y);
                    targetCtx.lineTo(p.x + p.vx * 1.3, p.y + p.vy * 1.3);
                    targetCtx.stroke();
                }
            } else if (this.type === 'snow') {
                targetCtx.fillStyle = '#ffffff';
                for (let p of this.particles) {
                    targetCtx.globalAlpha = p.alpha;
                    targetCtx.beginPath();
                    targetCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    targetCtx.fill();
                }
            } else if (this.type === 'fog') {
                for (let p of this.particles) {
                    targetCtx.globalAlpha = Math.max(0, p.alpha);
                    let grad = targetCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
                    grad.addColorStop(0, 'rgba(225, 230, 240, 0.75)');
                    grad.addColorStop(0.5, 'rgba(215, 220, 230, 0.25)');
                    grad.addColorStop(1, 'rgba(215, 220, 230, 0)');
                    
                    targetCtx.fillStyle = grad;
                    targetCtx.beginPath();
                    targetCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    targetCtx.fill();
                }
            }
            targetCtx.restore();
        }
    }

    function animateWeather() {
        if (!state.weather || state.weather === "") {
            animFrameId = null;
            return;
        }
        
        if (weatherSystem) {
            weatherSystem.update();
        }
        draw();
        
        animFrameId = requestAnimationFrame(animateWeather);
    }

    function updateWeatherSystem() {
        if (state.weather && state.weather !== "") {
            if (!weatherSystem || weatherSystem.type !== state.weather) {
                weatherSystem = new WeatherSystem(canvas, state.weather);
            }
            if (animFrameId === null) {
                animateWeather();
            }
        } else {
            weatherSystem = null;
            if (animFrameId !== null) {
                cancelAnimationFrame(animFrameId);
                animFrameId = null;
                draw(); // redraw once to clear weather drawing
            }
        }
    }

    // --- UNIVERSAL VTT EXPORT (.dd2vtt) ---
    // Compatible with Foundry VTT, Roll20, DungeonFog, Dungeondraft importers
    function exportUniversalVTT() {
        const cellSize = state.cellSize;

        // 1. Collect explicit wall segments (in pixel coords)
        const losLines = state.walls.map(w => [
            [Math.round(w.x1 * cellSize), Math.round(w.y1 * cellSize)],
            [Math.round(w.x2 * cellSize), Math.round(w.y2 * cellSize)]
        ]);

        // 2. Auto-generate LOS from terrain borders (floor↔abyss transitions)
        //    For dungeon maps this is the most useful part
        const mode = mapModeSelect?.value || "combat";
        if (mode === "combat") {
            const isFloor = (c, r) => {
                if (c < 0 || c >= state.cols || r < 0 || r >= state.rows) return false;
                const cell = state.terrain[r * state.cols + c];
                const type = (cell && typeof cell === "object") ? cell.type : cell;
                return type !== "abyss";
            };
            // Scan horizontal edges (between rows)
            for (let r = 0; r <= state.rows; r++) {
                let segStart = -1;
                for (let c = 0; c <= state.cols; c++) {
                    const above = r > 0 && isFloor(c, r - 1);
                    const below = r < state.rows && isFloor(c, r);
                    const edge = above !== below;
                    if (edge && segStart === -1) segStart = c;
                    if (!edge && segStart !== -1) {
                        losLines.push([[segStart * cellSize, r * cellSize], [c * cellSize, r * cellSize]]);
                        segStart = -1;
                    }
                }
            }
            // Scan vertical edges (between cols)
            for (let c = 0; c <= state.cols; c++) {
                let segStart = -1;
                for (let r = 0; r <= state.rows; r++) {
                    const left  = c > 0 && isFloor(c - 1, r);
                    const right = c < state.cols && isFloor(c, r);
                    const edge = left !== right;
                    if (edge && segStart === -1) segStart = r;
                    if (!edge && segStart !== -1) {
                        losLines.push([[c * cellSize, segStart * cellSize], [c * cellSize, r * cellSize]]);
                        segStart = -1;
                    }
                }
            }
        }

        // 3. Map image as base64
        const imgData = canvas.toDataURL("image/png");

        // 4. Build .dd2vtt JSON (Universal VTT format 0.3)
        const uvtt = {
            format: 0.3,
            resolution: {
                map_origin: { x: 0, y: 0 },
                map_size: { x: state.cols, y: state.rows },
                pixels_per_grid: cellSize
            },
            line_of_sight: losLines,
            objects_line_of_sight: [],
            portals: [],
            environment: { baked_lighting: false, ambient_light: "" },
            lights: [],
            image: imgData
        };

        // 5. Download
        const json = JSON.stringify(uvtt);
        const blob = new Blob([json], { type: "application/octet-stream" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href = url;
        a.download = `mapforge-${state.cols}x${state.rows}.dd2vtt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- LANDMARK POPUP ---
    function showLandmarkPopup(stamp, clientX, clientY) {
        const popup = document.getElementById("landmarkPopup");
        if (!popup) return;

        // Fill content
        const iconEl = document.getElementById("landmarkPopupIcon");
        const nameEl = document.getElementById("landmarkPopupName");
        const descEl = document.getElementById("landmarkPopupDesc");

        if (stamp.image) {
            iconEl.innerHTML = `<img src="${stamp.image}" alt="">`;
        } else {
            iconEl.textContent = stamp.emoji || "📍";
        }
        nameEl.textContent = stamp.name || "Lugar desconocido";
        descEl.textContent = stamp.description || "";

        // Position near click, inside viewport bounds
        popup.style.display = "block";
        const vpRect = viewport.getBoundingClientRect();
        const popRect = popup.getBoundingClientRect();
        let left = clientX - vpRect.left + 14;
        let top  = clientY - vpRect.top  - 14;
        if (left + popRect.width  > vpRect.width)  left = clientX - vpRect.left - popRect.width - 14;
        if (top  + popRect.height > vpRect.height) top  = clientY - vpRect.top  - popRect.height - 14;
        if (top < 6) top = 6;
        if (left < 6) left = 6;
        popup.style.left = `${left}px`;
        popup.style.top  = `${top}px`;
    }

    function hideLandmarkPopup() {
        const popup = document.getElementById("landmarkPopup");
        if (popup) popup.style.display = "none";
    }

    // --- TOPBAR MODE INDICATOR ---
    function updateTopbarMode() {
        const topbar = document.querySelector(".topbar");
        if (!topbar) return;
        const mode = mapModeSelect?.value || "combat";
        topbar.classList.toggle("mode-exploration", mode === "region");
        topbar.classList.toggle("mode-combat", mode !== "region");
        // Also tint the canvas workspace
        const ws = document.getElementById("canvasViewport");
        if (ws) ws.classList.toggle("exploration-mode", mode === "region");
    }

    // --- BOOTSTRAP ---
    function bootstrap() {
        init();
        bindExtraEvents();
        setupRightPanel();
        drawInitiativeList();
        updateWeatherSystem();

        // Auto-load exploration template on startup (no confirm dialog)
        loadPresetTemplate("tradeRoute");
        updateTopbarMode();

        // Close landmark popup button
        const closePopupBtn = document.getElementById("closeLandmarkPopup");
        if (closePopupBtn) closePopupBtn.addEventListener("click", hideLandmarkPopup);

        // Hide popup when switching to GM mode or non-region mode
        if (viewModeSelect) viewModeSelect.addEventListener("change", hideLandmarkPopup);
        if (mapModeSelect) {
            mapModeSelect.addEventListener("change", () => {
                hideLandmarkPopup();
                updateTopbarMode();
            });
        }
    }

    bootstrap();
});
