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

export const EXERCISE_GIFS: Record<string, string> = {
    'Push-Ups': 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXpsbXB0aDJ1bHFiZ3VtdnY2OHUyMjl3cXZndXQ2cHJwd3NpcWdyaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohze1qkqPZHMrEuwo/giphy.gif',
    'Dumbbell Chest Press (Floor)': 'https://gymvisual.com/img/p/2/1/5/4/1/21541.gif',
    'Dumbbell Fly (Floor)': 'https://gymvisual.com/img/p/2/1/5/4/1/21541.gif',
    'Dumbbell Shoulder Press': 'https://gymvisual.com/img/p/5/1/4/6/5146.gif',
    'Lateral Raises': 'https://gymvisual.com/img/p/1/9/1/5/1/19151.gif',
    'Bent-Over Dumbbell Rows': 'https://gymvisual.com/img/p/2/7/3/3/8/27338.gif',
    'One-Arm Dumbbell Rows': 'https://gymvisual.com/img/p/5/9/2/4/5924.gif',
    'Barbell Rows (underhand grip)': 'https://cdn.jefit.com/assets/img/exercises/gifs/9.gif',
    'Rear Delt Raises': 'https://imgs.search.brave.com/f6uvzPLRLDmFIbtRcDkpCrJJX00lErouaBCzui02YaQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS50ZW5vci5jb20v/SFR2anVmdWp1SkFB/QUFBTS9yZWFyLXJh/aXNlLXJlYXIuZ2lm.gif',
    'Bicep Curls (Dumbbells)': 'https://media1.tenor.com/m/As5RbeZ43bEAAAAd/seated-biceps-curl.gif',
    'Barbell Curls': 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2xpMWNxc2hjbHI4cnc4ZTd1aWZqbjltMGF3ZGpnMzRidmxxdzQ1YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Bmq8cWxVY3P3H5Masb/giphy.webp',
    'Hammer Curls': 'https://gymvisual.com/img/p/5/0/4/6/5046.gif',
    'Wrist Curls': 'https://gymvisual.com/img/p/4/8/6/4/4864.gif',
    'Toe-up Sit-ups': 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjJ6bmVsbDhldjNpeHNlN3hwaXhuMG0yYTZqdmZ2ZGYxMW8wYm81OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/O46ISBTLiAB4k/200.webp',
    'Plank': 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGFjcjFrbGU4aG9nbzA1ZGZ3c2xvZTNoZGI4am1rYjhvN3g3MjFidyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/CLjw2mHysNEYw/giphy.webp',
    'Leg Raises': 'https://imgs.search.brave.com/J3zDpHNvM6B7kC3G1TFiaCbYqtqfLN6PZoQvIpP2HLo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9naWZk/Yi5jb20vaW1hZ2Vz/L2hpZ2gvbWFuLWRv/aW5nLWxlZy1yYWlz/ZS1jcnVuY2hlcy1l/eGVyY2lzZS1nd3p6/d2R6cXd4anIzOGo4/LmdpZg.gif',
    'Russian Twists': 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWoxbXo2ZWR5aHYwZ3BrMjhzeWY1YXl3Mm1lanNsc3puczB1dnQzMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/cpKD9u3S25xYL8tcbr/200.webp',
    'Abdominal Crunches': 'https://imgs.search.brave.com/FYftn-AzskzVZtKK3ksrYujGLWpcnYLiOf7t1C8F1S4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/aWNlZ2lmLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMi8w/OC9pY2VnaWYtMS53/ZWJw',
    'Goblet Squats': 'https://imgs.search.brave.com/FnUqraPPIrRZMJGxVRWaxHhUQBP-_wBgEMa4IysVYZ0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YTEudGVub3IuY29t/L20vb3ZxT2kybzlC/MDhBQUFBZC9zcXVh/dC1nb2JsZXQtc3F1/YXQuZ2lm.gif',
    'Lunges': 'https://imgs.search.brave.com/x9VbB9gE_Quqefa3Eib7hRRLHOA2xhVIAdpWypq8gQM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS50ZW5vci5jb20v/bUlDNWJiQ0lJRU1B/QUFBTS9sdW5nZXMt/d29ya291dHMuZ2lm.gif',
    'Romanian Deadlifts': 'https://imgs.search.brave.com/BfeYQmnQz43zQVoOUe_Pn8Ar21GuwDl-7nMuYHPW0W4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YTAuZ2lwaHkuY29t/L21lZGlhLzI2QlJI/SlY2ajlIak5RUndz/L2dpcGh5LmdpZg.gif',
    'Calf Raises': 'https://imgs.search.brave.com/CKbzGHQMM08nuEgpHhnqiOXUzgKodG-eKQyZriPFa-s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9neW12/aXN1YWwuY29tL2lt/Zy9wLzYvNi8zLzYv/NjYzNi5naWY.gif',
    'Hip Thrusts': 'https://barbend.com/wp-content/uploads/2022/02/hip-thrust-barbend-movement-gif-masters.gif'
};

export const WORKOUT_SCHEDULE: Record<number, DailyWorkout> = {
    1: { type: 'Chest & Shoulders', exercises: [{ name: 'Push-Ups', sets: '4 sets to failure' }, { name: 'Dumbbell Chest Press (Floor)', sets: '4 × 15' }, { name: 'Dumbbell Fly (Floor)', sets: '3 × 15' }, { name: 'Dumbbell Shoulder Press', sets: '3 × 15' }, { name: 'Lateral Raises', sets: '3 × 20' }], finisher: 'Barbell Floor Press – 2 × Failure' },
    2: { type: 'Back', exercises: [{ name: 'Bent-Over Dumbbell Rows', sets: '4 × 15' }, { name: 'One-Arm Dumbbell Rows', sets: '3 × 15' }, { name: 'Barbell Rows (underhand grip)', sets: '4 × 15' }, { name: 'Rear Delt Raises', sets: '3 × 20' }], finisher: 'Isometric row hold – 30 sec × 2' },
    3: { type: 'Arms', exercises: [{ name: 'Bicep Curls (Dumbbells)', sets: '4 × 15' }, { name: 'Barbell Curls', sets: '4 × 12' }, { name: 'Hammer Curls', sets: '3 × 12' }, { name: 'Wrist Curls', sets: '3 × 20' }, { name: 'Toe-up Sit-ups', sets: '3 × failure' }], finisher: 'Towel wringing – 3 sets' },
    4: { type: 'Abs & Core', exercises: [{ name: 'Plank', sets: '3 × 1 minute' }, { name: 'Leg Raises', sets: '4 × 15' }, { name: 'Russian Twists', sets: '3 × 30' }, { name: 'Abdominal Crunches', sets: '3 × 15' }, { name: 'Toe-up Sit-ups', sets: '3 × failure' }], finisher: 'Plank to Push-up – 2 × 12' },
    5: { type: 'Legs', exercises: [{ name: 'Goblet Squats', sets: '4 × 15' }, { name: 'Lunges', sets: '3 × 12' }, { name: 'Romanian Deadlifts', sets: '4 × 12' }, { name: 'Calf Raises', sets: '4 × 25' }, { name: 'Hip Thrusts', sets: '3 × 15' }], finisher: 'Wall sit – 2 rounds × 30 sec' },
    6: { type: 'Active Recovery', exercises: [{ name: 'Light Full Body / Stretch', sets: '30 mins' }] },
    0: { type: 'Rest', exercises: [] }
};

export const getWorkoutForToday = (): DailyWorkout => {
    const day = new Date().getDay();
    return WORKOUT_SCHEDULE[day];
};

export const getDefaultExercisesForDay = (dayIndex: number) => {
    const workout = WORKOUT_SCHEDULE[dayIndex];
    if (!workout || !workout.exercises) return [];
    
    return workout.exercises.map((exercise, index) => ({
        id: `default-${dayIndex}-${index}`,
        name: exercise.name,
        sets: exercise.sets,
        gifUrl: EXERCISE_GIFS[exercise.name],
        dayIndex,
        isDefault: true,
        isCompleted: false
    }));
};

export const getAllDefaultExercises = () => {
    const exercises: any[] = [];
    for (let day = 0; day <= 6; day++) {
        exercises.push(...getDefaultExercisesForDay(day));
    }
    return exercises;
};
