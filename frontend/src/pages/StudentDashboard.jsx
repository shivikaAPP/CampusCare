import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Zap,
  Wifi,
  Sparkles,
  Droplets,
  Armchair,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ComplaintCard } from '../components/ComplaintCard';
import { ComplaintModal } from '../components/ComplaintModal';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const StudentDashboard = ({ onNavigateSubmit, onNavigateMyComplaints }) => {
  const { user, showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.getComplaintStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load student statistics:', err);
      showToast('Could not fetch dashboard analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Electricity':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Wi-Fi':
        return <Wifi className="w-4 h-4 text-cyan-400" />;
      case 'Cleanliness':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'Water':
        return <Droplets className="w-4 h-4 text-sky-400" />;
      case 'Furniture':
        return <Armchair className="w-4 h-4 text-indigo-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 md:p-8 border border-white/10 bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-cyan-950/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>CampusCare Student Helpdesk</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Hello, {user?.name || 'Student'}! 👋
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              Track issues with campus Wi-Fi, lab equipment, hostel maintenance, and sanitation. We guarantee automated ticket dispatch within 15 minutes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateSubmit}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-glow-blue transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Submit New Complaint</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Submitted"
          value={stats?.total ?? 0}
          icon={FileText}
          color="blue"
          subtext="Your lifetime tickets"
          onClick={onNavigateMyComplaints}
        />
        <StatCard
          title="Pending Triage"
          value={stats?.pending ?? 0}
          icon={Clock}
          color="amber"
          subtext="Awaiting review"
          onClick={onNavigateMyComplaints}
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgress ?? 0}
          icon={Wrench}
          color="cyan"
          subtext="Technicians on site"
          onClick={onNavigateMyComplaints}
        />
        <StatCard
          title="Resolved"
          value={stats?.resolved ?? 0}
          icon={CheckCircle2}
          color="emerald"
          subtext="Fixed and closed"
          onClick={onNavigateMyComplaints}
        />
      </div>

      {/* Two Column Layout: Recent Complaints & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Complaints */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Recent Complaints</h3>
              <p className="text-xs text-slate-400">Latest updates on your active and resolved tickets</p>
            </div>
            <button
              onClick={onNavigateMyComplaints}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center glass-panel rounded-2xl">
              <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 mt-3">Loading your tickets...</p>
            </div>
          ) : stats?.recentComplaints?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.recentComplaints.slice(0, 4).map((complaint) => (
                <ComplaintCard
                  key={complaint._id}
                  complaint={complaint}
                  onViewDetails={setSelectedComplaint}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl glass-panel border border-white/5 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-white">No complaints logged yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Have you noticed an electrical issue, Wi-Fi outage, or cleanliness problem? Submit a report now.
              </p>
              <button
                onClick={onNavigateSubmit}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-blue transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Complaint</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Category Distribution & Guidelines */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category Breakdown Widget */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              Complaints by Category
            </h3>

            {stats?.categoryCounts && stats.categoryCounts.length > 0 ? (
              <div className="space-y-3">
                {stats.categoryCounts.map((cat) => {
                  const total = stats.total || 1;
                  const percent = Math.round((cat.count / total) * 100);
                  return (
                    <div key={cat._id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          {getCategoryIcon(cat._id)}
                          <span>{cat._id}</span>
                        </div>
                        <span className="font-semibold text-white">
                          {cat.count} <span className="text-[10px] text-slate-400">({percent}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                Submit complaints to see breakdown.
              </p>
            )}
          </div>

          {/* Quick SLA & Support Card */}
          <div className="p-6 rounded-2xl glass-panel border border-blue-500/20 bg-gradient-to-br from-blue-950/30 to-slate-900/60 space-y-3">
            <div className="flex items-center gap-2 text-blue-300 font-semibold text-xs tracking-wider uppercase">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Campus Resolution SLAs</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center justify-between">
                <span>Critical Hazards (Leak/Wire):</span>
                <strong className="text-rose-400">&lt; 2 Hours</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Wi-Fi & Networking:</span>
                <strong className="text-amber-400">&lt; 6 Hours</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>General Maintenance:</span>
                <strong className="text-emerald-400">&lt; 24 Hours</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onUpdateSuccess={(updated) => {
            setSelectedComplaint(updated);
            fetchStats();
          }}
        />
      )}
    </div>
  );
};
