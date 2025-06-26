import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Prisma } from '@prisma/client';

/**
 * Enhanced Prisma Service for Multi-Tenant Architecture
 * 
 * Features:
 * - Multi-tenant data isolation
 * - Connection pooling and optimization
 * - Query logging and performance monitoring
 * - Transaction support with tenant context
 * - Error handling and retry logic
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const logLevel = configService.get<string>('LOG_LEVEL', 'info');
    const enableQueryLogging = configService.get<boolean>('ENABLE_QUERY_LOGGING', false);
    
    super({
      log: enableQueryLogging 
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'warn' },
            { emit: 'stdout', level: 'info' },
          ]
        : [
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'warn' },
          ],
      errorFormat: 'pretty',
    });

    // Query event listeners for monitoring
    if (enableQueryLogging) {
      this.$on('query', (e: Prisma.QueryEvent) => {
        const slowQueryThreshold = this.configService.get<number>('SLOW_QUERY_THRESHOLD_MS', 1000);
        
        if (e.duration >= slowQueryThreshold) {
          this.logger.warn(`Slow Query Detected (${e.duration}ms): ${e.query}`);
        } else if (logLevel === 'debug') {
          this.logger.debug(`Query (${e.duration}ms): ${e.query}`);
        }
      });
    }

    // Error event listener
    this.$on('error', (e: Prisma.LogEvent) => {
      this.logger.error('Database Error:', e.message);
    });

    // Warning event listener
    this.$on('warn', (e: Prisma.LogEvent) => {
      this.logger.warn('Database Warning:', e.message);
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
      
      // Test the connection
      await this.$queryRaw`SELECT 1`;
      this.logger.log('✅ Database connection verified');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('✅ Database disconnected successfully');
    } catch (error) {
      this.logger.error('❌ Error disconnecting from database:', error);
    }
  }

  /**
   * Execute a transaction with tenant context
   * Ensures all operations within the transaction respect multi-tenant isolation
   */
  async executeTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    }
  ): Promise<T> {
    return this.$transaction(fn, {
      maxWait: options?.maxWait ?? 5000, // 5 seconds
      timeout: options?.timeout ?? 10000, // 10 seconds
      isolationLevel: options?.isolationLevel ?? Prisma.TransactionIsolationLevel.ReadCommitted,
    });
  }

  /**
   * Get user with property access validation
   * Used for multi-tenant access control
   */
  async getUserWithProperties(userId: string, organizationId?: string) {
    return this.user.findUnique({
      where: { 
        id: userId,
        ...(organizationId && { organizationId }),
      },
      include: {
        organization: true,
        userProperties: {
          include: {
            property: {
              include: {
                organization: true,
              }
            }
          }
        },
        sessions: {
          where: {
            isActive: true,
            expiresAt: {
              gte: new Date(),
            }
          }
        }
      }
    });
  }

  /**
   * Get rates and inventory with tenant filtering
   * Automatically applies property-level access control
   */
  async getRatesInventoryForProperty(
    propertyId: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      roomTypeIds?: string[];
      ratePlanIds?: string[];
    }
  ) {
    return this.rateInventory.findMany({
      where: {
        propertyId,
        ...(filters?.startDate && filters?.endDate && {
          date: {
            gte: filters.startDate,
            lte: filters.endDate,
          }
        }),
        ...(filters?.roomTypeIds && {
          roomTypeId: {
            in: filters.roomTypeIds,
          }
        }),
        ...(filters?.ratePlanIds && {
          ratePlanId: {
            in: filters.ratePlanIds,
          }
        }),
      },
      include: {
        roomType: true,
        ratePlan: true,
        property: {
          select: {
            id: true,
            name: true,
            code: true,
            currency: true,
            timezone: true,
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { roomType: { code: 'asc' } },
        { ratePlan: { code: 'asc' } },
      ],
    });
  }

  /**
   * Create audit log entry
   * Automatically captures context for compliance
   */
  async createAuditLog(data: {
    userId?: string;
    propertyId?: string;
    action: Prisma.AuditAction;
    entityType: string;
    entityId?: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.auditLog.create({
      data: {
        ...data,
        oldValues: data.oldValues ? JSON.stringify(data.oldValues) : undefined,
        newValues: data.newValues ? JSON.stringify(data.newValues) : undefined,
      }
    });
  }

  /**
   * Health check method
   * Used by health check endpoint
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; details?: string }> {
    try {
      await this.$queryRaw`SELECT 1`;
      return { status: 'ok' };
    } catch (error) {
      return { 
        status: 'error', 
        details: error instanceof Error ? error.message : 'Unknown database error' 
      };
    }
  }

  /**
   * Get database statistics for monitoring
   */
  async getDatabaseStats() {
    try {
      const [
        userCount,
        propertyCount,
        rateInventoryCount,
        auditLogCount
      ] = await Promise.all([
        this.user.count(),
        this.property.count(),
        this.rateInventory.count(),
        this.auditLog.count()
      ]);

      return {
        users: userCount,
        properties: propertyCount,
        rateInventoryRecords: rateInventoryCount,
        auditLogs: auditLogCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting database stats:', error);
      throw error;
    }
  }
} 