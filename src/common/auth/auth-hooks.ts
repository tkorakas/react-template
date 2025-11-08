import type { BeforeErrorHook } from 'ky';
import { queryClient } from '~/common/query-client';

const beforeErrorHook: BeforeErrorHook = async error => {
  console.log('HTTP Error intercepted in auth hook:', error);
  if (error.response?.status === 401) {
    const requestUrl = error.request?.url || '';
    const isAuthMeEndpoint = requestUrl.includes('/auth/me');

    if (!isAuthMeEndpoint) {
      queryClient.setQueryData(['user'], null);
      queryClient.removeQueries({ queryKey: ['user'] });
    }
  }

  return error;
};

export const hooks = {
  beforeError: [beforeErrorHook],
};
