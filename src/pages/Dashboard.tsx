import { useSarvasva } from '../context/SarvasvaContext';
import { GREETINGS } from '../lib/constants';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Footprints, Droplets, Flame, TrendingUp } from 'lucide-react';

export function Dashboard() {
    const { dailyLog, metrics, timelineWeeks, addSteps, addWater, error } = useSarvasva();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return GREETINGS.MORNING;
        if (hour < 16) return GREETINGS.AFTERNOON;
        if (hour < 21) return GREETINGS.EVENING;
        return GREETINGS.NIGHT;
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

    if (!dailyLog) return <div className="p-8 text-white">Loading...</div>;

    const remainingCalories = metrics.BMR_ESTIMATE - dailyLog.calories_eaten + dailyLog.calories_burned;
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
                    Sarthak Srivastava
                </p>
            </div>

            {/* Timeline Impact Card */}
            <GlassCard className={`p-6 border-l-4 ${isDeficitOnTrack ? 'border-l-success' : 'border-l-danger'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Transformation Timeline</h2>
                        <p className="text-sm text-slate-400">Estimated time to 80kg</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white">{timelineWeeks} <span className="text-sm font-normal text-slate-400">weeks</span></div>
                        <div className={`text-xs ${isDeficitOnTrack ? 'text-success' : 'text-danger'}`}>
                            {isDeficitOnTrack ? '▼ On Track' : '▲ Delayed'}
                        </div>
                    </div>
                </div>
                {/* Visual Timeline Bar */}
                <div className="h-2 w-full bg-glass-surface rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary w-[30%]" />
                    {/* Hardcoded 30% progress for visual start */}
                </div>
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
                        <div className="text-xs text-slate-400">/ 10,000 goal</div>
                    </div>
                    <div className="flex gap-1">
                        <Button size="sm" variant="secondary" onClick={() => addSteps(500)} className="flex-1 text-xs py-2 h-7">+500</Button>
                        <Button size="sm" variant="secondary" onClick={() => addSteps(1000)} className="flex-1 text-xs py-2 h-7">+1k</Button>
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
                        <div className="text-xs text-slate-400">/ 4,000 ml</div>
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
                    <ProgressBar progress={(dailyLog.calories_eaten / metrics.BMR_ESTIMATE) * 100} color="bg-brand-accent" height={8} />

                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Burned (Steps + Workout)</span>
                        <span className="text-success">{Math.round(dailyLog.calories_burned)}</span>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
