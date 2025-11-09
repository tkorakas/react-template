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
});

// Current user response schema
export const currentUserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
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
export type CurrentUserResponse = z.infer<typeof currentUserResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
