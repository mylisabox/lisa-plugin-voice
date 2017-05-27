'use strict'

const Plugin = require('lisa-plugin')

module.exports = class SonyVPLPlugin extends Plugin {

  setDeviceValue(device, key, newValue) {
    const options = {}
    options[key] = newValue
    if (key === 'state') {
      return this.services.ProjectorService.setState(device, options)
    }
    else {
      return this.services.ProjectorService.setInput(device, options)
    }
  }

  setDevicesValue(devices, key, newValue) {

  }

  /**
   * Initialisation of your plugin
   * Called once, when plugin is loaded
   * @returns Promise
   */
  init() {
    return this.services.ProjectorService.init()
  }

  /**
   * Called automatically to search for new devices
   * @return Promise

   searchDevices() {
    return this.services.ProjectorService.search()
  }*/

  /**
   * Called when
   * @param action to execute
   * @param infos context of the action
   * @return Promise
   */
  interact(action, infos) {
    return this.services.ChatBotService.interact(action, infos)
  }

  unload() {
    return this.services.ProjectorService.unload()
  }

  constructor(app) {
    super(app, {
      api: require('./api'),
      pkg: require('./package'),
      bots: require('./bots')
    })
  }
}
