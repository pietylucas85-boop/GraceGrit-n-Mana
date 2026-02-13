import React, { useState } from 'react';
import { View } from './types';
import { Dashboard } from './components/Dashboard';
import { PhotoJournal } from './components/PhotoJournal';
import { ManaRecipes } from './components/ManaRecipes';
import { Workouts } from './components/Workouts';
import { Coach } from './components/Coach';
import { Icons } from './components/Icons';

function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard onChangeView={setCurrentView} />;
      case View.PHOTO_JOURNAL:
        return <PhotoJournal />;
      case View.MANA_RECIPES:
        return <ManaRecipes />;
      case View.WORKOUTS:
        return <Workouts />;
      case View.COACH:
        return <Coach />;
      default:
        return <Dashboard onChangeView={setCurrentView} />;
    }
  };

  const NavButton = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
        currentView === view ? 'text-royal-purple' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon size={24} strokeWidth={currentView === view ? 2.5 : 2} />
      <span className="text-[10px] font-bold tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        
        {/* Top Bar - Only show on sub-pages */}
        {currentView !== View.DASHBOARD && (
          <div className="p-4 flex items-center gap-2 border-b border-slate-100 bg-white sticky top-0 z-10">
            <button 
              onClick={() => setCurrentView(View.DASHBOARD)}
              className="text-slate-500 hover:text-royal-purple transition-colors"
            >
              <Icons.ChevronRight className="rotate-180" size={24} />
            </button>
            <span className="font-bold text-slate-700">Back to Dashboard</span>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
          {renderView()}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-slate-100 p-2 pb-6 grid grid-cols-5 gap-1 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <NavButton view={View.DASHBOARD} icon={Icons.Home} label="Home" />
          <NavButton view={View.WORKOUTS} icon={Icons.Dumbbell} label="Temple" />
          <NavButton view={View.MANA_RECIPES} icon={Icons.Utensils} label="Mana" />
          <NavButton view={View.PHOTO_JOURNAL} icon={Icons.Camera} label="Journal" />
          <NavButton view={View.COACH} icon={Icons.MessageCircleHeart} label="Coach" />
        </div>

      </div>
    </div>
  );
}

export default App;