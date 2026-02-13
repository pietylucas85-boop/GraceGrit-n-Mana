import React from 'react';
import { View } from '../types';
import { Icons } from './Icons';

interface DashboardProps {
  onChangeView: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onChangeView }) => {
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-royal-purple to-indigo-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Greetings, Temple Guardian!</h1>
          <p className="opacity-90 text-sm">It is {currentDay}. Rejoice in it and honor your vessel!</p>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Icons.Dumbbell size={120} />
        </div>
      </div>

      {/* Daily Verse */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-grace-gold"></div>
        <div className="flex items-center gap-2 mb-3 text-royal-purple">
          <Icons.BookOpen size={20} />
          <h2 className="font-semibold uppercase tracking-wider text-sm">Daily Bread</h2>
        </div>
        <blockquote className="text-lg font-serif italic text-slate-700 mb-2">
          "She sets about her work vigorously; her arms are strong for her tasks."
        </blockquote>
        <p className="text-right text-xs text-slate-500 font-bold">- Proverbs 31:17</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onChangeView(View.COACH)}
          className="bg-gradient-to-br from-grace-gold to-orange-400 text-white p-5 rounded-2xl shadow-md flex flex-col items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Icons.MessageCircleHeart size={32} />
          <span className="font-semibold text-center">Seek Spirit Counsel</span>
        </button>
        
        <button 
          onClick={() => onChangeView(View.PHOTO_JOURNAL)}
          className="bg-white text-royal-purple p-5 rounded-2xl shadow-md border border-royal-purple/10 flex flex-col items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Icons.Camera size={32} />
          <span className="font-semibold">Testimony Log</span>
        </button>

         <button 
          onClick={() => onChangeView(View.MANA_RECIPES)}
          className="bg-white text-mana-red p-5 rounded-2xl shadow-md border border-mana-red/10 flex flex-col items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Icons.Utensils size={32} />
          <span className="font-semibold">Mana Kitchen</span>
        </button>

         <div className="bg-slate-100 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400">
          <span className="text-2xl font-bold">3</span>
          <span className="text-xs uppercase font-bold text-center">Days of Grit</span>
        </div>
      </div>

      {/* Weekly Reminder Block */}
      <div className="bg-royal-purple/5 border border-royal-purple/20 p-4 rounded-xl flex items-start gap-4">
        <div className="bg-royal-purple text-white p-2 rounded-lg mt-1 shadow-sm">
          <Icons.Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-royal-purple">Sunday Stewardship</h3>
          <p className="text-sm text-slate-600 mt-1">
            "Behold, I am making all things new."
            <br/>
            <span className="italic text-xs text-slate-500">Take your weekly photo to witness His work in you!</span>
          </p>
        </div>
      </div>
    </div>
  );
};