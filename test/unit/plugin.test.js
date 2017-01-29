'use strict'
/* global describe, it */

const assert = require('assert')

describe('Plugin', () => {
  let plugin
  before(() => {
    plugin = global.app.packs.pluginsManager.plugins['sonyVpl']
  })

  it('should exist', () => {
    assert(plugin)
  })

  it('should have service', () => {
    assert(plugin.services)
    assert(plugin.services.ProjectorService)
  })


})
