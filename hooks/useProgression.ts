import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, PlayerProgression, ProgressionUnlockEvent } from '../types';
import { evaluateProgression } from '../utils/progression/engine';
import { loadAllProgressions, saveAllProgressions, getProgression } from '../utils/progression/storage';
import { getVault } from '../utils/core/vault';

export function useProgression(gameState: GameState) {
    const [progressions, setProgressions] = useState<Record<string, PlayerProgression>>(() => loadAllProgressions());
    const [pendingUnlocks, setPendingUnlocks] = useState<ProgressionUnlockEvent[]>([]);
    const lastEvaluatedRound = useRef<number>(0);

    // Run evaluation when phase transitions to 'results'
    useEffect(() => {
        if (gameState.phase !== 'results') return;
        if (gameState.history.roundCounter === lastEvaluatedRound.current) return;
        lastEvaluatedRound.current = gameState.history.roundCounter;

        const matchLog = gameState.history.matchLogs[0];
        if (!matchLog) return;

        const currentProgressions = loadAllProgressions();
        const allUnlocks: ProgressionUnlockEvent[] = [];
        const updatedProgressions = { ...currentProgressions };

        for (const player of gameState.gameData) {
            const uid = player.name.trim().toLowerCase();
            const prog = getProgression(uid, currentProgressions);
            const vault = getVault(uid, gameState.history.playerStats);

            const { updatedProgression, unlocks } = evaluateProgression(
                player.name,
                prog,
                vault,
                matchLog,
                player,
                gameState,
                gameState.gameData
            );

            updatedProgressions[uid] = updatedProgression;
            allUnlocks.push(...unlocks.map(u => ({ ...u, description: `${player.name}: ${u.description || u.name}` })));
        }

        setProgressions(updatedProgressions);
        saveAllProgressions(updatedProgressions);

        if (allUnlocks.length > 0) {
            setPendingUnlocks(allUnlocks);
        }
    }, [gameState.phase, gameState.history.roundCounter]);

    const dismissUnlocks = useCallback(() => {
        setPendingUnlocks([]);
    }, []);

    const getPlayerProgression = useCallback((playerName: string): PlayerProgression => {
        const uid = playerName.trim().toLowerCase();
        return progressions[uid] || getProgression(uid);
    }, [progressions]);

    return { pendingUnlocks, progressions, dismissUnlocks, getPlayerProgression };
}
