import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Activity, ShieldAlert, ListChecks, Stethoscope, MoonStar, Sun } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useTheme } from './ThemeProvider';

const Navbar = () => {
  const location = useLocation();
  const [session, setSession] = useState(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  
  const navLinks = [
    { name: 'Home', path: '/', icon: Heart },
    { name: 'AI Assistant', path: '/ai', icon: Activity },
    { name: 'SOS Dashboard', path: '/sos', icon: ShieldAlert },
    { name: 'Pet Profiles', path: '/pets', icon: ListChecks },
    { name: 'Hygiene Guide', path: '/hygiene', icon: Stethoscope },
  ];

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200/70 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-slate-50 tracking-tight">
                PetGuard <span className="text-primary-600">AI</span>
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-primary-500 text-slate-900 dark:text-slate-50'
                        : 'border-transparent text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 mr-2 ${
                        isActive ? 'text-primary-500' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <MoonStar className="w-4 h-4" />}
            </button>
            {session ? (
              <button 
                onClick={handleSignOut}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
                Sign Out
              </button>
            ) : (
              <Link 
                to="/auth"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-primary-600">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
