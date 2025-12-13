import type { BeforeErrorHook, BeforeRequestHook } from 'ky';
import { queryClient } from '~/common/query-client';
import { USER_QUERY_KEY } from './use-auth';

const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const CSRF_HEADER_NAME = 'X-CSRF-TOKEN';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

const beforeRequestHook: BeforeRequestHook = request => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(request.method)) {
    return;
  }

  const csrfToken = getCookie(CSRF_COOKIE_NAME);
  if (csrfToken) {
    request.headers.set(CSRF_HEADER_NAME, csrfToken);
  }
};

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
  beforeRequest: [beforeRequestHook],
  beforeError: [beforeErrorHook],
};
