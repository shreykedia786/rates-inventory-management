import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';
import type { User, LoginResponse } from '@/types/auth';

/**
 * Authentication Hook
 * 
 * Provides authentication functionality:
 * - Login/logout operations
 * - MFA verification
 * - Token management
 * - User profile management
 * - Session handling
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setUser, setTokens, clearAuth, isAuthenticated } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data: LoginResponse) => {
      setError(null);
      
      if (data.requiresMfa) {
        // MFA required - don't set tokens yet
        return data;
      }
      
      // Login successful
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      toast.success('Login successful');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      toast.error(message);
    },
  });

  // MFA verification mutation
  const mfaVerificationMutation = useMutation({
    mutationFn: ({ userId, token }: { userId: string; token: string }) =>
      authApi.verifyMfa(userId, token),
    onSuccess: (data: LoginResponse) => {
      setError(null);
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      toast.success('Authentication successful');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'MFA verification failed';
      setError(message);
      toast.error(message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate('/login');
    },
    onError: (error: any) => {
      // Still clear auth even if API call fails
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
  });

  // Get user profile query
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error.response?.status === 401) {
        clearAuth();
        navigate('/login');
        return false;
      }
      return failureCount < 3;
    },
  });

  // Update user in store when profile is fetched
  useEffect(() => {
    if (userProfile && userProfile !== user) {
      setUser(userProfile);
    }
  }, [userProfile, user, setUser]);

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    },
  });

  // Enable MFA mutation
  const enableMfaMutation = useMutation({
    mutationFn: authApi.enableMfa,
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to enable MFA';
      toast.error(message);
    },
  });

  // Confirm MFA mutation
  const confirmMfaMutation = useMutation({
    mutationFn: (token: string) => authApi.confirmMfa(token),
    onSuccess: () => {
      toast.success('MFA enabled successfully');
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to confirm MFA';
      toast.error(message);
    },
  });

  // Disable MFA mutation
  const disableMfaMutation = useMutation({
    mutationFn: (token: string) => authApi.disableMfa(token),
    onSuccess: () => {
      toast.success('MFA disabled successfully');
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to disable MFA';
      toast.error(message);
    },
  });

  // Clear error when component unmounts or user starts typing
  const clearError = () => setError(null);

  return {
    // State
    user,
    isAuthenticated,
    error,
    isLoading: loginMutation.isPending || mfaVerificationMutation.isPending,
    isLoadingProfile,

    // Actions
    login: async (email: string, password: string) => {
      clearError();
      return loginMutation.mutateAsync({ email, password });
    },
    
    verifyMfa: async (userId: string, token: string) => {
      clearError();
      return mfaVerificationMutation.mutateAsync({ userId, token });
    },
    
    logout: () => logoutMutation.mutate(),
    
    changePassword: (currentPassword: string, newPassword: string) =>
      changePasswordMutation.mutateAsync({ currentPassword, newPassword }),
    
    enableMfa: () => enableMfaMutation.mutateAsync(),
    
    confirmMfa: (token: string) => confirmMfaMutation.mutateAsync(token),
    
    disableMfa: (token: string) => disableMfaMutation.mutateAsync(token),
    
    clearError,

    // Mutation states
    isChangingPassword: changePasswordMutation.isPending,
    isEnablingMfa: enableMfaMutation.isPending,
    isConfirmingMfa: confirmMfaMutation.isPending,
    isDisablingMfa: disableMfaMutation.isPending,
    
    // MFA data
    mfaSetupData: enableMfaMutation.data,
  };
}; 