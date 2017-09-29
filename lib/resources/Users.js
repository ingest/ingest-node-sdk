'use strict'

const Resource = require('../core/Resource')

class Users extends Resource {
  constructor() {
    const options = {
      resource: 'user'
    }
    super(options)
  }
}

module.exports = new Users()
