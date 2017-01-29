const net = require('net')
const {actions} = require('./commands')

class SDCP {
  constructor(config, log = {debug: console.log}) {
    this.processing = false
    this.config = config
    this.queue = []
    this.log = log
  }

  setAction(command, data) {
    return this._addActionToQueue(actions.SET, command, data)
  }

  getAction(command, data) {
    return this._addActionToQueue(actions.GET, command, data)
  }

  _addActionToQueue(action, command, data) {
    const msg = this._createMessageAsHex(action, command, data)
    this.queue.push(msg)
    this._processActionQueue()
  }

  _processActionQueue() {
    if (this.processing) {
      return
    }

    this.processing = true

    return new Promise((resolve, reject) => {
      const mess = this.queue.shift()
      const client = new net.Socket()
      client.connect(this.config.port, this.config.address, () => {
        client.write(mess)
      })

      client.on('data', data => {
        this.log.debug('Received: ' + data)
        client.destroy() // kill client after server's response
      })

      client.on('error', function (data) {
        client.destroy() // kill client after error
        reject(data)
      })

      client.on('close', () => {
        this.processing = false
        if (this.queue.length > 0) {
          this._processActionQueue()
        }
      })
    })
  }

  _createMessageAsHex(action, command, data) {
    const VERSION = '02'
    const CATEGORY = '0A'
    const COMMUNITY = this.config.community || '534F4E59' // Default to 'SONY'
    if (typeof command !== 'string') {
      throw new Error(`Accepts command only as String (HEX) for now, was ${typeof command}`)
    }
    if (command.length !== 4) {
      throw new Error('Command must be 4 bytes long')
    }
    if (data && typeof data !== 'string') {
      throw new Error(`Accepts data only as String (HEX) for now, was ${typeof data}`)
    }
    const dataLength = ('00' + ((data || '').length / 2)).substr(-2)

    return this._hexStringToBuffer([VERSION, CATEGORY, COMMUNITY, action, command, dataLength, data || ''].join(''))
  }

  _hexStringToBuffer(message) {
    return Buffer.from(message, 'hex')
  }
}

const factory = function (config = {}) {
  return new SDCP(config)
}

module.exports = factory
