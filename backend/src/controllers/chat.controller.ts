/**
 * Chat Controller
 * Handles Sham AI conversations
 */

import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import * as shamService from '../services/sham.service';
import { createError } from '../middleware/errorHandler';
import logger from '../config/logger';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const sendMessageSchema = z.object({
  message: z.string().min(1).max(5000),
  conversationId: z.string().uuid().optional(),
});

// ============================================
// CONTROLLERS
// ============================================

/**
 * Get user's conversations
 */
export async function getConversations(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw createError.unauthorized('User not authenticated');
    }

    const conversations = await shamService.getUserConversations(req.user.id);

    res.status(200).json({
      status: 'success',
      data: { conversations },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get messages from a conversation
 */
export async function getConversationMessages(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw createError.unauthorized('User not authenticated');
    }

    const { id: conversationId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const messages = await shamService.getConversationMessages(
      req.user.id,
      conversationId,
      limit,
      offset
    );

    res.status(200).json({
      status: 'success',
      data: { messages },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Send a message to Sham
 */
export async function sendMessage(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw createError.unauthorized('User not authenticated');
    }

    const validatedData = sendMessageSchema.parse(req.body);

    const response = await shamService.sendMessageToSham(
      req.user.id,
      validatedData.message,
      validatedData.conversationId
    );

    logger.info(`Message sent to Sham by user: ${req.user.username}`);

    res.status(200).json({
      status: 'success',
      data: response,
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
 * Get suggested quick responses
 */
export async function getSuggestedResponses(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw createError.unauthorized('User not authenticated');
    }

    const suggestions = await shamService.getSuggestedResponses(req.user.id);

    res.status(200).json({
      status: 'success',
      data: { suggestions },
    });
  } catch (error) {
    next(error);
  }
}
