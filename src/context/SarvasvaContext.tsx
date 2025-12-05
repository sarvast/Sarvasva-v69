import React, { createContext, useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getDailyLog, saveDailyLog, getAllFoodItems, saveFoodItem } from '../lib/db';
import { USER_DATA } from '../lib/constants';

interface DailyLogState {
    date: string;
    steps: number;
    water_ml: number;
    calories_eaten: number;
    calories_burned: number;
    workout_done: boolean;
    ai_hours: number;
    mistakes?: string[];
}

interface SarvasvaContextType {
    metrics: typeof USER_DATA;
    dailyLog: DailyLogState | null;
    timelineWeeks: number;
    addSteps: (count: number) => void;
    addWater: (ml: number) => void;
    addFood: (calories: number) => void;
    addFoodToDb: (name: string, calories: number) => Promise<void>;
    toggleWorkout: () => void;
    logAiHours: (hours: number) => void;
    foodDatabase: { name: string; calories: number }[];
    refreshData: () => void;
    error: string | null;
}

const SarvasvaContext = createContext<SarvasvaContextType | undefined>(undefined);

export function SarvasvaProvider({ children }: { children: React.ReactNode }) {
    const [dailyLog, setDailyLog] = useState<DailyLogState | null>(null);
    const [timelineWeeks, setTimelineWeeks] = useState(0);
    const [foodDatabase, setFoodDatabase] = useState<{ name: string; calories: number }[]>([]);
    const [error, setError] = useState<string | null>(null);

    const today = format(new Date(), 'yyyy-MM-dd');

    const loadData = async () => {
        try {
            setError(null);
            const log = await getDailyLog(today);
            if (log) {
                setDailyLog(log);
            } else {
                // Initialize new day
                const newLog = {
                    date: today,
                    steps: 0,
                    water_ml: 0,
                    calories_eaten: 0,
                    calories_burned: 0,
                    workout_done: false,
                    ai_hours: 0,
                    mistakes: []
                };
                await saveDailyLog(newLog);
                setDailyLog(newLog);
            }

            const foods = await getAllFoodItems();
            setFoodDatabase(foods);

            // Timeline Calculation Logic Placeholder
            const weightDiff = USER_DATA.STARTING_WEIGHT_KG - USER_DATA.TARGET_WEIGHT_KG;
            setTimelineWeeks(Math.ceil(weightDiff / 0.8)); // Approx 0.8kg/week
        } catch (err: any) {
            console.error("Context Load Error:", err);
            setError("Failed to load data: " + (err.message || 'Unknown DB Error'));

            // Fallback to avoid infinite loading screen
            setDailyLog({
                date: today,
                steps: 0,
                water_ml: 0,
                calories_eaten: 0,
                calories_burned: 0,
                workout_done: false,
                ai_hours: 0,
                mistakes: []
            });
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const updateLog = async (updates: Partial<DailyLogState>) => {
        if (!dailyLog) return;
        const newLog = { ...dailyLog, ...updates };
        setDailyLog(newLog);
        await saveDailyLog(newLog);
    };

    const addSteps = (count: number) => {
        if (!dailyLog) return;
        const kcalBurned = count * 0.04;
        updateLog({
            steps: dailyLog.steps + count,
            calories_burned: dailyLog.calories_burned + kcalBurned
        });
    };

    const addWater = (ml: number) => updateLog({ water_ml: (dailyLog?.water_ml || 0) + ml });

    const addFood = (calories: number) => {
        updateLog({ calories_eaten: (dailyLog?.calories_eaten || 0) + calories });
    };

    const addFoodToDb = async (name: string, calories: number) => {
        await saveFoodItem({ name, calories });
        setFoodDatabase(await getAllFoodItems());
    };

    const toggleWorkout = () => updateLog({ workout_done: !dailyLog?.workout_done });

    const logAiHours = (hours: number) => updateLog({ ai_hours: (dailyLog?.ai_hours || 0) + hours });

    return (
        <SarvasvaContext.Provider value={{
            metrics: USER_DATA,
            dailyLog,
            timelineWeeks,
            addSteps,
            addWater,
            addFood,
            addFoodToDb,
            toggleWorkout,
            logAiHours,
            foodDatabase,
            refreshData: loadData,
            error
        }}>
            {children}
        </SarvasvaContext.Provider>
    );
}

export function useSarvasva() {
    const context = useContext(SarvasvaContext);
    if (context === undefined) {
        throw new Error('useSarvasva must be used within a SarvasvaProvider');
    }
    return context;
}
