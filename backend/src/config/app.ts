/**
 * Express Application Configuration
 * Sets up middleware, routes, and error handling
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import logger from './logger';

// Import routes (will be created)
import authRoutes from '../routes/auth.routes';
import userRoutes from '../routes/user.routes';
import journeyRoutes from '../routes/journey.routes';
import moduleRoutes from '../routes/module.routes';
import chatRoutes from '../routes/chat.routes';
import jobRoutes from '../routes/job.routes';
import communityRoutes from '../routes/community.routes';

// Import middleware
import { errorHandler } from '../middleware/errorHandler';
import { notFoundHandler } from '../middleware/notFoundHandler';
import { correlationIdMiddleware } from '../middleware/correlationId';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
  const app = express();

  // ============================================
  // SECURITY MIDDLEWARE
  // ============================================

  // Helmet for security headers
  app.use(helmet());

  // CORS configuration
  const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  // ============================================
  // GENERAL MIDDLEWARE
  // ============================================

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Correlation ID for request tracking
  app.use(correlationIdMiddleware);

  // HTTP request logger
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(
      morgan('combined', {
        stream: {
          write: (message: string) => logger.info(message.trim()),
        },
      })
    );
  }

  // ============================================
  // HEALTH CHECK
  // ============================================

  app.get('/health', async (req: Request, res: Response) => {
    const { checkDatabaseHealth } = await import('./database');
    const { checkRedisHealth } = await import('./redis');

    const dbHealth = await checkDatabaseHealth();
    const redisHealth = await checkRedisHealth();

    const isHealthy = dbHealth && redisHealth;

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth ? 'up' : 'down',
        redis: redisHealth ? 'up' : 'down',
      },
    });
  });

  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'Syrian Renaissance Platform API',
      version: process.env.API_VERSION || 'v1',
      status: 'running',
      documentation: '/api/docs',
    });
  });

  // ============================================
  // API ROUTES
  // ============================================

  const apiVersion = process.env.API_VERSION || 'v1';
  const apiPrefix = `/api/${apiVersion}`;

  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}/users`, userRoutes);
  app.use(`${apiPrefix}/journey`, journeyRoutes);
  app.use(`${apiPrefix}/modules`, moduleRoutes);
  app.use(`${apiPrefix}/chat`, chatRoutes);
  app.use(`${apiPrefix}/jobs`, jobRoutes);
  app.use(`${apiPrefix}/community`, communityRoutes);

  // ============================================
  // ERROR HANDLING
  // ============================================

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
}
