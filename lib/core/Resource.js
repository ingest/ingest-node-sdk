'use strict'

const Request = require('./Request')
const utils = require('./Utils')
/**
 * Resource Object
 *
 * @class
 */
class Resource {
  /**
   * @constructor
   * @param  {} options
   */
  constructor (options) {
    if (options) {
      this.options = options
    } else {
      this.options = {}
    }

    this.defaults = {
      all: '/<%=resource%>',
      byId: '/<%=resource%>/<%=id%>',
      thumbnails: '/<%=resource%>/<%=id%>/thumbnails',
      trash: '/<%=resource%>?filter=trashed',
      deleteMethods: {
        'permanent': '?permanent=1'
      },
      search: '/<%=resource%>?search=<%=input%>',
      resource: null
    }

    this.config = Object.assign({}, this.defaults, this.options)
  }
  /**
   * @param {object}    options  - The options to attach to the request
   * @param {Function}  callback - Callback to be called when the request is complete.
   *
   * @return {function|Promise}  - Calls a callback if one was provide, otherwise returns a promise
   */
  _sendRequest(options, callback) {
    const useCallback = typeof (callback) === 'function'

    const promise = new Request(options)

    if (useCallback) {
      return promise.then(data => {
        return callback(null, data)
      }).catch(error => {
        return callback(error, null)
      })
    }

    return promise
  }
  /**
   * Handles parameter input errors
   * @param   {object}    error     The error object with error message
   * @param   {Function}  callback  Callback to be called when the request is complete.
   *
   * @return {function|Promise} - Calls a callback with the error message if one was provide, otherwise returns a rejected promise
   */
  _handleInputError (error, callback) {
    const useCallback = typeof (callback) === 'function'

    if (useCallback) {
      return callback(error, null)
    } else {
      return Promise.reject(error)
    }
  }

  /**
 * Return a list of the requested resource for the current user and network.
 * @param   {object}      headers        Object representing headers to apply to the request.
 * @param   {Function}    callback       (Optional) Callback to be called when the request is complete.
 *
 * @return {function|Promise}            Calls a callback if one was provide, otherwise returns a promise
 */
  getAll (headers, callback) {
    // if only a callback is passed in
    if (typeof headers === 'function') {
      callback = headers
      headers = undefined
    }

    let url = utils.parseTokens(this.config.all, {
      resource: this.config.resource
    })

    const options = {
      url,
      headers
    }

    return this._sendRequest(options, callback)
  };

  /**
   * Return a resource that matches the supplied id.
   * @param   {string}    id        Resource id.
   * @param   {Function}  callback  (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  getById (id, callback) {

    if (!id || typeof id !== 'string') {
      const error = new Error('IngestAPI Resource getById requires a valid id passed as a string.')
      return this._handleInputError(error, callback)
    }

    // Setup the request, parseToken doesnt exist yet
    const url = utils.parseTokens(this.config.byId, {
      resource: this.config.resource,
      id: id
    })

    const options = {
      url
    }

    return this._sendRequest(options, callback)
  }

  /**
   * Return the resources currently in the trash.
   * @param   {object}    headers   Headers to be passed along with the request for pagination.
   * @param   {Function}  callback  (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  getTrashed (headers, callback) {
    if (typeof headers === 'function') {
      callback = headers
      headers = undefined
    }

    const url = utils.parseTokens(this.config.trash, {
      resource: this.config.resource
    })

    const options = {
      url,
      headers
    }

    return this._sendRequest(options, callback);
  }

  /**
   * Retrieve all thumbnails for a provided resource id.
   * @param   {string}    id        ID of the resource to retrieve thumbnails for.
   * @param   {Function}  callback  (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  getThumbnails (id, callback) {
    if (!id || typeof id !== 'string') {
      const error = new Error('IngestAPI Resource getById requires a valid id passed as a string')
      return this._handleInputError(error, callback)
    }

    const url = utils.parseTokens(this.config.thumbnails, {
      resource: this.config.resource,
      id: id
    })

    const options = {
      url
    }

    return this._sendRequest(options, callback);
  }

  /**
   * Add a new resource.
   * @param   {object}    resource  An object representing the resource to add.
   * @param   {Function}  callback  (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  add (resource, callback) {
    if (!resource || typeof resource !== 'object') {
      const error = 'IngestAPI Resource add requires a resource passed in as an object.'
      return this._handleInputError(error, callback)
    }

    const url = utils.parseTokens(this.config.all, {
      resource: this.config.resource
    })

    const options = {
      url,
      method: 'POST',
      data: resource
    }

    return this._sendRequest(options, callback);
  }

  /**
   * Update an existing resource with new content.
   * @param   {object|array}  resource  An object or an array of objects representing the resource(s) to be updated.
   * @param   {Function}      callback  (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  update (resource, callback) {
    if (!resource || typeof resource !== 'object') {
      const error = 'IngestAPI Resource add requires a resource passed in as an object.'
      return this._handleInputError(error, callback)
    }

    if (Array.isArray(resource)) {
      const updateResourceArray = this._updateResourceArray(resource, callback);
      return updateResourceArray
    }

    return this._updateResource(resource, callback);

  };

  /**
   * Update a single resource.
   * @private
   * @param   {object}    resource  An object representing the resource to update.
   * @param   {Function}  callback  (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  _updateResource (resource, callback) {
    if (!resource || typeof resource !== 'object') {
      const error = 'IngestAPI Resource add requires a resource passed in as an object.'
      return this._handleInputError(error, callback)
    }

    const url = utils.parseTokens(this.config.byId, {
      resource: this.config.resource,
      id: resource.id
    })

    const options = {
      url,
      method: 'PATCH',
      data: resource
    }

    return this._sendRequest(options, callback);
  };

  /**
   * Update an array of resources.
   * @private
   * @param   {array}     resources   An array of resource objects to be updated.
   * @param   {Function}  callback    (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  _updateResourceArray (resources, callback) {
    if (!resources || !Array.isArray(resources)) {
      const error = 'IngestAPI Resource _updateResourceArray requires resources to be passed as an array.'
      return this._handleInputError(error, callback)
    }

    const url = utils.parseTokens(this.config.all, {
      resource: this.config.resource
    })

    const options = {
      url,
      method: 'PATCH',
      data: resources
    }

    return this._sendRequest(options, callback);
  };

  /**
   * Delete an existing resource
   * @param   {object | array}  resource    The id, or an array of ids for the resource(s) to be deleted.
   * @param   {Function}        callback    (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  delete (resource, callback) {
    if (!resource) {
      const error = 'IngestAPI Resource delete requires a resource'
      return this._handleInputError(error, callback)
    }

    if (Array.isArray(resource)) {
      return this._deleteResourceArray(resource, false, callback)
    } else if (typeof resource === 'string') {
      return this._deleteResource(resource, false, callback)
    } else {
      const error = 'IngestAPI Resource delete requires a resource id as string, or an array of string id\'s.'
      return this._handleInputError(error, callback)
    }
  };

  /**
   * Permanently delete an existing resource.
   * @param   {object | array}  resource    The id, or an array of ids for the resource(s) to be deleted.
   * @param   {Function}        callback    (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  permanentDelete (resource, callback) {
    if (!resource) {
      const error = 'IngestAPI Resource permanentDelete requires a resource.'
      return this._handleInputError(error, callback)
    }

    if (Array.isArray(resource)) {
      return this._deleteResourceArray(resource, true, callback)
    } else if (typeof resource === 'string') {
      return this._deleteResource(resource, true, callback)
    } else {
      const error = 'IngestAPI Resource permanentDelete requires a resource id as string, or an array of string id\'s.' //eslint-disable-line
      return this._handleInputError(error, callback)
    }
  };

  /**
   * Delete a single resource
   * @private
   * @param   {object}      resource    The id of the resource to be deleted.
   * @param   {boolean}     permanent   A flag to permanently delete each video.
   * @param   {Function}    callback    (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  _deleteResource (resource, permanent, callback) {

    if (typeof permanent !== 'boolean') {
      const error = 'IngestAPI Resource _deleteResource requires permanent to be passed as a boolean.'
      return this._handleInputError(error, callback)
    }

    if (!resource || typeof resource !== 'string') {
      const error = 'IngestAPI Resource _deleteResource requires a resource id passed as a string.'
      return this._handleInputError(error, callback)
    }

    let url = utils.parseTokens(this.config.byId, {
      resource: this.config.resource,
      id: resource
    })

    if (permanent === true) {
      url += this.config.deleteMethods.permanent
    }

    const options = {
      url,
      method: 'DELETE'
    }

    return this._sendRequest(options, callback);
  };

  /**
   * Delete an array of resources
   * @private
   * @param  {array}     resources  An array of resource objects to be deleted.
   * @param  {boolean}   permanent  A flag to permanently delete each video.
   * @param  {Function}  callback   (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  _deleteResourceArray (resources, permanent, callback) {
    if (typeof permanent !== 'boolean') {
      const error = 'IngestAPI Resource _deleteResourceArray requires permanent to be passed as a boolean.'
      return this._handleInputError(error, callback)
    }

    if (!resources || !Array.isArray(resources)) {
      const error = 'IngestAPI Resource _deleteResourceArray requires a resources to be passed as an array.'
      return this._handleInputError(error, callback)
    }

    let url = utils.parseTokens(this.config.all, {
      resource: this.config.resource
    })

    if (permanent === true) {
      url += this.config.deleteMethods.permanent
    }

    const options = {
      url,
      method: 'DELETE',
      data: resources
    }

    return this._sendRequest(options, callback);
  };

  /**
   * Return a subset of items that match the search terms.
   * @param   {string}    input     The search terms to match against.
   * @param   {object}    headers   The headers to be passed to the request.
   * @param   {Function}  callback  (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  search (input, headers, callback) {
    if (typeof headers === 'function') {
      callback = headers
      headers = undefined
    }

    if (!input || typeof input !== 'string') {
      const error = 'IngestAPI Resource search requires a search term to be passed as a string.'
      return this._handleInputError(error, callback)
    }

    const url = utils.parseTokens(this.config.search, {
      resource: this.config.resource,
      input: input
    })

    const options = {
      url,
      headers
    }

    return this._sendRequest(options, callback);
  };

  /**
   * Get the total count of resources.
   * @param   {Function}  callback  (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  count (callback) {
    const url = utils.parseTokens(this.config.all, {
      resource: this.config.resource
    })

    const options = {
      url,
      method: 'HEAD'
    }

    return this._sendRequest(options, callback);
  };

  /**
   * Get the total count of resources in the trash.
   * @param   {Function}  callback  (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  trashCount (callback) {
    const url = utils.parseTokens(this.config.trash, {
      resource: this.config.resource
    })

    const options = {
      url,
      method: 'HEAD'
    }

    return this._sendRequest(options, callback);
  };
}

module.exports = Resource
