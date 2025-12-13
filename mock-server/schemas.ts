import { z } from 'zod';

export const BaseEntitySchema = z.object({
  id: z.number().optional(), // Optional for creation
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const TodoSchema = BaseEntitySchema.extend({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional(),
});

export const TodoUpdateSchema = TodoSchema.partial().omit({ id: true });

export const TeamMemberSchema = BaseEntitySchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  status: z.enum(['Active', 'Pending', 'Inactive']),
});

export const TeamMemberUpdateSchema = TeamMemberSchema.partial().omit({
  id: true,
});

export const PaginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().min(1)),
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().min(1).max(100)),
});

export const SchemaRegistry = {
  todos: {
    create: TodoSchema,
    update: TodoUpdateSchema,
  },
  'team-members': {
    create: TeamMemberSchema,
    update: TeamMemberUpdateSchema,
  },
} as const;

export type Todo = z.infer<typeof TodoSchema>;
export type TodoUpdate = z.infer<typeof TodoUpdateSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
