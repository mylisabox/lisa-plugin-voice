'use strict'

const Driver = require('lisa-plugin').Driver
const PORT = 53862
const sdcp = require('../lib/sdcp')
const {commands, inputs, powerStatus} = require('../lib/commands')
const dgram = require('dgram')

module.exports = class VplDriver extends Driver {
  init() {

  }

  saveDevice(deviceData) {

  }

  getDevices() {

  }

  getDevicesData(devices) {
    for (let device of devices) {
      const api = sdcp({port: device.privateData.port, address: device.privateData.address}, this.log)
      const action = commands.POWER
      sdcp.getAction(action)
    }
  }

  setDeviceValue(device, key, newValue) {
    const options = {}
    options[key] = newValue
    return this._setAction(device, options)
  }

  setDevicesValue(devices, key, newValue) {

  }

  _setAction(device, options) {
    const api = sdcp({port: device.privateData.port, address: device.privateData.address}, this.log)
    let action, data

    if (options.input1) {
      action = commands.INPUT
      data = inputs.HDMI1
    }
    else if (options.input2) {
      action = commands.INPUT
      data = inputs.HDMI2
    }
    else if (options.state) {
      action = commands.POWER
      data = options.state == 'on' ? powerStatus.START_UP : (options.state == 'off' ? powerStatus.STANDBY : options.state)
    }
    if (!data || !action) {
      return Promise.reject(new Error('Wrong command!'))
    }
    api.setAction(action, data)
    return Promise.resolve()
  }

  unload() {
    if (this.server) {
      this.server.close()
    }
    return Promise.resolve()
  }
}
