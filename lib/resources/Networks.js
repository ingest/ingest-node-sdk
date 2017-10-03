'use strict'

const Resource = require('../core/Resource')

class Networks extends Resource {
  constructor () {
    const options = {
      resource: 'networks'
    }
    super(options)
  }
}

module.exports = new Networks()
