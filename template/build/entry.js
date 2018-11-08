'use strict'
const fs = require('fs')
const path = require('path')
const json5 = require('json5')
const exp4parse = /\/\*[^*]*\*+(?:[^\/*][^*]*\*+)*\/|\/\/[^\r\n]*|\s/g
const exp4filter = /(?={config)(.+)/g


// 获取 src/index.js 中声明的页面及分包页面入口
function getEntry(file) {
    let entries = {},
        txt = ''

    try {
        txt = fs.readFileSync(file, 'utf8')
        txt = txt.replace(exp4parse, '')

        let config = json5.parse(txt.match(exp4filter)[0])['config']

        if (config.pages) {
            config.pages.forEach(page => {
                entries[page] = path.resolve(`src/${page}.js`)
            })
        } else {
            console.log(`Warning: 必须配置 'pages' 入口路径`)
        }

        if (config.subpackages) {
            config.subpackages.forEach((subpack, index) => {
                if (subpack.root) {
                    let subpackPages = subpack.pages.map(p => `${subpack.root}/${p}`)
                    subpackPages.forEach(page => {
                        entries[page] = path.resolve(`src/${page}.js`)
                    })
                } else {
                    console.log(`Warning: 'subpackages[${index}]' 必须配置 'root' 路径`)
                }
            })
        }

    } catch (e) {
        if (e.toString() === "TypeError: Cannot read property '0' of null") {
            console.log(`Warning: ${file} 中缺少 "config" 配置`)
        } else if (e.toString() === 'TypeError: Cannot read property \'map\' of undefined') {
            console.log(`Warning: 'subpackages' 中必须配置分包的 'pages' 路径`)
        } else {
            console.log(`${e.toString()}\n\tat: ${file}`)
        }
    }

    return entries
}

module.exports = (() => {
    let entry = {}
    entry = getEntry(path.resolve(__dirname, '../src/index.js'))
    return entry
})()