import { useState } from 'react';
import { useDailyLog } from '../hooks/useDailyLog';
import { useProfile } from '../hooks/useProfile';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Brain, Plus, CheckCircle2 } from 'lucide-react';

export function Focus() {
    const today = new Date();
    const { log, updateLog } = useDailyLog(today);
    const { profile } = useProfile();
    const [newTask, setNewTask] = useState('');

    if (!log || !profile) return <div>Loading...</div>;

    const addTask = () => {
        if (!newTask.trim()) return;
        updateLog({ aiTasksCompleted: [...log.aiTasksCompleted, newTask] });
        setNewTask('');
    };

    return (
        <div className="space-y-6 pb-24">
            <h1 className="text-2xl font-bold text-white">AI Focus</h1>

            <GlassCard className="p-6 bg-gradient-to-br from-electric-purple/20 to-blueberry/20">
                <div className="flex items-center gap-2 text-electric-purple mb-4">
                    <Brain />
                    <h2 className="text-xl font-bold">Study Time</h2>
                </div>
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-bold text-white">{Math.floor(log.aiStudyMinutes / 60)}h {log.aiStudyMinutes % 60}m</span>
                    <span className="text-white/60 mb-1">/ {profile.aiGoalHoursPerDay}h Goal</span>
                </div>
                <ProgressBar progress={(log.aiStudyMinutes / (profile.aiGoalHoursPerDay * 60)) * 100} color="bg-electric-purple" />

                <div className="grid grid-cols-3 gap-2 mt-6">
                    <Button size="sm" variant="secondary" onClick={() => updateLog({ aiStudyMinutes: log.aiStudyMinutes + 15 })}>+15m</Button>
                    <Button size="sm" variant="secondary" onClick={() => updateLog({ aiStudyMinutes: log.aiStudyMinutes + 30 })}>+30m</Button>
                    <Button size="sm" variant="secondary" onClick={() => updateLog({ aiStudyMinutes: log.aiStudyMinutes + 60 })}>+1h</Button>
                </div>
            </GlassCard>

            <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Tasks Completed</h2>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="e.g. LeetCode #123"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-neon-aqua"
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    />
                    <Button size="sm" onClick={addTask}><Plus size={20} /></Button>
                </div>

                <div className="space-y-2">
                    {log.aiTasksCompleted.length === 0 && (
                        <div className="text-white/40 text-center py-4 text-sm">No tasks logged yet today.</div>
                    )}
                    {log.aiTasksCompleted.map((task, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                            <CheckCircle2 size={18} className="text-neon-aqua" />
                            <span className="text-white">{task}</span>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
