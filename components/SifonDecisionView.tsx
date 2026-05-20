import React, { useState } from 'react';
import { GamePlayer, ThemeConfig, SifonDecision } from '../types';
import { Network, Ghost, ShieldCheck, Zap, Check } from 'lucide-react';

interface Props {
    player: GamePlayer;
    theme: ThemeConfig;
    impostorCount: number;
    onDecision: (decision: SifonDecision) => void;
}

export const SifonDecisionView: React.FC<Props> = ({ player, theme, impostorCount, onDecision }) => {
    const [selected, setSelected] = useState<SifonDecision | null>(null);

    const handleConfirm = () => {
        if (!selected) return;
        if (navigator.vibrate) navigator.vibrate([30, 50]);
        onDecision(selected);
    };

    const isOnlyOneOtherImpostor = impostorCount <= 2;
    const sifonTitle = isOnlyOneOtherImpostor ? "Robar pista al otro impostor" : "Robar pista a los otros impostores";
    const sifonDesc = isOnlyOneOtherImpostor
        ? "Recibes 2 pistas pero tu compañero impostor no recibirá ninguna y los civiles conocerán las pistas."
        : "Recibes 2 pistas pero tus compañeros impostores no recibirán ninguna y los civiles conocerán las pistas.";

    const confirmText = selected === 'sifon' ? 'Confirmar y ver pistas' :
                        selected === 'silence' ? 'Confirmar y ver tu tarjeta' :
                        'Confirmar y pasar al siguiente jugador';

    return (
        <div className="flex flex-col h-full items-center justify-between p-6 pb-12 relative z-10 animate-in slide-in-from-bottom-4 duration-500 pt-[calc(2rem+env(safe-area-inset-top))]">
            {/* Header */}
            <div className="text-center w-full mt-4 flex flex-col items-center gap-1.5 animate-in slide-in-from-top duration-700">
                <span className="text-xs font-black text-red-500 uppercase tracking-widest animate-pulse">
                    Eres un Impostor
                </span>
                <span className="text-[10px] text-black font-bold uppercase tracking-wider max-w-[260px] leading-snug">
                    Te ha tocado el Protocolo Sifón
                </span>
                <h3 className="text-2xl font-bold mt-4 mb-2 flex items-center gap-2 justify-center" style={{ color: theme.text }}>
                    <Network size={22} className="text-cyan-400" />
                    Protocolo Sifón
                </h3>
                <p style={{ color: theme.sub }} className="text-sm font-medium max-w-xs mx-auto leading-relaxed">
                    Elige una opción y pasa el teléfono al siguiente jugador.
                </p>
            </div>

            {/* Options */}
            <div className="w-full max-w-sm flex-1 flex flex-col justify-center gap-3 my-4">
                {/* SIFON */}
                <button
                    onClick={() => setSelected('sifon')}
                    className="group relative w-full p-5 rounded-2xl border active:scale-[0.98] transition-all duration-200 text-left overflow-hidden backdrop-blur-md"
                    style={{
                        borderWidth: selected === 'sifon' ? '2px' : '1px',
                        borderColor: selected === 'sifon' ? '#06b6d4' : theme.border,
                        backgroundColor: theme.cardBg,
                        boxShadow: selected === 'sifon' 
                            ? '0 0 20px rgba(6,182,212,0.3), inset 0 0 12px rgba(6,182,212,0.15)' 
                            : '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                >
                    <div className="flex justify-between items-start mb-1.5">
                        <span style={{ color: selected === 'sifon' ? '#06b6d4' : theme.sub }} className="text-[10px] font-black uppercase tracking-[0.2em]">
                            Consolidación Total
                        </span>
                        {selected === 'sifon' ? (
                            <Check size={16} className="text-cyan-400 animate-in zoom-in duration-200" />
                        ) : (
                            <Network size={16} className="text-cyan-400 opacity-40 group-hover:opacity-100 transition-opacity" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black uppercase tracking-tight" style={{ color: theme.text }}>
                            {sifonTitle}
                        </h3>
                        <p className="text-[10px] leading-relaxed opacity-70" style={{ color: theme.sub }}>
                            {sifonDesc}
                        </p>
                    </div>
                </button>

                {/* SILENCE */}
                <button
                    onClick={() => setSelected('silence')}
                    className="group relative w-full p-5 rounded-2xl border active:scale-[0.98] transition-all duration-200 text-left overflow-hidden backdrop-blur-md"
                    style={{
                        borderWidth: selected === 'silence' ? '2px' : '1px',
                        borderColor: selected === 'silence' ? 'rgba(156,163,175,0.8)' : theme.border,
                        backgroundColor: theme.cardBg,
                        boxShadow: selected === 'silence' 
                            ? '0 0 20px rgba(156,163,175,0.25), inset 0 0 12px rgba(156,163,175,0.1)' 
                            : '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                >
                    <div className="flex justify-between items-start mb-1.5">
                        <span style={{ color: selected === 'silence' ? 'rgba(156,163,175,0.9)' : theme.sub }} className="text-[10px] font-black uppercase tracking-[0.2em]">
                            Silencio Absoluto
                        </span>
                        {selected === 'silence' ? (
                            <Check size={16} className="text-gray-400 animate-in zoom-in duration-200" />
                        ) : (
                            <Ghost size={16} className="text-gray-400 opacity-40 group-hover:opacity-100 transition-opacity" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black uppercase tracking-tight" style={{ color: theme.text }}>
                            Silencio
                        </h3>
                        <p className="text-[10px] leading-relaxed opacity-70" style={{ color: theme.sub }}>
                            Juegas sin ninguna pista (modo fantasma). Tus aliados impostores conservan sus pistas y no se ven afectados.
                        </p>
                    </div>
                </button>

                {/* INTEGRITY */}
                {impostorCount > 2 && (
                    <button
                        onClick={() => setSelected('integrity')}
                        className="group relative w-full p-5 rounded-2xl border active:scale-[0.98] transition-all duration-200 text-left overflow-hidden backdrop-blur-md"
                        style={{
                            borderWidth: selected === 'integrity' ? '2px' : '1px',
                            borderColor: selected === 'integrity' ? theme.accent : theme.border,
                            backgroundColor: theme.cardBg,
                            boxShadow: selected === 'integrity' 
                                ? `0 0 20px ${theme.accent}30, inset 0 0 12px ${theme.accent}15` 
                                : '0 4px 12px rgba(0,0,0,0.05)'
                        }}
                    >
                        <div className="flex justify-between items-start mb-1.5">
                            <span style={{ color: selected === 'integrity' ? theme.accent : theme.sub }} className="text-[10px] font-black uppercase tracking-[0.2em]">
                                Integridad (Estándar)
                            </span>
                            {selected === 'integrity' ? (
                                <Check size={16} style={{ color: theme.accent }} className="animate-in zoom-in duration-200" />
                            ) : (
                                <ShieldCheck size={16} style={{ color: theme.accent }} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-black uppercase tracking-tight" style={{ color: theme.text }}>
                                Integridad
                            </h3>
                            <p className="text-[10px] leading-relaxed opacity-70" style={{ color: theme.sub }}>
                                Conservas tu pista normal y el dilema se pasa al siguiente impostor elegible.
                            </p>
                        </div>
                    </button>
                )}
            </div>

            {/* Controls */}
            <div className="w-full max-w-sm space-y-3">
                {/* Fixed height container to prevent layout shifting */}
                <div className="h-14 w-full relative">
                    <button
                        onClick={handleConfirm}
                        disabled={!selected}
                        aria-hidden={!selected}
                        tabIndex={selected ? 0 : -1}
                        style={{
                            backgroundColor: theme.accent,
                            boxShadow: selected ? `0 0 20px ${theme.accent}40` : 'none',
                            opacity: selected ? 1 : 0,
                            transform: selected ? 'scale(1)' : 'scale(0.95)',
                            pointerEvents: selected ? 'auto' : 'none'
                        }}
                        className="absolute inset-0 w-full h-full rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 text-white transition-all duration-300 transform-gpu active:scale-95"
                    >
                        {confirmText}
                    </button>
                </div>

                <div className="flex items-start justify-center gap-1.5 opacity-60 px-2 text-center">
                    <span className="text-[9px] uppercase tracking-wider w-full" style={{ color: theme.text }}>
                        Solo tú puedes ver esta pantalla.
                    </span>
                </div>
            </div>
        </div>
    );
};
