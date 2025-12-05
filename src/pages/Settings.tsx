import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { useSarvasva } from '../context/SarvasvaContext';
import { useReminders } from '../hooks/useReminders';
import { Bell, Trash2 } from 'lucide-react';
import { clearDatabase } from '../lib/db';

export function Settings() {
    const { metrics } = useSarvasva();
    const { permission, requestPermission } = useReminders();

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-white">Settings</h1>

            {/* Profile Summary */}
            <GlassCard className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-2xl font-bold text-white">
                    {metrics.NAME[0]}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">{metrics.FULL_NAME}</h2>
                    <p className="text-sm text-slate-400">Target: {metrics.TARGET_WEIGHT_KG} kg</p>
                </div>
            </GlassCard>

            {/* App Settings */}
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest pl-2">Preferences</h3>
            <GlassCard className="divide-y divide-white/10">
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors" onClick={requestPermission}>
                    <div className="flex items-center gap-3">
                        <Bell size={20} className={permission === 'granted' ? "text-success" : "text-brand-primary"} />
                        <div>
                            <div className="text-white font-medium">Notifications</div>
                            <div className="text-xs text-slate-400">
                                {permission === 'granted' ? 'Active (2PM - 9PM)' : 'Tap to Enable'}
                            </div>
                        </div>
                    </div>
                    {/* Toggle Switch Visual */}
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${permission === 'granted' ? 'bg-success' : 'bg-slate-600'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${permission === 'granted' ? 'right-1' : 'left-1'}`} />
                    </div>
                </div>
            </GlassCard>

            {/* Danger Zone */}
            <h3 className="text-sm font-medium text-danger uppercase tracking-widest pl-2">Danger Zone</h3>
            <GlassCard className="p-4 border-danger/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Trash2 size={20} className="text-danger" />
                        <div>
                            <div className="text-white font-medium">Reset All Data</div>
                            <div className="text-xs text-slate-400">Clears database & history</div>
                        </div>
                    </div>
                    <Button variant="ghost" className="text-danger hover:bg-danger/10" onClick={async () => {
                        if (confirm('Are you sure? This will wipe all logs and custom foods. This cannot be undone.')) {
                            try {
                                await clearDatabase();
                                window.location.reload();
                            } catch (e) {
                                alert("Failed to reset. Please clear browser data manually.");
                            }
                        }
                    }}>
                        Reset
                    </Button>
                </div>
            </GlassCard>

            <div className="text-center text-xs text-slate-600 pt-8">
                SARVASVA v69
            </div>
        </div>
    );
}
