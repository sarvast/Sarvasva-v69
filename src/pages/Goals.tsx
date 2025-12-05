import { useSarvasva } from '../context/SarvasvaContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Target, TrendingDown, Scale, Activity } from 'lucide-react';
import { ProgressBar } from '../components/ui/ProgressBar';

export function Goals() {
    const { metrics, timelineWeeks } = useSarvasva();

    // BMI Calc
    const heightM = metrics.HEIGHT_CM / 100;
    const bmi = (metrics.STARTING_WEIGHT_KG / (heightM * heightM)).toFixed(1);

    // Weight Lost Placeholder (real app would track this over time)

    return (
        <div className="space-y-4 animate-in fade-in duration-700">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-accent">
                Goals & Projection
            </h1>

            {/* Main Target Card */}
            <GlassCard className="p-6 text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center text-brand-accent mb-2">
                    <Target size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white">{metrics.TARGET_WEIGHT_KG} <span className="text-lg font-normal text-slate-400">kg</span></h2>
                <p className="text-slate-400">Target Weight</p>
                <div className="pt-4">
                    <p className="text-sm text-yellow-500 mb-2">Estimated Arrival: {timelineWeeks} Weeks</p>
                    <ProgressBar progress={15} color="bg-brand-accent" />
                    {/* 15% is visual placeholder */}
                </div>
            </GlassCard>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
                <GlassCard className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-brand-secondary">
                        <Scale size={20} />
                        <span className="font-semibold">BMI</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{bmi}</div>
                    <div className="text-xs text-slate-400">Obese Class I</div>
                </GlassCard>

                <GlassCard className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-success">
                        <Activity size={20} />
                        <span className="font-semibold">BMR</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{metrics.BMR_ESTIMATE}</div>
                    <div className="text-xs text-slate-400">Base Burn / Day</div>
                </GlassCard>
            </div>

            {/* Timeline Explanation */}
            <GlassCard className="p-6">
                <h3 className="flex items-center gap-2 font-semibold text-white mb-3">
                    <TrendingDown size={20} className="text-brand-primary" />
                    Timeline Logic
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                    Your timeline of <span className="text-white font-bold">{timelineWeeks} weeks</span> is dynamic.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-400 font-mono">
                    <li className="flex items-center gap-2">
                        <span className="text-success">●</span> High Calorie Deficit = Weeks Decrease
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-danger">●</span> Missed Workout = Weeks Increase (+0.2)
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-danger">●</span> Low Steps = Weeks Increase (+0.1)
                    </li>
                </ul>
            </GlassCard>
        </div>
    );
}
