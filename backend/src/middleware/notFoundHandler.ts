/**
 * 404 Not Found Handler Middleware
 */

import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
}
