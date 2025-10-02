import { chromium } from 'playwright';
import { load, type CheerioAPI } from 'cheerio';
import {
  imageRulesSchema,
  priceRulesSchema,
  scrapeSelectorsSchema,
  cleanersSchema,
} from '../schemas/scrape-profile.js';
import { cleanHtml } from './htmlCleaners.js';
import { normalizePriceWithRules } from '../utils/price.js';

export interface ScrapeResult {
  html: string;
  cleanedHtml: string;
  title?: string | null;
  descriptionHtml?: string | null;
  images: string[];
  price: { sale: string | null; regular: string | null };
}

export interface ScrapeOptions {
  selectorsJson: unknown;
  cleanersJson: unknown;
  imageRulesJson: unknown;
  priceRulesJson: unknown;
}

export async function scrapeProduct(url: string, options: ScrapeOptions): Promise<ScrapeResult> {
  const selectors = scrapeSelectorsSchema.parse(options.selectorsJson);
  const cleaners = cleanersSchema.parse(options.cleanersJson);
  const imageRules = imageRulesSchema.parse(options.imageRulesJson);
  const priceRules = priceRulesSchema.parse(options.priceRulesJson);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  const html = await page.content();
  await browser.close();

  const cleanedHtml = cleanHtml(html, cleaners);
  const $ = load(html);

  const title = $(selectors.title).first().text().trim() || null;
  const descriptionNode = $(selectors.description).first();
  let descriptionHtml = descriptionNode.html();
  if (!descriptionHtml && selectors.fallbacks.descriptionAlt) {
    descriptionHtml = $(selectors.fallbacks.descriptionAlt).first().html();
  }

  const images = extractImages($, selectors.imagesContainer, imageRules);
  const priceSale = normalizePriceWithRules($(selectors.priceSale ?? '').text(), priceRules);
  const priceRegular = normalizePriceWithRules($(selectors.priceRegular ?? '').text(), priceRules);

  return {
    html,
    cleanedHtml,
    title,
    descriptionHtml: descriptionHtml ?? null,
    images,
    price: {
      sale: priceSale,
      regular: priceRegular,
    },
  };
}

function extractImages(
  $: CheerioAPI,
  containerSelector: string,
  rules: ReturnType<typeof imageRulesSchema.parse>,
) {
  const urls = new Set<string>();
  $(containerSelector)
    .find('img')
    .each((_, el) => {
      const src = $(el).attr('src');
      if (src) urls.add(src);
    });

  if (rules.preferNoscript && rules.noscriptRegex) {
    const regex = new RegExp(rules.noscriptRegex, 'gi');
    const html = $.root().html() ?? '';
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html))) {
      urls.add(match[1]);
    }
  }

  const list = Array.from(urls);
  return rules.dedupe ? Array.from(new Set(list)).slice(0, rules.maxCount) : list.slice(0, rules.maxCount);
}
