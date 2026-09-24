import React from 'react';
import {
  CheckSquare,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { TaskStats } from '../types';

interface StatsOverviewProps {
  stats: TaskStats;
  selectedStatus: string;
  selectedPriority: string;
  onFilterByStatus: (status: string) => void;
  onFilterByPriority: (priority: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats,
  selectedStatus,
  selectedPriority,
  onFilterByStatus,
  onFilterByPriority,
}) => {
  const cards = [
    {
      id: 'total',
      title: 'Total Tasks',
      value: stats.total,
      subtitle: `${stats.completed} of ${stats.total} done`,
      icon: CheckSquare,
      color: 'indigo',
      active: selectedStatus === 'All' && selectedPriority === 'All',
      onClick: () => {
        onFilterByStatus('All');
        onFilterByPriority('All');
      },
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    },
    {
      id: 'pending',
      title: 'Pending',
      value: stats.pending,
      subtitle: 'Awaiting start',
      icon: Clock,
      color: 'amber',
      active: selectedStatus === 'Pending' && selectedPriority === 'All',
      onClick: () => {
        onFilterByStatus('Pending');
        onFilterByPriority('All');
      },
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
    },
    {
      id: 'inProgress',
      title: 'In Progress',
      value: stats.inProgress,
      subtitle: 'Actively working',
      icon: PlayCircle,
      color: 'blue',
      active: selectedStatus === 'In Progress' && selectedPriority === 'All',
      onClick: () => {
        onFilterByStatus('In Progress');
        onFilterByPriority('All');
      },
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
    },
    {
      id: 'completed',
      title: 'Completed',
      value: stats.completed,
      subtitle: `${stats.completionRate}% completion`,
      icon: CheckCircle2,
      color: 'emerald',
      active: selectedStatus === 'Completed' && selectedPriority === 'All',
      onClick: () => {
        onFilterByStatus('Completed');
        onFilterByPriority('All');
      },
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
    {
      id: 'highPriority',
      title: 'High Priority',
      value: stats.highPriority,
      subtitle: 'Requires immediate attention',
      icon: AlertTriangle,
      color: 'rose',
      active: selectedPriority === 'High',
      onClick: () => {
        onFilterByPriority('High');
        onFilterByStatus('All');
      },
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.id}
            onClick={card.onClick}
            className={`group text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
              card.active
                ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition-colors truncate">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl shrink-0 ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {card.value}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1 truncate font-medium">
              {card.subtitle}
            </p>

            {/* Progress bar on completed card */}
            {card.id === 'completed' && (
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
