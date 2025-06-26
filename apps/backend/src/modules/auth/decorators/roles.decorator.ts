import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Roles Decorator
 * 
 * Marks endpoints with required user roles
 * Used with RolesGuard for role-based access control
 * 
 * @param roles - Array of required user roles
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles); 