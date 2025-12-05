export type WorkoutType = 'Chest & Shoulders' | 'Back' | 'Arms' | 'Abs & Core' | 'Legs' | 'Active Recovery' | 'Rest';

export interface Exercise {
    name: string;
    sets: string;
}

export interface DailyWorkout {
    type: WorkoutType;
    exercises: Exercise[];
    finisher?: string;
}

export const WORKOUT_SCHEDULE: Record<number, DailyWorkout> = {
    1: { // Monday
        type: 'Chest & Shoulders',
        exercises: [
            { name: 'Push-Ups', sets: '4 sets to failure' },
            { name: 'Dumbbell Chest Press (Floor)', sets: '4 × 15' },
            { name: 'Dumbbell Fly (Floor)', sets: '3 × 15' },
            { name: 'Dumbbell Shoulder Press', sets: '3 × 15' },
            { name: 'Lateral Raises', sets: '3 × 20' },
        ],
        finisher: 'Barbell Floor Press – 2 × Failure'
    },
    2: { // Tuesday
        type: 'Back',
        exercises: [
            { name: 'Bent-Over Dumbbell Rows', sets: '4 × 15' },
            { name: 'One-Arm Dumbbell Rows', sets: '3 × 15' },
            { name: 'Barbell Rows (underhand grip)', sets: '4 × 15' },
            { name: 'Rear Delt Raises', sets: '3 × 20' },
        ],
        finisher: 'Isometric row hold – 30 sec × 2'
    },
    3: { // Wednesday
        type: 'Arms',
        exercises: [
            { name: 'Bicep Curls (Dumbbells)', sets: '4 × 15' },
            { name: 'Barbell Curls', sets: '4 × 12' },
            { name: 'Hammer Curls', sets: '3 × 12' },
            { name: 'Wrist Curls', sets: '3 × 20' },
            { name: 'Toe-up Sit-ups', sets: '3 × failure' },
        ],
        finisher: 'Towel wringing – 3 sets'
    },
    4: { // Thursday
        type: 'Abs & Core',
        exercises: [
            { name: 'Plank', sets: '3 × 1 minute' },
            { name: 'Leg Raises', sets: '4 × 15' },
            { name: 'Russian Twists', sets: '3 × 30' },
            { name: 'Barbell Overhead Sit-ups', sets: '3 × 15' },
            { name: 'Mountain Climbers', sets: '3 × 30 sec' },
        ],
        finisher: 'Plank to Push-up – 2 × 12'
    },
    5: { // Friday
        type: 'Legs',
        exercises: [
            { name: 'Goblet Squats', sets: '4 × 15' },
            { name: 'Lunges', sets: '3 × 12' },
            { name: 'Romanian Deadlifts', sets: '4 × 12' },
            { name: 'Calf Raises', sets: '4 × 25' },
            { name: 'Hip Thrusts', sets: '3 × 15' },
        ],
        finisher: 'Wall sit – 2 rounds × 30 sec'
    },
    6: { // Saturday
        type: 'Active Recovery',
        exercises: [
            { name: 'Light Full Body / Stretch', sets: '30 mins' }
        ]
    },
    0: { // Sunday
        type: 'Rest',
        exercises: []
    }
};

export const getWorkoutForToday = (): DailyWorkout => {
    const day = new Date().getDay();
    return WORKOUT_SCHEDULE[day];
};
