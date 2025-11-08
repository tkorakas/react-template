import ky from 'ky';
import { hooks } from './auth/auth-hooks';

export const httpClient = ky.create({
  prefixUrl: '/api',
  credentials: 'include',
  timeout: 10000,
  hooks,
});
