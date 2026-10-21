import React from 'react';
import {
  LayoutDashboard,
  FilePlus2,
  ListOrdered,
  ShieldAlert,
  BarChart3,
  LogOut,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'submit', label: 'Submit Complaint', icon: FilePlus2 },
    { id: 'my-complaints', label: 'My Complaints', icon: ListOrdered },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: ShieldAlert },
    { id: 'all-complaints', label: 'All Complaints', icon: ListOrdered },
    { id: 'analytics', label: 'Campus Analytics', icon: BarChart3 },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-brand-dark/95 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="h-20 flex items-center px-6 border-b border-white/10 gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-glow-blue">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-tight">CampusCare</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Smart Complaint Hub</p>
            </div>
          </div>

          {/* User Mode Banner */}
          <div className="p-4 mx-4 my-4 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isAdmin
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}
            >
              {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    isAdmin
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {isAdmin ? 'Campus Admin' : 'Student'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1.5">
            <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-blue-200" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Campus Helpline</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Emergency: Ext. 4040 / security@campuscare.edu
            </p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
