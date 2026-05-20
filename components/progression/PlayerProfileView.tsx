import React, { useState, useMemo } from 'react';
import { ThemeConfig, PlayerProgression, MedalTier } from '../../types';
import { X, Trophy, Award, Package, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { xpToNextLevel } from '../../utils/progression/xpCurves';
import { MEDALS } from '../../utils/progression/medals';
import { TROPHIES } from '../../utils/progression/trophies';
import { COLLECTIBLES, SETS } from '../../utils/progression/collectibles';

interface Props {
    progression: PlayerProgression;
    playerName: string;
    theme: ThemeConfig;
    onClose: () => void;
}

const TIER_COLORS: Record<MedalTier, string> = {
    locked: '#4b5563',
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
};

const ERA_LABELS: Record<string, string> = {
    base: 'Era Base',
    prestidigitacion: 'Prestidigitación',
    prestidigitacion_elite: 'Prestidigitación Élite',
    supremo: 'Estado Supremo',
};

export const PlayerProfileView: React.FC<Props> = ({ progression, playerName, theme, onClose }) => {
    const [activeSection, setActiveSection] = useState<'medals' | 'trophies' | 'collectibles'>('medals');
    const [medalFilter, setMedalFilter] = useState<'all' | 'bronze' | 'silver' | 'gold'>('all');
    const { current, needed, progress } = xpToNextLevel(progression.xp, progression.era);
    const isSupremo = progression.era === 'supremo';

    const medalStats = useMemo(() => {
        const all = MEDALS.map(m => ({ ...m, tier: progression.medals[m.id] || 'locked' as MedalTier }));
        return {
            all,
            bronze: all.filter(m => m.tier === 'bronze').length,
            silver: all.filter(m => m.tier === 'silver' || m.tier === 'gold').length,
            gold: all.filter(m => m.tier === 'gold').length,
            unlocked: all.filter(m => m.tier !== 'locked').length,
        };
    }, [progression.medals]);

    const trophyList = useMemo(() => {
        return TROPHIES.map(t => ({
            ...t,
            unlocked: progression.trophies.includes(t.id),
        }));
    }, [progression.trophies]);

    const setList = useMemo(() => {
        return SETS.map(set => {
            const items = COLLECTIBLES.filter(c => c.setId === set.id).map(c => ({
                ...c,
                unlocked: progression.collectibles.includes(c.id),
            }));
            const completedCount = items.filter(i => i.unlocked).length;
            return { ...set, items, completedCount, isComplete: completedCount === items.length };
        });
    }, [progression.collectibles]);

    const filteredMedals = useMemo(() => {
        if (medalFilter === 'all') return medalStats.all;
        return medalStats.all.filter(m => m.tier === medalFilter);
    }, [medalStats, medalFilter]);

    const isPerfMode = typeof document !== 'undefined' && document.documentElement.getAttribute('data-perf') === 'low';
    const blurValue = isPerfMode ? '4px' : (theme.blur ? `${parseInt(theme.blur)}px` : '30px');

    return (
        <div
            className="fixed inset-0 z-[250] flex flex-col"
            style={{ 
                backgroundColor: 'rgba(0,0,0,0.92)', 
                backdropFilter: `blur(${blurValue})`,
                WebkitBackdropFilter: `blur(${blurValue})`
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-[calc(1rem+env(safe-area-inset-top))] pb-3">
                <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 active:scale-90 transition-transform"
                    style={{ color: theme.sub }}
                >
                    <X size={18} />
                </button>
                <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: theme.sub }}>
                    PERFIL DE AGENTE
                </span>
                <div className="w-9" />
            </div>

            {/* Profile card */}
            <div className="px-5 py-4">
                <div
                    className="rounded-3xl border p-5 relative overflow-hidden"
                    style={{
                        backgroundColor: `${progression.rank.color}08`,
                        borderColor: `${progression.rank.color}30`,
                    }}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none" style={{
                        background: `radial-gradient(circle, ${progression.rank.color}, transparent 70%)`
                    }} />

                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div
                            className="text-4xl"
                            style={{
                                filter: progression.rank.glow ? `drop-shadow(0 0 12px ${progression.rank.color})` : 'none'
                            }}
                        >
                            {progression.rank.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-black tracking-wider truncate" style={{ color: '#fff' }}>
                                {playerName}
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: progression.rank.color }}>
                                {ERA_LABELS[progression.era]}
                            </p>
                        </div>
                    </div>

                    {/* Rank title */}
                    <div className="mb-3">
                        <p className="text-xs font-black uppercase tracking-wider" style={{ color: progression.rank.color }}>
                            {progression.rank.title}
                        </p>
                    </div>

                    {/* XP bar */}
                    {!isSupremo ? (
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-[9px] font-mono opacity-60" style={{ color: '#fff' }}>
                                    Nivel {progression.level}
                                </span>
                                <span className="text-[9px] font-mono opacity-60" style={{ color: '#fff' }}>
                                    {current} / {needed} XP
                                </span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${progression.rank.color}15` }}>
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: `${Math.round(progress * 100)}%`,
                                        background: `linear-gradient(90deg, ${progression.rank.color}80, ${progression.rank.color})`
                                    }}
                                />
                            </div>
                            <div className="flex justify-between mt-1.5">
                                <span className="text-[8px] font-mono opacity-40" style={{ color: '#fff' }}>
                                    XP Total: {progression.totalXpAllTime.toLocaleString()}
                                </span>
                                {progression.prestigeCount > 0 && (
                                    <span className="text-[8px] font-black uppercase" style={{ color: progression.rank.color }}>
                                        ✦ Prestige ×{progression.prestigeCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-2">
                            <span className="text-xl font-black" style={{ color: progression.rank.color }}>
                                ∞ SUPREMO
                            </span>
                            <p className="text-[9px] font-mono opacity-50 mt-1" style={{ color: '#fff' }}>
                                Legado: {(progression.legacyPoints || 0).toLocaleString()} pts
                            </p>
                        </div>
                    )}

                    {/* Quick stats row */}
                    <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t" style={{ borderColor: `${progression.rank.color}15` }}>
                        <div className="text-center">
                            <p className="text-sm font-black" style={{ color: '#fff' }}>{medalStats.unlocked}</p>
                            <p className="text-[7px] font-mono uppercase opacity-40" style={{ color: '#fff' }}>Medallas</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black" style={{ color: '#fff' }}>{progression.trophies.length}</p>
                            <p className="text-[7px] font-mono uppercase opacity-40" style={{ color: '#fff' }}>Trofeos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black" style={{ color: '#fff' }}>{progression.collectibles.length}</p>
                            <p className="text-[7px] font-mono uppercase opacity-40" style={{ color: '#fff' }}>Items</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black" style={{ color: '#fff' }}>{progression.counters.sessionsPlayed || progression.counters.consecutiveRoundsInSession}</p>
                            <p className="text-[7px] font-mono uppercase opacity-40" style={{ color: '#fff' }}>Rondas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section tabs */}
            <div className="flex gap-1 mx-5 mb-3 p-1 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                {([
                    { id: 'medals' as const, label: 'Medallas', icon: <Award size={13} />, count: `${medalStats.unlocked}/75` },
                    { id: 'trophies' as const, label: 'Trofeos', icon: <Trophy size={13} />, count: `${progression.trophies.length}/75` },
                    { id: 'collectibles' as const, label: 'Items', icon: <Package size={13} />, count: `${progression.collectibles.length}/75` },
                ]).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id)}
                        className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg transition-all"
                        style={{
                            backgroundColor: activeSection === tab.id ? `${theme.accent}20` : 'transparent',
                            color: activeSection === tab.id ? theme.accent : theme.sub,
                        }}
                    >
                        {tab.icon}
                        <span className="text-[8px] font-black uppercase tracking-wider">{tab.label}</span>
                        <span className="text-[7px] font-mono opacity-50">{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] no-scrollbar">
                {/* Medals section */}
                {activeSection === 'medals' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex gap-1 p-0.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                            {(['all', 'bronze', 'silver', 'gold'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setMedalFilter(f)}
                                    className="flex-1 py-1.5 rounded-md text-[8px] font-black uppercase tracking-wider transition-all"
                                    style={{
                                        backgroundColor: medalFilter === f ? `${f === 'all' ? theme.accent : TIER_COLORS[f === 'all' ? 'locked' : f]}20` : 'transparent',
                                        color: medalFilter === f ? (f === 'all' ? theme.accent : TIER_COLORS[f]) : theme.sub,
                                    }}
                                >
                                    {f === 'all' ? `Todas (${medalStats.unlocked})` : f === 'bronze' ? `🥉 ${medalStats.bronze}` : f === 'silver' ? `🥈 ${medalStats.silver}` : `🥇 ${medalStats.gold}`}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {filteredMedals.map(medal => {
                                const isLocked = medal.tier === 'locked';
                                const color = TIER_COLORS[medal.tier];
                                return (
                                    <div
                                        key={medal.id}
                                        className={`p-3 rounded-xl border text-center transition-all ${isLocked ? 'opacity-30' : ''}`}
                                        style={{
                                            backgroundColor: isLocked ? 'rgba(255,255,255,0.02)' : `${color}08`,
                                            borderColor: isLocked ? 'rgba(255,255,255,0.05)' : `${color}30`,
                                        }}
                                    >
                                        <div className="text-xl mb-1" style={{ filter: !isLocked ? `drop-shadow(0 0 4px ${color})` : 'none' }}>
                                            {medal.tier === 'gold' ? '🥇' : medal.tier === 'silver' ? '🥈' : medal.tier === 'bronze' ? '🥉' : '🔒'}
                                        </div>
                                        <p className="text-[8px] font-bold leading-tight truncate" style={{ color: isLocked ? theme.sub : color }}>
                                            {medal.name}
                                        </p>
                                        <p className="text-[7px] font-mono opacity-50 mt-0.5" style={{ color: theme.sub }}>
                                            {medal.block}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Trophies section */}
                {activeSection === 'trophies' && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                        {trophyList.map(trophy => (
                            <div
                                key={trophy.id}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${!trophy.unlocked ? 'opacity-30' : ''}`}
                                style={{
                                    backgroundColor: trophy.unlocked ? `${theme.accent}08` : 'rgba(255,255,255,0.02)',
                                    borderColor: trophy.unlocked ? `${theme.accent}30` : 'rgba(255,255,255,0.05)',
                                }}
                            >
                                <span className="text-lg">{trophy.unlocked ? '🏆' : '🔒'}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-wider truncate" style={{ color: trophy.unlocked ? '#fff' : theme.sub }}>
                                        {trophy.name}
                                    </p>
                                    <p className="text-[8px] font-mono opacity-50" style={{ color: theme.sub }}>
                                        {trophy.series} · +{trophy.xpReward} XP
                                    </p>
                                </div>
                                {trophy.unlocked && <Star size={12} style={{ color: theme.accent }} />}
                            </div>
                        ))}
                    </div>
                )}

                {/* Collectibles section */}
                {activeSection === 'collectibles' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                        {setList.map(set => (
                            <div key={set.id} className="rounded-2xl border overflow-hidden" style={{ borderColor: set.isComplete ? `${theme.accent}40` : 'rgba(255,255,255,0.05)' }}>
                                <div
                                    className="flex items-center justify-between px-4 py-3"
                                    style={{
                                        backgroundColor: set.isComplete ? `${theme.accent}10` : 'rgba(255,255,255,0.03)',
                                    }}
                                >
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: set.isComplete ? theme.accent : '#fff' }}>
                                            {set.name}
                                        </p>
                                        <p className="text-[8px] font-mono opacity-50" style={{ color: theme.sub }}>
                                            {set.subtitle} · {set.completedCount}/{set.items.length}
                                        </p>
                                    </div>
                                    {set.isComplete && (
                                        <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
                                            ✓ COMPLETO
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-5 gap-1 p-2">
                                    {set.items.map(item => (
                                        <div
                                            key={item.id}
                                            className={`flex flex-col items-center gap-0.5 py-2 rounded-lg transition-all ${!item.unlocked ? 'opacity-20' : ''}`}
                                            style={{
                                                backgroundColor: item.unlocked ? 'rgba(255,255,255,0.05)' : 'transparent',
                                            }}
                                        >
                                            <span className="text-lg">{item.unlocked ? item.icon : '❓'}</span>
                                            <span className="text-[6px] font-bold text-center leading-tight truncate w-full px-0.5" style={{ color: theme.sub }}>
                                                {item.unlocked ? item.name : '???'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
