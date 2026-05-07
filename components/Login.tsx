import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (profile: UserProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [isReturning, setIsReturning] = useState(false);
  const [error, setError] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const [splashPhase, setSplashPhase] = useState(0);

  useEffect(() => {
    // Check if user exists
    const saved = localStorage.getItem('ggm_user_profile');
    if (saved) {
      setIsReturning(true);
      const profile = JSON.parse(saved) as UserProfile;
      setName(profile.name);
    }

    // Splash animation phases
    const t1 = setTimeout(() => setSplashPhase(1), 600);
    const t2 = setTimeout(() => setSplashPhase(2), 1400);
    const t3 = setTimeout(() => setSplashPhase(3), 2200);
    const t4 = setTimeout(() => setShowSplash(false), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const handleLogin = () => {
    if (!name.trim()) { setError('Enter your name, Warrior!'); return; }
    if (pin.length < 4) { setError('PIN must be at least 4 digits'); return; }

    const existing = localStorage.getItem('ggm_user_profile');
    
    if (existing) {
      const profile = JSON.parse(existing) as UserProfile;
      if (profile.pin !== pin) {
        setError('Wrong PIN. Try again, sister!');
        return;
      }
      // Update streak
      const today = new Date().toISOString().split('T')[0];
      const lastActive = profile.lastActiveDate;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      if (lastActive === yesterday) {
        profile.streakDays += 1;
      } else if (lastActive !== today) {
        profile.streakDays = 1;
      }
      profile.lastActiveDate = today;
      localStorage.setItem('ggm_user_profile', JSON.stringify(profile));
      onLogin(profile);
    } else {
      // New user
      const profile: UserProfile = {
        name: name.trim(),
        pin,
        joinDate: new Date().toISOString().split('T')[0],
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
      localStorage.setItem('ggm_user_profile', JSON.stringify(profile));
      onLogin(profile);
    }
  };

  // Splash screen
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#1a0533] via-[#2d1b69] to-[#0f0a1a] flex flex-col items-center justify-center overflow-hidden">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-amber-400/20"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Cross icon */}
        <div className={`transition-all duration-1000 ${splashPhase >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.4)]">
              <Icons.Cross className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
          </div>
        </div>

        {/* Title */}
        <div className={`mt-8 text-center transition-all duration-1000 ${splashPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Grace, Grit <span className="text-amber-400">'n'</span> Mana
          </h1>
        </div>

        {/* Subtitle */}
        <div className={`mt-3 transition-all duration-1000 ${splashPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-amber-200/60 text-sm tracking-[0.3em] uppercase font-medium">
            Steward Your Temple
          </p>
        </div>

        {/* Scripture */}
        <div className={`mt-8 max-w-xs text-center transition-all duration-1000 ${splashPhase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white/40 text-xs italic font-serif">
            "Your body is a temple of the Holy Spirit" — 1 Corinthians 6:19
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-br from-[#1a0533] via-[#2d1b69] to-[#0f0a1a] flex items-center justify-center p-4 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-400/15"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-[0_0_40px_rgba(245,158,11,0.3)] mb-6">
            <Icons.Cross className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Grace, Grit <span className="text-amber-400">'n'</span> Mana
          </h1>
          <p className="text-purple-300/50 text-xs mt-2 tracking-widest uppercase">Steward Your Temple</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-1">
            {isReturning ? `Welcome back!` : 'Begin Your Journey'}
          </h2>
          <p className="text-purple-300/50 text-sm mb-6">
            {isReturning ? 'Enter your PIN to continue' : 'Create your warrior profile'}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4 text-red-300 text-sm flex items-center gap-2">
              <Icons.Shield className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-purple-300/60 text-xs font-bold uppercase tracking-wider mb-2 block">
                Warrior Name
              </label>
              <div className="relative">
                <Icons.User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  placeholder="Your name"
                  disabled={isReturning}
                  className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-purple-300/60 text-xs font-bold uppercase tracking-wider mb-2 block">
                Temple PIN
              </label>
              <div className="relative">
                <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/40" />
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                  placeholder="4-6 digit PIN"
                  maxLength={6}
                  inputMode="numeric"
                  className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full mt-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
            >
              <Icons.Zap className="w-5 h-5" />
              {isReturning ? 'Enter the Temple' : 'Begin the Journey'}
            </button>
          </div>

          {isReturning && (
            <button
              onClick={() => { setIsReturning(false); setName(''); setPin(''); localStorage.removeItem('ggm_user_profile'); }}
              className="w-full mt-4 text-purple-400/40 text-xs hover:text-purple-300 transition-colors text-center"
            >
              Not {name}? Start fresh
            </button>
          )}
        </div>

        <p className="text-center text-white/15 text-xs mt-8 font-serif italic">
          "The LORD is my strength and my shield" — Psalm 28:7
        </p>
      </div>
    </div>
  );
};
