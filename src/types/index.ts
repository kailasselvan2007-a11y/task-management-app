export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface TaskFilterOptions {
  search: string;
  status: string; // 'All' | TaskStatus
  priority: string; // 'All' | TaskPriority
  sort: string; // 'dueDate_asc' | 'dueDate_desc' | 'createdAt_desc' | 'title_asc'
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  highPriority: number;
  completionRate: number;
}
