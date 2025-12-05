import { useEffect, useState } from 'react';
import { useSarvasva } from '../context/SarvasvaContext';

export function useReminders() {
    const { dailyLog, metrics } = useSarvasva();
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [lastNotifiedHour, setLastNotifiedHour] = useState<number>(-1);

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if ('Notification' in window) {
            const result = await Notification.requestPermission();
            setPermission(result);
            if (result === 'granted') {
                new Notification('🔥 Sarvasva Active', {
                    body: 'Ready to track your transformation! Stay consistent, stay strong.',
                    icon: '/icon.png'
                });
            }
        }
    };

    useEffect(() => {
        if (permission !== 'granted' || !dailyLog) return;

        const checkReminders = () => {
            const now = new Date();
            const hour = now.getHours();

            // Reset hour tracking at midnight
            if (hour === 0 && lastNotifiedHour !== -1) {
                setLastNotifiedHour(-1);
                return;
            }

            // Prevent duplicate notifications in the same hour
            if (lastNotifiedHour === hour) return;

            // Schedule: 2 PM (14) to 8 PM (20) -> Hourly Updates
            if (hour >= 14 && hour <= 20) {
                const remainingSteps = Math.max(0, metrics.STEP_GOAL - dailyLog.steps);
                const remainingWater = Math.max(0, metrics.WATER_GOAL_ML - dailyLog.water_ml);

                // Only notify if tasks are incomplete
                if (remainingSteps > 2000 || remainingWater > 1000 || !dailyLog.workout_done) {
                    let message = '⚠️ You\'re falling behind! ';
                    if (remainingSteps > 2000) message += `${remainingSteps} steps pending. `;
                    if (remainingWater > 1000) message += `${remainingWater}ml water needed. `;
                    if (!dailyLog.workout_done) message += 'Workout not done. ';
                    message += 'Get back on track NOW!';
                    
                    new Notification('🚨 Not On Track!', {
                        body: message,
                        icon: '/icon.png',
                        requireInteraction: true
                    });
                    setLastNotifiedHour(hour);
                }
            }

            // Schedule: 9 PM (21) -> End of Day Impact Report
            if (hour === 21 && lastNotifiedHour !== 21) {
                const stepDeficit = metrics.STEP_GOAL - dailyLog.steps;
                const waterDeficit = metrics.WATER_GOAL_ML - dailyLog.water_ml;
                const calorieDeficit = (metrics.BMR_ESTIMATE + dailyLog.calories_burned) - dailyLog.calories_eaten;

                let impactMsg = "Great day! You are on track to 80kg.";
                let title = "🌟 End of Day Summary";

                // Logic based on requirements: "Kya loose hua mere goal mein"
                if (stepDeficit > 2000 || dailyLog.workout_done === false || calorieDeficit < 500) {
                    title = "💔 You Failed Today";
                    impactMsg = "Bro, you're not serious about 80kg! ";
                    if (stepDeficit > 2000) impactMsg += `Lazy day = +0.1 weeks delay. `;
                    if (!dailyLog.workout_done) impactMsg += `No workout = +0.2 weeks delay. `;
                    if (calorieDeficit < 500) impactMsg += `Poor diet control. `;
                    impactMsg += "Stop making excuses. Tomorrow better be different!";
                } else {
                    title = "🔥 Beast Mode Activated";
                    impactMsg = "Solid day, Sarvasva! You're getting closer to 80kg. Keep this energy tomorrow!";
                }

                new Notification(title, {
                    body: impactMsg,
                    icon: '/icon.png',
                    requireInteraction: true // Keep it open until user dismisses because it's "badi notification"
                });
                setLastNotifiedHour(hour);
            }
        };

        const interval = setInterval(checkReminders, 300000); // Check every 5 minutes
        checkReminders(); // Initial check

        return () => clearInterval(interval);
    }, [permission, dailyLog, metrics, lastNotifiedHour]);

    return { permission, requestPermission };
}
