/**
 * Global Error Handler Middleware
 * Catches and formats all errors in the application
 */

import { Request, Response, NextFunction } from 'express';
import logger, { sanitizeLogData } from '../config/logger';
import { Prisma } from '@prisma/client';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error response interface
 */
interface ErrorResponse {
  status: 'error';
  statusCode: number;
  message: string;
  errors?: any[];
  stack?: string;
  correlationId?: string;
}

/**
 * Global error handler
 */
export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: any[] | undefined;

  // Handle known error types
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Prisma errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    switch (err.code) {
      case 'P2002':
        message = 'A record with this value already exists';
        errors = err.meta?.target as any[];
        break;
      case 'P2025':
        message = 'Record not found';
        break;
      case 'P2003':
        message = 'Foreign key constraint failed';
        break;
      default:
        message = 'Database error occurred';
    }
  }
  // Validation errors
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }
  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log error (but sanitize sensitive data)
  const sanitizedError = sanitizeLogData({
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.path,
    method: req.method,
    correlationId: (req as any).correlationId,
  });

  if (statusCode >= 500) {
    logger.error('Server Error:', sanitizedError);
  } else {
    logger.warn('Client Error:', sanitizedError);
  }

  // Prepare response
  const response: ErrorResponse = {
    status: 'error',
    statusCode,
    message,
    correlationId: (req as any).correlationId,
  };

  if (errors) {
    response.errors = errors;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

/**
 * Helper function to create API errors
 */
export const createError = {
  badRequest: (message: string) => new ApiError(400, message),
  unauthorized: (message = 'Unauthorized') => new ApiError(401, message),
  forbidden: (message = 'Forbidden') => new ApiError(403, message),
  notFound: (message = 'Resource not found') => new ApiError(404, message),
  conflict: (message: string) => new ApiError(409, message),
  tooManyRequests: (message = 'Too many requests') => new ApiError(429, message),
  internal: (message = 'Internal server error') => new ApiError(500, message, false),
};
