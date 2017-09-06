'use strict'

const Driver = require('lisa-plugin').Driver

module.exports = class LISAVoiceDriver extends Driver {
  init() {
    this.devices = []
    this.browser = this.lisa.mdns.createBrowser(this.lisa.mdns.tcp('http'))
    this.browser.on('serviceUp', service => {
      if (service.name.indexOf('lisaVoiceCommand') !== -1) {
        this.devices.push(service)
      }
    })
    this.browser.on('serviceDown', service => {

    })
    this.browser.start()
    return Promise.resolve()
  }

  saveDevice(deviceData) {
    return this.lisa.createOrUpdateDevices(deviceData)
  }

  _getIpV4Address(addresses) {
    let add
    addresses.forEach(address => {
      if (address.indexOf('::') === -1) {
        add = address
      }
    })
    return add
  }

  pairing(data) {
    let results = {
      devices: [],
      step: 'done'
    }
    if (!data['devices_list']) {
      results = this.lisa.findDevices().then(lisaDevices => {
        const myData = {
          devices: []
        }
        for (const device of this.devices) {
          const lisaDevice = lisaDevices.filter(lDevice =>
            lDevice.privateData.identifier === device.txtRecord.identifier)
          const ip = this._getIpV4Address(device.addresses)
          if (lisaDevice.length === 0) {
            myData.devices.push({
              name: `${device.name} (${ip})`,
              image: '',
              driver: 'voice',
              template: {},
              type: this.lisa.DEVICE_TYPE.OTHER,
              data: {},
              privateData: {
                ip: ip,
                identifier: device.txtRecord.identifier
              },
              id: device.txtRecord.identifier
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

  unload() {
    this.browser.stop()
    return Promise.resolve()
  }
}
