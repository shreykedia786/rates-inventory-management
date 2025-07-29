import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

/**
 * Database Module
 * 
 * Provides database services for the application.
 * In development mode, uses mock implementations.
 * In production, would integrate with actual Prisma client.
 */
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {} 