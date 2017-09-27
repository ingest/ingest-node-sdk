'use strict'

const Resource = require('../core/Resource')

class Videos extends Resource {
  constructor() {
    const options = {
      resource: 'videos'
    }
    super(options)
  }
}

module.exports = new Videos()
