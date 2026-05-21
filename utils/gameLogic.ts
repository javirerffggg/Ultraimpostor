import { CATEGORIES_DATA } from '../categories';
import { GamePlayer, Player, InfinityVault, TrollScenario, CategoryData, MatchLog, SelectionTelemetry, OracleSetupData, GameState, RenunciaData, MagistradoData, SifonData, PrismaData, PrismaDecision } from '../types';
import { assignPartyRoles } from './partyLogic';
import { generateMemoryWords } from './memoryWordGenerator';

// MODULOS IMPORTADOS
import { shuffleArray } from './utils/helpers';
import { getVault, createNewVault } from './core/vault';
import { calculateParanoiaScore, detectLinearPattern } from './core/paranoia';
import { calculateInfinitumWeight, applySynergyFactor, getDebugPlayerStats } from './core/infinitum';
import { selectAlcalde } from './protocols/magistrado';
import { calculateRenunciaProbability, applyRenunciaDecision } from './protocols/renuncia';
import { getNextSifonCandidate } from './protocols/sifon';
import { runVocalisProtocol } from './protocols/vocalis';
import { calculateArchitectTrigger } from './protocols/architect';
import { isEligibleForPrisma } from './protocols/prisma';
import { selectLexiconWord, generateSmartHint, generateVanguardHints, generateArchitectOptions } from './lexicon/wordSelection';
import { TROLL_HINTS } from '../trollHints';

interface GameConfig {
    players: Player[];
    impostorCount: number;
    useHintMode: boolean;
    useTrollMode: boolean;
    useArchitectMode: boolean;
    useOracleMode: boolean;
    useVanguardiaMode: boolean;
    useNexusMode: boolean;
    useRenunciaMode: boolean;
    useMagistradoMode: boolean;
    useSifonMode: boolean;
    usePrismaMode: boolean;
    selectedCats: string[];
    history: GameState['history'];
    debugOverrides?: {
        forceTroll: TrollScenario | null;
        forceArchitect: boolean;
        forceRenuncia?: boolean;
        forceSifon?: boolean;
        forcePrisma?: boolean;
        forceBreakProtocol?: 'pandora' | 'mirror' | 'blind' | 'leteo' | null;
    }
    isPartyMode?: boolean;
    memoryModeConfig?: GameState['settings']['memoryModeConfig'];
    categorySettings?: {
        repetitionAvoidance: 'none' | 'soft' | 'medium' | 'hard';
        rareBoost: boolean;
        rotationMode?: boolean;
        favorites?: string[];
        explorerMode?: boolean;
    };
}

const getCivilStreakStdDev = (players: Player[], stats: Record<string, InfinityVault>): number => {
    const streaks = players.map(p => getVault(p.name.trim().toLowerCase(), stats).metrics.civilStreak);
    const mean = streaks.reduce((a, b) => a + b, 0) / (streaks.length || 1);
    const variance = streaks.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (streaks.length || 1);
    return Math.sqrt(variance);
};

const calculatePandoraProbability = (
    useTrollMode: boolean,
    isPartyMode: boolean,
    roundCounter: number,
    players: Player[],
    history: GameState['history'],
    paranoiaLevel: number
): number => {
    if (!useTrollMode) return 0;
    
    let prob = 7.5; // Base
    
    const consecutiveNormalRounds = history.consecutiveNormalRounds || 0;
    if (consecutiveNormalRounds > 3) {
        prob += 2.5 * (consecutiveNormalRounds - 3);
    }
    
    const lastSetupDuration = history.lastSetupDuration || 0;
    if (lastSetupDuration > 0 && lastSetupDuration < 25) {
        prob += 4.5;
    }
    
    const N = players.length;
    const lastRoundDurations = history.lastRoundDurations || [];
    
    if (lastRoundDurations.length >= 2) {
        const last2 = lastRoundDurations.slice(-2);
        const avg = (last2[0] + last2[1]) / 2;
        if (avg < 15 * N) {
            prob += 3.0;
        }
    }
    
    if (lastRoundDurations.length >= 1) {
        const last = lastRoundDurations[lastRoundDurations.length - 1];
        if (last > 50 * N) {
            prob += 1.5;
        }
    }
    
    const stdDev = getCivilStreakStdDev(players, history.playerStats);
    if (stdDev < 1.2) {
        prob += 3.0;
    }
    
    if (paranoiaLevel > 80) {
        prob *= 1.5;
    }
    
    if (isPartyMode && roundCounter >= 6) {
        prob += 20.0;
    }
    
    return prob;
};

export const generateGameData = (config: GameConfig): { 
    players: GamePlayer[]; 
    isTrollEvent: boolean;
    trollScenario: TrollScenario | null;
    isArchitectTriggered: boolean; 
    designatedStarter: string; 
    newHistory: GameState['history'];
    oracleSetup?: OracleSetupData;
    renunciaData?: RenunciaData;
    sifonData?: SifonData;
    magistradoData?: MagistradoData;
    prismaData?: PrismaData;
    wordPair: CategoryData;
} => {
    const { players, impostorCount, useHintMode, useTrollMode, useArchitectMode, useOracleMode, useVanguardiaMode, useNexusMode, useRenunciaMode, useMagistradoMode, useSifonMode, usePrismaMode, selectedCats, history, debugOverrides, isPartyMode, memoryModeConfig, categorySettings } = config;
    
    const currentRound = history.roundCounter + 1;
    
    // --- STEP 1: DETECT TROLL EVENT ---
    let isTrollEvent = false;
    let trollScenario: TrollScenario | null = null;

    if (debugOverrides?.forceTroll) {
        isTrollEvent = true;
        trollScenario = debugOverrides.forceTroll;
    }

    const pastImpostorIds = history.pastImpostorIds || [];
    const paranoiaLevel = calculateParanoiaScore(pastImpostorIds, players, currentRound);
    
    let coolingRounds = history.coolingDownRounds || 0;
    const coolingFactor = coolingRounds > 0 ? (1 - (coolingRounds * 0.25)) : 1.0;

    let breakProtocolType: 'pandora' | 'mirror' | 'blind' | 'leteo' | null = null;
    let leteoGrade: 0 | 1 | 2 | 3 = 0;
    let entropyLevel = 0;
    
    const pandoraProb = calculatePandoraProbability(useTrollMode, !!isPartyMode, currentRound, players, history, paranoiaLevel);
    const pandoraTriggered = Math.random() * 100 < pandoraProb;
    
    if (!isTrollEvent && (debugOverrides?.forceBreakProtocol || (paranoiaLevel > 90 && coolingRounds === 0) || (pandoraTriggered && coolingRounds === 0))) {
        if (debugOverrides?.forceBreakProtocol) {
            breakProtocolType = debugOverrides.forceBreakProtocol;
            if (breakProtocolType === 'pandora') {
                isTrollEvent = true;
            } else if (breakProtocolType === 'leteo') {
                leteoGrade = 3;
                entropyLevel = 1.0;
            }
        } else {
            const hasLinearPattern = detectLinearPattern(pastImpostorIds, players);
            const leteoTriggered = Math.random() * 100 < 25 && paranoiaLevel > 90;
            
            if (paranoiaLevel > 90 && leteoTriggered) {
                breakProtocolType = 'leteo';
                leteoGrade = 3; 
                entropyLevel = 1.0;
            } else if (pandoraTriggered) {
                breakProtocolType = 'pandora';
                isTrollEvent = true;
            } else if (paranoiaLevel > 90) {
                const roll = Math.random() * 100;
                if (roll < 25) {
                    breakProtocolType = 'leteo';
                    leteoGrade = hasLinearPattern ? 2 : 1;
                    entropyLevel = hasLinearPattern ? 0.6 : 0.3;
                } else if (roll < 60) {
                    breakProtocolType = 'mirror';
                } else {
                    breakProtocolType = 'blind';
                }
            }
        }
    }

    // --- STEP 2: SELECT CATEGORY & WORD ---
    const { 
        categoryName: catName, 
        wordPair, 
        updatedHistory: historyWithWordTracking, 
        telemetry: categoryTelemetry 
    } = selectLexiconWord(
        selectedCats, 
        history,
        categorySettings
    );

    // --- STEP 3: HANDLE TROLL SCENARIO ---
    if (isTrollEvent) {
        if (!trollScenario) { 
            if (isPartyMode && currentRound >= 6) {
                const roll = Math.random() * 100;
                if (roll < 35) trollScenario = 'falsa_alarma';
                else if (roll < 70) trollScenario = 'espejo_total';
                else trollScenario = 'civil_solitario';
            } else {
                const roll = Math.random() * 100;
                if (roll < 65) trollScenario = 'espejo_total';
                else if (roll < 82.5) trollScenario = 'civil_solitario';
                else trollScenario = 'falsa_alarma';
            }
        }

        const catDataList = CATEGORIES_DATA[catName];
        const trollBasePair = catDataList[Math.floor(Math.random() * catDataList.length)];
        const noiseIndex = Math.floor(Math.random() * players.length);

        const generateBabylonHint = (playerIndex: number, specificPair?: CategoryData): string => {
            if (!useHintMode) return "ERES EL IMPOSTOR";
            if (playerIndex === noiseIndex) {
                const otherCats = Object.keys(CATEGORIES_DATA).filter(c => c !== catName);
                const noiseCat = otherCats[Math.floor(Math.random() * otherCats.length)];
                const noisePair = CATEGORIES_DATA[noiseCat][0];
                const noiseHint = noisePair.hints ? noisePair.hints[0] : (noisePair.hint || "RUIDO");
                return `PISTA: ${noiseHint} (RUIDO)`;
            }
            const pairToUse = specificPair || catDataList[Math.floor(Math.random() * catDataList.length)];
            return Math.random() > 0.5 ? `PISTA: ${catName}` : `PISTA: ${generateSmartHint(pairToUse)}`;
        };

        const getTrollHint = (fallback: string) => {
            if (!useHintMode) return "ERES EL IMPOSTOR";
            if (TROLL_HINTS && TROLL_HINTS.length > 0) {
                return `PISTA: ${TROLL_HINTS[Math.floor(Math.random() * TROLL_HINTS.length)]}`;
            }
            return fallback;
        };

        let trollPlayers: GamePlayer[] = [];
        
        // MAHR v2.1 Assignments
        const sortedByKarma = [...players].sort((a, b) => {
            const aStreak = getVault(a.name.trim().toLowerCase(), history.playerStats).metrics.civilStreak;
            const bStreak = getVault(b.name.trim().toLowerCase(), history.playerStats).metrics.civilStreak;
            return aStreak - bStreak; // Ascending: [lowest streak (impostor), ..., highest streak]
        });
        
        const lastImpIds = history.pastImpostorIds.slice(0, 2); // Ex-impostors
        
        if (trollScenario === 'espejo_total') {
            trollPlayers = players.map((p, idx) => {
                const isExImpOrArch = lastImpIds.includes(p.id) || p.id === history.lastArchitectRound?.toString();
                const diffPair = catDataList[Math.floor(Math.random() * catDataList.length)]; // Hardest hints
                const fallback = generateBabylonHint(idx, isExImpOrArch ? diffPair : trollBasePair);
                return { ...p, role: 'Impostor', word: getTrollHint(fallback), realWord: trollBasePair.civ, isImp: true, category: catName, areScore: 0, impostorProbability: 100, viewTime: 0 };
            });
        } else if (trollScenario === 'civil_solitario') {
            const civilPlayer = sortedByKarma[0] || players[0];
            trollPlayers = players.map((p, idx) => {
                const fallback = generateBabylonHint(idx);
                return { ...p, role: p.id === civilPlayer.id ? 'Civil' : 'Impostor', word: p.id === civilPlayer.id ? trollBasePair.civ : getTrollHint(fallback), realWord: trollBasePair.civ, isImp: p.id !== civilPlayer.id, category: catName, areScore: 0, impostorProbability: p.id === civilPlayer.id ? 0 : 100, viewTime: 0 };
            });
        } else { // falsa_alarma
            trollPlayers = players.map(p => ({ ...p, role: 'Civil', word: trollBasePair.civ, realWord: trollBasePair.civ, isImp: false, category: catName, areScore: 0, impostorProbability: 0, viewTime: 0, isGlitchy: lastImpIds.includes(p.id) }));
        }

        const vocalisStarter = runVocalisProtocol(players, history, false);
        const newStartingPlayers = [vocalisStarter.id, ...history.lastStartingPlayers].slice(0, 10);

        if (isPartyMode) {
            trollPlayers = assignPartyRoles(trollPlayers, history, history.playerStats);
        }

        const exhaustionRate = historyWithWordTracking.categoryExhaustion?.[catName]?.usedWords.length /
                               historyWithWordTracking.categoryExhaustion?.[catName]?.totalWords || 0;

        const newLog: MatchLog = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            round: currentRound,
            category: catName,
            word: trollBasePair.civ,
            impostors: trollPlayers.filter(p => p.isImp).map(p => p.name),
            civilians: trollPlayers.filter(p => !p.isImp).map(p => p.name),
            isTroll: true,
            trollScenario: trollScenario,
            paranoiaLevel: 0,
            breakProtocol: null,
            architect: null,
            leteoGrade: 0,
            entropyLevel: 0,
            affectsINFINITUM: false,
            categoryExhaustionRate: exhaustionRate,
            exhaustionWarning: exhaustionRate > 0.95 ? 'critical' : exhaustionRate > 0.8 ? 'high' : exhaustionRate > 0.6 ? 'medium' : 'none'
        };
        const currentLogs = history.matchLogs || [];
        const updatedLogs = [newLog, ...currentLogs].slice(0, 100);

        return { 
            players: trollPlayers, isTrollEvent: true, trollScenario: trollScenario, isArchitectTriggered: false, designatedStarter: vocalisStarter.name,
            newHistory: { 
                ...historyWithWordTracking, 
                roundCounter: currentRound, 
                lastTrollRound: currentRound, 
                lastStartingPlayers: newStartingPlayers,
                playerStats: history.playerStats,
                pastImpostorIds: history.pastImpostorIds || [],
                paranoiaLevel: 0,
                coolingDownRounds: 2,
                lastBreakProtocol: breakProtocolType || 'manual',
                matchLogs: updatedLogs
            },
            wordPair: trollBasePair
        };
    }
    
    // --- STEP 4: NORMAL GAME LOGIC ---
    const workingHistory = historyWithWordTracking;
    const currentStats = { ...workingHistory.playerStats };
    const shuffledPlayers = shuffleArray(players);

    let calculationStats: Record<string, InfinityVault> = currentStats;
    
    if (breakProtocolType === 'leteo' && leteoGrade > 0) {
        calculationStats = JSON.parse(JSON.stringify(currentStats));
        if (leteoGrade >= 1) { 
            Object.values(calculationStats).forEach(v => { v.sequenceAnalytics.roleSequence = []; });
        }
        if (leteoGrade >= 2) {
            const allStreaks = Object.values(calculationStats).map(v => v.metrics.civilStreak);
            const avgStreak = allStreaks.reduce((a, b) => a + b, 0) / (allStreaks.length || 1);
            Object.values(calculationStats).forEach(v => { v.metrics.civilStreak = avgStreak; });
        }
    }

    let totalEstimatedWeight = 0;
    shuffledPlayers.forEach(p => {
        const key = p.name.trim().toLowerCase();
        const vault = getVault(key, calculationStats);
        totalEstimatedWeight += calculateInfinitumWeight(p, vault, catName, currentRound, coolingFactor, 0, 0, workingHistory.categoryUsageStats); 
    });
    const avgWeight = totalEstimatedWeight / (shuffledPlayers.length || 1);

    const playerWeights: { player: Player, weight: number, vault: InfinityVault, telemetry: SelectionTelemetry }[] = [];
    
    shuffledPlayers.forEach(p => {
        const key = p.name.trim().toLowerCase();
        const vault = getVault(key, calculationStats);
        let weight = 0;

        if (breakProtocolType === 'blind') {
            weight = 100;
        } else {
            weight = (vault.metrics.totalSessions === 0) 
                ? 100 
                : calculateInfinitumWeight(
                    p, 
                    vault, 
                    catName, 
                    currentRound, 
                    coolingFactor, 
                    avgWeight, 
                    entropyLevel,
                    workingHistory.categoryUsageStats
                );
        }
        
        playerWeights.push({ 
            player: p, 
            weight, 
            vault: getVault(key, currentStats),
            telemetry: {
                playerId: p.id,
                playerName: p.name,
                baseWeight: weight,
                paranoiaAdjustment: 0,
                synergyPenalty: 0,
                finalWeight: weight,
                probabilityPercent: 0
            } 
        });
    });

    if (breakProtocolType === 'mirror') {
        playerWeights.sort((a, b) => a.weight - b.weight); 
        playerWeights[0].weight = 999999; 
    }

    const uniqueCandidates = playerWeights.filter((v, i, a) => a.findIndex(t => (t.player.id === v.player.id)) === i);

    const selectedImpostors: Player[] = [];
    const selectedKeys: string[] = []; 
    const telemetryData: SelectionTelemetry[] = [];

    for (let i = 0; i < impostorCount; i++) {
        let availableCandidates = uniqueCandidates.filter(pw => !selectedKeys.includes(pw.player.name.trim().toLowerCase()));
        if (availableCandidates.length === 0) break;

        if (i > 0) {
            availableCandidates = availableCandidates.map(pw => {
                const newWeight = applySynergyFactor(pw.weight, pw.vault, selectedKeys, players.length);
                pw.telemetry.synergyPenalty = pw.weight - newWeight;
                return { ...pw, weight: newWeight };
            });
        }

        const totalWeight = availableCandidates.reduce((sum, pw) => sum + pw.weight, 0);
        
        if (totalWeight <= 0 || isNaN(totalWeight)) {
            availableCandidates.forEach(pw => {
                pw.weight = 100;
                pw.telemetry.finalWeight = 100;
                pw.telemetry.probabilityPercent = (100 / availableCandidates.length);
            });
        } else {
            availableCandidates.forEach(pw => {
                pw.telemetry.finalWeight = pw.weight;
                pw.telemetry.probabilityPercent = (pw.weight / totalWeight) * 100;
            });
        }
        
        availableCandidates.forEach(pw => {
            if (!telemetryData.find(t => t.playerId === pw.player.id)) {
                telemetryData.push(pw.telemetry);
            }
        });

        const safeTotalWeight = availableCandidates.reduce((sum, pw) => sum + pw.weight, 0);
        let randomTicket = Math.random() * safeTotalWeight;
        let selectedIndex = -1;

        for (let j = 0; j < availableCandidates.length; j++) {
            randomTicket -= availableCandidates[j].weight;
            if (randomTicket <= 0) {
                selectedIndex = j;
                break;
            }
        }
        if (selectedIndex === -1) selectedIndex = availableCandidates.length - 1;

        const chosen = availableCandidates[selectedIndex];
        selectedImpostors.push(chosen.player);
        selectedKeys.push(chosen.player.name.trim().toLowerCase());
    }

    const newPlayerStats = { ...currentStats };
    const newPastImpostorIds = [...pastImpostorIds];

    players.forEach(p => {
        const key = p.name.trim().toLowerCase();
        const originalVault = getVault(key, newPlayerStats);
        const isImp = selectedKeys.includes(key);
        const vault: InfinityVault = JSON.parse(JSON.stringify(originalVault));

        vault.metrics.totalSessions += 1;
        
        if (vault.metrics.quarantineRounds > 0) {
            vault.metrics.quarantineRounds -= 1;
        }

        if (isImp) {
            vault.metrics.civilStreak = 0;
            newPastImpostorIds.unshift(p.id); 
            vault.metrics.quarantineRounds = breakProtocolType ? 4 : 2;
        } else {
            if (vault.metrics.quarantineRounds === 0) {
                vault.metrics.civilStreak += 1;
            }
        }

        const currentImpostorCount = (vault.metrics.impostorRatio * (vault.metrics.totalSessions - 1)) + (isImp ? 1 : 0);
        vault.metrics.impostorRatio = currentImpostorCount / vault.metrics.totalSessions;

        if (!vault.categoryDNA[catName]) {
            vault.categoryDNA[catName] = { timesAsImpostor: 0, lastTimeAsImpostor: 0, affinityScore: 1 };
        }
        if (isImp) {
            vault.categoryDNA[catName].timesAsImpostor += 1;
            vault.categoryDNA[catName].lastTimeAsImpostor = Date.now();
        }

        vault.sequenceAnalytics.roleSequence.unshift(isImp);
        if (vault.sequenceAnalytics.roleSequence.length > 20) {
            vault.sequenceAnalytics.roleSequence.pop();
        }
        if (isImp) {
            vault.sequenceAnalytics.lastImpostorPartners = selectedKeys.filter(k => k !== key);
        }
        newPlayerStats[key] = vault;
    });

    let magistradoData: MagistradoData | undefined;
    let alcaldePlayer: Player | null = null;

    if (useMagistradoMode && players.length >= 6) {
        alcaldePlayer = selectAlcalde(players, selectedImpostors.map(i => i.id), newPlayerStats);
        
        if (alcaldePlayer) {
            magistradoData = {
                alcaldePlayerId: alcaldePlayer.id,
                alcaldePlayerName: alcaldePlayer.name,
                sessionStartTime: Date.now(),
                telemetry: {
                    wasRevealed: false
                }
            };
            
            const alcaldeKey = alcaldePlayer.name.trim().toLowerCase();
            const alcaldeVault = getVault(alcaldeKey, newPlayerStats);
            alcaldeVault.metrics.timesAsAlcalde = (alcaldeVault.metrics.timesAsAlcalde || 0) + 1;
            newPlayerStats[alcaldeKey] = alcaldeVault;
        }
    }

    const newHistoryWords = [wordPair.civ, ...workingHistory.lastWords].slice(0, 15);
    const newHistoryCategories = [catName, ...workingHistory.lastCategories].slice(0, 3);
    const newGlobalWordUsage = { ...workingHistory.globalWordUsage };
    newGlobalWordUsage[wordPair.civ] = (newGlobalWordUsage[wordPair.civ] || 0) + 1;

    const newTemporaryBlacklist: Record<string, number> = {};
    if (workingHistory.temporaryBlacklist) {
        Object.entries(workingHistory.temporaryBlacklist).forEach(([cat, rounds]) => {
            if (rounds > 1) {
                newTemporaryBlacklist[cat] = rounds - 1;
            }
        });
    }

    // --- PROTOCOLO ARQUITECTO v1.1 ---
    let isArchitectTriggered = false;
    let architectId: string | undefined;

    if (debugOverrides?.forceArchitect) {
        if (players.length > 0) {
            const firstCivil = players.find(p => !selectedKeys.includes(p.name.trim().toLowerCase()));
            if (firstCivil) {
                isArchitectTriggered = true;
                architectId = firstCivil.id;
            }
        }
    } else if (useArchitectMode && players.length > 0) {
        const primerJugador = players[0];
        const primerJugadorKey = primerJugador.name.trim().toLowerCase();
        
        if (!selectedKeys.includes(primerJugadorKey)) {
            const vault = newPlayerStats[primerJugadorKey];
            const streak = vault?.metrics?.civilStreak || 0;
            
            if (calculateArchitectTrigger(history, streak)) {
                isArchitectTriggered = true;
                architectId = primerJugador.id;
            }
        } else {
            isArchitectTriggered = false;
            architectId = undefined;
        }
    }

    let oracleId: string | undefined;
    let oracleSetup: OracleSetupData | undefined;
    
    if (useOracleMode && useHintMode && players.length > 2) {
        let firstImpIndex = -1;
        
        for (let i = 0; i < players.length; i++) {
            const key = players[i].name.trim().toLowerCase();
            if (selectedKeys.includes(key)) {
                firstImpIndex = i;
                break; 
            }
        }

        if (firstImpIndex > 0) {
            const potentialOracles = players.slice(0, firstImpIndex).filter(p => p.id !== architectId && p.id !== alcaldePlayer?.id);
            
            if (potentialOracles.length > 0) {
                const oracleWeights = potentialOracles.map(p => {
                    const key = p.name.trim().toLowerCase();
                    const vault = getVault(key, newPlayerStats);
                    return {
                        player: p,
                        weight: Math.max(1, vault.metrics.civilStreak)
                    };
                });
                
                const totalWeight = oracleWeights.reduce((sum, w) => sum + w.weight, 0);
                let ticket = Math.random() * totalWeight;
                let chosenOracle: Player | undefined;
                
                for (const item of oracleWeights) {
                    ticket -= item.weight;
                    if (ticket <= 0) {
                        chosenOracle = item.player;
                        break;
                    }
                }
                
                if (!chosenOracle && oracleWeights.length > 0) chosenOracle = oracleWeights[0].player;

                if (chosenOracle) {
                    oracleId = chosenOracle.id;
                    
                    const hints = wordPair.hints && wordPair.hints.length >= 3 
                        ? wordPair.hints.slice(0, 3) 
                        : shuffleArray([...(wordPair.hints || []), wordPair.hint || "Sin Pista", "RUIDO"]).slice(0, 3);

                    oracleSetup = {
                        oraclePlayerId: oracleId,
                        availableHints: hints,
                        civilWord: wordPair.civ
                    };
                }
            }
        }
    }

    const vocalisStarter = runVocalisProtocol(players, history, false, architectId);
    const newStartingPlayers = [vocalisStarter.id, ...history.lastStartingPlayers].slice(0, 10);

    let gamePlayers: GamePlayer[] = players.map(p => {
        const key = p.name.trim().toLowerCase();
        const isImp = selectedKeys.includes(key);
        const weightObj = playerWeights.find(pw => pw.player.name.trim().toLowerCase() === key);
        const rawWeight = weightObj ? weightObj.weight : 0;
        const probability = uniqueCandidates.reduce((sum, c) => sum + c.weight, 0) > 0 
            ? (rawWeight / uniqueCandidates.reduce((sum, c) => sum + c.weight, 0)) * 100 
            : 0;
        const isOracle = p.id === oracleId;
        const isArchitect = p.id === architectId;
        const isAlcalde = p.id === alcaldePlayer?.id;

        let isVanguardia = false;
        if (useVanguardiaMode && useHintMode && isImp) {
            if (p.id === vocalisStarter.id) {
                isVanguardia = true;
            }
        }

        let displayWord = wordPair.civ;
        if (isImp) {
            if (isVanguardia) {
                 displayWord = generateVanguardHints(wordPair);
            } else {
                 const hint = generateSmartHint(wordPair);
                 displayWord = useHintMode ? `PISTA: ${hint}` : "ERES EL IMPOSTOR";
            }
        }

        let memoryWords: string[] | undefined;
        let memoryCorrectIndex: number | undefined;

        if (memoryModeConfig && memoryModeConfig.enabled) {
            const memResult = generateMemoryWords(
                catName,
                wordPair.civ,
                isImp,
                memoryModeConfig.difficulty,
                memoryModeConfig.wordCount
            );
            memoryWords = memResult.displayWords;
            memoryCorrectIndex = memResult.correctIndex;
        }

        return {
            id: p.id,
            name: p.name,
            role: isImp ? 'Impostor' : 'Civil',
            word: displayWord,
            realWord: wordPair.civ,
            isImp: isImp,
            category: catName,
            areScore: rawWeight,
            impostorProbability: probability,
            viewTime: 0,
            isOracle: isOracle,
            isVanguardia: isVanguardia,
            isArchitect: isArchitect,
            isAlcalde: isAlcalde,
            memoryWords: memoryWords,
            memoryCorrectIndex: memoryCorrectIndex
        };
    });

    if (useNexusMode && impostorCount > 1) {
        const impostorNames = gamePlayers.filter(p => p.isImp).map(p => p.name);
        gamePlayers.forEach(p => {
            if (p.isImp) {
                p.nexusPartners = impostorNames.filter(name => name !== p.name);
            }
        });
    }

    let renunciaData: RenunciaData | undefined;
    let renunciaTelemetry: any | undefined;

    const shouldTryRenuncia = (
        (useRenunciaMode || debugOverrides?.forceRenuncia) &&
        impostorCount >= 2 &&
        players.length >= 4 &&
        !isTrollEvent &&
        selectedImpostors.length >= 2
    );

    if (shouldTryRenuncia) {
        const eligibleCandidates = selectedImpostors.filter(impostor => {
            if (debugOverrides?.forceRenuncia) return true;
            
            const impostorIndex = players.findIndex(p => p.id === impostor.id);
            if (impostorIndex === -1) return false;
            
            const civiliansBeforeCount = players.slice(0, impostorIndex).filter(p => {
                const key = p.name.trim().toLowerCase();
                return !selectedKeys.includes(key); 
            }).length;
            
            return civiliansBeforeCount >= 2;
        });
        
        if (eligibleCandidates.length > 0) {
            const candidateIndex = Math.floor(Math.random() * eligibleCandidates.length);
            const candidate = eligibleCandidates[candidateIndex];
            
            const { probability, telemetry } = calculateRenunciaProbability(
                candidate,
                currentRound,
                newPlayerStats,
                history
            );
            
            renunciaTelemetry = telemetry;
            
            const roll = Math.random();
            if (debugOverrides?.forceRenuncia || roll < probability) {
                renunciaData = {
                    candidatePlayerId: candidate.id,
                    originalImpostorIds: selectedImpostors.map(imp => imp.id),
                    decision: 'pending',
                    timestamp: Date.now(),
                    hasSeenInitialRole: true // Skipped initial role view as per user request
                };
            }
        }
    }

    // --- PROTOCOLO SIFÓN ---
    // Se activa solo si: modo habilitado (o forceSifon), al menos 2 impostores,
    // no hay evento Troll y no hay una Renuncia activa en la misma ronda
    // (los dos protocolos son mutuamente excluyentes para evitar sobrecarga).
    let sifonData: SifonData | undefined;

    const shouldTrySifon = (
        (useSifonMode || debugOverrides?.forceSifon) &&
        useHintMode &&
        impostorCount >= 2 &&
        !isTrollEvent &&
        !renunciaData  // mutuamente excluyente con Renuncia
    );

    if (shouldTrySifon) {
        const firstCandidateId = getNextSifonCandidate(gamePlayers, -1);
        if (firstCandidateId) {
            sifonData = {
                activePlayerId: firstCandidateId,
                decision: 'pending',
                leakedHints: [],
                siphonedImpostorsIds: []
            };
        }
    }

    // --- PROTOCOLO PRISMA ---
    // Se activa solo si: modo habilitado (o forcePrisma), exactamente 1 impostor,
    // no hay evento Troll y se cumplen las condiciones de la Regla del Último.
    let prismaData: PrismaData | undefined;

    const shouldTryPrisma = (
        (usePrismaMode || debugOverrides?.forcePrisma) &&
        impostorCount === 1 &&
        !isTrollEvent
    );

    if (shouldTryPrisma && (debugOverrides?.forcePrisma || isEligibleForPrisma(gamePlayers))) {
        const impostorPlayer = gamePlayers.find(p => p.isImp);
        if (impostorPlayer) {
            prismaData = {
                activePlayerId: impostorPlayer.id,
                decision: 'pending',
                leakedHints: []
            };

            // Registrar activación en la Bóveda de Infinitum
            const impKey = impostorPlayer.name.trim().toLowerCase();
            const impVault = getVault(impKey, newPlayerStats);
            impVault.metrics.prismaActiveCount = (impVault.metrics.prismaActiveCount || 0) + 1;
            newPlayerStats[impKey] = impVault;
        }
    }

    if (newPastImpostorIds.length > 20) newPastImpostorIds.length = 20;
    
    const lastBartenders = history.lastBartenders || [];
    let newBartenderId: string | null = null;
    
    if (isPartyMode) {
        gamePlayers = assignPartyRoles(gamePlayers, history, newPlayerStats);
        const bartender = gamePlayers.find(p => p.partyRole === 'bartender');
        if (bartender) newBartenderId = bartender.id;
    }
    
    const newLastBartenders = newBartenderId 
        ? [newBartenderId, ...lastBartenders].slice(0, 10) 
        : lastBartenders;

    const exhaustionRate = workingHistory.categoryExhaustion?.[catName]?.usedWords.length /
                           workingHistory.categoryExhaustion?.[catName]?.totalWords || 0;

    const newLog: MatchLog = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        round: currentRound,
        category: catName,
        word: wordPair.civ,
        impostors: gamePlayers.filter(p => p.isImp).map(p => p.name),
        civilians: gamePlayers.filter(p => !p.isImp).map(p => p.name),
        isTroll: false,
        trollScenario: null,
        paranoiaLevel: breakProtocolType ? 0 : paranoiaLevel,
        breakProtocol: breakProtocolType,
        architect: architectId ? players.find(p => p.id === architectId)?.name || "Unknown" : null,
        oracle: oracleId ? players.find(p => p.id === oracleId)?.name || "Unknown" : null,
        leteoGrade: leteoGrade,
        entropyLevel: entropyLevel,
        telemetry: telemetryData,
        renunciaTriggered: !!renunciaData,
        renunciaTelemetry: renunciaTelemetry ? {
            finalProbability: renunciaTelemetry.finalProb,
            karmaBonus: renunciaTelemetry.vectorKarma,
            sessionBonus: renunciaTelemetry.vectorSession,
            failureBonus: renunciaTelemetry.vectorFailure,
            candidateStreak: renunciaTelemetry.candidateStreak
        } : undefined,
        magistrado: alcaldePlayer?.name,
        sifonTriggered: !!sifonData,
        sifonDecision: sifonData ? 'pending' : undefined,
        sifonSiphoner: sifonData ? players.find(p => p.id === sifonData!.activePlayerId)?.name : undefined,
        prismaTriggered: !!prismaData,
        prismaDecision: prismaData ? 'pending' : undefined,
        categorySelectionTelemetry: categoryTelemetry,
        categoryExhaustionRate: exhaustionRate,
        exhaustionWarning: exhaustionRate > 0.95 ? 'critical' : exhaustionRate > 0.8 ? 'high' : exhaustionRate > 0.6 ? 'medium' : 'none'
    };
    const currentLogs = history.matchLogs || [];
    const updatedLogs = [newLog, ...currentLogs].slice(0, 100);

    const finalCoolingRounds = (breakProtocolType === 'leteo' && leteoGrade === 3) 
        ? 4 
        : (breakProtocolType ? 3 : Math.max(0, coolingRounds - 1));

    return { 
        players: gamePlayers, 
        isTrollEvent: isTrollEvent, 
        trollScenario: trollScenario,
        isArchitectTriggered: isArchitectTriggered,
        designatedStarter: vocalisStarter.name,
        oracleSetup: oracleSetup, 
        renunciaData: renunciaData,
        sifonData: sifonData,
        magistradoData: magistradoData,
        prismaData: prismaData,
        newHistory: {
            roundCounter: currentRound, 
            lastWords: newHistoryWords,
            lastCategories: newHistoryCategories,
            globalWordUsage: newGlobalWordUsage,
            categoryExhaustion: workingHistory.categoryExhaustion,
            categoryUsageStats: workingHistory.categoryUsageStats,
            playerStats: newPlayerStats,
            lastTrollRound: isTrollEvent ? currentRound : workingHistory.lastTrollRound,
            lastArchitectRound: isArchitectTriggered ? currentRound : workingHistory.lastArchitectRound,
            lastStartingPlayers: newStartingPlayers,
            lastBartenders: newLastBartenders, 
            pastImpostorIds: newPastImpostorIds,
            paranoiaLevel: breakProtocolType ? 0 : paranoiaLevel, 
            coolingDownRounds: finalCoolingRounds,
            lastBreakProtocol: breakProtocolType,
            matchLogs: updatedLogs,
            lastLeteoRound: breakProtocolType === 'leteo' ? currentRound : workingHistory.lastLeteoRound,
            rotationIndex: workingHistory.rotationIndex,
            temporaryBlacklist: newTemporaryBlacklist,
            explorerDeck: workingHistory.explorerDeck
        },
        wordPair
    };
};
