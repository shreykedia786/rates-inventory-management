import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MfaGuard } from './guards/mfa.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { GetUser } from './decorators/get-user.decorator';

import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  EnableMfaDto,
  VerifyMfaDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import { User, UserRole } from '@prisma/client';

/**
 * Authentication Controller
 * 
 * Handles all authentication and authorization endpoints:
 * - User registration and login
 * - JWT token management
 * - Multi-factor authentication
 * - Password management
 * - User profile and session management
 */
@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * User Login
   * Authenticate user with email/password and return JWT tokens
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Request() req: any) {
    const user = req.user;
    
    // Check if MFA is required
    if (user.mfaEnabled && !req.mfaVerified) {
      return {
        requiresMfa: true,
        userId: user.id,
        message: 'MFA verification required',
      };
    }

    return this.authService.login(user, req.ip, req.get('User-Agent'));
  }

  /**
   * Verify MFA and Complete Login
   */
  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify MFA token' })
  async verifyMfa(@Body() verifyMfaDto: VerifyMfaDto, @Request() req: any) {
    return this.authService.verifyMfaAndLogin(
      verifyMfaDto.userId,
      verifyMfaDto.token,
      req.ip,
      req.get('User-Agent')
    );
  }

  /**
   * User Registration
   * Create new user account with email verification
   */
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Refresh JWT Token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Request() req: any) {
    return this.authService.refreshToken(
      refreshTokenDto.refreshToken,
      req.ip,
      req.get('User-Agent')
    );
  }

  /**
   * User Logout
   * Invalidate current session and tokens
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  async logout(@Request() req: any) {
    return this.authService.logout(req.user.id, req.sessionId);
  }

  /**
   * Logout from All Devices
   */
  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout from all devices' })
  async logoutAll(@GetUser() user: User) {
    return this.authService.logoutAllSessions(user.id);
  }

  /**
   * Get Current User Profile
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@GetUser() user: User) {
    return this.authService.getUserProfile(user.id);
  }

  /**
   * Enable MFA for Current User
   */
  @Post('mfa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable MFA' })
  async enableMfa(@GetUser() user: User) {
    return this.authService.enableMfa(user.id);
  }

  /**
   * Confirm MFA Setup
   */
  @Post('mfa/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm MFA setup' })
  async confirmMfa(@Body() enableMfaDto: EnableMfaDto, @GetUser() user: User) {
    return this.authService.confirmMfa(user.id, enableMfaDto.token);
  }

  /**
   * Disable MFA
   */
  @Post('mfa/disable')
  @UseGuards(JwtAuthGuard, MfaGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable MFA' })
  async disableMfa(@Body() verifyMfaDto: VerifyMfaDto, @GetUser() user: User) {
    return this.authService.disableMfa(user.id, verifyMfaDto.token);
  }

  /**
   * Change Password
   */
  @Post('password/change')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @GetUser() user: User) {
    return this.authService.changePassword(user.id, changePasswordDto);
  }

  /**
   * Request Password Reset
   */
  @Post('password/reset-request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  /**
   * Reset Password with Token
   */
  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * Get User Sessions (Admin/Self)
   */
  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user sessions' })
  async getSessions(@GetUser() user: User) {
    return this.authService.getUserSessions(user.id);
  }

  /**
   * Revoke Specific Session
   */
  @Post('sessions/:sessionId/revoke')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke specific session' })
  async revokeSession(@GetUser() user: User, @Body('sessionId') sessionId: string) {
    return this.authService.revokeSession(user.id, sessionId);
  }
} 