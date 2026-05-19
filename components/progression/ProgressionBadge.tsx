import React from 'react';
import { ThemeConfig, PlayerProgression } from '../../types';
import { xpToNextLevel } from '../../utils/progression/xpCurves';

interface Props {
    progression: PlayerProgression;
    theme: ThemeConfig;
    compact?: boolean;
}

export const ProgressionBadge: React.FC<Props> = ({ progression, theme, compact = false }) => {
    const { progress } = xpToNextLevel(progression.xp, progression.era);
    const rank = progression.rank;
    const isSupremo = progression.era === 'supremo';

    if (compact) {
        return (
            <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black" style={{ color: rank.color }}>
                    {rank.icon}
                </span>
                <span className="text-[9px] font-mono tabular-nums opacity-60" style={{ color: theme.sub }}>
                    {isSupremo ? '∞' : `Nv.${progression.level}`}
                </span>
            </div>
        );
    }

    return (
        <div
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl border transition-all"
            style={{
                backgroundColor: `${rank.color}08`,
                borderColor: `${rank.color}25`,
            }}
        >
            <span className="text-sm" style={{ filter: rank.glow ? `drop-shadow(0 0 6px ${rank.color})` : 'none' }}>
                {rank.icon}
            </span>
            <div className="flex flex-col min-w-0">
                <span
                    className="text-[9px] font-black uppercase tracking-wider truncate leading-tight"
                    style={{ color: rank.color }}
                >
                    {isSupremo ? (progression.supremoTitle || 'SUPREMO') : `Nv.${progression.level}`}
                </span>
                {/* XP micro-bar */}
                {!isSupremo && (
                    <div className="w-full h-[2px] rounded-full mt-0.5 overflow-hidden" style={{ backgroundColor: `${rank.color}15` }}>
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.round(progress * 100)}%`, backgroundColor: rank.color }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
