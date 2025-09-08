/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = {
  // Re-enable standalone output since our issues are fixed
  output: 'standalone',
  reactStrictMode: true,
  // No need for experimental flags anymore
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' ${process.env.N8N_BASE_URL || ''}; font-src 'self' https:; object-src 'none'; frame-src 'none'`
          }
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
