const fs = require('fs')
const cloneDeep = require('lodash.clonedeep')
const { getRcPath } = require('./utils/rcPath')
const { exit } = require('@megalo/cli-share-utils/lib/exit')
const { error } = require('@megalo/cli-share-utils/lib/logger')
const { createSchema, validate } = require('@megalo/cli-share-utils/lib/validate')

const rcPath = exports.rcPath = getRcPath('.megalorc')

const presetSchema = createSchema(joi => joi.object().keys({
  bare: joi.boolean(),
  useConfigFiles: joi.boolean(),
  router: joi.boolean(),
  routerHistoryMode: joi.boolean(),
  vuex: joi.boolean(),
  px2rpx: joi.boolean(),
  megaloapi: joi.boolean(),
  // TODO: remove 'sass' or make it equivalent to 'dart-sass' in v4
  cssPreprocessor: joi.string().only(['sass', 'dart-sass', 'node-sass', 'less', 'stylus']),
  plugins: joi.object().required(),
  configs: joi.object()
}))

const schema = createSchema(joi => joi.object().keys({
  // latestVersion: joi.string().regex(/^\d+\.\d+\.\d+$/),
  latestVersion: joi.object().keys(null),
  lastChecked: joi.date().timestamp(),
  packageManager: joi.string().only(['yarn', 'npm', 'pnpm']),
  useTaobaoRegistry: joi.boolean(),
  presets: joi.object().pattern(/^/, presetSchema)
}))

exports.validatePreset = preset => validate(preset, presetSchema, msg => {
  error(`invalid preset options: ${msg}`)
})

exports.defaultPreset = {
  router: false,
  vuex: false,
  px2rpx: false,
  megaloapi: false,
  useConfigFiles: false,
  cssPreprocessor: undefined,
  plugins: {
    // '@megalo/cli-plugin-babel': {},
    '@megalo/cli-plugin-eslint': {
      config: 'base',
      lintOn: [ 'Save' ]
    }
  }
}

exports.defaults = {
  lastChecked: undefined,
  // latestVersion: undefined,
  latestVersion: {},

  packageManager: undefined,
  useTaobaoRegistry: undefined,
  presets: {
    Default: exports.defaultPreset
  }
}

let cachedOptions

exports.loadOptions = () => {
  if (cachedOptions) {
    return cachedOptions
  }
  if (fs.existsSync(rcPath)) {
    try {
      cachedOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'))
    } catch(e) {
      error(
        `Error loading saved preferences: ` +
        `~/.megalorc may be corrupted or have syntax errors. ` +
        `Please fix/delete it and re-run megalo-cli in manual mode.\n` +
        `(${e.message})`
      )
      exit(1)
    }
    validate(cachedOptions, schema, () => {
      error(
        `~/.megalorc may be outdated. ` +
        `Please delete it and re-run vue-cli in manual mode.`
      )
    })
    return cachedOptions
  } else {
    return {}
  }
}

exports.saveOptions = toSave => {
  const options = Object.assign(cloneDeep(exports.loadOptions()), toSave)
  for (const key in options) {
    if (!(key in exports.defaults)) {
      delete options[key]
    }
  }
  cachedOptions = options
  try {
    fs.writeFileSync(rcPath, JSON.stringify(options, null, 2))
  } catch(e) {
    error(
      `Error saving preferences: ` +
      `make sure you have write access to ${rcPath}.\n` +
      `(${e.message})`
    )
  }
}

exports.savePreset = (name, preset) => {
  const presets = cloneDeep(exports.loadOptions().presets || {})
  presets[name] = preset
  exports.saveOptions({ presets })
}