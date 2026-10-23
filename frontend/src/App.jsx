import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { SubmitComplaint } from './pages/SubmitComplaint';
import { MyComplaints } from './pages/MyComplaints';
import { AdminDashboard } from './pages/AdminDashboard';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';

export function MainLayout() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [activeTab, setActiveTab] = useState(isAdmin ? 'admin-dashboard' : 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync default tab if role changes (e.g. via demo switch)
  React.useEffect(() => {
    if (isAdmin && !['admin-dashboard', 'all-complaints', 'analytics'].includes(activeTab)) {
      setActiveTab('admin-dashboard');
    } else if (!isAdmin && ['admin-dashboard', 'all-complaints', 'analytics'].includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070C18] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-400">Loading CampusCare System...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthPage />
        <Toast />
      </>
    );
  }

  const renderActivePage = () => {
    if (isAdmin) {
      return <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <StudentDashboard
            onNavigateSubmit={() => setActiveTab('submit')}
            onNavigateMyComplaints={() => setActiveTab('my-complaints')}
          />
        );
      case 'submit':
        return (
          <SubmitComplaint
            onSuccessRedirect={() => setActiveTab('my-complaints')}
          />
        );
      case 'my-complaints':
        return (
          <MyComplaints
            onNavigateSubmit={() => setActiveTab('submit')}
          />
        );
      default:
        return (
          <StudentDashboard
            onNavigateSubmit={() => setActiveTab('submit')}
            onNavigateMyComplaints={() => setActiveTab('my-complaints')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#070C18] text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          activeTab={activeTab}
          onNewComplaintClick={!isAdmin ? () => setActiveTab('submit') : null}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      <Toast />
    </div>
  );
}

export default function App() {
  return <MainLayout />;
}
