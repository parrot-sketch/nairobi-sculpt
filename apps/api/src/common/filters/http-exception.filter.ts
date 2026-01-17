import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // Log detailed error internally for debugging
    console.error('[HttpException]', {
      status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });

    const exceptionResponse = exception.getResponse() as Record<
      string,
      unknown
    >;

    // Sanitize error response to prevent information disclosure
    const errorResponse = {
      statusCode: status,
      message: this.getSafeErrorMessage(status, exceptionResponse),
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }

  private getSafeErrorMessage(
    status: number,
    exceptionResponse: Record<string, unknown>,
  ): string {
    // Check if it's a Prisma error (shouldn't leak field/table names)
    const message = exceptionResponse.message;
    if (typeof message === 'string' && message.includes('prisma')) {
      return 'Database operation failed';
    }

    // Return appropriate messages for common HTTP errors
    if (status === HttpStatus.UNAUTHORIZED) {
      return 'Invalid email or password';
    }

    if (status === HttpStatus.FORBIDDEN) {
      return typeof message === 'string'
        ? message
        : 'Access denied';
    }

    if (status === HttpStatus.NOT_FOUND) {
      return 'Resource not found';
    }

    if (status === HttpStatus.BAD_REQUEST) {
      // Only allow safe field validation messages
      if (
        typeof message === 'string' &&
        (message.includes('validation') || message.includes('Invalid'))
      ) {
        return message;
      }
      return 'Invalid request';
    }

    if (status === HttpStatus.CONFLICT) {
      return 'Resource already exists';
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      return typeof message === 'string'
        ? message
        : 'Service temporarily unavailable';
    }

    return 'An error occurred';
  }
}
