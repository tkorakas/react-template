import type { TFunction } from 'i18next';
import { z } from 'zod';

export const registerSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(2, t('validation.nameMin')),
    email: z.email(t('validation.emailInvalid')),
    password: z.string().min(6, t('validation.passwordMin')),
  });

export type RegisterFormData = z.infer<ReturnType<typeof registerSchema>>;
