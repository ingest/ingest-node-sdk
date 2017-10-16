'use strict'

const Resource = require('../core/Resource')
const Utils = require('../core/Utils')

/**
 * Profiles Resource
 *
 * @class
 * @extends Resource
 */
class Profiles extends Resource {
  /**
   * @constructor
   */
  constructor () {
    const options = {
      resource: 'encoding/profiles'
    }
    super(options)
  }

  /**
   * Update an existing profile with new content.
   * @param  {object|array} resource  An object or an array of objects representing the profile to be updated.
   * @return {promise}                A promise which resolves when the request is complete.
   */
  update (resource, callback) {
    if (typeof resource !== 'object') {
      const error = new Error('IngestSDK Profiles update requires a resource to be passed as an object.')
      return this._handleInputError(error, callback)
    }

    const url = Utils.parseTokens(this.config.byId, {
      resource: this.config.resource,
      id: resource.id
    })

    const options = {
      url,
      method: 'PUT',
      data: resource
    }

    return this._sendRequest(options, callback)
  };
}

module.exports = new Profiles()
