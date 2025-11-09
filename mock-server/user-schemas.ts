import { z } from 'zod';

export const AuthProviderSchema = z.enum(['local', 'github']);

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().optional(),
  provider: AuthProviderSchema.default('local'),
  mfaEnabled: z.boolean().default(false),
});

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().optional(),
  provider: AuthProviderSchema.default('local'),
  mfaEnabled: z.boolean().default(false),
});

export const LoginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const OAuthSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
});

export const UserResponseSchema = UserSchema.omit({ password: true });

export const SessionUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type SessionUser = z.infer<typeof SessionUserSchema>;

declare global {
  namespace Express {
    interface SessionData {
      user?: SessionUser;
    }
  }
}
