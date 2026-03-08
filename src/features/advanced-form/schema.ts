import { z } from 'zod';

const dateRangeSchema = z
  .object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (
      (value.startDate && !value.endDate) ||
      (!value.startDate && value.endDate)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Both start and end dates are required',
      });
    }

    if (value.startDate && value.endDate && value.startDate > value.endDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date must be before end date',
      });
    }
  });

export const advancedFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email'),
  role: z.string().min(1, 'Role is required'),
  status: z.enum(['Active', 'Pending', 'Inactive']),
  tags: z.array(z.string()).min(1, 'Select at least one tag'),
  departments: z.array(z.string()).min(1, 'Select at least one department'),
  region: z.string().min(1, 'Region is required'),
  datePreset: z.string().optional(),
  activePeriod: dateRangeSchema,
  notifications: z.boolean(),
  otpCode: z.string().length(6, 'Code must be 6 digits'),
});

export type AdvancedFormData = z.infer<typeof advancedFormSchema>;
