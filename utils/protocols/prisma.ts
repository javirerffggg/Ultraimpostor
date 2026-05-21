import { GamePlayer, CategoryData, PrismaData, PrismaDecision, InfinityVault, MatchLog } from '../../types';

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
    wordPair: CategoryData,
    playerStats?: Record<string, InfinityVault>,
    designatedStarter?: string,
    paranoiaLevel?: number,
    last3Logs?: MatchLog[]
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

        let targetCivilianIndex = -1;
        if (prismaData.isLite) {
            let civiliansAfter = updatedGameData
                .map((p, idx) => ({ p, idx }))
                .filter(({ p, idx }) => !p.isImp && idx > activeImpIndex);
            
            // Capa 2 y 3: Exclude immediate next player if there are others available
            if (civiliansAfter.length > 1) {
                civiliansAfter = civiliansAfter.filter(({ idx }) => idx !== activeImpIndex + 1);
            }

            if (civiliansAfter.length > 0) {
                // Algoritmo ISD v2.0
                let totalWeight = 0;
                const candidatesWithWeight = civiliansAfter.map(candidate => {
                    const civilKey = candidate.p.name.trim().toLowerCase();
                    const vault = playerStats?.[civilKey];
                    
                    const rachaCivil = vault?.metrics?.civilStreak || 0;
                    const factorKarma = Math.log(rachaCivil + 2);
                    
                    const ratioImp = vault?.metrics?.impostorRatio || 0;
                    const factorRatio = 1 / (ratioImp + 0.1);
                    
                    const distancia = Math.abs(candidate.idx - activeImpIndex);
                    const coefEspacial = 1 - (1 / (distancia + 1.5));
                    
                    const factorVocalis = (candidate.p.name === designatedStarter) ? 0.35 : 1.0;
                    
                    const wasTestigo = last3Logs?.some(log => log.prismaWitness === candidate.p.name) || false;
                    const coefSaturacion = wasTestigo ? 0.40 : 1.15;
                    
                    const factorParanoia = 1 + ((paranoiaLevel || 0) / 100);
                    
                    const isd = factorKarma * factorRatio * factorVocalis * coefEspacial * coefSaturacion * factorParanoia;
                    totalWeight += isd;
                    
                    return { ...candidate, isd };
                });
                
                let randomVal = Math.random() * totalWeight;
                for (const candidate of candidatesWithWeight) {
                    randomVal -= candidate.isd;
                    if (randomVal <= 0) {
                        targetCivilianIndex = candidate.idx;
                        updatedPrismaData.witnessPlayerId = candidate.p.id;
                        break;
                    }
                }
                
                // Fallback
                if (targetCivilianIndex === -1 && candidatesWithWeight.length > 0) {
                    targetCivilianIndex = candidatesWithWeight[candidatesWithWeight.length - 1].idx;
                    updatedPrismaData.witnessPlayerId = candidatesWithWeight[candidatesWithWeight.length - 1].p.id;
                }
            }
        }

        updatedGameData = updatedGameData.map((p, index) => {
            if (p.id === prismaData.activePlayerId) {
                return { 
                    ...p, 
                    word: `PISTAS: 1) ${hint1} | 2) ${hint2}`, 
                    prismaChoice: 'overload' 
                };
            }
            if (!p.isImp && index > activeImpIndex) {
                if (prismaData.isLite) {
                    if (index === targetCivilianIndex) {
                        return { ...p, leakedPrismaHints: [hint1, hint2] };
                    }
                } else {
                    // Civil revelando después del impostor: recibe filtración (Resplandor del Prisma)
                    return { ...p, leakedPrismaHints: [hint1, hint2] };
                }
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
