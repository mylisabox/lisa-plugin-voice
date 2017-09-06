'use strict'

const Plugin = require('lisa-plugin')

module.exports = class VoicePlugin extends Plugin {

  constructor(app) {
    super(app, {
      drivers: require('./drivers'),
      pkg: require('./package'),
      config: require('./config')
    })
  }
}
