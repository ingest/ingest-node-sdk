'use strict';

/* See here: https://github.com/facebook/jest/issues/2726 for more information
   about why the mocks folder is placed here */
class RequestMock {

  constructor(options) {
    return new Promise((resolve, reject) => {
      options.pass ? resolve(options.data) : reject(options.data)
    });
  }

}
module.exports = RequestMock
