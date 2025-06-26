import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Global Prisma Database Module
 * 
 * Provides database access throughout the application with:
 * - Multi-tenant row-level security
 * - Connection pooling and optimization
 * - Query logging and monitoring
 * - Transaction support
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {} 