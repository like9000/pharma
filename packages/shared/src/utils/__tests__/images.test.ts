import { describe, expect, it } from 'vitest';
import { extractNoscriptImageUrls } from '../../utils/images.js';

describe('extractNoscriptImageUrls', () => {
  it('récupère les URLs depuis les balises noscript', () => {
    const html = `
      <div class="woocommerce-product-gallery__image">
        <noscript>
          <img src="https://cdn.example.com/img1.jpg" />
        </noscript>
      </div>
      <noscript><img src="https://cdn.example.com/img2.jpg" /></noscript>
    `;
    const urls = extractNoscriptImageUrls(html, '<noscript>\\s*<img[^>]+src="([^\\"]+)"');
    expect(urls).toEqual([
      'https://cdn.example.com/img1.jpg',
      'https://cdn.example.com/img2.jpg',
    ]);
  });
});
