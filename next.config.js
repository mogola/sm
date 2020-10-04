module.exports = {
  // Target must be serverless
    target: 'serverless',
    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
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
  }