import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Heart, ArrowRight, CalendarHeart, Award } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useGamification } from '../components/GamificationProvider';

const useDashboardSummary = () => {
  const [data, setData] = React.useState({ pets: [], sos: [] });

  React.useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const [petsRes, sosRes] = await Promise.all([
        supabase.from('pets').select('*').eq('user_id', session.user.id),
        supabase.from('sos').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(5),
      ]);

      setData({
        pets: petsRes.data || [],
        sos: sosRes.data || [],
      });
    };
    load();
  }, []);

  const nextReminder = useMemo(() => {
    if (!data.pets.length) return null;
    // Placeholder: in future, use real vaccination dates
    return {
      label: 'Annual vaccination check-in',
      date: 'Next month',
    };
  }, [data.pets]);

  return { data, nextReminder };
};

const Home = () => {
  const { data, nextReminder } = useDashboardSummary();
  const { points, badges } = useGamification();

  return (
    <div className="flex flex-col gap-16 pb-12">
      <section className="relative px-6 py-16 md:py-24 bg-gradient-to-br from-primary-50 to-white rounded-3xl overflow-hidden border border-primary-100 shadow-sm mt-4">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-100 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="grid gap-10 md:grid-cols-[minmax(0,2fr),minmax(0,1.3fr)] items-center">
            <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Intelligent Care for Your <span className="text-primary-600">Furry Best Friend</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            PetGuard AI pairs advanced artificial intelligence with real-time emergency services. Because when it comes to your pet's life, every second counts.
          </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/ai" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5">
                  <Activity className="w-5 h-5 mr-2" />
                  Try AI Assistant
                </Link>
                <Link to="/sos" className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-all hover:-translate-y-0.5">
                  <ShieldAlert className="w-5 h-5 mr-2 text-red-500" />
                  SOS Dashboard
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-md px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">My pets</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {data.pets.length > 0 ? `${data.pets.length} linked profile${data.pets.length > 1 ? 's' : ''}` : 'No pets added yet'}
                    </p>
                  </div>
                </div>
                <Link to="/pets" className="text-xs font-medium text-primary-600 hover:text-primary-700">
                  Manage
                </Link>
              </div>

              <div className="bg-slate-900 text-white rounded-2xl shadow-lg px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-slate-300 uppercase tracking-wide">Recent SOS</p>
                    <p className="text-lg font-semibold">
                      {data.sos.length > 0 ? `${data.sos.length} alert${data.sos.length > 1 ? 's' : ''} in your history` : 'No SOS sent yet'}
                    </p>
                  </div>
                </div>
                <Link to="/sos" className="text-xs font-medium text-red-300 hover:text-red-200">
                  View
                </Link>
              </div>

              <div className="bg-primary-600 text-white rounded-2xl shadow-md px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center">
                    <CalendarHeart className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-primary-100 uppercase tracking-wide">Next reminder</p>
                    <p className="text-sm font-semibold">
                      {nextReminder ? nextReminder.label : 'Add a pet to see upcoming care reminders'}
                    </p>
                    {nextReminder && (
                      <p className="text-xs text-primary-100/80 mt-0.5">{nextReminder.date}</p>
                    )}
                  </div>
                </div>
                <Link to="/hygiene" className="text-xs font-medium text-primary-50 hover:text-white">
                  View guides
                </Link>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-amber-100 shadow-md px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">
                      PetGuard points
                    </p>
                    <p className="text-lg font-semibold text-slate-900">{points} pts</p>
                    {badges.length > 0 && (
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Badges: {badges.join(' • ')}
                      </p>
                    )}
                    {badges.length === 0 && (
                      <p className="text-[11px] text-amber-600 mt-0.5">
                        Add a pet and complete hygiene guides to earn badges.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Everything you need</h2>
          <p className="mt-4 text-slate-500">A complete ecosystem designed to keep your pet healthy, clean, and safe.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Symptom Check</h3>
            <p className="text-slate-600 mb-6 line-clamp-3">Describe your pet's symptoms and instantly receive an AI-powered severity assessment and actionable next steps.</p>
            <Link to="/ai" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
              Check symptoms <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time SOS</h3>
            <p className="text-slate-600 mb-6 line-clamp-3">Broadcast life-threatening emergencies instantly to a global real-time dashboard with geolocation support.</p>
            <Link to="/sos" className="inline-flex items-center text-red-600 font-medium hover:text-red-700">
              View SOS Feed <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Health & Hygiene</h3>
            <p className="text-slate-600 mb-6 line-clamp-3">Maintain digital records of your pet's health history and access curated guides for grooming and routine care.</p>
            <Link to="/pets" className="inline-flex items-center text-teal-600 font-medium hover:text-teal-700">
              Manage profiles <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
