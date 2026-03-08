import { z } from 'zod';

export const teamMembersPaginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const createTeamMembersPaginatedResponseSchema = <
  T extends z.ZodTypeAny,
>(
  dataSchema: T
) =>
  z.object({
    data: z.array(dataSchema),
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  });

export const teamMembersTeamMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  status: z.enum(['Active', 'Pending', 'Inactive']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const teamMembersResponseSchema =
  createTeamMembersPaginatedResponseSchema(teamMembersTeamMemberSchema);

export type PaginationMeta = z.infer<typeof teamMembersPaginationMetaSchema>;
export type TeamMember = z.infer<typeof teamMembersTeamMemberSchema>;
export type TeamMembersResponse = z.infer<typeof teamMembersResponseSchema>;
