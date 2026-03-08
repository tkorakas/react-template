import { z } from 'zod';

export const authRegisterRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const authLoginRequestSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const authUserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const authCurrentUserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const authErrorResponseSchema = z.object({
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

export type RegisterRequest = z.infer<typeof authRegisterRequestSchema>;
export type LoginRequest = z.infer<typeof authLoginRequestSchema>;
export type UserResponse = z.infer<typeof authUserResponseSchema>;
export type CurrentUserResponse = z.infer<typeof authCurrentUserResponseSchema>;
export type ErrorResponse = z.infer<typeof authErrorResponseSchema>;
