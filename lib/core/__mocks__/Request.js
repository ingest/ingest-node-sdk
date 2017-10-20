'use strict'

/* See here: https://github.com/facebook/jest/issues/2726 for more information
   about why the mocks folder is placed here */
class RequestMock {
  constructor (options) {
    let activeRequest
    let wrapper = {}
    wrapper.request = new Promise((resolve, reject) => {
      activeRequest = options.pass ? resolve(options.data) : reject(options.data)
    })

    wrapper.cancel = () => {
      activeRequest.abort()
    }
    return wrapper
  }
}
module.exports = RequestMock
