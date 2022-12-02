const path = require('path');
const nextTranslate = require('next-translate');
const generateRobotsTxt = require('./scripts/robots');
const generateSitemapXml = require('./scripts/sitemap');

const APP_ANALYZE = process.env.NEXT_PUBLIC_APP_ANALYZE || 'false';
const APP_ANALYZE_OPEN = process.env.NEXT_PUBLIC_APP_ANALYZE_OPEN || 'false';

// eslint-disable-next-line import/order
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: APP_ANALYZE === 'true',
  openAnalyzer: APP_ANALYZE_OPEN === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = nextTranslate({
  compress: true,
  reactStrictMode: true,
  images: { domains: ['img.phimmoichills.net', 'phimmoinha.s3.ap-southeast-1.amazonaws.com'] },
  sassOptions: { includePaths: [path.join(__dirname, 'styles')] },
  productionBrowserSourceMaps: true,
  webpack(config, { isServer }) {
    if (isServer) {
      generateRobotsTxt();
      generateSitemapXml();
    }
    return config;
  },
});

module.exports = withBundleAnalyzer(nextConfig);
