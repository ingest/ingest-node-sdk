'use strict'

const request = require('request')
const Config = require('./Config')
const Utils = require('./Utils')

const VALID_RESPONSE_CODES = [200, 201, 202, 204]

/**
 * Request Class handles storing and setting all request options for the SDK
 *
 * @param {object} options - The options that are passed in for the request.
 *
 * @class
 *
 * @TODO(mt): Assign this.request to = cb
 */
class Request {
  constructor (options, cb) {
    let defaults = {
      version: Config.getVersion(),
      token: Config.getToken(),
      method: 'GET',
      headers: {},
      ignoreAcceptHeader: false
    }

    if (!cb) {
      throw new Error('IngestAPI requires a callback to be passed in')
    }

    if (!options || typeof options !== 'object') {
      return this.handleError('IngestAPI Request options are required', cb)
    }

    if (!options.url) {
      return this.handleError('IngestAPI Request options requires a url to make the request', cb)
    }

    if (!defaults.token) {
      return this.handleError('IngestSDK requires a token to be set prior to use', cb)
    }

    // If there is a token present ensure that it's still valid.
    if (Utils.isExpired(defaults.token)) {
      return this.handleError('IngestAPI Request options requires a valid token', cb)
    }

    this.options = Object.assign({}, defaults, options)

    return this.makeRequest(cb)
  }

  /**
   * Handles errors.
   *
   * @param {string} error - The error message to send.
   *
   * @return {Promise} - Returns a rejected promise.
   */
  handleError (message, cb) {
    const error = {
      statusCode: 400,
      headers: {},
      message: message
    }

    cb(error, null)
  }

  /**
   * Sets up and makes a new request with the passed in options.
   *
   * @return {Promise} - Returns a promise.
   */
  makeRequest (cb) {
    let headers, postData, options
    headers = this.prepareHeaders(this.options.headers)
    if (typeof headers.authorization === 'undefined') {
      headers.authorization = this.options.token
    }

    if (!this.options.ignoreAcceptHeader) {
      headers.accept = this.options.version
    }

    options = {
      headers,
      method: this.options.method,
      url: this.options.url
    }

    if (this.options.data) {
      postData = this.preparePostData(this.options.data, cb)
      // Use request's helper for JSON.
      if (postData.data && postData.type === 'JSON') {
        options.body = postData.data
      }
    }

    if (this.options.formData) {
      options.formData = this.options.formData
    }

    request(options, this.requestComplete.bind(this, cb))
  }

  /**
   * Stringify the post data if it is present.
   *
   * @param {object} data - Object to be parsed.
   *
   * @return {object|Promise} - Returns an object if successful, returns promise if parsing fails.
   */
  preparePostData (data, cb) {
    let result = {
      success: true,
      data: data || null,
      type: null
    }

    if (data) {
      try {
        result.data = JSON.stringify(data)
        result.type = 'JSON'
      } catch (e) {
        return this.handleError('Error parsing JSON', cb)
      }
    }

    return result
  }

  /**
   * Handle the completion of the request and fulfill the promise.
   *
   * @param {function} cb - The callback.
   * @param {string} error - The error message returned from the API.
   * @param {object|null} response - The response headers and status
   * @param {*} body - The response data from the server
   *
   * @return {Promise} - Rejects the promise if invalid, resolves if it's valid.
   */
  requestComplete (cb, error, response, body) {
    if (error) {
      return cb(error, null)
    }

    let result
    let validResponse = this.isValidResponseCode(response.statusCode)

    if (!validResponse) {
      cb(null,
        {
          statusMessage: response.statusMessage,
          statusCode: response.statusCode,
          headers: response.headers,
          message: 'Invalid Response Code'
        })
    }

    result = this.processResponse(response, body)

    if (result instanceof Error) {
      return cb(result, null)
    } else {
      return cb(null, result)
    }
  }

  /**
   * Process the response and parse certain content types.
   *
   * @param {object|null} response - The response headers and status
   * @param {*} body - The response data from the server
   *
   * @return {error|object} - Returns an error if we are unable to parse the response. Returns an object with the response data otherwise.
   */
  processResponse (response, body) {
    let responseType = response.headers['content-type']
    let result = body

    if (responseType && (responseType.indexOf('application/json') !== -1 || responseType.indexOf(Config.getVersion()) !== -1)) {
      if (body && body.length > 0) {
        try {
          result = JSON.parse(body)
        } catch (error) {
          return new Error('JSON parsing failed. ' + error.stack)
        }
      }
    }

    return {
      data: result,
      headers: response.headers,
      statusCode: response.statusCode
    }
  }

  /**
   * Normalize the headers so that they are all sent lowercase.
   *
   * @param {object} headers - Incoming headers object.
   *
   * @return {object} - Returns an object.
   */
  prepareHeaders (headers) {
    let keys = Object.keys(headers)
    let result = {}
    let key = ''
    let i = ''

    for (i = 0; i < keys.length; i++) {
      key = keys[i]
      result[key.toLowerCase()] = headers[key]
    }

    return result
  }

  /**
   * Validate the current response code to see if the request was a success.
   *
   * @param {string} responseCode - Response Code.
   *
   * @return {boolean} result - Whether or not the response code is valid.
   */
  isValidResponseCode (responseCode) {
    let result = false
    let i = ''

    for (i = 0; i < VALID_RESPONSE_CODES.length; i++) {
      if (responseCode === VALID_RESPONSE_CODES[i]) {
        result = true
        break
      }
    }

    return result
  }

  /**
   * Cancel the current XHR request.
   */
  cancel () {
    request.abort()
  }
}

module.exports = Request
