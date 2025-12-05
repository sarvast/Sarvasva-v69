import { useDailyLog } from '../hooks/useDailyLog';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Moon, Smile, Frown, Meh, Laugh } from 'lucide-react';

export function Journal() {
    const today = new Date();
    const { log, updateLog } = useDailyLog(today);

    if (!log) return <div>Loading...</div>;

    const moods = [
        { label: 'Low', icon: Frown, value: 'Low', color: 'text-red-400' },
        { label: 'Normal', icon: Meh, value: 'Normal', color: 'text-yellow-400' },
        { label: 'Good', icon: Smile, value: 'Good', color: 'text-neon-aqua' },
        { label: 'Great', icon: Laugh, value: 'Great', color: 'text-electric-purple' },
    ];

    return (
        <div className="space-y-6 pb-24">
            <h1 className="text-2xl font-bold text-white">Daily Journal</h1>

            {/* Sleep */}
            <GlassCard className="p-6">
                <div className="flex items-center gap-2 text-indigo-300 mb-4">
                    <Moon />
                    <h2 className="text-xl font-bold">Sleep</h2>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateLog({ sleepHours: Math.max(0, (log.sleepHours || 0) - 0.5) })}
                    >-</Button>
                    <div className="text-3xl font-bold text-white w-24 text-center">
                        {log.sleepHours || 0} <span className="text-sm font-normal text-white/60">hrs</span>
                    </div>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateLog({ sleepHours: (log.sleepHours || 0) + 0.5 })}
                    >+</Button>
                </div>
            </GlassCard>

            {/* Mood */}
            <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Mood</h2>
                <div className="grid grid-cols-4 gap-2">
                    {moods.map((m) => (
                        <button
                            key={m.value}
                            onClick={() => updateLog({ mood: m.value })}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${log.mood === m.value
                                    ? 'bg-white/20 scale-105 shadow-glass border border-white/30'
                                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                }`}
                        >
                            <m.icon size={32} className={m.color} />
                            <span className="text-xs text-white/80">{m.label}</span>
                        </button>
                    ))}
                </div>
            </GlassCard>

            {/* Habits */}
            <GlassCard className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-white mb-2">Habits</h2>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-white">No Junk Food</span>
                    <div
                        onClick={() => updateLog({ noJunkFood: !log.noJunkFood })}
                        className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${log.noJunkFood ? 'bg-neon-aqua' : 'bg-white/20'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${log.noJunkFood ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-white">No Relapse</span>
                    <div
                        onClick={() => updateLog({ noRelapse: !log.noRelapse })}
                        className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${log.noRelapse ? 'bg-neon-aqua' : 'bg-white/20'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${log.noRelapse ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
