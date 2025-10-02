import { describe, expect, it } from 'vitest';
import { cleanHtml } from '../htmlCleaners.js';

const cleaners = {
  removeTags: ['script'],
  neutralize: { href: 'NOURL' },
  stripComments: true,
};

describe('cleanHtml', () => {
  it('supprime les balises indésirables et neutralise les attributs', () => {
    const html = '<div><!--comment--><a href="https://example.com">Link</a><script>alert(1)</script></div>';
    const result = cleanHtml(html, cleaners);
    expect(result).not.toContain('script');
    expect(result).not.toContain('comment');
    expect(result).toContain('href="NOURL"');
  });
});
