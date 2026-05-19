import React, { useMemo } from 'react';
import { ThemeConfig, GameState } from '../../types';
import { BarChart3, Trophy, Skull } from 'lucide-react';
import { SectionContainer, SectionHeader, ContentCard } from './SettingsComponents';

interface StatsSectionProps {
    gameState: GameState;
    theme: ThemeConfig;
    searchQuery?: string;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ gameState, theme, searchQuery = '' }) => {
    if (searchQuery && !'estadisticas stats infinitum progreso'.includes(searchQuery.toLowerCase())) return null;

    const stats = useMemo(() => {
        const vaults = Object.values(gameState.history.playerStats || {});
        if (vaults.length === 0) return null;

        const totalRounds = vaults.reduce((acc, v) => acc + (v.metrics.totalSessions || 0), 0);
        
        let mostImpostor = vaults[0];
        let bestCivilian = vaults[0];
        
        for (const v of vaults) {
            if (v.metrics.impostorRatio > mostImpostor.metrics.impostorRatio) mostImpostor = v;
            if (v.metrics.civilStreak > bestCivilian.metrics.civilStreak) bestCivilian = v;
        }

        return {
            totalRounds,
            mostImpostor: mostImpostor?.uid || 'Nadie',
            bestCivilian: bestCivilian?.uid || 'Nadie'
        };
    }, [gameState.history.playerStats]);

    if (!stats) return null;

    return (
        <SectionContainer className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both">
            <SectionHeader icon={<BarChart3 size={16} />} title="Estadísticas Infinitum" subtitle="Resumen del historial de juego" theme={theme} />
            <ContentCard theme={theme}>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border col-span-2 flex justify-between items-center" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: `${theme.border}40` }}>
                        <span className="text-[10px] font-mono uppercase opacity-70" style={{ color: theme.sub }}>Rondas Jugadas</span>
                        <span className="text-xl font-black" style={{ color: theme.text }}>{stats.totalRounds}</span>
                    </div>
                    <div className="p-3 rounded-xl border flex flex-col gap-1" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: `${theme.border}40` }}>
                        <div className="flex items-center gap-1 opacity-70">
                            <Skull size={10} style={{ color: theme.accent }} />
                            <span className="text-[8px] font-mono uppercase" style={{ color: theme.sub }}>Más Impostor</span>
                        </div>
                        <span className="text-xs font-bold truncate" style={{ color: theme.text }}>{stats.mostImpostor}</span>
                    </div>
                    <div className="p-3 rounded-xl border flex flex-col gap-1" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: `${theme.border}40` }}>
                        <div className="flex items-center gap-1 opacity-70">
                            <Trophy size={10} style={{ color: theme.accent }} />
                            <span className="text-[8px] font-mono uppercase" style={{ color: theme.sub }}>Mejor Civil</span>
                        </div>
                        <span className="text-xs font-bold truncate" style={{ color: theme.text }}>{stats.bestCivilian}</span>
                    </div>
                </div>
            </ContentCard>
        </SectionContainer>
    );
};
