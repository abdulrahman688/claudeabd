/**
 * Chat Routes
 * Sham AI assistant conversation endpoints
 */

import { Router } from 'express';
import * as chatController from '../controllers/chat.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

/**
 * GET /api/v1/chat/conversations
 */
router.get('/conversations', chatController.getConversations);

/**
 * GET /api/v1/chat/conversation/:id/messages
 */
router.get('/conversation/:id/messages', chatController.getConversationMessages);

/**
 * POST /api/v1/chat/send
 */
router.post('/send', chatController.sendMessage);

/**
 * GET /api/v1/chat/suggested-responses
 */
router.get('/suggested-responses', chatController.getSuggestedResponses);

export default router;
