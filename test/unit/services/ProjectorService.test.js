'use strict'
/* global describe, it */

const assert = require('assert')
const ProjectorService = require('../../../api/services/ProjectorService')

describe('ProjectorService', () => {
  let service
  before(() => {
    service = global.app.packs.pluginsManager.plugins['sonyVpl'].services.ProjectorService
  })

  it('should exist', () => {
    assert(service)
  })

})
