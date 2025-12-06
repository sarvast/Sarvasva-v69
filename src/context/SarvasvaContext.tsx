import React, { createContext, useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getDailyLog, saveDailyLog, getAllFoodItems, saveFoodItem, getUserSettings, saveUserSettings, UserSettings, getCustomExercises, saveCustomExercise, deleteCustomExercise, CustomExercise, saveExerciseCompletion, getExerciseCompletions, ExerciseCompletion, getAllDailyLogs } from '../lib/db';
import { UserProfile, calculateBMR, calculateTDEE, calculateBMI, calculateTimelineWeeks } from '../lib/constants';
import { getAllDefaultExercises } from '../lib/workout-data';

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
    userProfile: UserProfile | null;
    isOnboarded: boolean;
    metrics: {
        BMR: number;
        TDEE: number;
        BMI: string;
    };
    dailyLog: DailyLogState | null;
    timelineWeeks: number;
    streak: number;
    customExercises: CustomExercise[];
    exerciseCompletions: ExerciseCompletion[];
    addSteps: (count: number) => void;
    addWater: (ml: number) => void;
    addFood: (calories: number) => void;
    addFoodToDb: (name: string, calories: number) => Promise<void>;
    toggleWorkout: () => void;
    toggleExerciseCompletion: (exerciseId: string) => Promise<void>;
    logAiHours: (hours: number) => void;
    foodDatabase: { name: string; calories: number }[];
    refreshData: () => void;
    updateWeight: (weight: number) => Promise<void>;
    updateTargetWeight: (weight: number) => Promise<void>;
    updateGoals: (stepGoal: number, waterGoal: number) => Promise<void>;
    completeOnboarding: (profile: UserProfile) => Promise<void>;
    addCustomExercise: (exercise: Omit<CustomExercise, 'id'>) => Promise<void>;
    removeCustomExercise: (id: string) => Promise<void>;
    initializeDefaultExercises: () => Promise<void>;
    error: string | null;
}

const SarvasvaContext = createContext<SarvasvaContextType | undefined>(undefined);

export function SarvasvaProvider({ children }: { children: React.ReactNode }) {
    const [dailyLog, setDailyLog] = useState<DailyLogState | null>(null);
    const [timelineWeeks, setTimelineWeeks] = useState(0);
    const [foodDatabase, setFoodDatabase] = useState<{ name: string; calories: number }[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isOnboarded, setIsOnboarded] = useState(false);
    const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);
    const [exerciseCompletions, setExerciseCompletions] = useState<ExerciseCompletion[]>([]);
    const [streak, setStreak] = useState(0);
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

            // Load user settings and profile
            const settings = await getUserSettings();
            if (settings?.isOnboarded && settings.profile) {
                setUserProfile({
                    ...settings.profile,
                    currentWeight: settings.currentWeight || settings.profile.startingWeight
                });
                setIsOnboarded(true);
                setTimelineWeeks(calculateTimelineWeeks(settings.currentWeight || settings.profile.startingWeight, settings.profile.targetWeight));
            } else {
                setIsOnboarded(false);
            }

            // Load custom exercises
            const exercises = await getCustomExercises();
            if (exercises.length === 0) {
                const defaultExercises = getAllDefaultExercises();
                for (const exercise of defaultExercises) {
                    await saveCustomExercise(exercise);
                }
                setCustomExercises(await getCustomExercises());
            } else {
                setCustomExercises(exercises);
            }

            // Load exercise completions for today
            const completions = await getExerciseCompletions(today);
            setExerciseCompletions(completions);

            // Calculate streak
            if (settings?.profile) {
                const allLogs = await getAllDailyLogs();
                const { calculateStreak } = await import('../lib/streak');
                setStreak(calculateStreak(allLogs, settings.profile));
            }
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

    const updateWeight = async (weight: number) => {
        if (!userProfile) return;
        const updatedProfile = { 
            ...userProfile, 
            currentWeight: weight,
            bmr: calculateBMR(weight, userProfile.height, userProfile.age, userProfile.gender),
            tdee: calculateTDEE(calculateBMR(weight, userProfile.height, userProfile.age, userProfile.gender), userProfile.activityFactor),
            bmi: parseFloat(calculateBMI(weight, userProfile.height))
        };
        setUserProfile(updatedProfile);
        const settings = await getUserSettings();
        if (settings) {
            await saveUserSettings({ ...settings, currentWeight: weight, profile: updatedProfile });
        }
        setTimelineWeeks(calculateTimelineWeeks(weight, userProfile.targetWeight));
    };

    const updateTargetWeight = async (weight: number) => {
        if (!userProfile) return;
        const updatedProfile = { ...userProfile, targetWeight: weight };
        setUserProfile(updatedProfile);
        const settings = await getUserSettings();
        if (settings) {
            await saveUserSettings({ ...settings, profile: updatedProfile });
        }
        setTimelineWeeks(calculateTimelineWeeks(userProfile.currentWeight, weight));
    };

    const updateGoals = async (stepGoal: number, waterGoal: number) => {
        if (!userProfile) return;
        const updatedProfile = { ...userProfile, stepGoal, waterGoal };
        setUserProfile(updatedProfile);
        const settings = await getUserSettings();
        if (settings) {
            await saveUserSettings({ ...settings, profile: updatedProfile });
        }
    };

    const completeOnboarding = async (profile: UserProfile) => {
        const settings: UserSettings = {
            id: 'default',
            notifications_enabled: true,
            isOnboarded: true,
            currentWeight: profile.currentWeight,
            activityLevel: profile.activityFactor,
            profile: profile
        };
        await saveUserSettings(settings);
        setUserProfile(profile);
        setIsOnboarded(true);
        setTimelineWeeks(calculateTimelineWeeks(profile.currentWeight, profile.targetWeight));
    };

    const addCustomExercise = async (exercise: Omit<CustomExercise, 'id'>) => {
        try {
            const newExercise = { ...exercise, id: Date.now().toString() };
            await saveCustomExercise(newExercise);
            const updatedExercises = await getCustomExercises();
            setCustomExercises(updatedExercises);
        } catch (error) {
            console.error('Error adding exercise:', error);
        }
    };

    const removeCustomExercise = async (id: string) => {
        await deleteCustomExercise(id);
        setCustomExercises(await getCustomExercises());
    };

    const toggleExerciseCompletion = async (exerciseId: string) => {
        const existing = exerciseCompletions.find(c => c.exerciseId === exerciseId);
        const completion: ExerciseCompletion = {
            id: `${exerciseId}-${today}`,
            exerciseId,
            date: today,
            completed: existing ? !existing.completed : true
        };
        await saveExerciseCompletion(completion);
        setExerciseCompletions(await getExerciseCompletions(today));
    };

    const initializeDefaultExercises = async () => {
        try {
            const existing = await getCustomExercises();
            if (existing.length === 0) {
                const defaultExercises = getAllDefaultExercises();
                for (const exercise of defaultExercises) {
                    await saveCustomExercise(exercise);
                }
                const updated = await getCustomExercises();
                setCustomExercises(updated);
                console.log('Initialized', updated.length, 'exercises');
            }
        } catch (error) {
            console.error('Failed to initialize exercises:', error);
        }
    };

    // Calculate dynamic metrics (use stored values if available, otherwise calculate)
    const metrics = userProfile ? {
        BMR: userProfile.bmr || calculateBMR(userProfile.currentWeight, userProfile.height, userProfile.age, userProfile.gender),
        TDEE: userProfile.tdee || calculateTDEE(userProfile.bmr || calculateBMR(userProfile.currentWeight, userProfile.height, userProfile.age, userProfile.gender), userProfile.activityFactor),
        BMI: userProfile.bmi?.toString() || calculateBMI(userProfile.currentWeight, userProfile.height),
    } : { BMR: 0, TDEE: 0, BMI: '0' };

    return (
        <SarvasvaContext.Provider value={{
            userProfile,
            isOnboarded,
            metrics,
            dailyLog,
            timelineWeeks,
            streak,
            customExercises,
            exerciseCompletions,
            addSteps,
            addWater,
            addFood,
            addFoodToDb,
            toggleWorkout,
            toggleExerciseCompletion,
            logAiHours,
            foodDatabase,
            refreshData: loadData,
            updateWeight,
            updateTargetWeight,
            updateGoals,
            completeOnboarding,
            addCustomExercise,
            removeCustomExercise,
            initializeDefaultExercises,
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
