import { z } from 'zod';

export const oauthCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
});

export type OAuthCallbackRequest = z.infer<typeof oauthCallbackSchema>;
