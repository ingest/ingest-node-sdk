'use strict'

const Resource = require('../core/Resource')
const Utils = require('../core/Utils')

/**
 * Roles Resource
 *
 * @class
 * @extends Resource
 */
class Roles extends Resource {
  /**
   * @constructor
   */
  constructor () {
    const options = {
      resource: 'roles'
    }
    super(options)
  }

  /**
   * Update an existing role with new content.
   * @param  {object|array}     resource  An object or an array of objects representing the role(s) to be updated.
   * @return {function|Promise}           Calls a callback if one was provide, otherwise returns a promise
   */
  update (resource, callback) {
    if (typeof resource !== 'object') {
      const error = new Error('IngestSDK Roles update requires a role to be passed as an object.')
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

module.exports = new Roles()
