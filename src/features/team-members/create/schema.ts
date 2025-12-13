import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createTeamMemberSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(2, t('create.validation.nameMin')),
    role: z.string().min(2, t('create.validation.roleMin')),
    status: z.enum(['Active', 'Pending', 'Inactive']),
  });

export type CreateTeamMemberInput = z.infer<
  ReturnType<typeof createTeamMemberSchema>
>;
