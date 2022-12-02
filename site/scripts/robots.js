/* eslint-disable no-console */
const fs = require('fs');

const APP_SITE_URL = process.env.NEXT_PUBLIC_APP_SITE_URL || '';

const crawlableRobotsTxt = `# *
User-agent: *
Allow: /

# Host
Host: ${APP_SITE_URL}

# Sitemaps
Sitemap: ${APP_SITE_URL}/sitemap.xml
`;

const generateRobotsTxt = async () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const robotsTxt = crawlableRobotsTxt;
  try {
    fs.writeFileSync('public/robots.txt', robotsTxt);
    console.info(`Generated robots.txt with ${robotsTxt.length} characters`);
  } catch (error) {
    console.error('Generate robots.txt error:', error.message);
  }
};

module.exports = generateRobotsTxt;
