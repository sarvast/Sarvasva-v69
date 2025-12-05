import { useState, useEffect } from 'react';
import { UserProfile, getProfile, saveProfile } from '../lib/db';

const DEFAULT_PROFILE: UserProfile = {
    name: 'Sarvasva',
    weightKg: 115,
    targetWeightKg: 80,
    heightCm: 183,
    age: 25, // Default assumption
    activityLevel: 'light',
    stepGoalPerDay: 10000,
    waterGoalMlPerDay: 4000,
    aiGoalHoursPerDay: 4,
    darkModeEnabled: true,
};

export function useProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const existing = await getProfile();
                if (existing) {
                    // Ensure new fields exist if migrating from old profile
                    const merged = { ...DEFAULT_PROFILE, ...existing };
                    setProfile(merged);
                } else {
                    await saveProfile(DEFAULT_PROFILE);
                    setProfile(DEFAULT_PROFILE);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!profile) return;
        const updated = { ...profile, ...updates };
        setProfile(updated);
        await saveProfile(updated);
    };

    return { profile, loading, updateProfile };
}
