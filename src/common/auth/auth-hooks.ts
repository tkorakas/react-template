import type { BeforeErrorHook } from 'ky';
import { queryClient } from '~/common/query-client';
import { USER_QUERY_KEY } from './use-auth';

const beforeErrorHook: BeforeErrorHook = async error => {
  if (error.response?.status !== 401) {
    return error;
  }
  const requestUrl = error.request?.url || '';
  const isAuthMeEndpoint = requestUrl.includes('/auth/me');

  if (isAuthMeEndpoint) {
    return error;
  }

  queryClient.setQueryData(USER_QUERY_KEY, null);
  queryClient.removeQueries({ queryKey: USER_QUERY_KEY });
  return error;
};

export const hooks = {
  beforeError: [beforeErrorHook],
};
