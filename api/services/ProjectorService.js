'use strict'

const Service = require('lisa-plugin').Service
const PORT = 53862
const sdcp = require('../../lib/sdcp')
const {commands, inputs, powerStatus} = require('../../lib/commands')
const dgram = require('dgram')

/**
 * @module ProjectorService
 * @description sony projector service
 */
module.exports = class ProjectorService extends Service {
  setState(device, options) {
    return this._setAction(device, options)
  }

  setInput(device, options) {
    return this._setAction(device, options)
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

  search() {
    if (!this.listening) {
      this.listening = true
      this.server = dgram.createSocket({type: "udp4", reuseAddr: true})

      this.server.on('message', (message, remote) => {
        if (message.length == 50) {
          return this._manageProjector(message, remote)
        }
      })
      this.server.bind(PORT)
      setTimeout(() => {
        this.server.close(() => this.listening = false)
      }, 40000)
    }
    return Promise.resolve()
  }

  init() {
    this.listening = false
    setInterval(() => {
      this.search()
    }, 30000)
    return this.search()
  }

  unload() {
    if (this.server) {
      this.server.close()
    }
    return Promise.resolve()
  }

  _manageProjector(message, remote) {
    //const header = message.subarray(0, 4)
    //const id = String.fromCharCode.apply(null, header.subarray(0, 2))
    //const version = header[2]
    //const cat = String.fromCharCode.apply(null, header.subarray(3, 4))
    //const community = String.fromCharCode.apply(null, message.subarray(4, 8))
    const name = String.fromCharCode.apply(null, message.subarray(8, 20)).replace(new RegExp('\u0000', 'g'), '')
    const serial = Buffer.from(message.subarray(20, 24)).toString('hex')
    const power = Buffer.from(message.subarray(24, 26)).toString('hex')
    //const location = String.fromCharCode.apply(null, message.subarray(26, 50))

    return this.lisa.findDevices().then(devices => {
      let device = devices.find(device => device.privateData.serial == serial)

      if (device) {
        device.privateData = this._getDevicePrivateData(serial, remote)
        device.data = this._getDeviceData(power)
      }
      else {
        device = {
          name: name,
          privateData: this._getDevicePrivateData(serial, remote),
          data: this._getDeviceData(power),
          template: require('../../widgets/projector.json')
        }
      }

      return this.lisa.createOrUpdateDevices(device)
    })
  }

  _getDeviceData(power) {
    return {
      power: power == powerStatus.POWER_ON || power == powerStatus.START_UP || power == powerStatus.START_UP_LAMP ? 'on' : 'off',
      values: {'off': '/images/widgets/tv_off.png', 'on': '/images/widgets/tv_on.png'}
    }
  }

  _getDevicePrivateData(serial, remote) {
    return {
      serial: serial,
      port: 53484,
      address: remote.address
    }
  }
}

