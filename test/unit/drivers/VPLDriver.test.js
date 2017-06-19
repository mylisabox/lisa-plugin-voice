'use strict'
/* global describe, it */

const assert = require('assert')

describe('VplDriver', () => {
  let driver
  before(() => {
    driver = global.app.packs.pluginsManager.plugins['sonyVpl'].drivers.vpl
  })

  it('should exist', () => {
    assert(driver)
  })

})
