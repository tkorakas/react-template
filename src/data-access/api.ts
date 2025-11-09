import { httpClient } from '~/common/http-client';
import type {
  CurrentUserResponse,
  LoginRequest,
  RegisterRequest,
} from './api.schema';
import { currentUserResponseSchema, userResponseSchema } from './api.schema';

export const register = async (userData: RegisterRequest) => {
  const response = await httpClient.post('auth/register', {
    json: userData,
  });

  const data = await response.json();
  return userResponseSchema.parse(data);
};

export const login = async (credentials: LoginRequest) => {
  const response = await httpClient.post('auth/login', {
    json: credentials,
  });

  const data = await response.json();
  return userResponseSchema.parse(data);
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await httpClient.get('auth/me');
  const data = await response.json();
  return currentUserResponseSchema.parse(data);
};

export const logout = async (): Promise<void> => {
  await httpClient.post('auth/logout');
};

export const getTodos = async (page = 1, limit = 5) => {
  return httpClient.get(`todos?page=${page}&limit=${limit}`).json();
};
