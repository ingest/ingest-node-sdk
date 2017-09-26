'use strict'

/*
  Hasn't testing posts, puts or patchs and has only tested with one url
*/

const request = require('request')
const config = require('./Config')


const VALID_RESPONSE_CODES = [200, 201, 202, 204]

class Request {
  constructor (options) {
    if (!options || typeof options !== 'object') {
      return this.handleError('IngestAPI Request options are required')
    }

    if (!options.token) {
      return this.handleError('IngestAPI Request options requires a token')
    }

    if (!options.url) {
      return this.handleError('IngestAPI Request options requires a url to make the request')
    }

    // If there is a token present ensure that it's still valid.
    // if (JWTUtils.isExpired(options.token)) {
    //   return this.handleError('IngestAPI Request options requires a valid token')
    // }

    let defaults = {
      version: 'application/vnd.ingest.v1+json',
      method: 'GET',
      headers: {}
    }

    this.options = Object.assign({}, defaults, options);

    return this.makeRequest();
  }

  handleError (error) {
    throw new Error(error)
    return new Promise( (resolve, reject) => {
      reject(error)
    })
  }

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
        options.json = postData.json;
      }
    }

    return new Promise( (resolve, reject) => {
      request(options, this.requestComplete.bind(this, reject, resolve))
    })
  }

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

  requestComplete (reject, resolve, error, response, body) {
    if (error) {
      return reject(new Error(error))
    }

    let result;
    let validResponse = this.isValidResponseCode(response.statusCode);

    if (!validResponse) {
      return reject(new Error('Invalid response code.'))
    }

    result = this.processResponse(response, body)

    if (result instanceof Error) {
      return reject(result)
    } else {
      return resolve(result)
    }
  }

  processResponse (response, body) {
    let responseType = response.headers['content-type']
    let result = body;

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

  prepareHeaders (headers) {
    let keys = Object.keys(headers);
    let result = {}
    let key = ''
    let i = ''

    for (i = 0; i  < keys.length; i++) {
      key = keys[i]
      result[key.toLowerCase()] = headers[key]
    }

    return result
  }

  isValidResponseCode (responseCode) {
    let result = false
    let i = ''

    for (i = 0; i <  VALID_RESPONSE_CODES.length; i++) {
      if (responseCode === VALID_RESPONSE_CODES[i]) {
        result = true
        break
      }
    }

    return result
  }
}

module.exports = Request
