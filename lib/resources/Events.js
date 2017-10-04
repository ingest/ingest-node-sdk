'use strict'

const Resource = require('../core/Resource')
const Utils = require('../core/Utils')

/**
 * Events Resource
 *
 * @class
 * @extends Resource
 */
class Events extends Resource {
  constructor () {
    const options = {
      resource: 'events',
      types: '/<%=resource%>/types'
    }
    super(options)
  }

  /**
   * Returns a list of the requested events for the current network
   *
   * @param {object}              headers      - The headers to apply to the request
   * @param {string}              filterStatus - A string of all the statuses to filter by, separated by commas
   * @param {string}              filterType   - A string of all the types to filter by, separated by commas
   *
   * @return {Promise | callback}
   */
  getAll (headers, filterStatus, filterType, callback) {

    let filterString = '';

    let url = Utils.parseTokens(this.config.all, {
      resource: this.config.resource
    })

    if (!headers) {
      headers = {}
    }

    if (filterStatus) {
      if (typeof filterStatus !== 'string') {
        const error = new Error('IngestSDK Events.getAll requires a valid filter status to be passed as a string.')
        return this._handleInputError(error)
      }

      filterString = '?filter=' + filterStatus;
    }

    if (filterType) {
      if (typeof filterType !== 'string') {
        const error = new Error('IngestSDK Events.getAll requires a valid filter type to be passed as a string.')
        return this._handleInputError(error)
      }

      if (!filterString) {
        filterString = '?resource=' + filterType;
      } else {
        filterString = filterString + '&resource=' + filterType;
      }
    }

    url += filterString;

    let options = {
      url,
      headers
    }

    return this._sendRequest(options, callback)
  };

  /**
   * Gets a list of all event types
   *
   * @return {Promise | callback}
   */
  getTypes (callback) {

    const url = Utils.parseTokens(this.config.types, {
      resource: this.config.resource
    })

    const options = {
      url
    }

    return this._sendRequest(options, callback)
  }
}

module.exports = new Events()
