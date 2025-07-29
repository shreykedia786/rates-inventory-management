import { useState, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  requiresMfa: boolean;
  mfaToken: string | null;
}

interface LoginResult {
  requiresMfa: boolean;
  userId?: string;
  mfaToken?: string;
  error?: string;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
    requiresMfa: false,
    mfaToken: null,
  });

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // TODO: Implement actual login logic
      // For now, simulate MFA requirement
      const result = {
        requiresMfa: true,
        userId: 'mock-user-id',
        mfaToken: 'mock-mfa-token',
      };
      setState(prev => ({
        ...prev,
        requiresMfa: true,
        mfaToken: result.mfaToken,
        isLoading: false,
      }));
      return result;
    } catch (error) {
      const errorMessage = 'Invalid email or password';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      return {
        requiresMfa: false,
        error: errorMessage,
      };
    }
  }, []);

  const verifyMfa = useCallback(async (userId: string, code: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // TODO: Implement actual MFA verification
      // For now, simulate successful verification
      const mockUser = {
        id: userId,
        email: 'user@example.com',
        name: 'John Doe',
        role: 'admin',
      };
      setState(prev => ({
        ...prev,
        user: mockUser,
        requiresMfa: false,
        mfaToken: null,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Invalid MFA code',
        isLoading: false,
      }));
    }
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      isLoading: false,
      error: null,
      requiresMfa: false,
      mfaToken: null,
    });
  }, []);

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    requiresMfa: state.requiresMfa,
    mfaToken: state.mfaToken,
    login,
    verifyMfa,
    logout,
  };
} 