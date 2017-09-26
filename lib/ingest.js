'use strict'

const modules = require('./modules')
const resources = require('./resources')
const Config = require('./core/Config')

/**
 * Ingest Class
 *
 * @class
 */
class Ingest {
  constructor (options) {
    // If we passed in options, lets set them
    if (options) {
      Config.setOptions(options)
    }

    // Set my resources and modules on the Ingest Class
    Object.assign(this, resources, modules)
  }

  /**
   * Sets the token in the config
   *
   * @param {string} token
   */
  setToken (token) {
    Config.setToken(token)
  }
}

// Export my Ingest Class
module.exports = Ingest
