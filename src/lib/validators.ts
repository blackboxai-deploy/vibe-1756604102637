import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

export const ApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional()
});

export const UpdateApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters').optional(),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  status: z.enum(['active', 'inactive']).optional(),
  rateLimit: z.number().min(1).max(10000).optional()
});

export const ValidateKeySchema = z.object({
  key: z.string().min(1, 'API key is required'),
  endpoint: z.string().optional()
});

export type LoginFormData = z.infer<typeof LoginSchema>;
export type ApiKeyFormData = z.infer<typeof ApiKeySchema>;
export type UpdateApiKeyData = z.infer<typeof UpdateApiKeySchema>;
export type ValidateKeyData = z.infer<typeof ValidateKeySchema>;