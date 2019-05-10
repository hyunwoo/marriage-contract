module.exports = {
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true
  },

  publicPath: "marriage-contract",
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: true,
  productionSourceMap: undefined,
  parallel: undefined,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
};