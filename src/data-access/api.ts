import { httpClient } from '~/common/http-client';
import type {
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
} from './api.schema';
import { currentUserResponseSchema, loginResponseSchema } from './api.schema';

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await httpClient.post('auth/login', {
    json: credentials,
  });

  const data = await response.json();
  return loginResponseSchema.parse(data);
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await httpClient.get('auth/me');
  const data = await response.json();
  return currentUserResponseSchema.parse(data);
};

export const logout = async (): Promise<void> => {
  await httpClient.post('auth/logout');
};
