'use strict'
const Resource = require('../core/Resource')

class Video extends Resource {
  constructor () {
    super()
    console.log('Video is being constructed')
  }
}

module.exports = Video
