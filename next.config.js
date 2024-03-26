/**
 * @type {import('next').NextConfig}
 */

const fs = require('fs');
const privateKEY = fs.readFileSync('private.key', 'utf8');
const publicKEY = fs.readFileSync('public.key', 'utf8');
const withFonts = require('next-fonts');

const nextConfig = {
  output: 'export',
  // Target must be serverless
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // config.resolve.fallback.fs = false;
        // Replace Node.js modules with empty mocks on the client side
        config.resolve.fallback = { 
          fs: false,
          tls: false,
          dgram: false,
          module: false,
          require: false,
          net: false,
          child_process: false, 
          ...config.resolve.fallback };
    }
    return config;
  },
  enableSvg: true,
  env: {
    production: process.env.NEXT_PUBLIC_URL_PRODUCTION,
    development: "http://localhost:8500/",
    keyPrivate: privateKEY,
    keyPublic: publicKEY,
    apikeysendinblue: process.env.APIKEY_SENDINBLUE
  },
  async headers() {
    return [
      {
        source: '/admin/dashboard',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          }
        ],
      },
      {
        source: '/admin/config',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'auth-bearer',
            value: 'test',
          }
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          }
        ],
      }
    ]
  },
  images: {
    domains: [
      'testbucketcreateds3.s3.eu-west-3.amazonaws.com',
      'testbucketcreateds3.s3.amazonaws.com',
      'smogola.com']
  },
  // i18n: {
  //   locales: ['en', 'fr'],
  //   defaultLocale: 'en'
  // }
  // async rewrites() {
  //   return [
  //     // Advanced rewrite
  //     // Query object shape: { id: string } (in addition to dynamic route param)
  //     { source: "/api/posts/:id", destination: "/posts/:id" }
  //   ];
  // }
}

module.exports = nextConfig