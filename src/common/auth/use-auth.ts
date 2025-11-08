import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, logout } from './api';
import type { User } from './types';

const USER_QUERY_KEY = ['user'];

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: { user } = { user: null },
    isLoading,
    isError,
  } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: getCurrentUser,
  });

  const isAuthenticated = !!user;

  const setUser = (userData: User) => {
    queryClient.setQueryData(USER_QUERY_KEY, {
      user: userData,
    });
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
    isError,
    setUser,
    clearUser,
    logout: logoutUser,
  };
}

export type { User } from './types';
