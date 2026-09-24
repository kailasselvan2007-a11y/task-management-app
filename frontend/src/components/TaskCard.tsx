import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
  MoreVertical,
  Check,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  onStatusChange,
}) => {
  const isCompleted = task.status === 'Completed';

  // Format due date & calculate if overdue
  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((taskDate.getTime() - today.getTime()) / 86400000);

    let label = taskDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: taskDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });

    let isOverdue = diffDays < 0 && !isCompleted;
    let isToday = diffDays === 0;
    let isTomorrow = diffDays === 1;

    if (isToday) label = 'Today';
    else if (isTomorrow) label = 'Tomorrow';
    else if (diffDays === -1) label = 'Yesterday';

    return { label, isOverdue, isToday };
  };

  const dueInfo = formatDueDate(task.dueDate);

  // Priority Styles
  const priorityBadge: Record<TaskPriority, { text: string; bg: string; border: string }> = {
    High: {
      text: 'text-rose-700 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      border: 'border-rose-200 dark:border-rose-900',
    },
    Medium: {
      text: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      border: 'border-amber-200 dark:border-amber-900',
    },
    Low: {
      text: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      border: 'border-emerald-200 dark:border-emerald-900',
    },
  };

  // Status Styles
  const statusBadge: Record<TaskStatus, { text: string; bg: string; dot: string }> = {
    Pending: {
      text: 'text-amber-800',
      bg: 'bg-amber-50/80 border-amber-200',
      dot: 'bg-amber-500',
    },
    'In Progress': {
      text: 'text-blue-800',
      bg: 'bg-blue-50/80 border-blue-200',
      dot: 'bg-blue-500',
    },
    Completed: {
      text: 'text-emerald-800',
      bg: 'bg-emerald-50/80 border-emerald-200',
      dot: 'bg-emerald-500',
    },
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between p-5 hover:shadow-md ${
        isCompleted
          ? 'border-slate-200/60 bg-slate-50/50 opacity-90'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Top Header: Priority Badge & Status Selector */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {/* Priority tag */}
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                priorityBadge[task.priority].bg
              } ${priorityBadge[task.priority].text} ${priorityBadge[task.priority].border}`}
            >
              {task.priority} Priority
            </span>

            {/* Quick Status Select */}
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                statusBadge[task.status].bg
              } ${statusBadge[task.status].text}`}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Quick Mark Complete Button */}
          <button
            onClick={() => onToggleComplete(task)}
            title={isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'border border-slate-200 text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Task Title */}
        <h3
          className={`text-base font-bold text-slate-900 leading-snug tracking-tight mb-2 line-clamp-2 ${
            isCompleted ? 'line-through text-slate-500' : ''
          }`}
        >
          {task.title}
        </h3>

        {/* Short Description */}
        {task.description && (
          <p
            className={`text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4 font-normal ${
              isCompleted ? 'line-through text-slate-400' : ''
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Details: Due Date & Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
        {/* Due date */}
        {dueInfo ? (
          <div
            className={`flex items-center gap-1.5 font-medium ${
              dueInfo.isOverdue
                ? 'text-rose-600 font-semibold'
                : dueInfo.isToday
                ? 'text-amber-600 font-semibold'
                : 'text-slate-500'
            }`}
          >
            {dueInfo.isOverdue ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
            <span>
              {dueInfo.isOverdue ? `Overdue (${dueInfo.label})` : dueInfo.label}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px]">No due date</span>
        )}

        {/* Edit and Delete Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task)}
            title="Delete Task"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
