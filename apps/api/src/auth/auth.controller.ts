import { Controller, Post, Body, BadRequestException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto, RefreshTokenDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    try {
      const result = await this.authService.signup(
        signupDto.email,
        signupDto.password,
        signupDto.name,
        signupDto.role,
      );
      return result;
    } catch (error: unknown) {
      // Log detailed error internally, return generic message to client
      console.error('Signup error:', error);
      throw new BadRequestException('Signup failed. Please check your details and try again.');
    }
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(
        loginDto.email,
        loginDto.password,
      );
      return {
        user: result.user,
        token: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      };
    } catch (error: unknown) {
      // Re-throw typed errors (UnauthorizedException, InternalServerErrorException)
      if (error instanceof Error) {
        if (error.name === 'UnauthorizedException') {
          throw error;
        }
        if (error.name === 'InternalServerErrorException') {
          throw error;
        }
      }

      // Log detailed error internally, return generic message to client
      console.error('Login error:', error);
      throw new BadRequestException('Invalid email or password.');
    }
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      return await this.authService.refreshToken(refreshTokenDto.refreshToken);
    } catch (error: unknown) {
      // Log detailed error internally, return generic message to client
      console.error('Token refresh error:', error);
      throw new BadRequestException('Token refresh failed. Please login again.');
    }
  }
}
