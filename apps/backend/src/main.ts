import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as compression from 'compression';
import helmet from 'helmet';

/**
 * Bootstrap the Rates & Inventory Management Platform API
 * Following Phase 1 specifications for enterprise B2B SaaS
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Global configuration
  const port = configService.get<number>('PORT', 8000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const enableSwagger = configService.get<boolean>('ENABLE_SWAGGER', true);
  const enableCors = configService.get<boolean>('ENABLE_CORS', true);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
  }));

  // Performance middleware
  app.use(compression());

  // CORS configuration for development
  if (enableCors) {
    app.enableCors({
      origin: nodeEnv === 'production' 
        ? ['https://app.rates-inventory.com'] // Replace with actual production domains
        : ['http://localhost:3000'], // Frontend development server
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
    });
  }

  // Global validation pipe with comprehensive error handling
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 422, // Unprocessable Entity for validation errors
    }),
  );

  // API versioning and global prefix
  app.setGlobalPrefix('api/v1');

  // OpenAPI/Swagger documentation (Phase 1 requirement)
  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle(configService.get<string>('API_TITLE', 'Rates & Inventory Management API'))
      .setDescription(
        configService.get<string>(
          'API_DESCRIPTION',
          'Centralized platform for managing rates, inventory, and restrictions across multiple channels with AI-powered insights'
        )
      )
      .setVersion(configService.get<string>('API_VERSION', '1.0.0'))
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addApiKey(
        {
          type: 'apiKey',
          name: 'X-Tenant-ID',
          in: 'header',
          description: 'Property/Organization identifier for multi-tenant access',
        },
        'tenant-id',
      )
      .addTag('Authentication', 'User authentication and session management')
      .addTag('Users', 'User management and RBAC')
      .addTag('Properties', 'Property and organization management')
      .addTag('Rates & Inventory', 'Rate and inventory management')
      .addTag('Restrictions', 'Rate restrictions and policies')
      .addTag('Channels', 'Channel manager integrations')
      .addTag('AI Insights', 'AI-powered rate suggestions and competitor analysis')
      .addTag('Audit', 'Audit logs and compliance')
      .addTag('Admin', 'Administrative functions')
      .addServer(
        nodeEnv === 'production' 
          ? 'https://api.rates-inventory.com'
          : `http://localhost:${port}`,
        nodeEnv === 'production' ? 'Production' : 'Development'
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: 'Rates & Inventory API Documentation',
      customfavIcon: '/favicon.ico',
      customCssUrl: nodeEnv === 'production' ? '/swagger-custom.css' : undefined,
    });

    logger.log(`📚 Swagger documentation available at http://localhost:${port}/api/docs`);
  }

  // Graceful shutdown handling
  const gracefulShutdown = (signal: string) => {
    logger.log(`🔄 Received ${signal}, starting graceful shutdown...`);
    
    setTimeout(() => {
      logger.log('⏰ Forcing shutdown after timeout');
      process.exit(1);
    }, 10000); // 10 second timeout

    app.close().then(() => {
      logger.log('✅ Application shut down gracefully');
      process.exit(0);
    }).catch((error) => {
      logger.error('❌ Error during shutdown:', error);
      process.exit(1);
    });
  };

  // Handle shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('💥 Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('🚫 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });

  // Start the server
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Rates & Inventory Management Platform API started successfully`);
  logger.log(`📡 Server running on http://localhost:${port}`);
  logger.log(`🌍 Environment: ${nodeEnv}`);
  logger.log(`🏢 Multi-tenant architecture enabled`);
  logger.log(`🔐 Enterprise security features active`);
  logger.log(`📊 Performance monitoring enabled`);

  if (nodeEnv === 'development') {
    logger.log(`🛠️  Development mode active - CORS and detailed logging enabled`);
    logger.log(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
    logger.log(`🗄️  Database Studio: Run 'npm run db:studio' to open Prisma Studio`);
  }
}

// Bootstrap the application
bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('💥 Failed to start application:', error);
  process.exit(1);
}); 