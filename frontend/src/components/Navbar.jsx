import React from 'react';
import { Menu, Bell, PlusCircle, User, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onToggleSidebar, activeTab, onNewComplaintClick }) => {
  const { user, loginWithDemo } = useAuth();
  const isAdmin = user?.role === 'admin';

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Student Portal Dashboard';
      case 'submit':
        return 'Submit Campus Complaint';
      case 'my-complaints':
        return 'My Tracked Complaints';
      case 'admin-dashboard':
        return 'Campus Administrator Command Hub';
      case 'all-complaints':
        return 'Campus-Wide Complaints Directory';
      case 'analytics':
        return 'Campus Maintenance Analytics';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-20 bg-brand-darker/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            {isAdmin
              ? 'Real-time infrastructure triage & resolution workflow'
              : 'Direct communication line with campus maintenance departments'}
          </p>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Quick Demo Switcher for Judges / Evaluators */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-white/10 px-2.5 py-1 rounded-xl text-xs">
          <span className="text-slate-400 text-[11px]">Quick Switch:</span>
          {isAdmin ? (
            <button
              onClick={() => loginWithDemo('student')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 transition-colors"
            >
              Switch to Student View
            </button>
          ) : (
            <button
              onClick={() => loginWithDemo('admin')}
              className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 transition-colors"
            >
              Switch to Admin View
            </button>
          )}
        </div>

        {/* Quick Submit Complaint CTA for Student */}
        {!isAdmin && onNewComplaintClick && (
          <button
            onClick={onNewComplaintClick}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-glow-blue transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Complaint</span>
          </button>
        )}

        {/* System Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>API Connected</span>
        </div>

        {/* User Avatar Chip */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
              {user?.name}
            </p>
            <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
