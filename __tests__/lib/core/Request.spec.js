/* eslint-env jest */
'use strict'

const Request = require('../../../lib/core/Request')
const Config = require('../../../lib/core/Config')
const Utils = require('../../../lib/core/Utils')

describe('Request Tests', () => {
  // describe('Request::constructor', () => {
  //   it('Should return an error message if options are not passed in', function () {
  //     const request = new Request()
  //     request.catch((err) => {
  //       expect(err.message).toMatch(/IngestAPI Request options are required/)
  //     })
  //   })

  //   it('Should return an error message if options are not an object', function () {
  //     const request = new Request('options')
  //     request.catch((err) => {
  //       expect(err.message).toMatch(/IngestAPI Request options are required/)
  //     })
  //   })

  //   it('Should return an error message if a url is not passed in the options', function () {
  //     const options = {
  //       token: 'test'
  //     }
  //     const request = new Request(options)
  //     request.catch((err) => {
  //       expect(err.message).toMatch(/IngestAPI Request options requires a url to make the request/)
  //     })
  //   })

  //   it('Should return an error message if a token is not set', function () {
  //     jest.spyOn(Config, 'getToken').mockImplementation(() => {
  //       return false
  //     })

  //     const options = {
  //       url: 'someUrl'
  //     }

  //     const request = new Request(options)
  //     request.catch((err) => {
  //       expect(err.message).toMatch(/IngestSDK requires a token to be set prior to use/)
  //     })
  //   })

  //   it('Should return an error message if a token is not valid', function () {
  //     jest.spyOn(Config, 'getToken').mockImplementation(() => {
  //       return true
  //     })

  //     jest.spyOn(Utils, 'isExpired').mockImplementation(() => {
  //       return true
  //     })

  //     const options = {
  //       url: 'someUrl'
  //     }

  //     const request = new Request(options)
  //     request.catch((err) => {
  //       expect(err.message).toMatch(/IngestAPI Request options requires a valid token/)
  //     })
  //   })

  //   it('Should return call makeRequest if all params are valid', function () {
  //     jest.spyOn(Config, 'getToken').mockImplementation(() => {
  //       return true
  //     })

  //     jest.spyOn(Utils, 'isExpired').mockImplementation(() => {
  //       return false
  //     })

  //     jest.spyOn(Request.prototype, 'makeRequest').mockImplementation(() => {
  //       return true
  //     })

  //     const options = {
  //       url: 'someUrl'
  //     }

  //     const request = new Request(options)
  //     expect(request.makeRequest).toHaveBeenCalled()
  //   })
  // })

  // describe('handleError', () => {
  //   it('Should return a rejected Promise', () => {
  //     jest.spyOn(Request.prototype, 'handleError').mockImplementation( () => {
  //       return false
  //     })
  //     let error = 'something'
  //     const result = Request.prototype.handleError(error)

  //     expect(error).toEqual('something')
  //   })
  // })

  describe('makeRequest', () => {
    it('Should return a promise when called.', (done) => {
      const originalMakeRequest = Request.prototype.makeRequest

      jest.spyOn(Request.prototype, 'makeRequest').mockImplementation(() => {
        return true
      })

      jest.spyOn(Config, 'getToken').mockImplementation(() => {
        return true
      })

      jest.spyOn(Utils, 'isExpired').mockImplementation(() => {
        return false
      })

      const request = new Request({
        url: 'someUrl',
        headers: {},
        data: {
          test: "test"
        }
      })

      jest.spyOn(request, 'prepareHeaders').mockImplementation(() => {
        return {}
      })

      jest.spyOn(request, 'preparePostData').mockImplementation(() => {
        return true
      })

      originalMakeRequest.call(request).then(() => {
        done()
      }).catch((err) => {
        done()
      })

      expect(request.prepareHeaders).toHaveBeenCalled()
      expect(request.preparePostData).toHaveBeenCalled()
    })

    // it('Should call preparePostData if data option is passed in.', (done) => {
    //   jest.spyOn(Utils, 'isExpired').mockImplementation( () => {
    //     return false
    //   })
    //   jest.spyOn(Config, 'getToken').mockImplementation( () => {
    //     return 'someToken'
    //   })

    //   jest.spyOn(Request.prototype, 'preparePostData').mockImplementation( () => {
    //     return {}
    //   })

    //   const request = new Request({
    //     url: 'someurl2',
    //     data: {
    //       test: 'test'
    //     }
    //   })

    //   done()
    //   expect(request.preparePostData).toHaveBeenCalled()
    // })
  })

  // describe('preparePostData', () => {
  //   it('Should return an object with no data', () => {
  //     // double check this one
  //     const data = {}

  //     const result = Request.prototype.preparePostData(data)

  //     expect(result).toEqual({
  //       "data": "{}",
  //       "success": true,
  //       "type": "JSON"
  //     })
  //   })

  //   it('Should return an object with stringified data', () => {
  //     const data = {
  //       someHeader: 'someValue'
  //     }
  //     const result = Request.prototype.preparePostData(data)

  //     expect(result).toEqual({
  //       "data": "{\"someHeader\":\"someValue\"}",
  //       "success": true,
  //       "type": "JSON"
  //     })
  //   })

  //   // Test passes, but data object messes with linting rules, should i just remove this?
  //   // it('Should call handle error', () => {
  //   //   //set up a spy on handleError
  //   //   jest.spyOn(Request.prototype, 'handleError').mockImplementation( () => {
  //   //     return true
  //   //   })

  //   //   const data = {
  //   //     'invalidObject'
  //   //   }

  //   //   const result = Request.prototype.preparePostData(data)

  //   //   expect(result).toEqual('Error parsing JSON')
  //   // })
  // })

  // describe('requestComplete', () => {
  //   it('Should do the thing', () => {

  //   })
  // })

  // describe('processResponse', () => {
  //   it('Should process the response and parse certain content types.', () => {
  //     // let responseType = ""
  //     // let result = ""

  //     // result = Request.prototype.processResponse()

  //     // expect(result).toEqual({
  //     //   data: "",
  //     //   headers: "",
  //     //   statusCode: ""
  //     // })
  //   })

  //   it('Should fail and return an error.', () => {
  //     // let responseType = ""
  //     // let result = ""
  //     // const error = ""
  //     // result = Request.prototype.processResponse()

  //     // expect(result).toEqual('JSON parsing failed' + error.stack)
  //   })
  // })

  // describe('prepareHeaders', () => {
  //   it('Should return true if header is lowercase.', () => {
  //     const key = {
  //       UPPERCASE:'someValue'
  //     }
  //     const result = Request.prototype.prepareHeaders(key)

  //     expect(result).toEqual({
  //       uppercase:'someValue'
  //     })
  //   })

  //   it('Should return false if header is not lowercase.', () => {
  //     const key = {
  //       UPPERCASE:'someValue'
  //     }
  //     const result = Request.prototype.prepareHeaders(key)

  //     expect(result).not.toEqual({
  //       UPPERCASE:'someValue'
  //     })
  //   })

  // })

  // describe('isValidResponseCode', () => {

  //   it('Should return true if responseCode is valid', () => {
  //     const result = Request.prototype.isValidResponseCode(201)

  //     expect(result).toBeTruthy()
  //   })

  //   it('Should return false if responseCode is invalid', () => {
  //     const result = Request.prototype.isValidResponseCode(400)

  //     expect(result).toBeFalsy()
  //   })
  // })
})
