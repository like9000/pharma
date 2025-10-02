import { z } from 'zod';

export const wooFieldMappingSchema = z.record(z.string());

export const wooMappingSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  fieldsJson: wooFieldMappingSchema,
  isDefault: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type WooMapping = z.infer<typeof wooMappingSchema>;
