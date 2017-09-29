'use strict'

const Resource = require('../core/Resource')

class Livestreams extends Resource {
  constructor() {
    const options = {
      resource: 'live'
    }
    super(options)
  }
}

module.exports = new Livestreams()
