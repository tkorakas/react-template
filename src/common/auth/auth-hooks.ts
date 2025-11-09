import type { BeforeErrorHook } from 'ky';
import { queryClient } from '~/common/query-client';

const beforeErrorHook: BeforeErrorHook = async error => {
  if (error.response?.status !== 401) {
    return error;
  }
  const requestUrl = error.request?.url || '';
  const isAuthMeEndpoint = requestUrl.includes('/auth/me');

  if (isAuthMeEndpoint) {
    return error;
  }

  queryClient.setQueryData(['user'], null);
  queryClient.removeQueries({ queryKey: ['user'] });
  return error;
};

export const hooks = {
  beforeError: [beforeErrorHook],
};
