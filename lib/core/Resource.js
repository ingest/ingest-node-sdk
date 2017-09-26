'use strict'

const Request = require('./Request')
const utils = require('./Utils')

class Resource {
  constructor (options) {
    if (options) {
      this.options = options
    } else {
      this.options = {}
    }

    this.defaults = {
      host: 'https://api.ingest.io',
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

  _handleInputError (error, callback) {
    const useCallback = typeof (callback) === 'function'

    if (useCallback) {
      return callback(error, null)
    } else {
      return Promise.reject(error)
    }
  }

  getAll (headers, callback) {
    // if only a callback is passed in
    if (typeof headers === 'function') {
      callback = headers
      headers = undefined
    }

    let url = utils.parseTokens(this.config.host + this.config.all, {
      resource: this.config.resource
    })
    // TODO: this is temporary url to see if it's working!
    url = 'https://api.ingest.info/videos/e8db22e1-62fd-41ac-941e-38939b7b96bf';

    const options = {
      url,
      headers,
      token: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovLyouaW5nZXN0LmluZm8iLCJjaWQiOiJJbmdlc3REYXNoYm9hcmQiLCJleHAiOjE1MDY0NTIwMDksImp0aSI6IjRjZDI0Mjk4LTk3ZmQtNDc1MS04ZmJlLWQ0ZGVkMTFhZjFjZiIsImlhdCI6MTUwNjM2NTYwOSwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbmdlc3QuaW5mbyIsIm50dyI6IjE0Y2Y4Y2U4LTZlOGUtNDIzZi1hOTJiLTgzM2NkMjExZmM3NCIsInNjb3BlIjp7ImFjdGlvbnMiOlsicGVyc29uYWwiLCJyZWFkX2JpbGxpbmciLCJyZWFkX2NsaWVudHMiLCJyZWFkX2V2ZW50cyIsInJlYWRfaG9va3MiLCJyZWFkX2lucHV0cyIsInJlYWRfam9icyIsInJlYWRfbGl2ZSIsInJlYWRfbmV0S2V5cyIsInJlYWRfbmV0d29ya3MiLCJyZWFkX3Byb2ZpbGVzIiwicmVhZF91c2VycyIsInJlYWRfdmlkZW9zIiwid3JpdGVfYmlsbGluZyIsIndyaXRlX2NsaWVudHMiLCJ3cml0ZV9ob29rcyIsIndyaXRlX2lucHV0cyIsIndyaXRlX2pvYnMiLCJ3cml0ZV9saXZlIiwid3JpdGVfbG9ja2VkX3Byb2ZpbGVzIiwid3JpdGVfbmV0S2V5cyIsIndyaXRlX25ldHdvcmtzIiwid3JpdGVfcHJvZmlsZXMiLCJ3cml0ZV91c2VycyIsIndyaXRlX3ZpZGVvcyJdfSwic3ViIjoiNjg3Mjc1YzItYWVlNS00N2QyLWI1Y2UtZmUzMjZlMmU0MTcwIn0.ZoXiVWs-JBv5Saxx8NJCkehWytTL6Rod0Y9x6Tya6lvoNNaxQvJQI3OtlU4BF8I8mC2hMb9LgmCuxwj0tQEfYrvt5E4LYSZUG0OgrlAu4SHSw7_If8X-zgDIxfuQsA1rJ50btywzWdx56UUdv_GU5W5tWKYD4v5LFIpimP6NLIB5O-B_OGvmBTpVcJVqL0kgfW_c4V4HWBw2diAffoC7o40gMhvfFpFLDaZoVcFo0dfBd6XPJzgl-M3VdLJI26_tCQwigMWFT4lKRNIDeKw9ASS4Slj9zM9er1Z1PkS_H_ajKwtipzX-uS5oQ7B0IpFsmafk9k4tbcLdwDIEPdBQ6Q'
    }

    _sendRequest(options, callback)
  };

  getById (id, callback) {

    if (!id || typeof id !== 'string') {
      const error = new Error('IngestAPI Resource getById requires a valid id passed as a string.')
      return _handleInputError(error, callback)
    }

    // Setup the request, parseToken doesnt exist yet
    const url = utils.parseTokens(this.config.host + this.config.byId, {
      resource: this.config.resource,
      id: id
    })

    const options = {
      url
    }

    _sendRequest(options, callback)
  }

  getTrashed (headers, callback) {
    if (typeof headers === 'function') {
      callback = headers
      headers = undefined
    }

    const url = utils.parseTokens(this.config.host + this.config.trash, {
      resource: this.config.resource
    })

    const options = {
      url,
      headers
    }

    _sendRequest(options, callback);
  }

  getThumbnails (id, callback) {
    if (!id || typeof id !== 'string') {
      const error = new Error('IngestAPI Resource getById requires a valid id passed as a string')
      return _handleInputError(error, callback)
    }

    const url = utils.parseTokens(this.config.host + this.config.thumbnails, {
      resource: this.config.resource,
      id: id
    })

    const options = {
      url
    }

    _sendRequest(options, callback);
  }

  add (resource, callback) {
    if (!resource || typeof resource !== 'object') {
      const error = 'IngestAPI Resource add requires a resource passed in as an object.'
      return _handleInputError(error, callback)
    }

    const url = utils.parseTokens(this.config.host + this.config.all, {
      resource: this.config.resource
    })

    const options = {
      url,
      method: 'POST',
      data: resource
    }

    _sendRequest(options, callback);
  }

  update (resource, callback) {
    if (!resource || typeof resource !== 'object') {
      const error = 'IngestAPI Resource add requires a resource passed in as an object.'
      return _handleInputError(error, callback)
    }

    if (Array.isArray(resource)) {
      const updateResourceArray = this._updateResourceArray(resource, callback);
      return updateResourceArray
    }

    return this._updateResource(resource, callback);

  };

  _updateResource (resource, callback) {
    if (!resource || typeof resource !== 'object') {
      const error = 'IngestAPI Resource add requires a resource passed in as an object.'
      return _handleInputError(error, callback)
    }

    const url = utils.parseTokens(this.config.host + this.config.byId, {
      resource: this.config.resource,
      id: resource.id
    })

    const options = {
      url,
      method: 'PATCH',
      data: resource
    }

    _sendRequest(options, callback);
  };

  _updateResourceArray (resources, callback) {
    if (!resources || !Array.isArray(resources)) {
      const error = 'IngestAPI Resource _updateResourceArray requires resources to be passed as an array.'
      return _handleInputError(error, callback)
    }

    const url = utils.parseTokens(this.config.host + this.config.all, {
      resource: this.config.resource
    })

    const options = {
      url,
      method: 'PATCH',
      data: resources
    }

    _sendRequest(options, callback);
  };

  delete (resource, callback) {
    if (!resource) {
      const error = 'IngestAPI Resource delete requires a resource'
      return _handleInputError(error, callback)
    }

    if (Array.isArray(resource)) {
      return this._deleteResourceArray(resource, false, callback)
    } else if (typeof resource === 'string') {
      return this._deleteResource(resource, false, callback)
    } else {
      const error = 'IngestAPI Resource delete requires a resource id as string, or an array of string id\'s.'
      return _handleInputError(error, callback)
    }
  };

  permanentDelete (resource, callback) {
    if (!resource) {
      const error = 'IngestAPI Resource permanentDelete requires a resource.'
      return _handleInputError(error, callback)
    }

    if (Array.isArray(resource)) {
      return this._deleteResourceArray(resource, true, callback)
    } else if (typeof resource === 'string') {
      return this._deleteResource(resource, true, callback)
    } else {
      const error = 'IngestAPI Resource permanentDelete requires a resource id as string, or an array of string id\'s.' //eslint-disable-line
      return _handleInputError(error, callback)
    }
  };

  _deleteResource (resource, permanent, callback) {

    if (typeof permanent !== 'boolean') {
      const error = 'IngestAPI Resource _deleteResource requires permanent to be passed as a boolean.'
      return _handleInputError(error, callback)
    }

    if (!resource || typeof resource !== 'string') {
      const error = 'IngestAPI Resource _deleteResource requires a resource id passed as a string.'
      return _handleInputError(error, callback)
    }

    let url = utils.parseTokens(this.config.host + this.config.byId, {
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

    _sendRequest(options, callback);
  };

  _deleteResourceArray (resources, permanent, callback) {
    if (typeof permanent !== 'boolean') {
      const error = 'IngestAPI Resource _deleteResourceArray requires permanent to be passed as a boolean.'
      return _handleInputError(error, callback)
    }

    if (!resources || !Array.isArray(resources)) {
      const error = 'IngestAPI Resource _deleteResourceArray requires a resources to be passed as an array.'
      return _handleInputError(error, callback)
    }

    let url = utils.parseTokens(this.config.host + this.config.all, {
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

    _sendRequest(options, callback);
  };

  search (input, headers, callback) {
    if (typeof headers === 'function') {
      callback = headers
      headers = undefined
    }

    if (!input || typeof input !== 'string') {
      const error = 'IngestAPI Resource search requires a search term to be passed as a string.'
      return _handleInputError(error, callback)
    }

    const url = utils.parseTokens(this.config.host + this.config.search, {
      resource: this.config.resource,
      input: input
    })

    const options = {
      url,
      headers
    }

    _sendRequest(options, callback);
  };

  count (callback) {
    const url = utils.parseTokens(this.config.host + this.config.all, {
      resource: this.config.resource
    })

    const options = {
      url,
      method: 'HEAD'
    }

    _sendRequest(options, callback);
  };

  trashCount (callback) {
    const url = utils.parseTokens(this.config.host + this.config.trash, {
      resource: this.config.resource
    })

    const options = {
      url,
      method: 'HEAD'
    }

    _sendRequest(options, callback);
  };
}

module.exports = Resource
