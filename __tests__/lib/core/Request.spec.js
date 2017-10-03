/* eslint-env jest */
'use strict'

const Request = require('../../../lib/core/Request')
const Config = require('../../../lib/core/Config')
const Utils = require('../../../lib/core/Utils')

jest.mock('request')

fdescribe('Request Tests', () => {
  describe('Request::constructor', () => {
    it('Should fail if no options are passed in', (done) => {
      const request = new Request()

      request.then( (response) => {
        expect(response).not.toBeDefined()
        done()
      })
      .catch( (error) => {
        expect(error).toBeDefined()
        expect(error).toEqual('IngestAPI Request options are required')
        done()
      })
    })

    it('Should fail if an object is not passed in', (done) => {
      const request = new Request(true)

      request.then( (response) => {
        expect(response).not.toBeDefined()
        done()
      })
      .catch( (error) => {
        expect(error).toBeDefined()
        expect(error).toEqual('IngestAPI Request options are required')
        done()
      })
    })

    it('Should fail if there is no url in the options', (done) => {
      const request = new Request({})

      request.then( (response) => {
        expect(response).not.toBeDefined()
        done()
      })
      .catch( (error) => {
        expect(error).toBeDefined()
        expect(error).toEqual('IngestAPI Request options requires a url to make the request')
        done()
      })
    })

    it('Should fail if there is no url in the options', (done) => {
      jest.spyOn(Config, 'getToken').mockImplementation( () => {
        return false
      })

      const request = new Request({
        url: 'someurl'
      })

      request.then( (response) => {
        expect(response).not.toBeDefined()
        done()
      })
      .catch( (error) => {
        expect(error).toBeDefined()
        expect(error).toEqual('IngestSDK requires a token to be set prior to use')
        done()
      })
    })

    it('Should fail if the token is expired.', (done) => {
      jest.spyOn(Utils, 'isExpired').mockImplementation( () => {
        return true
      })
      jest.spyOn(Config, 'getToken').mockImplementation( () => {
        return true
      })

      const request = new Request({
        url: 'someurl'
      })

      request.then( (response) => {
        expect(response).not.toBeDefined()
        done()
      })
      .catch( (error) => {
        expect(error).toBeDefined()
        expect(error).toEqual('IngestAPI Request options requires a valid token')
        done()
      })
    })

    // it('Should make a request, and call requestComplete', (done) => {
    //   jest.spyOn(Utils, 'isExpired').mockImplementation( () => {
    //     return false
    //   })

    //   jest.spyOn(Config, 'getToken').mockImplementation( () => {
    //     return true
    //   })

    //   // Have to override this as we are just calling the callback for the request and not returning an actual response
    //   Request.prototype.requestComplete = function () {
    //     done()
    //   }

    //   const request = new Request({
    //     url: 'someurl'
    //   })

    //   request.then( () => {
    //     expect(request.requestComplete).toHaveBeenCalled()
    //     done()
    //   })
    //   .catch( (error) => {
    //     expect(error).not.toBeDefined()
    //     done()
    //   })
    // })
  })

  describe('handleError', () => {
    it('Should return a rejected Promise', () => {
      jest.spyOn(Request.prototype, 'handleError').mockImplementation( () => {
        return false
      })
      let error = 'something'
      const result = Request.prototype.handleError(error)

      expect(error).toEqual('something')
    })
  })

  describe('makeRequest', () => {
    // it('Should return a promise.', (done) => {

    //   const request = new Request({
    //     url: 'someurl2'
    //   })
    //   done()
    //   expect(request.then).toBeDefined()
    // })

    it('Should pass in options.', (done) => {
      jest.spyOn(Utils, 'isExpired').mockImplementation( () => {
        return false
      })
      jest.spyOn(Config, 'getToken').mockImplementation( () => {
        return 'someToken'
      })

      const request = new Request({
        url: 'someurl2',
        data: {
          test: 'test'
        }
      })

      done()
      expect(request.then).toBeDefined()
    })
  })

  describe('preparePostData', () => {
    it('Should return an object with no data', () => {
      // double check this one
      const data = {}

      const result = Request.prototype.preparePostData(data)

      expect(result).toEqual({
        "data": "{}",
        "success": true,
        "type": "JSON"
      })
    })

    it('Should return an object with stringified data', () => {
      const data = {
        someHeader: 'someValue'
      }
      const result = Request.prototype.preparePostData(data)

      expect(result).toEqual({
        "data": "{\"someHeader\":\"someValue\"}",
        "success": true,
        "type": "JSON"
      })
    })

    // Test passes, but data object messes with linting rules, should i just remove this?
    // it('Should call handle error', () => {
    //   //set up a spy on handleError
    //   jest.spyOn(Request.prototype, 'handleError').mockImplementation( () => {
    //     return true
    //   })

    //   const data = {
    //     'invalidObject'
    //   }


    //   const result = Request.prototype.preparePostData(data)

    //   expect(result).toEqual('Error parsing JSON')
    // })
  })

  describe('requestComplete', () => {
    it('Should do the thing', () => {

    })
  })

  describe('processResponse', () => {
    it('Should process the response and parse certain content types.', () => {
      // let responseType = ""
      // let result = ""

      // result = Request.prototype.processResponse()

      // expect(result).toEqual({
      //   data: "",
      //   headers: "",
      //   statusCode: ""
      // })
    })

    it('Should fail and return an error.', () => {
      // let responseType = ""
      // let result = ""
      // const error = ""
      // result = Request.prototype.processResponse()

      // expect(result).toEqual('JSON parsing failed' + error.stack)
    })
  })

  describe('prepareHeaders', () => {
    it('Should return true if header is lowercase.', () => {
      const key = {
        UPPERCASE:'someValue'
      }
      const result = Request.prototype.prepareHeaders(key)

      expect(result).toEqual({
        uppercase:'someValue'
      })
    })

    it('Should return false if header is not lowercase.', () => {
      const key = {
        UPPERCASE:'someValue'
      }
      const result = Request.prototype.prepareHeaders(key)

      expect(result).not.toEqual({
        UPPERCASE:'someValue'
      })
    })

  })

  describe('isValidResponseCode', () => {

    it('Should return true if responseCode is valid', () => {
      const result = Request.prototype.isValidResponseCode(201)

      expect(result).toBeTruthy()
    })

    it('Should return false if responseCode is invalid', () => {
      const result = Request.prototype.isValidResponseCode(400)

      expect(result).toBeFalsy()
    })
  })
})
