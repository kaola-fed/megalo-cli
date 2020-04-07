// dev only

const path = require('path')
const { linkBin } = require('./linkBin')

module.exports = function setupDevProject (targetDir) {
  return linkBin(
    require.resolve('@megalo/cli-service/bin/megalo-cli-service'),
    path.join(targetDir, 'node_modules', '.bin', 'megalo-cli-service')
  )
}
