'use strict'
/* global describe, it */

const assert = require('assert')

describe('Projector bot', () => {
  let service, ChatBot
  before(() => {
    service = global.app.services.ChatBotService
    ChatBot = global.app.orm.ChatBot
  })

  it('should exist', () => {
    return ChatBot.find({
      where: {
        name: 'projector'
      }
    }).then(chatbot => {
      assert(chatbot)
      assert.equal(chatbot.name, 'projector')
      assert.equal(chatbot.displayName, 'SONY VPL projectors')
      assert(chatbot.data)
    })
  })

  it('should return correct answer', () => {
    return service.interact(1, 'fr', 'allume le projecteur').then(infos => {
      assert(infos)
      assert.equal(infos.action, 'VPL_ON')
      assert.equal(infos.botId, 'projector')
      assert.equal(infos.lang, 'fr')
    }).then(() => {
      return service.interact(1, 'en', 'turn on the projector').then(infos => {
        assert(infos)
        assert.equal(infos.action, 'VPL_ON')
        assert.equal(infos.botId, 'projector')
        assert.equal(infos.lang, 'en')
      })
    }).then(() => {
      return service.interact(1, 'en', 'turn the projector on').then(infos => {
        assert(infos)
        assert.equal(infos.action, 'VPL_ON')
        assert.equal(infos.botId, 'projector')
        assert.equal(infos.lang, 'en')
      })
    }).then(() => {
      return service.interact(1, 'en', 'turn off the projector').then(infos => {
        assert(infos)
        assert.equal(infos.action, 'VPL_OFF')
        assert.equal(infos.botId, 'projector')
        assert.equal(infos.lang, 'en')
      })
    }).then(() => {
      return service.interact(1, 'en', 'turn the projector off').then(infos => {
        assert(infos)
        assert.equal(infos.action, 'VPL_OFF')
        assert.equal(infos.botId, 'projector')
        assert.equal(infos.lang, 'en')
      })
    })
  })

})
