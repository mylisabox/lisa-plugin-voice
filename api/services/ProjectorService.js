'use strict'

const PORT = 53862
const HOST = '0.0.0.0'
const Service = require('lisa-plugin').Service
const SDCP = require('../../lib/sdcp')
const dgram = require('dgram')

/**
 * @module ProjectorService
 * @description sony projector service
 */
module.exports = class ProjectorService extends Service {

  search() {
    this.server.bind(PORT, HOST)
    setTimeout(() => {
      this.server.close()
    })
    return Promise.resolve()
  }

  init() {
    this.server = dgram.createSocket('udp4')

    this.server.on('message', (message, remote) => {
      if (message.length == 50) {
        this._manageProjector(message, remote)
      }
    })

    return this.search()
  }

  _manageProjector(message, remote) {

  }
}

