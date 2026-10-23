import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Clock,
  Wrench,
  CheckCircle2,
  Users,
  Search,
  Filter,
  BarChart3,
  Building,
  RefreshCw,
  FileSpreadsheet,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  Send,
  Eye,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import { ComplaintModal } from '../components/ComplaintModal';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const DEPARTMENTS = [
  'All',
  'Unassigned',
  'Electrical Department',
  'IT & Networking',
  'Sanitation & Housekeeping',
  'Plumbing & Facilities',
  'Carpentry & Maintenance',
  'General Administration',
];

const CATEGORIES = ['All', 'Electricity', 'Wi-Fi', 'Cleanliness', 'Water', 'Furniture', 'Other'];
const STATUSES = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

export const AdminDashboard = ({ activeTab, setActiveTab }) => {
  const { showToast } = useAuth();

  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Selected complaint for deep inspection / admin workflow modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchAdminData = async (options = {}) => {
    try {
      setLoading(true);
      const searchQuery = options.searchOverride !== undefined ? options.searchOverride : search;
      const [statsRes, complaintsRes] = await Promise.all([
        api.getComplaintStats(),
        api.getAllComplaints({
          search: searchQuery,
          status: selectedStatus,
          category: selectedCategory,
          department: selectedDepartment,
        }),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (complaintsRes.success) setComplaints(complaintsRes.complaints);
    } catch (err) {
      showToast(err.message || 'Failed to load administrator data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [selectedStatus, selectedCategory, selectedDepartment]);

  // Smoothly scroll to target section when activeTab changes
  useEffect(() => {
    if (activeTab === 'all-complaints') {
      const el = document.getElementById('complaints-directory');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (activeTab === 'analytics') {
      const el = document.getElementById('campus-analytics');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (activeTab === 'admin-dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAdminData();
  };

  // Quick inline status change for admins
  const handleQuickStatusChange = async (complaintId, newStatus) => {
    try {
      const res = await api.updateComplaintStatus(complaintId, {
        status: newStatus,
        actionNote: `Status changed directly from triage matrix to ${newStatus}.`,
      });
      if (res.success) {
        showToast(`Complaint status updated to ${newStatus}`, 'success');
        setComplaints((prev) =>
          prev.map((c) => (c._id === complaintId ? res.complaint : c))
        );
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  // Quick department assignment
  const handleQuickDeptChange = async (complaintId, newDept) => {
    try {
      const res = await api.updateComplaintStatus(complaintId, {
        assignedDepartment: newDept,
        actionNote: `Reassigned to ${newDept} team.`,
      });
      if (res.success) {
        showToast(`Assigned to ${newDept}`, 'success');
        setComplaints((prev) =>
          prev.map((c) => (c._id === complaintId ? res.complaint : c))
        );
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Department assignment failed', 'error');
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const resolutionRate = stats?.total
    ? Math.round(((stats.resolved || 0) / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Top Admin Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 md:p-8 border border-white/10 bg-gradient-to-r from-purple-950/50 via-slate-900 to-blue-950/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs font-semibold text-purple-300">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>Campus Facilities Control Center</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Campus Infrastructure Command Center
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Monitor campus complaints across faculties, assign work orders to maintenance departments, and verify repair timelines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Tickets</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Campus Total Complaints"
          value={stats?.total ?? 0}
          icon={Layers}
          color="blue"
          subtext="Logged by students & faculty"
          onClick={() => {
            setSelectedStatus('All');
            setSelectedCategory('All');
            setSelectedDepartment('All');
          }}
        />
        <StatCard
          title="Pending Triage"
          value={stats?.pending ?? 0}
          icon={Clock}
          color="amber"
          subtext="Require department dispatch"
          onClick={() => setSelectedStatus('Pending')}
          active={selectedStatus === 'Pending'}
        />
        <StatCard
          title="In Progress Operations"
          value={stats?.inProgress ?? 0}
          icon={Wrench}
          color="cyan"
          subtext="Technicians on field"
          onClick={() => setSelectedStatus('In Progress')}
          active={selectedStatus === 'In Progress'}
        />
        <StatCard
          title="Resolution Rate"
          value={`${resolutionRate}%`}
          icon={CheckCircle2}
          color="emerald"
          subtext={`${stats?.resolved ?? 0} tickets marked resolved`}
          onClick={() => setSelectedStatus('Resolved')}
          active={selectedStatus === 'Resolved'}
        />
      </div>

      {/* Visual Analytics Hub (Category Distribution & Department Allocation) */}
      <div id="campus-analytics" className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-24">
        {/* Category Breakdown Chart Card */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Complaints by Category</span>
            </h3>
            <span className="text-xs text-slate-400">Total: {stats?.total || 0}</span>
          </div>

          <div className="space-y-3 pt-2">
            {stats?.categoryCounts && stats.categoryCounts.length > 0 ? (
              stats.categoryCounts.map((item) => {
                const total = stats.total || 1;
                const percentage = Math.round((item.count / total) * 100);
                return (
                  <div key={item._id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item._id}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{item.count} tickets</span>
                        <span className="text-slate-400 text-[10px]">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No category data recorded</p>
            )}
          </div>
        </div>

        {/* Department Allocation Matrix */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>Department Workload</span>
            </h3>
            <span className="text-xs text-slate-400">Assigned Units</span>
          </div>

          <div className="space-y-3 pt-2">
            {stats?.departmentCounts && stats.departmentCounts.length > 0 ? (
              stats.departmentCounts.map((dept) => {
                const total = stats.total || 1;
                const percentage = Math.round((dept.count / total) * 100);
                return (
                  <div key={dept._id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{dept._id || 'Unassigned'}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{dept.count} tasks</span>
                        <span className="text-slate-400 text-[10px]">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No department workload records</p>
            )}
          </div>
        </div>
      </div>

      {/* Complaint Triage & Dispatch Table */}
      <div id="complaints-directory" className="space-y-4 scroll-mt-24">
        {/* Table Filters Bar */}
        <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value === '') {
                    fetchAdminData({ searchOverride: '' });
                  }
                }}
                placeholder="Search ticket ID, student name, location, or issue keywords..."
                className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors"
              >
                Search
              </button>
            </form>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st === 'All' ? 'All Statuses' : st}
                  </option>
                ))}
              </select>

              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              {/* Department */}
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'All' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        {loading ? (
          <div className="p-16 text-center glass-panel rounded-2xl">
            <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 mt-3">Loading campus complaint registry...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-16 text-center rounded-2xl glass-panel border border-white/5 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-white">No complaints matched</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting the filter criteria or clearing the search query.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 border-b border-white/10 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-4 px-4">Ticket</th>
                    <th className="py-4 px-4">Student</th>
                    <th className="py-4 px-4">Complaint Title</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Priority</th>
                    <th className="py-4 px-4">Assigned Department</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {complaints.map((c) => (
                    <tr
                      key={c._id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Ticket ID */}
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          {c.complaintId}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {formatDate(c.createdAt)}
                        </div>
                      </td>

                      {/* Student Info */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="font-semibold text-white">{c.userName}</p>
                        <p className="text-[10px] text-slate-400">{c.userEmail}</p>
                      </td>

                      {/* Title & Location */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="font-semibold text-white truncate">{c.title}</p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate mt-0.5">
                          <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                          <span className="truncate">{c.location}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <CategoryBadge category={c.category} />
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-4">
                        <PriorityBadge priority={c.priority} />
                      </td>

                      {/* Assign Department Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={c.assignedDepartment || 'Unassigned'}
                          onChange={(e) => handleQuickDeptChange(c._id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-xs focus:outline-none focus:border-cyan-500"
                        >
                          {DEPARTMENTS.filter((d) => d !== 'All').map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={c.status}
                          onChange={(e) => handleQuickStatusChange(c._id, e.target.value)}
                          className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none ${
                            c.status === 'Resolved'
                              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                              : c.status === 'In Progress'
                              ? 'bg-blue-950/60 border-blue-500/40 text-blue-300'
                              : c.status === 'Rejected'
                              ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                              : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Inspect / Manage CTA */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedComplaint(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Admin Action & Timeline Modal */}
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onUpdateSuccess={(updated) => {
            setSelectedComplaint(updated);
            setComplaints((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
            fetchAdminData();
          }}
        />
      )}
    </div>
  );
};
