import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { Workout, GeneratedWorkoutRoutine } from '../types';
import { generateWorkoutRoutine } from '../services/geminiService';

const MOCK_WORKOUTS: Workout[] = [
  {
    id: '1',
    title: 'The Jericho March (Lower Body)',
    focus: 'Legs & Cardio',
    duration: '20 min',
    exercises: ['20 Air Squats', '10 Lunges (Left/Right)', '1 min High Knees', 'Repeat 4x'],
    powerVerse: 'By faith the walls of Jericho fell, after the army had marched around them for seven days.',
    verseReference: 'Hebrews 11:30',
    completed: false
  },
  {
    id: '2',
    title: 'David\'s Sling (Upper Body)',
    focus: 'Arms & Shoulders',
    duration: '15 min',
    exercises: ['15 Pushups', '20 Arm Circles', '10 Tricep Dips', '30sec Plank', 'Repeat 3x'],
    powerVerse: 'Blessed be the LORD my Rock, who trains my hands for war, my fingers for battle.',
    verseReference: 'Psalm 144:1',
    completed: false
  }
];

export const Workouts: React.FC = () => {
  // Load from local storage or use mock data
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    try {
      const saved = localStorage.getItem('grace_workouts');
      return saved ? JSON.parse(saved) : MOCK_WORKOUTS;
    } catch (e) {
      console.error("Failed to load workouts", e);
      return MOCK_WORKOUTS;
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [focusInput, setFocusInput] = useState('');

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('grace_workouts', JSON.stringify(workouts));
  }, [workouts]);

  const handleGenerate = async () => {
    if (!focusInput.trim()) return;
    setIsGenerating(true);
    try {
      const data: GeneratedWorkoutRoutine = await generateWorkoutRoutine(focusInput);
      
      const newWorkout: Workout = {
        id: Date.now().toString(),
        title: data.title,
        focus: focusInput,
        duration: data.duration,
        exercises: data.exercises,
        powerVerse: data.powerVerse,
        verseReference: data.verseReference,
        completed: false
      };
      
      setWorkouts(prev => [newWorkout, ...prev]);
      setFocusInput('');
    } catch (e) {
      console.error(e);
      alert('Coach Grace is praying... try again in a moment (Check API Key).');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleComplete = (id: string) => {
    setWorkouts(prev => prev.map(w => 
      w.id === id ? { ...w, completed: !w.completed } : w
    ));
  };

  const clearWorkouts = () => {
    if (window.confirm("Are you sure you want to reset your temple training log?")) {
        setWorkouts(MOCK_WORKOUTS);
    }
  };

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Temple Training</h2>
          <p className="text-xs text-slate-500">Honor God with your body (1 Cor 6:20)</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={clearWorkouts}
                className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                title="Reset Workouts"
            >
                <Icons.Activity size={20} className="rotate-45" />
            </button>
            <div className="bg-royal-purple/10 p-2 rounded-full">
                <Icons.Activity className="text-royal-purple" size={24} />
            </div>
        </div>
      </div>

      {/* AI Generator */}
      <div className="bg-gradient-to-br from-royal-purple to-indigo-800 p-6 rounded-2xl shadow-lg mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Icons.Flame size={100} />
        </div>
        <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Icons.Sparkles size={18} className="text-grace-gold" />
                Ask Coach for a Routine
            </h3>
            <p className="text-white/80 text-sm mb-4">
                Need to focus on core? Arms? Cardio? Tell Coach Grace what needs grit today.
            </p>
            <div className="flex gap-2">
            <input 
                type="text" 
                value={focusInput}
                onChange={(e) => setFocusInput(e.target.value)}
                placeholder="e.g. Abs, Full Body, Stretching..."
                className="flex-1 text-sm text-slate-800 border-none rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-grace-gold"
            />
            <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-grace-gold text-white font-bold p-3 rounded-lg disabled:opacity-50 hover:bg-yellow-500 transition-colors"
            >
                {isGenerating ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <Icons.Dumbbell size={20} />}
            </button>
            </div>
        </div>
      </div>

      {/* Workout List */}
      <div className="space-y-4">
        {workouts.map(workout => (
          <div 
            key={workout.id} 
            className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${
                workout.completed ? 'border-green-500 ring-1 ring-green-500 opacity-90' : 'border-slate-100'
            }`}
          >
             {/* Header Verse */}
            <div className={`p-3 border-b flex items-center gap-2 transition-colors duration-300 ${workout.completed ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
                <Icons.BookOpen size={14} className={workout.completed ? "text-green-700" : "text-royal-purple"} />
                <p className="text-xs font-serif italic text-slate-600 flex-1">"{workout.powerVerse}"</p>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{workout.verseReference}</span>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    {workout.title}
                    {workout.completed && <Icons.Check size={18} className="text-green-500 animate-in fade-in zoom-in" />}
                </h3>
                <span className="text-xs bg-orange-100 text-orange-600 font-bold px-2 py-1 rounded-full">{workout.duration}</span>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">Focus: {workout.focus}</p>
              
              <div className="bg-slate-50 rounded-lg p-4">
                  {/* Handle AI text blob vs structured list */}
                  {workout.exercises.length === 1 && workout.exercises[0].length > 50 ? (
                      <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {workout.exercises[0]}
                      </div>
                  ) : (
                    <ul className="space-y-2">
                        {workout.exercises.map((ex, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                    workout.completed ? 'bg-green-100 text-green-700' : 'bg-royal-purple/10 text-royal-purple'
                                }`}>
                                    {i + 1}
                                </div>
                                <span className={workout.completed ? "line-through text-slate-400 decoration-slate-400" : ""}>{ex}</span>
                            </li>
                        ))}
                    </ul>
                  )}
              </div>

              <button 
                onClick={() => toggleComplete(workout.id)}
                className={`w-full mt-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    workout.completed 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-royal-purple text-white hover:bg-indigo-700 active:scale-95'
                }`}
              >
                {workout.completed ? (
                    <>
                        <Icons.Check size={16} />
                        Offering Accepted (Completed)
                    </>
                ) : (
                    <>
                        <Icons.Activity size={16} />
                        Start Worship Workout
                    </>
                )}
              </button>
            </div>
          </div>
        ))}
        
        {workouts.length === 0 && (
            <div className="text-center p-8 text-slate-400">
                <p>No workouts found. Ask Coach for a new routine!</p>
            </div>
        )}
      </div>
    </div>
  );
};