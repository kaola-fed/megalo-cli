#!/usr/bin/env node
const sao = require('sao')
const minimist = require('minimist')
const lv = require('latest-version')
const Mesg = require('./util/message')
const { version:localVersion } = require('./package.json')
const { version:consoleVersion, help:consoleHelp } = require('./util')

const argv = minimist(process.argv.slice(2))
const { h, help:_h, v, version:_v, f, force:_f} = argv
// In a custom directory or current directory
const targetPath = argv._[0] || '.'
let latestVersion = 0,
    hasNewVersion = false

;(async () => {
    const spinner = Mesg.wait('检查@megalo/cli版本')
    spinner.start()
    latestVersion = await lv('@megalo/cli')
    spinner.stop()
    hasNewVersion = consoleVersion(localVersion, latestVersion, v || _v)
    !hasNewVersion && Mesg.info(`已是最新版本${latestVersion}`)
    if (h || _h) {
        return consoleHelp()
    } else if (v || _v || (hasNewVersion && !f && !_f)) {
        return
    }

    sao({
        // The path to your template
        template: __dirname,
        targetPath
    }).catch(err => {
        console.error(err.name === 'SAOError' ? err.message : err.stack)
        process.exit(1)
    })

})()