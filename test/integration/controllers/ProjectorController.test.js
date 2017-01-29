'use strict'
/* global describe, it */

const assert = require('assert')

describe('ProjectorController', () => {
  it('should exist', () => {
    assert(global.app.packs.pluginsManager.plugins['sonyVpl'].controllers['ProjectorController'])
  })
})
