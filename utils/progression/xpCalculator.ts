import { ProgressionEra } from '../../types';

// --- XP GAIN TABLE ---
interface RoundXPContext {
    participated: boolean;
    wasImpostor: boolean;
    isNewCategory: boolean;
    activeProtocolCount: number;
    civilStreak: number;
    impStreak: number;
    wasAlcalde: boolean;
    renunciaActivated: boolean;
    wasTrollEvent: boolean;
}

const ERA_MULTIPLIERS: Record<ProgressionEra, Record<string, number>> = {
    base: { impostor: 1.0, newCat: 1.0, protocol: 1.0, civilStreak: 1.0, impStreak: 1.0, alcalde: 1.0, renuncia: 1.0, troll: 1.0 },
    prestidigitacion: { impostor: 1.2, newCat: 1.5, protocol: 1.3, civilStreak: 1.2, impStreak: 1.5, alcalde: 1.3, renuncia: 1.4, troll: 1.5 },
    prestidigitacion_elite: { impostor: 1.5, newCat: 2.0, protocol: 1.8, civilStreak: 1.5, impStreak: 2.0, alcalde: 1.8, renuncia: 2.0, troll: 2.5 },
    supremo: { impostor: 1.5, newCat: 2.0, protocol: 1.8, civilStreak: 1.5, impStreak: 2.0, alcalde: 1.8, renuncia: 2.0, troll: 2.5 },
};

export interface XPBreakdownItem {
    reason: string;
    amount: number;
}

export function calculateRoundXP(ctx: RoundXPContext, era: ProgressionEra): { total: number; breakdown: XPBreakdownItem[] } {
    const m = ERA_MULTIPLIERS[era];
    const breakdown: XPBreakdownItem[] = [];
    let total = 0;

    if (ctx.participated) {
        const amt = 10;
        breakdown.push({ reason: 'Participar en ronda', amount: amt });
        total += amt;
    }
    if (ctx.wasImpostor) {
        const amt = Math.round(15 * m.impostor);
        breakdown.push({ reason: 'Ser Impostor', amount: amt });
        total += amt;
    }
    if (ctx.isNewCategory) {
        const amt = Math.round(25 * m.newCat);
        breakdown.push({ reason: 'Categoría nueva', amount: amt });
        total += amt;
    }
    if (ctx.activeProtocolCount > 0) {
        const amt = Math.round(12 * ctx.activeProtocolCount * m.protocol);
        breakdown.push({ reason: `Protocolos activos (×${ctx.activeProtocolCount})`, amount: amt });
        total += amt;
    }
    if (ctx.civilStreak >= 3) {
        const amt = Math.round(20 * m.civilStreak);
        breakdown.push({ reason: `Racha civil ${ctx.civilStreak}+`, amount: amt });
        total += amt;
    }
    if (ctx.impStreak >= 2) {
        const amt = Math.round(30 * m.impStreak);
        breakdown.push({ reason: 'Racha Impostor 2+', amount: amt });
        total += amt;
    }
    if (ctx.wasAlcalde) {
        const amt = Math.round(20 * m.alcalde);
        breakdown.push({ reason: 'Ser Alcalde', amount: amt });
        total += amt;
    }
    if (ctx.renunciaActivated) {
        const amt = Math.round(25 * m.renuncia);
        breakdown.push({ reason: 'Renuncia activada', amount: amt });
        total += amt;
    }
    if (ctx.wasTrollEvent) {
        const amt = Math.round(35 * m.troll);
        breakdown.push({ reason: 'Evento Troll (Pandora)', amount: amt });
        total += amt;
    }

    return { total, breakdown };
}

// Bonus XP for progression unlocks (same across all eras)
export const UNLOCK_XP = {
    medal_bronze: 50,
    medal_silver: 100,
    medal_gold: 150,
    trophy_common: 100,
    trophy_rare: 250,
    trophy_epic: 500,
    collectible: 75,
    set_complete: 200,
} as const;
