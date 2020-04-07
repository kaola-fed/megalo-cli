module.exports = cli => {
  // cli.injectFeature({
  //   name: 'needPx2Rpx',
  //   value: 'px2rpx',
  //   description: 'Need px2rpx loader',
  //   link: 'https://megalojs.org/'
  // })

  cli.injectPrompt({
    name: 'needPx2Rpx',
    // when: answers => answers.features.includes('px2rpx'),
    type: 'list',
    message: `Does project need Px2Rpx loader?`,
    description: `By using Px2Rpx loader, you can use px in project.`,
    choices: [
      {
        name: 'Yes',
        value: true
      },
      {
        name: 'No',
        value: false
      }
    ]
  })

  cli.onPromptComplete((answers, options) => {
    // if (answers.features.includes('px2rpx') && answers.needPx2Rpx !== undefined) {
    if (answers.needPx2Rpx !== undefined) {
      options.px2rpx = answers.needPx2Rpx
    }
  })
}