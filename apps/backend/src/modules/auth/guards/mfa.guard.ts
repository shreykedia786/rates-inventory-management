import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * MFA Guard
 * 
 * Ensures that MFA-enabled users have verified their MFA token
 * for sensitive operations
 */
@Injectable()
export class MfaGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // If MFA is enabled, ensure it's verified in this session
    if (user.mfaEnabled && !request.mfaVerified) {
      throw new UnauthorizedException('MFA verification required');
    }

    return true;
  }
} 