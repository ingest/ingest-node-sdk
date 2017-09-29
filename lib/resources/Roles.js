'use strict'

const Resource = require('../core/Resource')

class Roles extends Resource {
  constructor() {
    const options = {
      resource: 'roles'
    }
    super(options)
  }
}

module.exports = new Roles()
