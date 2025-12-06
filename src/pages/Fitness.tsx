import { useState, useEffect } from 'react';
import { useSarvasva } from '../context/SarvasvaContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Dumbbell, CheckCircle2, Plus, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { WORKOUT_SCHEDULE } from '../lib/workout-data';

export function Fitness() {
    const { 
        customExercises, 
        exerciseCompletions, 
        toggleExerciseCompletion, 
        addCustomExercise, 
        initializeDefaultExercises 
    } = useSarvasva();
    
    const currentDayIndex = new Date().getDay();
    const [selectedDay, setSelectedDay] = useState(currentDayIndex);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAddingExercise, setIsAddingExercise] = useState(false);
    const [newExercise, setNewExercise] = useState({ name: '', sets: '', gifUrl: '' });
    
    const selectedWorkout = WORKOUT_SCHEDULE[selectedDay];
    const selectedExercises = customExercises.filter(ex => ex.dayIndex === selectedDay);
    const isToday = selectedDay === currentDayIndex;
    
    useEffect(() => {
        const init = async () => {
            if (customExercises.length === 0) {
                await initializeDefaultExercises();
            }
        };
        init();
    }, []);
    
    const isExerciseCompleted = (exerciseId: string) => {
        return exerciseCompletions.some(c => c.exerciseId === exerciseId && c.completed);
    };
    
    const handleAddExercise = async () => {
        if (newExercise.name.trim() && newExercise.sets.trim()) {
            await addCustomExercise({
                name: newExercise.name.trim(),
                sets: newExercise.sets.trim(),
                gifUrl: newExercise.gifUrl.trim() || undefined,
                dayIndex: selectedDay,
                isDefault: false
            });
            setNewExercise({ name: '', sets: '', gifUrl: '' });
            setIsAddingExercise(false);
        }
    };

    useEffect(() => {
        setCurrentSlide(0);
    }, [selectedDay]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % selectedExercises.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + selectedExercises.length) % selectedExercises.length);
    };

    const currentExercise = selectedExercises[currentSlide];
    const isCompleted = currentExercise ? isExerciseCompleted(currentExercise.id) : false;

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-white">Fitness</h1>

            {/* Day Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedDay(index)}
                        className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                            selectedDay === index
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        } ${index === currentDayIndex ? 'ring-2 ring-brand-accent' : ''}`}
                    >
                        {day}
                        {index === currentDayIndex && <div className="text-xs">Today</div>}
                    </button>
                ))}
            </div>

            <div className="text-center">
                <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">Target Area</div>
                <h2 className="text-2xl font-bold text-white">{selectedWorkout.type}</h2>
                {selectedExercises.length > 0 && (
                    <div className="text-sm text-slate-400 mt-1">
                        {currentSlide + 1} / {selectedExercises.length}
                    </div>
                )}
            </div>

            {/* Exercise Card Slider */}
            {selectedExercises.length > 0 ? (
                <>
                    <div className="relative">
                        <GlassCard className="p-6 min-h-[500px] flex flex-col">
                            {/* Exercise GIF */}
                            <div className="w-full h-64 mb-4 rounded-xl overflow-hidden bg-slate-900/50 flex items-center justify-center">
                                {currentExercise.gifUrl ? (
                                    <img 
                                        src={currentExercise.gifUrl} 
                                        alt={currentExercise.name}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                    <Dumbbell size={64} className="text-slate-700" />
                                )}
                            </div>

                            {/* Exercise Info */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{currentExercise.name}</h3>
                                    <p className="text-brand-primary text-lg font-mono mb-4">{currentExercise.sets}</p>
                                </div>

                                {/* Complete Button - Only for Today */}
                                {isToday ? (
                                    <Button 
                                        onClick={() => toggleExerciseCompletion(currentExercise.id)}
                                        variant={isCompleted ? "primary" : "secondary"}
                                        className="w-full"
                                    >
                                        {isCompleted ? (
                                            <>
                                                <CheckCircle2 size={20} /> Completed ✓
                                            </>
                                        ) : (
                                            'Mark as Complete'
                                        )}
                                    </Button>
                                ) : (
                                    <div className="text-center text-slate-500 py-3 border border-slate-700 rounded-lg">
                                        <Calendar size={20} className="inline mr-2" />
                                        Available on {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][selectedDay]}
                                    </div>
                                )}
                            </div>
                        </GlassCard>

                        {/* Navigation Arrows */}
                        {selectedExercises.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm p-3 rounded-full text-white hover:bg-slate-800 transition-all"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm p-3 rounded-full text-white hover:bg-slate-800 transition-all"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2">
                        {selectedExercises.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 rounded-full transition-all ${
                                    index === currentSlide 
                                        ? 'w-8 bg-brand-primary' 
                                        : 'w-2 bg-slate-700'
                                }`}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <GlassCard className="p-8 text-center">
                    <Dumbbell className="mx-auto mb-4 text-slate-600" size={48} />
                    <p className="text-slate-400 mb-4">No exercises for this day</p>
                    <Button onClick={() => setIsAddingExercise(true)}>
                        <Plus size={20} /> Add Exercise
                    </Button>
                </GlassCard>
            )}

            {/* Add Exercise Button */}
            <Button 
                variant="ghost" 
                onClick={() => setIsAddingExercise(true)} 
                className="w-full border border-dashed border-white/20"
            >
                <Plus size={20} /> Add Custom Exercise
            </Button>

            {/* Add Exercise Form */}
            {isAddingExercise && (
                <GlassCard className="p-4 space-y-4 border-brand-primary/50">
                    <h3 className="font-semibold text-white">Add Exercise for {selectedWorkout.type}</h3>
                    <input
                        type="text"
                        placeholder="Exercise Name"
                        className="w-full glass-input text-white"
                        value={newExercise.name}
                        onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Sets & Reps (e.g. 3 x 15)"
                        className="w-full glass-input text-white"
                        value={newExercise.sets}
                        onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="GIF URL (optional)"
                        className="w-full glass-input text-white"
                        value={newExercise.gifUrl}
                        onChange={(e) => setNewExercise({ ...newExercise, gifUrl: e.target.value })}
                    />
                    <div className="flex gap-2">
                        <Button className="flex-1" onClick={handleAddExercise}>
                            Add Exercise
                        </Button>
                        <Button variant="ghost" className="flex-1" onClick={() => setIsAddingExercise(false)}>
                            Cancel
                        </Button>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
