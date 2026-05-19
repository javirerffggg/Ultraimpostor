import React, { useState } from 'react';
import { Player, ThemeConfig, PrismaDecision } from '../types';
import { Sparkles, Moon, Zap, ArrowRight, Eye, ShieldAlert } from 'lucide-react';

interface Props {
    player: Player;
    theme: ThemeConfig;
    onDecision: (decision: PrismaDecision) => void;
}

export const PrismaDecisionView: React.FC<Props> = ({ player, theme, onDecision }) => {
    const [hoveredCard, setHoveredCard] = useState<'overload' | 'eclipse' | null>(null);
    const [selected, setSelected] = useState<PrismaDecision | null>(null);

    const handleSelect = (decision: PrismaDecision) => {
        if (navigator.vibrate) {
            if (decision === 'overload') {
                navigator.vibrate([30, 50, 30, 100]);
            } else {
                navigator.vibrate([100, 10, 100]);
            }
        }
        setSelected(decision);
        setTimeout(() => {
            onDecision(decision);
        }, 800);
    };

    return (
        <div 
            className="fixed inset-0 z-[120] flex flex-col items-center justify-between p-6 overflow-y-auto select-none"
            style={{ 
                backgroundColor: '#030712',
                backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(31, 41, 55, 0.3) 0%, rgba(3, 7, 18, 1) 100%)'
            }}
        >
            {/* Header */}
            <div className="w-full max-w-md text-center pt-8 space-y-2 animate-in fade-in slide-in-from-top duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                    <Sparkles size={12} className="animate-spin-slow" />
                    Protocolo PRISMA Activado
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-white">
                    El Dilema del Infiltrado
                </h2>
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                    Infiltrado solitario detectado. Refracta la información bajo tu propio riesgo. Elige tu senda de seguridad.
                </p>
            </div>

            {/* Path Selection Container */}
            <div className="w-full max-w-md flex flex-col gap-5 my-8">
                {/* Option A: SOBRECARGA */}
                <button
                    onClick={() => !selected && handleSelect('overload')}
                    onMouseEnter={() => !selected && setHoveredCard('overload')}
                    onMouseLeave={() => !selected && setHoveredCard(null)}
                    disabled={!!selected}
                    className={`w-full relative overflow-hidden rounded-[2.5rem] border text-left p-6 transition-all duration-500 ${
                        selected === 'overload' 
                            ? 'scale-[1.03] border-cyan-400 ring-2 ring-cyan-500/20' 
                            : selected 
                                ? 'opacity-30 scale-[0.98]' 
                                : 'hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                    style={{
                        backgroundColor: 'rgba(17, 24, 39, 0.4)',
                        borderColor: hoveredCard === 'overload' ? 'rgba(6, 182, 212, 0.6)' : 'rgba(255, 255, 255, 0.08)',
                        boxShadow: hoveredCard === 'overload' 
                            ? '0 20px 40px -15px rgba(6, 182, 212, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)'
                            : '0 4px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.02)'
                    }}
                >
                    {/* Rainbow Shimmer background when hovered or selected */}
                    {(hoveredCard === 'overload' || selected === 'overload') && (
                        <div 
                            className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none animate-shimmer"
                            style={{
                                background: 'linear-gradient(90deg, rgba(239,68,68,1) 0%, rgba(245,158,11,1) 17%, rgba(16,185,129,1) 33%, rgba(6,182,212,1) 50%, rgba(59,130,246,1) 67%, rgba(139,92,246,1) 83%, rgba(236,72,153,1) 100%)',
                                backgroundSize: '200% 100%',
                            }}
                        />
                    )}
                    
                    <div className="relative z-10 flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                            <Zap size={22} className={hoveredCard === 'overload' ? 'animate-pulse' : ''} />
                        </div>
                        <div className="space-y-1.5 flex-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black uppercase tracking-wider text-cyan-400">
                                    Senda A
                                </span>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 uppercase tracking-widest border border-cyan-500/20">
                                    Sobrecarga
                                </span>
                            </div>
                            <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">
                                DOBLE PISTA
                            </h3>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                Revela <span className="font-bold text-white">2 pistas enemigas</span> para descifrar su palabra. 
                                <br />
                                <span className="text-red-400 font-bold">Riesgo:</span> Tus pistas serán filtradas como un <span className="underline">Resplandor del Prisma</span> a los siguientes civiles en el turno.
                            </p>
                        </div>
                    </div>
                </button>

                {/* Option B: ECLIPSE */}
                <button
                    onClick={() => !selected && handleSelect('eclipse')}
                    onMouseEnter={() => !selected && setHoveredCard('eclipse')}
                    onMouseLeave={() => !selected && setHoveredCard(null)}
                    disabled={!!selected}
                    className={`w-full relative overflow-hidden rounded-[2.5rem] border text-left p-6 transition-all duration-500 ${
                        selected === 'eclipse' 
                            ? 'scale-[1.03] border-purple-500 ring-2 ring-purple-500/20' 
                            : selected 
                                ? 'opacity-30 scale-[0.98]' 
                                : 'hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                    style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        borderColor: hoveredCard === 'eclipse' ? 'rgba(168, 85, 247, 0.6)' : 'rgba(255, 255, 255, 0.05)',
                        boxShadow: hoveredCard === 'eclipse' 
                            ? '0 20px 40px -15px rgba(168, 85, 247, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.05)'
                            : '0 4px 30px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.01)'
                    }}
                >
                    {/* Eclipse Dark Obsidian Shimmer */}
                    {(hoveredCard === 'eclipse' || selected === 'eclipse') && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/20 via-black to-slate-950/20 pointer-events-none" />
                    )}
                    
                    <div className="relative z-10 flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                            <Moon size={22} className={hoveredCard === 'eclipse' ? 'animate-bounce' : ''} />
                        </div>
                        <div className="space-y-1.5 flex-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black uppercase tracking-wider text-purple-400">
                                    Senda B
                                </span>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 uppercase tracking-widest border border-purple-500/20">
                                    Eclipse
                                </span>
                            </div>
                            <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">
                                ANÓNIMO TOTAL
                            </h3>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                Mantén el silencio absoluto. Obtienes <span className="font-bold text-white">0 pistas</span> enemigas.
                                <br />
                                <span className="text-purple-400 font-bold">Ventaja:</span> Sin filtraciones. Si logras ganar esta ronda a ciegas, registras una <span className="underline font-bold text-purple-300">Victoria Perfecta</span>.
                            </p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Footer */}
            <div className="w-full max-w-xs text-center pb-8 animate-in fade-in duration-1000">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    Jugador activo: {player.name}
                </p>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-shimmer {
                    animation: shimmer 4s ease infinite;
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};
