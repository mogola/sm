const fs = require('fs');
const privateKEY = fs.readFileSync('private.key', 'utf8');
const publicKEY = fs.readFileSync('public.key', 'utf8');
const withFonts = require('next-fonts');

const nextConfig = {
  // Target must be serverless
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  enableSvg: true,
  env: {
    production: process.env.NEXT_PUBLIC_URL_PRODUCTION,
    development: "http://localhost:9000/",
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
      'mogosangare.com']
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