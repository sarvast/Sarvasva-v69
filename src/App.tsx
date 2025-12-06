import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Fitness } from './pages/Fitness';
import { Nutrition } from './pages/Nutrition';
import { Goals } from './pages/Goals';
import { Settings } from './pages/Settings';
import { Onboarding } from './pages/Onboarding';
import { BottomNav } from './components/ui/BottomNav';
import { InstallPrompt } from './components/InstallPrompt';
import { SarvasvaProvider, useSarvasva } from './context/SarvasvaContext';
// import { useReminders } from './hooks/useReminders';
import { useNativeApp } from './hooks/useNativeApp';
import { useEffect, useState } from 'react';

function AppContent() {
    const { isOnboarded, completeOnboarding } = useSarvasva();
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    useNativeApp();
    
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    


    if (!isOnboarded) {
        return <Onboarding onComplete={completeOnboarding} />;
    }

    return (
        <BrowserRouter>
            <div className="min-h-screen w-full bg-slate-950 font-sans selection:bg-brand-primary selection:text-white overflow-x-hidden">
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-primary/10 blur-[100px] animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                </div>
                <div className="w-full min-h-screen relative">
                    {!isOnline && (
                        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 text-sm font-semibold z-50">
                            You are offline
                        </div>
                    )}
                    <main className={`px-4 pb-24 relative z-10 w-full max-w-md mx-auto ${!isOnline ? 'pt-14' : 'pt-4'}`}>
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
                <InstallPrompt />
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
