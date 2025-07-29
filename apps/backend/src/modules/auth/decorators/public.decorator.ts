import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Public Decorator
 * 
 * Marks endpoints as publicly accessible (no authentication required)
 * Used with JwtAuthGuard to bypass authentication
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); 