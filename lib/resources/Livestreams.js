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
      resource: '/live',
      status: '/<%=resource%>/<%=id%>/status',
      end: '/<%=resource%>/<%=id%>/stop'
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
   * Ends a livestream
   *
   * @param {string} id        - The id of the livestream to end
   * @param {string} streamKey - The streamKey for the livestream you wish to end
   *
   * @return {promise} A promise which resolves when the request is complete.
   */
  end (id, streamKey, callback) {
    let options, url

    if (typeof id !== 'string' || typeof streamKey !== 'string') {
      const error = new Error('IngestSDK Livestream.end requires a valid id and stream key passed as a string.')
      return this._handleInputError(error, callback)
    }

    url = Utils.parseTokens(this.config.end, {
      resource: this.config.resource,
      id: id
    })

    options = {
      url: url,
      method: 'POST',
      data: {
        stream_key: streamKey
      }
    }

    return this._sendRequest(options, callback)
  }
}

module.exports = new Livestreams()
