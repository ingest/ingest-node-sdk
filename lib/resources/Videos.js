'use strict'

const Resource = require('../core/Resource')

class Videos extends Resource {

  constructor () {
    super();
  }

  getAllVideos (headers, callback) {
    this.response = new Request({
      url: 'https://api.ingest.info/videos/8c48ee0b-3c25-4011-8482-c9263835af37'
    })

    if (callback) {
      return this.response.then((response) => {
        return callback(null, response)
      }, (error) => {
        return callback(error)
      })
    }

    return this.response
  }
}

module.exports = new Videos()
