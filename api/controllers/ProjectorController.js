'use strict'

const Controller = require('lisa-plugin').Controller

/**
 * @module ProjectorController
 * @description Generated Trails.js Controller.
 */
module.exports = class ProjectorController extends Controller {
  setProjectorState(device, key, newValue) {
    const options = {}
    options[key] = newValue
    return this.plugin.services.ProjectorService.setProjectorState(device, options)
  }
}

