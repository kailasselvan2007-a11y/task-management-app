import React from 'react';
import { ClipboardList, Plus, Sparkles, FilterX } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onClearFilters?: () => void;
  onCreateTask: () => void;
  onSeedData: () => void;
  isSeeding: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onClearFilters,
  onCreateTask,
  onSeedData,
  isSeeding,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-xl mx-auto my-8 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
        {isFiltered ? <FilterX className="w-8 h-8" /> : <ClipboardList className="w-8 h-8" />}
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {isFiltered ? 'No matching tasks found' : 'No tasks created yet'}
      </h3>

      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
        {isFiltered
          ? 'No tasks matched your current search and filter combination. Try clearing your filters or searching with different keywords.'
          : 'Your task list is empty. Get started by creating your first task or load realistic demo tasks to explore the dashboard.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {isFiltered && onClearFilters ? (
          <button
            onClick={onClearFilters}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        ) : null}

        <button
          onClick={onCreateTask}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Create New Task
        </button>

        {!isFiltered && (
          <button
            onClick={onSeedData}
            disabled={isSeeding}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-xl border border-indigo-200 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isSeeding ? 'Loading sample tasks...' : 'Load Sample Data'}
          </button>
        )}
      </div>
    </div>
  );
};
