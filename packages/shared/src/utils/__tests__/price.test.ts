import { describe, expect, it } from 'vitest';
import { normalizePrice } from '../../utils/price.js';

const rules = {
  strip: ['€', ' '],
  commaToDot: true,
  allowNullSalePrice: true,
};

describe('normalizePrice', () => {
  it('normalise une valeur avec € et espaces', () => {
    expect(normalizePrice(' 1 299,90 € ', rules)).toBe('1299.90');
  });

  it('retourne null si vide et autorisé', () => {
    expect(normalizePrice(' € ', rules)).toBeNull();
  });

  it('retourne 0 si vide et non autorisé', () => {
    expect(normalizePrice(' ', { ...rules, allowNullSalePrice: false })).toBe('0');
  });
});
