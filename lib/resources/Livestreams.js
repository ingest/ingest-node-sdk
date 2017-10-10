'use strict'

const Resource = require('../core/Resource')
const Utils = require('../core/Utils')

/**
 * Livestream Resource
 *
 * @class
 * @extends Resource
 */
class Livestreams extends Resource {
  /**
   * @constructor
   */
  constructor () {
    const overrides = {
      resource: 'live',
      status: '/<%=resource%>/<%=id%>/status',
      deleteMethods: {
        'end': '?end=1'
      }
    }
    super(overrides)
  }

  /**
   * Return a list of the requested livestreams for the network.
   *
   * @param  {object}   headers  - Object representing headers to apply to the request.
   * @param  {string}   status   - The status you wish to get for live streams
   * @param  {Function} callback - (optional) Called when the request is complete.
   *
   * @return {Function|Promise}  - Calls a callback if one was provided, otherwise it returns a promise
   */
  getAll (headers, status, callback) {
    let options

    let url = Utils.parseTokens(this.config.all, {
      resource: this.config.resource
    })

    // If there is a status
    if (status) {
      if (typeof status !== 'string') {
        const error = new Error('IngestSDK Livestreams.getAll requires a valid status to be passed as a string.')
        return this._handleInputError(error, callback)
      }

      url = url + '?status=' + status
    }

    options = {
      url,
      headers
    }

    return this._sendRequest(options, callback)
  };

  /**
   * Gets a livestreams status
   *
   * @param  {string}   id       - Livestream id.
   * @param  {Function} callback - (optional) Called when the request is complete.
   *
   * @return {Function|Promise}  - Calls a callback if one was provided, otherwise it returns a promise.
   */
  getStatus (id, callback) {
    let url, options

    if (typeof id !== 'string') {
      const error = new Error('IngestSDK Livestream.getStatus requires a valid id passed as a string.')
      return this._handleInputError(error, callback)
    }

    url = Utils.parseTokens(this.config.status, {
      resource: this.config.resource,
      id: id
    })

    options = {
      url
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Delete/End a single livestream
   *
   * @param  {string}   id       - Livestream id.
   * @param  {boolean}  end      - A flag to end the stream instead of remove it
   * @param  {Function} callback - (optional) Called when the request is complete.
   *
   * @return {Function|Promise}  - Calls a callback if one was provided, otherwise it returns a promise.
   */
  delete (id, end, callback) {
    let options, url

    if (typeof id !== 'string') {
      const error = new Error('IngestSDK Livestream.delete requires a valid id passed as a string.')
      return this._handleInputError(error, callback)
    }

    url = Utils.parseTokens(this.config.byId, {
      resource: this.config.resource,
      id: id
    })

    if (end) {
      url += this.config.deleteMethods.end
    }

    options = {
      url,
      method: 'DELETE'
    }

    return this._sendRequest(options, callback)
  }
}

module.exports = new Livestreams()
