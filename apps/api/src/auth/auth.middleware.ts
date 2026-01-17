import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import type { AuthenticatedUser } from './auth.types';

// Extend Express Request with our custom user property
declare module 'express' {
  interface Request {
    user?: AuthenticatedUser;
  }
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
      }) as AuthenticatedUser;
      req.user = payload;
      next();
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

@Injectable()
export class RoleGuard {
  constructor() {}

  canActivate(context: any): boolean {
    const request = context.switchToHttp().getRequest() as Request;
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const requiredRole = Reflect.getMetadata('roles', context.getHandler());

    if (!requiredRole || requiredRole.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException('Insufficient permissions');
  }
}
