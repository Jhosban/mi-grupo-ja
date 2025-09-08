/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              connect-src 'self' ${process.env.N8N_BASE_URL || ''};
              font-src 'self' https:;
              object-src 'none';
              frame-src 'none'
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
