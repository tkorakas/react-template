import { httpClient } from '~/common/http-client';
import type { TeamMembersResponse } from './team-members.schema';
import { teamMembersResponseSchema } from './team-members.schema';

export const getTeamMembers = async (
  page = 1,
  limit = 10
): Promise<TeamMembersResponse> => {
  const response = await httpClient.get(
    `team-members?page=${page}&limit=${limit}`
  );
  const data = await response.json();
  return teamMembersResponseSchema.parse(data);
};

export const createTeamMember = async (data: {
  name: string;
  role: string;
  status: 'Active' | 'Pending' | 'Inactive';
}) => {
  const response = await httpClient.post('team-members', { json: data });
  return response.json();
};
