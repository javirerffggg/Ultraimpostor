import React, { useState, useEffect } from 'react';
import { ThemeConfig, ProgressionUnlockEvent, ProgressionEra } from '../../types';
import { X } from 'lucide-react';
import { PrestigeSequence } from './PrestigeSequence';

interface Props {
    unlocks: ProgressionUnlockEvent[];
    theme: ThemeConfig;
    onDismiss: () => void;
}

const TIER_COLORS: Record<string, string> = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
};

const TYPE_LABELS: Record<string, string> = {
    medal_upgrade: 'MEDALLA',
    trophy: 'TROFEO',
    collectible: 'COLECCIONABLE',
    set_complete: 'SET COMPLETO',
    level_up: 'NIVEL',
    rank_up: 'RANGO',
    prestige: 'PRESTIDIGITACIÓN',
};

export const UnlockNotification: React.FC<Props> = ({ unlocks, theme, onDismiss }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (unlocks.length > 0) {
            setCurrentIndex(0);
            setIsVisible(true);
            setIsExiting(false);
        }
    }, [unlocks]);

    const handleNext = () => {
        if (currentIndex < unlocks.length - 1) {
            setIsExiting(true);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setIsExiting(false);
            }, 200);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            onDismiss();
        }, 300);
    };

    if (!isVisible || unlocks.length === 0) return null;

    const current = unlocks[currentIndex];
    const tierColor = current.tier ? TIER_COLORS[current.tier] : current.color || theme.accent;
    const typeLabel = TYPE_LABELS[current.type] || 'DESBLOQUEO';
    const isPrestige = current.type === 'prestige';

    if (isPrestige) {
        const descStr = current.description || '';
        const colonIdx = descStr.indexOf(': ');
        const playerName = colonIdx !== -1 ? descStr.substring(0, colonIdx) : 'Agente';
        
        const prestigeCount = parseInt(current.id.replace('prestige_', '')) || 1;
        const newEra: ProgressionEra = prestigeCount === 1 ? 'prestidigitacion'
                     : prestigeCount === 2 ? 'prestidigitacion_elite'
                     : 'supremo';

        return (
            <PrestigeSequence
                playerName={playerName}
                newEra={newEra}
                prestigeCount={prestigeCount}
                theme={theme}
                onComplete={handleNext}
            />
        );
    }

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center"
            style={{
                backgroundColor: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(20px)'
            }}
            onClick={handleNext}
        >
            <button
                onClick={(e) => { e.stopPropagation(); handleClose(); }}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 active:scale-90 transition-transform"
                style={{ color: theme.sub }}
                aria-label="Cerrar"
            >
                <X size={18} />
            </button>

            <div
                className={`flex flex-col items-center gap-6 max-w-xs mx-4 transition-all duration-300 ${
                    isExiting ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
                }`}
                style={{ animation: !isExiting ? 'fadeInScale 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none' }}
            >
                {/* Type label */}
                <span
                    className="text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border"
                    style={{
                        color: tierColor,
                        borderColor: `${tierColor}40`,
                        backgroundColor: `${tierColor}10`
                    }}
                >
                    {typeLabel}
                </span>

                {/* Icon */}
                <div
                    className="text-6xl"
                    style={{
                        filter: `drop-shadow(0 0 30px ${tierColor}80)`,
                        animation: 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                >
                    {current.icon || '🏅'}
                </div>

                {/* Name */}
                <h2
                    className="text-2xl font-black uppercase text-center tracking-wider"
                    style={{
                        color: tierColor || '#ffffff',
                        textShadow: `0 0 30px ${tierColor}60`
                    }}
                >
                    {current.name}
                </h2>

                {/* Description */}
                {current.description && (
                    <p className="text-sm text-center opacity-70 max-w-[250px]" style={{ color: theme.sub }}>
                        {current.description}
                    </p>
                )}

                {/* XP gained */}
                {current.xpGained > 0 && (
                    <div
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black"
                        style={{
                            backgroundColor: `${theme.accent}15`,
                            color: theme.accent
                        }}
                    >
                        +{current.xpGained} XP
                    </div>
                )}

                {/* Progress indicator */}
                {unlocks.length > 1 && (
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex gap-1">
                            {unlocks.map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                        backgroundColor: i === currentIndex ? tierColor || theme.accent : `${theme.sub}40`,
                                        transform: i === currentIndex ? 'scale(1.3)' : 'scale(1)'
                                    }}
                                />
                            ))}
                        </div>
                        <span className="text-[9px] font-mono opacity-40" style={{ color: theme.sub }}>
                            {currentIndex + 1}/{unlocks.length}
                        </span>
                    </div>
                )}

                {/* Tap hint */}
                <span className="text-[8px] font-mono uppercase tracking-widest opacity-30 mt-4" style={{ color: theme.sub }}>
                    Toca para {currentIndex < unlocks.length - 1 ? 'siguiente' : 'cerrar'}
                </span>
            </div>

            <style>{`
                @keyframes fadeInScale {
                    0% { opacity: 0; transform: scale(0.8) translateY(20px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes bounceIn {
                    0% { transform: scale(0); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};
