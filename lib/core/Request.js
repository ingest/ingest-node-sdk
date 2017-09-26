'use strict'

const request = require('request')
const Config = require('./Config')
const Utils = require('./Utils')

const VALID_RESPONSE_CODES = [200, 201, 202, 204]

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
   * This is for handling any errors
   *
   * @param {*} error
   */
  handleError (error) {
    return Promise.reject(error)
  }

  /**
   * Execute the open and send of the XMLHttpRequest
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

    if (this.options.data) {
      postData = this.preparePostData(this.options.data)

      // Use request's helper for JSON.
      if (postData.data && postData.type === 'JSON') {
        options.json = postData.json
      }
    }

    return new Promise((resolve, reject) => {
      request(options, this.requestComplete.bind(this, reject, resolve))
    })
  }

  /**
   * Stringify the post data if it is present.
   *
   * @param {*} data - Object to be parsed.
   */
  preparePostData (data) {
    const result = {
      success: true,
      data: data,
      type: null
    }

    if (data) {
      result.data = JSON.stringify(data)
      result.type = 'JSON'
    }
  }

  /**
   * Handle the completion of the request and fulfill the promise.
   *
   * @param {*} reject
   * @param {*} resolve
   * @param {*} error
   * @param {*} response - Response of the request.
   * @param {*} body
   */
  requestComplete (reject, resolve, error, response, body) {
    if (error) {
      return reject(error)
    }

    let result
    let validResponse = this.isValidResponseCode(response.statusCode)

    if (!validResponse) {
      return reject('Invalid response code.')
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
   * @param {*} response - Response data from request.
   * @param {*} body
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
   * @param {*} headers - Incoming headers object
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
   * @param {*} responseCode - Response Code.
   *
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
