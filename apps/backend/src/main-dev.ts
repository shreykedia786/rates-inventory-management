import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppDevModule } from './app-dev.module';

/**
 * Bootstrap the Rates & Inventory Management Platform API - Development Mode
 * Simplified version without external dependencies
 */
async function bootstrap() {
  const app = await NestFactory.create(AppDevModule);
  const logger = new Logger('Bootstrap');

  const port = process.env.PORT || 8000;

  // Basic validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for development
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Basic Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Rates & Inventory Management API - Development')
    .setDescription('Development version of the Rates & Inventory Management Platform API')
    .setVersion('1.0.0-dev')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start the server
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Development API started successfully`);
  logger.log(`📡 Server running on http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  logger.log(`🛠️  Development mode - simplified setup without external dependencies`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('💥 Failed to start application:', error);
  process.exit(1);
}); 