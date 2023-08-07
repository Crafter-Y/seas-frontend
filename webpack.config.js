const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.module.rules.push({
    test: /config.json/,
    type: 'asset/resource',
    generator: {
      filename: "static/[name][ext]"
    }
  })
  config.ignoreWarnings = [/Failed to parse source map/];

  /* Enable this for development web builds
  config.devServer = {
    compress: false
  }
  config.optimization = {
    minimize: false
  }*/

  return config;
};
