import React, { useState } from 'react';
import { X, MapPin, Calendar, User, Building, AlertCircle, CheckCircle2, Shield, Send } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { TimelineView } from './TimelineView';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const DEPARTMENTS = [
  'Unassigned',
  'Electrical Department',
  'IT & Networking',
  'Sanitation & Housekeeping',
  'Plumbing & Facilities',
  'Carpentry & Maintenance',
  'General Administration',
];

export const ComplaintModal = ({ complaint, onClose, onUpdateSuccess }) => {
  const { user, showToast } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [status, setStatus] = useState(complaint?.status || 'Pending');
  const [department, setDepartment] = useState(complaint?.assignedDepartment || 'Unassigned');
  const [priority, setPriority] = useState(complaint?.priority || 'Medium');
  const [adminNotes, setAdminNotes] = useState(complaint?.adminNotes || '');
  const [actionNote, setActionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (complaint) {
      setStatus(complaint.status || 'Pending');
      setDepartment(complaint.assignedDepartment || 'Unassigned');
      setPriority(complaint.priority || 'Medium');
      setAdminNotes(complaint.adminNotes || '');
      setActionNote('');
    }
  }, [complaint?._id]);

  if (!complaint) return null;

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.updateComplaintStatus(complaint._id, {
        status,
        assignedDepartment: department,
        priority,
        adminNotes,
        actionNote,
      });

      if (res.success) {
        showToast('Complaint status updated successfully!', 'success');
        if (onUpdateSuccess) {
          onUpdateSuccess(res.complaint);
        }
        setActionNote('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update complaint', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-brand-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold tracking-wider px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {complaint.complaintId}
            </span>
            <CategoryBadge category={complaint.category} />
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Title & Info */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
              {complaint.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-rose-400" />
                {complaint.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-400" />
                Submitted on {formatDate(complaint.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-400" />
                By {complaint.userName} {complaint.userEmail && `(${complaint.userEmail})`}
              </span>
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-cyan-400" />
                Department: <strong className="text-slate-200">{complaint.assignedDepartment || 'Unassigned'}</strong>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Complaint Description
            </h3>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>

          {/* Complaint Image (if available) */}
          {complaint.image && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Attached Photo Evidence
              </h3>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-black/40 max-h-80 flex items-center justify-center">
                <img
                  src={complaint.image}
                  alt={complaint.title}
                  className="w-full max-h-80 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          )}

          {/* Admin Controls Panel */}
          {isAdmin && (
            <div className="p-5 rounded-xl border border-blue-500/30 bg-blue-950/20 space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-blue-200 uppercase tracking-wide">
                  Administrative Workflow Actions
                </h3>
              </div>

              <form onSubmit={handleAdminUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Update Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Assign Department */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Assign Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Priority Level
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                {/* Resolution / Admin Notes */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Internal Resolution Remarks
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Technician deployed; part replaced by maintenance crew."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Timeline Action Note */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Timeline Progress Update (Visible to Student)
                  </label>
                  <input
                    type="text"
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="Add an update for the student's timeline..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Updating...' : 'Save & Post Update'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Timeline Tracking Section */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Status History & Progress Timeline
              </h3>
            </div>
            <TimelineView timeline={complaint.timeline} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-white/10 bg-slate-900/60">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
