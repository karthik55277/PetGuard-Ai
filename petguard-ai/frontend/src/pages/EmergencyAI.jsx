import React, { useState } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, CheckCircle2, Info, Send, Loader2 } from 'lucide-react';

const EmergencyAI = () => {
  const [symptoms, setSymptoms] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const commonSymptoms = [
    'Vomiting',
    'Fever',
    'Not eating',
    'Lethargy',
    'Injury or bleeding',
    'Difficulty breathing',
    'Seizures',
    'Diarrhea',
    'Ticks or fleas',
    'Poison ingestion',
    'Limping',
    'Excessive thirst',
  ];

  const toggleSymptom = (label) => {
    setSelectedSymptoms((current) =>
      current.includes(label)
        ? current.filter((s) => s !== label)
        : [...current, label]
    );
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptoms.trim() && selectedSymptoms.length === 0) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const combinedSymptoms = [
        selectedSymptoms.length > 0
          ? `Selected symptoms: ${selectedSymptoms.join(', ')}.`
          : '',
        symptoms.trim(),
      ]
        .filter(Boolean)
        .join(' ');

      const response = await axios.post(`${apiUrl}/ai/analyze`, { symptoms: combinedSymptoms });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the AI model. Please try again or contact a vet immediately.');
    } finally {
      setLoading(false);
    }
  };

  const severityConfig = {
    LOW: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle2 },
    MEDIUM: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Info },
    HIGH: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle },
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Emergency AI Assistant</h1>
          <p className="text-slate-500 mt-1">Describe your pet's symptoms for an immediate AI assessment.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8 leading-relaxed">
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quick-select common symptoms
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom) => {
                    const isActive = selectedSymptoms.includes(symptom);
                    return (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => toggleSymptom(symptom)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 border-primary-300'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                        disabled={loading}
                      >
                        {symptom}
                      </button>
                    );
                  })}
                </div>
                {selectedSymptoms.length > 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    Selected: <span className="font-medium">{selectedSymptoms.join(', ')}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-slate-700 mb-2">
                  Describe what's going on (optional but recommended)
                </label>
                <textarea
                  id="symptoms"
                  rows={5}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-slate-50 p-4 border transition-colors resize-none"
                  placeholder="E.g., My 5-year old Golden Retriever just ate chocolate and is now vomiting..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-slate-500">
                  You can rely only on the quick-select chips above, or combine them with a detailed description for a richer assessment.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || (!symptoms.trim() && selectedSymptoms.length === 0)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="-ml-1 mr-2 h-5 w-5" />
                      Get Assessment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className={`rounded-2xl p-6 border ${severityConfig[result.severity]?.border || 'border-slate-200'} ${severityConfig[result.severity]?.bg || 'bg-slate-50'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className="flex items-center gap-3 mb-4">
                {React.createElement(severityConfig[result.severity]?.icon || Info, {
                  className: `w-8 h-8 ${severityConfig[result.severity]?.color || 'text-slate-500'}`
                })}
                <h2 className={`text-2xl font-bold ${severityConfig[result.severity]?.color || 'text-slate-900'}`}>
                  Severity: {result.severity}
                </h2>
              </div>
              
              <div className="bg-white/60 rounded-xl p-5 mb-4 backdrop-blur-sm shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Primary Advice</h3>
                <p className="text-slate-800 text-lg leading-relaxed">{result.advice}</p>
              </div>

              {result.steps && result.steps.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Next Steps</h3>
                  <ul className="space-y-3">
                    {result.steps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm font-medium shadow-sm border border-slate-200">
                          {index + 1}
                        </span>
                        <span className="text-slate-800 pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg sticky top-8">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
              Disclaimer
            </h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              This AI assistant provides general guidance based on the symptoms described. It is <strong>NOT</strong> a replacement for professional veterinary care. 
            </p>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-sm font-medium text-white mb-2">When in doubt, always act with caution:</p>
              <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
                <li>Contact your local emergency vet.</li>
                <li>Do NOT give human medication.</li>
                <li>Keep the pet stable and warm.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAI;
