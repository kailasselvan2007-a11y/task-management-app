import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { StorageService } from '../services/storage.js';
import { TaskStatus, TaskPriority } from '../models/Task.js';

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { search, status, priority, sort } = req.query as {
      search?: string;
      status?: string;
      priority?: string;
      sort?: string;
    };

    const tasks = await StorageService.getTasks(userId, {
      search,
      status,
      priority,
      sort,
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks from server.',
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const task = await StorageService.getTaskById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
      return;
    }

    const taskUserId = typeof task.user === 'object' && (task.user as any)._id
      ? (task.user as any)._id.toString()
      : task.user.toString();

    if (taskUserId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this task.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error: any) {
    console.error('Error fetching single task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task.',
    });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid task title.',
      });
      return;
    }

    const validStatuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: Pending, In Progress, Completed',
      });
      return;
    }

    const validPriorities: TaskPriority[] = ['Low', 'Medium', 'High'];
    if (priority && !validPriorities.includes(priority)) {
      res.status(400).json({
        success: false,
        message: 'Invalid priority. Allowed values: Low, Medium, High',
      });
      return;
    }

    const newTask = await StorageService.createTask({
      title: title.trim(),
      description: (description || '').trim(),
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      user: userId,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task: newTask,
    });
  } catch (error: any) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating task.',
    });
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await StorageService.getTaskById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
      return;
    }

    const taskUserId = typeof task.user === 'object' && (task.user as any)._id
      ? (task.user as any)._id.toString()
      : task.user.toString();

    if (taskUserId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this task.',
      });
      return;
    }

    if (title !== undefined && !title.trim()) {
      res.status(400).json({
        success: false,
        message: 'Task title cannot be empty.',
      });
      return;
    }

    const updatedTask = await StorageService.updateTask(id, {
      title: title !== undefined ? title.trim() : undefined,
      description: description !== undefined ? description.trim() : undefined,
      status,
      priority,
      dueDate,
    });

    res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task: updatedTask,
    });
  } catch (error: any) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating task.',
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const task = await StorageService.getTaskById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
      return;
    }

    const taskUserId = typeof task.user === 'object' && (task.user as any)._id
      ? (task.user as any)._id.toString()
      : task.user.toString();

    if (taskUserId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task.',
      });
      return;
    }

    await StorageService.deleteTask(id);

    res.status(200).json({
      success: true,
      message: 'Task removed successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting task.',
    });
  }
};

// @desc    Seed sample tasks for current user
// @route   POST /api/tasks/seed
// @access  Private
export const seedTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const tasks = await StorageService.seedTasksForUser(userId);

    res.status(201).json({
      success: true,
      message: 'Sample tasks loaded successfully!',
      count: tasks.length,
      tasks,
    });
  } catch (error: any) {
    console.error('Error seeding tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while loading sample tasks.',
    });
  }
};
