'use strict'

const Config = require('./Config')

/**
 * Utils Class handles storing and setting all util options for the SDK
 *
 * @class
 */
class Utils {
  /**
   * Replace all tokens within a given template based on the given key/value pair.
   * @param  {string}     template    Template for the url.
   * @param  {object}     hash        Key/Value pair for replacing tokens in the template.
   *
   * @return {string}                 Parsed string.
   */
  parseTokens (template, hash) {
    if (!template || !hash) {
      return null
    }

    let keys = Object.keys(hash)
    let i
    let length = keys.length

    const host = Config.getHost()

    template = host + template

    for (i = 0; i < length; i++) {
      template = template.replace('<%=' + keys[i] + '%>', hash[keys[i]])
    }

    return template
  };

  /**
   * Parse the payload out of the JWT token.
   *
   * @param {string} token - JWT Token.
   */
  parseTokenPayload (token) {
    let parts, payload

    if (!token) {
      return null
    }

    parts = token.split('.')

    // Return false if the token is invalid.
    if (parts.length <= 1) {
      return null
    }

    payload = Buffer.from(parts[1], 'base64').toString()

    try {
      payload = JSON.parse(payload)
    } catch (e) {
      payload = null
    }

    return payload
  }

  /**
   * Return true if the provided token has expired.
   *
   * @param {string} token - JWT Token.
   */
  isExpired (token) {
    let data, result, exp, now
    data = this.parseTokenPayload(token)
    result = true

    if (!data) {
      return result
    }

    exp = data.exp

    now = new Date()

    now = now.getTime() / 1000

    if (!exp) {
      return result
    }

    if (now < exp) {
      result = false
    }

    return result
  }

  /**
   * Wrapper function to wrap a value in either a reject or resolve.
   * @param  {boolean} state Rejection or Approval.
   * @param  {*}       value Value to pass back to the promise.
   * @return {Promise}       Promise/A+ spec promise.
   */
  promisify (state, value) {
    const promise = new Promise((resolve, reject) => {
      let _resolve = resolve
      let _reject = reject
    })

    // const promise = Promise

    promise(state, [value])

    return promise
  }

  /**
   * Return true if a file provided matches a support image type.
   * @param  {string}     contentType  A reference to an image file.
   * @return {Boolean}        True if the type matches a known image type.
   */
  isImage (contentType) {
    return contentType.indexOf('image') !== -1
  }
}

module.exports = new Utils()
