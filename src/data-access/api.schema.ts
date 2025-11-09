import { z } from 'zod';

export const registerRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const currentUserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const errorResponseSchema = z.object({
  error: z.string(),
  details: z
    .array(
      z.object({
        field: z.string(),
        message: z.string(),
      })
    )
    .optional(),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type CurrentUserResponse = z.infer<typeof currentUserResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
