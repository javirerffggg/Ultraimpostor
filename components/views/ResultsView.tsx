import React, { useState, useEffect, useRef } from 'react';
import { GameState, ThemeConfig, RenunciaDecision, PlayerProgression } from '../../types';
import { Fingerprint, Unlock, Lock, Eye, AlertTriangle, Ghost, Clock, Beer, RotateCcw, Crown, Zap, Network, Menu, BatteryWarning, X, ChevronLeft, Smartphone, ArrowRight, Flame, Shield, Activity, FileText, Sparkles, Gamepad2, Compass } from 'lucide-react';
import { PLAYER_COLORS } from '../../constants';
import { RenunciaDecisionView } from '../RenunciaDecisionView';
import { PartyNotification } from '../PartyNotification';
import { SwipeRevealCard } from '../SwipeRevealCard';
import { MemoryRevealCard } from '../MemoryRevealCard';
import { IdentityCard } from '../IdentityCard';
import { getVault } from '../../utils/core/vault';
import { ProgressionBadge } from '../progression/ProgressionBadge';
import { PlayerProfileView } from '../progression/PlayerProfileView';

interface Props {
    gameState: GameState;
    theme: ThemeConfig;
    onBack: () => void;
    onReplay: () => void;
    currentPlayerColor: string;
    onNextPlayer: (viewTime: number) => void;
    onOracleConfirm: (hint: string) => void;
    onRenunciaDecision: (decision: RenunciaDecision) => void;
    onRenunciaRoleSeen: () => void;
    isExiting: boolean;
    transitionName?: string | null;
    getPlayerProgression?: (name: string) => PlayerProgression;
}

// --- SUB-COMPONENT: DIGIT FLIP TIMER ---
const DigitFlip: React.FC<{ value: number; theme: ThemeConfig }> = ({ value, theme }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isFlipping, setIsFlipping] = useState(false);
  
    useEffect(() => {
      if (value !== displayValue) {
        setIsFlipping(true);
        const timeout = setTimeout(() => {
          setDisplayValue(value);
          setIsFlipping(false);
        }, 300);
        return () => clearTimeout(timeout);
      }
    }, [value, displayValue]);
  
    return (
      <div 
        className="relative overflow-hidden rounded-xl sm:rounded-2xl"
        style={{
          width: 'clamp(2.5rem, 10vw, 4.5rem)',
          height: 'clamp(3.5rem, 14vw, 6rem)',
          backgroundColor: `${theme.cardBg}`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${theme.border}`,
          boxShadow: `0 10px 40px -10px ${theme.accent}20`
        }}
      >
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/30 z-10 shadow-[0_1px_0_rgba(255,255,255,0.1)]" />
        
        <div 
          className={`
            flex items-center justify-center h-full text-3xl sm:text-6xl font-black
            transition-all duration-300
            ${isFlipping ? 'animate-flip-out' : 'animate-flip-in'}
          `}
          style={{ 
            color: theme.text,
            fontFamily: "'JetBrains Mono', monospace",
            textShadow: `0 0 20px ${theme.accent}30, 0 2px 4px rgba(0,0,0,0.5)`
          }}
        >
          {displayValue}
        </div>
      </div>
    );
};

// --- SUB-COMPONENT: RE-REVEAL MODAL ---
const ReRevealModal: React.FC<{
    gameState: GameState;
    theme: ThemeConfig;
    onClose: () => void;
}> = ({ gameState, theme, onClose }) => {
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const selectedPlayer = selectedPlayerId
        ? gameState.gameData.find(p => p.id === selectedPlayerId) ?? null
        : null;
    const selectedPlayerColor = selectedPlayer
        ? PLAYER_COLORS[gameState.gameData.findIndex(p => p.id === selectedPlayerId) % PLAYER_COLORS.length]
        : '#ffffff';

    return (
        <div
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}
        >
            <div className="absolute inset-0" onClick={onClose} />

            <div
                className="relative z-10 w-full max-w-sm mx-4 rounded-3xl overflow-hidden animate-in zoom-in-95 fade-in duration-300"
                style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
            >
                <div
                    className="flex items-center justify-between px-5 py-4 border-b"
                    style={{ borderColor: `${theme.border}50` }}
                >
                    {selectedPlayer ? (
                        <button
                            onClick={() => setSelectedPlayerId(null)}
                            className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity active:scale-95"
                            style={{ color: theme.text }}
                            aria-label="Volver a la lista"
                        >
                            <ChevronLeft size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">Volver</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Eye size={16} style={{ color: theme.accent }} />
                            <span className="text-sm font-black uppercase tracking-wider" style={{ color: theme.text }}>
                                Consulta de Rol
                            </span>
                        </div>
                    )}
                    {!selectedPlayer && (
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all"
                            style={{ color: theme.sub }}
                            aria-label="Cerrar"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {selectedPlayer ? (
                    <div className="p-5 flex flex-col items-center gap-4">
                        <IdentityCard
                            player={selectedPlayer}
                            theme={theme}
                            color={selectedPlayerColor}
                            onRevealStart={() => {}}
                            onRevealEnd={() => {}}
                            nextAction={() => {}}
                            readyForNext={false}
                            isLastPlayer={false}
                            isParty={false}
                            partyIntensity="aperitivo"
                            debugMode={false}
                            onOracleConfirm={() => {}}
                            impostorEffectsEnabled={gameState.settings.impostorEffects}
                            revealSpeed={gameState.settings.holdRevealSpeed}
                        />
                        <p
                            className="text-[10px] font-mono uppercase tracking-widest opacity-50 text-center"
                            style={{ color: theme.sub }}
                        >
                            Solo lectura · No avanza turno
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full mt-1 py-3 px-6 rounded-2xl font-black uppercase tracking-wider text-xs transition-all duration-300 active:scale-95 border"
                            style={{
                                backgroundColor: theme.accent,
                                color: '#ffffff',
                                borderColor: 'rgba(255,255,255,0.1)',
                                boxShadow: `0 8px 30px -6px ${theme.accent}50`
                            }}
                        >
                            Ya he revisado mi rol
                        </button>
                    </div>
                ) : (
                    <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                        <p
                            className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-3 px-1"
                            style={{ color: theme.sub }}
                        >
                            Elige tu nombre para ver tu carta
                        </p>
                        {gameState.gameData.map((player, idx) => {
                            const color = PLAYER_COLORS[idx % PLAYER_COLORS.length];
                            return (
                                <button
                                    key={player.id}
                                    onClick={() => setSelectedPlayerId(player.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all active:scale-[0.98] hover:bg-white/5"
                                    style={{
                                        borderColor: `${theme.border}60`,
                                        backgroundColor: 'transparent'
                                    }}
                                >
                                    <div
                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}80` }}
                                    />
                                    <span className="text-sm font-bold text-left flex-1" style={{ color: theme.text }}>
                                        {player.name}
                                    </span>
                                    <Eye size={14} style={{ color: theme.sub }} className="opacity-40" />
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export const ResultsView: React.FC<Props> = ({ gameState, theme, onBack, onReplay, currentPlayerColor, onNextPlayer, onOracleConfirm, onRenunciaDecision, onRenunciaRoleSeen, isExiting, transitionName, getPlayerProgression }) => {
    const impostors = gameState.gameData.filter(p => p.isImp);
    const civilWord = gameState.gameData.find(p => !p.isImp)?.realWord || "???";
    const isTroll = gameState.isTrollEvent;
    const trollScenario = gameState.trollScenario;
    const isParty = gameState.settings.partyMode;
    const lastLog = gameState.history.matchLogs[0] || {};
    
    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const activeProtocols: { name: string; icon: React.ReactNode }[] = [];
    if (gameState.settings.hintMode) activeProtocols.push({ name: 'Pistas', icon: <Compass size={12} /> });
    if (gameState.settings.trollMode && isTroll) activeProtocols.push({ name: 'Troll', icon: <Ghost size={12} /> });
    if (gameState.settings.partyMode) activeProtocols.push({ name: 'Fiesta', icon: <Beer size={12} /> });
    if (gameState.settings.memoryModeConfig?.enabled) activeProtocols.push({ name: 'Memoria', icon: <Activity size={12} /> });
    if (gameState.settings.architectMode && gameState.gameData.some(p => p.isArchitect)) activeProtocols.push({ name: 'Arquitecto', icon: <FileText size={12} /> });
    if (gameState.settings.protocolMagistrado && gameState.gameData.some(p => p.isAlcalde)) activeProtocols.push({ name: 'Magistrado', icon: <Crown size={12} /> });
    if (gameState.settings.renunciaMode && gameState.gameData.some(p => p.hasRejectedImpRole)) activeProtocols.push({ name: 'Renuncia', icon: <AlertTriangle size={12} /> });
    if (gameState.settings.useSifonMode && (gameState.gameData.some(p => p.isSiphoner) || lastLog.sifonTriggered)) activeProtocols.push({ name: 'Sifón', icon: <Network size={12} /> });
    if (gameState.settings.usePrismaMode && (gameState.gameData.some(p => p.prismaChoice) || lastLog.prismaTriggered)) activeProtocols.push({ name: 'Prisma', icon: <Sparkles size={12} /> });
    if (gameState.settings.nexusMode) activeProtocols.push({ name: 'Nexus', icon: <Zap size={12} /> });
    if (gameState.settings.oracleMode && gameState.gameData.some(p => p.isOracle)) activeProtocols.push({ name: 'Oráculo', icon: <Eye size={12} /> });
    if (gameState.settings.vanguardiaMode && gameState.gameData.some(p => p.isVanguardia)) activeProtocols.push({ name: 'Vanguardia', icon: <Flame size={12} /> });

    const allViewTimes = gameState.gameData.map(p => p.viewTime || 0);
    const avgViewTime = allViewTimes.reduce((a, b) => a + b, 0) / (allViewTimes.length || 1);

    const getSuspicionLevel = (time: number): { label: string, color: string, dotColor: string } => {
        if (time === 0) return { label: "-", color: theme.sub, dotColor: 'bg-gray-500' };
        if (time > avgViewTime * 1.5) return { label: "Lento", color: '#fbbf24', dotColor: 'bg-amber-400' };
        if (time < avgViewTime * 0.5) return { label: "Rápido", color: '#f87171', dotColor: 'bg-red-400' };
        return { label: "Normal", color: theme.sub, dotColor: 'bg-emerald-400' };
    };
    
    const [isDecrypted, setIsDecrypted] = useState(false);
    const [isHoldingDecrypt, setIsHoldingDecrypt] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const frozenTimerRef = useRef(0);
    const [showMenuConfirm, setShowMenuConfirm] = useState(false);
    const confirmTimeoutRef = useRef<number | null>(null);
    const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);
    const [showReReveal, setShowReReveal] = useState(false);
    const [profileViewPlayer, setProfileViewPlayer] = useState<string | null>(null);

    const holdTimeoutRef = useRef<number | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        if (isDecrypted) return;
        setIsHoldingDecrypt(true);
        if (navigator.vibrate) navigator.vibrate(15);

        if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = window.setTimeout(() => {
            setIsDecrypted(true);
            if (navigator.vibrate) navigator.vibrate([50, 50, 200]);
        }, 1500);
    };

    const handlePointerUpOrLeave = (e: React.PointerEvent) => {
        e.preventDefault();
        setIsHoldingDecrypt(false);
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
            holdTimeoutRef.current = null;
        }
    };

    useEffect(() => {
        if (isDecrypted) return;
        const interval = setInterval(() => {
            setTimerSeconds(s => {
                frozenTimerRef.current = s + 1;
                return s + 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isDecrypted]);

    const handleMenuClick = (e: React.MouseEvent | React.PointerEvent) => {
        e.preventDefault();
        if (showMenuConfirm) {
            if (navigator.vibrate) navigator.vibrate(50);
            onBack();
        } else {
            if (navigator.vibrate) navigator.vibrate(20);
            setShowMenuConfirm(true);
            if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
            confirmTimeoutRef.current = window.setTimeout(() => {
                setShowMenuConfirm(false);
            }, 3000);
        }
    };

    useEffect(() => {
        return () => {
            if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
        };
    }, []);

    // --- RENDER: PRE-REVEAL (DEBATE PHASE) ---
    if (!isDecrypted) {
        return (
            <div className="flex flex-col h-full items-center justify-between relative z-10 animate-in fade-in duration-700 bg-black/20">

                {/* RE-REVEAL MODAL — available during debate phase */}
                {showReReveal && (
                    <ReRevealModal
                        gameState={gameState}
                        theme={theme}
                        onClose={() => setShowReReveal(false)}
                    />
                )}

                {/* FLOATING RE-REVEAL BUTTON — debate phase */}
                {gameState.settings.allowReReveal && (
                    <button
                        onClick={() => { setShowReReveal(true); if (navigator.vibrate) navigator.vibrate(20); }}
                        className="fixed bottom-6 right-4 z-[150] flex items-center gap-2 px-4 py-3 rounded-2xl border shadow-xl active:scale-95 transition-all duration-200 animate-in fade-in slide-in-from-bottom-4"
                        style={{
                            backgroundColor: `${theme.cardBg}E0`,
                            backdropFilter: 'blur(16px)',
                            borderColor: `${theme.accent}60`,
                            boxShadow: `0 8px 32px -8px ${theme.accent}40`
                        }}
                        aria-label="Consultar rol"
                    >
                        <Eye size={16} style={{ color: theme.accent }} />
                        <span className="text-xs font-black uppercase tracking-wider" style={{ color: theme.text }}>
                            Revisar Rol
                        </span>
                    </button>
                )}

                <header className="absolute top-0 left-0 right-0 z-30 pt-[calc(0.5rem+env(safe-area-inset-top))] px-4 sm:px-6">
                    <div 
                        className="flex items-center justify-between p-3 rounded-2xl backdrop-blur-2xl transition-all duration-500 animate-in slide-in-from-top"
                        style={{
                            backgroundColor: `${theme.cardBg}80`,
                            border: `1px solid ${theme.border}50`
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60" style={{ color: theme.sub }}>
                                    Ronda #{gameState.history.roundCounter}
                                </span>
                                <span className="text-xs sm:text-sm font-bold" style={{ color: theme.text }}>
                                    {gameState.players.length} Jugadores
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                            <div className="relative">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            </div>
                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-red-400">EN VIVO</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 w-full flex flex-col items-center justify-center gap-6 sm:gap-10 pt-20 px-4">
                    <div className="relative flex items-center justify-center gap-1 sm:gap-2 scale-90 sm:scale-100 transition-transform">
                        <DigitFlip value={Math.floor(timerSeconds / 60 / 10)} theme={theme} />
                        <DigitFlip value={Math.floor(timerSeconds / 60) % 10} theme={theme} />
                        <div className="flex flex-col gap-1.5 sm:gap-2 px-1">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }} />
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse delay-500" style={{ backgroundColor: theme.accent }} />
                        </div>
                        <DigitFlip value={Math.floor((timerSeconds % 60) / 10)} theme={theme} />
                        <DigitFlip value={(timerSeconds % 60) % 10} theme={theme} />
                    </div>

                    {/* NUEVO DISEÑO MINIMALISTA TIPOGRÁFICO */}
                    <div className="relative w-full max-w-sm sm:max-w-md flex flex-col items-center justify-center animate-in zoom-in-95 fade-in duration-500 my-8 sm:my-12">
                        <p className="text-sm font-black uppercase tracking-[0.2em] mb-3 animate-pulse" style={{ color: theme.accent }}>
                            Empieza a hablar
                        </p>
                        <h2 
                            className="text-6xl sm:text-7xl font-black uppercase leading-none tracking-tight text-center break-words w-full"
                            style={{ 
                                color: theme.text,
                                fontFamily: theme.font,
                                textShadow: `0 0 50px ${theme.accent}60, 0 4px 15px rgba(0,0,0,0.5)`
                            }}
                        >
                            {gameState.startingPlayer || "Nadie"}
                        </h2>
                        <p className="text-[10px] sm:text-xs opacity-60 uppercase tracking-widest mt-5 text-center" style={{ color: theme.sub }}>
                            Describe la palabra sin mencionarla
                        </p>
                        {isParty && (
                            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 animate-in zoom-in duration-300">
                                <Beer size={14} className="text-pink-400" />
                                <span className="text-xs font-black text-pink-400 uppercase tracking-wider">Shot al terminar</span>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-xs sm:max-w-sm pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                        <button
                            className="group relative w-full h-20 sm:h-24 rounded-3xl overflow-hidden touch-none select-none active:scale-[0.98] transition-transform"
                            onPointerDown={handlePointerDown}
                            onPointerUp={handlePointerUpOrLeave}
                            onPointerLeave={handlePointerUpOrLeave}
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            {/* Glassmorphic Background */}
                            <div 
                                className="absolute inset-0 transition-all duration-300"
                                style={{
                                    backgroundColor: isHoldingDecrypt ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                                    backdropFilter: 'blur(20px)',
                                    border: `1.5px solid ${isHoldingDecrypt ? theme.accent : `${theme.border}80`}`,
                                    borderRadius: '24px',
                                    boxShadow: isHoldingDecrypt 
                                        ? `0 0 50px -10px ${theme.accent}40, inset 0 0 12px ${theme.accent}15`
                                        : '0 8px 32px -8px rgba(0,0,0,0.3)'
                                }}
                            />

                            {/* GPU-Accelerated Progress Bar */}
                            <div 
                                className="absolute inset-0 origin-left transition-transform"
                                style={{
                                    transform: isHoldingDecrypt ? 'scaleX(1)' : 'scaleX(0)',
                                    transition: isHoldingDecrypt ? 'transform 1500ms linear' : 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                                    background: `linear-gradient(90deg, ${theme.accent}30, ${theme.accent}80)`,
                                    borderRadius: '24px'
                                }}
                            />

                            {/* Content Layer */}
                            <div className="relative z-10 h-full flex items-center px-5 sm:px-6">
                                <div className={`relative flex items-center justify-center transition-all duration-500 ${isHoldingDecrypt ? 'scale-105 rotate-90' : 'scale-100 rotate-0'}`} style={{ width: '3rem', height: '3rem' }}>
                                    <div 
                                        className="absolute inset-0 rounded-full border-2 transition-all duration-500"
                                        style={{ 
                                            borderColor: isHoldingDecrypt ? theme.accent : 'rgba(255,255,255,0.15)',
                                            transform: isHoldingDecrypt ? 'scale(1.1)' : 'scale(1)'
                                        }}
                                    />
                                    <div 
                                        className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                                        style={{
                                            backgroundColor: isHoldingDecrypt ? 'white' : 'rgba(255,255,255,0.08)',
                                            color: isHoldingDecrypt ? 'black' : 'white'
                                        }}
                                    >
                                        <Sparkles size={18} className={isHoldingDecrypt ? 'text-black animate-pulse' : 'text-white'} />
                                    </div>
                                </div>

                                <div className="flex-1 ml-5 text-left">
                                    <span 
                                        className="block font-black uppercase tracking-[0.25em] text-xs sm:text-sm transition-all duration-300"
                                        style={{ 
                                            color: theme.text,
                                            textShadow: isHoldingDecrypt ? `0 0 15px ${theme.accent}50` : 'none'
                                        }}
                                    >
                                        {isHoldingDecrypt ? "Revelando..." : "Mantener pulsado"}
                                    </span>
                                    <span 
                                        className="block text-[9px] uppercase tracking-wider mt-0.5 opacity-60 font-semibold"
                                        style={{ color: theme.sub }}
                                    >
                                        {isHoldingDecrypt ? "Analizando registros..." : "Para ver resultados"}
                                    </span>
                                </div>

                                <div className="mr-2">
                                    <ArrowRight 
                                        size={18} 
                                        style={{ color: theme.sub }} 
                                        className={`transition-all duration-500 ${isHoldingDecrypt ? 'translate-x-1 opacity-100 text-white' : 'translate-x-0 opacity-40'}`} 
                                    />
                                </div>
                            </div>
                        </button>
                        <div className="mt-3 text-center transition-opacity duration-300" style={{ opacity: isHoldingDecrypt ? 0 : 0.4 }}>
                            <span className="text-[8px] font-mono uppercase tracking-widest" style={{ color: theme.sub }}>
                                El veredicto de la ronda es confidencial
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: RESULTS ---
    return (
        <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col min-h-full w-full items-center p-6 pb-6 animate-in slide-in-from-bottom duration-700 relative z-10 pt-[calc(1.5rem+env(safe-area-inset-top))]">

            {/* 1. HERO SECTION: THE WORD */}
            <div className="w-full max-w-sm mb-10 mt-4 text-center relative group">
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[80px] rounded-full pointer-events-none opacity-20 transition-opacity duration-1000 group-hover:opacity-40"
                    style={{ backgroundColor: theme.accent }}
                />
                <p style={{ color: theme.sub }} className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">
                    {isTroll ? "ERROR DE SISTEMA" : "LA PALABRA SECRETA ERA"}
                </p>
                <h1 
                    className="text-5xl md:text-6xl font-black uppercase break-words leading-[0.9] tracking-tight relative z-10 drop-shadow-2xl"
                    style={{ 
                        color: isTroll ? '#ef4444' : theme.text,
                        background: isTroll ? 'none' : `linear-gradient(180deg, ${theme.text} 20%, ${theme.accent} 100%)`,
                        WebkitBackgroundClip: isTroll ? 'none' : 'text',
                        WebkitTextFillColor: isTroll ? '#ef4444' : 'transparent',
                    }}
                >
                    {isTroll ? (
                        <span className="glitch-text-anim" data-text="SABOTAJE">SABOTAJE</span>
                    ) : (
                        civilWord
                    )}
                </h1>
                {!isTroll && (
                    <div className="h-1 w-12 mx-auto mt-6 rounded-full opacity-50" style={{ backgroundColor: theme.accent }} />
                )}
            </div>

            {/* RESUMEN DE LA MISIÓN */}
            <div 
                className="w-full max-w-sm p-5 border rounded-3xl mb-6"
                style={{ 
                    backgroundColor: `${theme.cardBg}F0`, 
                    borderColor: theme.border,
                    boxShadow: '0 4px 24px -8px rgba(0,0,0,0.2)'
                }}
            >
                <div className="flex items-center gap-2 mb-4">
                    <Compass size={16} style={{ color: theme.accent }} />
                    <h3 className="text-xs font-black uppercase tracking-[0.25em]" style={{ color: theme.sub }}>Resumen de la Misión</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-xl p-3 border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: `${theme.border}40` }}>
                        <span className="text-[8px] font-mono uppercase opacity-60 block mb-1 tracking-wider" style={{ color: theme.sub }}>Categoría</span>
                        <span className="text-xs font-black truncate block" style={{ color: theme.text }}>
                            {lastLog.category || 'Aleatoria'}
                        </span>
                    </div>
                    <div className="rounded-xl p-3 border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: `${theme.border}40` }}>
                        <span className="text-[8px] font-mono uppercase opacity-60 block mb-1 tracking-wider" style={{ color: theme.sub }}>Tiempo de debate</span>
                        <span className="text-xs font-black block" style={{ color: theme.text }}>
                            {formatTime(frozenTimerRef.current || timerSeconds)}
                        </span>
                    </div>
                    <div className="rounded-xl p-3 border col-span-2 flex items-center justify-between" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: `${theme.border}40` }}>
                        <div>
                            <span className="text-[8px] font-mono uppercase opacity-60 block mb-1 tracking-wider" style={{ color: theme.sub }}>Iniciador de debate</span>
                            <span className="text-xs font-black block" style={{ color: theme.text }}>
                                {gameState.startingPlayer ? gameState.startingPlayer : 'Nadie'}
                            </span>
                        </div>
                        <span className="text-lg opacity-80">🗣️</span>
                    </div>
                </div>

                {activeProtocols.length > 0 && (
                    <div className="border-t border-white/5 pt-3">
                        <span className="text-[8px] font-mono uppercase opacity-55 block mb-2" style={{ color: theme.sub }}>Protocolos activos</span>
                        <div className="flex flex-wrap gap-1.5">
                            {activeProtocols.map((p, pIdx) => (
                                <div 
                                    key={pIdx} 
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border"
                                    style={{ 
                                        backgroundColor: `${theme.accent}10`, 
                                        borderColor: `${theme.accent}30`, 
                                        color: theme.accent 
                                    }}
                                >
                                    {p.icon}
                                    <span>{p.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* CATEGORY EXHAUSTION WARNING */}
            {lastLog.exhaustionWarning && lastLog.exhaustionWarning !== 'none' && !isTroll && (
                <div className={`w-full max-w-sm mb-6 p-3 rounded-xl border flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top duration-500 ${
                    lastLog.exhaustionWarning === 'critical' ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'
                }`}>
                    <BatteryWarning size={18} className={lastLog.exhaustionWarning === 'critical' ? 'text-red-400 animate-pulse' : 'text-amber-400'} />
                    <div className="flex-1">
                        <p className={`text-[10px] font-black uppercase tracking-wide ${lastLog.exhaustionWarning === 'critical' ? 'text-red-300' : 'text-amber-300'}`}>
                            {lastLog.exhaustionWarning === 'critical' ? 'CATEGORÍA AGOTADA' : 'RESERVAS BAJAS'}
                        </p>
                        <p className={`text-[9px] leading-tight opacity-80 ${lastLog.exhaustionWarning === 'critical' ? 'text-red-200' : 'text-amber-200'}`}>
                            Has usado el {Math.round((lastLog.categoryExhaustionRate || 0) * 100)}% de palabras en "{lastLog.category}". Añade más categorías para mantener la variedad.
                        </p>
                    </div>
                </div>
            )}

            {/* TROLL EVENT BANNER */}
            {isTroll && (
                <div 
                    className="relative overflow-hidden rounded-2xl border-2 p-5 animate-in fade-in slide-in-from-top duration-700 w-full max-w-sm mb-6"
                    style={{
                        borderColor: theme.accent,
                        background: `linear-gradient(135deg, ${theme.accent}15, ${theme.cardBg})`,
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    <div 
                        className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{
                            backgroundImage: `repeating-linear-gradient(45deg, ${theme.accent}40, ${theme.accent}40 10px, transparent 10px, transparent 20px)`
                        }}
                    />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="text-3xl animate-pulse" style={{ filter: `drop-shadow(0 0 10px ${theme.accent})` }}>🎭</div>
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-wider" style={{ color: theme.accent, textShadow: `0 0 20px ${theme.accent}40` }}>
                                    Protocolo PANDORA
                                </h3>
                                <p className="text-[10px] font-mono opacity-60 uppercase tracking-widest" style={{ color: theme.sub }}>Evento especial activado</p>
                            </div>
                        </div>
                        {trollScenario && (
                            <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
                                {trollScenario}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* 2. IMPOSTORS REVEAL */}
            <div className="w-full max-w-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Ghost size={16} style={{ color: theme.accent }} className="opacity-70" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60" style={{ color: theme.sub }}>
                        {impostors.length === 1 ? 'El Impostor era' : 'Los Impostores eran'}
                    </span>
                    <div className="h-px flex-1 opacity-20" style={{ backgroundColor: theme.border }} />
                </div>
                <div className="space-y-3">
                    {impostors.map((imp, idx) => {
                        const color = PLAYER_COLORS[gameState.gameData.findIndex(p => p.id === imp.id) % PLAYER_COLORS.length];
                        return (
                            <div
                                key={imp.id}
                                className="flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-md animate-in slide-in-from-left duration-500"
                                style={{
                                    animationDelay: `${idx * 100}ms`,
                                    backgroundColor: `${color}10`,
                                    borderColor: `${color}40`
                                }}
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                                    <Ghost size={18} style={{ color }} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-base font-black" style={{ color: theme.text }}>{imp.name}</p>
                                    <p className="text-[10px] font-mono opacity-60 uppercase" style={{ color: theme.sub }}>
                                        {imp.impostorWord ? `Palabra: ${imp.impostorWord}` : 'Impostor'}
                                    </p>
                                </div>
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. PLAYER STATS TABLE */}
            <div className="w-full max-w-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Clock size={16} style={{ color: theme.accent }} className="opacity-70" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60" style={{ color: theme.sub }}>Análisis de tiempos</span>
                    <div className="h-px flex-1 opacity-20" style={{ backgroundColor: theme.border }} />
                </div>
                <div
                    className="rounded-2xl border overflow-hidden backdrop-blur-md"
                    style={{ backgroundColor: `${theme.cardBg}80`, borderColor: theme.border }}
                >
                    {gameState.gameData.map((player, idx) => {
                        const suspicion = getSuspicionLevel(player.viewTime || 0);
                        const isImp = player.isImp;
                        const color = PLAYER_COLORS[idx % PLAYER_COLORS.length];
                        const isExpanded = expandedPlayerId === player.id;
                        const key = player.name.trim().toLowerCase();
                        const vault = getVault(key, gameState.history.playerStats);
                        const totalSessions = vault.metrics.totalSessions;
                        const impostorSessions = Math.round(vault.metrics.impostorRatio * totalSessions);
                        const civilSessions = totalSessions - impostorSessions;
                        const civilStreak = vault.metrics.civilStreak;

                        const modifiers: { label: string; icon: React.ReactNode }[] = [];
                        if (player.isOracle) modifiers.push({ label: 'Oráculo', icon: <Eye size={10} /> });
                        if (player.isVanguardia) modifiers.push({ label: 'Vanguardia', icon: <Flame size={10} /> });
                        if (player.isArchitect) modifiers.push({ label: 'Arquitecto', icon: <FileText size={10} /> });
                        if (player.isAlcalde) modifiers.push({ label: 'Alcalde', icon: <Crown size={10} /> });
                        if (player.hasRejectedImpRole) modifiers.push({ label: 'Rechazo Impostor', icon: <AlertTriangle size={10} /> });
                        if (player.isSiphoner) modifiers.push({ label: 'Sifonador', icon: <Network size={10} /> });
                        if (player.isSiphoned) modifiers.push({ label: 'Sifonado', icon: <Network size={10} /> });
                        if (player.prismaChoice) modifiers.push({ label: `Prisma: ${player.prismaChoice}`, icon: <Sparkles size={10} /> });

                        return (
                            <div key={player.id}>
                                <button
                                    onClick={() => setExpandedPlayerId(isExpanded ? null : player.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors ${
                                        idx < gameState.gameData.length - 1 ? 'border-b' : ''
                                    } ${isExpanded ? 'bg-white/5 border-b-0' : 'hover:bg-white/5'}`}
                                    style={{ borderColor: `${theme.border}50` }}
                                >
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                    <div className="flex-1 text-left min-w-0">
                                        <span className="text-sm font-bold" style={{ color: isImp ? theme.accent : theme.text }}>
                                            {player.name}
                                            {isImp && <span className="ml-2 text-[9px] font-black opacity-70">(IMP)</span>}
                                        </span>
                                        {getPlayerProgression && (
                                            <div className="mt-0.5">
                                                <ProgressionBadge
                                                    progression={getPlayerProgression(player.name)}
                                                    theme={theme}
                                                    compact
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-mono tabular-nums" style={{ color: suspicion.color }}>
                                        {player.viewTime ? `${player.viewTime.toFixed(1)}s` : '-'}
                                    </span>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${suspicion.dotColor} bg-opacity-20`} style={{ color: suspicion.color }}>
                                        {suspicion.label}
                                    </span>
                                </button>
                                {isExpanded && (
                                    <div 
                                        className="px-5 pb-5 pt-3 border-b animate-in slide-in-from-top-2 duration-300 space-y-4"
                                        style={{ 
                                            borderColor: `${theme.border}50`,
                                            backgroundColor: 'rgba(255, 255, 255, 0.02)'
                                        }}
                                    >
                                        {/* Round Info */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-black/10 rounded-xl p-2.5 border border-white/5">
                                                <span className="text-[8px] font-mono uppercase opacity-55 block mb-0.5" style={{ color: theme.sub }}>Rol esta ronda</span>
                                                <span className="text-xs font-bold block" style={{ color: isImp ? theme.accent : theme.text }}>
                                                    {isImp ? '🕵️ Impostor' : '🛡️ Civil'}
                                                </span>
                                            </div>
                                            <div className="bg-black/10 rounded-xl p-2.5 border border-white/5">
                                                <span className="text-[8px] font-mono uppercase opacity-55 block mb-0.5" style={{ color: theme.sub }}>Palabra asignada</span>
                                                <span className="text-xs font-bold block truncate" style={{ color: theme.text }}>
                                                    {player.word || 'Sabotaje'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Modifiers */}
                                        {modifiers.length > 0 && (
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-mono uppercase opacity-55 block" style={{ color: theme.sub }}>Roles Especiales</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {modifiers.map((mod, mIdx) => (
                                                        <div 
                                                            key={mIdx}
                                                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-wider"
                                                            style={{ color: theme.text }}
                                                        >
                                                            {mod.icon}
                                                            <span>{mod.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Historical Stats */}
                                        <div className="space-y-2 border-t border-white/5 pt-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[8px] font-mono uppercase opacity-55" style={{ color: theme.sub }}>Historial de la Misión</span>
                                                {civilStreak > 0 && (
                                                    <span className="text-[8px] font-mono uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded">
                                                        Racha Civil: {civilStreak}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div className="bg-black/20 rounded-xl py-2">
                                                    <span className="text-xs font-black block" style={{ color: theme.text }}>{totalSessions}</span>
                                                    <span className="text-[7px] font-mono uppercase opacity-50 block" style={{ color: theme.sub }}>Rondas</span>
                                                </div>
                                                <div className="bg-black/20 rounded-xl py-2">
                                                    <span className="text-xs font-black block" style={{ color: theme.text }}>{civilSessions}</span>
                                                    <span className="text-[7px] font-mono uppercase opacity-50 block" style={{ color: theme.sub }}>Civil</span>
                                                </div>
                                                <div className="bg-black/20 rounded-xl py-2">
                                                    <span className="text-xs font-black block" style={{ color: theme.text }}>{impostorSessions}</span>
                                                    <span className="text-[7px] font-mono uppercase opacity-50 block" style={{ color: theme.sub }}>Impostor</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sequence History */}
                                        {vault.sequenceAnalytics.roleSequence.length > 0 && (
                                            <div className="space-y-1.5">
                                                <span className="text-[8px] font-mono uppercase opacity-55 block" style={{ color: theme.sub }}>Roles Recientes (Últimos 8)</span>
                                                <div className="flex gap-1.5">
                                                    {vault.sequenceAnalytics.roleSequence.slice(0, 8).map((wasImp, sIdx) => (
                                                        <div 
                                                            key={sIdx}
                                                            className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black border transition-all"
                                                            style={{
                                                                backgroundColor: wasImp ? `${theme.accent}15` : 'rgba(16,185,129,0.1)',
                                                                borderColor: wasImp ? `${theme.accent}45` : 'rgba(16,185,129,0.3)',
                                                                color: wasImp ? theme.accent : '#10b981'
                                                            }}
                                                            title={wasImp ? 'Impostor' : 'Civil'}
                                                        >
                                                            {wasImp ? 'I' : 'C'}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* View Profile Button */}
                                        {getPlayerProgression && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setProfileViewPlayer(player.name); }}
                                                className="w-full mt-2 py-2 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider border transition-all active:scale-[0.98]"
                                                style={{
                                                    backgroundColor: `${theme.accent}10`,
                                                    borderColor: `${theme.accent}30`,
                                                    color: theme.accent
                                                }}
                                            >
                                                Ver Perfil & Progresión
                                            </button>
                                        )}
                                    </div>
                                    
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* PLAYER PROFILE OVERLAY */}
            {profileViewPlayer && getPlayerProgression && (
                <PlayerProfileView
                    playerName={profileViewPlayer}
                    progression={getPlayerProgression(profileViewPlayer)}
                    theme={theme}
                    onClose={() => setProfileViewPlayer(null)}
                />
            )}

        </div>
        </div>

        {/* FIXED BOTTOM NAV BAR */}
        <div
            className="shrink-0 flex items-center gap-2 px-3 py-2 border-t backdrop-blur-xl"
            style={{
                backgroundColor: `${theme.cardBg}E8`,
                borderColor: `${theme.border}60`,
                paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))'
            }}
        >
            <button
                onClick={onReplay}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all active:scale-[0.97] border"
                style={{
                    backgroundColor: `${theme.accent}18`,
                    borderColor: `${theme.accent}40`,
                    color: theme.accent
                }}
            >
                <RotateCcw size={15} />
                Nueva partida
            </button>

            <button
                onClick={handleMenuClick}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all active:scale-[0.97] border"
                style={{
                    backgroundColor: showMenuConfirm ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
                    borderColor: showMenuConfirm ? 'rgba(239,68,68,0.5)' : `${theme.border}80`,
                    color: showMenuConfirm ? '#f87171' : theme.sub
                }}
            >
                <Menu size={15} />
                {showMenuConfirm ? 'Confirmar' : 'Menú'}
            </button>
        </div>
        </div>
    );
};
