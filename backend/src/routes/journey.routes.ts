/**
 * Journey Routes
 * User's 90-day journey through healing, learning, and earning phases
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import { Response, NextFunction } from 'express';

const router = Router();

router.use(authenticateToken);

router.get('/current-phase', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({ status: 'success', message: 'Get current phase endpoint' });
  } catch (error) {
    next(error);
  }
});

router.get('/today-ritual', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({ status: 'success', message: 'Get today ritual endpoint' });
  } catch (error) {
    next(error);
  }
});

router.post('/complete-ritual', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({ status: 'success', message: 'Complete ritual endpoint' });
  } catch (error) {
    next(error);
  }
});

router.get('/milestones', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({ status: 'success', message: 'Get milestones endpoint' });
  } catch (error) {
    next(error);
  }
});

export default router;
