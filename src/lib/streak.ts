import { DailyLog } from './db';
import { format, subDays, parseISO } from 'date-fns';

export const calculateStreak = (logs: DailyLog[], userProfile: any): number => {
    if (!logs || !logs.length || !userProfile) return 0;

    try {
        const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
        let streak = 0;
        const currentDate = new Date();

        for (let i = 0; i < 365; i++) {
            const dateStr = format(subDays(currentDate, i), 'yyyy-MM-dd');
            const log = sortedLogs.find(l => l.date === dateStr);

            if (!log) break;

            const stepsGoalMet = log.steps >= (userProfile.stepGoal || 10000);
            const workoutDone = log.workout_done === true;
            const tdee = userProfile.tdee || 2000;
            const caloriesDeficit = log.calories_eaten <= tdee;

            if (stepsGoalMet && workoutDone && caloriesDeficit) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    } catch (error) {
        console.error('Streak error:', error);
        return 0;
    }
};

export const getStreakMotivation = (streak: number): string => {
    if (streak === 0) return "Start your journey today! 💪";
    if (streak === 1) return "Great start! Don't break it! 🔥";
    if (streak < 7) return `${streak} days strong! Keep going! 💯`;
    if (streak < 30) return `${streak} days! You're unstoppable! 🚀`;
    if (streak < 100) return `${streak} days! Beast mode activated! 👑`;
    return `${streak} days! LEGENDARY! 🏆`;
};
