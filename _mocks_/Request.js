'use strict'

class RequestMock {
  constructor (options) {
    let activeRequest
    let wrapper = {}

    wrapper.request = new Promise((resolve, reject) => {
      activeRequest = {
        abort: function () {}
      }
      options.pass ? resolve(options.data) : reject(options.data)
    })

    wrapper.cancel = () => {
      activeRequest.abort()
    }

    return wrapper
  }
}

module.exports = RequestMock
