import React from 'react';
import {
  Calendar,
  Check,
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  onStatusChange,
}) => {
  const priorityBadge: Record<TaskPriority, { text: string; bg: string }> = {
    High: { text: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
    Medium: { text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    Low: { text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  };

  const statusBadge: Record<TaskStatus, { text: string; bg: string }> = {
    Pending: { text: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' },
    'In Progress': { text: 'text-blue-800', bg: 'bg-blue-50 border-blue-200' },
    Completed: { text: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200' },
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return <span className="text-slate-400">None</span>;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return <span className="text-slate-400">None</span>;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const isOverdue = d.getTime() < today.getTime();

    return (
      <span className={`flex items-center gap-1.5 ${isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-600'}`}>
        {isOverdue && <AlertCircle className="w-3.5 h-3.5" />}
        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th scope="col" className="w-12 px-4 py-3.5 text-center">
                Done
              </th>
              <th scope="col" className="px-4 py-3.5">
                Task
              </th>
              <th scope="col" className="px-4 py-3.5 w-36">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5 w-28">
                Priority
              </th>
              <th scope="col" className="px-4 py-3.5 w-36">
                Due Date
              </th>
              <th scope="col" className="px-4 py-3.5 w-24 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const isCompleted = task.status === 'Completed';

              return (
                <tr
                  key={task._id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isCompleted ? 'bg-slate-50/40 text-slate-400' : ''
                  }`}
                >
                  {/* Done checkbox */}
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => onToggleComplete(task)}
                      className={`w-6 h-6 rounded-md mx-auto flex items-center justify-center transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'border border-slate-300 text-transparent hover:border-emerald-500'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </td>

                  {/* Title & Description */}
                  <td className="px-4 py-3.5 max-w-md">
                    <p
                      className={`font-semibold text-slate-900 leading-snug truncate ${
                        isCompleted ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-slate-500 truncate mt-0.5 max-w-sm">
                        {task.description}
                      </p>
                    )}
                  </td>

                  {/* Status select */}
                  <td className="px-4 py-3.5">
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                        statusBadge[task.status].bg
                      } ${statusBadge[task.status].text}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                  {/* Priority badge */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border inline-block ${
                        priorityBadge[task.priority].bg
                      } ${priorityBadge[task.priority].text}`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="px-4 py-3.5 text-xs">
                    {formatDate(task.dueDate)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(task)}
                        title="Edit task"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(task)}
                        title="Delete task"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
