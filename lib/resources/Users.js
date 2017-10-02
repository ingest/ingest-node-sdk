'use strict'

const Resource = require('../core/Resource')

class Users extends Resource {
  constructor () {
    const options = {
      resource: 'users'
    }
    super(options)
  }
}

module.exports = new Users()
