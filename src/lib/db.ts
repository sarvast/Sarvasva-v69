import { openDB, DBSchema } from 'idb';

export interface DailyLog {
    date: string; // ISO Date "YYYY-MM-DD"
    steps: number;
    water_ml: number;
    calories_eaten: number;
    calories_burned: number;
    workout_done: boolean;
    ai_hours: number;
    notes?: string;
    mistakes?: string[];
}

export interface FoodItem {
    name: string;
    calories: number;
}

export interface UserSettings {
    id: string;
    theme_preference?: 'light' | 'dark' | 'system';
    notifications_enabled: boolean;
    currentWeight?: number;
    activityLevel?: number;
    isOnboarded?: boolean;
    profile?: {
        name: string;
        height: number;
        startingWeight: number;
        currentWeight: number;
        targetWeight: number;
        age: number;
        gender: 'male' | 'female';
        activityFactor: number;
        stepGoal: number;
        waterGoal: number;
        bmr?: number;
        tdee?: number;
        bmi?: number;
    };
}

export interface CustomExercise {
    id: string;
    name: string;
    sets: string;
    dayIndex: number;
    gifUrl?: string;
    isCompleted?: boolean;
    isDefault?: boolean;
}

export interface ExerciseCompletion {
    id: string;
    exerciseId: string;
    date: string;
    completed: boolean;
}

interface SarvasvaDB extends DBSchema {
    daily_logs: {
        key: string;
        value: DailyLog;
    };
    food_database: {
        key: string;
        value: FoodItem;
    };
    settings: {
        key: string;
        value: UserSettings;
    };
    custom_exercises: {
        key: string;
        value: CustomExercise;
    };
    exercise_completions: {
        key: string;
        value: ExerciseCompletion;
    };
}



const DB_NAME = 'sarvasva-db';
const DB_VERSION = 4;

export const initDB = async () => {
    return openDB<SarvasvaDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('daily_logs')) {
                db.createObjectStore('daily_logs', { keyPath: 'date' });
            }
            if (!db.objectStoreNames.contains('food_database')) {
                db.createObjectStore('food_database', { keyPath: 'name' });
            }
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('custom_exercises')) {
                db.createObjectStore('custom_exercises', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('exercise_completions')) {
                db.createObjectStore('exercise_completions', { keyPath: 'id' });
            }
        },
    });
};

export const getDailyLog = async (date: string) => {
    const db = await initDB();
    return db.get('daily_logs', date);
};

export const saveDailyLog = async (log: DailyLog) => {
    const db = await initDB();
    return db.put('daily_logs', log);
};

export const getFoodItem = async (name: string) => {
    const db = await initDB();
    return db.get('food_database', name);
};

export const saveFoodItem = async (item: FoodItem) => {
    const db = await initDB();
    return db.put('food_database', item);
};

export const getAllFoodItems = async () => {
    const db = await initDB();
    return db.getAll('food_database');
};

export const getUserSettings = async () => {
    const db = await initDB();
    return db.get('settings', 'default');
};

export const saveUserSettings = async (settings: UserSettings) => {
    const db = await initDB();
    return db.put('settings', { ...settings, id: 'default' });
};

export const saveCustomExercise = async (exercise: CustomExercise) => {
    const db = await initDB();
    return db.put('custom_exercises', exercise);
};

export const getCustomExercises = async (dayIndex?: number) => {
    const db = await initDB();
    const exercises = await db.getAll('custom_exercises');
    return dayIndex !== undefined ? exercises.filter(ex => ex.dayIndex === dayIndex) : exercises;
};

export const deleteCustomExercise = async (id: string) => {
    const db = await initDB();
    return db.delete('custom_exercises', id);
};

export const saveExerciseCompletion = async (completion: ExerciseCompletion) => {
    const db = await initDB();
    return db.put('exercise_completions', completion);
};

export const getExerciseCompletions = async (date: string) => {
    const db = await initDB();
    const completions = await db.getAll('exercise_completions');
    return completions.filter(c => c.date === date);
};

export const clearDatabase = async () => {
    const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
    return new Promise<void>((resolve, reject) => {
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
        deleteRequest.onblocked = () => {
            console.warn("Delete blocked. Please close other tabs.");
        };
    });
};
