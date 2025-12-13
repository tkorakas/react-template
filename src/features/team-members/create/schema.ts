import { z } from 'zod';

export const createTeamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  status: z.enum(['Active', 'Pending', 'Inactive']),
});

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;
