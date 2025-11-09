import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, logout } from './api';
import type { User } from './types';

export const USER_QUERY_KEY = ['user'];

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: getCurrentUser,
    gcTime: Infinity,
    staleTime: Infinity,
  });

  const isAuthenticated = !!user;

  const setUser = (userData: User) => {
    queryClient.setQueryData(USER_QUERY_KEY, userData);
  };

  const clearUser = () => {
    queryClient.setQueryData(USER_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: USER_QUERY_KEY });
  };

  const logoutUser = async () => {
    try {
      await logout();
    } finally {
      clearUser();
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    clearUser,
    logout: logoutUser,
  };
}

export type { User } from './types';
