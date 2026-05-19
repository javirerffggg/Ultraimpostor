import { PlayerProgression, ProgressionCounters } from '../../types';

const STORAGE_KEY = 'impostor_progression_v1';

export function createDefaultCounters(): ProgressionCounters {
    return {
        consecutiveRoundsInSession: 0, sessionsPlayed: 0, timesFirstInList: 0, timesLastReveal: 0,
        sameGroupStreakCount: 0, lastGroupHash: '', fastRevealCount: 0, slowRevealCount: 0,
        timesNotStarter: 0, timesStarter: 0, protocolsSeenDistinct: [], explorerModeCount: 0,
        impStreakCurrent: 0, impStreakMax: 0, coImpostorPairs: {},
        renunciaActorCount: 0, renunciaAcceptCount: 0, renunciaRejectCount: 0,
        renunciaWitnessCount: 0, renunciaTransferReceivedCount: 0,
        sifonInitiatorCount: 0, sifonVictimCount: 0, sifonSilenceVictimCount: 0,
        impWithParanoiaGt7Count: 0, impFastRevealCount: 0, impSlowRevealCount: 0,
        oracleCount: 0, oracleConfirmedCount: 0, vanguardiaCount: 0, architectCount: 0,
        alcaldeCount: 0, memoryModeCount: 0, memoryHardCount: 0, nexusActiveCount: 0,
        civilInTrollCount: 0, civilFastRevealCount: 0,
        categoryRoundCounts: {}, distinctCategoriesPlayed: [], distinctCategoriesInSession: [],
        exhaustionCriticalCount: 0, repeatedWordCount: 0,
        trollEventCount: 0, trollEspejoCount: 0, trollCivilSolitarioCount: 0, trollFalseAlarmCount: 0,
        highEntropyCount: 0, highParanoiaCount: 0, quarantineCount: 0, roundsWithoutQuarantine: 0,
        partyModeCount: 0, partyAfterHoursCount: 0, partyResacaCount: 0, hydrationLockedCount: 0,
        debugModeCount: 0, leteoGrade3Count: 0, konamiActivated: false,
        nightRoundCount: 0, morningRoundCount: 0, themeRoundCounts: {},
        soloImpostorWithNPlayers: [], tripleImpostorCount: 0, simultaneousProtocolsMax: 0,
        prismaChoiceCount: 0, totalViewTimeSeconds: 0, viewTimesLast10: [],
        normalSuspicionStreakCount: 0, slowSuspicionCount: 0, fastSuspicionCount: 0,
        sameGroupExact15Count: 0, rotationCompleteCount: 0, roundsWithDebugOff: 0,
        impAsKonamiCount: 0, maxPlayersInRound: 0, roundsInDay: 0,
        completedCollectionIds: [], favoriteCategoryMaxCount: 0, diversityInSessionMax: 0,
    };
}

export function createNewProgression(uid: string): PlayerProgression {
    return {
        uid,
        xp: 0,
        totalXpAllTime: 0,
        level: 1,
        era: 'base',
        prestigeCount: 0,
        rank: { title: '⬜ RECLUTA SIN NOMBRE', subtitle: 'Era Base · Nivel 1', era: 'Era Base', color: '#9ca3af', icon: '⬜' },
        medals: {},
        trophies: [],
        collectibles: [],
        firstSeenAt: Date.now(),
        lastSeenAt: Date.now(),
        xpLog: [],
        counters: createDefaultCounters(),
    };
}

export function loadAllProgressions(): Record<string, PlayerProgression> {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object') return parsed;
        }
    } catch (e) {
        console.error('Error loading progressions:', e);
    }
    return {};
}

export function saveAllProgressions(data: Record<string, PlayerProgression>): boolean {
    try {
        // Trim xpLog to last 50 entries per player to save space
        const trimmed = { ...data };
        for (const uid of Object.keys(trimmed)) {
            if (trimmed[uid].xpLog && trimmed[uid].xpLog.length > 50) {
                trimmed[uid] = { ...trimmed[uid], xpLog: trimmed[uid].xpLog.slice(0, 50) };
            }
        }
        const serialized = JSON.stringify(trimmed);
        const sizeInMB = new Blob([serialized]).size / (1024 * 1024);
        if (sizeInMB > 4.5) {
            console.warn(`Progression data too large (${sizeInMB.toFixed(2)}MB). Trimming logs...`);
            for (const uid of Object.keys(trimmed)) {
                trimmed[uid] = { ...trimmed[uid], xpLog: trimmed[uid].xpLog.slice(0, 10) };
            }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        return true;
    } catch (e) {
        console.error('Error saving progressions:', e);
        return false;
    }
}

export function getProgression(uid: string, all?: Record<string, PlayerProgression>): PlayerProgression {
    const data = all || loadAllProgressions();
    return data[uid] || createNewProgression(uid);
}
