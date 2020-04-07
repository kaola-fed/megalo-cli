module.exports = cli => {
  // cli.injectFeature({
  //   name: 'needMegaloAPI',
  //   value: 'megaloapi',
  //   description: 'Need Megalo API support',
  //   link: 'https://megalojs.org/'
  // })

  cli.injectPrompt({
    name: 'needMegaloAPI',
    // when: answers => answers.features.includes('megaloapi'),
    type: 'list',
    message: `Does project need Megalo API support?`,
    description: `By using Megalo API, you do not need to care MiniProgram api support variations.`,
    choices: [
      {
        name: 'No',
        value: true
      },
      {
        name: 'Yes',
        value: false
      }
    ]
  })

  cli.onPromptComplete((answers, options) => {
    // if (answers.features.includes('megaloapi') && answers.needMegaliAPI !== undefined) {
    if (answers.needMegaliAPI !== undefined) {
      options.megaloapi = answers.needMegaloAPI
    }
  })
}