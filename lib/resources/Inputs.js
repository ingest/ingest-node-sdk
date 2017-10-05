'use strict'

const Resource = require('../core/Resource')

/**
 * Inputs Resource
 *
 * @param {object} options - SDK Options.
 * @class
 * @extends Resource
 */
class Inputs extends Resource {

  constructor () {
    const overrides = {
      resource: ResourceTypes.INPUTS,
      allWithFilters: '/<%=resource%>?filter=<%=filterChain%>',
      searchWithFilters: '/<%=resource%>?search=<%=input%>&filter=<%=filterChain%>'
    }

    super(options)
  }

  /**
   * Return a list of Inputs for the current user and network.
   *
   * @param  {object} headers - Object representing headers to apply to the request.
   * @param  {Array}  filters - [Optional] A list of filters to send along with the request to return Inputs that match the criteria.
   * @param  {Function} callback - (optional) Called when the request is complete.
   *
   * @return {Function|Promise}  - Calls a callback if one was provided, otherwise it returns a promise
   */
  getAll(headers, filters, callback) {
    let options, url, urlTemplate

    tokens = { resource: this.config.resource };
    urlTemplate = this.config.all

    // If there are filters, join them as a comma seperated string and update our tokens and url template.
    if (Array.isArray(filters) && filters.length > 0) {
      tokens.filterChain = filters.join(',') //???
      urlTemplate = this.config.allWithFilters
    }

    url = Utils.parseTokens(urlTemplate, tokens)

    options = {
      url,
      headers: headers
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Return a subset of Inputs that match the search terms.
   *
   * @param  {string} input   - The search terms to match against.
   * @param  {object} headers - The headers to be passed to the request.
   * @param  {Array}  filters - [Optional] A list of filters to send along with the request to return Inputs that match the criteria.
   * @param  {Function} callback - (optional) Called when the request is complete.
   *
   * @return {Function|Promise}  - Calls a callback if one was provided, otherwise it returns a promise
   */
  search(input, headers, filters, callback) {
    let url, options, urlTemplate, tokens

    if (typeof input !== 'string') {
      const error = new Error('IngestSDK Inputs search requires search input to be passed as a string.')
      return this._handleInputError(error, callback)
    }

    tokens = { resource: this.config.resource, input: encodeURIComponent(input) };
    urlTemplate = this.config.search

    // If there are filters, join them as a comma seperated string and update our tokens and url template.
    if (Array.isArray(filters) && filters.length > 0) {
      tokens.filterChain = filters.join(',') //???
      urlTemplate = this.config.searchWithFilters
    }

    url = Utils.parseTokens(urlTemplate)

    options = {
      url,
      headers: headers
    }

    return this._sendRequest(options, callback)
  }
}

module.exports = new Inputs()
