import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

import { DatabaseService } from '../database/database.service';
import { UserService } from './user.service';
import { MfaSetupResponse } from './interfaces/auth.interface';

/**
 * Multi-Factor Authentication Service for Phase 1
 * 
 * Handles:
 * - TOTP secret generation
 * - QR code generation for authenticator apps
 * - Token verification
 * - Backup codes management
 * 
 * @author UNO Team
 * @version 1.0.0
 */
@Injectable()
export class MfaService {
  private readonly issuer: string;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.issuer = this.configService.get<string>('MFA_ISSUER', 'Rates & Inventory Platform');
  }

  /**
   * Generate MFA secret and QR code for user
   */
  async generateMfaSetup(userId: string, userEmail: string): Promise<MfaSetupResponse> {
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `${userEmail} - ${this.issuer}`,
      issuer: this.issuer,
      length: 32,
    });

    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    // Store secret temporarily (not enabled until confirmed)
    await this.userService.setMfaStatus(userId, false, secret.base32);
    await this.userService.setMfaBackupCodes(userId, backupCodes);

    return {
      secret: secret.base32!,
      qrCode: qrCodeUrl,
      backupCodes,
    };
  }

  /**
   * Verify TOTP token
   */
  async verifyToken(userId: string, token: string): Promise<boolean> {
    const user = await this.userService.findById(userId);
    if (!user || !user.mfaSecret) {
      return false;
    }

    // Check if it's a backup code
    if (token.length > 6) {
      return this.userService.useMfaBackupCode(userId, token);
    }

    // Verify TOTP token
    const isValid = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps tolerance (±60 seconds)
    });

    return isValid;
  }

  /**
   * Enable MFA for user after token verification
   */
  async enableMfa(userId: string, token: string): Promise<boolean> {
    const isValidToken = await this.verifyToken(userId, token);
    if (!isValidToken) {
      return false;
    }

    const user = await this.userService.findById(userId);
    if (!user || !user.mfaSecret) {
      return false;
    }

    // Enable MFA
    await this.userService.setMfaStatus(userId, true, user.mfaSecret);

    return true;
  }

  /**
   * Disable MFA for user after token verification
   */
  async disableMfa(userId: string, token: string): Promise<boolean> {
    const isValidToken = await this.verifyToken(userId, token);
    if (!isValidToken) {
      return false;
    }

    // Disable MFA and clear secret
    await this.userService.setMfaStatus(userId, false);
    await this.userService.setMfaBackupCodes(userId, []);

    return true;
  }

  /**
   * Generate new backup codes
   */
  async regenerateBackupCodes(userId: string): Promise<string[]> {
    const backupCodes = this.generateBackupCodes();
    await this.userService.setMfaBackupCodes(userId, backupCodes);
    return backupCodes;
  }

  /**
   * Check if user has MFA enabled
   */
  async isMfaEnabled(userId: string): Promise<boolean> {
    const user = await this.userService.findById(userId);
    return user?.mfaEnabled || false;
  }

  /**
   * Get remaining backup codes count
   */
  async getBackupCodesCount(userId: string): Promise<number> {
    const user = await this.userService.findById(userId);
    return user?.backupCodes?.length || 0;
  }

  // Private helper methods

  /**
   * Generate random backup codes
   */
  private generateBackupCodes(count = 10): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }

    return codes;
  }

  /**
   * Validate TOTP token format
   */
  private isValidTokenFormat(token: string): boolean {
    // TOTP tokens are 6 digits
    return /^\d{6}$/.test(token);
  }

  /**
   * Validate backup code format
   */
  private isValidBackupCodeFormat(code: string): boolean {
    // Backup codes are 8 alphanumeric characters
    return /^[A-Z0-9]{8}$/.test(code);
  }
} 