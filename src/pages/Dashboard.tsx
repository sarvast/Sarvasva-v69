import { useSarvasva } from '../context/SarvasvaContext';
import { getGreetings } from '../lib/constants';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StreakCard } from '../components/StreakCard';
import { useStepTracker } from '../hooks/useStepTracker';
import { Footprints, Droplets, Flame, Smartphone } from 'lucide-react';

export function Dashboard() {
    const { dailyLog, userProfile, metrics, timelineWeeks, streak, addSteps, addWater, error } = useSarvasva();
    const { permission, supported, isTracking, enableTracking } = useStepTracker((steps) => addSteps(steps));

    const getGreeting = () => {
        if (!userProfile) return 'Welcome!';
        const greetings = getGreetings(userProfile.name);
        const hour = new Date().getHours();
        if (hour < 12) return greetings.MORNING;
        if (hour < 16) return greetings.AFTERNOON;
        if (hour < 21) return greetings.EVENING;
        return greetings.NIGHT;
    };

    if (error) return (
        <div className="p-8 flex items-center justify-center h-screen">
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl max-w-sm text-center">
                <h3 className="font-bold mb-2">Startup Error</h3>
                <p className="text-sm">{error}</p>
                <div className="mt-4 text-xs text-white/50">Try refreshing the page.</div>
            </div>
        </div>
    );

    if (!dailyLog || !userProfile) return <div className="p-8 text-white">Loading...</div>;

    const remainingCalories = metrics.BMR - dailyLog.calories_eaten + dailyLog.calories_burned;
    // Simple logic: if eating > (BMR + Burned), negative remaining.

    // Timeline Logic Visualization
    // If deficit > 500 => Timeline speeds up
    // This is just a visual placeholder for now, real calc can be more complex
    const isDeficitOnTrack = remainingCalories > 0;

    return (
        <div className="space-y-4 animate-in fade-in duration-700">
            {/* Greeting */}
            <div className="space-y-1">
                <h1 className="text-xl font-medium text-slate-300">{getGreeting()}</h1>
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    {userProfile.name}
                </p>
            </div>

            {/* Streak Card */}
            <StreakCard streak={streak} />

            {/* User Metrics Card */}
            <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Your Metrics</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-brand-primary">{metrics.BMR}</div>
                        <div className="text-xs text-slate-400">BMR (kcal)</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-brand-secondary">{metrics.TDEE}</div>
                        <div className="text-xs text-slate-400">TDEE (kcal)</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-brand-accent">{metrics.BMI}</div>
                        <div className="text-xs text-slate-400">BMI</div>
                    </div>
                </div>
            </GlassCard>

            {/* Timeline Impact Card */}
            <GlassCard className={`p-6 border-l-4 ${isDeficitOnTrack ? 'border-l-success' : 'border-l-danger'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Transformation Timeline</h2>
                        <p className="text-sm text-slate-400">Estimated time to {userProfile.targetWeight}kg</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white">{timelineWeeks} <span className="text-sm font-normal text-slate-400">weeks</span></div>
                        <div className={`text-xs ${isDeficitOnTrack ? 'text-success' : 'text-danger'}`}>
                            {isDeficitOnTrack ? '▼ On Track' : '▲ Delayed'}
                        </div>
                    </div>
                </div>
                {/* Visual Timeline Bar */}
                <ProgressBar progress={((userProfile.startingWeight - userProfile.currentWeight) / (userProfile.startingWeight - userProfile.targetWeight)) * 100} color="bg-brand-primary" height={8} />
            </GlassCard>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Steps */}
                <GlassCard className="p-4 space-y-3">
                    <div className="flex items-center gap-3 text-brand-secondary">
                        <Footprints size={24} />
                        <span className="font-semibold">Steps</span>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white">{dailyLog.steps.toLocaleString()}</div>
                        <div className="text-xs text-slate-400">/ {userProfile.stepGoal.toLocaleString()} goal</div>
                        <ProgressBar progress={(dailyLog.steps / userProfile.stepGoal) * 100} color="bg-brand-secondary" height={4} />
                    </div>
                    <div className="flex gap-2">
                        {supported && !isTracking && (
                            <Button 
                                size="sm" 
                                variant="primary" 
                                onClick={enableTracking} 
                                className="flex-1 text-xs py-2 h-7"
                            >
                                <Smartphone size={12} /> Enable Auto
                            </Button>
                        )}
                        {isTracking && (
                            <div className="flex-1 text-xs text-success flex items-center justify-center gap-1">
                                <Smartphone size={12} /> Auto 🟢
                            </div>
                        )}
                        <Button size="sm" variant="secondary" onClick={() => addSteps(500)} className="text-xs py-2 h-7 px-4">+500</Button>
                    </div>
                </GlassCard>

                {/* Water */}
                <GlassCard className="p-4 space-y-3">
                    <div className="flex items-center gap-3 text-brand-primary">
                        <Droplets size={24} />
                        <span className="font-semibold">Water</span>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white">{dailyLog.water_ml} <span className="text-base font-normal text-slate-500">ml</span></div>
                        <div className="text-xs text-slate-400">/ {userProfile.waterGoal.toLocaleString()} ml</div>
                        <ProgressBar progress={(dailyLog.water_ml / userProfile.waterGoal) * 100} color="bg-brand-primary" height={4} />
                    </div>
                    <div className="flex gap-1">
                        <Button size="sm" variant="secondary" onClick={() => addWater(250)} className="flex-1 text-xs py-2 h-7">+250</Button>
                        <Button size="sm" variant="secondary" onClick={() => addWater(500)} className="flex-1 text-xs py-2 h-7">+500</Button>
                    </div>
                </GlassCard>
            </div>

            {/* Calories / Nutrition Overview */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 text-brand-accent">
                        <Flame size={24} />
                        <span className="font-semibold text-lg">Daily Fuel</span>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-white">{Math.round(remainingCalories)}</div>
                        <div className="text-xs text-slate-400">kcal remaining</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Eaten</span>
                        <span className="text-white">{dailyLog.calories_eaten}</span>
                    </div>
                    <ProgressBar progress={(dailyLog.calories_eaten / metrics.BMR) * 100} color="bg-brand-accent" />

                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Burned (Steps + Workout)</span>
                        <span className="text-success">{Math.round(dailyLog.calories_burned)}</span>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
