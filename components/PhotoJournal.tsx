import React, { useState } from 'react';
import { Icons } from './Icons';
import { JournalEntry } from '../types';

export const PhotoJournal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    { id: '1', date: '2023-10-01', type: 'BEFORE', imageUrl: 'https://picsum.photos/400/600', notes: 'The starting line of faith.' },
  ]);
  const [activeTab, setActiveTab] = useState<'BEFORE' | 'DURING' | 'AFTER'>('DURING');

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
      case 'BEFORE': return "Do not despise these small beginnings... (Zechariah 4:10)";
      case 'DURING': return "Let us run with perseverance the race marked out for us. (Hebrews 12:1)";
      case 'AFTER': return "I have fought the good fight, I have finished the race. (2 Timothy 4:7)";
      default: return "";
    }
  };

  return (
    <div className="pb-20">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Visual Testimony</h2>
      <p className="text-slate-500 text-sm mb-6">Document the vessel God is building.</p>

      <div className="flex bg-slate-200 p-1 rounded-xl mb-4">
        {(['BEFORE', 'DURING', 'AFTER'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === tab 
                ? 'bg-white text-royal-purple shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {getTabLabel(tab)}
          </button>
        ))}
      </div>

      <div className="text-center mb-6">
        <p className="text-xs font-serif italic text-grace-gold">{getTabQuote(activeTab)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
         <label className="col-span-2 border-2 border-dashed border-royal-purple/30 rounded-2xl p-8 flex flex-col items-center justify-center text-royal-purple cursor-pointer bg-royal-purple/5 hover:bg-royal-purple/10 transition-colors">
            <Icons.Camera size={32} className="mb-2" />
            <span className="font-semibold text-sm">Capture the Season</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
         </label>

         {filteredEntries.map(entry => (
           <div key={entry.id} className="relative group rounded-xl overflow-hidden shadow-md">
             <img src={entry.imageUrl} alt={entry.type} className="w-full h-48 object-cover" />
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
               <p className="text-white text-xs font-medium">{entry.date}</p>
             </div>
           </div>
         ))}
      </div>
      
      {filteredEntries.length === 0 && (
        <div className="text-center text-slate-400 py-10 px-4">
          <Icons.Sparkles className="mx-auto mb-2 text-slate-300" size={32} />
          <p className="font-medium">Faith is the assurance of things hoped for.</p>
          <p className="text-xs mt-1">Upload a photo to mark this chapter of your walk!</p>
        </div>
      )}
    </div>
  );
};