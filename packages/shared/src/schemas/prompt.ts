import { z } from 'zod';

export const promptTypeSchema = z.enum(['product', 'short_desc']);

export const promptTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: promptTypeSchema,
  content: z.string(),
  version: z.number().int().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type PromptTemplate = z.infer<typeof promptTemplateSchema>;
