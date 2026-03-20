import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { ListChecks, Plus } from 'lucide-react';
import { useGamification } from '../components/GamificationProvider';
import { useToast } from '../components/ToastProvider';
import HealthTracker from '../components/HealthTracker';

const PetProfile = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', age: '', breed: '', history: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { awardForPetAdded } = useGamification();
  const { notify } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchPets(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchPets(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchPets = async (userId) => {
    try {
      const { data, error } = await supabase.from('pets').select('*').eq('user_id', userId);
      if (error) throw error;
      setPets(data || []);
    } catch (err) { console.error(err.message); } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Please enter your pet\'s name.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        user_id: session.user.id,
        name: form.name.trim(),
        breed: form.breed.trim() || null,
        history: form.history.trim() || null,
        age: form.age ? Number(form.age) : null,
      };
      const { error: insertError, data } = await supabase
        .from('pets')
        .insert(payload)
        .select('*')
        .single();
      if (insertError) throw insertError;
      setPets((current) => [data, ...current]);
      setForm({ name: '', age: '', breed: '', history: '' });
      setShowForm(false);
      awardForPetAdded();
      notify({
        type: 'success',
        title: 'Pet added',
        message: 'You earned points for being a responsible owner.',
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to add pet. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-slate-900">Sign in to manage your pets</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-slate-50">
          <span className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
            <ListChecks className="w-5 h-5 text-primary-600" />
          </span>
          My Pet Profiles
        </h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="w-4 h-4" />
          Add Pet
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Add a new pet</h2>
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <form className="grid md:grid-cols-2 gap-4" onSubmit={handleAddPet}>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
                Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Luna"
                required
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="breed">
                Breed
              </label>
              <input
                id="breed"
                name="breed"
                type="text"
                value={form.breed}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Golden Retriever"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="age">
                Age (years)
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="0"
                value={form.age}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="3"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="history">
                Medical notes / history
              </label>
              <textarea
                id="history"
                name="history"
                rows={3}
                value={form.history}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Allergies, past surgeries, chronic conditions, etc."
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Pet'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-slate-500 text-center">Loading your pets...</div>
      ) : pets.length === 0 ? (
        <div className="text-slate-500 text-center">No pets added yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {pets.map(pet => (
            <div key={pet.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">{pet.name}</h3>
              <p className="text-slate-500 dark:text-slate-300">
                {pet.breed} • {pet.age} years old
              </p>
              <HealthTracker petId={pet.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default PetProfile;
