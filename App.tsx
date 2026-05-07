import React, { useState, useEffect } from 'react';
import { View, UserProfile } from './types';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { PhotoJournal } from './components/PhotoJournal';
import { ManaRecipes } from './components/ManaRecipes';
import { Workouts } from './components/Workouts';
import { Coach } from './components/Coach';
import { Icons } from './components/Icons';

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const saved = localStorage.getItem('ggm_active_session');
    if (saved === 'true') {
      const profile = localStorage.getItem('ggm_user_profile');
      if (profile) {
        setUser(JSON.parse(profile));
      }
    }
  }, []);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('ggm_active_session', 'true');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ggm_active_session');
    setCurrentView(View.DASHBOARD);
  };

  const navigateTo = (view: View) => {
    if (view === currentView) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 150);
  };

  // Show login if not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard onChangeView={navigateTo} user={user} />;
      case View.PHOTO_JOURNAL:
        return <PhotoJournal />;
      case View.MANA_RECIPES:
        return <ManaRecipes />;
      case View.WORKOUTS:
        return <Workouts />;
      case View.COACH:
        return <Coach />;
      default:
        return <Dashboard onChangeView={navigateTo} user={user} />;
    }
  };

  const NavButton = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => navigateTo(view)}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
        currentView === view 
          ? 'text-purple-700' 
          : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <div className={`transition-all ${currentView === view ? 'scale-110' : ''}`}>
        <Icon size={22} strokeWidth={currentView === view ? 2.5 : 1.8} />
      </div>
      <span className={`text-[10px] font-bold tracking-wide ${currentView === view ? 'text-purple-700' : ''}`}>{label}</span>
      {currentView === view && (
        <div className="w-1 h-1 bg-purple-600 rounded-full" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        
        {/* Top Bar - Sub-pages */}
        {currentView !== View.DASHBOARD && (
          <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-10">
            <button 
              onClick={() => navigateTo(View.DASHBOARD)}
              className="flex items-center gap-1 text-slate-500 hover:text-purple-700 transition-colors"
            >
              <Icons.ChevronRight className="rotate-180" size={20} />
              <span className="font-semibold text-sm">Back</span>
            </button>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition-colors p-2"
              title="Logout"
            >
              <Icons.LogOut size={18} />
            </button>
          </div>
        )}

        {/* Dashboard Top Bar with Logout */}
        {currentView === View.DASHBOARD && (
          <div className="p-3 px-5 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
                <Icons.Cross className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm text-purple-900 tracking-tight">GGM</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition-colors p-2"
              title="Logout"
            >
              <Icons.LogOut size={18} />
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 overflow-y-auto p-4 scroll-smooth transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {renderView()}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-slate-100 p-2 pb-6 grid grid-cols-5 gap-1 sticky bottom-0 z-20 shadow-[0_-4px_12px_-1px_rgba(0,0,0,0.06)]">
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