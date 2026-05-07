import React from 'react';
import { View, UserProfile, getTodaysVerse } from '../types';
import { Icons } from './Icons';

interface DashboardProps {
  onChangeView: (view: View) => void;
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ onChangeView, user }) => {
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const verse = getTodaysVerse();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Rise & Shine' : hour < 17 ? 'Blessed Afternoon' : 'Peaceful Evening';

  return (
    <div className="space-y-5 pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#6B21A8] via-[#7C3AED] to-[#4C1D95] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400 rounded-full blur-3xl translate-x-10 -translate-y-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-400 rounded-full blur-3xl -translate-x-8 translate-y-8" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm font-bold border border-white/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-amber-200/80 text-xs font-medium">{greeting}</p>
                <h1 className="text-xl font-bold leading-tight">{user.name}</h1>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-300">
                <Icons.Flame className="w-5 h-5" />
                <span className="text-2xl font-bold">{user.streakDays}</span>
              </div>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Day Streak</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <p className="text-white/70 text-xs">{currentDay} • Temple Guardian</p>
          </div>
        </div>
      </div>

      {/* Daily Verse Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-amber-600 rounded-r-full" />
        <div className="p-5 pl-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <Icons.BookOpen size={14} className="text-amber-600" />
            </div>
            <h2 className="font-bold uppercase tracking-wider text-xs text-amber-700">Daily Bread</h2>
          </div>
          <blockquote className="text-[15px] font-serif italic text-slate-700 leading-relaxed mb-2">
            "{verse.text}"
          </blockquote>
          <p className="text-right text-xs text-slate-400 font-semibold">— {verse.ref}</p>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => onChangeView(View.COACH)}
          className="group bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white p-5 rounded-2xl shadow-lg shadow-amber-500/20 flex flex-col items-center justify-center gap-2.5 transition-all active:scale-[0.97] hover:shadow-amber-500/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Icons.MessageCircleHeart size={24} />
            </div>
            <span className="font-bold text-sm">Spirit Counsel</span>
          </div>
        </button>
        
        <button 
          onClick={() => onChangeView(View.PHOTO_JOURNAL)}
          className="group bg-white text-purple-700 p-5 rounded-2xl shadow-sm border border-purple-100 flex flex-col items-center justify-center gap-2.5 transition-all active:scale-[0.97] hover:shadow-md hover:border-purple-200 relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100">
            <Icons.Camera size={24} />
          </div>
          <span className="font-bold text-sm">Testimony</span>
        </button>

        <button 
          onClick={() => onChangeView(View.WORKOUTS)}
          className="group bg-white text-purple-700 p-5 rounded-2xl shadow-sm border border-purple-100 flex flex-col items-center justify-center gap-2.5 transition-all active:scale-[0.97] hover:shadow-md hover:border-purple-200 relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100">
            <Icons.Dumbbell size={24} />
          </div>
          <span className="font-bold text-sm">Temple</span>
        </button>

        <button 
          onClick={() => onChangeView(View.MANA_RECIPES)}
          className="group bg-gradient-to-br from-rose-700 via-red-800 to-rose-900 text-white p-5 rounded-2xl shadow-lg shadow-red-900/20 flex flex-col items-center justify-center gap-2.5 transition-all active:scale-[0.97] hover:shadow-red-900/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/15">
              <Icons.Utensils size={24} />
            </div>
            <span className="font-bold text-sm">Mana Kitchen</span>
          </div>
        </button>
      </div>

      {/* Weekly Reminder */}
      <div className="bg-gradient-to-r from-purple-50 to-amber-50/50 border border-purple-100/50 p-5 rounded-2xl flex items-start gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
          <Icons.Sparkles size={18} />
        </div>
        <div>
          <h3 className="font-bold text-purple-800 text-sm">Sunday Stewardship</h3>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            "Behold, I am making all things new."
            <br/>
            <span className="italic text-xs text-slate-400">Take your weekly photo to witness His work in you!</span>
          </p>
        </div>
      </div>
    </div>
  );
};