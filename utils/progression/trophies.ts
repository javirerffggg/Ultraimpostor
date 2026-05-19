import { ProgressionCounters, InfinityVault, PlayerProgression } from '../../types';

export interface TrophyDef {
    id: string;
    name: string;
    series: string;
    xpReward: number;
    evaluate: (c: ProgressionCounters, v: InfinityVault, p: PlayerProgression) => boolean;
}

export const TROPHIES: TrophyDef[] = [
    // --- Serie "Primeras Veces" (10) ---
    { id: 't01', name: 'PRIMER CONTACTO', series: 'Primeras Veces', xpReward: 100, evaluate: (_c, v) => v.metrics.totalSessions >= 1 },
    { id: 't02', name: 'PRIMERA SOMBRA', series: 'Primeras Veces', xpReward: 100, evaluate: (_c, v) => v.metrics.impostorRatio > 0 },
    { id: 't03', name: 'PRIMERA MISIÓN LIMPIA', series: 'Primeras Veces', xpReward: 100, evaluate: (_c, v) => v.metrics.totalSessions > 0 && v.metrics.impostorRatio < 1 },
    { id: 't04', name: 'BIENVENIDO AL PROTOCOLO', series: 'Primeras Veces', xpReward: 100, evaluate: (c) => c.protocolsSeenDistinct.length >= 1 },
    { id: 't05', name: 'EL DÍA QUE TODO CAMBIÓ', series: 'Primeras Veces', xpReward: 150, evaluate: (c) => c.trollEventCount >= 1 },
    { id: 't06', name: 'INICIACIÓN', series: 'Primeras Veces', xpReward: 100, evaluate: (c) => c.oracleCount >= 1 },
    { id: 't07', name: 'ARQUITECTURA PROPIA', series: 'Primeras Veces', xpReward: 100, evaluate: (c) => c.architectCount >= 1 },
    { id: 't08', name: 'PODER EJECUTIVO', series: 'Primeras Veces', xpReward: 100, evaluate: (c) => c.alcaldeCount >= 1 },
    { id: 't09', name: 'EL DILEMA', series: 'Primeras Veces', xpReward: 150, evaluate: (c) => c.sifonInitiatorCount >= 1 || c.sifonVictimCount >= 1 },
    { id: 't10', name: 'EL SACRIFICIO', series: 'Primeras Veces', xpReward: 150, evaluate: (c) => c.renunciaActorCount >= 1 },

    // --- Serie "Números Redondos" (10) ---
    { id: 't11', name: 'DÉCIMA MISIÓN', series: 'Números Redondos', xpReward: 100, evaluate: (_c, v) => v.metrics.totalSessions >= 10 },
    { id: 't12', name: 'MEDIO CENTENAR', series: 'Números Redondos', xpReward: 150, evaluate: (_c, v) => v.metrics.totalSessions >= 50 },
    { id: 't13', name: 'CENTENARIO', series: 'Números Redondos', xpReward: 250, evaluate: (_c, v) => v.metrics.totalSessions >= 100 },
    { id: 't14', name: 'TRESCIENTAS NOCHES', series: 'Números Redondos', xpReward: 500, evaluate: (_c, v) => v.metrics.totalSessions >= 300 },
    { id: 't15', name: 'EL QUINTO IMPOSTOR', series: 'Números Redondos', xpReward: 100, evaluate: (_c, v) => Math.round(v.metrics.impostorRatio * v.metrics.totalSessions) >= 5 },
    { id: 't16', name: 'EL VIGÉSIMO IMPOSTOR', series: 'Números Redondos', xpReward: 200, evaluate: (_c, v) => Math.round(v.metrics.impostorRatio * v.metrics.totalSessions) >= 20 },
    { id: 't17', name: 'DÉCIMA CATEGORÍA', series: 'Números Redondos', xpReward: 150, evaluate: (c) => c.distinctCategoriesPlayed.length >= 10 },
    { id: 't18', name: 'CATEGORÍA CINCUENTA', series: 'Números Redondos', xpReward: 300, evaluate: (c) => c.distinctCategoriesPlayed.length >= 50 },
    { id: 't19', name: 'DIEZ TEMAS EN UN DÍA', series: 'Números Redondos', xpReward: 200, evaluate: (c) => c.diversityInSessionMax >= 10 },
    { id: 't20', name: 'QUINIENTOS PUNTOS', series: 'Números Redondos', xpReward: 100, evaluate: (_c, _v, p) => p.totalXpAllTime >= 500 },

    // --- Serie "Compañeros de Misión" (8) ---
    { id: 't21', name: 'ALIANZA FORJADA', series: 'Compañeros', xpReward: 100, evaluate: (c) => Object.keys(c.coImpostorPairs).length >= 1 },
    { id: 't22', name: 'EQUIPO RECURRENTE', series: 'Compañeros', xpReward: 200, evaluate: (c) => Object.values(c.coImpostorPairs).some(v => v >= 5) },
    { id: 't23', name: 'TRIÁNGULO DE CONFIANZA', series: 'Compañeros', xpReward: 150, evaluate: (c) => Object.keys(c.coImpostorPairs).length >= 3 },
    { id: 't24', name: 'EL ETERNO RIVAL', series: 'Compañeros', xpReward: 250, evaluate: (c) => Object.values(c.coImpostorPairs).some(v => v >= 10) },
    { id: 't25', name: 'GRUPO DE CINCO', series: 'Compañeros', xpReward: 100, evaluate: (c) => c.maxPlayersInRound >= 5 },
    { id: 't26', name: 'GRUPO MÁXIMO', series: 'Compañeros', xpReward: 200, evaluate: (c) => c.maxPlayersInRound >= 12 },
    { id: 't27', name: 'SOLO ANTE EL PELIGRO', series: 'Compañeros', xpReward: 200, evaluate: (c) => c.soloImpostorWithNPlayers.some(n => n >= 8) },
    { id: 't28', name: 'TODOS CONTRA MÍ', series: 'Compañeros', xpReward: 300, evaluate: (c) => c.soloImpostorWithNPlayers.some(n => n >= 10) },

    // --- Serie "Protocolos Especiales" (15) ---
    { id: 't29', name: 'TRIPLE PROTOCOLO', series: 'Protocolos', xpReward: 200, evaluate: (c) => c.simultaneousProtocolsMax >= 3 },
    { id: 't30', name: 'CUÁDRUPLE AMENAZA', series: 'Protocolos', xpReward: 300, evaluate: (c) => c.simultaneousProtocolsMax >= 4 },
    { id: 't31', name: 'ORÁCULO DE ORO', series: 'Protocolos', xpReward: 250, evaluate: (c) => c.oracleCount >= 10 },
    { id: 't32', name: 'ARQUITECTO MAESTRO', series: 'Protocolos', xpReward: 250, evaluate: (c) => c.architectCount >= 10 },
    { id: 't33', name: 'MAGISTRADO VETERANO', series: 'Protocolos', xpReward: 250, evaluate: (c) => c.alcaldeCount >= 10 },
    { id: 't34', name: 'VANGUARDIA ÉLITE', series: 'Protocolos', xpReward: 250, evaluate: (c) => c.vanguardiaCount >= 10 },
    { id: 't35', name: 'SIFONADOR EXPERTO', series: 'Protocolos', xpReward: 250, evaluate: (c) => c.sifonInitiatorCount >= 10 },
    { id: 't36', name: 'SIFÓN TOTAL', series: 'Protocolos', xpReward: 200, evaluate: (c) => c.sifonVictimCount >= 1 },
    { id: 't37', name: 'INTEGRIDAD ABSOLUTA', series: 'Protocolos', xpReward: 150, evaluate: () => false }, // Tracked in-game
    { id: 't38', name: 'RENUNCIA ÉPICA', series: 'Protocolos', xpReward: 250, evaluate: (c) => c.renunciaRejectCount >= 1 },
    { id: 't39', name: 'LA TRANSFERENCIA', series: 'Protocolos', xpReward: 200, evaluate: (c) => c.renunciaTransferReceivedCount >= 1 },
    { id: 't40', name: 'MEMORIA DE HIERRO', series: 'Protocolos', xpReward: 300, evaluate: (c) => c.memoryHardCount >= 10 },
    { id: 't41', name: 'NEXUS COMPLETO', series: 'Protocolos', xpReward: 200, evaluate: (c) => c.nexusActiveCount >= 20 },
    { id: 't42', name: 'PANDORA ENCADENADA', series: 'Protocolos', xpReward: 300, evaluate: (c) => c.trollEventCount >= 3 },
    { id: 't43', name: 'LETEO NIVEL 3', series: 'Protocolos', xpReward: 250, evaluate: (c) => c.leteoGrade3Count >= 1 },

    // --- Serie "Comportamiento y Carácter" (12) ---
    { id: 't44', name: 'EL RELÁMPAGO', series: 'Comportamiento', xpReward: 150, evaluate: (c) => c.viewTimesLast10.some(t => t < 0.5) },
    { id: 't45', name: 'EL PARANOICO', series: 'Comportamiento', xpReward: 150, evaluate: (c) => c.viewTimesLast10.some(t => t > 10) },
    { id: 't46', name: 'CONSISTENCIA ABSOLUTA', series: 'Comportamiento', xpReward: 200, evaluate: (c) => c.normalSuspicionStreakCount >= 5 },
    { id: 't47', name: 'ANÁLISIS DE TIEMPOS', series: 'Comportamiento', xpReward: 150, evaluate: (c) => c.slowSuspicionCount >= 10 },
    { id: 't48', name: 'FANTASMA VELOZ', series: 'Comportamiento', xpReward: 150, evaluate: (c) => c.fastSuspicionCount >= 10 },
    { id: 't49', name: 'EL INICIADOR', series: 'Comportamiento', xpReward: 150, evaluate: (c) => c.timesStarter >= 10 },
    { id: 't50', name: 'NUNCA PRIMERO', series: 'Comportamiento', xpReward: 200, evaluate: (c) => c.timesNotStarter >= 20 },
    { id: 't51', name: 'ALTA FIDELIDAD', series: 'Comportamiento', xpReward: 300, evaluate: (c) => c.sameGroupExact15Count >= 15 },
    { id: 't52', name: 'ROTACIÓN PERFECTA', series: 'Comportamiento', xpReward: 200, evaluate: (c) => c.rotationCompleteCount >= 1 },
    { id: 't53', name: 'SIN TRAMPA', series: 'Comportamiento', xpReward: 100, evaluate: (c) => c.roundsWithDebugOff >= 10 },
    { id: 't54', name: 'EL CURIOSO', series: 'Comportamiento', xpReward: 100, evaluate: (c) => c.debugModeCount >= 1 },
    { id: 't55', name: 'ANTI-SISTEMA', series: 'Comportamiento', xpReward: 500, evaluate: (c) => c.impAsKonamiCount >= 1 },

    // --- Serie "Rangos" (8) ---
    { id: 't56', name: 'INSIGNIA DE INFILTRADO', series: 'Rangos', xpReward: 100, evaluate: (_c, _v, p) => p.level >= 17 && p.era === 'base' },
    { id: 't57', name: 'PLACA DE OPERATIVO', series: 'Rangos', xpReward: 100, evaluate: (_c, _v, p) => p.level >= 29 && p.era === 'base' },
    { id: 't58', name: 'CREDENCIALES DE ESPECIALISTA', series: 'Rangos', xpReward: 150, evaluate: (_c, _v, p) => p.level >= 45 && p.era === 'base' },
    { id: 't59', name: 'DISTINCIÓN ÉLITE', series: 'Rangos', xpReward: 200, evaluate: (_c, _v, p) => p.level >= 61 && p.era === 'base' },
    { id: 't60', name: 'LA HUELLA DEL FANTASMA', series: 'Rangos', xpReward: 250, evaluate: (_c, _v, p) => p.level >= 77 && p.era === 'base' },
    { id: 't61', name: 'LEYENDA CONFIRMADA', series: 'Rangos', xpReward: 300, evaluate: (_c, _v, p) => p.level >= 89 && p.era === 'base' },
    { id: 't62', name: 'ANOMALÍA CERTIFICADA', series: 'Rangos', xpReward: 400, evaluate: (_c, _v, p) => p.level >= 97 && p.era === 'base' },
    { id: 't63', name: 'RANGO MÁXIMO MANTENIDO', series: 'Rangos', xpReward: 500, evaluate: (_c, v, p) => p.level >= 97 && v.metrics.totalSessions >= 50 },

    // --- Serie "Coleccionista" (12) ---
    { id: 't64', name: 'PRIMER EMBLEMA', series: 'Coleccionista', xpReward: 100, evaluate: (_c, _v, p) => p.collectibles.length >= 1 },
    { id: 't65', name: 'SET COMPLETO', series: 'Coleccionista', xpReward: 200, evaluate: (c) => c.completedCollectionIds.length >= 1 },
    { id: 't66', name: 'COLECCIONISTA SERIO', series: 'Coleccionista', xpReward: 200, evaluate: (_c, _v, p) => p.collectibles.length >= 10 },
    { id: 't67', name: 'GALERÍA MEDIA', series: 'Coleccionista', xpReward: 300, evaluate: (_c, _v, p) => p.collectibles.length >= 30 },
    { id: 't68', name: 'GALERÍA COMPLETA', series: 'Coleccionista', xpReward: 500, evaluate: (_c, _v, p) => p.collectibles.length >= 75 },
    { id: 't69', name: 'MEDALLA DE BRONCE', series: 'Coleccionista', xpReward: 100, evaluate: (_c, _v, p) => Object.values(p.medals).filter(m => m !== 'locked').length >= 1 },
    { id: 't70', name: 'PRIMERAS 10 DE BRONCE', series: 'Coleccionista', xpReward: 200, evaluate: (_c, _v, p) => Object.values(p.medals).filter(m => m !== 'locked').length >= 10 },
    { id: 't71', name: 'PRIMER ASCENSO', series: 'Coleccionista', xpReward: 150, evaluate: (_c, _v, p) => Object.values(p.medals).filter(m => m === 'silver' || m === 'gold').length >= 1 },
    { id: 't72', name: 'COLECCIÓN PLATA', series: 'Coleccionista', xpReward: 300, evaluate: (_c, _v, p) => Object.values(p.medals).filter(m => m === 'silver' || m === 'gold').length >= 10 },
    { id: 't73', name: 'ORO PURO', series: 'Coleccionista', xpReward: 250, evaluate: (_c, _v, p) => Object.values(p.medals).filter(m => m === 'gold').length >= 1 },
    { id: 't74', name: 'ARSENAL DORADO', series: 'Coleccionista', xpReward: 400, evaluate: (_c, _v, p) => Object.values(p.medals).filter(m => m === 'gold').length >= 5 },
    { id: 't75', name: 'LA COLECCIÓN PERFECTA', series: 'Coleccionista', xpReward: 500, evaluate: (_c, _v, p) => Object.values(p.medals).filter(m => m === 'gold').length >= 75 },
];
