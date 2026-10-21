import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  LayoutGrid,
  List,
  Calendar,
  MapPin,
  Building,
  ArrowRight,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { ComplaintCard } from '../components/ComplaintCard';
import { ComplaintModal } from '../components/ComplaintModal';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const CATEGORIES = ['All', 'Electricity', 'Wi-Fi', 'Cleanliness', 'Water', 'Furniture', 'Other'];
const STATUSES = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

export const MyComplaints = ({ onNavigateSubmit }) => {
  const { showToast } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.getMyComplaints({
        search,
        category: selectedCategory,
        status: selectedStatus,
      });
      if (res.success) {
        setComplaints(res.complaints);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch complaints', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pending complaint?')) return;

    try {
      const res = await api.deleteComplaint(id);
      if (res.success) {
        showToast('Complaint removed successfully', 'success');
        setComplaints((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete complaint', 'error');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            My Submitted Complaints
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status updates and resolution records for your filed campus tickets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid vs Table View Mode */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={fetchComplaints}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onNavigateSubmit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-glow-blue transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Complaint</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0">Status:</span>
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedStatus === st
                  ? 'bg-blue-600 text-white shadow-glow-blue'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search & Category Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-white/5">
          <div className="md:col-span-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ticket ID (e.g. CC-2026), title, or location..."
                className="w-full pl-9 pr-24 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="p-16 text-center glass-panel rounded-2xl">
          <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 mt-3">Fetching your campus tickets...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="p-16 text-center rounded-2xl glass-panel border border-white/5 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-white">No complaints found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search || selectedCategory !== 'All' || selectedStatus !== 'All'
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'You have not submitted any complaints yet.'}
          </p>
          <button
            onClick={onNavigateSubmit}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-blue transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Ticket</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {complaints.map((c) => (
            <ComplaintCard
              key={c._id}
              complaint={c}
              onViewDetails={setSelectedComplaint}
              onDelete={handleDelete}
              canDelete={c.status === 'Pending'}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-white/10 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Ticket ID</th>
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {complaints.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => setSelectedComplaint(c)}
                  >
                    <td className="py-4 px-4 font-mono font-bold text-blue-400">
                      {c.complaintId}
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-semibold text-white truncate">{c.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{c.description}</p>
                    </td>
                    <td className="py-4 px-4">
                      <CategoryBadge category={c.category} />
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-4 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      <div className="flex items-center gap-1 truncate max-w-[150px]">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{c.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedComplaint(c)}
                          className="px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[11px] font-semibold transition-all"
                        >
                          Details
                        </button>
                        {c.status === 'Pending' && (
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onUpdateSuccess={(updated) => {
            setSelectedComplaint(updated);
            setComplaints((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
          }}
        />
      )}
    </div>
  );
};
