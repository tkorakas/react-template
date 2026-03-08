import { HTTPError } from 'ky';
import { MfaRequiredError } from '~/common/errors';
import { httpClient } from '~/common/http-client';
import type {
  CurrentUserResponse,
  LoginRequest,
  RegisterRequest,
} from './auth.schema';
import {
  authCurrentUserResponseSchema,
  authUserResponseSchema,
} from './auth.schema';

export const register = async (userData: RegisterRequest) => {
  const response = await httpClient.post('auth/register', {
    json: userData,
  });

  const data = await response.json();
  return authUserResponseSchema.parse(data);
};

export const login = async (credentials: LoginRequest) => {
  try {
    const response = await httpClient.post('auth/login', {
      json: credentials,
    });

    const data = await response.json();
    return authUserResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof HTTPError && error.response.status === 409) {
      throw new MfaRequiredError();
    }
    throw error;
  }
};

export const verifyMfa = async (otp: string) => {
  const response = await httpClient.post('auth/verify-mfa', {
    json: { otp },
  });

  const data = await response.json();
  return data;
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await httpClient.get('auth/me');
  const data = await response.json();
  return authCurrentUserResponseSchema.parse(data);
};

export const logout = async (): Promise<void> => {
  await httpClient.post('auth/logout');
};

export const getOAuthAuthUrl = async (provider: string) => {
  const response = await httpClient.get(`auth/oauth/${provider}/authorize`);
  const data = await response.json();
  return data as { authUrl: string };
};

export const oauthCallback = async (provider: string, code: string) => {
  const response = await httpClient.post(`auth/oauth/${provider}/callback`, {
    json: { code },
  });

  const data = await response.json();
  return authUserResponseSchema.parse(data);
};
