'use strict'

const Resource = require('../core/Resource')

class Inputs extends Resource {
  constructor() {
    const options = {
      resource: 'encoding/inputs'
    }
    super(options)
  }
}

module.exports = new Inputs()
