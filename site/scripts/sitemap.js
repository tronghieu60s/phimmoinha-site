/* eslint-disable no-console */
const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

const APP_SITE_URL = process.env.NEXT_PUBLIC_APP_SITE_URL || '';
const APP_API_MAIN_URL = process.env.NEXT_PUBLIC_APP_API_MAIN_URL || '';

const generateSitemapXml = async () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  try {
    const sitemap = await fetch(`${APP_API_MAIN_URL}/sitemap?site_url=${APP_SITE_URL}`).then(
      (res) => res.json(),
    );
    const sitemapLinks = sitemap?.results?.data;

    const stream = new SitemapStream({ hostname: APP_SITE_URL });
    const xmlString = await streamToPromise(Readable.from(sitemapLinks).pipe(stream)).then((data) =>
      data.toString(),
    );

    fs.writeFileSync('public/sitemap.xml', xmlString);
    await fetch(`https://www.google.com/ping?sitemap=${APP_SITE_URL}/sitemap.xml`);

    console.info(`Generated sitemap.xml with ${xmlString.length} characters`);
  } catch (error) {
    console.error('Generate sitemap.xml error:', error.message);
  }
};

module.exports = generateSitemapXml;
