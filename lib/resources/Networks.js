'use strict'

const Resource = require('../core/Resource')

class Networks extends Resource {
  constructor() {
    const options = {
      resource: 'network'
    }
    super(options)
  }
}

module.exports = new Networks()
