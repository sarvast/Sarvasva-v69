import { useState, useEffect, useCallback } from 'react';
import { DailyLog, getDailyLog, saveDailyLog, getProfile } from '../lib/db';
import { format } from 'date-fns';

const DEFAULT_LOG: Omit<DailyLog, 'date'> = {
    steps: 0,
    waterMl: 0,
    workoutDone: false,
    aiStudyMinutes: 0,
    aiTasksCompleted: [],
    noJunkFood: true,
    noRelapse: true,
    caloriesConsumed: 0,
    foodLog: [],
};

export function useDailyLog(date: Date) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const [log, setLog] = useState<DailyLog | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchLog = useCallback(async () => {
        setLoading(true);
        try {
            const existingLog = await getDailyLog(dateStr);
            if (existingLog) {
                // Ensure new fields exist
                setLog({ ...DEFAULT_LOG, ...existingLog });
            } else {
                // Create default log
                const newLog: DailyLog = {
                    ...DEFAULT_LOG,
                    date: dateStr,
                };
                const profile = await getProfile();
                if (profile) {
                    newLog.weightKg = profile.weightKg;
                }
                setLog(newLog);
            }
        } catch (error) {
            console.error('Failed to fetch log', error);
        } finally {
            setLoading(false);
        }
    }, [dateStr]);

    useEffect(() => {
        fetchLog();
    }, [fetchLog]);

    const updateLog = async (updates: Partial<DailyLog>) => {
        if (!log) return;
        const updatedLog = { ...log, ...updates };
        setLog(updatedLog);
        await saveDailyLog(updatedLog);
    };

    return { log, loading, updateLog, refresh: fetchLog };
}
