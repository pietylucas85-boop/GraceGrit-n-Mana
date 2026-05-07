import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { JournalEntry } from '../types';

const STORAGE_KEY = 'ggm_journal_entries';

export const PhotoJournal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [activeTab, setActiveTab] = useState<'BEFORE' | 'DURING' | 'AFTER'>('DURING');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newEntry: JournalEntry = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          type: activeTab,
          imageUrl: reader.result as string,
          notes: ''
        };
        setEntries([newEntry, ...entries]);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteEntry = (id: string) => {
    if (window.confirm("Remove this testimony photo?")) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const filteredEntries = entries.filter(e => e.type === activeTab);

  const getTabLabel = (tab: string) => {
    switch(tab) {
      case 'BEFORE': return 'The Origin';
      case 'DURING': return 'The Walk';
      case 'AFTER': return 'The Glory';
      default: return tab;
    }
  };

  const getTabQuote = (tab: string) => {
    switch(tab) {
      case 'BEFORE': return '"Do not despise these small beginnings..." — Zechariah 4:10';
      case 'DURING': return '"Let us run with perseverance the race marked out for us." — Hebrews 12:1';
      case 'AFTER': return '"I have fought the good fight, I have finished the race." — 2 Timothy 4:7';
      default: return "";
    }
  };

  const getTabColor = (tab: string) => {
    switch(tab) {
      case 'BEFORE': return 'from-slate-600 to-slate-700';
      case 'DURING': return 'from-purple-600 to-purple-800';
      case 'AFTER': return 'from-amber-500 to-amber-700';
      default: return 'from-slate-600 to-slate-700';
    }
  };

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-slate-800">Visual Testimony</h2>
        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <Icons.Camera size={12} />
          {entries.length} Photos
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-5">Document the vessel God is building.</p>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
        {(['BEFORE', 'DURING', 'AFTER'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === tab 
                ? 'bg-white text-purple-700 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {getTabLabel(tab)}
          </button>
        ))}
      </div>

      {/* Scripture Quote */}
      <div className={`text-center mb-5 bg-gradient-to-r ${getTabColor(activeTab)} rounded-xl p-4`}>
        <p className="text-xs font-serif italic text-white/80">{getTabQuote(activeTab)}</p>
      </div>

      {/* Upload Button */}
      <label className="block mb-5 border-2 border-dashed border-purple-200 rounded-2xl p-6 flex flex-col items-center justify-center text-purple-500 cursor-pointer bg-purple-50/50 hover:bg-purple-50 hover:border-purple-300 transition-all active:scale-[0.99]">
        <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-3">
          <Icons.Camera size={24} />
        </div>
        <span className="font-bold text-sm">Capture the Season</span>
        <span className="text-xs text-purple-300 mt-1">Tap to upload a photo</span>
        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      </label>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredEntries.map(entry => (
          <div key={entry.id} className="relative group rounded-2xl overflow-hidden shadow-md aspect-[3/4]">
            <img src={entry.imageUrl} alt={entry.type} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white text-xs font-semibold">{entry.date}</p>
              <p className="text-white/60 text-[10px] uppercase tracking-wider">{getTabLabel(entry.type)}</p>
            </div>
            <button 
              onClick={() => deleteEntry(entry.id)}
              className="absolute top-2 right-2 w-7 h-7 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white/80 hover:text-red-400 hover:bg-black/60"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      
      {filteredEntries.length === 0 && (
        <div className="text-center text-slate-300 py-12 px-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.Sparkles size={24} className="text-slate-300" />
          </div>
          <p className="font-semibold text-slate-400">Faith is the assurance of things hoped for.</p>
          <p className="text-xs mt-1 text-slate-300">Upload a photo to mark this chapter of your walk!</p>
        </div>
      )}
    </div>
  );
};