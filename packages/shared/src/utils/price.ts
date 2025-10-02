import { priceRulesSchema } from '../schemas/scrape-profile.js';

type PriceRules = ReturnType<typeof priceRulesSchema.parse>;

export function normalizePrice(raw: string | undefined | null, rulesJson: unknown): string | null {
  if (!raw) return null;
  const rules = priceRulesSchema.parse(rulesJson);
  let value = raw;
  for (const strip of rules.strip) {
    value = value.replaceAll(strip, '');
  }
  if (rules.commaToDot) {
    value = value.replace(/,/g, '.');
  }
  value = value.trim();
  if (!value) {
    return rules.allowNullSalePrice ? null : '0';
  }
  return value;
}

export function normalizePriceWithRules(raw: string | undefined, rules: PriceRules) {
  if (!raw) return null;
  let value = raw;
  for (const strip of rules.strip) {
    value = value.replaceAll(strip, '');
  }
  if (rules.commaToDot) {
    value = value.replace(/,/g, '.');
  }
  value = value.trim();
  if (!value) {
    return rules.allowNullSalePrice ? null : '0';
  }
  return value;
}
