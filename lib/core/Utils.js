'use strict'

/**
 * Utils Class handles storing and setting all util options for the SDK
 *
 * @class
 */
class Utils {
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
    exp = data.exp

    now = new Date()

    now = now.getTime() / 1000

    if (!data) {
      return result
    }

    if (!exp) {
      return result
    }

    if (now < exp) {
      result = false
    }

    return result
  }
}

module.exports = new Utils()
