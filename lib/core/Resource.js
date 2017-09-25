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
      version: 'application/vnd.ingest.v1+json',
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

  getAll (headers, callback) {
    // if only a callback is passed in
    if (typeof headers === 'function') {
      callback = headers
      headers = undefined
    }

    const useCallback = typeof (callback) === 'function'

    const url = utils.parseTokens(this.config.host + this.config.all, {
      resource: this.config.resource
    })

    const options = {
      url: url,
      headers: headers
    }

    const promise = Request(options)

    if (useCallback) {
      return promise.then(data => {
        return callback(null, data)
      }).catch(error => {
        return callback(error, null)
      })
    }

    return promise
  };

  getById (id, callback) {
    // This checks if the callback parameter is a function, if it is, we assume it's the intended callback.
    const useCallback = typeof (callback) === 'function'

    if (!id || typeof id !== 'string') {
      const error = new Error('IngestAPI Resource getById requires a valid id passed as a string.')

      if (useCallback) {
        // If useCallback is true, call the callback with our error and no data
        return callback(error, null)
      } else {
        // Otherwise return a promise that will immediately reject with our error.
        return Promise.reject(error)
      }
    }

    // Setup the request, parseToken doesnt exist yet
    const url = utils.parseTokens(this.config.host + this.config.byId, {
      resource: this.config.resource,
      id: id
    })

    const options = {
      url: url
    }

    const promise = new Request(options)

    if (useCallback) {
      // Attach the two parts of our callback to the `then` and `catch` of the promise for the request.
      promise.then(data => {
        // If the promise succeeds call the callback with the data and a null error field
        callback(null, data)
      }).catch(error => {
        // If the promise errors call the callback with null data and the error.
        callback(error, null)
      })

      return
    }

    // Otherwise return the promise
    return promise
  }

  getTrashed (headers, callback) {
    if (typeof headers === 'function') {
      callback = headers
      headers = undefined
    }

    const useCallback = typeof (callback) === 'function'

    const url = utils.parseTokens(this.config.host + this.config.trash, {
      resource: this.config.resource
    })

    const options = {
      url: url,
      headers: headers
    }

    const promise = Request(options)

    if (useCallback) {
      promise.then(data => {
        callback(null, data)
      }).catch(error => {
        callback(error, null)
      })

      return
    }

    return promise
  }

  getThumbnails (id, callback) {
    const useCallback = typeof (callback) === 'function'

    if (!id || typeof id !== 'string') {
      const error = new Error('IngestAPI Resource getById requires a valid id passed as a string')

      if (useCallback) {
        return callback(error, null)
      } else {
        return Promise.reject(error)
      }
    }

    const url = utils.parseTokens(this.config.host + this.config.thumbnails, {
      resource: this.config.resource,
      id: id
    })

    const options = {
      url: url
    }

    const promise = Request(options)

    if (useCallback) {
      promise.then(data => {
        callback(null, data)
      }).catch(error => {
        callback(error, null)
      })

      return
    }

    // Otherwise return the promise
    return promise
  }

  add (resource, callback) {
    const useCallback = typeof (callback) === 'function'

    if (!resource || typeof resource !== 'object') {
      const error = 'IngestAPI Resource add requires a resource passed in as an object.'
      if (useCallback) {
        return callback(error, null)
      } else {
        return Promise.reject(error)
      }
    }

    const url = utils.parseTokens(this.config.host + this.config.all, {
      resource: this.config.resource
    })

    const options = {
      url: url,
      method: 'POST',
      data: resource
    }

    const promise = Request(options)

    if (useCallback) {
      promise.then(data => {
        callback(null, data)
      }).catch(error => {
        callback(error, null)
      })

      return
    }

    // Otherwise return the promise
    return promise
  }

  update (resource, callback) {
    const useCallback = typeof (callback) === 'function'

    if (!resource || typeof resource !== 'object') {
      const error = 'IngestAPI Resource add requires a resource passed in as an object.'
      if (useCallback) {
        return callback(error, null)
      } else {
        return Promise.reject(error)
      }
    }

    // TODO: return to this!
    // if (Array.isArray(resource)) {
    //   return this._updateResourceArray(resource, callback);
    // } else {
    //   return this._updateResource(resource, callback);
    // }
  };

  _updateResource (resource, callback) {
    const useCallback = typeof (callback) === 'function'

    if (!resource || typeof resource !== 'object') {
      const error = 'IngestAPI Resource add requires a resource passed in as an object.'
      if (useCallback) {
        return callback(error, null)
      } else {
        return Promise.reject(error)
      }
    }

    const url = utils.parseTokens(this.config.host + this.config.byId, {
      resource: this.config.resource,
      id: resource.id
    })

    const options = {
      url: url,
      method: 'PATCH',
      data: resource
    }

    const promise = Request(options)

    if (useCallback) {
      promise.then(data => {
        callback(null, data)
      }).catch(error => {
        callback(error, null)
      })

      return
    }

    return promise
  };

  _updateResourceArray (resources, callback) {
    const useCallback = typeof (callback) === 'function'

    if (!resources || !Array.isArray(resources)) {
      const error = 'IngestAPI Resource _updateResourceArray requires resources to be passed as an array.'
      if (useCallback) {
        return callback(error, null)
      } else {
        return Promise.reject(error)
      }
    }

    const url = utils.parseTokens(this.config.host + this.config.all, {
      resource: this.config.resource
    })

    const options = {
      url: url,
      method: 'PATCH',
      data: resources
    }

    const promise = Request(options)

    if (useCallback) {
      promise.then(data => {
        callback(null, data)
      }).catch(error => {
        callback(error, null)
      })

      return
    }

    return promise
  };

  delete (resource, callback) {
    const useCallback = typeof (callback) === 'function'

    if (!resource) {
      const error = 'IngestAPI Resource delete requires a resource'
      if (useCallback) {
        callback(error, null)
      } else {
        Promise.reject(error)
      }
    }

    // TODO: check on this
    if (Array.isArray(resource)) {
      return this._deleteResourceArray(resource, false, callback)
    } else if (typeof resource === 'string') {
      return this._deleteResource(resource, false, callback)
    } else {
      const error = 'IngestAPI Resource delete requires a resource id as string, or an array of string id\'s.'

      if (useCallback) {
        callback(error, null)
      } else {
        Promise.reject(error)
      }
    }
  };

  permanentDelete (resource, callback) {
    const useCallback = typeof (callback) === 'function'

    if (!resource) {
      const error = 'IngestAPI Resource permanentDelete requires a resource.'
      if (useCallback) {
        return callback(error, null)
      } else {
        return Promise.reject(error)
      }
    }

    // TODO: check on this
    if (Array.isArray(resource)) {
      return this._deleteResourceArray(resource, true, callback)
    } else if (typeof resource === 'string') {
      return this._deleteResource(resource, true, callback)
    } else {
      const error = 'IngestAPI Resource permanentDelete requires a resource id as string, or an array of string id\'s.' //eslint-disable-line

      if (useCallback) {
        callback(error, null)
      } else {
        return Promise.reject(error)
      }
    }
  };

  _deleteResource (resource, permanent, callback) {
    const useCallback = typeof (callback) === 'function'

    if (typeof permanent !== 'boolean') {
      const error = 'IngestAPI Resource _deleteResource requires permanent to be passed as a boolean.'

      if (useCallback) {
        return callback(error, null)
      } else {
        return Promise.reject(error)
      }
    }

    if (!resource || typeof resource !== 'string') {
      const error = 'IngestAPI Resource _deleteResource requires a resource id passed as a string.'

      if (useCallback) {
        return callback(error, null)
      } else {
        return Promise.reject(error)
      }
    }

    let url = utils.parseTokens(this.config.host + this.config.byId, {
      resource: this.config.resource,
      id: resource
    })

    if (permanent === true) {
      url += this.config.deleteMethods.permanent
    }

    const options = {
      url: url,
      method: 'DELETE'
    }

    const promise = Request(options)

    if (useCallback) {
      promise.then(data => {
        callback(null, data)
      }).catch(error => {
        callback(error, null)
      })
      return
    }

    return promise
  };

  _deleteResourceArray (resources, permanent, callback) {
    const useCallback = typeof (callback) === 'function'

    if (typeof permanent !== 'boolean') {
      const error = 'IngestAPI Resource _deleteResourceArray requires permanent to be passed as a boolean.'
      if (useCallback) {
        return callback(error, null)
      } else {
        return Promise.reject(error)
      }
    }

    if (!resources || !Array.isArray(resources)) {
      const error = 'IngestAPI Resource _deleteResourceArray requires a resources to be passed as an array.'
      if (useCallback) {
        return callback(error, null)
      } else {
        return Promise.reject(error)
      }
    }

    let url = utils.parseTokens(this.config.host + this.config.all, {
      resource: this.config.resource
    })

    if (permanent === true) {
      url += this.config.deleteMethods.permanent
    }

    const options = {
      url: url,
      method: 'DELETE',
      data: resources
    }

    const promise = Request(options)

    if (useCallback) {
      promise.then(data => {
        callback(null, data)
      }).catch(error => {
        callback(error, null)
      })
      return
    }

    return promise
  };

  search (input, headers, callback) {
    // Check to see if they've ommitted the headers object and only passed a callback.
    if (typeof headers === 'function') {
      callback = headers
      headers = undefined
    }

    const useCallback = typeof (callback) === 'function'

    if (!input || typeof input !== 'string') {
      const error = 'IngestAPI Resource search requires a search term to be passed as a string.'
      if (useCallback) {
        return callback(error, null)
      } else {
        return Promise.reject(error)
      }
    }

    const url = utils.parseTokens(this.config.host + this.config.search, {
      resource: this.config.resource,
      input: input
    })

    const options = {
      url: url,
      headers: headers
    }

    const promise = Request(options)

    if (useCallback) {
      promise.then(data => {
        return callback(null, data)
      }).catch(error => {
        return callback(error, null)
      })

      return
    }

    return promise
  };

  count (callback) {
    const useCallback = typeof (callback) === 'function'

    const url = utils.parseTokens(this.config.host + this.config.all, {
      resource: this.config.resource
    })

    const options = {
      url: url,
      method: 'HEAD'
    }

    const promise = Request(options)

    if (useCallback) {
      promise.then(data => {
        return callback(null, data)
      }).catch(error => {
        return callback(error, null)
      })

      return
    }

    return promise
  };

  trashCount (callback) {
    const useCallback = typeof (callback) === 'function'

    const url = utils.parseTokens(this.config.host + this.config.trash, {
      resource: this.config.resource
    })

    const options = {
      url: url,
      method: 'HEAD'
    }

    const promise = Request(options)

    if (useCallback) {
      promise.then(data => {
        return callback(null, data)
      }).then(error => {
        return callback(error, null)
      })
      return
    }

    return promise
  };
}

module.exports = Resource
