import type { TFunction } from 'i18next';
import { z } from 'zod';

export const mfaSchema = (t: TFunction) =>
  z.object({
    otp: z
      .string()
      .length(4, t('validation.otpLength'))
      .regex(/^\d{4}$/, t('validation.otpDigits')),
  });

export type MfaFormData = z.infer<ReturnType<typeof mfaSchema>>;
