import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StorageService } from '../services/storage.js';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided. Please log in to access this resource.',
    });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'taskflow_jwt_secret_dev_key_2026';
    const decoded = jwt.verify(token, secret) as { id: string };

    const user = await StorageService.findUserById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
      return;
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error: any) {
    console.error('JWT verification error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Not authorized, token is invalid or has expired.',
    });
    return;
  }
};
