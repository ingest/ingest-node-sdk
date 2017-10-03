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
 */
class Request {
  constructor (options) {
    let defaults = {
      version: Config.getVersion(),
      token: Config.getToken(),
      method: 'GET',
      headers: {}
    }

    if (!options || typeof options !== 'object') {
      return this.handleError('IngestAPI Request options are required')
    }

    if (!options.url) {
      return this.handleError('IngestAPI Request options requires a url to make the request')
    }

    if (!defaults.token) {
      return this.handleError('IngestSDK requires a token to be set prior to use')
    }

    // If there is a token present ensure that it's still valid.
    if (Utils.isExpired(defaults.token)) {
      return this.handleError('IngestAPI Request options requires a valid token')
    }

    this.options = Object.assign({}, defaults, options)

    return this.makeRequest()
  }

  /**
   * Handles errors.
   *
   * @param {string} error - The error message to send.
   *
   * @return {Promise} - Returns a rejected promise.
   */
  handleError (error) {
    return Promise.reject(error)
  }

  /**
   * Sets up and makes a new request with the passed in options.
   *
   * @return {Promise} - Returns a promise.
   */
  makeRequest () {
    let headers, postData, options
    headers = this.prepareHeaders(this.options.headers)
    headers.authorization = this.options.token
    headers.accept = this.options.version

    options = {
      headers,
      method: this.options.method,
      url: this.options.url
    }
    console.log('options', this.options.data)
    if (this.options.data) {
      console.log('here')
      postData = this.preparePostData(this.options.data)
      // Use request's helper for JSON.
      if (postData.data && postData.type === 'JSON') {
        options.body = postData.data
      }
    }

    return new Promise((resolve, reject) => {
      request(options, this.requestComplete.bind(this, reject, resolve))
    })
  }

  /**
   * Stringify the post data if it is present.
   *
   * @param {object} data - Object to be parsed.
   *
   * @return {object|Promise} - Returns an object if successful, returns promise if parsing fails.
   */
  preparePostData (data) {
    let result = {
      success: true,
      data: data,
      type: null
    }

    if (data) {
      try {
        result.data = JSON.stringify(data)
        result.type = 'JSON'
      } catch (e) {
        return this.handleError('Error parsing JSON')
      }
    }

    return result
  }

  /**
   * Handle the completion of the request and fulfill the promise.
   *
   * @param {function} reject - The function used to reject the promise.
   * @param {function} resolve - The function used to resolve the promise.
   * @param {string} error - The error message returned from the API.
   * @param {object|null} response - The response headers and status
   * @param {*} body - The response data from the server
   *
   * @return {Promise} - Rejects the promise if invalid, resolves if it's valid.
   */
  requestComplete (reject, resolve, error, response, body) {
    if (error) {
      return reject(error)
    }

    let result
    let validResponse = this.isValidResponseCode(response.statusCode)
    if (!validResponse) {
      return reject({
        statusCode: response.statusCode,
        headers: response.headers,
        message: 'Invalid Response Code'
      })
    }

    result = this.processResponse(response, body)

    if (result instanceof Error) {
      return reject(result)
    } else {
      return resolve(result)
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

    if (responseType && responseType.indexOf('application/json') !== -1) {
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
}

module.exports = Request
