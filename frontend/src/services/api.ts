import { Task, TaskPriority, TaskStatus, User } from '../types';

const API_BASE_URL = '/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('taskflow_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Authentication
  auth: {
    async register(name: string, email: string, password: string): Promise<{ user: User; token: string; message: string }> {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      return handleResponse(res);
    },

    async login(email: string, password: string): Promise<{ user: User; token: string; message: string }> {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },
  },

  // User Profile
  user: {
    async getProfile(): Promise<{ user: User }> {
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    async updateProfile(data: { name?: string; email?: string; password?: string }): Promise<{ user: User; message: string }> {
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },

  // Task Operations
  tasks: {
    async getAll(params?: { search?: string; status?: string; priority?: string; sort?: string }): Promise<{ count: number; tasks: Task[] }> {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.status && params.status !== 'All') query.append('status', params.status);
      if (params?.priority && params.priority !== 'All') query.append('priority', params.priority);
      if (params?.sort) query.append('sort', params.sort);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE_URL}/tasks${qs}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    async getById(id: string): Promise<{ task: Task }> {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    async create(taskData: {
      title: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: string | null;
    }): Promise<{ task: Task; message: string }> {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });
      return handleResponse(res);
    },

    async update(
      id: string,
      taskData: {
        title?: string;
        description?: string;
        status?: TaskStatus;
        priority?: TaskPriority;
        dueDate?: string | null;
      }
    ): Promise<{ task: Task; message: string }> {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });
      return handleResponse(res);
    },

    async delete(id: string): Promise<{ message: string }> {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    async seed(): Promise<{ tasks: Task[]; message: string }> {
      const res = await fetch(`${API_BASE_URL}/tasks/seed`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },
};
