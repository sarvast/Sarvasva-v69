import { openDB, DBSchema } from 'idb';

interface DailyLog {
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

interface FoodItem {
    name: string;
    calories: number;
}

interface UserSettings {
    id: string; // 'default'
    theme_preference?: 'light' | 'dark' | 'system';
    notifications_enabled: boolean;
}

interface SarvasvaDB extends DBSchema {
    daily_logs: {
        key: string; // date
        value: DailyLog;
    };
    food_database: {
        key: string; // name
        value: FoodItem;
    };
    settings: {
        key: string;
        value: UserSettings;
    };
}

const DB_NAME = 'sarvasva-db';
const DB_VERSION = 3;

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
}

export const clearDatabase = async () => {
    const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
    return new Promise<void>((resolve, reject) => {
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
        deleteRequest.onblocked = () => {
            console.warn("Delete blocked. Please close other tabs.");
            // We can't easily resolve here, but usually reload works
        };
    });
};
