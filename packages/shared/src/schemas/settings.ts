import { z } from 'zod';

export const paginationQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const testScrapeRequestSchema = z.object({
  url: z.string().url(),
});

export const testScrapeResponseSchema = z.object({
  rawHtml: z.string(),
  cleanedHtml: z.string(),
  extracted: z.object({
    title: z.string().nullable(),
    descriptionHtml: z.string().nullable(),
    images: z.array(z.string()),
    price: z.object({
      sale: z.string().nullable(),
      regular: z.string().nullable(),
    }),
  }),
});
