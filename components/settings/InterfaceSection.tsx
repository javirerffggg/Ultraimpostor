import React from 'react';
import { Smartphone, BellOff } from 'lucide-react';
import { ThemeConfig, GameState } from '../../types';
import {
    SectionContainer, SectionHeader, ContentCard, SettingRow, PremiumToggle
} from './SettingsComponents';

interface Props {
    gameState: GameState;
    theme: ThemeConfig;
    onUpdateSettings: (s: Partial<GameState['settings']>) => void;
}

export const InterfaceSection: React.FC<Props & { searchQuery?: string }> = ({ gameState, theme, onUpdateSettings, searchQuery = '' }) => {
    if (searchQuery && !'interfaz diseño pestañas tabs navegacion layout progresión nivel popups'.includes(searchQuery.toLowerCase())) return null;

    return (
        <SectionContainer className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 fill-mode-both">
            <SectionHeader
                icon={<Smartphone size={16} />}
                title="Diseño e Interfaz"
                subtitle="Layout y fluidez visual"
                theme={theme}
            />

            <ContentCard theme={theme} variant="solid">
                <SettingRow
                    icon={<Smartphone size={16} />}
                    title="Layout por Pestañas (iOS)"
                    subtitle="Navegación inferior con tabs y pantallas extendidas"
                    action={
                        <PremiumToggle
                            active={!!gameState.settings.useTabbedLayout}
                            onClick={() => onUpdateSettings({ useTabbedLayout: !gameState.settings.useTabbedLayout })}
                            theme={theme}
                        />
                    }
                    theme={theme}
                />

                <SettingRow
                    icon={<BellOff size={16} />}
                    title="Silenciar Popups de Nivel"
                    subtitle="Oculta los avisos flotantes de subida de nivel y desbloqueos de medallas/items"
                    action={
                        <PremiumToggle
                            active={!!gameState.settings.disableUnlockPopups}
                            onClick={() => onUpdateSettings({ disableUnlockPopups: !gameState.settings.disableUnlockPopups })}
                            theme={theme}
                        />
                    }
                    theme={theme}
                    noBorder
                />
            </ContentCard>
        </SectionContainer>
    );
};
