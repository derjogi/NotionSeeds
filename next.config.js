// const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  images: {
    domains: ['pbs.twimg.com']
  },
  // webpack: (config, { isServer }) => {
  //   // Fixes npm packages that depend on `fs` module
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       fs: false,
  //       stream: false,
  //       crypto: false,
  //       path: false,
  //       net: false,
  //       dns: false,
  //       os: false,
  //       zlib: false,
  //       tls: false,
  //       https: false,
  //       http: false,
  //       http2: false,
  //       util: false,
  //       child_process: false
  //     };
  //   }
  //
  //   return config;
  // }
})
