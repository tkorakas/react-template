import type { TFunction } from 'i18next';
import { z } from 'zod';

export const loginSchema = (t: TFunction) =>
  z.object({
    email: z
      .email(t('validation.emailInvalid'))
      .min(1, t('validation.emailRequired')),
    password: z
      .string()
      .min(1, t('validation.passwordRequired'))
      .min(6, t('validation.passwordMin')),
  });

export type LoginFormData = z.infer<ReturnType<typeof loginSchema>>;
