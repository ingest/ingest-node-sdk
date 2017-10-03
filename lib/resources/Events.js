'use strict'

const Resource = require('../core/Resource')

class Events extends Resource {
  constructor () {
    const options = {
      resource: 'events'
    }
    super(options)
  }
}

module.exports = new Events()
