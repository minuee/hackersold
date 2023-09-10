const path = require("path");

module.exports = {
  webpack: function (config, env) {
    let is_prod = env === "production";
    const now = new Date().getTime();
    config.resolve.modules = [...(config.resolve.modules || []), path.resolve(__dirname, "src")];
    config.output.filename = is_prod ? "[name].[contenthash:8].js" : "[name].[hash:8].js";
    config.output.chunkFilename = is_prod ? `[name]-${now}-[chunkhash].js` : `[name]-[chunkhash].js`
    return config;
  },
};