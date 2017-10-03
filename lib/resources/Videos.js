'use strict'

const Resource = require('../core/Resource')
const extend = require('extend')
const Utils = require('../core/Utils')

/**
 * Videos Resource
 *
 * @param {object} options - SDK Options.
 * @class
 * @extends Resource
 */
class Videos extends Resource {
  constructor () {
    const overrides = {
      resource: 'videos',
      variants: '/<%=resource%>/<%=id%>/variants',
      publish: '/<%=resource%>/publish',
      thumbnail: '/<%=resource%>/<%=id%>/thumbnail',
      thumbnails: '/<%=resource%>/<%=id%>/thumbnails',
      deleteThumbnail: '/<%=resource%>/<%=id%>/thumbnail/<%=thumbnailId%>'
    }

    super(overrides)
  }

  /**
   * Return a list of the requested videos for the current user and network.
   * @param   {object}      headers        Object representing headers to apply to the request.
   * @param   {string}      status
   * @param   {Function}    callback       (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}            Calls a callback if one was provide, otherwise returns a promise
   */
  getAll (headers, status, callback) {
    let options
    let url = Utils.parseTokens(this.config.all, {
      resource: this.config.resource
    })

    if (!headers) {
      headers = {}
    }

    if (status) {
      if (typeof status === 'function') {
        callback = status
        status = ''
      }

      if (typeof status !== 'string') {
        const error = new Error('IngestSDK Videos.getAll requires a valid status to be passed as a string.')
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
   * Get all of the variants for the supplied video id.
   * @param   {string}            id             Video id.
   * @param   {Function}          callback       (Optional) Callback to be called when the request is complete.
   * @return  {function|Promise}                 Calls a callback if one was provide, otherwise returns a promise
   */
  getVariants (id, callback) {
    if (typeof id !== 'string') {
      const error = new Error('IngestSDK Resource getVariants requires a valid video id passed as a string.')
      return this._handleInputError(error)
    }

    let url = Utils.parseTokens(this.config.variants, {
      resource: this.config.resource,
      id: id
    })

    const options = {
      url: url
    }

    return this._sendRequest(options, callback)
  };

  publish (ids, callback) {
    if (!Array.isArray(ids) || ids.length === 0) {
      const error = new Error('IngestSDK Videos publish requires an array of ids to be passed in.')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.publish, {
      resource: this.config.resource
    })

    const options = {
      url,
      method: 'POST',
      data: ids
    }

    return this._sendRequest(options, callback)
  };

  count (status, _private, callback) {
    let isStatusSet = false

    let url = Utils.parseTokens(this.config.all, {
      resource: this.config.resource
    })

    // If there is a status and it is a string, use it as the status filter.
    if (status) {
      if (typeof status !== 'string') {
        const error = new Error('IngestSDK Videos count requires a valid status to be passed as a string.')
        return this._handleInputError(error)
      }

      url += '?status=' + status
      isStatusSet = true
    }

    // If private videos were requested, add the `private` query parameter to the url.
    if (_private === true) {
      // If a status has been set, then we need to append the next parameter with '&'.
      if (isStatusSet) {
        url += '&'
      } else {
        url += '?'
      }

      url += 'private=true'
    }

    const options = {
      url,
      method: 'HEAD'
    }

    return this._sendRequest(options, callback)
  };

    /**
   * Retrieve all thumbnails for a provided resource id.
   * @param   {string}    id        ID of the resource to retrieve thumbnails for.
   * @param   {Function}  callback  (Optional) Callback to be called when the request is complete.
   *
   * @return {function|Promise}     Calls a callback if one was provide, otherwise returns a promise
   */
  getThumbnails (id, callback) {
    if (!id || typeof id !== 'string') {
      const error = new Error('IngestAPI Video getThumbnails requires a valid id passed as a string')
      return this._handleInputError(error, callback)
    }

    const url = Utils.parseTokens(this.config.thumbnails, {
      resource: this.config.resource,
      id: id
    })

    const options = {
      url
    }

    return this._sendRequest(options, callback)
  }

  /**
 * Add external images to the resource id.
 * @param   {string}          id      ID of the resource to add the external thumbnails to.
 * @param   {string|array}    images  A path to the image, or an array of image paths.
 * @return  {promise}                 A promise which resolves when the request is complete.
 */
  addExternalThumbnails (id, images, callback) {
    let imagesToAdd = []

    if (typeof id !== 'string') {
      const error = new Error('IngestSDK PlaybackContent addExternal requires an id to be passed as a string.')
      return this._handleInputError(error)
    }

    // Early return if the types do not match what we are expecting.
    if (!Array.isArray(images) && typeof images !== 'string') {
      const error = new Error('IngestSDK Video addExternal requires images as a string or an array of strings.')
      return this._handleInputError(error)
    }

    if (Array.isArray(images)) {
      imagesToAdd = images
    } else {
      imagesToAdd.push(images)
    }

    let url = Utils.parseTokens(this.config.thumbnails, {
      resource: this.config.resource,
      id: id
    })

    const options = {
      method: 'POST',
      url,
      data: imagesToAdd
    }

    return this._sendRequest(options, callback)
  };

  uploadThumbnail (id, image, callback) {
    if (typeof id !== 'string') {
      const error = new Error('IngestSDK PlaybackContent uploadThumbnail requires an id to be passed as a string.')
      return this._handleInputError(error)
    }

    // Early return if the types do not match what we are expecting.
    if (!image || !(image instanceof File) || !utils.isImage(image)) {
      const error = new Error('IngestSDK PlaybackContent uploadThumbnail requires a valid image.')
      return this._handleInputError(error)
    }

    let url = Utils.parseTokens(this.config.thumbnail, {
      resource: this.config.resource,
      id: id
    })

    // Create a new FormData object so the request is properly sent as multipart.
    let formData = new FormData()
    formData.append('image', image)

    const options = {
      method: 'POST',
      url,
      data: formData
    }

    return this._sendRequest(options, callback)
  };

  deleteThumbnail (id, thumbnailId, callback) {
    if (typeof id !== 'string') {
      const error = new Error('IngestSDK PlaybackContent deleteThumbnail requires an id to be passed as a string.')
      return this._handleInputError(error)
    }

    if (typeof thumbnailId !== 'string') {
      const error = new Error('IngestSDK PlaybackContent deleteThumbanil requires a thumbnailId to be passed as a string.')
      return this._handleInputError(error)
    }

    const url = Utils.parseTokens(this.config.deleteThumbnail, {
      resource: this.config.resource,
      id: id,
      thumbnailId: thumbnailId
    })

    const options = {
      method: 'DELETE',
      url: url
    }

    return this._sendRequest(options, callback)
  };
}

module.exports = new Videos()
