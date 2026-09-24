import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StatsOverview } from '../components/StatsOverview';
import { FilterBar } from '../components/FilterBar';
import { TaskCard } from '../components/TaskCard';
import { TaskTable } from '../components/TaskTable';
import { TaskModal } from '../components/TaskModal';
import { DeleteModal } from '../components/DeleteModal';
import { EmptyState } from '../components/EmptyState';
import { api } from '../services/api';
import { Task, TaskPriority, TaskStats, TaskStatus } from '../types';
import { Loader2 } from 'lucide-react';

interface DashboardProps {
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  selectedSidebarStatus: string;
  setSelectedSidebarStatus: (status: string) => void;
  selectedSidebarPriority: string;
  setSelectedSidebarPriority: (priority: string) => void;
  isSeeding: boolean;
  onSeedData: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onShowToast,
  isCreateModalOpen,
  setIsCreateModalOpen,
  selectedSidebarStatus,
  setSelectedSidebarStatus,
  selectedSidebarPriority,
  setSelectedSidebarPriority,
  isSeeding,
  onSeedData,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasksForStats, setAllTasksForStats] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all tasks without filter to compute accurate stats
  const fetchAllForStats = useCallback(async () => {
    try {
      const data = await api.tasks.getAll({});
      setAllTasksForStats(data.tasks);
    } catch (err: any) {
      console.error('Error fetching stats tasks:', err);
    }
  }, []);

  // Fetch filtered tasks for current view
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.tasks.getAll({
        search,
        status: selectedSidebarStatus,
        priority: selectedSidebarPriority,
        sort,
      });
      setTasks(data.tasks);
    } catch (err: any) {
      onShowToast('error', err.message || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedSidebarStatus, selectedSidebarPriority, sort, onShowToast]);

  // Initial load
  useEffect(() => {
    fetchTasks();
    fetchAllForStats();
  }, [fetchTasks, fetchAllForStats]);

  // Compute stats dynamically
  const stats: TaskStats = useMemo(() => {
    const total = allTasksForStats.length;
    const pending = allTasksForStats.filter((t) => t.status === 'Pending').length;
    const inProgress = allTasksForStats.filter((t) => t.status === 'In Progress').length;
    const completed = allTasksForStats.filter((t) => t.status === 'Completed').length;
    const highPriority = allTasksForStats.filter((t) => t.priority === 'High').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, pending, inProgress, completed, highPriority, completionRate };
  }, [allTasksForStats]);

  // CRUD Handlers
  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
  }) => {
    const res = await api.tasks.create(taskData);
    onShowToast('success', res.message || 'Task created successfully!');
    fetchTasks();
    fetchAllForStats();
  };

  const handleUpdateTask = async (taskData: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
  }) => {
    if (!editingTask) return;
    const res = await api.tasks.update(editingTask._id, taskData);
    onShowToast('success', res.message || 'Task updated successfully!');
    setEditingTask(null);
    fetchTasks();
    fetchAllForStats();
  };

  const handleToggleComplete = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await api.tasks.update(task._id, { status: newStatus });
      onShowToast(
        'success',
        newStatus === 'Completed' ? 'Task marked as completed!' : 'Task marked as pending.'
      );
      fetchTasks();
      fetchAllForStats();
    } catch (err: any) {
      onShowToast('error', err.message || 'Failed to update task status');
    }
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;
    try {
      await api.tasks.update(task._id, { status: newStatus });
      onShowToast('success', `Task moved to ${newStatus}!`);
      fetchTasks();
      fetchAllForStats();
    } catch (err: any) {
      onShowToast('error', err.message || 'Failed to update status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    try {
      setIsDeleting(true);
      const res = await api.tasks.delete(deletingTask._id);
      onShowToast('success', res.message || 'Task deleted successfully.');
      setDeletingTask(null);
      fetchTasks();
      fetchAllForStats();
    } catch (err: any) {
      onShowToast('error', err.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedSidebarStatus('All');
    setSelectedSidebarPriority('All');
    setSort('createdAt_desc');
  };

  const isFiltered = search.trim() !== '' || selectedSidebarStatus !== 'All' || selectedSidebarPriority !== 'All' || sort !== 'createdAt_desc';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Dashboard Headline & Quick Metric Cards */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
          Task Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Track deadlines, prioritize work, and monitor your completion progress.
        </p>
      </div>

      {/* 5 Stats Cards */}
      <StatsOverview
        stats={stats}
        selectedStatus={selectedSidebarStatus}
        selectedPriority={selectedSidebarPriority}
        onFilterByStatus={setSelectedSidebarStatus}
        onFilterByPriority={setSelectedSidebarPriority}
      />

      {/* Filter and Search Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        status={selectedSidebarStatus}
        onStatusChange={setSelectedSidebarStatus}
        priority={selectedSidebarPriority}
        onPriorityChange={setSelectedSidebarPriority}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClearFilters={handleClearFilters}
        totalResults={tasks.length}
      />

      {/* Task Listing or Empty State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
          <p className="text-sm font-medium">Loading your tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          isFiltered={isFiltered}
          onClearFilters={isFiltered ? handleClearFilters : undefined}
          onCreateTask={() => setIsCreateModalOpen(true)}
          onSeedData={onSeedData}
          isSeeding={isSeeding}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={(t) => setEditingTask(t)}
              onDelete={(t) => setDeletingTask(t)}
              onToggleComplete={handleToggleComplete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <TaskTable
          tasks={tasks}
          onEdit={(t) => setEditingTask(t)}
          onDelete={(t) => setDeletingTask(t)}
          onToggleComplete={handleToggleComplete}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Create Task Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        initialTask={null}
      />

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        initialTask={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deletingTask}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
