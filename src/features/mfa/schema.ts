import { z } from 'zod';

export const mfaSchema = z.object({
  otp: z
    .string()
    .length(4, 'OTP must be exactly 4 digits')
    .regex(/^\d{4}$/, 'OTP must contain only numbers'),
});

export type MfaFormData = z.infer<typeof mfaSchema>;
