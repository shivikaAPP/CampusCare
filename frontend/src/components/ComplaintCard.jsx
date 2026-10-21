import React from 'react';
import { MapPin, Calendar, ArrowRight, Trash2, Building, User } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';

export const ComplaintCard = ({ complaint, onViewDetails, onDelete, canDelete = false }) => {
  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="group rounded-2xl glass-panel p-5 border border-white/10 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            {complaint.complaintId}
          </span>
          <div className="flex items-center gap-1.5">
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-2">
          {complaint.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {complaint.description}
        </p>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <CategoryBadge category={complaint.category} />
          <PriorityBadge priority={complaint.priority} />
        </div>
      </div>

      <div>
        {/* Location & Metadata */}
        <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{complaint.location}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {formatDate(complaint.createdAt)}
            </span>
            {complaint.assignedDepartment && complaint.assignedDepartment !== 'Unassigned' && (
              <span className="text-cyan-400 flex items-center gap-1 truncate max-w-[140px]">
                <Building className="w-3 h-3" />
                {complaint.assignedDepartment}
              </span>
            )}
          </div>
        </div>

        {/* Actions CTA */}
        <div className="mt-4 flex items-center justify-between gap-2 pt-2">
          <button
            onClick={() => onViewDetails(complaint)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600/15 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all"
          >
            Track & View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(complaint._id)}
              title="Delete Complaint"
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
