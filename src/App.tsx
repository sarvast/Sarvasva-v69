import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Fitness } from './pages/Fitness';
import { Nutrition } from './pages/Nutrition';
import { Goals } from './pages/Goals';
import { Settings } from './pages/Settings';
import { BottomNav } from './components/ui/BottomNav';
import { SarvasvaProvider } from './context/SarvasvaContext';

import { useReminders } from './hooks/useReminders';

function AppContent() {
    useReminders(); // Activate logical reminders

    return (
        <BrowserRouter>
            <div className="min-h-screen w-full bg-slate-950 font-sans selection:bg-brand-primary selection:text-white overflow-x-hidden">
                {/* Dynamic Background Layer */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-primary/10 blur-[100px] animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                </div>

                <div className="w-full min-h-screen relative">
                    <main className="px-4 pt-4 pb-24 relative z-10 w-full max-w-md mx-auto">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/fitness" element={<Fitness />} />
                            <Route path="/nutrition" element={<Nutrition />} />
                            <Route path="/goals" element={<Goals />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                    <BottomNav />
                </div>
            </div>
        </BrowserRouter>
    );
}

function App() {
    return (
        <SarvasvaProvider>
            <AppContent />
        </SarvasvaProvider>
    );
}

export default App;
