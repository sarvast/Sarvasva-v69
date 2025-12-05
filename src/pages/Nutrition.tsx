import { useState } from 'react';
import { useSarvasva } from '../context/SarvasvaContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Plus, Search, Flame } from 'lucide-react';

export function Nutrition() {
    const { dailyLog, metrics, foodDatabase, addFood, addFoodToDb } = useSarvasva();
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemCalories, setNewItemCalories] = useState('');

    if (!dailyLog) return <div>Loading...</div>;

    const remaining = metrics.BMR_ESTIMATE - dailyLog.calories_eaten + dailyLog.calories_burned;
    const progress = (dailyLog.calories_eaten / metrics.BMR_ESTIMATE) * 100;

    const handleQuickAdd = (food: { name: string; calories: number }) => {
        addFood(food.calories, food.name);
    };

    const handleCreateFood = async () => {
        if (!newItemName || !newItemCalories) return;
        const cals = parseInt(newItemCalories);
        await addFoodToDb(newItemName, cals);
        setNewItemName('');
        setNewItemCalories('');
        setIsAddingNew(false);
    };

    return (
        <div className="space-y-4 animate-in slide-in-from-bottom-5 duration-500">
            {/* Header / Summary */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-white">Nutrition</h1>
                    <div className="text-right">
                        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-secondary">
                            {dailyLog.calories_eaten} / {metrics.BMR_ESTIMATE}
                        </div>
                    </div>
                </div>
                <ProgressBar progress={progress} color="bg-brand-accent h-3" />
                <div className="mt-4 flex justify-between text-sm text-slate-400">
                    <span>Remaining: <span className="text-white font-medium">{Math.round(remaining)}</span></span>
                    <span>Burned: <span className="text-success font-medium">{Math.round(dailyLog.calories_burned)}</span></span>
                </div>
            </GlassCard>

            {/* Quick Add Grid */}
            <div className="grid grid-cols-2 gap-2">
                {/* Common Presets (Hardcoded + Saved) */}
                <Button
                    variant="secondary"
                    className="h-auto p-4 flex flex-col gap-1 items-start"
                    onClick={() => handleQuickAdd({ name: 'Roti', calories: 80 })}
                >
                    <span className="font-semibold text-white">Roti</span>
                    <span className="text-xs text-slate-400">80 kcal</span>
                </Button>
                <Button
                    variant="secondary"
                    className="h-auto p-4 flex flex-col items-start gap-1"
                    onClick={() => handleQuickAdd({ name: 'Egg', calories: 70 })}
                >
                    <span className="font-semibold text-white">Egg</span>
                    <span className="text-xs text-slate-400">70 kcal</span>
                </Button>

                {/* Render Database Items */}
                {foodDatabase.map((food, i) => (
                    <Button
                        key={i}
                        variant="secondary"
                        className="h-auto p-4 flex flex-col items-start gap-1"
                        onClick={() => handleQuickAdd(food)}
                    >
                        <span className="font-semibold text-white">{food.name}</span>
                        <span className="text-xs text-slate-400">{food.calories} kcal</span>
                    </Button>
                ))}

                {/* Add New Button */}
                <Button
                    variant="ghost"
                    className="h-auto p-4 border border-dashed border-white/20 flex flex-col items-center justify-center gap-2 hover:bg-white/5"
                    onClick={() => setIsAddingNew(!isAddingNew)}
                >
                    <Plus size={24} className="text-brand-primary" />
                    <span className="text-sm">New Food</span>
                </Button>
            </div>

            {/* Add New Food Form */}
            {isAddingNew && (
                <GlassCard className="p-4 space-y-4 border-brand-primary/50">
                    <h3 className="font-semibold text-white">Add to Database</h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Food Name (e.g. Chicken Breast)"
                            className="w-full glass-input text-white"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Calories"
                            className="w-full glass-input text-white"
                            value={newItemCalories}
                            onChange={(e) => setNewItemCalories(e.target.value)}
                        />
                        <div className="flex gap-2 pt-2">
                            <Button className="flex-1" onClick={handleCreateFood}>Save Item</Button>
                            <Button variant="ghost" className="flex-1" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                        </div>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
