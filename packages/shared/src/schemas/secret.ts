import { z } from 'zod';

export const secretSchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  encryptedValue: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type GlobalSecret = z.infer<typeof secretSchema>;
