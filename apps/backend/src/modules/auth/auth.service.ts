import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

import { DatabaseService } from '../database/database.service';
import { User, UserRole, UserSession } from '@prisma/client';
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  ChangePasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { AuthResponse, TokenPayload } from './interfaces/auth.interface';
import { UserService } from './user.service';
import { SessionService } from './session.service';
import { MfaService } from './mfa.service';

/**
 * Authentication Service for Phase 1
 * 
 * Handles:
 * - User authentication and authorization
 * - JWT token generation and validation
 * - Password hashing and verification
 * - Account lockout protection
 * - Session management
 * - Multi-factor authentication integration
 * 
 * @author UNO Team
 * @version 1.0.0
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly bcryptRounds: number;
  private readonly maxLoginAttempts: number;
  private readonly lockoutDuration: number;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly mfaService: MfaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.bcryptRounds = this.configService.get<number>('BCRYPT_ROUNDS', 12);
    this.maxLoginAttempts = this.configService.get<number>('MAX_LOGIN_ATTEMPTS', 5);
    this.lockoutDuration = this.configService.get<number>('LOCKOUT_DURATION_MINUTES', 30);
  }

  /**
   * Authenticate user with email/username and password
   * Implements account lockout protection and failed attempt tracking
   */
  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const { email, password, mfaCode } = loginDto;

    // Find user by email or username
    const user = await this.userService.findByEmailOrUsername(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60));
      throw new UnauthorizedException(`Account locked. Try again in ${remainingTime} minutes.`);
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      await this.handleFailedLogin(user.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check MFA if enabled
    if (user.mfaEnabled) {
      if (!mfaCode) {
        throw new UnauthorizedException('MFA code required');
      }
      
      const isMfaValid = await this.mfaService.verifyToken(user.id, mfaCode);
      if (!isMfaValid) {
        await this.handleFailedLogin(user.id);
        throw new UnauthorizedException('Invalid MFA code');
      }
    }

    // Reset failed login attempts on successful login
    await this.resetFailedLoginAttempts(user.id);

    // Update last login timestamp
    await this.userService.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Create session
    await this.sessionService.createSession({
      userId: user.id,
      sessionToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        mfaEnabled: user.mfaEnabled,
      },
      tokens,
    };
  }

  /**
   * Register new user account
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, firstName, lastName, organizationId } = registerDto;

    // Check if user already exists
    const existingUser = await this.userService.findByEmailOrUsername(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = await this.userService.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    // Assign default role (Revenue Manager for now)
    await this.userService.assignRole(user.id, 'REVENUE_MANAGER', organizationId);

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        mfaEnabled: false,
      },
      tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Find session
      const session = await this.sessionService.findByRefreshToken(refreshToken);
      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
      const accessToken = await this.generateAccessToken(payload.sub, payload.email);

      // Update session
      await this.sessionService.updateSessionToken(session.id, accessToken);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await this.hashPassword(newPassword);

    // Update password
    await this.userService.updatePassword(userId, newPasswordHash);

    // Invalidate all sessions for security
    await this.sessionService.invalidateAllUserSessions(userId);
  }

  /**
   * Logout user and invalidate session
   */
  async logout(sessionToken: string): Promise<void> {
    await this.sessionService.invalidateSession(sessionToken);
  }

  /**
   * Validate JWT token and return user payload
   */
  async validateToken(token: string): Promise<TokenPayload> {
    try {
      const payload = this.jwtService.verify(token);
      
      // Check if session is still valid
      const session = await this.sessionService.findBySessionToken(token);
      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Session expired');
      }

      return {
        sub: payload.sub,
        email: payload.email,
        iat: payload.iat,
        exp: payload.exp,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // Private helper methods

  private async generateTokens(userId: string, email: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwtService.signAsync(payload);
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.bcryptRounds);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async handleFailedLogin(userId: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) return;

    const newFailedCount = user.failedLoginCount + 1;

    if (newFailedCount >= this.maxLoginAttempts) {
      // Lock account
      const lockedUntil = new Date(Date.now() + this.lockoutDuration * 60 * 1000);
      await this.userService.lockAccount(userId, lockedUntil);
    } else {
      // Increment failed count
      await this.userService.incrementFailedLoginCount(userId);
    }
  }

  private async resetFailedLoginAttempts(userId: string): Promise<void> {
    await this.userService.resetFailedLoginAttempts(userId);
  }
} 