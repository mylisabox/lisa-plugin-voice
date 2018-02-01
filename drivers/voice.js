'use strict'

const Driver = require('lisa-plugin').Driver

module.exports = class LISAVoiceDriver extends Driver {
  _handleError(error) {
    switch (error.errorCode) {
      case this.mdns.kDNSServiceErr_Unknown:
        this.log.warn(error);
        setTimeout(this._createBrowser, 5000);
        break;
      default:
        this.log.error(error);
        throw error;
    }
  }

  init() {
    this.devices = {}
    // Make it work on raspberry pi by forcing ipv4
    this._createBrowser()
    return Promise.resolve()
  }

  saveDevice(deviceData) {
    return this.lisa.createOrUpdateDevices(deviceData)
  }

  _getIpV4Address(addresses) {
    let add = null
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
        for (const deviceIdentifier in this.devices) {
          const device = this.devices[deviceIdentifier]
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

  _createBrowser() {
    const sequence = [
      this.lisa.mdns.rst.DNSServiceResolve(), 'DNSServiceGetAddrInfo' in this.lisa.mdns.dns_sd ?
        this.lisa.mdns.rst.DNSServiceGetAddrInfo() : this.lisa.mdns.rst.getaddrinfo({ families: [4] }),
      this.lisa.mdns.rst.makeAddressesUnique()
    ]

    try {
      this.browser = this.lisa.mdns.createBrowser(this.lisa.mdns.tcp('http'), { resolverSequence: sequence })
      this.browser.on('error', this._handleError);
      this.browser.on('serviceUp', service => {
        if (service.name.indexOf('lisaVoiceCommand') !== -1) {
          this.devices[service.txtRecord.identifier] = service
        }
      })
      this.browser.on('serviceDown', service => {
        if (service.name.indexOf('lisaVoiceCommand') !== -1) {
          for (let identifier in this.devices) {
            if (this.devices[identifier].name === service.name) {
              delete this.devices[identifier]
            }
          }
        }
      })
      this.browser.start()
    } catch (err) {
      this._handleError(err)
    }
  }
}
