export interface SelectionTelemetry {
    playerId: string;
    playerName: string;
    baseWeight: number;
    paranoiaAdjustment: number;
    synergyPenalty: number;
    finalWeight: number;
    probabilityPercent: number;
}

export type RenunciaDecision = 'pending' | 'accept' | 'reject' | 'transfer';
export type SifonDecision = 'pending' | 'sifon' | 'silence' | 'integrity';
export type PrismaDecision = 'pending' | 'overload' | 'eclipse';

export interface ThemeConfig {
    name: string;
    bg: string;
    cardBg: string;
    accent: string;
    text: string;
    sub: string;
    radius: string;
    font: string;
    border: string;
    particleType: 'aura' | 'silk' | 'stardust' | 'foliage' | 'aurora' | 'goldleaf' | 'plankton' | 'ember' | 'circle' | 'binary' | 'rain' | 'none';
    blur?: string;
    shadow?: string;
    particleColor?: string | string[];
    particleCount?: number;
    particleSpeed?: number;
    pulseInterval?: number;
}

export type ThemeName = 'aura' | 'luminous' | 'silk_soul' | 'nebula_dream' | 'crystal_garden' | 'aurora_borealis' | 'liquid_gold' | 'luminescent_ocean' | 'zen_sunset' | 'midnight' | 'bond' | 'turing' | 'solar' | 'illojuan' | 'obsidian' | 'cyber' | 'material' | 'zenith' | 'protocol' | 'ethereal' | 'terminal84' | 'soft' | 'noir' | 'paper' | 'space' | 'nightclub' | 'clean_dark' | 'clean_light';

export interface CuratedCollection {
    id: string;
    name: string;
    description: string;
    vibe: string;
    icon: string;
    categories: string[];
}

export interface Player {
    id: string;
    name: string;
    avatarIdx?: number;
}

export type SocialRole = 'civil' | 'bartender' | 'vip' | 'alguacil' | 'bufon';

export interface GamePlayer extends Player {
    role: 'Impostor' | 'Civil';
    word: string;
    realWord: string;
    isImp: boolean;
    category: string;
    areScore: number;
    impostorProbability: number;
    viewTime: number;
    isOracle?: boolean;
    isVanguardia?: boolean;
    oracleChosen?: boolean;
    oracleTriggered?: boolean;
    partyRole?: SocialRole;
    isArchitect?: boolean;
    isAlcalde?: boolean;
    nexusPartners?: string[];
    isWitness?: boolean;
    hasRejectedImpRole?: boolean;
    wasTransferred?: boolean;
    memoryWords?: string[];
    memoryCorrectIndex?: number;
    // SIFÓN
    isSiphoner?: boolean;
    isSiphoned?: boolean;
    leakedSifonHints?: string[];
    // PRISMA
    prismaChoice?: PrismaDecision;
    leakedPrismaHints?: string[];
    // PANDORA v2.0
    isGlitchy?: boolean;
    hasFakeNexus?: boolean;
}

export type PartyIntensity = 'aperitivo' | 'hora_punta' | 'after_hours' | 'resaca';

export interface InfinityVault {
    uid: string;
    metrics: {
        totalSessions: number;
        impostorRatio: number;
        civilStreak: number;
        totalImpostorWins: number;
        quarantineRounds: number;
        timesAsAlcalde?: number;
        alcaldeWinRate?: number;
        prismaActiveCount?: number;
        prismaOverloadCount?: number;
        prismaEclipseCount?: number;
        prismaEclipseWins?: number;
    };
    categoryDNA: Record<string, { timesAsImpostor: number; lastTimeAsImpostor: number; affinityScore: number }>;
    sequenceAnalytics: {
        lastImpostorPartners: string[];
        roleSequence: boolean[];
        averageWaitTime: number;
    };
}

export interface CategoryData {
    civ: string;
    imp: string;
    hints?: string[];
    hint?: string;
}

export interface OracleSetupData {
    oraclePlayerId: string;
    availableHints: string[];
    civilWord: string;
}

export interface RenunciaData {
    candidatePlayerId: string;
    originalImpostorIds: string[];
    decision: RenunciaDecision;
    timestamp: number;
    witnessPlayerId?: string;
    transferredToId?: string;
    hasSeenInitialRole?: boolean;
}

export interface SifonData {
    activePlayerId: string;
    decision: SifonDecision;
    leakedHints: string[];
    siphonedImpostorsIds: string[];
    timestamp?: number;
}

export interface PrismaData {
    activePlayerId: string;
    decision: PrismaDecision;
    leakedHints: string[];
    timestamp?: number;
}

export interface MagistradoData {
    alcaldePlayerId: string;
    alcaldePlayerName: string;
    sessionStartTime: number;
    telemetry?: {
        wasRevealed: boolean;
    };
}

export interface MatchLog {
    id: string;
    timestamp: number;
    round: number;
    category: string;
    winner?: 'civilians' | 'impostors';
    word: string;
    impostors: string[];
    civilians: string[];
    isTroll: boolean;
    trollScenario: string | null;
    paranoiaLevel: number;
    breakProtocol: string | null;
    architect: string | null;
    oracle?: string | null;
    leteoGrade?: 0 | 1 | 2 | 3;
    entropyLevel?: number;
    telemetry?: SelectionTelemetry[];
    affectsINFINITUM?: boolean;
    renunciaTriggered?: boolean;
    renunciaDecision?: RenunciaDecision;
    renunciaWitness?: string;
    renunciaTelemetry?: {
        finalProbability: number;
        karmaBonus: number;
        sessionBonus: number;
        failureBonus: number;
        candidateStreak: number;
    };
    magistrado?: string;
    categorySelectionTelemetry?: {
        candidateCategories: string[];
        weights: Record<string, number>;
        finalProbabilities: Record<string, number>;
        selectionReason: string;
    };
    exhaustionWarning?: 'none' | 'medium' | 'high' | 'critical';
    categoryExhaustionRate?: number;
    sifonTriggered?: boolean;
    sifonDecision?: SifonDecision;
    sifonSiphoner?: string;
    sifonVictims?: string[];
    prismaTriggered?: boolean;
    prismaDecision?: PrismaDecision;
    prismaExposureCount?: number;
}

export type TrollScenario = 'espejo_total' | 'civil_solitario' | 'falsa_alarma';

export type MemoryDifficulty = 'easy' | 'normal' | 'hard' | 'extreme';

export interface MemoryModeConfig {
    enabled: boolean;
    difficulty: MemoryDifficulty;
    displayTime: number;
    wordCount: number;
    highlightIntensity: number;
}

export interface CategoryExhaustionData {
    usedWords: string[];
    totalWords: number;
    lastReset: number;
    cycleCount: number;
}

export interface CategoryUsageStats {
    totalTimesSelected: number;
    lastSelectedRound: number;
    averageWordsPerSelection: number;
    exhaustionRate: number;
}

export interface GameState {
    phase: 'setup' | 'revealing' | 'architect' | 'oracle' | 'discussion' | 'results';
    players: Player[];
    gameData: GamePlayer[];
    impostorCount: number;
    currentPlayerIndex: number;
    startingPlayer: string;
    isTrollEvent: boolean;
    trollScenario: TrollScenario | null;
    isArchitectRound: boolean;
    history: {
        roundCounter: number;
        lastWords: string[];
        lastCategories: string[];
        globalWordUsage: Record<string, number>;
        categoryExhaustion?: Record<string, CategoryExhaustionData>;
        categoryUsageStats?: Record<string, CategoryUsageStats>;
        playerStats: Record<string, InfinityVault>;
        lastTrollRound: number;
        lastArchitectRound: number;
        lastStartingPlayers: string[];
        lastBartenders: string[];
        pastImpostorIds: string[];
        paranoiaLevel: number;
        coolingDownRounds: number;
        lastBreakProtocol: string | null;
        matchLogs: MatchLog[];
        lastLeteoRound?: number;
        rotationIndex?: number;
        temporaryBlacklist?: Record<string, number>;
        explorerDeck?: string[];
        // PANDORA v2.0
        roundStartTime?: number;
        setupStartTime?: number;
        lastRoundDurations?: number[];
        lastSetupDuration?: number;
        consecutiveNormalRounds?: number;
        usedTrollHints?: string[];
    };
    settings: {
        hintMode: boolean;
        trollMode: boolean;
        partyMode: boolean;
        architectMode: boolean;
        oracleMode: boolean;
        vanguardiaMode: boolean;
        nexusMode: boolean;
        passPhoneMode: boolean;
        shuffleEnabled: boolean;
        impostorEffects: boolean;
        revealMethod: 'hold' | 'swipe';
        swipeSensitivity: 'low' | 'medium' | 'high';
        holdRevealSpeed: 'low' | 'medium' | 'high';
        hapticFeedback: boolean;
        soundEnabled: boolean;
        selectedCategories: string[];
        renunciaMode: boolean;
        protocolMagistrado: boolean;
        magistradoMinPlayers: number;
        memoryModeConfig: MemoryModeConfig;
        categoryRepetitionAvoidance: 'none' | 'soft' | 'medium' | 'hard';
        rareCategoryBoost: boolean;
        rotationMode?: boolean;
        favoriteCategories?: string[];
        explorerMode?: boolean;
        /** Permite revisar la carta en pantalla de resultados */
        allowReReveal: boolean;
        /** Modo rendimiento optimizado para hardware mid-range (e.g. OnePlus 9) */
        performanceMode: boolean;
        /** Protocolo SIFÓN: dilema del prisionero asimétrico entre impostores */
        useSifonMode: boolean;
        /** Protocolo PRISMA: dilema del infiltrado solitario */
        usePrismaMode: boolean;
        /** Modo layout organizado por pestañas inferiores (estilo iOS) */
        useTabbedLayout: boolean;
        /** Silenciar popups de subida de nivel y desbloqueos */
        disableUnlockPopups: boolean;
    };
    debugState: {
        isEnabled: boolean;
        forceTroll: TrollScenario | null;
        forceArchitect: boolean;
        forceRenuncia?: boolean;
        forceSifon?: boolean;
        forcePrisma?: boolean;
        forceBreakProtocol?: 'pandora' | 'mirror' | 'blind' | 'leteo' | null;
        godModeAssignments?: Record<string, string>;
        easterEggUnlocked?: boolean;
    };
    partyState: {
        intensity: PartyIntensity;
        consecutiveHardcoreRounds: number;
        isHydrationLocked: boolean;
    };
    currentDrinkingPrompt: string;
    theme: ThemeName;
    oracleSetup?: OracleSetupData;
    renunciaData?: RenunciaData;
    sifonData?: SifonData;
    magistradoData?: MagistradoData;
    prismaData?: PrismaData;
}

export interface CategoryPreset {
    id: string;
    name: string;
    emoji: string;
    categories: string[];
    createdAt: number;
}

export interface SettingsPreset {
    id: string;
    name: string;
    settings: GameState['settings'];
    createdAt: number;
}

// ============================================================
// PROGRESSION SYSTEM
// ============================================================

export type ProgressionEra = 'base' | 'prestidigitacion' | 'prestidigitacion_elite' | 'supremo';
export type MedalTier = 'locked' | 'bronze' | 'silver' | 'gold';

export interface XPLogEntry {
    round: number;
    amount: number;
    reason: string;
    timestamp: number;
}

export interface RankDefinition {
    title: string;
    subtitle: string;
    era: string;
    color: string;
    icon: string;
    glow?: boolean;
    special?: string; // 'shimmer' | 'aurora' | 'pulse' | 'rainbow' | 'iridescent' | 'holographic'
}

export interface PlayerProgression {
    uid: string;
    xp: number;
    totalXpAllTime: number;
    level: number;
    era: ProgressionEra;
    prestigeCount: number;
    rank: RankDefinition;
    medals: Record<string, MedalTier>;
    trophies: string[];
    collectibles: string[];
    supremoTitle?: string;
    legacyPoints?: number;
    firstSeenAt: number;
    lastSeenAt: number;
    xpLog: XPLogEntry[];
    counters: ProgressionCounters;
}

export interface ProgressionCounters {
    // A — Presencia
    consecutiveRoundsInSession: number;
    sessionsPlayed: number;
    timesFirstInList: number;
    timesLastReveal: number;
    sameGroupStreakCount: number;
    lastGroupHash: string;
    fastRevealCount: number;
    slowRevealCount: number;
    timesNotStarter: number;
    timesStarter: number;
    protocolsSeenDistinct: string[];
    explorerModeCount: number;
    // B — Impostor
    impStreakCurrent: number;
    impStreakMax: number;
    coImpostorPairs: Record<string, number>;
    renunciaActorCount: number;
    renunciaAcceptCount: number;
    renunciaRejectCount: number;
    renunciaWitnessCount: number;
    renunciaTransferReceivedCount: number;
    sifonInitiatorCount: number;
    sifonVictimCount: number;
    sifonSilenceVictimCount: number;
    impWithParanoiaGt7Count: number;
    impFastRevealCount: number;
    impSlowRevealCount: number;
    // C — Civil
    oracleCount: number;
    oracleConfirmedCount: number;
    vanguardiaCount: number;
    architectCount: number;
    alcaldeCount: number;
    memoryModeCount: number;
    memoryHardCount: number;
    nexusActiveCount: number;
    civilInTrollCount: number;
    civilFastRevealCount: number;
    // D — Categorías
    categoryRoundCounts: Record<string, number>;
    distinctCategoriesPlayed: string[];
    distinctCategoriesInSession: string[];
    exhaustionCriticalCount: number;
    repeatedWordCount: number;
    // E — Eventos
    trollEventCount: number;
    trollEspejoCount: number;
    trollCivilSolitarioCount: number;
    trollFalseAlarmCount: number;
    highEntropyCount: number;
    highParanoiaCount: number;
    quarantineCount: number;
    roundsWithoutQuarantine: number;
    partyModeCount: number;
    partyAfterHoursCount: number;
    partyResacaCount: number;
    hydrationLockedCount: number;
    debugModeCount: number;
    leteoGrade3Count: number;
    konamiActivated: boolean;
    nightRoundCount: number;
    morningRoundCount: number;
    themeRoundCounts: Record<string, number>;
    soloImpostorWithNPlayers: number[];
    tripleImpostorCount: number;
    simultaneousProtocolsMax: number;
    prismaChoiceCount: number;
    totalViewTimeSeconds: number;
    viewTimesLast10: number[];
    normalSuspicionStreakCount: number;
    slowSuspicionCount: number;
    fastSuspicionCount: number;
    sameGroupExact15Count: number;
    rotationCompleteCount: number;
    roundsWithDebugOff: number;
    impAsKonamiCount: number;
    maxPlayersInRound: number;
    roundsInDay: number;
    completedCollectionIds: string[];
    favoriteCategoryMaxCount: number;
    diversityInSessionMax: number;
}

export interface ProgressionUnlockEvent {
    type: 'medal_upgrade' | 'trophy' | 'collectible' | 'set_complete' | 'level_up' | 'rank_up' | 'prestige';
    id: string;
    name: string;
    description?: string;
    xpGained: number;
    tier?: MedalTier;
    icon?: string;
    color?: string;
}
