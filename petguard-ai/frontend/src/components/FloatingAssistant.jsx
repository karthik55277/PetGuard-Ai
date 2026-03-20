import React, { useState } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useToast } from './ToastProvider';

const FloatingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const { notify } = useToast();

  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${apiUrl}/ai/analyze`, {
        symptoms: `User question from floating assistant: ${trimmed}`,
      });

      const data = response.data;
      const text =
        data && typeof data === 'object'
          ? `${data.advice || ''}${
              data.severity ? `\n\nSeverity: ${data.severity}` : ''
            }`
          : String(data);

      const updated = [
        ...nextMessages,
        { role: 'assistant', content: text || 'I could not generate advice right now.' },
      ];
      setMessages(updated);

      notify({
        type: 'success',
        title: 'AI response ready',
        message: 'Your PetGuard assistant has replied.',
      });
    } catch (err) {
      console.error(err);
      notify({
        type: 'error',
        title: 'Assistant error',
        message: 'Could not reach the AI service. Please try again.',
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong connecting to the AI.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl shadow-primary-500/40 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[320px] sm:w-[360px] rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 shadow-2xl backdrop-blur flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                PetGuard Assistant
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ask quick questions about your pet&apos;s health and care.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 px-4 py-3 space-y-2 overflow-y-auto max-h-72 text-sm">
            {messages.length === 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Examples: &quot;My dog is not eating&quot;, &quot;How often should I bathe my cat?&quot;,
                &quot;What should I do if I find a tick?&quot;
              </p>
            )}
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                    m.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs leading-relaxed">{m.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-200 dark:border-slate-700 px-3 py-2 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something about your pet..."
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-primary-600 disabled:opacity-60 text-white px-3 py-2 text-xs font-medium hover:bg-primary-700 transition-colors"
            >
              <Send className="w-3 h-3 mr-1" />
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingAssistant;

