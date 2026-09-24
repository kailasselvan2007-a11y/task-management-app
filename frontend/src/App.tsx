import React, { useState, useCallback, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { ToastContainer, ToastMessage } from './components/Toast';
import { api } from './services/api';
import { TaskStats } from './types';
import { Plus, Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Page Routing State ('dashboard' | 'profile' | 'login' | 'register')
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'profile'>('dashboard');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // UI States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Selected filters linked to sidebar
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Live task stats calculation for sidebar
  const [allTasks, setAllTasks] = useState<any[]>([]);

  const refreshAllTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await api.tasks.getAll({});
      setAllTasks(data.tasks);
    } catch (e) {
      // ignore in background
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (isAuthenticated) {
      refreshAllTasks();
    }
  }, [isAuthenticated, refreshAllTasks]);

  const stats: TaskStats = useMemo(() => {
    const total = allTasks.length;
    const pending = allTasks.filter((t) => t.status === 'Pending').length;
    const inProgress = allTasks.filter((t) => t.status === 'In Progress').length;
    const completed = allTasks.filter((t) => t.status === 'Completed').length;
    const highPriority = allTasks.filter((t) => t.priority === 'High').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, pending, inProgress, completed, highPriority, completionRate };
  }, [allTasks]);

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await api.tasks.seed();
      showToast('success', res.message || 'Sample tasks loaded successfully!');
      refreshAllTasks();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to seed sample tasks');
    } finally {
      setIsSeeding(false);
    }
  };

  // Loading spinner while verifying token
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-semibold text-slate-600">Starting TaskFlow...</p>
      </div>
    );
  }

  // Unauthenticated: Show Login or Register
  if (!isAuthenticated) {
    return (
      <>
        {authView === 'login' ? (
          <Login onNavigateToRegister={() => setAuthView('register')} />
        ) : (
          <Register onNavigateToLogin={() => setAuthView('login')} />
        )}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  // Authenticated: Show Dashboard or Profile
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenNewTask={() => setIsCreateModalOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          stats={stats}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          selectedPriority={selectedPriority}
          onSelectPriority={setSelectedPriority}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onSeedData={handleSeedData}
          isSeeding={isSeeding}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 pb-16">
          {currentPage === 'dashboard' ? (
            <Dashboard
              onShowToast={showToast}
              isCreateModalOpen={isCreateModalOpen}
              setIsCreateModalOpen={setIsCreateModalOpen}
              selectedSidebarStatus={selectedStatus}
              setSelectedSidebarStatus={setSelectedStatus}
              selectedSidebarPriority={selectedPriority}
              setSelectedSidebarPriority={setSelectedPriority}
              isSeeding={isSeeding}
              onSeedData={handleSeedData}
            />
          ) : (
            <Profile
              stats={stats}
              onBackToDashboard={() => setCurrentPage('dashboard')}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Floating Action Button on mobile devices */}
      <div className="fixed bottom-6 right-6 lg:hidden z-30">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
          aria-label="Create Task"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
