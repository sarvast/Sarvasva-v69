
export const USER_DATA = {
    NAME: "Sarvasva",
    FULL_NAME: "Sarthak Srivastava",
    HEIGHT_CM: 183,
    STARTING_WEIGHT_KG: 115,
    TARGET_WEIGHT_KG: 80,
    // Calculated based on Mifflin-St Jeor Equation (approx)
    // BMR = 10*weight + 6.25*height - 5*age + 5 (Assuming age ~25 for now, easy to update)
    // using generic high BMR for 115kg male
    BMR_ESTIMATE: 2200,
    ACTIVITY_FACTOR: 1.375, // Lightly active to start
    STEP_GOAL: 10000,
    WATER_GOAL_ML: 4000,
};

export const APP_CONFIG = {
    STEPS_GOAL_MIN: 6000,
    STEPS_GOAL_MAX: 10000,
    WATER_GOAL_ML: 4000,
    SLEEP_GOAL_HRS: 7,
    STUDY_GOAL_HRS: 4,
};

export const GREETINGS = {
    MORNING: "Good Morning, Sarvasva 🌅. Time to dominate.",
    AFTERNOON: "Good Afternoon, Sarvasva ☀️. Stay focused.",
    EVENING: "Good Evening, Sarvasva 🌆. Push harder.",
    NIGHT: "Good Night, Sarvasva 🌙. Did you earn it?",
};
