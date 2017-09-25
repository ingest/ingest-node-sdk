'use strict'

const request = require('request')

class Request {
  constructor (options, callback) {
    console.log('here')

    this.options = options
    this.callback = callback

    this.makeRequest()
  }

  makeRequest () {
    let options = {
      method: 'GET'
    }

    request(options.url, options, this.requestComplete.bind(this))
  }

  requestComplete (response) {
    console.log('response', response)
    return response
  }
}

module.exports = Request
