'use strict'

/**
 * Config Class handles storing and setting all config options for the SDK
 *
 * @class
 */
class Config {
  constructor () {
    this._defaults = {
      token: null,
      host: 'https://api.ingest.io',
      version: ''
    }

    // Set my defaults
    this.setOptions({})
  }

  /**
   * Sets all the options by merging with the defaults
   *
   * @param {object} options - An options object to be merged with the default config
   */
  setOptions (options) {
    if (!options || options !== Object(options)) {
      throw new Error('Config::setOptions requires an object to be passed in')
    }

    this.options = Object.assign({}, this._defaults, options)
  }

  /**
   * Sets the token only
   *
   * @param {string} token - The token to set
   */
  setToken (token) {
    if (!token || typeof token !== 'string') {
      throw new Error('Config::SetToken requires a token to be passed in as a string')
    }

    this.options.token = token
  }

  /**
   * Sets the host only
   *
   * @param {string} host - The host to set
   */
  setHost (host) {
    if (!host || typeof host !== 'string') {
      throw new Error('Config::SetToken requires a host to be passed in as a string')
    }

    this.options.host = host
  }

  /**
   * Sets the version of the API the SDK will use
   *
   * @param {string} version - The version to use for the SDK
   */
  setVersion (version) {
    if (!version || typeof version !== 'string') {
      throw new Error('Config::setVersion requires a version to be passed in as a string')
    }

    this.options.version = version
  }

  /**
   * Gets the token
   *
   * @return {string} - The token that is configured
   */
  getToken () {
    return this.options.token
  }

  /**
   * Gets the host
   *
   * @return {string} - The host that is configured
   */
  getHost () {
    return this.options.host
  }

  /**
   * Gets the version
   *
   * @return {string} - The version that is configured
   */
  getVersion () {
    return this.options.version
  }
}

// Export it as a new so we can utilize the npm caching
module.exports = new Config()
