import { ProgressionCounters, InfinityVault } from '../../types';

export interface CollectibleDef {
    id: string;
    name: string;
    icon: string;
    setId: string;
    hidden?: boolean;
    evaluate: (c: ProgressionCounters, v: InfinityVault) => boolean;
}

export interface SetDef {
    id: string;
    name: string;
    subtitle: string;
    collectibleIds: string[];
    bonusXP: number;
}

// ============================================================
// 15 SETS × 5 COLECCIONABLES = 75
// ============================================================

export const COLLECTIBLES: CollectibleDef[] = [
    // Set 1 — AGENTES
    { id: 'col_01', name: 'El Infiltrador', icon: '🕵️', setId: 's01', evaluate: (_c, v) => Math.round(v.metrics.impostorRatio * v.metrics.totalSessions) >= 10 },
    { id: 'col_02', name: 'El Guardián', icon: '🛡️', setId: 's01', evaluate: (_c, v) => v.metrics.civilStreak >= 8 },
    { id: 'col_03', name: 'El Oráculo', icon: '👁️', setId: 's01', evaluate: (c) => c.oracleCount >= 5 },
    { id: 'col_04', name: 'El Magistrado', icon: '⚖️', setId: 's01', evaluate: (c) => c.alcaldeCount >= 5 },
    { id: 'col_05', name: 'El Arquitecto', icon: '🏛️', setId: 's01', evaluate: (c) => c.architectCount >= 5 },

    // Set 2 — PROTOCOLOS
    { id: 'col_06', name: 'Sifón', icon: '🔀', setId: 's02', evaluate: (c) => c.sifonInitiatorCount + c.sifonVictimCount >= 5 },
    { id: 'col_07', name: 'Pandora', icon: '🎭', setId: 's02', evaluate: (c) => c.trollEventCount >= 10 },
    { id: 'col_08', name: 'Renuncia', icon: '✋', setId: 's02', evaluate: (c) => c.renunciaActorCount + c.renunciaWitnessCount >= 5 },
    { id: 'col_09', name: 'Memoria', icon: '🧠', setId: 's02', evaluate: (c) => c.memoryModeCount >= 10 },
    { id: 'col_10', name: 'Nexus', icon: '⚡', setId: 's02', evaluate: (c) => c.nexusActiveCount >= 15 },

    // Set 3 — CARTAS DE IDENTIDAD
    { id: 'col_11', name: 'ID Nivel 10', icon: '🪪', setId: 's03', evaluate: (_c, v) => v.metrics.totalSessions >= 10 },
    { id: 'col_12', name: 'ID Nivel 25', icon: '🪪', setId: 's03', evaluate: (_c, v) => v.metrics.totalSessions >= 25 },
    { id: 'col_13', name: 'ID Nivel 50', icon: '🪪', setId: 's03', evaluate: (_c, v) => v.metrics.totalSessions >= 50 },
    { id: 'col_14', name: 'ID Nivel 100', icon: '🪪', setId: 's03', evaluate: (_c, v) => v.metrics.totalSessions >= 100 },
    { id: 'col_15', name: 'ID Nivel 200', icon: '🪪', setId: 's03', evaluate: (_c, v) => v.metrics.totalSessions >= 200 },

    // Set 4 — NATURALEZA
    { id: 'col_16', name: 'El Depredador', icon: '🐺', setId: 's04', evaluate: (c) => (c.categoryRoundCounts['Animales'] || 0) >= 20 },
    { id: 'col_17', name: 'La Planta', icon: '🌿', setId: 's04', evaluate: (c) => (c.categoryRoundCounts['Clima y naturaleza'] || 0) >= 15 },
    { id: 'col_18', name: 'El Oceánico', icon: '🌊', setId: 's04', evaluate: (c) => (c.categoryRoundCounts['Islas del Archipiélago'] || 0) >= 10 },
    { id: 'col_19', name: 'El Elemento', icon: '🔥', setId: 's04', evaluate: (c) => (c.categoryRoundCounts['Clima Extremo'] || 0) >= 5 },
    { id: 'col_20', name: 'El Naturalista', icon: '🌍', setId: 's04', evaluate: (c) => ((c.categoryRoundCounts['Animales'] || 0) + (c.categoryRoundCounts['Clima y naturaleza'] || 0) + (c.categoryRoundCounts['Clima Extremo'] || 0)) >= 50 },

    // Set 5 — CULTURA
    { id: 'col_21', name: 'El Director', icon: '🎬', setId: 's05', evaluate: (c) => ((c.categoryRoundCounts['Películas y series'] || 0) + (c.categoryRoundCounts['Series de Éxito'] || 0)) >= 20 },
    { id: 'col_22', name: 'El Compositor', icon: '🎵', setId: 's05', evaluate: (c) => (c.categoryRoundCounts['Música y bandas'] || 0) >= 20 },
    { id: 'col_23', name: 'El Lector', icon: '📚', setId: 's05', evaluate: (c) => (c.categoryRoundCounts['Filosofía'] || 0) >= 15 },
    { id: 'col_24', name: 'El Artista', icon: '🎨', setId: 's05', evaluate: (c) => (c.categoryRoundCounts['Iconos del Pop'] || 0) >= 15 },
    { id: 'col_25', name: 'El Académico', icon: '🏛️', setId: 's05', evaluate: (c) => c.distinctCategoriesPlayed.filter(cat => ['Películas y series','Música y bandas','Filosofía','Iconos del Pop'].includes(cat)).length >= 4 },

    // Set 6 — COTIDIANO
    { id: 'col_26', name: 'El Gourmet', icon: '🍕', setId: 's06', evaluate: (c) => ((c.categoryRoundCounts['Comidas y bebidas'] || 0) + (c.categoryRoundCounts['Cocina y gastronomía'] || 0)) >= 25 },
    { id: 'col_27', name: 'El Atleta', icon: '🏟️', setId: 's06', evaluate: (c) => ((c.categoryRoundCounts['Deportes'] || 0) + (c.categoryRoundCounts['Deportes de Raqueta'] || 0)) >= 20 },
    { id: 'col_28', name: 'El Viajero', icon: '✈️', setId: 's06', evaluate: (c) => (c.categoryRoundCounts['Países y ciudades'] || 0) >= 20 },
    { id: 'col_29', name: 'El Científico', icon: '🧪', setId: 's06', evaluate: (c) => (c.categoryRoundCounts['Ciencia y tecnología'] || 0) >= 15 },
    { id: 'col_30', name: 'El Tecnólogo', icon: '💻', setId: 's06', evaluate: (c) => ((c.categoryRoundCounts['Ciencia y tecnología'] || 0) + (c.categoryRoundCounts['Tecnología del Mañana'] || 0)) >= 20 },

    // Set 7 — TIEMPO Y VELOCIDAD
    { id: 'col_31', name: 'Milisegundo', icon: '⚡', setId: 's07', evaluate: (c) => c.viewTimesLast10.filter(t => t < 0.5).length >= 3 },
    { id: 'col_32', name: 'La Tortuga', icon: '🐢', setId: 's07', evaluate: (c) => c.viewTimesLast10.filter(t => t > 8).length >= 3 },
    { id: 'col_33', name: 'El Cronómetro', icon: '⏱️', setId: 's07', evaluate: (c) => c.normalSuspicionStreakCount >= 5 },
    { id: 'col_34', name: 'La Consistencia', icon: '🎯', setId: 's07', evaluate: (c) => {
        if (c.viewTimesLast10.length < 10) return false;
        const avg = c.viewTimesLast10.reduce((a, b) => a + b, 0) / c.viewTimesLast10.length;
        return c.viewTimesLast10.every(t => Math.abs(t - avg) < 0.5);
    }},
    { id: 'col_35', name: 'El Historiador del Tiempo', icon: '🕰️', setId: 's07', evaluate: (c) => c.totalViewTimeSeconds >= 1000 },

    // Set 8 — COMPAÑEROS
    { id: 'col_36', name: 'El Aliado', icon: '🤝', setId: 's08', evaluate: (c) => Object.values(c.coImpostorPairs).some(v => v >= 5) },
    { id: 'col_37', name: 'La Banda', icon: '👥', setId: 's08', evaluate: (c) => c.sameGroupStreakCount >= 20 },
    { id: 'col_38', name: 'El Rival', icon: '🎯', setId: 's08', evaluate: (c) => Object.values(c.coImpostorPairs).some(v => v >= 8) },
    { id: 'col_39', name: 'El Organizador', icon: '🌐', setId: 's08', evaluate: (c) => c.maxPlayersInRound >= 10 },
    { id: 'col_40', name: 'El Veterano del Grupo', icon: '👑', setId: 's08', evaluate: (_c, v) => v.metrics.totalSessions >= 30 },

    // Set 9 — CAOS Y AZAR
    { id: 'col_41', name: 'El Azar', icon: '🎰', setId: 's09', evaluate: (c) => c.highEntropyCount >= 5 },
    { id: 'col_42', name: 'El Caos', icon: '🌪️', setId: 's09', evaluate: (c) => c.simultaneousProtocolsMax >= 3 },
    { id: 'col_43', name: 'Paranoia Total', icon: '☢️', setId: 's09', evaluate: (c) => c.highParanoiaCount >= 3 },
    { id: 'col_44', name: 'Agotamiento', icon: '📉', setId: 's09', evaluate: (c) => c.exhaustionCriticalCount >= 5 },
    { id: 'col_45', name: 'El Ciclo', icon: '🔄', setId: 's09', evaluate: (c) => c.exhaustionCriticalCount >= 3 },

    // Set 10 — FIESTA
    { id: 'col_46', name: 'Aperitivo', icon: '🍻', setId: 's10', evaluate: (c) => c.partyModeCount >= 5 },
    { id: 'col_47', name: 'Hora Punta', icon: '🎉', setId: 's10', evaluate: (c) => c.partyModeCount >= 10 },
    { id: 'col_48', name: 'After Hours', icon: '🌙', setId: 's10', evaluate: (c) => c.partyAfterHoursCount >= 3 },
    { id: 'col_49', name: 'Resaca', icon: '💀', setId: 's10', evaluate: (c) => c.partyResacaCount >= 1 },
    { id: 'col_50', name: 'Hydration Hero', icon: '💦', setId: 's10', evaluate: (c) => c.hydrationLockedCount >= 5 },

    // Set 11 — RAREZAS
    { id: 'col_51', name: 'El Comodín', icon: '🃏', setId: 's11', evaluate: (c) => c.oracleCount >= 1 && c.alcaldeCount >= 1 && c.impStreakMax >= 1 },
    { id: 'col_52', name: 'Eclipse Total', icon: '🌑', setId: 's11', evaluate: (c) => c.simultaneousProtocolsMax >= 5 },
    { id: 'col_53', name: 'El Actor', icon: '🎭', setId: 's11', evaluate: (c) => c.trollEspejoCount >= 1 && c.trollCivilSolitarioCount >= 1 && c.trollFalseAlarmCount >= 1 },
    { id: 'col_54', name: 'Profecía', icon: '🔮', setId: 's11', evaluate: (c) => c.leteoGrade3Count >= 3 },
    { id: 'col_55', name: 'Infinito', icon: '♾️', setId: 's11', evaluate: (_c, v) => v.metrics.totalSessions >= 200 },

    // Set 12 — COMPORTAMIENTO EXTREMO
    { id: 'col_56', name: 'El Invisible', icon: '🤫', setId: 's12', evaluate: (c) => c.timesNotStarter >= 10 },
    { id: 'col_57', name: 'El Líder', icon: '📣', setId: 's12', evaluate: (c) => c.timesStarter >= 15 },
    { id: 'col_58', name: 'La Cuarentena', icon: '🔁', setId: 's12', evaluate: (c) => c.quarantineCount >= 5 },
    { id: 'col_59', name: 'Sin Cuarentena', icon: '🏆', setId: 's12', evaluate: (c) => c.roundsWithoutQuarantine >= 100 },
    { id: 'col_60', name: 'El Equilibrio', icon: '⚖️', setId: 's12', evaluate: (_c, v) => {
        if (v.metrics.totalSessions < 50) return false;
        return Math.abs(v.metrics.impostorRatio - 0.5) < 0.05;
    }},

    // Set 13 — SECRETOS Y EASTER EGGS (hidden)
    { id: 'col_61', name: '↑↑↓↓←→←→', icon: '🎮', setId: 's13', hidden: true, evaluate: (c) => c.konamiActivated },
    { id: 'col_62', name: 'Noctámbulo', icon: '🌙', setId: 's13', hidden: true, evaluate: (c) => c.nightRoundCount >= 5 },
    { id: 'col_63', name: 'Madrugador', icon: '☀️', setId: 's13', hidden: true, evaluate: (c) => c.morningRoundCount >= 3 },
    { id: 'col_64', name: 'Aniversario', icon: '🎂', setId: 's13', hidden: true, evaluate: () => false }, // Checked in engine with date logic
    { id: 'col_65', name: 'El Fantasma', icon: '👻', setId: 's13', hidden: true, evaluate: (c) => c.impAsKonamiCount >= 1 },

    // Set 14 — TEMAS VISUALES
    { id: 'col_66', name: 'Noir', icon: '🖤', setId: 's14', evaluate: (c) => (c.themeRoundCounts['noir'] || 0) >= 10 },
    { id: 'col_67', name: 'Cosmos', icon: '🌌', setId: 's14', evaluate: (c) => ((c.themeRoundCounts['space'] || 0) + (c.themeRoundCounts['nebula_dream'] || 0)) >= 10 },
    { id: 'col_68', name: 'Cristal', icon: '🔮', setId: 's14', evaluate: (c) => (c.themeRoundCounts['crystal_garden'] || 0) >= 10 },
    { id: 'col_69', name: 'Zen', icon: '🌅', setId: 's14', evaluate: (c) => ((c.themeRoundCounts['zen_sunset'] || 0) + (c.themeRoundCounts['aurora_borealis'] || 0)) >= 10 },
    { id: 'col_70', name: 'Cyber', icon: '⚡', setId: 's14', evaluate: (c) => ((c.themeRoundCounts['cyber'] || 0) + (c.themeRoundCounts['terminal84'] || 0)) >= 10 },

    // Set 15 — EL ARCHIVO MAESTRO (set final)
    { id: 'col_71', name: 'Bronce Completo', icon: '🥉', setId: 's15', evaluate: (_c, _v) => false }, // Evaluated in engine
    { id: 'col_72', name: 'Plata Completa', icon: '🥈', setId: 's15', evaluate: (_c, _v) => false },
    { id: 'col_73', name: 'Oro Puro', icon: '🥇', setId: 's15', evaluate: (_c, _v) => false },
    { id: 'col_74', name: 'El Archivo', icon: '🏛️', setId: 's15', evaluate: (_c, _v) => false },
    { id: 'col_75', name: 'IMPOSTOR 9.0 COMPLETADO', icon: '👁️🗨️', setId: 's15', evaluate: (_c, _v) => false },
];

export const SETS: SetDef[] = [
    { id: 's01', name: 'AGENTES', subtitle: 'Los Perfiles', collectibleIds: ['col_01','col_02','col_03','col_04','col_05'], bonusXP: 200 },
    { id: 's02', name: 'PROTOCOLOS', subtitle: 'Las Operaciones', collectibleIds: ['col_06','col_07','col_08','col_09','col_10'], bonusXP: 200 },
    { id: 's03', name: 'CARTAS DE IDENTIDAD', subtitle: 'Los Documentos', collectibleIds: ['col_11','col_12','col_13','col_14','col_15'], bonusXP: 200 },
    { id: 's04', name: 'NATURALEZA', subtitle: 'Flora y Fauna', collectibleIds: ['col_16','col_17','col_18','col_19','col_20'], bonusXP: 200 },
    { id: 's05', name: 'CULTURA', subtitle: 'Arte y Entretenimiento', collectibleIds: ['col_21','col_22','col_23','col_24','col_25'], bonusXP: 200 },
    { id: 's06', name: 'COTIDIANO', subtitle: 'Vida Diaria', collectibleIds: ['col_26','col_27','col_28','col_29','col_30'], bonusXP: 200 },
    { id: 's07', name: 'TIEMPO Y VELOCIDAD', subtitle: 'Cronómetros', collectibleIds: ['col_31','col_32','col_33','col_34','col_35'], bonusXP: 200 },
    { id: 's08', name: 'COMPAÑEROS', subtitle: 'Alianzas', collectibleIds: ['col_36','col_37','col_38','col_39','col_40'], bonusXP: 200 },
    { id: 's09', name: 'CAOS Y AZAR', subtitle: 'Entropía', collectibleIds: ['col_41','col_42','col_43','col_44','col_45'], bonusXP: 200 },
    { id: 's10', name: 'FIESTA', subtitle: 'Party Mode', collectibleIds: ['col_46','col_47','col_48','col_49','col_50'], bonusXP: 200 },
    { id: 's11', name: 'RAREZAS', subtitle: 'Muy difíciles', collectibleIds: ['col_51','col_52','col_53','col_54','col_55'], bonusXP: 300 },
    { id: 's12', name: 'COMPORTAMIENTO EXTREMO', subtitle: 'Patrones', collectibleIds: ['col_56','col_57','col_58','col_59','col_60'], bonusXP: 200 },
    { id: 's13', name: 'SECRETOS', subtitle: 'Easter Eggs', collectibleIds: ['col_61','col_62','col_63','col_64','col_65'], bonusXP: 300 },
    { id: 's14', name: 'TEMAS VISUALES', subtitle: 'Estética', collectibleIds: ['col_66','col_67','col_68','col_69','col_70'], bonusXP: 200 },
    { id: 's15', name: 'EL ARCHIVO MAESTRO', subtitle: 'Set Final', collectibleIds: ['col_71','col_72','col_73','col_74','col_75'], bonusXP: 500 },
];
