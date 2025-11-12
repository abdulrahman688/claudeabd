/**
 * Authentication Controller
 * Handles authentication-related requests
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth.service';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import logger from '../config/logger';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  phone: z.string().optional(),
  password: z.string().min(8),
  country: z.string().optional(),
  city: z.string().optional(),
  isDisplaced: z.boolean().optional(),
  language: z.enum(['ar', 'en']).optional(),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

const forgotPasswordSchema = z.object({
  username: z.string(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

// ============================================
// CONTROLLERS
// ============================================

/**
 * Register a new user
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // Register user
    const result = await authService.registerUser(validatedData);

    logger.info(`New user registered: ${validatedData.username}`);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(createError.badRequest(error.errors[0].message));
    } else {
      next(error);
    }
  }
}

/**
 * Login user
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Login user
    const result = await authService.loginUser(
      validatedData.username,
      validatedData.password
    );

    logger.info(`User logged in: ${validatedData.username}`);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(createError.badRequest(error.errors[0].message));
    } else {
      next(error);
    }
  }
}

/**
 * Logout user
 */
export async function logout(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw createError.badRequest('No token provided');
    }

    await authService.logoutUser(token);

    logger.info(`User logged out: ${req.user?.username}`);

    res.status(200).json({
      status: 'success',
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = refreshTokenSchema.parse(req.body);

    const result = await authService.refreshAccessToken(validatedData.refreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(createError.badRequest(error.errors[0].message));
    } else {
      next(error);
    }
  }
}

/**
 * Forgot password
 */
export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);

    await authService.initiatePasswordReset(validatedData.username);

    res.status(200).json({
      status: 'success',
      message: 'Password reset instructions sent',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(createError.badRequest(error.errors[0].message));
    } else {
      next(error);
    }
  }
}

/**
 * Reset password
 */
export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);

    await authService.resetPassword(validatedData.token, validatedData.newPassword);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(createError.badRequest(error.errors[0].message));
    } else {
      next(error);
    }
  }
}

/**
 * Verify token
 */
export async function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Token is valid',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
}
