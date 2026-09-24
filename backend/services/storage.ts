import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { isMongoConnected } from '../config/db.js';
import User, { IUser } from '../models/User.js';
import Task, { ITask, TaskStatus, TaskPriority } from '../models/Task.js';

// In-memory fallback entities
export interface MemoryUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface MemoryTask {
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

// In-memory storage state for zero-config demonstration
const memoryUsers: MemoryUser[] = [];
const memoryTasks: MemoryTask[] = [];

// Initialize demo account & sample tasks for instant evaluation
const initDemoData = async () => {
  if (memoryUsers.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const demoHashedPassword = await bcrypt.hash('password123', salt);
    
    const demoUserId = '65f1a2b3c4d5e6f7a8b9c0d1';
    
    memoryUsers.push({
      _id: demoUserId,
      name: 'Alex Johnson',
      email: 'demo@taskflow.com',
      password: demoHashedPassword,
      createdAt: new Date(Date.now() - 7 * 86400000),
    });

    const now = new Date();
    const addDays = (days: number) => new Date(now.getTime() + days * 86400000).toISOString();

    memoryTasks.push(
      {
        _id: '65f1a2b3c4d5e6f7a8b9c001',
        title: 'Complete Full-Stack Project Documentation',
        description: 'Finalize the TaskFlow README, include installation guides, API endpoint specifications, and architecture diagrams.',
        status: 'In Progress',
        priority: 'High',
        dueDate: addDays(2),
        user: demoUserId,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '65f1a2b3c4d5e6f7a8b9c002',
        title: 'Review Database Indexing & Schemas',
        description: 'Verify MongoDB Mongoose schemas for User and Task models to ensure relational integrity and fast queries.',
        status: 'Completed',
        priority: 'Medium',
        dueDate: addDays(-1),
        user: demoUserId,
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '65f1a2b3c4d5e6f7a8b9c003',
        title: 'Implement JWT Security & Refresh Flow',
        description: 'Double check bcrypt hashing salt rounds and ensure authorization headers handle expired tokens safely.',
        status: 'In Progress',
        priority: 'High',
        dueDate: addDays(4),
        user: demoUserId,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '65f1a2b3c4d5e6f7a8b9c004',
        title: 'Design Mobile-Responsive Navigation',
        description: 'Ensure sidebar collapses gracefully into a drawer on mobile and tablet screens with touch accessibility.',
        status: 'Completed',
        priority: 'Low',
        dueDate: addDays(6),
        user: demoUserId,
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '65f1a2b3c4d5e6f7a8b9c005',
        title: 'Prepare Final College Project Presentation',
        description: 'Prepare demo walkthrough slides highlighting frontend React, Express REST endpoints, and MongoDB integration.',
        status: 'Pending',
        priority: 'Medium',
        dueDate: addDays(7),
        user: demoUserId,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
  }
};

initDemoData();

export const StorageService = {
  // USER METHODS
  async findUserByEmail(email: string) {
    if (isMongoConnected()) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    const user = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      async matchPassword(pwd: string) {
        return await bcrypt.compare(pwd, user.password);
      },
    };
  },

  async findUserById(id: string) {
    if (isMongoConnected()) {
      return await User.findById(id).select('-password');
    }
    const user = memoryUsers.find((u) => u._id === id);
    if (!user) return null;
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  },

  async createUser(userData: { name: string; email: string; password: string }) {
    if (isMongoConnected()) {
      const newUser = await User.create(userData);
      return {
        _id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newId = new mongoose.Types.ObjectId().toString();
    const newUser: MemoryUser = {
      _id: newId,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
    };
    memoryUsers.push(newUser);
    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  },

  async updateUser(id: string, updateData: { name?: string; email?: string; password?: string }) {
    if (isMongoConnected()) {
      const user = await User.findById(id);
      if (!user) return null;
      if (updateData.name) user.name = updateData.name;
      if (updateData.email) user.email = updateData.email;
      if (updateData.password) user.password = updateData.password;
      await user.save();
      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };
    }
    const user = memoryUsers.find((u) => u._id === id);
    if (!user) return null;
    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email.toLowerCase();
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updateData.password, salt);
    }
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  },

  // TASK METHODS
  async getTasks(userId: string, filters?: { search?: string; status?: string; priority?: string; sort?: string }) {
    if (isMongoConnected()) {
      const query: any = { user: userId };
      if (filters?.status && filters.status !== 'All') {
        query.status = filters.status;
      }
      if (filters?.priority && filters.priority !== 'All') {
        query.priority = filters.priority;
      }
      if (filters?.search) {
        const regex = new RegExp(filters.search, 'i');
        query.$or = [{ title: regex }, { description: regex }];
      }

      let sortOption: any = { createdAt: -1 };
      if (filters?.sort === 'dueDate_asc') sortOption = { dueDate: 1 };
      else if (filters?.sort === 'dueDate_desc') sortOption = { dueDate: -1 };
      else if (filters?.sort === 'createdAt_asc') sortOption = { createdAt: 1 };
      else if (filters?.sort === 'createdAt_desc') sortOption = { createdAt: -1 };
      else if (filters?.sort === 'title_asc') sortOption = { title: 1 };

      return await Task.find(query).sort(sortOption);
    }

    let results = memoryTasks.filter((t) => t.user === userId);

    if (filters?.status && filters.status !== 'All') {
      results = results.filter((t) => t.status === filters.status);
    }
    if (filters?.priority && filters.priority !== 'All') {
      results = results.filter((t) => t.priority === filters.priority);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      results = results.filter((t) => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s));
    }

    if (filters?.sort === 'dueDate_asc') {
      results.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    } else if (filters?.sort === 'dueDate_desc') {
      results.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      });
    } else if (filters?.sort === 'title_asc') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: createdAt descending
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return results;
  },

  async getTaskById(id: string) {
    if (isMongoConnected()) {
      return await Task.findById(id);
    }
    return memoryTasks.find((t) => t._id === id) || null;
  },

  async createTask(taskData: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string | null;
    user: string;
  }) {
    if (isMongoConnected()) {
      return await Task.create({
        ...taskData,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      });
    }

    const newTask: MemoryTask = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'Pending',
      priority: taskData.priority || 'Medium',
      dueDate: taskData.dueDate || null,
      user: taskData.user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryTasks.unshift(newTask);
    return newTask;
  },

  async updateTask(
    id: string,
    updateData: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: string | null;
    }
  ) {
    if (isMongoConnected()) {
      const task = await Task.findById(id);
      if (!task) return null;
      if (updateData.title !== undefined) task.title = updateData.title;
      if (updateData.description !== undefined) task.description = updateData.description;
      if (updateData.status !== undefined) task.status = updateData.status;
      if (updateData.priority !== undefined) task.priority = updateData.priority;
      if (updateData.dueDate !== undefined) {
        task.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null;
      }
      task.updatedAt = new Date();
      return await task.save();
    }

    const taskIndex = memoryTasks.findIndex((t) => t._id === id);
    if (taskIndex === -1) return null;

    const current = memoryTasks[taskIndex];
    const updated: MemoryTask = {
      ...current,
      title: updateData.title !== undefined ? updateData.title : current.title,
      description: updateData.description !== undefined ? updateData.description : current.description,
      status: updateData.status !== undefined ? updateData.status : current.status,
      priority: updateData.priority !== undefined ? updateData.priority : current.priority,
      dueDate: updateData.dueDate !== undefined ? updateData.dueDate : current.dueDate,
      updatedAt: new Date().toISOString(),
    };
    memoryTasks[taskIndex] = updated;
    return updated;
  },

  async deleteTask(id: string) {
    if (isMongoConnected()) {
      return await Task.findByIdAndDelete(id);
    }
    const idx = memoryTasks.findIndex((t) => t._id === id);
    if (idx === -1) return null;
    const removed = memoryTasks.splice(idx, 1);
    return removed[0];
  },

  async seedTasksForUser(userId: string) {
    const now = new Date();
    const addDays = (d: number) => new Date(now.getTime() + d * 86400000).toISOString();

    const sampleTasks = [
      {
        title: 'Review Full-Stack Project Codebase',
        description: 'Verify React components, Express REST API routes, and MongoDB schemas for college submission.',
        status: 'In Progress' as TaskStatus,
        priority: 'High' as TaskPriority,
        dueDate: addDays(2),
        user: userId,
      },
      {
        title: 'Design Responsive Mobile Dashboard',
        description: 'Test layout on mobile devices and implement collapsible drawer menu for seamless user experience.',
        status: 'Completed' as TaskStatus,
        priority: 'Medium' as TaskPriority,
        dueDate: addDays(-1),
        user: userId,
      },
      {
        title: 'Configure JWT Authentication Security',
        description: 'Audit bcrypt salt rounds, secure bearer tokens, and test protected API endpoints.',
        status: 'Completed' as TaskStatus,
        priority: 'High' as TaskPriority,
        dueDate: addDays(3),
        user: userId,
      },
      {
        title: 'Prepare Final Project Presentation Slides',
        description: 'Draft 10 presentation slides explaining architecture, MongoDB database models, and deployment.',
        status: 'Pending' as TaskStatus,
        priority: 'Medium' as TaskPriority,
        dueDate: addDays(5),
        user: userId,
      },
      {
        title: 'Write Comprehensive Unit & Integration Tests',
        description: 'Verify login, registration, task creation, filtering, and deletion flows.',
        status: 'Pending' as TaskStatus,
        priority: 'Low' as TaskPriority,
        dueDate: addDays(7),
        user: userId,
      },
    ];

    const created = [];
    for (const item of sampleTasks) {
      const task = await this.createTask(item);
      created.push(task);
    }
    return created;
  },
};
