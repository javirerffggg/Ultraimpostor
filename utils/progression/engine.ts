import {
    PlayerProgression, ProgressionUnlockEvent, GameState, GamePlayer,
    MatchLog, InfinityVault, MedalTier, ProgressionCounters
} from '../../types';
import { MEDALS, evaluateMedal } from './medals';
import { TROPHIES } from './trophies';
import { COLLECTIBLES, SETS } from './collectibles';
import { calculateRoundXP, UNLOCK_XP } from './xpCalculator';
import { calculateLevel, xpToNextLevel, getRank, getMaxLevel } from './xpCurves';
import { getProgression, createDefaultCounters } from './storage';
import { getVault } from '../core/vault';

// ============================================================
// COUNTER UPDATER — Maps game data → progression counters
// ============================================================
export function updateCounters(
    counters: ProgressionCounters,
    player: GamePlayer,
    matchLog: MatchLog,
    gameState: GameState,
    allPlayers: GamePlayer[]
): ProgressionCounters {
    const c = { ...counters };
    const now = Date.now();
    const hour = new Date(now).getHours();

    // Session tracking
    c.consecutiveRoundsInSession += 1;
    c.roundsInDay += 1;

    // Time of day
    if (hour >= 0 && hour < 6) c.nightRoundCount += 1;
    if (hour >= 5 && hour < 8) c.morningRoundCount += 1;

    // Theme tracking
    const theme = gameState.theme;
    c.themeRoundCounts = { ...c.themeRoundCounts };
    c.themeRoundCounts[theme] = (c.themeRoundCounts[theme] || 0) + 1;

    // Player list position
    const playerIndex = gameState.players.findIndex(p => p.name === player.name);
    if (playerIndex === 0) c.timesFirstInList += 1;
    if (playerIndex === gameState.players.length - 1) c.timesLastReveal += 1;
    c.maxPlayersInRound = Math.max(c.maxPlayersInRound, allPlayers.length);

    // Starter
    if (gameState.startingPlayer === player.name) {
        c.timesStarter += 1;
    } else {
        c.timesNotStarter += 1;
    }

    // View time
    const vt = player.viewTime || 0;
    c.totalViewTimeSeconds += vt;
    c.viewTimesLast10 = [vt, ...(c.viewTimesLast10 || [])].slice(0, 10);
    if (vt > 0 && vt < 1) c.fastRevealCount += 1;
    if (vt > 5) c.slowRevealCount += 1;

    // Group hash
    const groupHash = gameState.players.map(p => p.name).sort().join('|');
    if (groupHash === c.lastGroupHash) {
        c.sameGroupStreakCount += 1;
    } else {
        c.sameGroupStreakCount = 1;
        c.lastGroupHash = groupHash;
    }
    c.sameGroupExact15Count = Math.max(c.sameGroupExact15Count, c.sameGroupStreakCount);

    // Category
    const cat = matchLog.category;
    c.categoryRoundCounts = { ...c.categoryRoundCounts };
    c.categoryRoundCounts[cat] = (c.categoryRoundCounts[cat] || 0) + 1;
    c.favoriteCategoryMaxCount = Math.max(c.favoriteCategoryMaxCount, c.categoryRoundCounts[cat]);
    if (!c.distinctCategoriesPlayed.includes(cat)) {
        c.distinctCategoriesPlayed = [...c.distinctCategoriesPlayed, cat];
    }
    if (!c.distinctCategoriesInSession.includes(cat)) {
        c.distinctCategoriesInSession = [...c.distinctCategoriesInSession, cat];
    }
    c.diversityInSessionMax = Math.max(c.diversityInSessionMax, c.distinctCategoriesInSession.length);

    // Impostor tracking
    if (player.isImp) {
        c.impStreakCurrent += 1;
        c.impStreakMax = Math.max(c.impStreakMax, c.impStreakCurrent);

        if (vt > 0 && vt < 0.8) c.impFastRevealCount += 1;
        if (vt > 6) c.impSlowRevealCount += 1;

        if (matchLog.paranoiaLevel > 7) c.impWithParanoiaGt7Count += 1;

        // Co-impostor pairs
        const coImps = allPlayers.filter(p => p.isImp && p.name !== player.name);
        c.coImpostorPairs = { ...c.coImpostorPairs };
        for (const co of coImps) {
            c.coImpostorPairs[co.name] = (c.coImpostorPairs[co.name] || 0) + 1;
        }

        // Solo impostor
        const totalImps = allPlayers.filter(p => p.isImp).length;
        if (totalImps === 1) {
            c.soloImpostorWithNPlayers = [...(c.soloImpostorWithNPlayers || []), allPlayers.length];
        }
        if (totalImps >= 3) c.tripleImpostorCount += 1;

        // Konami + Impostor
        if (gameState.debugState.easterEggUnlocked) c.impAsKonamiCount += 1;
    } else {
        c.impStreakCurrent = 0;
        if (vt > 0 && vt < 0.8) c.civilFastRevealCount += 1;
    }

    // Troll events
    if (matchLog.isTroll) {
        c.trollEventCount += 1;
        if (matchLog.trollScenario === 'espejo_total') c.trollEspejoCount += 1;
        if (matchLog.trollScenario === 'civil_solitario') c.trollCivilSolitarioCount += 1;
        if (matchLog.trollScenario === 'falsa_alarma') c.trollFalseAlarmCount += 1;
        if (!player.isImp) c.civilInTrollCount += 1;
    }

    // Special roles
    if (player.isOracle) c.oracleCount += 1;
    if (player.oracleChosen) c.oracleConfirmedCount += 1;
    if (player.isVanguardia) c.vanguardiaCount += 1;
    if (player.isArchitect) c.architectCount += 1;
    if (player.isAlcalde) c.alcaldeCount += 1;
    if (player.isWitness) c.renunciaWitnessCount += 1;
    if (player.hasRejectedImpRole) c.renunciaActorCount += 1;
    if (player.wasTransferred) c.renunciaTransferReceivedCount += 1;
    if (player.isSiphoner) c.sifonInitiatorCount += 1;
    if (player.isSiphoned) c.sifonVictimCount += 1;

    // Protocols active
    let protocolCount = 0;
    const protocols: string[] = [];
    if (gameState.settings.hintMode) { protocolCount++; protocols.push('hints'); }
    if (matchLog.isTroll) { protocolCount++; protocols.push('troll'); }
    if (gameState.settings.partyMode) { protocolCount++; protocols.push('party'); }
    if (gameState.settings.memoryModeConfig?.enabled) { protocolCount++; protocols.push('memory'); }
    if (gameState.settings.oracleMode) { protocolCount++; protocols.push('oracle'); }
    if (gameState.settings.architectMode) { protocolCount++; protocols.push('architect'); }
    if (gameState.settings.protocolMagistrado) { protocolCount++; protocols.push('magistrado'); }
    if (gameState.settings.renunciaMode) { protocolCount++; protocols.push('renuncia'); }
    if (gameState.settings.useSifonMode) { protocolCount++; protocols.push('sifon'); }
    if (gameState.settings.usePrismaMode) { protocolCount++; protocols.push('prisma'); }
    if (gameState.settings.usePrismaLiteMode) { protocolCount++; protocols.push('prismaLite'); }
    if (gameState.settings.nexusMode) { protocolCount++; protocols.push('nexus'); }
    if (gameState.settings.vanguardiaMode) { protocolCount++; protocols.push('vanguardia'); }

    c.simultaneousProtocolsMax = Math.max(c.simultaneousProtocolsMax, protocolCount);
    for (const p of protocols) {
        if (!c.protocolsSeenDistinct.includes(p)) {
            c.protocolsSeenDistinct = [...c.protocolsSeenDistinct, p];
        }
    }

    // Special modes
    if (gameState.settings.memoryModeConfig?.enabled) c.memoryModeCount += 1;
    if (gameState.settings.memoryModeConfig?.enabled && ['hard', 'extreme'].includes(gameState.settings.memoryModeConfig.difficulty)) c.memoryHardCount += 1;
    if (gameState.settings.nexusMode) c.nexusActiveCount += 1;
    if (gameState.settings.partyMode) c.partyModeCount += 1;
    if (gameState.settings.explorerMode) c.explorerModeCount += 1;

    // Party intensity
    if (gameState.partyState.intensity === 'after_hours') c.partyAfterHoursCount += 1;
    if (gameState.partyState.intensity === 'resaca') c.partyResacaCount += 1;
    if (gameState.partyState.isHydrationLocked) c.hydrationLockedCount += 1;

    // Debug & entropy
    if (!gameState.debugState.isEnabled) c.roundsWithDebugOff += 1;
    if (gameState.debugState.isEnabled) c.debugModeCount += 1;
    if (matchLog.leteoGrade === 3) c.leteoGrade3Count += 1;
    if ((matchLog.entropyLevel || 0) >= 8) c.highEntropyCount += 1;
    if (matchLog.paranoiaLevel >= 9) c.highParanoiaCount += 1;
    if (matchLog.exhaustionWarning === 'critical') c.exhaustionCriticalCount += 1;

    // Konami
    if (gameState.debugState.easterEggUnlocked) c.konamiActivated = true;

    // Quarantine
    const vault = getVault(player.name.trim().toLowerCase(), gameState.history.playerStats);
    if (vault.metrics.quarantineRounds > 0) {
        c.quarantineCount += 1;
        c.roundsWithoutQuarantine = 0;
    } else {
        c.roundsWithoutQuarantine += 1;
    }

    return c;
}

// ============================================================
// MAIN EVALUATION ENGINE
// ============================================================
export function evaluateProgression(
    playerName: string,
    currentProg: PlayerProgression,
    vault: InfinityVault,
    matchLog: MatchLog,
    player: GamePlayer,
    gameState: GameState,
    allPlayers: GamePlayer[]
): { updatedProgression: PlayerProgression; unlocks: ProgressionUnlockEvent[] } {
    const unlocks: ProgressionUnlockEvent[] = [];

    // 1. Update counters
    const updatedCounters = updateCounters(currentProg.counters, player, matchLog, gameState, allPlayers);

    // 2. Calculate round XP
    const isNewCategory = !currentProg.counters.distinctCategoriesPlayed.includes(matchLog.category);
    const { total: roundXP, breakdown } = calculateRoundXP({
        participated: true,
        wasImpostor: player.isImp,
        isNewCategory,
        activeProtocolCount: updatedCounters.simultaneousProtocolsMax,
        civilStreak: vault.metrics.civilStreak,
        impStreak: updatedCounters.impStreakCurrent,
        wasAlcalde: !!player.isAlcalde,
        renunciaActivated: !!matchLog.renunciaTriggered,
        wasTrollEvent: matchLog.isTroll,
    }, currentProg.era);

    let totalXPGained = roundXP;

    // 3. Medal pass
    const newMedals = { ...currentProg.medals };
    for (const medal of MEDALS) {
        const { tier: newTier } = evaluateMedal(medal, updatedCounters, vault);
        const oldTier = newMedals[medal.id] || 'locked';
        const tierOrder: MedalTier[] = ['locked', 'bronze', 'silver', 'gold'];
        if (tierOrder.indexOf(newTier) > tierOrder.indexOf(oldTier)) {
            newMedals[medal.id] = newTier;
            const xp = newTier === 'gold' ? UNLOCK_XP.medal_gold : newTier === 'silver' ? UNLOCK_XP.medal_silver : UNLOCK_XP.medal_bronze;
            totalXPGained += xp;
            unlocks.push({
                type: 'medal_upgrade', id: medal.id, name: medal.name,
                description: `${medal.name} → ${newTier.toUpperCase()}`,
                xpGained: xp, tier: newTier, icon: '🏅'
            });
        }
    }

    // 4. Trophy pass
    const newTrophies = [...currentProg.trophies];
    for (const trophy of TROPHIES) {
        if (newTrophies.includes(trophy.id)) continue;
        const tmpProg = { ...currentProg, medals: newMedals, trophies: newTrophies, collectibles: currentProg.collectibles };
        if (trophy.evaluate(updatedCounters, vault, tmpProg)) {
            newTrophies.push(trophy.id);
            totalXPGained += trophy.xpReward;
            unlocks.push({
                type: 'trophy', id: trophy.id, name: trophy.name,
                description: trophy.name, xpGained: trophy.xpReward, icon: '🏆'
            });
        }
    }

    // 5. Collectible pass
    const newCollectibles = [...currentProg.collectibles];
    for (const col of COLLECTIBLES) {
        if (newCollectibles.includes(col.id)) continue;
        if (col.evaluate(updatedCounters, vault)) {
            newCollectibles.push(col.id);
            totalXPGained += UNLOCK_XP.collectible;
            unlocks.push({
                type: 'collectible', id: col.id, name: col.name,
                description: col.name, xpGained: UNLOCK_XP.collectible, icon: col.icon
            });
        }
    }

    // Check set completions
    const newCompletedSets = [...updatedCounters.completedCollectionIds];
    for (const set of SETS) {
        if (newCompletedSets.includes(set.id)) continue;
        if (set.collectibleIds.every(cid => newCollectibles.includes(cid))) {
            newCompletedSets.push(set.id);
            totalXPGained += set.bonusXP;
            unlocks.push({
                type: 'set_complete', id: set.id, name: set.name,
                description: `Set "${set.name}" completado`, xpGained: set.bonusXP, icon: '📦'
            });
        }
    }
    updatedCounters.completedCollectionIds = newCompletedSets;

    // 6. Apply XP and level up
    let newXP = currentProg.xp + totalXPGained;
    let newTotalXP = currentProg.totalXpAllTime + totalXPGained;
    let newLevel = currentProg.level;
    let newEra = currentProg.era;
    let newPrestige = currentProg.prestigeCount;
    let newLegacy = currentProg.legacyPoints || 0;

    if (newEra !== 'supremo') {
        const calculatedLevel = calculateLevel(newXP, newEra);
        if (calculatedLevel > newLevel) {
            newLevel = calculatedLevel;
            unlocks.push({
                type: 'level_up', id: `level_${newLevel}`, name: `Nivel ${newLevel}`,
                description: `Has alcanzado el nivel ${newLevel}`, xpGained: 0, icon: '⬆️'
            });
        }

        // Check prestige
        const maxLvl = getMaxLevel(newEra);
        if (newLevel >= maxLvl && maxLvl !== Infinity) {
            // Trigger prestige
            const nextEra = newEra === 'base' ? 'prestidigitacion'
                : newEra === 'prestidigitacion' ? 'prestidigitacion_elite'
                : 'supremo';

            newXP = 0;
            newLevel = nextEra === 'supremo' ? 0 : 1;
            newEra = nextEra;
            newPrestige += 1;
            unlocks.push({
                type: 'prestige', id: `prestige_${newPrestige}`, name: `Prestidigitación ${newPrestige === 1 ? '' : newPrestige === 2 ? 'Élite' : 'Suprema'}`,
                description: newEra === 'supremo'
                    ? 'Ya no hay más engaños que descubrir. Eres la máscara. Eres el sistema.'
                    : 'Has dominado la era. El verdadero engaño comienza ahora.',
                xpGained: 0, icon: '✦'
            });
        }
    } else {
        // Supremo: accumulate legacy points
        newLegacy = Math.floor(newTotalXP / 10000);
    }

    const newRank = getRank(newLevel, newEra);
    if (newRank.title !== currentProg.rank.title) {
        unlocks.push({
            type: 'rank_up', id: `rank_${newLevel}_${newEra}`, name: newRank.title,
            description: newRank.subtitle, xpGained: 0, icon: newRank.icon, color: newRank.color
        });
    }

    // Build XP log entries
    const newXPLog = [
        ...breakdown.map(b => ({ round: matchLog.round, amount: b.amount, reason: b.reason, timestamp: Date.now() })),
        ...currentProg.xpLog
    ].slice(0, 50);

    const updatedProgression: PlayerProgression = {
        ...currentProg,
        xp: newXP,
        totalXpAllTime: newTotalXP,
        level: newLevel,
        era: newEra,
        prestigeCount: newPrestige,
        rank: newRank,
        medals: newMedals,
        trophies: newTrophies,
        collectibles: newCollectibles,
        legacyPoints: newLegacy,
        lastSeenAt: Date.now(),
        xpLog: newXPLog,
        counters: updatedCounters,
    };

    return { updatedProgression, unlocks };
}
