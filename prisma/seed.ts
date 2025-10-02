import { prisma } from '@pharma/shared';

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  const defaultSelectors = {
    title: '.product_title.entry-title',
    description: 'div.woocommerce-Tabs-panel--description.panel.entry-content.wc-tab',
    imagesContainer: '.woocommerce-product-gallery__image',
    priceSale: '.price ins .woocommerce-Price-amount',
    priceRegular: '.price del .woocommerce-Price-amount',
    fallbacks: { descriptionAlt: 'div.woocommerce-product-details__short-description' },
  };

  const defaultCleaners = {
    removeTags: ['script', 'style', 'noscript', 'iframe', 'object', 'embed', 'video', 'audio', 'svg'],
    neutralize: { href: 'NOURL', src: 'NOIMG' },
    stripComments: true,
  };

  const defaultImageRules = {
    preferNoscript: true,
    noscriptRegex: '<noscript>\\s*<img[^>]+src="([^\\"]+)"',
    dedupe: true,
    maxCount: 8,
  };

  const defaultPriceRules = {
    strip: ['€', ' '],
    commaToDot: true,
    allowNullSalePrice: true,
  };

  const existingProfile = await prisma.scrapeProfile.findFirst({ where: { isDefault: true } });
  if (!existingProfile) {
    await prisma.scrapeProfile.create({
      data: {
        name: 'Défaut WooCommerce',
        isDefault: true,
        selectorsJson: defaultSelectors,
        cleanersJson: defaultCleaners,
        imageRulesJson: defaultImageRules,
        priceRulesJson: defaultPriceRules,
        testUrl: 'https://woocommerce.com/products/sample-product/',
      },
    });
  }

  const productPrompt = await prisma.promptTemplate.findFirst({ where: { type: 'product', isActive: true } });
  if (!productPrompt) {
    await prisma.promptTemplate.create({
      data: {
        name: 'Description produit par défaut',
        type: 'product',
        content:
          'H2 structurés, listes UL/OL, table si pertinent, pas de <h1>, pas de doctype/head/body, français marketing clair, variantes naturelles, pas de promesses médicales, HTML propre.',
        version: 1,
        isActive: true,
      },
    });
  }

  const shortPrompt = await prisma.promptTemplate.findFirst({ where: { type: 'short_desc', isActive: true } });
  if (!shortPrompt) {
    await prisma.promptTemplate.create({
      data: {
        name: 'Description courte par défaut',
        type: 'short_desc',
        content: 'Résumé clair 40–70 mots, en français, 1 paragraphe HTML, pas de titre.',
        version: 1,
        isActive: true,
      },
    });
  }

  const mapping = await prisma.wooMapping.findFirst({ where: { isDefault: true } });
  if (!mapping) {
    await prisma.wooMapping.create({
      data: {
        name: 'Mapping WooCommerce par défaut',
        isDefault: true,
        fieldsJson: {
          sku: 'UGS',
          name: 'Nom',
          short_description: 'Description courte',
          description: 'Description',
          regular_price: 'Tarif régulier',
          sale_price: 'Tarif promo',
          categories: 'Catégories',
          images: 'Images',
          statusFromPublished: 'Publié',
          stockFromFlag: 'En stock ?',
          reviewsFromFlag: 'Autoriser les avis clients ?',
        },
      },
    });
  }

  await prisma.site.upsert({
    where: { domain: 'demo.pharma.local' },
    update: {},
    create: {
      domain: 'demo.pharma.local',
      serverIp: '203.0.113.10',
      status: 'idle',
      wpAdminUrl: 'https://demo.pharma.local/wp-admin',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
