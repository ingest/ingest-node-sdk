'use strict'

const Resource = require('../core/Resource')
const Utils = require('../core/Utils')

/**
 * Jobs Resource
 *
 * @class
 * @extends Resource
 */
class Jobs extends Resource {
  /**
   * @constructor
   */
  constructor () {
    const options = {
      resource: 'encoding/jobs',
      progress: '/<%=resource%>/<%=id%>/progress'
    }
    super(options)
  }

  /**
   * Creates a new encoding job.
   * @param   {object}           resource     The resource to be added
   * @param   {Function}         callback     (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}               Calls a callback if one was provide, otherwise returns a promise
   */
  add (resource, callback) {
    if (typeof resource !== 'object') {
      const error = new Error('IngestSDK Jobs `add` requires a resource passed as an object.')
      return this._handleInputError(error, callback)
    }

    const url = Utils.parseTokens(this.config.all, {
      resource: this.config.resource
    })

    const options = {
      url,
      method: 'POST',
      data: resource
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Gets the progress of a current encoding job
   *
   * @param  {string}               id    The id of the job
   * @return {function|Promise}           Calls a callback if one was provide, otherwise returns a promise
   */
  progress (id, callback) {
    if (typeof id !== 'string') {
      const error = new Error('IngestSDK Jobs `progress` requires `jobId` to be passed as a string.')
      return this._handleInputError(error, callback)
    }

    const url = Utils.parseTokens(this.config.progress, {
      resource: this.config.resource,
      id: id
    })

    const options = {
      url,
      method: 'GET'
    }

    return this._sendRequest(options, callback)
  }
}

module.exports = new Jobs()
