import React, { useState } from 'react';
import { ThemeConfig, ThemeName, GameState, SettingsPreset } from '../types';
import { X, BookOpen, ChevronRight, Search, Gamepad2, Layers, Palette, Settings2 } from 'lucide-react';
import { VisualEngineSection } from './settings/VisualEngineSection';
import { SensorialSection } from './settings/SensorialSection';
import { RevealMethodSection } from './settings/RevealMethodSection';
import { CategoryLogicSection } from './settings/CategoryLogicSection';
import { MemorySection } from './settings/MemorySection';
import { PerformanceSection } from './settings/PerformanceSection';
import { PREMIUM_THEMES } from './settings/settingsUtils';
import { InterfaceSection } from './settings/InterfaceSection';
import { PresetsSection } from './settings/PresetsSection';
import { StatsSection } from './settings/StatsSection';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    theme: ThemeConfig;
    themeName: ThemeName;
    setThemeName: React.Dispatch<React.SetStateAction<ThemeName>>;
    gameState: GameState;
    onUpdateSettings: (s: Partial<GameState['settings']>) => void;
    onOpenHowToPlay: () => void;
    onBackToHome: () => void;
    volume?: number;
    setVolume?: (v: number) => void;
    isInline?: boolean;
    settingsPresets: SettingsPreset[];
    onSaveSettingsPreset: (name: string) => void;
    onLoadSettingsPreset: (id: string) => void;
    onDeleteSettingsPreset: (id: string) => void;
}

const TABS = [
    { id: 'Juego', icon: <Gamepad2 size={16} /> },
    { id: 'Cartas', icon: <Layers size={16} /> },
    { id: 'Visual', icon: <Palette size={16} /> },
    { id: 'Sistema', icon: <Settings2 size={16} /> }
] as const;

type TabId = typeof TABS[number]['id'];

export const SettingsDrawer: React.FC<Props> = ({
    isOpen, onClose, theme, themeName, setThemeName,
    gameState, onUpdateSettings, onOpenHowToPlay,
    volume, setVolume, isInline = false,
    settingsPresets, onSaveSettingsPreset, onLoadSettingsPreset, onDeleteSettingsPreset
}) => {
    const isPremium = PREMIUM_THEMES.includes(themeName);
    const [activeTab, setActiveTab] = useState<TabId>('Juego');
    const [searchQuery, setSearchQuery] = useState('');

    const content = (
        <div
            className={isInline
                ? "relative w-full flex flex-col animate-in fade-in duration-300"
                : `absolute inset-0 flex flex-col overflow-hidden transition-transform duration-300 ${
                    isOpen ? 'translate-y-0' : 'translate-y-4'
                }`
            }
            style={{ backgroundColor: isInline ? 'transparent' : (isPremium ? `${theme.bg}F5` : theme.bg) }}
        >
            {!isInline && (
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
                    }}
                />
            )}

            {!isInline && (
                <div className="absolute top-0 right-0 z-50 p-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pointer-events-none">
                    <button
                        onClick={onClose}
                        className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 pointer-events-auto backdrop-blur-md border shadow-lg hover:bg-white/10"
                        style={{ backgroundColor: `${theme.bg}80`, borderColor: 'rgba(255,255,255,0.1)', color: theme.text }}
                        aria-label="Cerrar ajustes"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>
            )}

            {!isInline && (
                <>
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/10 to-transparent z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none" />
                </>
            )}

            <div className={isInline
                ? "w-full space-y-6 pb-32"
                : "h-full overflow-y-auto overflow-x-hidden p-6 space-y-6 pb-32 no-scrollbar"
            }>
                {/* Header */}
                <div className={isInline ? "pt-2" : "pt-[calc(1.5rem+env(safe-area-inset-top))]"}>
                    <h2
                        style={{ color: theme.text }}
                        className="text-3xl font-black italic tracking-tighter drop-shadow-sm mb-2"
                    >
                        SISTEMA
                    </h2>
                    <div className="flex items-center gap-2 mb-4">
                        <span
                            style={{ color: theme.sub }}
                            className="text-[10px] font-mono uppercase tracking-widest opacity-70"
                        >
                            Configuración v2.5 · Ultra
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    {/* Search Bar */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search size={16} style={{ color: theme.sub }} className="group-focus-within:text-white transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar ajustes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all focus:outline-none focus:ring-2"
                            style={{ 
                                backgroundColor: `${theme.cardBg}80`, 
                                borderColor: `${theme.border}40`, 
                                color: theme.text,
                                '--tw-ring-color': `${theme.accent}50`
                            } as React.CSSProperties}
                        />
                    </div>
                </div>

                {/* Tabs - Only show if not searching */}
                {!searchQuery && (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="flex-1 min-w-[85px] py-2.5 px-3 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-300"
                                style={{
                                    backgroundColor: activeTab === tab.id ? `${theme.accent}15` : 'rgba(255,255,255,0.03)',
                                    color: activeTab === tab.id ? theme.accent : theme.sub,
                                    boxShadow: activeTab === tab.id ? `0 4px 12px -4px ${theme.accent}40` : 'none',
                                    border: `1px solid ${activeTab === tab.id ? `${theme.accent}40` : 'transparent'}`
                                }}
                            >
                                {tab.icon}
                                <span className="text-[9px] font-black uppercase tracking-wider">{tab.id}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Sections Rendering based on activeTab or Search */}
                {(searchQuery || activeTab === 'Juego') && (
                    <div className="space-y-6">
                        {/* Here we would have Game Settings like Impostor Count, Modes... 
                            Wait, where are the "Juego" settings? They are currently in SetupView.
                            Ah, the prompt meant that CategoryLogicSection is part of System/Game?
                            Let's map them properly based on previous architecture. */}
                        <CategoryLogicSection gameState={gameState} theme={theme} onUpdateSettings={onUpdateSettings} searchQuery={searchQuery} />
                    </div>
                )}

                {(searchQuery || activeTab === 'Cartas') && (
                    <div className="space-y-6">
                        <RevealMethodSection gameState={gameState} theme={theme} onUpdateSettings={onUpdateSettings} searchQuery={searchQuery} />
                        <MemorySection gameState={gameState} theme={theme} onUpdateSettings={onUpdateSettings} searchQuery={searchQuery} />
                    </div>
                )}

                {(searchQuery || activeTab === 'Visual') && (
                    <div className="space-y-6">
                        <VisualEngineSection themeName={themeName} setThemeName={setThemeName} theme={theme} searchQuery={searchQuery} />
                        <InterfaceSection gameState={gameState} theme={theme} onUpdateSettings={onUpdateSettings} searchQuery={searchQuery} />
                        <SensorialSection gameState={gameState} theme={theme} volume={volume} setVolume={setVolume} onUpdateSettings={onUpdateSettings} searchQuery={searchQuery} />
                    </div>
                )}

                {(searchQuery || activeTab === 'Sistema') && (
                    <div className="space-y-6">
                        <PerformanceSection gameState={gameState} theme={theme} onUpdateSettings={onUpdateSettings} searchQuery={searchQuery} />
                        <PresetsSection presets={settingsPresets} onSave={onSaveSettingsPreset} onLoad={onLoadSettingsPreset} onDelete={onDeleteSettingsPreset} theme={theme} searchQuery={searchQuery} />
                        <StatsSection gameState={gameState} theme={theme} searchQuery={searchQuery} />
                    </div>
                )}

                {/* Manual button - Always show at the bottom if not searching */}
                {!searchQuery && (
                    <button
                        onClick={onOpenHowToPlay}
                        className="w-full relative overflow-hidden p-6 rounded-3xl border transition-all duration-300 active:scale-[0.98] group"
                        style={{
                            backgroundColor: `${theme.accent}10`,
                            borderColor: `${theme.accent}40`,
                            boxShadow: `0 8px 32px -12px ${theme.accent}30`
                        }}
                        aria-label="Abrir manual operativo"
                    >
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                            style={{ background: `linear-gradient(135deg, ${theme.accent}15 0%, transparent 100%)` }}
                        />
                        <div className="flex items-center gap-4 relative z-10">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                                style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
                            >
                                <BookOpen size={24} strokeWidth={2.5} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-base font-black uppercase tracking-wide mb-1" style={{ color: theme.text }}>
                                    Manual Operativo
                                </p>
                                <p className="text-[10px] font-mono opacity-60 uppercase" style={{ color: theme.sub }}>
                                    Reglas · Roles · Guías completas
                                </p>
                            </div>
                            <ChevronRight
                                size={20}
                                style={{ color: theme.accent }}
                                className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                            />
                        </div>
                    </button>
                )}
            </div>
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );

    if (isInline) {
        return <div className="w-full">{content}</div>;
    }

    return (
        <div
            className={`fixed inset-0 z-[100] transition-all duration-300 ${
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
            {content}
        </div>
    );
};
