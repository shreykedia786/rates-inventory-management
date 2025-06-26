import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

/**
 * Role Service for Phase 1
 * 
 * Handles:
 * - Role management and CRUD operations
 * - Permission assignment and validation
 * - Default role setup and seeding
 * 
 * @author UNO Team
 * @version 1.0.0
 */
@Injectable()
export class RoleService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Phase 1 Role Definitions
   */
  private readonly defaultRoles = [
    {
      name: 'REVENUE_MANAGER',
      description: 'Full control at property level',
      permissions: [
        'rates.read',
        'rates.write',
        'inventory.read',
        'inventory.write',
        'restrictions.read',
        'restrictions.write',
        'bulk_operations.execute',
        'channel_sync.manage',
        'ai_insights.view',
        'ai_suggestions.apply',
        'audit_logs.view',
      ],
    },
    {
      name: 'DISTRIBUTION_MANAGER',
      description: 'Approvals, channel sync management',
      permissions: [
        'rates.read',
        'rates.write_with_approval',
        'inventory.read',
        'inventory.write_with_approval',
        'restrictions.read',
        'restrictions.write',
        'bulk_operations.approve',
        'channel_sync.manage',
        'channel_mappings.configure',
        'ai_insights.view',
        'audit_logs.view',
      ],
    },
    {
      name: 'CORPORATE_ADMIN',
      description: 'Cross-property/brand controls',
      permissions: [
        'rates.read',
        'rates.write',
        'inventory.read',
        'inventory.write',
        'restrictions.read',
        'restrictions.write',
        'bulk_operations.execute',
        'channel_sync.manage',
        'channel_mappings.configure',
        'ai_insights.view',
        'ai_suggestions.apply',
        'users.manage',
        'roles.manage',
        'properties.manage',
        'organizations.manage',
        'audit_logs.view',
        'system_settings.manage',
      ],
    },
    {
      name: 'AI_VIEWER',
      description: 'Read-only access to AI insights and recommendations',
      permissions: [
        'rates.read',
        'inventory.read',
        'restrictions.read',
        'ai_insights.view',
        'audit_logs.view',
      ],
    },
    {
      name: 'OPERATIONS',
      description: 'Monitor sync status, view audit logs, basic support',
      permissions: [
        'rates.read',
        'inventory.read',
        'restrictions.read',
        'channel_sync.monitor',
        'ai_insights.view',
        'audit_logs.view',
        'system_monitoring.view',
      ],
    },
  ];

  /**
   * Initialize default roles (run during application startup)
   */
  async initializeDefaultRoles(): Promise<void> {
    for (const roleData of this.defaultRoles) {
      await this.createRoleIfNotExists(roleData);
    }
  }

  /**
   * Create role if it doesn't exist
   */
  async createRoleIfNotExists(roleData: {
    name: string;
    description?: string;
    permissions: string[];
  }): Promise<void> {
    // Mock implementation for now
    console.log(`Creating role: ${roleData.name}`);
  }

  /**
   * Create new role
   */
  async createRole(roleData: {
    name: string;
    description?: string;
    permissions: string[];
  }) {
    // Mock implementation
    return {
      id: 'role_' + Date.now(),
      ...roleData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Get all roles
   */
  async getAllRoles() {
    // Mock implementation
    return this.defaultRoles.map((role, index) => ({
      id: `role_${index}`,
      ...role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId: string) {
    // Mock implementation
    return null;
  }

  /**
   * Get role by name
   */
  async getRoleByName(name: string) {
    // Mock implementation
    const role = this.defaultRoles.find(r => r.name === name);
    if (role) {
      return {
        id: 'role_' + name,
        ...role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return null;
  }

  /**
   * Update role
   */
  async updateRole(roleId: string, updateData: {
    name?: string;
    description?: string;
    permissions?: string[];
  }) {
    // Mock implementation
    return {
      id: roleId,
      ...updateData,
      updatedAt: new Date(),
    };
  }

  /**
   * Delete role
   */
  async deleteRole(roleId: string) {
    // Mock implementation
    return true;
  }

  /**
   * Check if role has specific permission
   */
  async hasPermission(roleName: string, permission: string): Promise<boolean> {
    const role = this.defaultRoles.find(r => r.name === roleName);
    return role?.permissions.includes(permission) || false;
  }

  /**
   * Get all permissions for role
   */
  async getRolePermissions(roleName: string): Promise<string[]> {
    const role = this.defaultRoles.find(r => r.name === roleName);
    return role?.permissions || [];
  }

  /**
   * Add permission to role
   */
  async addPermissionToRole(roleId: string, permission: string) {
    // Mock implementation
    return true;
  }

  /**
   * Remove permission from role
   */
  async removePermissionFromRole(roleId: string, permission: string) {
    // Mock implementation
    return true;
  }

  /**
   * Get available permissions list
   */
  getAvailablePermissions(): string[] {
    const allPermissions = new Set<string>();
    
    this.defaultRoles.forEach(role => {
      role.permissions.forEach(permission => {
        allPermissions.add(permission);
      });
    });

    return Array.from(allPermissions).sort();
  }

  /**
   * Validate permission format
   */
  isValidPermission(permission: string): boolean {
    // Permission format: resource.action (e.g., rates.read, users.manage)
    return /^[a-z_]+\.[a-z_]+$/.test(permission);
  }

  /**
   * Get role hierarchy (for inheritance)
   */
  getRoleHierarchy(): Record<string, string[]> {
    return {
      CORPORATE_ADMIN: ['DISTRIBUTION_MANAGER', 'REVENUE_MANAGER', 'AI_VIEWER', 'OPERATIONS'],
      DISTRIBUTION_MANAGER: ['REVENUE_MANAGER', 'AI_VIEWER'],
      REVENUE_MANAGER: ['AI_VIEWER'],
      AI_VIEWER: [],
      OPERATIONS: [],
    };
  }

  /**
   * Check if user role can perform action on target role
   */
  canManageRole(userRole: string, targetRole: string): boolean {
    const hierarchy = this.getRoleHierarchy();
    return hierarchy[userRole]?.includes(targetRole) || false;
  }

  /**
   * Get effective permissions (including inherited)
   */
  async getEffectivePermissions(roleName: string): Promise<string[]> {
    const directPermissions = await this.getRolePermissions(roleName);
    const hierarchy = this.getRoleHierarchy();
    const inheritedRoles = hierarchy[roleName] || [];

    const allPermissions = new Set(directPermissions);

    for (const inheritedRole of inheritedRoles) {
      const inheritedPermissions = await this.getRolePermissions(inheritedRole);
      inheritedPermissions.forEach(permission => allPermissions.add(permission));
    }

    return Array.from(allPermissions).sort();
  }
} 