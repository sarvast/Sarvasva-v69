import { useState } from 'react';
import { useSarvasva } from '../context/SarvasvaContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Dumbbell, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { clsx } from 'clsx';

const WORKOUT_SCHEDULE = [
    { day: 'Sunday', target: 'Rest & Recovery', exercises: [] },
    {
        day: 'Monday', target: 'Chest & Triceps', exercises: [
            { name: 'Pushups', sets: '3 x 15' },
            { name: 'Dumbbell Bench Press', sets: '3 x 12' },
            { name: 'Tricep Dips', sets: '3 x 12' },
            { name: 'Chest Flys', sets: '3 x 15' }
        ]
    },
    {
        day: 'Tuesday', target: 'Back & Biceps', exercises: [
            { name: 'Pullups (or Lat Pulldown)', sets: '3 x 10' },
            { name: 'Dumbbell Rows', sets: '3 x 12' },
            { name: 'Bicep Curls', sets: '3 x 12' },
            { name: 'Face Pulls', sets: '3 x 15' }
        ]
    },
    {
        day: 'Wednesday', target: 'Shoulders & Core', exercises: [
            { name: 'Overhead Press', sets: '3 x 12' },
            { name: 'Lateral Raises', sets: '3 x 15' },
            { name: 'Front Raises', sets: '3 x 12' },
            { name: 'Plank', sets: '3 x 45s' },
            { name: 'Crunches', sets: '3 x 20' }
        ]
    },
    {
        day: 'Thursday', target: 'Cardio & Abs', exercises: [
            { name: 'HIIT / Jogging', sets: '20 mins' },
            { name: 'Leg Raises', sets: '3 x 15' },
            { name: 'Russian Twists', sets: '3 x 20' }
        ]
    },
    {
        day: 'Friday', target: 'Arms & Upper Body Pump', exercises: [
            { name: 'Hammer Curls', sets: '3 x 12' },
            { name: 'Tricep Extensions', sets: '3 x 15' },
            { name: 'Concentration Curls', sets: '3 x 12' },
            { name: 'Diamond Pushups', sets: '3 x 10' }
        ]
    },
    {
        day: 'Saturday', target: 'Legs', exercises: [
            { name: 'Squats', sets: '3 x 15' },
            { name: 'Lunges', sets: '3 x 12 per leg' },
            { name: 'Calf Raises', sets: '3 x 20' },
            { name: 'Wall Sit', sets: '3 x 45s' }
        ]
    },
];

export function Fitness() {
    const { dailyLog, toggleWorkout } = useSarvasva();
    const dayIndex = new Date().getDay();
    const todaysWorkout = WORKOUT_SCHEDULE[dayIndex];

    // Simulate checking off individual exercises (local state for now)
    const [checkedExercises, setCheckedExercises] = useState<number[]>([]);

    const handleCheck = (index: number) => {
        if (checkedExercises.includes(index)) {
            setCheckedExercises(checkedExercises.filter(i => i !== index));
        } else {
            setCheckedExercises([...checkedExercises, index]);
        }
    };

    if (!dailyLog) return <div>Loading...</div>;

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Fitness</h1>
                <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-neon-aqua flex items-center gap-1">
                    <Calendar size={12} /> {todaysWorkout.day}
                </div>
            </div>

            {/* Main Daily Workout Card */}
            <GlassCard className="p-6 relative overflow-hidden">
                {/* Background decorative icon */}
                <Dumbbell className="absolute -right-6 -top-6 text-white/5 rotate-[-15deg]" size={150} />

                <div className="relative z-10">
                    <div className="mb-6">
                        <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">Target Area</div>
                        <h2 className="text-3xl font-bold text-white leading-tight">{todaysWorkout.target}</h2>
                    </div>

                    {todaysWorkout.exercises.length > 0 ? (
                        <div className="space-y-3">
                            {todaysWorkout.exercises.map((ex, i) => {
                                const isChecked = checkedExercises.includes(i);
                                return (
                                    <div
                                        key={i}
                                        onClick={() => handleCheck(i)}
                                        className={clsx(
                                            "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                                            isChecked
                                                ? "bg-brand-primary/20 border-brand-primary/50"
                                                : "bg-white/5 border-white/5 hover:bg-white/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            {isChecked ? <CheckCircle2 size={20} className="text-brand-primary" /> : <Circle size={20} className="text-slate-500" />}
                                            <span className={clsx("font-medium", isChecked ? "text-white line-through opacity-50" : "text-slate-200")}>
                                                {ex.name}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-400 font-mono">{ex.sets}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-slate-400 italic">
                            Active rest day. Go for a walk or stretch.
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <Button
                            className="w-full"
                            variant={dailyLog.workout_done ? "primary" : "secondary"}
                            onClick={toggleWorkout}
                        >
                            {dailyLog.workout_done ? "Workout Completed ✓" : "Mark as Done"}
                        </Button>
                        <p className="text-center text-xs text-slate-500 mt-2">
                            {dailyLog.workout_done ? "Great job, Sarvasva!" : "Checking this calculates calorie burn automatically."}
                        </p>
                    </div>
                </div>
            </GlassCard>

            {/* Weekly Schedule Preview */}
            <div className="grid grid-cols-7 gap-1 mt-4">
                {WORKOUT_SCHEDULE.map((s, i) => {
                    const isToday = i === dayIndex;
                    return (
                        <div
                            key={s.day}
                            className={clsx(
                                "aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] border",
                                isToday
                                    ? "bg-brand-primary text-white border-brand-primary"
                                    : "bg-white/5 text-slate-500 border-transparent"
                            )}
                        >
                            <span>{s.day.slice(0, 3)}</span>
                            {isToday && <div className="w-1 h-1 bg-white rounded-full mt-1" />}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
