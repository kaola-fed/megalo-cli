module.exports = (api, options) => {
  const tplDir = api.hasPlugin('typescript') ? './template/typescript' : './template/main'
  api.render(tplDir, {
    doesCompile: api.hasPlugin('babel') || api.hasPlugin('typescript')
  })

  const scopedPkgVersions = api.generator.scopedPkgVersions
  let pkgList
  
  const scripts = {
    'build:wechat': 'megalo-cli-service build',
    'build:alipay': 'megalo-cli-service build --platform alipay',
    'build:swan': 'megalo-cli-service build --platform swan',
    'build:toutiao': 'megalo-cli-service build --platform toutiao',
    'dev:alipay': 'megalo-cli-service serve --platform alipay',
    'dev:swan': 'megalo-cli-service serve --platform swan',
    'dev:wechat': 'megalo-cli-service serve',
    'dev:toutiao': 'megalo-cli-service serve --platform toutiao',
  }

  const dependencies = {
    'octoparse': '^0.4.2',
    '@megalo/vhtml-plugin': '^0.1.2',
    'megalo': '0.10.1'
  }

  const devDependencies = {
    '@megalo/target': '^0.7.4-0',
  }

  pkgList = [
    '@megalo/babel-preset-app',
    '@megalo/cli-service',
    '@megalo/template-compiler'
  ]
  pkgList.forEach(p => devDependencies[p] = scopedPkgVersions[p])

  if (api.hasPlugin('eslint')) {
    scripts['lint'] = 'megalo-cli-service lint'

    pkgList = [
      '@megalo/cli-plugin-eslint',
      '@megalo/eslint-config-standard'
    ]
    pkgList.forEach(p => devDependencies[p] = scopedPkgVersions[p])

    devDependencies['eslint'] = '^5.15.3'
  }

  if (options.vuex) {
    dependencies['vuex'] = '^3.1.0'

    if (api.hasPlugin('typescript')) {
      dependencies['vuex-class'] = '^0.3.2'
    }
  }

  if (options.needMegaloAPI === 'Yes') {
    pkgList = [
      '@megalo/api'
    ]
    pkgList.forEach(p => dependencies[p] = scopedPkgVersions[p])
  }

  if (api.hasPlugin('typescript')) {
    dependencies['vue-property-decorator'] = '8.1.1'
    dependencies['vue-class-component'] = '^7.0.2'

    pkgList = [
      '@megalo/cli-plugin-typescript'
    ]
    pkgList.forEach(p => devDependencies[p] = scopedPkgVersions[p])
    devDependencies['@types/node'] = '^11.11.4'
    devDependencies['miniprogram-api-typings'] = '^2.8.2'
    devDependencies['typescript'] = '^3.4.4'

    if (api.hasPlugin('eslint')) {
      pkgList = [
        '@megalo/eslint-config-typescript'
      ]
      pkgList.forEach(p => devDependencies[p] = scopedPkgVersions[p])
    }
  }

  if (options.cssPreset === 'less') {
    devDependencies['less'] = '^3.8.1'
    devDependencies['less-loader'] = '^4.1.0'
  } else if (options.cssPreset === 'stylus') {
    devDependencies['stylus'] = '^0.54.5'
    devDependencies['stylus-loader'] = '^3.0.2'
  } else if (options.cssPreset === 'scss') {
    devDependencies['node-sass'] = '^4.10.0'
    devDependencies['sass-loader'] = '^7.1.0'
  }

  api.extendPackage({
    scripts,
    dependencies,
    devDependencies,
    'postcss': {
      'plugins': {
        'autoprefixer': {}
      }
    },
    browserslist: [
      '> 1%',
      'last 2 versions'
    ]
  })

  if (options.router) {
    require('./router')(api, options)
  }

  if (options.vuex) {
    require('./vuex')(api, options)
  }

  if (options.cssPreprocessor) {
    const deps = {
      // TODO: remove 'sass' option in v4 or rename 'dart-sass' to 'sass'
      sass: {
        'node-sass': '^4.9.0',
        'sass-loader': '^7.1.0'
      },
      'node-sass': {
        'node-sass': '^4.9.0',
        'sass-loader': '^7.1.0'
      },
      'dart-sass': {
        sass: '^1.18.0',
        'sass-loader': '^7.1.0'
      },
      less: {
        'less': '^3.0.4',
        'less-loader': '^5.0.0'
      },
      stylus: {
        'stylus': '^0.54.5',
        'stylus-loader': '^3.0.2'
      }
    }

    api.extendPackage({
      devDependencies: deps[options.cssPreprocessor]
    })
  }

  // additional tooling configurations
  if (options.configs) {
    api.extendPackage(options.configs)
  }
}
