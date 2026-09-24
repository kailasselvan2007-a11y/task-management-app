import React from 'react';
import {
  LayoutDashboard,
  Clock,
  PlayCircle,
  CheckCircle,
  AlertTriangle,
  User as UserIcon,
  X,
  Sparkles,
  Database,
  Layers,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { TaskStats } from '../types';

interface SidebarProps {
  stats: TaskStats;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  selectedPriority: string;
  onSelectPriority: (priority: string) => void;
  currentPage: 'dashboard' | 'profile';
  onNavigate: (page: 'dashboard' | 'profile') => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onSeedData: () => void;
  isSeeding: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  stats,
  selectedStatus,
  onSelectStatus,
  selectedPriority,
  onSelectPriority,
  currentPage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  onSeedData,
  isSeeding,
}) => {
  const isHighPriorityActive = selectedPriority === 'High';

  const navItems = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: LayoutDashboard,
      count: stats.total,
      isActive: currentPage === 'dashboard' && selectedStatus === 'All' && !isHighPriorityActive,
      onClick: () => {
        onNavigate('dashboard');
        onSelectStatus('All');
        onSelectPriority('All');
        onCloseMobile();
      },
    },
    {
      id: 'Pending',
      label: 'Pending',
      icon: Clock,
      count: stats.pending,
      isActive: currentPage === 'dashboard' && selectedStatus === 'Pending' && !isHighPriorityActive,
      onClick: () => {
        onNavigate('dashboard');
        onSelectStatus('Pending');
        onSelectPriority('All');
        onCloseMobile();
      },
      badgeClass: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'In Progress',
      label: 'In Progress',
      icon: PlayCircle,
      count: stats.inProgress,
      isActive: currentPage === 'dashboard' && selectedStatus === 'In Progress' && !isHighPriorityActive,
      onClick: () => {
        onNavigate('dashboard');
        onSelectStatus('In Progress');
        onSelectPriority('All');
        onCloseMobile();
      },
      badgeClass: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'Completed',
      label: 'Completed',
      icon: CheckCircle,
      count: stats.completed,
      isActive: currentPage === 'dashboard' && selectedStatus === 'Completed' && !isHighPriorityActive,
      onClick: () => {
        onNavigate('dashboard');
        onSelectStatus('Completed');
        onSelectPriority('All');
        onCloseMobile();
      },
      badgeClass: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'high-priority',
      label: 'High Priority',
      icon: AlertTriangle,
      count: stats.highPriority,
      isActive: currentPage === 'dashboard' && isHighPriorityActive,
      onClick: () => {
        onNavigate('dashboard');
        onSelectPriority('High');
        onSelectStatus('All');
        onCloseMobile();
      },
      badgeClass: 'bg-rose-100 text-rose-800',
    },
  ];

  const content = (
    <div className="flex flex-col h-full py-4 px-3">
      {/* Mobile Header with close button */}
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-200 lg:hidden">
        <span className="text-base font-bold text-slate-800">Navigation</span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Nav Links */}
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
          Task Views
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                item.isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${item.isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  item.isActive
                    ? 'bg-white/20 text-white'
                    : item.badgeClass || 'bg-slate-100 text-slate-600'
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Account Section */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
          Account
        </p>
        <button
          onClick={() => {
            onNavigate('profile');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            currentPage === 'profile'
              ? 'bg-indigo-600 text-white font-semibold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserIcon className={`w-4 h-4 ${currentPage === 'profile' ? 'text-white' : 'text-slate-500'}`} />
          <span>My Profile</span>
        </button>
      </div>

      {/* Quick Testing Tools for evaluation */}
      <div className="mt-auto pt-4 border-t border-slate-200">
        <div className="p-3 bg-gradient-to-br from-indigo-50/80 to-violet-50/80 rounded-2xl border border-indigo-100">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">Quick Test Data</span>
          </div>
          <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
            Need sample tasks to test the dashboard, filters, and priority cards?
          </p>
          <button
            onClick={onSeedData}
            disabled={isSeeding}
            className="w-full py-1.5 px-3 bg-white hover:bg-slate-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 shadow-2xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSeeding ? 'Loading sample tasks...' : 'Load Sample Tasks'}
          </button>
        </div>

        {/* Tech Stack Footer Pill */}
        <div className="mt-3 px-2 py-1.5 text-[10px] text-slate-600 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-500" /> Mongoose
          </span>
          <span className="flex items-center gap-1">
            <Server className="w-3 h-3 text-indigo-500" /> Express
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-violet-500" /> JWT
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Mobile Slide-over Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-200 ease-in-out lg:hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
};
