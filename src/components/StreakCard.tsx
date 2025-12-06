import { Flame } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { getStreakMotivation } from '../lib/streak';

interface StreakCardProps {
    streak: number;
}

export function StreakCard({ streak }: StreakCardProps) {
    return (
        <GlassCard className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Flame size={48} className="text-orange-500" />
                    {streak > 0 && (
                        <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {streak}
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="text-2xl font-bold text-white">{streak} Day Streak</div>
                    <div className="text-sm text-orange-300">{getStreakMotivation(streak)}</div>
                </div>
            </div>
            <div className="mt-3 text-xs text-slate-400">
                Complete steps goal + workout + stay under TDEE to maintain streak
            </div>
        </GlassCard>
    );
}
