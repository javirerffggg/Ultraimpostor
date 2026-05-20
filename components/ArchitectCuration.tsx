import React, { useState } from 'react';
import { CategoryData, GamePlayer, ThemeConfig } from '../types';
import { RefreshCw, EyeOff, MousePointerClick, Check } from 'lucide-react';

interface Props {
    architect: GamePlayer;
    currentOptions: [{ categoryName: string, wordPair: CategoryData }, { categoryName: string, wordPair: CategoryData }];
    onRegenerate: () => void;
    onConfirm: (selection: { categoryName: string, wordPair: CategoryData }) => void;
    regenCount: number;
    theme: ThemeConfig;
}

// Auth step removed — the Hold-to-Bloom gate in RevealingView.tsx already
// acts as the privacy barrier. This component shows only the selection screen.
export const ArchitectCuration: React.FC<Props> = ({ architect, currentOptions, onRegenerate, onConfirm, regenCount, theme }) => {
    const [selectedOption, setSelectedOption] = useState<{ categoryName: string, wordPair: CategoryData } | null>(null);

    const handleRegenerate = () => {
        setSelectedOption(null);
        onRegenerate();
    };

    return (
        <div className="flex flex-col h-full items-center justify-between p-6 pb-12 relative z-10 animate-in slide-in-from-bottom-4 duration-500 pt-[calc(2rem+env(safe-area-inset-top))]">
            {/* Header */}
            <div className="text-center w-full mt-4 flex flex-col items-center gap-1.5">
                <span className="text-xs font-black text-green-500 uppercase tracking-widest animate-pulse">
                    Eres un civil
                </span>
                <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider max-w-[260px] leading-snug">
                    Te ha tocado elegir la palabra de la ronda
                </span>
                <h3 className="text-2xl font-bold mt-4 mb-2" style={{ color: theme.text }}>Selección de Palabra</h3>
                <p style={{ color: theme.sub }} className="text-sm font-medium max-w-xs mx-auto leading-relaxed">
                    Elige una opción y pasa el teléfono al siguiente jugador.
                </p>
            </div>

            {/* Options */}
            <div className="w-full max-w-sm flex-1 flex flex-col justify-center gap-4 my-4">
                {currentOptions.map((option, idx) => {
                    const isSelected = selectedOption?.wordPair.civ === option.wordPair.civ;
                    return (
                        <button
                            key={idx}
                            onClick={() => setSelectedOption(option)}
                            className="group relative w-full p-6 rounded-2xl border active:scale-[0.98] transition-all duration-200 text-left overflow-hidden backdrop-blur-md"
                            style={{
                                borderWidth: isSelected ? '2px' : '1px',
                                borderColor: isSelected ? theme.accent : theme.border,
                                backgroundColor: theme.cardBg,
                                boxShadow: isSelected 
                                    ? `0 0 20px ${theme.accent}30, inset 0 0 12px ${theme.accent}15` 
                                    : `0 4px 12px rgba(0,0,0,0.05)`
                            }}
                        >
                            <div
                                className="absolute inset-0 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"
                                style={{ background: `linear-gradient(90deg, transparent, ${theme.text}10, transparent)` }}
                            />
                            <div className="flex justify-between items-start mb-2">
                                <span style={{ color: isSelected ? theme.accent : theme.sub }} className="text-[10px] font-black uppercase tracking-[0.2em]">
                                    OPCIÓN 0{idx + 1}
                                </span>
                                {isSelected ? (
                                    <Check size={16} style={{ color: theme.accent }} className="animate-in zoom-in duration-200" />
                                ) : (
                                    <MousePointerClick size={16} style={{ color: theme.sub }} className="transition-colors group-hover:opacity-100 opacity-50" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <p style={{ color: isSelected ? theme.accent : theme.sub }} className="text-xs font-bold uppercase tracking-wide opacity-90">
                                    {option.categoryName}
                                </p>
                                <h3
                                    className="text-3xl font-black uppercase tracking-tight transition-colors"
                                    style={{ color: theme.text }}
                                >
                                    {option.wordPair.civ}
                                </h3>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Controls */}
            <div className="w-full max-w-sm space-y-3">
                {/* Fixed height container to prevent layout shifting */}
                <div className="h-14 w-full relative">
                    <button
                        onClick={() => selectedOption && onConfirm(selectedOption)}
                        disabled={!selectedOption}
                        aria-hidden={!selectedOption}
                        tabIndex={selectedOption ? 0 : -1}
                        style={{
                            backgroundColor: theme.accent,
                            boxShadow: selectedOption ? `0 0 20px ${theme.accent}40` : 'none',
                            opacity: selectedOption ? 1 : 0,
                            transform: selectedOption ? 'scale(1)' : 'scale(0.95)',
                            pointerEvents: selectedOption ? 'auto' : 'none'
                        }}
                        className="absolute inset-0 w-full h-full rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 text-white transition-all duration-300 transform-gpu active:scale-95"
                    >
                        Confirmar y pasar al siguiente jugador
                    </button>
                </div>

                <div className="flex items-start justify-center gap-2 mb-2 opacity-70 px-2">
                    <EyeOff size={14} style={{ color: theme.text, flexShrink: 0, marginTop: 3 }} />
                    <span className="text-[10px] uppercase tracking-wide text-center leading-snug" style={{ color: theme.text }}>
                        En el caso de que el modo pista esté activado, el impostor recibirá la pista que corresponda para la palabra que elijas
                    </span>
                </div>
                <button
                    onClick={handleRegenerate}
                    disabled={regenCount >= 3}
                    style={{
                        borderColor: theme.border,
                        color: theme.text,
                        backgroundColor: theme.cardBg
                    }}
                    className="w-full py-4 rounded-xl border font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 hover:opacity-80 backdrop-blur-md"
                >
                    <RefreshCw size={16} />
                    Nuevas Palabras ({3 - regenCount} restantes)
                </button>
            </div>
        </div>
    );
};
