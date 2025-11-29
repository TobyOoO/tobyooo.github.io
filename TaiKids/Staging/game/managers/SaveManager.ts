
import { PlayerStatsData } from '../entities/PlayerStats';
import { Gender } from '../../components/GameModals/NamePicker';

export interface Persona {
    name: string;
    gender: Gender;
}

export interface GameSaveData extends PlayerStatsData {
    persona?: Persona;
    justCreated?: boolean;
}

const SAVE_KEY = 'pixel-room-save';

export const SaveManager = {
    /**
     * Overwrites the entire save file with the provided data.
     */
    save: (data: GameSaveData) => {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(SAVE_KEY, serialized);
            console.log('[SaveManager] Game saved.');
        } catch (e) {
            console.error('[SaveManager] Save failed:', e);
        }
    },

    /**
     * Loads the save data from local storage. Returns null if no save exists or error.
     */
    load: (): GameSaveData | null => {
        try {
            const serialized = localStorage.getItem(SAVE_KEY);
            if (!serialized || serialized === 'undefined') return null;
            return JSON.parse(serialized) as GameSaveData;
        } catch (e) {
            console.error('[SaveManager] Load failed:', e);
            return null;
        }
    },

    /**
     * Updates specific fields in the save file without overwriting the rest (e.g. persona).
     */
    update: (data: Partial<GameSaveData>) => {
        const current = SaveManager.load();
        if (current) {
            const newData = { ...current, ...data };
            // Ensure we cast to GameSaveData, assuming initialization handled elsewhere
            SaveManager.save(newData as GameSaveData);
        } else {
            // Safe fallback if update is called but no save exists (rare race condition)
            console.warn('[SaveManager] Update ignored: No active save found to update.');
        }
    },

    /**
     * Checks if a valid save file exists.
     */
    hasSave: (): boolean => {
        const data = SaveManager.load();
        // Basic validation: must have persona and week
        return !!(data && data.week !== undefined && data.persona);
    },

    /**
     * Deletes the save file.
     */
    clear: () => {
        localStorage.removeItem(SAVE_KEY);
    }
};

export default SaveManager;
