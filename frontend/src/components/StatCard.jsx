import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'blue', subtext, onClick, active = false }) => {
  const colorStyles = {
    blue: {
      border: 'hover:border-blue-500/50',
      activeBorder: 'border-blue-500 shadow-glow-blue',
      iconBg: 'bg-blue-500/15 text-blue-400',
      textAccent: 'text-blue-400',
    },
    amber: {
      border: 'hover:border-amber-500/50',
      activeBorder: 'border-amber-500 shadow-lg shadow-amber-500/20',
      iconBg: 'bg-amber-500/15 text-amber-400',
      textAccent: 'text-amber-400',
    },
    cyan: {
      border: 'hover:border-cyan-500/50',
      activeBorder: 'border-cyan-500 shadow-glow-cyan',
      iconBg: 'bg-cyan-500/15 text-cyan-400',
      textAccent: 'text-cyan-400',
    },
    emerald: {
      border: 'hover:border-emerald-500/50',
      activeBorder: 'border-emerald-500 shadow-lg shadow-emerald-500/20',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      textAccent: 'text-emerald-400',
    },
  }[color] || {
    border: 'hover:border-blue-500/50',
    activeBorder: 'border-blue-500',
    iconBg: 'bg-blue-500/15 text-blue-400',
    textAccent: 'text-blue-400',
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl glass-panel p-6 transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${active ? colorStyles.activeBorder : `border-white/10 ${colorStyles.border}`} hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400 tracking-wide uppercase">{title}</span>
        <div className={`p-3 rounded-xl ${colorStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
      </div>
      {subtext && (
        <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
          {subtext}
        </p>
      )}
    </div>
  );
};
