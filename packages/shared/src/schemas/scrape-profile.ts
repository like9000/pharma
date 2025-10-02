import { z } from 'zod';

export const scrapeSelectorsSchema = z.object({
  title: z.string(),
  description: z.string(),
  imagesContainer: z.string(),
  priceSale: z.string().optional(),
  priceRegular: z.string().optional(),
  fallbacks: z
    .object({
      descriptionAlt: z.string().optional(),
    })
    .default({}),
});

export const cleanersSchema = z.object({
  removeTags: z.array(z.string()),
  neutralize: z.record(z.string()),
  stripComments: z.boolean().default(true),
});

export const imageRulesSchema = z.object({
  preferNoscript: z.boolean().default(false),
  noscriptRegex: z.string().optional(),
  dedupe: z.boolean().default(true),
  maxCount: z.number().min(1).max(20).default(8),
});

export const priceRulesSchema = z.object({
  strip: z.array(z.string()).default([]),
  commaToDot: z.boolean().default(true),
  allowNullSalePrice: z.boolean().default(true),
});

export const scrapeProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  isDefault: z.boolean(),
  selectorsJson: scrapeSelectorsSchema,
  cleanersJson: cleanersSchema,
  imageRulesJson: imageRulesSchema,
  priceRulesJson: priceRulesSchema,
  testUrl: z.string().url().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type ScrapeProfile = z.infer<typeof scrapeProfileSchema>;
