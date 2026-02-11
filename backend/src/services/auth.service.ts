/**
 * Authentication Service
 * Business logic for user authentication and authorization
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';
import { cache } from '../config/redis';
import { createError } from '../middleware/errorHandler';
import logger from '../config/logger';

// ============================================
// TYPES
// ============================================

interface RegisterUserData {
  username: string;
  password: string;
  phone?: string;
  country?: string;
  city?: string;
  isDisplaced?: boolean;
  language?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

interface UserResponse {
  id: string;
  username: string;
  language: string;
  createdAt: Date;
}

interface LoginResponse {
  user: UserResponse;
  tokens: AuthTokens;
}

// ============================================
// HELPERS
// ============================================

/**
 * Generate JWT access token
 */
function generateAccessToken(userId: string, username: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '15m';

  return jwt.sign(
    { id: userId, username },
    secret,
    { expiresIn }
  );
}

/**
 * Generate JWT refresh token
 */
function generateRefreshToken(userId: string): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  return jwt.sign(
    { id: userId, type: 'refresh' },
    secret,
    { expiresIn }
  );
}

/**
 * Hash password
 */
async function hashPassword(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hash
 */
async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Get token expiration time in seconds
 */
function getTokenExpirationSeconds(expiresIn: string): number {
  const unit = expiresIn[expiresIn.length - 1];
  const value = parseInt(expiresIn.slice(0, -1), 10);

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 3600;
    case 'd':
      return value * 86400;
    default:
      return 900; // Default 15 minutes
  }
}

// ============================================
// SERVICE FUNCTIONS
// ============================================

/**
 * Register a new user
 */
export async function registerUser(data: RegisterUserData): Promise<LoginResponse> {
  // Check if username already exists
  const existingUser = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (existingUser) {
    throw createError.conflict('Username already exists');
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Create user and profile in a transaction
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        username: data.username,
        phone: data.phone,
        passwordHash,
        country: data.country,
        city: data.city,
        isDisplaced: data.isDisplaced || false,
        language: data.language || 'ar',
      },
    });

    // Create user profile
    await tx.userProfile.create({
      data: {
        userId: newUser.id,
        currentPhase: 'healing',
        phaseStartDate: new Date(),
        daysActive: 0,
        streakDays: 0,
      },
    });

    // Create initial progress entry for today
    await tx.progress.create({
      data: {
        userId: newUser.id,
        date: new Date(),
      },
    });

    return newUser;
  });

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.username);
  const refreshToken = generateRefreshToken(user.id);

  // Store refresh token in Redis with expiration
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  const refreshTtl = getTokenExpirationSeconds(refreshExpiresIn);
  await cache.set(`refresh:${user.id}`, refreshToken, refreshTtl);

  logger.info(`User registered successfully: ${user.username}`);

  return {
    user: {
      id: user.id,
      username: user.username,
      language: user.language,
      createdAt: user.createdAt,
    },
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    },
  };
}

/**
 * Login user
 */
export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  // Find user
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw createError.unauthorized('Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    throw createError.forbidden('Account is deactivated');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw createError.unauthorized('Invalid credentials');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.username);
  const refreshToken = generateRefreshToken(user.id);

  // Store refresh token in Redis
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  const refreshTtl = getTokenExpirationSeconds(refreshExpiresIn);
  await cache.set(`refresh:${user.id}`, refreshToken, refreshTtl);

  logger.info(`User logged in: ${user.username}`);

  return {
    user: {
      id: user.id,
      username: user.username,
      language: user.language,
      createdAt: user.createdAt,
    },
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    },
  };
}

/**
 * Logout user by blacklisting token
 */
export async function logoutUser(token: string): Promise<void> {
  // Decode token to get expiration
  const decoded = jwt.decode(token) as { exp?: number };
  if (!decoded || !decoded.exp) {
    throw createError.badRequest('Invalid token');
  }

  // Calculate TTL (time until token expires)
  const now = Math.floor(Date.now() / 1000);
  const ttl = decoded.exp - now;

  if (ttl > 0) {
    // Blacklist token until it expires
    await cache.set(`blacklist:${token}`, 'true', ttl);
  }

  logger.info('User logged out successfully');
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  try {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, secret) as {
      id: string;
      type: string;
    };

    if (decoded.type !== 'refresh') {
      throw createError.unauthorized('Invalid token type');
    }

    // Check if refresh token exists in Redis
    const storedToken = await cache.get<string>(`refresh:${decoded.id}`);
    if (!storedToken || storedToken !== refreshToken) {
      throw createError.unauthorized('Invalid refresh token');
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || !user.isActive) {
      throw createError.unauthorized('User not found or inactive');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user.id, user.username);
    const newRefreshToken = generateRefreshToken(user.id);

    // Update refresh token in Redis
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    const refreshTtl = getTokenExpirationSeconds(refreshExpiresIn);
    await cache.set(`refresh:${user.id}`, newRefreshToken, refreshTtl);

    logger.info(`Access token refreshed for user: ${user.username}`);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError.unauthorized('Invalid refresh token');
    }
    throw error;
  }
}

/**
 * Initiate password reset (placeholder - needs email service)
 */
export async function initiatePasswordReset(username: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    // Don't reveal if user exists
    logger.warn(`Password reset requested for non-existent user: ${username}`);
    return;
  }

  // Generate reset token
  const resetToken = uuidv4();

  // Store reset token in Redis (valid for 1 hour)
  await cache.set(`reset:${resetToken}`, user.id, 3600);

  // TODO: Send reset email
  logger.info(`Password reset token generated for user: ${username}`);
  logger.info(`Reset token (for development): ${resetToken}`);
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  // Get user ID from reset token
  const userId = await cache.get<string>(`reset:${token}`);

  if (!userId) {
    throw createError.badRequest('Invalid or expired reset token');
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update user password
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  // Delete reset token
  await cache.del(`reset:${token}`);

  // Invalidate all existing refresh tokens
  await cache.delByPattern(`refresh:${userId}`);

  logger.info(`Password reset successful for user ID: ${userId}`);
}
