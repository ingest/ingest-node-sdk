'use strict'

/* See here: https://github.com/facebook/jest/issues/2726 for more information
   about why the mocks folder is placed here */
class RequestMock {
  constructor (options) {
    let wrapper = {}
    wrapper.request = new Promise((resolve, reject) => {
      options.pass ? resolve(options.data) : reject(options.data)
    })
    return wrapper
  }
}
module.exports = RequestMock
