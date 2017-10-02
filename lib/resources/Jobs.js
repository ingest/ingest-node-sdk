'use strict'

const Resource = require('../core/Resource')

class Jobs extends Resource {
  constructor () {
    const options = {
      resource: 'encoding/jobs'
    }
    super(options)
  }
}

module.exports = new Jobs()
