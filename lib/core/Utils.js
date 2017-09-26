'use strict'

class Utils {
  /**
   * Parse the payload out of the JWT token.
   *
   * @param {*} token - JWT Token.
   */
  parseTokenPayload (token) {
    let parts, payload

    parts = token.split('.')
    payload = Buffer.from(parts[1], 'base64').toString()

    if (!token) {
      return null
    }

    // Return false if the token is invalid.
    if (parts.length <= 1) {
      return null
    }

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
   * @param {*} token - JWT Token.
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
