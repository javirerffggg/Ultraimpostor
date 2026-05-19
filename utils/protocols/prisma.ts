import { GamePlayer, CategoryData, PrismaData, PrismaDecision } from '../../types';

/**
 * PROTOCOLO PRISMA: El Dilema del Infiltrado Solitario
 *
 * Se activa solo si hay exactamente 1 Impostor y no es el último en revelar.
 *
 * Dos sendas:
 *  - overload:  (SOBRECARGA) El impostor recibe 2 pistas. Las pistas se filtran
 *               a todos los civiles que revelen después de él (Resplandor del Prisma).
 *  - eclipse:   (ECLIPSE) El impostor juega sin ninguna pista (0 pistas).
 *               Si gana la ronda sin pistas, se registra una "Victoria Perfecta".
 */

export const isEligibleForPrisma = (players: GamePlayer[]): boolean => {
    const impostors = players.filter(p => p.isImp);
    if (impostors.length !== 1) return false;

    const impostorIndex = players.findIndex(p => p.isImp);
    if (impostorIndex === -1) return false;

    // Regla del Último: Al menos un civil después de él en el orden de revelación
    return impostorIndex < players.length - 1;
};

export const applyPrismaDecision = (
    decision: PrismaDecision,
    gameData: GamePlayer[],
    prismaData: PrismaData,
    wordPair: CategoryData
): { updatedGameData: GamePlayer[]; updatedPrismaData: PrismaData } => {
    const updatedPrismaData: PrismaData = {
        ...prismaData,
        leakedHints: [...prismaData.leakedHints],
        decision,
        timestamp: Date.now()
    };
    let updatedGameData = [...gameData];

    const activeImpIndex = updatedGameData.findIndex(
        p => p.id === prismaData.activePlayerId
    );

    if (activeImpIndex === -1) {
        console.error('[PRISMA] activePlayerId no encontrado en gameData:', prismaData.activePlayerId);
        return { updatedGameData, updatedPrismaData };
    }

    if (decision === 'overload') {
        const hints = wordPair.hints ?? [];
        const hint1 = hints[0] ?? wordPair.hint ?? 'Pista 1';
        const hint2 = hints[1] ?? 'Pista Secundaria';

        updatedPrismaData.leakedHints = [hint1, hint2];

        updatedGameData = updatedGameData.map((p, index) => {
            if (p.id === prismaData.activePlayerId) {
                return { 
                    ...p, 
                    word: `PISTAS: 1) ${hint1} | 2) ${hint2}`, 
                    prismaChoice: 'overload' 
                };
            }
            if (!p.isImp && index > activeImpIndex) {
                // Civil revelando después del impostor: recibe filtración (Resplandor del Prisma)
                return { ...p, leakedPrismaHints: [hint1, hint2] };
            }
            return p;
        });
    } else if (decision === 'eclipse') {
        updatedGameData = updatedGameData.map(p => {
            if (p.id === prismaData.activePlayerId) {
                return { 
                    ...p, 
                    word: 'MODO FANTASMA — SIN PISTAS', 
                    prismaChoice: 'eclipse' 
                };
            }
            return p;
        });
    }

    return { updatedGameData, updatedPrismaData };
};
