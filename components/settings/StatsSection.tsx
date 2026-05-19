import React, { useMemo, useState } from 'react';
import { ThemeConfig, GameState } from '../../types';
import { BarChart3, Trophy, Skull, Medal, User } from 'lucide-react';
import { SectionContainer, SectionHeader, ContentCard } from './SettingsComponents';
import { loadAllProgressions, getProgression } from '../../utils/progression/storage';
import { ProgressionBadge } from '../progression/ProgressionBadge';
import { PlayerProfileView } from '../progression/PlayerProfileView';

interface StatsSectionProps {
    gameState: GameState;
    theme: ThemeConfig;
    searchQuery?: string;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ gameState, theme, searchQuery = '' }) => {
    const [profilePlayer, setProfilePlayer] = useState<string | null>(null);

    if (searchQuery && !'estadisticas stats infinitum progreso leaderboard ranking'.includes(searchQuery.toLowerCase())) return null;

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

    // Leaderboard of progressions
    const leaderboard = useMemo(() => {
        const data = loadAllProgressions();
        return Object.values(data).sort((a, b) => b.totalXpAllTime - a.totalXpAllTime);
    }, [gameState.history.playerStats]); // Refresh when stats update

    return (
        <SectionContainer className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both">
            <SectionHeader icon={<BarChart3 size={16} />} title="Estadísticas Infinitum" subtitle="Resumen del historial de juego" theme={theme} />
            
            {stats && (
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
            )}

            {/* Leaderboard Section */}
            {leaderboard.length > 0 && (
                <>
                    <SectionHeader icon={<Medal size={16} />} title="Clasificación de Agentes" subtitle="Leaderboard de XP total" theme={theme} />
                    <ContentCard theme={theme}>
                        <div className="space-y-2">
                            {leaderboard.map((prog, idx) => (
                                <button
                                    key={prog.uid}
                                    onClick={() => setProfilePlayer(prog.uid)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl border transition-all active:scale-[0.99] text-left hover:bg-white/5"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.01)',
                                        borderColor: `${theme.border}30`
                                    }}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div 
                                            className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0"
                                            style={{
                                                backgroundColor: idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? '#cd7f32' : 'rgba(255,255,255,0.05)',
                                                color: idx <= 2 ? '#000' : theme.text
                                            }}
                                        >
                                            {idx + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-xs font-bold block truncate capitalize" style={{ color: theme.text }}>
                                                {prog.uid}
                                            </span>
                                            <span className="text-[9px] font-mono opacity-50 block" style={{ color: theme.sub }}>
                                                XP: {prog.totalXpAllTime.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <ProgressionBadge
                                        progression={prog}
                                        theme={theme}
                                        compact
                                    />
                                </button>
                            ))}
                        </div>
                    </ContentCard>
                </>
            )}

            {/* Player Profile View Overlay */}
            {profilePlayer && (
                <PlayerProfileView
                    playerName={profilePlayer}
                    progression={getProgression(profilePlayer)}
                    theme={theme}
                    onClose={() => setProfilePlayer(null)}
                />
            )}
        </SectionContainer>
    );
};

