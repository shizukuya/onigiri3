import * as FileSystem from 'expo-file-system/legacy';

const SAVE_FILE_URI = FileSystem.documentDirectory + 'saveData.json';

export interface SaveData {
    currentLevel: number;
    highScores: Record<number, number>; // levelIndex -> score
    lives: number;
    bgmEnabled: boolean;
}

const DEFAULT_DATA: SaveData = {
    currentLevel: 0,
    highScores: {},
    lives: 5,
    bgmEnabled: true,
};

export const saveGameData = async (data: Partial<SaveData>) => {
    try {
        const currentData = await loadGameData();
        const newData = { ...currentData, ...data };
        await FileSystem.writeAsStringAsync(SAVE_FILE_URI, JSON.stringify(newData));
        return newData;
    } catch (error) {
        console.error('Failed to save game data:', error);
        return null;
    }
};

export const loadGameData = async (): Promise<SaveData> => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(SAVE_FILE_URI);
        if (!fileInfo.exists) {
            return DEFAULT_DATA;
        }
        const content = await FileSystem.readAsStringAsync(SAVE_FILE_URI);
        return JSON.parse(content);
    } catch (error) {
        console.error('Failed to load game data:', error);
        return DEFAULT_DATA;
    }
};

export const resetGameData = async () => {
    try {
        await FileSystem.deleteAsync(SAVE_FILE_URI, { idempotent: true });
        return DEFAULT_DATA;
    } catch (error) {
        console.error('Failed to reset game data:', error);
        return DEFAULT_DATA;
    }
};

export const saveHighScore = async (levelId: number, score: number) => {
    try {
        const currentData = await loadGameData();
        const currentHighScores = currentData.highScores || {};
        const currentScore = currentHighScores[levelId] || 0;

        if (score > currentScore) {
            const newHighScores = { ...currentHighScores, [levelId]: score };
            await saveGameData({ highScores: newHighScores });
        }
    } catch (error) {
        console.error('Failed to save high score:', error);
    }
};
