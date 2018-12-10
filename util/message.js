const chalk = require('chalk')
const ora = require('ora')


function wait (mesg) {
    return ora(chalk.black.bgCyan(' Waiting: ') + chalk.cyan(` ${mesg}...\n`))
}

function info (mesg) {
    console.info(chalk.black.bgBlue(' Info: ') + chalk.blue(` ${mesg}\n`))
}


module.exports = {
    wait,
    info
}