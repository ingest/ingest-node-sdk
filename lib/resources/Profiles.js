'use strict'

const Resource = require('../core/Resource')

class Profiles extends Resource {
  constructor() {
    const options = {
      resource: 'encoding/profiles'
    }
    super(options)
  }
}

module.exports = new Profiles()
