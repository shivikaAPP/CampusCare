import React from 'react';
import { CheckCircle2, Clock, Wrench, AlertCircle, User, Shield } from 'lucide-react';

export const TimelineView = ({ timeline = [] }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="py-6 text-center text-slate-400 text-sm">
        No progress logs recorded yet.
      </div>
    );
  }

  const getStepIcon = (status, action) => {
    if (status === 'Resolved') {
      return (
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      );
    }
    if (status === 'In Progress') {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <Wrench className="w-4 h-4 animate-spin-slow" />
        </div>
      );
    }
    if (status === 'Rejected') {
      return (
        <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
        <Clock className="w-4 h-4" />
      </div>
    );
  };

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-blue-500/50 before:via-slate-700 before:to-slate-800">
      {timeline.map((event, idx) => (
        <div key={idx} className="relative flex items-start gap-4">
          <div className="absolute -left-6 z-10 shrink-0">
            {getStepIcon(event.status, event.action)}
          </div>
          <div className="ml-4 flex-1 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <h4 className="text-sm font-semibold text-white tracking-wide">
                {event.action}
              </h4>
              <span className="text-xs text-slate-400">
                {formatDate(event.timestamp)}
              </span>
            </div>
            {event.note && (
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                {event.note}
              </p>
            )}
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Shield className="w-3 h-3 text-blue-400" />
              <span>Logged by: <strong className="text-slate-200">{event.updatedBy || 'System'}</strong></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
