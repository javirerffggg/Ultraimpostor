import React from 'react';
import { ThemeConfig, SettingsPreset } from '../../types';
import { Save, Download, Trash2 } from 'lucide-react';
import { SectionContainer, SectionHeader, ContentCard } from './SettingsComponents';

interface PresetsSectionProps {
    presets: SettingsPreset[];
    onSave: (name: string) => void;
    onLoad: (id: string) => void;
    onDelete: (id: string) => void;
    theme: ThemeConfig;
    searchQuery?: string;
}

export const PresetsSection: React.FC<PresetsSectionProps> = ({ presets = [], onSave, onLoad, onDelete, theme, searchQuery = '' }) => {
    if (searchQuery && !'perfiles presets configuracion'.includes(searchQuery.toLowerCase())) return null;

    const handleSave = () => {
        const name = prompt('Nombre del nuevo perfil:');
        if (name) onSave(name);
    };

    return (
        <SectionContainer className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 fill-mode-both">
            <SectionHeader icon={<Save size={16} />} title="Perfiles de Configuración" subtitle="Guarda tus reglas favoritas" theme={theme} />
            <ContentCard theme={theme}>
                <div className="space-y-3">
                    <button
                        onClick={handleSave}
                        className="w-full py-3 rounded-xl border text-xs font-black uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
                        style={{ backgroundColor: `${theme.accent}15`, borderColor: `${theme.accent}40`, color: theme.accent }}
                    >
                        <Save size={14} /> Crear Nuevo Perfil
                    </button>

                    {presets && presets.length > 0 && (
                        <div className="space-y-2 mt-4">
                            {presets.map(preset => (
                                <div key={preset.id} className="flex items-center justify-between p-3 rounded-xl border" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: `${theme.border}40` }}>
                                    <span className="text-sm font-bold truncate flex-1" style={{ color: theme.text }}>{preset.name}</span>
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => onLoad(preset.id)} className="p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors" style={{ color: theme.accent }} aria-label="Cargar perfil">
                                            <Download size={14} />
                                        </button>
                                        <button onClick={() => { if(confirm('¿Borrar perfil?')) onDelete(preset.id); }} className="p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors text-red-400" aria-label="Borrar perfil">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ContentCard>
        </SectionContainer>
    );
};
