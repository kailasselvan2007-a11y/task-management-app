import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { StorageService } from '../services/storage.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const user = await StorageService.findUserById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user profile.',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { name, email, password } = req.body;

    const user = await StorageService.findUserById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
      return;
    }

    // If changing email, check if it's already taken by someone else
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const existing = await StorageService.findUserByEmail(email);
      if (existing && existing._id.toString() !== userId) {
        res.status(400).json({
          success: false,
          message: 'This email is already in use by another account.',
        });
        return;
      }
    }

    if (password && password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    const updatedUser = await StorageService.updateUser(userId, {
      name: name ? name.trim() : undefined,
      email: email ? email.trim().toLowerCase() : undefined,
      password: password || undefined,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        _id: updatedUser!._id,
        name: updatedUser!.name,
        email: updatedUser!.email,
        createdAt: updatedUser!.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile.',
    });
  }
};
