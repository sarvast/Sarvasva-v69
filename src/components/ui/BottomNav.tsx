import { Home, Activity, Target, Settings, Utensils } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export function BottomNav() {

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-slate-950/95 backdrop-blur-xl border-t border-white/10 safe-area-inset-bottom">
            <div className="w-full px-4 py-3">
                <div className="flex justify-around items-center max-w-md mx-auto">
                    <NavLink to="/" className={({ isActive }) => clsx("flex flex-col items-center gap-1 transition-all duration-200 p-3 rounded-lg min-w-[48px]", isActive ? "text-brand-primary bg-brand-primary/10" : "text-white/60 hover:text-white active:bg-white/5")}>
                        <Home size={20} />
                        <span className="text-[10px] font-medium">Home</span>
                    </NavLink>
                    <NavLink to="/fitness" className={({ isActive }) => clsx("flex flex-col items-center gap-1 transition-all duration-200 p-3 rounded-lg min-w-[48px]", isActive ? "text-brand-primary bg-brand-primary/10" : "text-white/60 hover:text-white active:bg-white/5")}>
                        <Activity size={20} />
                        <span className="text-[10px] font-medium">Fitness</span>
                    </NavLink>
                    <NavLink to="/nutrition" className={({ isActive }) => clsx("flex flex-col items-center gap-1 transition-all duration-200 p-3 rounded-lg min-w-[48px]", isActive ? "text-brand-primary bg-brand-primary/10" : "text-white/60 hover:text-white active:bg-white/5")}>
                        <Utensils size={20} />
                        <span className="text-[10px] font-medium">Food</span>
                    </NavLink>
                    <NavLink to="/goals" className={({ isActive }) => clsx("flex flex-col items-center gap-1 transition-all duration-200 p-3 rounded-lg min-w-[48px]", isActive ? "text-brand-primary bg-brand-primary/10" : "text-white/60 hover:text-white active:bg-white/5")}>
                        <Target size={20} />
                        <span className="text-[10px] font-medium">Goals</span>
                    </NavLink>
                    <NavLink to="/settings" className={({ isActive }) => clsx("flex flex-col items-center gap-1 transition-all duration-200 p-3 rounded-lg min-w-[48px]", isActive ? "text-brand-primary bg-brand-primary/10" : "text-white/60 hover:text-white active:bg-white/5")}>
                        <Settings size={20} />
                        <span className="text-[10px] font-medium">Settings</span>
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}
