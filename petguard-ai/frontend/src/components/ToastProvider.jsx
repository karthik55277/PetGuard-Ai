import React, { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext({
  notify: () => {},
});

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((toast) => {
    const id = ++idCounter;
    const payload = {
      id,
      title: toast.title || '',
      message: toast.message || '',
      type: toast.type || 'info', // info | success | error
    };
    setToasts((current) => [...current, payload]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, toast.duration || 3500);
  }, []);

  const remove = (id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-start gap-3 p-4 sm:p-6">
        {toasts.map((toast) => {
          const base =
            'pointer-events-auto w-full max-w-sm rounded-2xl shadow-lg border px-4 py-3 text-sm backdrop-blur bg-white/90 dark:bg-slate-900/90 flex items-start gap-3 animate-in fade-in slide-in-from-top-2';
          const tone =
            toast.type === 'success'
              ? 'border-emerald-200 text-emerald-900 dark:border-emerald-500/50 dark:text-emerald-100'
              : toast.type === 'error'
              ? 'border-red-200 text-red-900 dark:border-red-500/50 dark:text-red-100'
              : 'border-slate-200 text-slate-900 dark:border-slate-600 dark:text-slate-100';
          return (
            <button
              key={toast.id}
              type="button"
              onClick={() => remove(toast.id)}
              className={`${base} ${tone}`}
            >
              <div className="flex-1 text-left">
                {toast.title && <p className="font-semibold mb-0.5">{toast.title}</p>}
                {toast.message && <p className="text-xs text-slate-600 dark:text-slate-300">{toast.message}</p>}
              </div>
            </button>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

