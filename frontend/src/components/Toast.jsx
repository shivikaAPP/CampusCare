import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Toast = () => {
  const { toastMessage, closeToast } = useAuth();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        closeToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (!toastMessage) return null;

  const { type, message } = toastMessage;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/40 bg-emerald-950/80 text-emerald-100 shadow-emerald-950/50';
      case 'error':
        return 'border-rose-500/40 bg-rose-950/80 text-rose-100 shadow-rose-950/50';
      default:
        return 'border-blue-500/40 bg-blue-950/80 text-blue-100 shadow-blue-950/50';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-xl backdrop-blur-md ${getBorderColor()}`}
      >
        {getIcon()}
        <p className="text-sm font-medium tracking-wide leading-tight">{message}</p>
        <button
          onClick={closeToast}
          className="ml-auto p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
