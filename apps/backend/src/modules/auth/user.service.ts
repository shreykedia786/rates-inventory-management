import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

/**
 * User Service for Phase 1
 * 
 * Handles:
 * - User CRUD operations
 * - Role assignment and management
 * - Account security (lockouts, failed attempts)
 * - User profile management
 * 
 * @author UNO Team
 * @version 1.0.0
 */
@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Find user by email or username
   */
  async findByEmailOrUsername(emailOrUsername: string) {
    return this.databaseService.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername.toLowerCase() },
          { username: emailOrUsername },
        ],
      },
      include: {
        userRoles: {
          include: {
            role: true,
            property: true,
          },
        },
      },
    });
  }

  /**
   * Find user by ID
   */
  async findById(userId: string) {
    return this.databaseService.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
            property: true,
          },
        },
      },
    });
  }

  /**
   * Create new user
   */
  async create(userData: {
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
    username?: string;
  }) {
    const { email, passwordHash, firstName, lastName, username } = userData;

    // Check if user already exists
    const existingUser = await this.findByEmailOrUsername(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return this.databaseService.user.create({
      data: {
        email: email.toLowerCase(),
        username,
        passwordHash,
        firstName,
        lastName,
        isActive: true,
        mfaEnabled: false,
        failedLoginCount: 0,
      },
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updateData: {
    firstName?: string;
    lastName?: string;
    username?: string;
  }) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.databaseService.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, passwordHash: string) {
    return this.databaseService.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId: string) {
    return this.databaseService.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  /**
   * Increment failed login count
   */
  async incrementFailedLoginCount(userId: string) {
    return this.databaseService.user.update({
      where: { id: userId },
      data: {
        failedLoginCount: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Reset failed login attempts
   */
  async resetFailedLoginAttempts(userId: string) {
    return this.databaseService.user.update({
      where: { id: userId },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
      },
    });
  }

  /**
   * Lock user account
   */
  async lockAccount(userId: string, lockedUntil: Date) {
    return this.databaseService.user.update({
      where: { id: userId },
      data: {
        lockedUntil,
        failedLoginCount: 0, // Reset count when locking
      },
    });
  }

  /**
   * Activate/deactivate user account
   */
  async setAccountStatus(userId: string, isActive: boolean) {
    return this.databaseService.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }

  /**
   * Assign role to user
   */
  async assignRole(userId: string, roleName: string, propertyId?: string) {
    // Find role by name
    const role = await this.databaseService.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new NotFoundException(`Role '${roleName}' not found`);
    }

    // Check if user already has this role for this property
    const existingUserRole = await this.databaseService.userRole.findFirst({
      where: {
        userId,
        roleId: role.id,
        propertyId,
      },
    });

    if (existingUserRole) {
      throw new ConflictException('User already has this role for this property');
    }

    return this.databaseService.userRole.create({
      data: {
        userId,
        roleId: role.id,
        propertyId,
      },
    });
  }

  /**
   * Remove role from user
   */
  async removeRole(userId: string, roleName: string, propertyId?: string) {
    const role = await this.databaseService.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new NotFoundException(`Role '${roleName}' not found`);
    }

    return this.databaseService.userRole.deleteMany({
      where: {
        userId,
        roleId: role.id,
        propertyId,
      },
    });
  }

  /**
   * Get user roles
   */
  async getUserRoles(userId: string) {
    return this.databaseService.userRole.findMany({
      where: { userId },
      include: {
        role: true,
        property: true,
      },
    });
  }

  /**
   * Check if user has specific role
   */
  async hasRole(userId: string, roleName: string, propertyId?: string): Promise<boolean> {
    const userRole = await this.databaseService.userRole.findFirst({
      where: {
        userId,
        role: { name: roleName },
        propertyId,
      },
    });

    return !!userRole;
  }

  /**
   * Check if user has permission
   */
  async hasPermission(userId: string, permission: string, propertyId?: string): Promise<boolean> {
    const userRoles = await this.databaseService.userRole.findMany({
      where: {
        userId,
        propertyId,
      },
      include: {
        role: true,
      },
    });

    return userRoles.some(userRole => 
      userRole.role.permissions.includes(permission)
    );
  }

  /**
   * Get users by property
   */
  async getUsersByProperty(propertyId: string) {
    return this.databaseService.user.findMany({
      where: {
        userRoles: {
          some: {
            propertyId,
          },
        },
      },
      include: {
        userRoles: {
          where: { propertyId },
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * Search users
   */
  async searchUsers(query: string, limit = 20) {
    return this.databaseService.user.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      include: {
        userRoles: {
          include: {
            role: true,
            property: true,
          },
        },
      },
    });
  }

  /**
   * Enable/disable MFA for user
   */
  async setMfaStatus(userId: string, enabled: boolean, secret?: string) {
    return this.databaseService.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: enabled,
        mfaSecret: enabled ? secret : null,
      },
    });
  }

  /**
   * Set MFA backup codes
   */
  async setMfaBackupCodes(userId: string, backupCodes: string[]) {
    return this.databaseService.user.update({
      where: { id: userId },
      data: { backupCodes },
    });
  }

  /**
   * Use MFA backup code
   */
  async useMfaBackupCode(userId: string, code: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user || !user.backupCodes.includes(code)) {
      return false;
    }

    // Remove used backup code
    const updatedCodes = user.backupCodes.filter(c => c !== code);
    await this.databaseService.user.update({
      where: { id: userId },
      data: { backupCodes: updatedCodes },
    });

    return true;
  }
} 