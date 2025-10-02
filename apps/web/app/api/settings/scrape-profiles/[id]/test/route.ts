import { NextResponse } from 'next/server';
import { prisma, cleanHtml, scrapeSelectorsSchema, imageRulesSchema, priceRulesSchema } from '@pharma/shared';
import { testScrapeRequestSchema } from '@pharma/shared';
import { load } from 'cheerio';
import fs from 'node:fs/promises';
import path from 'node:path';

interface Params {
  params: { id: string };
}

export async function POST(request: Request, { params }: Params) {
  const body = await request.json();
  const parsed = testScrapeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await prisma.scrapeProfile.findUnique({ where: { id: params.id } });
  if (!profile) {
    return NextResponse.json({ error: 'Scrape profile not found' }, { status: 404 });
  }

  let html = '';
  if (parsed.data.url.startsWith('mock://')) {
    const filePath = path.join(process.cwd(), 'apps/web/tests/mocks/sample-product.html');
    html = await fs.readFile(filePath, 'utf8');
  } else {
    html = `<html><body><h1>Preview non disponible</h1><p>Utilisez mock://sample pour la démonstration.</p></body></html>`;
  }

  const selectors = scrapeSelectorsSchema.parse(profile.selectorsJson);
  const imageRules = imageRulesSchema.parse(profile.imageRulesJson);
  const priceRules = priceRulesSchema.parse(profile.priceRulesJson);
  const cleanedHtml = cleanHtml(html, profile.cleanersJson);
  const $ = load(html);

  const title = $(selectors.title).first().text().trim() || null;
  const descriptionNode = $(selectors.description).first();
  let descriptionHtml = descriptionNode.html();
  if (!descriptionHtml && selectors.fallbacks.descriptionAlt) {
    descriptionHtml = $(selectors.fallbacks.descriptionAlt).first().html();
  }

  const images = new Set<string>();
  $(selectors.imagesContainer)
    .find('img')
    .each((_, el) => {
      const src = $(el).attr('src');
      if (src) images.add(src);
    });
  if (imageRules.preferNoscript && imageRules.noscriptRegex) {
    const regex = new RegExp(imageRules.noscriptRegex, 'gi');
    let match: RegExpExecArray | null;
    const source = $.root().html() ?? '';
    while ((match = regex.exec(source))) {
      images.add(match[1]);
    }
  }

  const normalizePrice = (raw: string | undefined) => {
    if (!raw) return null;
    let value = raw;
    for (const strip of priceRules.strip) {
      value = value.replaceAll(strip, '');
    }
    if (priceRules.commaToDot) {
      value = value.replace(/,/g, '.');
    }
    value = value.trim();
    if (!value) {
      return priceRules.allowNullSalePrice ? null : '0';
    }
    return value;
  };

  const response = {
    rawHtml: html,
    cleanedHtml,
    extracted: {
      title,
      descriptionHtml: descriptionHtml ?? null,
      images: Array.from(images).slice(0, imageRules.maxCount),
      price: {
        sale: normalizePrice($(selectors.priceSale ?? '').text()),
        regular: normalizePrice($(selectors.priceRegular ?? '').text()),
      },
    },
  };

  return NextResponse.json(response);
}
