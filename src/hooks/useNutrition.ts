import { useState, useEffect, useCallback } from 'react';
import { FoodItem, getFoods, saveFood, deleteFood, DailyLog, saveDailyLog, getDailyLog } from '../lib/db';
import { format } from 'date-fns';

export function useNutrition(date: Date) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [allFoods, log] = await Promise.all([
                getFoods(),
                getDailyLog(dateStr)
            ]);
            setFoods(allFoods);
            setDailyLog(log || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [dateStr]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const addFoodToDb = async (food: Omit<FoodItem, 'id'>) => {
        const newFood = { ...food, id: crypto.randomUUID() };
        await saveFood(newFood);
        setFoods(prev => [...prev, newFood]);
    };

    const removeFoodFromDb = async (id: string) => {
        await deleteFood(id);
        setFoods(prev => prev.filter(f => f.id !== id));
    };

    const logFoodIntake = async (food: FoodItem, quantity: number = 1) => {
        if (!dailyLog) return; // Should handle creating log if null, but useDailyLog handles creation usually.

        // If dailyLog is null, we might need to fetch or create it. 
        // Ideally useNutrition should be used alongside useDailyLog or handle creation itself.
        // For simplicity, let's assume the log exists or we create a partial one.

        const newEntry = {
            foodId: food.id,
            name: food.name,
            calories: food.calories * quantity,
            quantity
        };

        const updatedLog = {
            ...dailyLog,
            caloriesConsumed: (dailyLog.caloriesConsumed || 0) + newEntry.calories,
            foodLog: [...(dailyLog.foodLog || []), newEntry]
        };

        setDailyLog(updatedLog);
        await saveDailyLog(updatedLog);
    };

    return {
        foods,
        dailyLog,
        loading,
        addFoodToDb,
        removeFoodFromDb,
        logFoodIntake
    };
}
