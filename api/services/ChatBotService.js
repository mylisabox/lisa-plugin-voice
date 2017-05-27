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
        options.state = 'on'
        break
      case 'VPL_OFF':
        options.state = 'off'
        break
      case 'VPL_RATIO':
        break
      case 'VPL_PRESET':
        break
      case 'VPL_INPUT':
        break
      default:
        return
    }

    const criteria = {}
    if (room) {
      criteria.roomId = room.id
    }

    return this.lisa.findDevices(criteria).then(devices => {
      const setStates = []
      devices.forEach(device => {
        setStates.push(this.plugin.services.ProjectorService.setState(device, options))
      })
      return Promise.all(setStates)
    })
  }
}

