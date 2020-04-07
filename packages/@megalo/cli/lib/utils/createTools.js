exports.getPromptModules = () => {
  return [
    // 'babel',
    'typescript',
    'cssPreprocessors',
    // 'router',
    'linter',
    'vuex',
    'px2rpx',
    'megaloapi',
  ].map(file => require(`../promptModules/${file}`))
}