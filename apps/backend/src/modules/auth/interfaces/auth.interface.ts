/**
 * Authentication Interfaces for Phase 1
 * 
 * Defines type-safe interfaces for authentication responses and token payloads
 * 
 * @author UNO Team
 * @version 1.0.0
 */

export interface TokenPayload {
  sub: string; // User ID
  email: string;
  iat: number; // Issued at
  exp: number; // Expires at
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  mfaEnabled: boolean;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface MfaSetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface SessionInfo {
  id: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface LoginAttempt {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  timestamp: Date;
  failureReason?: string;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number; // days
}

export interface SecuritySettings {
  maxLoginAttempts: number;
  lockoutDuration: number; // minutes
  sessionTimeout: number; // hours
  requireMfa: boolean;
  passwordPolicy: PasswordPolicy;
} 