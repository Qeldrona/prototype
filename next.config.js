const nextConfig = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET, // Pass through env variables
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
    butthead: true
  },
  webpack: (config, options) => {
    config.optimization.splitChunks = {
      chunks: (chunk) => !/^(polyfills|main|pages\/_app)$/.test(chunk.name),
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 25,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: false,
        default: false,
        framework: {
          chunks: 'all',
          name: 'framework',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
          priority: 40,
          enforce: true,
        },
        commons: {
          name: 'commons',
          minChunks: 1,
          priority: 20,
        },
      },
    }
    return config;
  },
};

module.exports = nextConfig;