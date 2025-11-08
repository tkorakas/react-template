import { z } from 'zod';

// Login request schema
export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// User response schema (from API)
export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Login response schema
export const loginResponseSchema = z.object({
  message: z.string(),
  user: userResponseSchema,
});

// Current user response schema
export const currentUserResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
});

// Error response schema
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

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type CurrentUserResponse = z.infer<typeof currentUserResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
