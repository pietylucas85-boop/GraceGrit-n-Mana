import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { Workout, GeneratedWorkoutRoutine } from '../types';
import { generateWorkoutRoutine } from '../services/geminiService';

const MOCK_WORKOUTS: Workout[] = [
  {
    id: '1',
    title: 'The Jericho March',
    focus: 'Legs & Cardio',
    duration: '20 min',
    exercises: ['20 Air Squats', '10 Lunges (Left/Right)', '1 min High Knees', 'Repeat 4x'],
    powerVerse: 'By faith the walls of Jericho fell, after the army had marched around them for seven days.',
    verseReference: 'Hebrews 11:30',
    completed: false
  },
  {
    id: '2',
    title: "David's Sling",
    focus: 'Arms & Shoulders',
    duration: '15 min',
    exercises: ['15 Pushups', '20 Arm Circles', '10 Tricep Dips', '30sec Plank', 'Repeat 3x'],
    powerVerse: 'Blessed be the LORD my Rock, who trains my hands for war, my fingers for battle.',
    verseReference: 'Psalm 144:1',
    completed: false
  }
];

const STORAGE_KEY = 'ggm_workouts';

export const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : MOCK_WORKOUTS;
    } catch (e) {
      return MOCK_WORKOUTS;
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [focusInput, setFocusInput] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
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
      alert('Coach Grace is praying... try again in a moment!');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleComplete = (id: string) => {
    setWorkouts(prev => prev.map(w => 
      w.id === id ? { ...w, completed: !w.completed } : w
    ));
  };

  const deleteWorkout = (id: string) => {
    if (window.confirm("Remove this workout from your training log?")) {
      setWorkouts(prev => prev.filter(w => w.id !== id));
    }
  };

  const completedCount = workouts.filter(w => w.completed).length;

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Temple Training</h2>
          <p className="text-xs text-slate-400 mt-0.5">Honor God with your body (1 Cor 6:20)</p>
        </div>
        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Icons.Check size={12} />
              {completedCount} Done
            </span>
          )}
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Icons.Activity className="text-purple-600" size={20} />
          </div>
        </div>
      </div>

      {/* AI Generator */}
      <div className="bg-gradient-to-br from-[#6B21A8] via-[#7C3AED] to-[#4C1D95] p-6 rounded-2xl shadow-xl mb-6 mt-5 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400 rounded-full blur-3xl translate-x-8 -translate-y-8" />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Icons.Sparkles size={16} className="text-amber-300" />
            Ask Coach for a Routine
          </h3>
          <p className="text-white/60 text-sm mb-4">
            What needs grit today? Core, arms, full body, stretching...
          </p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={focusInput}
              onChange={(e) => setFocusInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g. Abs, Full Body, Stretching..."
              className="flex-1 text-sm text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400 bg-white border-none"
            />
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold p-3 rounded-xl disabled:opacity-50 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
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
            className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
                workout.completed ? 'border-green-200 ring-1 ring-green-200' : 'border-slate-100 hover:shadow-md'
            }`}
          >
            {/* Verse Header */}
            <div className={`px-4 py-3 border-b flex items-start gap-2 transition-colors ${
              workout.completed ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'
            }`}>
              <Icons.BookOpen size={13} className={`mt-0.5 flex-shrink-0 ${workout.completed ? "text-green-600" : "text-purple-500"}`} />
              <p className="text-xs font-serif italic text-slate-500 flex-1 leading-relaxed">"{workout.powerVerse}"</p>
              <span className="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">{workout.verseReference}</span>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    {workout.title}
                    {workout.completed && <Icons.Check size={16} className="text-green-500" />}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full">{workout.duration}</span>
                  <button 
                    onClick={() => deleteWorkout(workout.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors p-1"
                    title="Remove workout"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">Focus: {workout.focus}</p>
              
              <div className="bg-slate-50 rounded-xl p-4">
                {workout.exercises.length === 1 && workout.exercises[0].length > 50 ? (
                  <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {workout.exercises[0]}
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {workout.exercises.map((ex, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors flex-shrink-0 ${
                            workout.completed ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {i + 1}
                        </div>
                        <span className={workout.completed ? "line-through text-slate-400" : ""}>{ex}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button 
                onClick={() => toggleComplete(workout.id)}
                className={`w-full mt-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                    workout.completed 
                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
                    : 'bg-gradient-to-r from-[#6B21A8] to-[#7C3AED] text-white shadow-md shadow-purple-500/15 hover:shadow-purple-500/25'
                }`}
              >
                {workout.completed ? (
                  <><Icons.Check size={16} /> Offering Accepted ✓</>
                ) : (
                  <><Icons.Activity size={16} /> Start Worship Workout</>
                )}
              </button>
            </div>
          </div>
        ))}
        
        {workouts.length === 0 && (
          <div className="text-center p-12 text-slate-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Dumbbell size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-400 font-medium">No workouts found.</p>
            <p className="text-xs mt-1">Ask Coach Grace for a new routine above!</p>
          </div>
        )}
      </div>
    </div>
  );
};