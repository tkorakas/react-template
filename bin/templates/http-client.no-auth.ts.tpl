import ky from 'ky';

export const httpClient = ky.create({
  prefixUrl: '/api',
  credentials: 'include',
  timeout: 10000,
});
