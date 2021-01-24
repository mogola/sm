const fs = require('fs')
const privateKEY = fs.readFileSync('private.key', 'utf8');
const publicKEY = fs.readFileSync('public.key', 'utf8');
const withFonts = require('next-fonts');

module.exports = withFonts({
  // Target must be serverless
  enableSvg: true,
  target: 'serverless',
  env: {
    production: process.env.NEXT_PUBLIC_URL_PRODUCTION,
    development: "http://localhost:9000/",
    keyPrivate: privateKEY,
    keyPublic: publicKEY,
    apikeysendinblue: process.env.APIKEY_SENDINBLUE
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    config.module.rules.push({ parser: { amd: false } })
    if (!isServer) {
      config.node = {
        fs: 'empty',
        dgram: 'empty',
        module: 'empty',
        net: 'empty',
        tls: 'empty',
        express: 'empty',
        child_process: 'empty'
      }
    }
    return config
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
  // async rewrites() {
  //   return [
  //     // Advanced rewrite
  //     // Query object shape: { id: string } (in addition to dynamic route param)
  //     { source: "/api/posts/:id", destination: "/posts/:id" }
  //   ];
  // }
})