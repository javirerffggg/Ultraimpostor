import React, { useState } from 'react';
import { Player, ThemeConfig, PrismaDecision } from '../types';
import { Sparkles, Moon, Zap, Check } from 'lucide-react';

interface Props {
    player: Player;
    theme: ThemeConfig;
    onDecision: (decision: PrismaDecision) => void;
}

export const PrismaDecisionView: React.FC<Props> = ({ player, theme, onDecision }) => {
    const [selected, setSelected] = useState<PrismaDecision | null>(null);

    const handleConfirm = () => {
        if (!selected) return;
        if (navigator.vibrate) {
            if (selected === 'overload') {
                navigator.vibrate([30, 50, 30, 100]);
            } else {
                navigator.vibrate([100, 10, 100]);
            }
        }
        onDecision(selected);
    };

    return (
        <div className="flex flex-col h-full items-center justify-between p-6 pb-12 relative z-10 animate-in slide-in-from-bottom-4 duration-500 pt-[calc(2rem+env(safe-area-inset-top))]">
            {/* Header */}
            <div className="text-center w-full mt-4 flex flex-col items-center gap-1.5 animate-in slide-in-from-top duration-700">
                <span className="text-xs font-black text-red-500 uppercase tracking-widest animate-pulse">
                    Eres un Impostor
                </span>
                <span className="text-[10px] text-black font-bold uppercase tracking-wider max-w-[260px] leading-snug">
                    Te ha tocado el Protocolo Prisma
                </span>
                <h3 className="text-2xl font-bold mt-4 mb-2 flex items-center gap-2 justify-center" style={{ color: theme.text }}>
                    <Sparkles size={22} className="text-fuchsia-400" />
                    Protocolo Prisma
                </h3>
                <p style={{ color: theme.sub }} className="text-sm font-medium max-w-xs mx-auto leading-relaxed">
                    Elige una opción y pasa el teléfono al siguiente jugador.
                </p>
            </div>

            {/* Options */}
            <div className="w-full max-w-sm flex-1 flex flex-col justify-center gap-3 my-4">
                {/* Option A: SOBRECARGA */}
                <button
                    onClick={() => setSelected('overload')}
                    className="group relative w-full p-5 rounded-2xl border active:scale-[0.98] transition-all duration-200 text-left overflow-hidden backdrop-blur-md"
                    style={{
                        borderWidth: selected === 'overload' ? '2px' : '1px',
                        borderColor: selected === 'overload' ? '#06b6d4' : theme.border,
                        backgroundColor: theme.cardBg,
                        boxShadow: selected === 'overload' 
                            ? '0 0 20px rgba(6,182,212,0.3), inset 0 0 12px rgba(6,182,212,0.15)' 
                            : '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                >
                    <div className="flex justify-between items-start mb-1.5">
                        <span style={{ color: selected === 'overload' ? '#06b6d4' : theme.sub }} className="text-[10px] font-black uppercase tracking-[0.2em]">
                            Senda A • Sobrecarga
                        </span>
                        {selected === 'overload' ? (
                            <Check size={16} className="text-cyan-400 animate-in zoom-in duration-200" />
                        ) : (
                            <Zap size={16} className="text-cyan-400 opacity-40 group-hover:opacity-100 transition-opacity" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black uppercase tracking-tight" style={{ color: theme.text }}>
                            Doble Pista
                        </h3>
                        <p className="text-[10px] leading-relaxed opacity-70" style={{ color: theme.sub }}>
                            Obtienes dos pistas pero los civiles sabrán cuáles son.
                        </p>
                    </div>
                </button>

                {/* Option B: ECLIPSE */}
                <button
                    onClick={() => setSelected('eclipse')}
                    className="group relative w-full p-5 rounded-2xl border active:scale-[0.98] transition-all duration-200 text-left overflow-hidden backdrop-blur-md"
                    style={{
                        borderWidth: selected === 'eclipse' ? '2px' : '1px',
                        borderColor: selected === 'eclipse' ? '#a855f7' : theme.border,
                        backgroundColor: theme.cardBg,
                        boxShadow: selected === 'eclipse' 
                            ? '0 0 20px rgba(168,85,247,0.25), inset 0 0 12px rgba(168,85,247,0.1)' 
                            : '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                >
                    <div className="flex justify-between items-start mb-1.5">
                        <span style={{ color: selected === 'eclipse' ? '#a855f7' : theme.sub }} className="text-[10px] font-black uppercase tracking-[0.2em]">
                            Senda B • Eclipse
                        </span>
                        {selected === 'eclipse' ? (
                            <Check size={16} className="text-purple-400 animate-in zoom-in duration-200" />
                        ) : (
                            <Moon size={16} className="text-purple-400 opacity-40 group-hover:opacity-100 transition-opacity" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black uppercase tracking-tight" style={{ color: theme.text }}>
                            Anónimo Total
                        </h3>
                        <p className="text-[10px] leading-relaxed opacity-70" style={{ color: theme.sub }}>
                            No obtienes ninguna pista.
                        </p>
                    </div>
                </button>
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
                        {selected === 'overload' ? 'Confirmar y ver pistas' :
                         selected === 'eclipse' ? 'Confirmar y ver tu tarjeta' :
                         'Confirmar y pasar al siguiente jugador'}
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
