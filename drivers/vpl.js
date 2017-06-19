'use strict'

const Driver = require('lisa-plugin').Driver
const PORT = 53862
const {commands, powerStatus, SdcpClient} = require('sony-sdcp-com')
const {inputs} = require('../lib/commands')
const dgram = require('dgram')

module.exports = class VplDriver extends Driver {
  init() {
    setInterval(this._search.bind(this), 60000)
    return this._search()
  }

  _search() {
    if (!this.listening) {
      this.listening = true
      this.server = dgram.createSocket({type: 'udp4', reuseAddr: true})

      this.server.on('message', (message, remote) => {
        if (message.length === 50) {
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

  saveDevice(deviceData) {
    return this.getDevicesData([deviceData]).then(data => {
      return this.lisa.createOrUpdateDevices(data[0])
    })
  }

  getDevices() {

  }

  getDevicesData(devices) {
    const getData = []
    for (const device of devices) {
      const api = SdcpClient({port: device.privateData.port, address: device.privateData.address})
      getData.push(api.getPower())
    }
    return Promise.all(getData).then(data => {
      for (let i = 0; i < data.length; i++) {
        const power = data[i]
        Object.assign(devices[i].data, this._getDeviceData(power))
      }
      return devices
    })
  }

  setDeviceValue(device, key, newValue) {
    const options = {}
    options[key] = newValue
    return this.setAction(device, options)
      .then(() => this.getDevicesData([device])
        .then(data => this.lisa.createOrUpdateDevices(data[0])))
  }

  setDevicesValue(devices, key, newValue) {

  }

  setAction(device, options) {
    const api = SdcpClient({port: device.privateData.port, address: device.privateData.address}, this.log)
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
      action = commands.SET_POWER
      data = options.state === 'on' ? powerStatus.START_UP : (options.state === 'off' ? powerStatus.STANDBY : options.state)
    }
    if (!data || !action) {
      return Promise.reject(new Error('Wrong command!'))
    }
    return api.setAction(action, data)
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
      let device = devices.find(device => device.privateData.serial === serial)

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
      power: power === powerStatus.POWER_ON || power === powerStatus.START_UP || power === powerStatus.START_UP_LAMP ||
      power === 'ON' || power === 'WARMING' ?
        'on' : 'off',
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
