import { UserProfile } from './db';

// Mifflin-St Jeor Equation
export const calculateBMR = (weightKg: number, heightCm: number, age: number, gender: 'male' | 'female' = 'male') => {
    const s = gender === 'male' ? 5 : -161;
    return 10 * weightKg + 6.25 * heightCm - 5 * age + s;
};

export const calculateTDEE = (bmr: number, activityLevel: UserProfile['activityLevel']) => {
    const multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9,
    };
    return Math.round(bmr * (multipliers[activityLevel] || 1.2));
};

export const calculateBMI = (weightKg: number, heightCm: number) => {
    const heightM = heightCm / 100;
    return Number((weightKg / (heightM * heightM)).toFixed(1));
};

export const getCalorieGoal = (tdee: number, goal: 'loss' | 'maintain' | 'gain' = 'loss') => {
    if (goal === 'loss') return tdee - 500; // 0.5kg per week
    if (goal === 'gain') return tdee + 500;
    return tdee;
};

export const estimateWeeksToGoal = (currentWeight: number, targetWeight: number, weeklyDeficit: number = 3500) => {
    const weightDiff = currentWeight - targetWeight;
    if (weightDiff <= 0) return 0;
    const caloriesPerKg = 7700;
    const totalDeficitNeeded = weightDiff * caloriesPerKg;
    return Math.ceil(totalDeficitNeeded / weeklyDeficit);
};
