import { z } from 'zod';

export const siteStatusSchema = z.enum(['idle', 'ready', 'error']);

export const siteSchema = z.object({
  id: z.string().uuid(),
  domain: z.string(),
  serverIp: z.string(),
  wpAdminUrl: z.string().url().nullable(),
  status: siteStatusSchema,
  createdAt: z.coerce.date(),
});

export const siteOverrideSchema = z.object({
  id: z.string().uuid(),
  siteId: z.string().uuid(),
  scrapeProfileId: z.string().uuid().nullable(),
  promptProductId: z.string().uuid().nullable(),
  promptShortId: z.string().uuid().nullable(),
  wooMappingId: z.string().uuid().nullable(),
  r2ConfigJson: z.unknown().nullable(),
  wooCredsSecretKey: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Site = z.infer<typeof siteSchema>;
export type SiteOverride = z.infer<typeof siteOverrideSchema>;
