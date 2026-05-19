import { ProgressionEra, RankDefinition } from '../../types';

// --- XP FORMULAS ---
export function getXPForLevel(level: number, era: ProgressionEra): number {
    switch (era) {
        case 'base': return Math.round((80 + (level * level * 1.8)) / 10) * 10;
        case 'prestidigitacion': return Math.round((120 + (level * level * 2.4)) / 10) * 10;
        case 'prestidigitacion_elite': return Math.round((200 + (level * level * 3.5)) / 10) * 10;
        case 'supremo': return 0;
    }
}

export function getMaxLevel(era: ProgressionEra): number {
    switch (era) {
        case 'base': return 100;
        case 'prestidigitacion': return 150;
        case 'prestidigitacion_elite': return 200;
        case 'supremo': return Infinity;
    }
}

export function calculateLevel(xp: number, era: ProgressionEra): number {
    if (era === 'supremo') return 0;
    let accumulated = 0;
    const max = getMaxLevel(era);
    for (let lvl = 1; lvl <= max; lvl++) {
        accumulated += getXPForLevel(lvl, era);
        if (xp < accumulated) return lvl;
    }
    return max;
}

export function xpToNextLevel(xp: number, era: ProgressionEra): { current: number; needed: number; progress: number } {
    if (era === 'supremo') return { current: 0, needed: 0, progress: 1 };
    let accumulated = 0;
    const max = getMaxLevel(era);
    for (let lvl = 1; lvl <= max; lvl++) {
        const cost = getXPForLevel(lvl, era);
        if (xp < accumulated + cost) {
            const current = xp - accumulated;
            return { current, needed: cost, progress: current / cost };
        }
        accumulated += cost;
    }
    return { current: 0, needed: 0, progress: 1 };
}

// --- BASE RANKS (25 ranks, levels 1-100) ---
const BASE_RANKS: { maxLevel: number; title: string; icon: string; color: string; glow?: boolean }[] = [
    { maxLevel: 4, title: 'RECLUTA SIN NOMBRE', icon: '⬜', color: '#9ca3af' },
    { maxLevel: 8, title: 'CONTACTO INICIAL', icon: '⬜', color: '#d1d5db' },
    { maxLevel: 12, title: 'AGENTE NOVATO', icon: '🔵', color: '#60a5fa' },
    { maxLevel: 16, title: 'OPERATIVO EN PRÁCTICAS', icon: '🔵', color: '#3b82f6' },
    { maxLevel: 20, title: 'INFILTRADO', icon: '🔵', color: '#2563eb' },
    { maxLevel: 24, title: 'AGENTE DE CAMPO', icon: '🟢', color: '#4ade80' },
    { maxLevel: 28, title: 'ESPECIALISTA TÁCTICO', icon: '🟢', color: '#22c55e' },
    { maxLevel: 32, title: 'OPERATIVO SOMBRA', icon: '🟢', color: '#16a34a' },
    { maxLevel: 36, title: 'ANALISTA ÉLITE', icon: '🟡', color: '#facc15' },
    { maxLevel: 40, title: 'COORDINADOR DE RED', icon: '🟡', color: '#eab308' },
    { maxLevel: 44, title: 'ARQUITECTO DE MISIONES', icon: '🟡', color: '#ca8a04' },
    { maxLevel: 48, title: 'AGENTE FANTASMA', icon: '🟠', color: '#fb923c' },
    { maxLevel: 52, title: 'COMANDANTE OSCURO', icon: '🟠', color: '#f97316' },
    { maxLevel: 56, title: 'DIRECTOR DE OPERACIONES', icon: '🟠', color: '#ea580c' },
    { maxLevel: 60, title: 'MANIPULADOR DE SISTEMAS', icon: '🔴', color: '#f87171' },
    { maxLevel: 64, title: 'MAESTRO DEL ENGAÑO', icon: '🔴', color: '#ef4444' },
    { maxLevel: 68, title: 'LEYENDA URBANA', icon: '🔴', color: '#dc2626' },
    { maxLevel: 72, title: 'ENTIDAD SIN CLASIFICAR', icon: '🟣', color: '#c084fc' },
    { maxLevel: 76, title: 'ANOMALÍA CONFIRMADA', icon: '🟣', color: '#a855f7' },
    { maxLevel: 80, title: 'PROTOCOLO FANTASMA', icon: '🟣', color: '#9333ea' },
    { maxLevel: 84, title: 'ARQUITECTO DEL CAOS', icon: '⭐', color: '#fbbf24' },
    { maxLevel: 88, title: 'SEÑAL OSCURA', icon: '⭐', color: '#f59e0b' },
    { maxLevel: 92, title: 'ILUSIONISTA', icon: '⭐', color: '#d97706' },
    { maxLevel: 96, title: 'CÓDIGO ROJO PERMANENTE', icon: '💀', color: '#ef4444', glow: true },
    { maxLevel: 100, title: 'EL ÚLTIMO AGENTE', icon: '💀', color: '#ffffff', glow: true },
];

// --- PRESTIDIGITACION RANKS (30 ranks, levels 1-150) ---
const PREST_RANKS: { maxLevel: number; title: string; icon: string; color: string; glow?: boolean; special?: string }[] = [
    { maxLevel: 5, title: '✦ PRESTIDIGITADOR NOVATO', icon: '✦', color: '#a5b4fc' },
    { maxLevel: 10, title: '✦ ILUSIÓN PRIMERA', icon: '✦', color: '#818cf8' },
    { maxLevel: 15, title: '✦ MANIPULADOR DE SOMBRAS', icon: '✦', color: '#6366f1' },
    { maxLevel: 20, title: '✦ TEJEDOR DE MENTIRAS', icon: '✦', color: '#4f46e5' },
    { maxLevel: 25, title: '✦ ESPEJO ROTO', icon: '✦', color: '#4338ca' },
    { maxLevel: 30, title: '✦ DOBLE IDENTIDAD', icon: '✦', color: '#3730a3' },
    { maxLevel: 35, title: '✦✦ ARTISTA DEL ENGAÑO', icon: '✦✦', color: '#7c3aed' },
    { maxLevel: 40, title: '✦✦ SEÑOR DE LAS MÁSCARAS', icon: '✦✦', color: '#6d28d9' },
    { maxLevel: 45, title: '✦✦ LABERINTO VIVIENTE', icon: '✦✦', color: '#5b21b6' },
    { maxLevel: 50, title: '✦✦ PROTOCOLO ESPEJISMO', icon: '✦✦', color: '#4c1d95' },
    { maxLevel: 55, title: '✦✦✦ ENTIDAD DUAL', icon: '✦✦✦', color: '#db2777' },
    { maxLevel: 60, title: '✦✦✦ ASIMETRÍA TOTAL', icon: '✦✦✦', color: '#be185d' },
    { maxLevel: 65, title: '✦✦✦ CAÍDA LIBRE CONTROLADA', icon: '✦✦✦', color: '#9d174d' },
    { maxLevel: 70, title: '✦✦✦ CÓDIGO ESPEJO', icon: '✦✦✦', color: '#831843' },
    { maxLevel: 75, title: '✦✦✦ FRACTURA SISTÉMICA', icon: '✦✦✦', color: '#881337' },
    { maxLevel: 80, title: '✦✦✦✦ ARQUITECTO DEL VACÍO', icon: '✦✦✦✦', color: '#991b1b' },
    { maxLevel: 85, title: '✦✦✦✦ SOMBRA DE LA SOMBRA', icon: '✦✦✦✦', color: '#7f1d1d' },
    { maxLevel: 90, title: '✦✦✦✦ RESONANCIA OSCURA', icon: '✦✦✦✦', color: '#450a0a', glow: true },
    { maxLevel: 95, title: '✦✦✦✦✦ ILUSIÓN MAESTRA', icon: '✦✦✦✦✦', color: '#fde047' },
    { maxLevel: 100, title: '✦✦✦✦✦ EL ENGAÑADOR', icon: '✦✦✦✦✦', color: '#fbbf24' },
    { maxLevel: 105, title: '✦✦✦✦✦ CÓDIGO SIN NOMBRE', icon: '✦✦✦✦✦', color: '#f59e0b' },
    { maxLevel: 110, title: '✦✦✦✦✦ ARCHIVO BORRADO', icon: '✦✦✦✦✦', color: '#d97706' },
    { maxLevel: 115, title: '✧✧ ENTIDAD FINAL', icon: '✧✧', color: '#ffffff' },
    { maxLevel: 120, title: '✧✧ PROTOCOLO SILENCIO', icon: '✧✧', color: '#f1f5f9', special: 'shimmer' },
    { maxLevel: 125, title: '✧✧ FRACTAL OSCURO', icon: '✧✧', color: '#e2e8f0', glow: true },
    { maxLevel: 130, title: '✧✧✧ LA ÚLTIMA MÁSCARA', icon: '✧✧✧', color: '#cbd5e1', special: 'aurora' },
    { maxLevel: 135, title: '✧✧✧ VACÍO CONSCIENTE', icon: '✧✧✧', color: '#94a3b8', special: 'pulse' },
    { maxLevel: 140, title: '✧✧✧ EL ILUSIONISTA', icon: '✧✧✧', color: '#a855f7', special: 'rainbow' },
    { maxLevel: 145, title: '👁️ SINGULARIDAD', icon: '👁️', color: '#c084fc', special: 'iridescent' },
    { maxLevel: 150, title: '👁️ PRESTIDIGITADOR SUPREMO', icon: '👁️', color: '#ffffff', special: 'holographic' },
];

// --- ELITE RANKS (40 ranks, levels 1-200) ---
const ELITE_RANKS: { maxLevel: number; title: string; icon: string; color: string; glow?: boolean; special?: string }[] = [
    { maxLevel: 5, title: '✦✦ INICIADO ÉLITE', icon: '✦✦', color: '#1e3a8a' },
    { maxLevel: 10, title: '✦✦ AGENTE SIN ORIGEN', icon: '✦✦', color: '#312e81' },
    { maxLevel: 15, title: '✦✦ HUELLA CERO', icon: '✦✦', color: '#4c1d95' },
    { maxLevel: 20, title: '✦✦ PROTOCOLO UMBRA', icon: '✦✦', color: '#831843' },
    { maxLevel: 25, title: '✦✦ TEJIDO DE SILENCIOS', icon: '✦✦', color: '#991b1b' },
    { maxLevel: 30, title: '✦✦ FRACTURA CUÁNTICA', icon: '✦✦', color: '#450a0a' },
    { maxLevel: 35, title: '✦✦✦ ANOMALÍA DE CLASE ÉLITE', icon: '✦✦✦', color: '#9a3412' },
    { maxLevel: 40, title: '✦✦✦ ESPEJO SIN REFLEJO', icon: '✦✦✦', color: '#92400e' },
    { maxLevel: 45, title: '✦✦✦ OPERATIVO NULO', icon: '✦✦✦', color: '#94a3b8' },
    { maxLevel: 50, title: '✦✦✦ CÓDIGO OCULTO', icon: '✦✦✦', color: '#ffffff' },
    { maxLevel: 55, title: '✦✦✦✦ SEÑAL FANTASMA', icon: '✦✦✦✦', color: '#22d3ee' },
    { maxLevel: 60, title: '✦✦✦✦ LABERINTO DE LABERINTOS', icon: '✦✦✦✦', color: '#4ade80' },
    { maxLevel: 65, title: '✦✦✦✦ IDENTIDAD FRACTURADA', icon: '✦✦✦✦', color: '#f472b6' },
    { maxLevel: 70, title: '✦✦✦✦ ARQUITECTO DE REALIDADES', icon: '✦✦✦✦', color: '#a78bfa' },
    { maxLevel: 75, title: '✦✦✦✦ MAESTRO DEL VACÍO', icon: '✦✦✦✦', color: '#1a1a1a', glow: true },
    { maxLevel: 80, title: '✦✦✦✦✦ EL GRAN ENGAÑO', icon: '✦✦✦✦✦', color: '#fbbf24', glow: true },
    { maxLevel: 85, title: '✦✦✦✦✦ CÓDIGO PROHIBIDO', icon: '✦✦✦✦✦', color: '#ef4444', special: 'pulse' },
    { maxLevel: 90, title: '✦✦✦✦✦ SINGULARIDAD DUAL', icon: '✦✦✦✦✦', color: '#ffffff', special: 'aurora' },
    { maxLevel: 95, title: '✦✦✦✦✦ PROTOCOLO FINAL', icon: '✦✦✦✦✦', color: '#c084fc', special: 'iridescent' },
    { maxLevel: 100, title: '👁️ EL ÚLTIMO ESPEJO', icon: '👁️', color: '#ffffff', special: 'holographic' },
    { maxLevel: 105, title: '👁️ FRACTAL DE FRACTALES', icon: '👁️', color: '#a855f7', special: 'rainbow' },
    { maxLevel: 110, title: '👁️ ENTIDAD TRASCENDENTE', icon: '👁️', color: '#ec4899', special: 'rainbow' },
    { maxLevel: 115, title: '🌌 VACÍO PRIMORDIAL', icon: '🌌', color: '#6366f1', special: 'aurora' },
    { maxLevel: 120, title: '🌌 ORIGEN DEL CAOS', icon: '🌌', color: '#8b5cf6', special: 'aurora' },
    { maxLevel: 125, title: '🌌 SOMBRA ETERNA', icon: '🌌', color: '#1e1b4b', glow: true },
    { maxLevel: 130, title: '⚡ RESONANCIA SUPREMA', icon: '⚡', color: '#fbbf24', special: 'pulse' },
    { maxLevel: 135, title: '⚡ CÓDIGO MADRE', icon: '⚡', color: '#22c55e', special: 'pulse' },
    { maxLevel: 140, title: '⚡ SEÑAL ORIGINAL', icon: '⚡', color: '#f97316', special: 'pulse' },
    { maxLevel: 145, title: '💎 DIAMANTE NEGRO', icon: '💎', color: '#374151', special: 'shimmer' },
    { maxLevel: 150, title: '💎 CRISTAL DE CAOS', icon: '💎', color: '#a855f7', special: 'rainbow' },
    { maxLevel: 155, title: '💎 FACETA FINAL', icon: '💎', color: '#c084fc', special: 'rainbow' },
    { maxLevel: 160, title: '🔱 ORDEN SUPREMO', icon: '🔱', color: '#fbbf24', glow: true },
    { maxLevel: 165, title: '🔱 SEÑOR DEL ENGAÑO', icon: '🔱', color: '#94a3b8', glow: true },
    { maxLevel: 170, title: '🔱 LA VOZ DEL SISTEMA', icon: '🔱', color: '#ef4444', special: 'pulse' },
    { maxLevel: 175, title: '♾️ INFINITO CONSCIENTE', icon: '♾️', color: '#8b5cf6', special: 'aurora' },
    { maxLevel: 180, title: '♾️ BUCLE ETERNO', icon: '♾️', color: '#c084fc', special: 'aurora' },
    { maxLevel: 185, title: '♾️ EL QUE NO PUEDE SER VISTO', icon: '♾️', color: '#ffffff', special: 'shimmer' },
    { maxLevel: 190, title: '🌀 ESPIRAL DE VERDADES', icon: '🌀', color: '#6366f1', special: 'rainbow' },
    { maxLevel: 195, title: '🌀 EL ORIGEN', icon: '🌀', color: '#ffffff', special: 'rainbow' },
    { maxLevel: 199, title: '🌀 PRESTIDIGITADOR ÉLITE', icon: '🌀', color: '#a855f7', special: 'holographic' },
    { maxLevel: 200, title: '👁️🗨️ PRESTIDIGITACIÓN SUPREMA', icon: '👁️🗨️', color: '#ffffff', special: 'holographic' },
];

export const SUPREMO_TITLES: { id: string; title: string; icon: string; description: string }[] = [
    { id: 'sup_1', title: 'EL PRIMER MENTIROSO', icon: '👁️🗨️', description: 'Quien inició todo' },
    { id: 'sup_2', title: 'SOMBRA ABSOLUTA', icon: '🌑', description: 'No deja rastro' },
    { id: 'sup_3', title: 'EL ETERNO IMPOSTOR', icon: '♾️', description: 'Siempre ha sido él' },
    { id: 'sup_4', title: 'MAESTRO DE MÁSCARAS', icon: '🎭', description: 'Nunca mostró su cara real' },
    { id: 'sup_5', title: 'EL ORÁCULO OSCURO', icon: '🔮', description: 'Lo sabía desde el principio' },
    { id: 'sup_6', title: 'ARQUITECTO DEL CAOS', icon: '🌀', description: 'Lo construyó todo' },
    { id: 'sup_7', title: 'LA SEÑAL ORIGINAL', icon: '⚡', description: 'Existía antes del sistema' },
    { id: 'sup_8', title: 'CRISTAL NEGRO', icon: '💎', description: 'Perfecto e irrompible' },
    { id: 'sup_9', title: 'EL SIN NOMBRE', icon: '🤫', description: 'No figura en ningún archivo' },
    { id: 'sup_10', title: 'PROTOCOLO FANTASMA', icon: '👻', description: 'Nunca estuvo aquí' },
];

export function getRank(level: number, era: ProgressionEra): RankDefinition {
    if (era === 'supremo') {
        return { title: '👁️🗨️ PRESTIDIGITACIÓN SUPREMA', subtitle: 'Estado Supremo · Legado ∞', era: 'Supremo', color: '#ffffff', icon: '👁️🗨️', special: 'holographic' };
    }
    const table = era === 'base' ? BASE_RANKS : era === 'prestidigitacion' ? PREST_RANKS : ELITE_RANKS;
    const eraLabel = era === 'base' ? 'Era Base' : era === 'prestidigitacion' ? 'Prestidigitación' : 'Prestidigitación Élite';
    for (const rank of table) {
        if (level <= rank.maxLevel) {
            return {
                title: `${rank.icon} ${rank.title}`,
                subtitle: `${eraLabel} · Nivel ${level}`,
                era: eraLabel,
                color: rank.color,
                icon: rank.icon,
                glow: rank.glow,
                special: (rank as any).special
            };
        }
    }
    const last = table[table.length - 1];
    return { title: `${last.icon} ${last.title}`, subtitle: `${eraLabel} · Nivel ${level}`, era: eraLabel, color: last.color, icon: last.icon, glow: last.glow, special: (last as any).special };
}
