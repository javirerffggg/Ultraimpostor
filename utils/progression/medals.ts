import { ProgressionCounters, InfinityVault, MedalTier } from '../../types';

export interface MedalDef {
    id: string;
    name: string;
    block: 'A' | 'B' | 'C' | 'D' | 'E';
    bronze: number;
    silver: number;
    gold: number | null; // null = no gold tier
    getValue: (c: ProgressionCounters, v: InfinityVault) => number;
}

function tier(value: number, b: number, s: number, g: number | null): MedalTier {
    if (g !== null && value >= g) return 'gold';
    if (value >= s) return 'silver';
    if (value >= b) return 'bronze';
    return 'locked';
}

export function evaluateMedal(def: MedalDef, c: ProgressionCounters, v: InfinityVault): { tier: MedalTier; value: number } {
    const value = def.getValue(c, v);
    return { tier: tier(value, def.bronze, def.silver, def.gold), value };
}

// ============================================================
// BLOQUE A — Presencia y Participación (15)
// ============================================================
export const MEDALS: MedalDef[] = [
    { id: 'a01', name: 'Punto de Encuentro', block: 'A', bronze: 5, silver: 25, gold: 100, getValue: (_c, v) => v.metrics.totalSessions },
    { id: 'a02', name: 'Sin Excusas', block: 'A', bronze: 3, silver: 10, gold: 20, getValue: (c) => c.consecutiveRoundsInSession },
    { id: 'a03', name: 'Veterano del Sector', block: 'A', bronze: 10, silver: 50, gold: 200, getValue: (_c, v) => v.metrics.totalSessions },
    { id: 'a04', name: 'Constancia', block: 'A', bronze: 3, silver: 10, gold: 30, getValue: (c) => c.sessionsPlayed },
    { id: 'a05', name: 'El Más Temprano', block: 'A', bronze: 3, silver: 10, gold: 30, getValue: (c) => c.timesFirstInList },
    { id: 'a06', name: 'El Último en Irse', block: 'A', bronze: 3, silver: 10, gold: 25, getValue: (c) => c.timesLastReveal },
    { id: 'a07', name: 'Grupo Estable', block: 'A', bronze: 5, silver: 15, gold: 40, getValue: (c) => c.sameGroupStreakCount },
    { id: 'a08', name: 'Expansión de Red', block: 'A', bronze: 8, silver: 10, gold: 12, getValue: (c) => c.maxPlayersInRound },
    { id: 'a09', name: 'Sesión Épica', block: 'A', bronze: 8, silver: 15, gold: 25, getValue: (c) => c.roundsInDay },
    { id: 'a10', name: 'Ritmo de Partida', block: 'A', bronze: 5, silver: 15, gold: 40, getValue: (c) => c.fastRevealCount },
    { id: 'a11', name: 'Reflexivo', block: 'A', bronze: 5, silver: 15, gold: 40, getValue: (c) => c.slowRevealCount },
    { id: 'a12', name: 'Invicto en Debates', block: 'A', bronze: 10, silver: 25, gold: 60, getValue: (c) => c.timesNotStarter },
    { id: 'a13', name: 'Portavoz', block: 'A', bronze: 5, silver: 20, gold: 60, getValue: (c) => c.timesStarter },
    { id: 'a14', name: 'Bienvenido al Caos', block: 'A', bronze: 1, silver: 3, gold: 7, getValue: (c) => c.protocolsSeenDistinct.length },
    { id: 'a15', name: 'Explorador', block: 'A', bronze: 1, silver: 5, gold: 15, getValue: (c) => c.explorerModeCount },

    // ============================================================
    // BLOQUE B — Rol de Impostor (15)
    // ============================================================
    { id: 'b01', name: 'Sombra', block: 'B', bronze: 5, silver: 20, gold: 75, getValue: (_c, v) => Math.round(v.metrics.impostorRatio * v.metrics.totalSessions) },
    { id: 'b02', name: 'Presencia Oscura', block: 'B', bronze: 3, silver: 10, gold: 25, getValue: (c) => {
        const cats = new Set<string>();
        // Count categories where player was impostor via categoryDNA
        return cats.size; // Will be calculated from vault in engine
    }},
    { id: 'b03', name: 'Doble Juego', block: 'B', bronze: 2, silver: 3, gold: 5, getValue: (c) => c.impStreakMax },
    { id: 'b04', name: 'La Pareja Perfecta', block: 'B', bronze: 3, silver: 8, gold: 20, getValue: (c) => Math.max(0, ...Object.values(c.coImpostorPairs)) },
    { id: 'b05', name: 'Solo contra Todos', block: 'B', bronze: 6, silver: 8, gold: 10, getValue: (c) => Math.max(0, ...c.soloImpostorWithNPlayers, 0) },
    { id: 'b06', name: 'El Trío Oscuro', block: 'B', bronze: 1, silver: 5, gold: 15, getValue: (c) => c.tripleImpostorCount },
    { id: 'b07', name: 'Especialista en Fauna', block: 'B', bronze: 5, silver: 15, gold: 40, getValue: (c) => c.categoryRoundCounts['Animales'] || 0 },
    { id: 'b08', name: 'Carta de Impostor Rápida', block: 'B', bronze: 1, silver: 5, gold: 15, getValue: (c) => c.impFastRevealCount },
    { id: 'b09', name: 'Carta de Impostor Lenta', block: 'B', bronze: 1, silver: 5, gold: 15, getValue: (c) => c.impSlowRevealCount },
    { id: 'b10', name: 'Impostores en Alta Paranoia', block: 'B', bronze: 1, silver: 5, gold: 15, getValue: (c) => c.impWithParanoiaGt7Count },
    { id: 'b11', name: 'Protocolo Renuncia — Actor', block: 'B', bronze: 1, silver: 3, gold: 8, getValue: (c) => c.renunciaActorCount },
    { id: 'b12', name: 'Protocolo Renuncia — Decisión', block: 'B', bronze: 3, silver: 5, gold: null, getValue: (c) => c.renunciaAcceptCount + c.renunciaRejectCount },
    { id: 'b13', name: 'El Testigo', block: 'B', bronze: 1, silver: 3, gold: 8, getValue: (c) => c.renunciaWitnessCount },
    { id: 'b14', name: 'Transferencia', block: 'B', bronze: 1, silver: 3, gold: null, getValue: (c) => c.renunciaTransferReceivedCount },
    { id: 'b15', name: 'Sifón Iniciado', block: 'B', bronze: 1, silver: 3, gold: 8, getValue: (c) => c.sifonInitiatorCount },

    // ============================================================
    // BLOQUE C — Rol Civil (15)
    // ============================================================
    { id: 'c01', name: 'La Fachada', block: 'C', bronze: 5, silver: 12, gold: 30, getValue: (_c, v) => v.metrics.civilStreak },
    { id: 'c02', name: 'Racha Limpia', block: 'C', bronze: 5, silver: 10, gold: 20, getValue: (_c, v) => v.metrics.civilStreak },
    { id: 'c03', name: 'Confiable', block: 'C', bronze: 3, silver: 7, gold: 18, getValue: (c) => c.sameGroupStreakCount },
    { id: 'c04', name: 'Oráculo Designado', block: 'C', bronze: 1, silver: 3, gold: 10, getValue: (c) => c.oracleCount },
    { id: 'c05', name: 'Pista Valiosa', block: 'C', bronze: 1, silver: 5, gold: 15, getValue: (c) => c.oracleConfirmedCount },
    { id: 'c06', name: 'Vanguardia', block: 'C', bronze: 1, silver: 3, gold: 10, getValue: (c) => c.vanguardiaCount },
    { id: 'c07', name: 'Arquitecto', block: 'C', bronze: 1, silver: 3, gold: 10, getValue: (c) => c.architectCount },
    { id: 'c08', name: 'Magistrado', block: 'C', bronze: 1, silver: 3, gold: 10, getValue: (c) => c.alcaldeCount },
    { id: 'c09', name: 'El Silencioso', block: 'C', bronze: 5, silver: 15, gold: 35, getValue: (c) => c.civilFastRevealCount },
    { id: 'c10', name: 'Sifón Víctima', block: 'C', bronze: 1, silver: 3, gold: 8, getValue: (c) => c.sifonVictimCount },
    { id: 'c11', name: 'Sifón Silencioso', block: 'C', bronze: 1, silver: 3, gold: null, getValue: (c) => c.sifonSilenceVictimCount },
    { id: 'c12', name: 'Memoria Activada', block: 'C', bronze: 5, silver: 10, gold: 20, getValue: (c) => c.memoryModeCount },
    { id: 'c13', name: 'Memoria Difícil', block: 'C', bronze: 5, silver: 10, gold: 15, getValue: (c) => c.memoryHardCount },
    { id: 'c14', name: 'Civil en Pandora', block: 'C', bronze: 1, silver: 5, gold: 15, getValue: (c) => c.civilInTrollCount },
    { id: 'c15', name: 'Nexus Activo', block: 'C', bronze: 5, silver: 10, gold: 20, getValue: (c) => c.nexusActiveCount },

    // ============================================================
    // BLOQUE D — Categorías y Palabras (15)
    // ============================================================
    { id: 'd01', name: 'Catálogo Abierto', block: 'D', bronze: 10, silver: 30, gold: 70, getValue: (c) => c.distinctCategoriesPlayed.length },
    { id: 'd02', name: 'Monomaníaco', block: 'D', bronze: 10, silver: 25, gold: 60, getValue: (c) => c.favoriteCategoryMaxCount },
    { id: 'd03', name: 'Gastrónomo', block: 'D', bronze: 10, silver: 25, gold: 60, getValue: (c) => (c.categoryRoundCounts['Comidas y bebidas'] || 0) + (c.categoryRoundCounts['Cocina y gastronomía'] || 0) + (c.categoryRoundCounts['Gastronomía Regional'] || 0) },
    { id: 'd04', name: 'Cinéfilo', block: 'D', bronze: 10, silver: 25, gold: 60, getValue: (c) => (c.categoryRoundCounts['Películas y series'] || 0) + (c.categoryRoundCounts['Series de Éxito'] || 0) + (c.categoryRoundCounts['Cine de Terror'] || 0) },
    { id: 'd05', name: 'Naturaleza Salvaje', block: 'D', bronze: 10, silver: 25, gold: 60, getValue: (c) => (c.categoryRoundCounts['Animales'] || 0) + (c.categoryRoundCounts['Clima y naturaleza'] || 0) },
    { id: 'd06', name: 'Mundo Digital', block: 'D', bronze: 10, silver: 15, gold: 40, getValue: (c) => (c.categoryRoundCounts['Ciencia y tecnología'] || 0) + (c.categoryRoundCounts['Tecnología del Mañana'] || 0) },
    { id: 'd07', name: 'Deportista', block: 'D', bronze: 10, silver: 25, gold: 60, getValue: (c) => (c.categoryRoundCounts['Deportes'] || 0) + (c.categoryRoundCounts['Deportes de Raqueta'] || 0) },
    { id: 'd08', name: 'Turista', block: 'D', bronze: 10, silver: 25, gold: 60, getValue: (c) => (c.categoryRoundCounts['Países y ciudades'] || 0) + (c.categoryRoundCounts['Monumentos Nacionales'] || 0) },
    { id: 'd09', name: 'Artista', block: 'D', bronze: 10, silver: 25, gold: 60, getValue: (c) => (c.categoryRoundCounts['Música y bandas'] || 0) },
    { id: 'd10', name: 'Alerta de Agotamiento', block: 'D', bronze: 1, silver: 3, gold: 8, getValue: (c) => c.exhaustionCriticalCount },
    { id: 'd11', name: 'Palabra Repetida', block: 'D', bronze: 1, silver: 5, gold: 15, getValue: (c) => c.repeatedWordCount },
    { id: 'd12', name: 'Categoría Favorita', block: 'D', bronze: 15, silver: 40, gold: 100, getValue: (c) => c.favoriteCategoryMaxCount },
    { id: 'd13', name: 'Diversidad Total', block: 'D', bronze: 5, silver: 8, gold: 12, getValue: (c) => c.diversityInSessionMax },
    { id: 'd14', name: 'Rareza', block: 'D', bronze: 1, silver: 5, gold: 20, getValue: () => 0 }, // Tracked separately
    { id: 'd15', name: 'Explorador de Viñetas', block: 'D', bronze: 1, silver: 3, gold: 7, getValue: (c) => c.completedCollectionIds.length },

    // ============================================================
    // BLOQUE E — Eventos Especiales y Rareza (15)
    // ============================================================
    { id: 'e01', name: 'Protocolo Pandora', block: 'E', bronze: 1, silver: 5, gold: 20, getValue: (c) => c.trollEventCount },
    { id: 'e02', name: 'Sabotaje Total', block: 'E', bronze: 1, silver: 3, gold: 10, getValue: (c) => c.trollEspejoCount },
    { id: 'e03', name: 'Civil Solitario', block: 'E', bronze: 1, silver: 3, gold: 10, getValue: (c) => c.trollCivilSolitarioCount },
    { id: 'e04', name: 'Falsa Alarma', block: 'E', bronze: 1, silver: 3, gold: 10, getValue: (c) => c.trollFalseAlarmCount },
    { id: 'e05', name: 'Alta Entropía', block: 'E', bronze: 1, silver: 5, gold: 15, getValue: (c) => c.highEntropyCount },
    { id: 'e06', name: 'Paranoia Máxima', block: 'E', bronze: 1, silver: 3, gold: 10, getValue: (c) => c.highParanoiaCount },
    { id: 'e07', name: 'Cuarentena', block: 'E', bronze: 1, silver: 3, gold: 8, getValue: (c) => c.quarantineCount },
    { id: 'e08', name: 'Sin Cuarentena', block: 'E', bronze: 50, silver: 100, gold: 200, getValue: (c) => c.roundsWithoutQuarantine },
    { id: 'e09', name: 'Modo Fiesta', block: 'E', bronze: 5, silver: 15, gold: 25, getValue: (c) => c.partyModeCount },
    { id: 'e10', name: 'After Hours', block: 'E', bronze: 1, silver: 3, gold: 10, getValue: (c) => c.partyAfterHoursCount },
    { id: 'e11', name: 'Resaca', block: 'E', bronze: 1, silver: 3, gold: 5, getValue: (c) => c.partyResacaCount },
    { id: 'e12', name: 'Konami', block: 'E', bronze: 0, silver: 1, gold: null, getValue: (c) => c.konamiActivated ? 1 : 0 },
    { id: 'e13', name: 'Hydration Lock', block: 'E', bronze: 1, silver: 3, gold: null, getValue: (c) => c.hydrationLockedCount },
    { id: 'e14', name: 'Modo Debug', block: 'E', bronze: 1, silver: 5, gold: null, getValue: (c) => c.debugModeCount },
    { id: 'e15', name: 'Anomalía del Sistema', block: 'E', bronze: 1, silver: 2, gold: 5, getValue: (c) => c.leteoGrade3Count },
];
