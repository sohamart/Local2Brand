import express from 'express';
import PortfolioDemo from '../models/PortfolioDemo.js';

const router = express.Router();

const BASE_URL = 'https://weblets.bond';

const CORE_PAGES = [
  { loc: '/', priority: '1.0', changefreq: 'daily', image: `${BASE_URL}/logo.png`, title: 'weblets agency - lets make website together' },
  { loc: '/demos', priority: '0.95', changefreq: 'daily' },
  { loc: '/services', priority: '0.90', changefreq: 'weekly' },
  { loc: '/pricing', priority: '0.90', changefreq: 'weekly' },
  { loc: '/portfolio', priority: '0.85', changefreq: 'weekly' },
  { loc: '/team', priority: '0.85', changefreq: 'weekly' },
  { loc: '/get-started', priority: '0.90', changefreq: 'weekly' },
  { loc: '/track-order', priority: '0.85', changefreq: 'daily' },
  { loc: '/app', priority: '0.85', changefreq: 'weekly' },
  { loc: '/about', priority: '0.80', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.85', changefreq: 'monthly' },
  { loc: '/terms', priority: '0.50', changefreq: 'monthly' },
  { loc: '/privacy', priority: '0.50', changefreq: 'monthly' },
];

const FALLBACK_DEMO_SLUGS = [
  'lms',
  'restaurant',
  'cafe',
  'salon',
  'gym',
  'hotel',
  'realestate',
  'photography',
  'boutique',
  'coaching',
  'dental',
  'jewellery',
  'automotive'
];

router.get(['/', '/sitemap.xml'], async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let demoItems = [];

    try {
      const dbDemos = await PortfolioDemo.find({
        status: { $in: ['published', 'coming_soon'] }
      }).select('slug updatedAt heroImage thumbnail title description').lean();

      if (dbDemos && dbDemos.length > 0) {
        demoItems = dbDemos.map((d) => ({
          loc: `/demos/${d.slug}`,
          lastmod: d.updatedAt ? new Date(d.updatedAt).toISOString().split('T')[0] : today,
          priority: '0.85',
          changefreq: 'weekly',
          image: d.heroImage || d.thumbnail || `${BASE_URL}/logo.png`,
          title: d.title || 'Weblets Template'
        }));
      }
    } catch (e) {
      // Fallback to static demo list if DB query is unavailable
    }

    if (demoItems.length === 0) {
      demoItems = FALLBACK_DEMO_SLUGS.map((slug) => ({
        loc: `/demos/${slug}`,
        lastmod: today,
        priority: '0.85',
        changefreq: 'weekly'
      }));
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    // Render Core Pages
    for (const page of CORE_PAGES) {
      xml += `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;
      if (page.image) {
        xml += `
    <image:image>
      <image:loc>${page.image}</image:loc>
      <image:title>${page.title || 'Weblets'}</image:title>
    </image:image>`;
      }
      xml += `
  </url>\n`;
    }

    // Render Dynamic Demo Pages
    for (const demo of demoItems) {
      xml += `  <url>
    <loc>${BASE_URL}${demo.loc}</loc>
    <lastmod>${demo.lastmod || today}</lastmod>
    <changefreq>${demo.changefreq || 'weekly'}</changefreq>
    <priority>${demo.priority || '0.85'}</priority>`;
      if (demo.image) {
        xml += `
    <image:image>
      <image:loc>${demo.image}</image:loc>
      <image:title>${demo.title || 'Weblets Template'}</image:title>
    </image:image>`;
      }
      xml += `
  </url>\n`;
    }

    xml += `</urlset>\n`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return res.status(200).send(xml);
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
    return res.status(500).send('Error generating dynamic sitemap');
  }
});

export default router;
