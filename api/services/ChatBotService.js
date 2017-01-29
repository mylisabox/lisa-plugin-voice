'use strict'

const Service = require('lisa-plugin').Service

/**
 * @module ChatBotService
 * @description ChatBot service
 */
module.exports = class ChatBotService extends Service {
  interact(action, infos) {
    const room = infos.fields.room
    const options = {}
    switch (action) {
      case 'VPL_ON':
        break
      case 'VPL_OFF':
        break
      case 'VPL_RATIO':
        break
      case 'VPL_PRESET':
        break
      case 'VPL_INPUT':
        break
    }
    return this.lisa.findDevices({
      roomId: room.id
    }).then(devices => {
      const setStates = []
      devices.forEach(device => {
        setStates.push(this.plugin.services.ProjectorService.setState(device, options))
      })
      return Promise.all(setStates)
    })
  }
}

