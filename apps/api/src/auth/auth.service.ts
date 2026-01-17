import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string, name: string, role: string) {
    const hashedPassword = await hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role as 'PATIENT' | 'DOCTOR' | 'FRONTDESK' | 'ADMIN',
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tokens: this.generateTokens(user.id, user.email, user.role),
    };
  }

  async login(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user || !(await compare(password, user.password))) {
        throw new UnauthorizedException('Invalid email or password');
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        tokens: this.generateTokens(user.id, user.email, user.role),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Database or other errors should not expose internal details
      if (error instanceof Error) {
        if (error.message.includes('database') || error.message.includes('Database')) {
          throw new InternalServerErrorException(
            'Service temporarily unavailable. Please try again later.',
          );
        }
      }
      throw new InternalServerErrorException(
        'An error occurred during login. Please try again.',
      );
    }
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret:
          process.env.JWT_REFRESH_SECRET ||
          'default-refresh-secret-change-in-production',
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException('User not found');

      return this.generateTokens(user.id, user.email, user.role);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(
    userId: string,
    email: string,
    role: string,
  ): TokenResponse {
    const payload: JwtPayload = { sub: userId, email, role };
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production';

    const accessToken = this.jwtService.sign(
      payload as unknown as Record<string, unknown>,
      {
        secret: jwtSecret,
        expiresIn: '7d',
      },
    );

    const refreshToken = this.jwtService.sign(
      payload as unknown as Record<string, unknown>,
      {
        secret: refreshSecret,
        expiresIn: '30d',
      },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    };
  }
}
