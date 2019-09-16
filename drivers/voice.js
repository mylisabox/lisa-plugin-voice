'use strict'

const Driver = require('lisa-plugin').Driver
const LisaDiscovery = require('lisa-discovery')

module.exports = class LISAVoiceDriver extends Driver {
  init() {
    this.devices = {}
    return Promise.resolve()
  }

  saveDevice(deviceData) {
    return this.lisa.createOrUpdateDevices(deviceData)
  }

  _discover() {
    return new Promise((resolve, reject) => {
      const multicastPort = 5544
      const multicastAddress = '239.6.6.6'
      const wantedMessage = 'lisa-voice-response'
      const message = 'lisa-voice-search'
      const devices = {}
      const discovery = new LisaDiscovery({
        multicastAddress: multicastAddress,
        multicastPort: multicastPort,
        trigger: wantedMessage,
        callback: (input, address) => {
          const identifier = input.replace(wantedMessage, '').trim()
          devices[identifier] = address
        }
      })
      discovery.start(() => {
        discovery.sendMessage(message)
        setTimeout(() => {
          discovery.stop()
          resolve(devices)
        }, 800)
      })
    })
  }

  pairing(data) {
    let results = {
      devices: [],
      step: 'done'
    }
    if (!data['devices_list']) {
      results = Promise.all([this._discover(), this.lisa.findDevices()]).then((data) => {
        const newDevice = data[0]
        const existingDevice = data[1]

      const myData = {
          devices: []
        }

        for (const deviceIdentifier in newDevice) {
          const deviceIp = newDevice[deviceIdentifier]
          const lisaDevice = existingDevice.filter(lDevice => lDevice.privateData.identifier === deviceIdentifier)
          if (lisaDevice.length === 0) {
            myData.devices.push({
              name: `L.I.S.A. voice (${deviceIp})`,
              image: '',
              driver: 'voice',
              template: {},
              type: this.lisa.DEVICE_TYPE.OTHER,
              data: {},
              privateData: {
                ip: deviceIp,
                identifier: deviceIdentifier
              },
              id: deviceIdentifier
            })
          }
        }
        myData.step = 'devices_list'
        return myData
      })
    }
    else {
      results = this.lisa.createOrUpdateDevices(data['devices_list'].map(device => {
        delete device.id
        return device
      })).then(() => Promise.resolve({
        step: 'done'
      }))
    }
    return results instanceof Promise ? results : Promise.resolve(results)
  }

  getDevicesData(devices) {
    return Promise.resolve(devices)
  }

}
