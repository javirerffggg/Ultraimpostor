import React, { useState, useEffect } from 'react';
import { ThemeConfig, ProgressionEra } from '../../types';

interface Props {
    playerName: string;
    newEra: ProgressionEra;
    prestigeCount: number;
    theme: ThemeConfig;
    onComplete: () => void;
}

const ERA_MESSAGES: Record<ProgressionEra, { title: string; subtitle: string; icon: string; color: string }> = {
    base: { title: 'ERA BASE', subtitle: 'Inicio del camino', icon: '⬜', color: '#9ca3af' },
    prestidigitacion: {
        title: 'PRESTIDIGITACIÓN',
        subtitle: 'El ilusionismo comienza. Tu nivel se reinicia. Tu legado permanece.',
        icon: '✦',
        color: '#a855f7'
    },
    prestidigitacion_elite: {
        title: 'PRESTIDIGITACIÓN ÉLITE',
        subtitle: 'Solo los que dominan el engaño llegan aquí. Nada será igual.',
        icon: '✦✦',
        color: '#fbbf24'
    },
    supremo: {
        title: 'ESTADO SUPREMO',
        subtitle: 'Ya no hay más engaños que descubrir. Eres la máscara. Eres el sistema.',
        icon: '👁️🗨️',
        color: '#ffffff'
    },
};

export const PrestigeSequence: React.FC<Props> = ({ playerName, newEra, prestigeCount, theme, onComplete }) => {
    const [phase, setPhase] = useState<'flash' | 'reveal' | 'done'>('flash');
    const msg = ERA_MESSAGES[newEra];

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('reveal'), 800);
        const t2 = setTimeout(() => setPhase('done'), 5000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[350] flex flex-col items-center justify-center"
            style={{ backgroundColor: '#000' }}
            onClick={() => { if (phase === 'done') onComplete(); }}
        >
            {phase === 'flash' && (
                <div className="absolute inset-0 animate-flash" style={{ backgroundColor: msg.color }} />
            )}

            <div className={`flex flex-col items-center gap-6 max-w-sm mx-4 transition-all duration-1000 ${
                phase === 'flash' ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
            }`}>
                <div
                    className="text-7xl"
                    style={{
                        filter: `drop-shadow(0 0 40px ${msg.color})`,
                        animation: 'float 3s ease-in-out infinite'
                    }}
                >
                    {msg.icon}
                </div>

                <div className="text-center space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-50" style={{ color: msg.color }}>
                        {playerName}
                    </p>
                    <h1
                        className="text-3xl font-black uppercase tracking-widest"
                        style={{
                            color: msg.color,
                            textShadow: `0 0 40px ${msg.color}60, 0 0 80px ${msg.color}30`
                        }}
                    >
                        {msg.title}
                    </h1>
                    <div className="h-px w-24 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${msg.color}, transparent)` }} />
                    <p className="text-sm leading-relaxed opacity-70 max-w-[280px]" style={{ color: '#e5e5e5' }}>
                        {msg.subtitle}
                    </p>
                </div>

                {prestigeCount > 0 && (
                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(prestigeCount, 5) }).map((_, i) => (
                            <span key={i} className="text-lg" style={{ filter: `drop-shadow(0 0 6px ${msg.color})` }}>✦</span>
                        ))}
                    </div>
                )}

                {phase === 'done' && (
                    <span className="text-[8px] font-mono uppercase tracking-widest opacity-30 animate-pulse mt-8" style={{ color: '#fff' }}>
                        Toca para continuar
                    </span>
                )}
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }
                @keyframes animate-flash {
                    0% { opacity: 0; }
                    30% { opacity: 1; }
                    100% { opacity: 0; }
                }
                .animate-flash { animation: animate-flash 800ms ease-out forwards; }
            `}</style>
        </div>
    );
};
