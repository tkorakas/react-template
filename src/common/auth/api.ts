import { httpClient } from '~/common/http-client';
import { currentUserResponseSchema } from '~/data-access/api.schema';

export const getCurrentUser = async () => {
  const response = await httpClient.get('auth/me');
  const data = await response.json();
  return currentUserResponseSchema.parse(data);
};

export const logout = async (): Promise<void> => {
  await httpClient.post('auth/logout');
};
