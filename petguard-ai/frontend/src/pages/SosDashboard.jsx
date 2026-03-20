import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { ShieldAlert, MapPin, Search } from 'lucide-react';
import LiveMap from '../components/LiveMap';

const SosDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ issue: '', lat: '', lng: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIncidents();
    const subscription = supabase
      .channel('public:sos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos' }, (payload) => {
        setIncidents((current) => [payload.new, ...current]);
      })
      .subscribe();
    return () => { supabase.removeChannel(subscription); };
  }, []);

  const fetchIncidents = async () => {
    try {
      const { data, error } = await supabase.from('sos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setIncidents(data || []);
    } catch (err) { console.error('Error fetching sos:', err.message); } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendSos = async () => {
    if (!form.issue.trim()) {
      setError('Describe the emergency before broadcasting.');
      return;
    }
    setSending(true);
    setError(null);
    try {
      const lat = form.lat ? Number(form.lat) : null;
      const lng = form.lng ? Number(form.lng) : null;

      const payload = {
        issue: form.issue.trim(),
        lat: lat ?? 0,
        lng: lng ?? 0,
      };

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError('Please sign in to send an SOS.');
        setSending(false);
        return;
      }

      payload.user_id = session.user.id;

      const { error: insertError } = await supabase.from('sos').insert(payload);
      if (insertError) throw insertError;

      setForm({ issue: '', lat: '', lng: '' });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send SOS. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const timeAgo = (dateStr) => {
    const min = Math.round((new Date() - new Date(dateStr)) / 60000);
    if (min < 1) return 'Just now';
    if (min < 60) return `${min}m ago`;
    const hrs = Math.round(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.round(hrs / 24)}d ago`;
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-600 animate-pulse" />
            </span>
            Real-time SOS Feed
          </h1>
          <p className="text-slate-500 mt-2 ml-14">Live emergency broadcasts and radar map.</p>
        </div>
      </div>

      <div className="mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <LiveMap incidents={incidents} />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {loading ? (
             <div className="text-slate-500">Loading feeds...</div>
          ) : incidents.length === 0 ? (
            <div className="bg-green-50 rounded-2xl p-10 text-center border border-green-100">
              <h3 className="text-xl font-bold text-green-800 mb-2">Clear Skies!</h3>
              <p className="text-green-600">No active emergencies reported.</p>
            </div>
          ) : (
             <div className="space-y-4">
               {incidents.map((incident) => (
                 <div key={incident.id} className="bg-white rounded-2xl p-6 border border-slate-200">
                    <p className="text-lg font-semibold">"{incident.issue}"</p>
                    <p className="text-sm text-slate-500">Lat: {incident.lat}, Lng: {incident.lng} - {timeAgo(incident.created_at)}</p>
                 </div>
               ))}
             </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-3">Broadcast SOS</h3>
            <p className="text-xs text-slate-300 mb-4">
              Share a short description and, if possible, your approximate location so nearby helpers
              and responders can react quickly.
            </p>

            {error && (
              <div className="mb-3 rounded-lg bg-red-500/10 border border-red-400/60 px-3 py-2 text-xs">
                {error}
              </div>
            )}

            <label className="block text-xs font-medium mb-1" htmlFor="issue">
              What is happening?
            </label>
            <textarea
              id="issue"
              name="issue"
              rows={3}
              value={form.issue}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent mb-3"
              placeholder="E.g., Dog hit by vehicle, bleeding near the hind leg..."
            />

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium mb-1" htmlFor="lat">
                  Latitude (optional)
                </label>
                <input
                  id="lat"
                  name="lat"
                  type="number"
                  step="0.0001"
                  value={form.lat}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  placeholder="12.9716"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" htmlFor="lng">
                  Longitude (optional)
                </label>
                <input
                  id="lng"
                  name="lng"
                  type="number"
                  step="0.0001"
                  value={form.lng}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  placeholder="77.5946"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendSos}
              disabled={sending}
              className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldAlert className="w-5 h-5" />
              {sending ? 'Sending...' : 'Send Emergency SOS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SosDashboard;
