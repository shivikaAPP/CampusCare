import React from 'react';
import { Zap, Wifi, Sparkles, Droplets, Armchair, HelpCircle } from 'lucide-react';

export const getCategoryIcon = (category, className = 'w-4 h-4') => {
  switch (category) {
    case 'Electricity':
      return <Zap className={`${className} text-amber-400`} />;
    case 'Wi-Fi':
      return <Wifi className={`${className} text-cyan-400`} />;
    case 'Cleanliness':
      return <Sparkles className={`${className} text-emerald-400`} />;
    case 'Water':
      return <Droplets className={`${className} text-sky-400`} />;
    case 'Furniture':
      return <Armchair className={`${className} text-indigo-400`} />;
    default:
      return <HelpCircle className={`${className} text-purple-400`} />;
  }
};

export const CategoryBadge = ({ category }) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 border border-slate-700/60 text-slate-200">
      {getCategoryIcon(category, 'w-3.5 h-3.5')}
      <span>{category}</span>
    </span>
  );
};
