import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StorageService } from '../services/storage.js';

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'taskflow_jwt_secret_dev_key_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await StorageService.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'A user with this email already exists. Please log in instead.',
      });
      return;
    }

    // Create user
    const user = await StorageService.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    // Automatically seed sample tasks for new user so they see a populated dashboard
    await StorageService.seedTasksForUser(user._id);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during user registration.',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
      return;
    }

    const user = await StorageService.findUserByEmail(email);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      });
      return;
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};
