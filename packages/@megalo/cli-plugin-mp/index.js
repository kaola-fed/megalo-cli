const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const { warn, getCssExt } = require('@megalo/cli-share-utils')
const { findExisting, checkFileExistsSync } = require('./utils')

module.exports = (api, options) => {
  const platform = process.env.PLATFORM
  const cssExt = getCssExt(platform)
  const isProd = process.env.NODE_ENV === 'production'

  api.chainWebpack(chainaConfig => {
    if (!['web', 'h5'].includes(platform)) {
      const webpack = require('webpack')
      const MiniCssExtractPlugin = require('mini-css-extract-plugin')
      const VueLoaderPlugin = require('vue-loader/lib/plugin')
      const TerserPlugin = require('terser-webpack-plugin')
      const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
      const CopyWebpackPlugin = require('copy-webpack-plugin')

      const { appEntry, pagesEntry } = resolveEntry()
      const target = createTarget()

      // app和页面入口
      chainaConfig.entry('app').clear().add(appEntry)
      const pages = Object.entries(pagesEntry)
      for (const [key, value] of pages) {
        chainaConfig.entry(key).add(value)
      }

      chainaConfig
        .devtool(isProd && !options.productionSourceMap ? 'none' : 'source-map')
        .target(target)
        .output
          .path(api.resolve(`dist-${platform}/`))
          .filename('static/js/[name].js')
          .chunkFilename('static/js/[name].js')
          .pathinfo(false)

      // 提取公共文件、压缩混淆
      chainaConfig.optimization
        .noEmitOnErrors(true)
        .runtimeChunk({ name: 'runtime' })
        .splitChunks({
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]|megalo[\\/]/,
              name: 'vendor',
              chunks: 'initial'
            },
            common: {
              name: 'common',
              minChunks: 2
            }
          }
        })
      .when(isProd, optimization => {
        optimization
          .minimizer('optimize-js')
            .use(
              TerserPlugin,
              [{
                cache: true,
                parallel: true,
                sourceMap: options.productionSourceMap
              }]
            )
            .end()
          .minimizer('optimize-css')
            .use(
              OptimizeCSSAssetsPlugin,
              [{
                assetNameRegExp: new RegExp(`\\.${getCssExt(platform)}$`, 'g'),
                cssProcessorPluginOptions: {
                  preset: ['default', {
                    discardComments: { removeAll: true },
                    calc: false
                  }]
                }
              }]
            )
      })

      // alias
      chainaConfig.resolve.alias.set('vue', 'megalo')

      // 处理.vue
      chainaConfig.module
        .rule('vue')
          .test(/\.vue$/)
          .use('vue')
            .loader('vue-loader')
            .options({
              compilerOptions: {
                preserveWhitespace: false
              }
            })

      // 处理js、ts
      chainaConfig.module
      .rule('js')
        .test(/\.(ts|js)x?$/)
        .use('babel')
          .loader('babel-loader')
          .end()
          .exclude
            .add(/node_modules/)

      // 图片
      chainaConfig.module
        .rule('picture')
        .test(/\.(png|jpe?g|gif)$/i)
        .use('url')
          .loader('url-loader')
          .options({
            limit: 8192,
            // TODO 这里有个小bug, static的图片会生成在dist下面的src目录，子包的图片会生成在子包下的src目录，不影响分包策略，仅仅是路径看着有些别扭
            name: '[path][name].[ext]'
          })

      // css相关loader
      generateCssLoaders(chainaConfig)

      // 插件
      chainaConfig
        .plugin('process-plugin')
          .use(webpack.ProgressPlugin)
          .end()
        .plugin('vue-loader-plugin')
          .use(VueLoaderPlugin)
          .end()
        .plugin('mini-css-extract-plugin')
          .use(MiniCssExtractPlugin, [{ filename: `static/css/[name].${cssExt}` }])

      // megalo 周边
      // 启用 @Megalo/API
      const megaloAPIPath = checkFileExistsSync(`node_modules/@megalo/api/platforms/${platform}`)
      if (megaloAPIPath) {
        chainaConfig.plugin('provide-plugin')
          .use(webpack.ProvidePlugin, [{ 'Megalo': [megaloAPIPath, 'default'] }])
      }

      // 拷贝原生小程序组件 TODO： 拷贝前可对其进行预处理（babel转译\混淆\压缩等）
      const nativeDir = checkFileExistsSync(path.join(options.nativeDir, platform)) || checkFileExistsSync(options.nativeDir)
      if (nativeDir) {
        chainaConfig.plugin('copy-webpack-plugin')
            .use(
              CopyWebpackPlugin,
              [
                [
                  {
                    context: nativeDir,
                    from: `**/*`,
                    to: api.resolve(`dist-${platform}/native`)
                  }
                ]
              ]
            )
      }
    }
  })

  function resolveEntry () {
    // app entry
    const entryContext = api.resolve('src')
    const appEntry = findExisting(entryContext, [
      'main.js',
      'index.js',
      'App.vue',
      'app.vue'
    ])

    if (!appEntry) {
      console.log(chalk.red(`Failed to locate entry file in ${chalk.yellow(entryContext)}.`))
      console.log(chalk.red(`Valid entry file should be one of: main.js, index.js, App.vue or app.vue.`))
      process.exit(1)
    }

    const appEntryPath = path.join(entryContext, appEntry)
    if (!fs.existsSync(appEntryPath)) {
      console.log(chalk.red(`Entry file ${chalk.yellow(appEntry)} does not exist.`))
      process.exit(1)
    }
    // 页面entry
    const { pagesEntry } = require('@megalo/entry')
    return { appEntry: appEntryPath, pagesEntry: pagesEntry(appEntryPath) }
  }

  function createTarget () {
    const createMegaloTarget = require('@megalo/target')
    const targetConfig = {
      compiler: Object.assign(require('@megalo/template-compiler'), {}),
      platform
    }
    const octoParsePath = checkFileExistsSync(`node_modules/octoparse/lib/platform/${platform}`)
    if (octoParsePath) {
      targetConfig.htmlParse = {
        templateName: 'octoParse',
        src: octoParsePath
      }
    } else {
      warn(
        `Current version of package 'octoparse' does not support 'v-html' directive in platform '${platform}'\n ` +
        `Please upgrade to the latest version and pay attention to the official website: https://github.com/kaola-fed/octoparse`
      )
    }
    return createMegaloTarget(targetConfig)
  }

  /**
   * 生成css相关的 Loader
   *
   */
  function generateCssLoaders (chainaConfig, projectOptions = options) {
    const MiniCssExtractPlugin = require('mini-css-extract-plugin')
    const merge = require('deepmerge')
    const neededLoader = new Map([
      ['css', /\.css$/],
      ['less', /\.less$/],
      ['sass', /\.scss$/],
      ['stylus', /\.styl(us)?$/]
    ])

    for (const [loaderName, loaderReg] of neededLoader) {
      chainaConfig.module
        .rule(loaderName)
          .test(loaderReg)
          .use('MiniCssExtractPlugin')
            .loader(MiniCssExtractPlugin.loader)
          .end()
          .use('css')
            .loader('css-loader')
            .when(projectOptions.css.loaderOptions['css'], config => {
              config.tap(options => merge(options, projectOptions.css.loaderOptions['css']))
            })
          .end()
          .when(projectOptions.css.loaderOptions['px2rpx'], rule => {
            rule.use('px2rpx')
              .loader('px2rpx-loader')
              .when(projectOptions.css.loaderOptions['px2rpx'], config => {
                config.tap(options => merge(options, projectOptions.css.loaderOptions['px2rpx']))
              })
            .end()
          })
          .when(loaderName !== 'css', config => {
            config.use(loaderName)
              .loader(`${loaderName}-loader`)
              .when(projectOptions.css.loaderOptions[loaderName], config => {
                config.tap(options => merge(options, projectOptions.css.loaderOptions[loaderName]))
              })
            .end()
          })
    }
    return chainaConfig.module.toConfig().rules
  }
}
