import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      process.env.CORS_ORIGIN,
    ].filter(Boolean),
    credentials: true,
  });

  // Register global exception filter (must be before ValidationPipe for proper error handling)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable validation with strict enforcement
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Reject if unknown properties present
      forbidUnknownValues: true, // Reject if unknown types
      transform: true, // Automatically transform payloads to DTO classes
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Set API prefix
  app.setGlobalPrefix('api');

  const port = process.env.API_PORT || 3000;
  await app.listen(port);
  console.log(`Nairobi Sculpt API running on port ${port}`);
}

void bootstrap();
