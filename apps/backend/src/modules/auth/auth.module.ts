import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { RoleService } from './role.service';
import { MfaService } from './mfa.service';
import { SessionService } from './session.service';

import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { MfaGuard } from './guards/mfa.guard';

import { DatabaseModule } from '../database/database.module';

/**
 * Authentication Module for Phase 1
 * 
 * Implements:
 * - Username/password authentication
 * - JWT-based sessions with refresh tokens
 * - Role-based access control (RBAC)
 * - Multi-factor authentication (TOTP)
 * - Session management
 * - Account lockout protection
 * - Multi-tenancy support
 * 
 * @author UNO Team
 * @version 1.0.0
 */
@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'dev-secret-key'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '8h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Core Services
    AuthService,
    UserService,
    RoleService,
    MfaService,
    SessionService,
    
    // Passport Strategies
    JwtStrategy,
    LocalStrategy,
    
    // Guards
    JwtAuthGuard,
    RolesGuard,
    MfaGuard,
  ],
  exports: [
    AuthService,
    UserService,
    RoleService,
    JwtAuthGuard,
    RolesGuard,
    MfaGuard,
  ],
})
export class AuthModule {} 