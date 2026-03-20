import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabase';
import { Activity } from 'lucide-react';

const HealthTracker = ({ petId }) => {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ weight_kg: '', visit_date: '', vaccine: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('pet_health_logs')
        .select('*')
        .eq('pet_id', petId)
        .order('recorded_at', { ascending: true });
      if (!error) setLogs(data || []);
    };
    load();
  }, [petId]);

  const points = useMemo(
    () =>
      logs
        .filter((l) => l.weight_kg != null)
        .map((l, index) => ({
          x: index,
          y: Number(l.weight_kg),
        })),
    [logs]
  );

  const maxY = points.length ? Math.max(...points.map((p) => p.y)) : 0;
  const minY = points.length ? Math.min(...points.map((p) => p.y)) : 0;

  const pathD = useMemo(() => {
    if (points.length < 2) return '';
    const width = 260;
    const height = 80;
    const span = maxY - minY || 1;
    return points
      .map((p, idx) => {
        const x = (idx / (points.length - 1 || 1)) * width;
        const y = height - ((p.y - minY) / span) * height;
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [points, maxY, minY]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.weight_kg && !form.visit_date && !form.vaccine) return;
    setSaving(true);
    try {
      const payload = {
        pet_id: petId,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
        visit_date: form.visit_date || null,
        vaccine: form.vaccine || null,
        notes: form.notes || null,
      };
      const { data, error } = await supabase
        .from('pet_health_logs')
        .insert(payload)
        .select('*')
        .single();
      if (error) throw error;
      setLogs((current) => [...current, data]);
      setForm({ weight_kg: '', visit_date: '', vaccine: '', notes: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </span>
          <p className="text-sm font-semibold text-slate-900">Health tracker</p>
        </div>
        {points.length >= 2 && (
          <p className="text-xs text-slate-500">
            Weight trend: {minY}–{maxY} kg
          </p>
        )}
      </div>

      <div className="mb-3">
        {points.length >= 2 ? (
          <svg viewBox="0 0 260 80" className="w-full h-20">
            <path d={pathD} fill="none" className="stroke-emerald-500" strokeWidth="2" />
          </svg>
        ) : (
          <p className="text-xs text-slate-500">
            Add at least two weight entries to see a progress chart.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-2 md:grid-cols-4">
        <input
          name="weight_kg"
          type="number"
          step="0.1"
          placeholder="Weight (kg)"
          value={form.weight_kg}
          onChange={handleChange}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
        />
        <input
          name="visit_date"
          type="date"
          value={form.visit_date}
          onChange={handleChange}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
        />
        <input
          name="vaccine"
          type="text"
          placeholder="Vaccine / booster"
          value={form.vaccine}
          onChange={handleChange}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Log update'}
        </button>
      </form>
    </div>
  );
};

export default HealthTracker;

