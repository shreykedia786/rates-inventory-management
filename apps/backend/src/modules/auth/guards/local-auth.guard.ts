import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Local Authentication Guard
 * 
 * Uses local strategy for username/password authentication
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {} 