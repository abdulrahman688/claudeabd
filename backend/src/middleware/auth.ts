/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler';
import { cache } from '../config/redis';
import logger from '../config/logger';

// Extend Express Request interface to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role?: string;
  };
  correlationId?: string;
}

/**
 * Verify JWT token and attach user to request
 */
export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createError.unauthorized('Access token required');
    }

    // Check if token is blacklisted (logout)
    const isBlacklisted = await cache.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      throw createError.unauthorized('Token has been revoked');
    }

    // Verify token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as {
      id: string;
      username: string;
      role?: string;
    };

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError.unauthorized('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(createError.unauthorized('Token expired'));
    } else {
      next(error);
    }
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
export async function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next();
    }

    const decoded = jwt.verify(token, secret) as {
      id: string;
      username: string;
      role?: string;
    };

    req.user = decoded;
  } catch (error) {
    logger.warn('Optional auth failed:', error);
  }

  next();
}

/**
 * Role-based authorization
 */
export function authorize(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(createError.unauthorized('Authentication required'));
      return;
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.role || '')) {
      next(createError.forbidden('Insufficient permissions'));
      return;
    }

    next();
  };
}
