import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { DatabaseService } from '../../database/database.service';

/**
 * JWT Strategy
 * 
 * Validates JWT tokens and extracts user information
 * Used by JwtAuthGuard for authentication
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validate JWT payload and return user
   */
  async validate(payload: any) {
    const { sub: userId, sessionId } = payload;

    // Verify user exists and is active
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
        properties: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Verify session is still valid
    const session = await this.databaseService.userSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    // Update session last used
    await this.databaseService.userSession.update({
      where: { id: sessionId },
      data: { lastUsedAt: new Date() },
    });

    return {
      ...user,
      sessionId,
    };
  }
} 