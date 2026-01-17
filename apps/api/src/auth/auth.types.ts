import { UserRole } from '@prisma/client';

/**
 * Authenticated user context attached to Express request
 */
export interface AuthenticatedUser {
  sub: string; // User ID
  email: string;
  role: UserRole;
  iat?: number; // Issued at (JWT timestamp)
  exp?: number; // Expiration (JWT timestamp)
}

/**
 * Extended Express Request with authenticated user
 */
export interface AuthRequest extends Express.Request {
  user: AuthenticatedUser;
}
