import { load } from 'cheerio';
import { cleanersSchema } from '../schemas/scrape-profile.js';

export function cleanHtml(html: string, cleanersJson: unknown) {
  const cleaners = cleanersSchema.parse(cleanersJson);
  const $ = load(html);

  cleaners.removeTags.forEach((tag) => {
    $(tag).remove();
  });

  if (cleaners.stripComments) {
    $('*')
      .contents()
      .each(function () {
        if (this.type === 'comment') {
          $(this).remove();
        }
      });
  }

  Object.entries(cleaners.neutralize).forEach(([attr, value]) => {
    $(`[${attr}]`).attr(attr, value);
  });

  return $('body').html() ?? $.root().html() ?? '';
}
