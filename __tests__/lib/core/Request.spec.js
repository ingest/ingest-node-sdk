/* eslint-env jest */
'use strict'

jest.mock('request', () => require('../../../_mocks_/RequestLibrary.js'))

const Request = require('../../../lib/core/Request')
const Config = require('../../../lib/core/Config')
const Utils = require('../../../lib/core/Utils')

describe('Request Tests', () => {
  describe('Request::constructor', () => {
    it('Should return an error message if options are not passed in', function () {
      const myRequest = new Request()

      myRequest.request.then((response) => {
        expect(response).not.toBeDefined()
      }).catch((err) => {
        expect(err).toBeDefined()
        expect(err.message).toMatch(/IngestAPI Request options are required/)
      })
    })

    it('Should return an error message if options are not an object', function () {
      const myRequest = new Request()

      myRequest.request.then((response) => {
        expect(response).not.toBeDefined()
      }).catch((err) => {
        expect(err).toBeDefined()
        expect(err.message).toMatch(/IngestAPI Request options are required/)
      })
    })

    it('Should return an error message if a url is not passed in the options', function () {
      const options = {
        token: 'test'
      }

      const myRequest = new Request(options)

      myRequest.request.then((response) => {
        expect(response).not.toBeDefined()
      }).catch((err) => {
        expect(err).toBeDefined()
        expect(err.message).toMatch(/IngestAPI Request options requires a url to make the request/)
      })
    })

    it('Should return an error message if a token is not set', function () {
      jest.spyOn(Config, 'getToken').mockImplementation(() => {
        return false
      })

      const options = {
        url: 'someUrl'
      }

      const myRequest = new Request(options)

      myRequest.request.then((response) => {
        expect(response).not.toBeDefined()
      }).catch((err) => {
        expect(err).toBeDefined()
        expect(err.message).toMatch(/IngestSDK requires a token to be set prior to use/)
      })
    })

    it('Should return an error message if a token is not valid', function () {
      jest.spyOn(Config, 'getToken').mockImplementation(() => {
        return true
      })

      jest.spyOn(Utils, 'isExpired').mockImplementation(() => {
        return true
      })

      const options = {
        url: 'someUrl'
      }

      const myRequest = new Request(options)

      myRequest.request.then((response) => {
        expect(response).not.toBeDefined()
      }).catch((err) => {
        expect(err).toBeDefined()
        expect(err.message).toMatch(/IngestAPI Request options requires a valid token/)
      })
    })

    it('Should return call makeRequest if all params are valid', function () {
      jest.spyOn(Config, 'getToken').mockImplementation(() => {
        return true
      })

      jest.spyOn(Utils, 'isExpired').mockImplementation(() => {
        return false
      })

      const options = {
        url: 'someUrl',
        headers: {},
        data: {
          value: 'somevalue'
        }
      }

      const myRequest = new Request(options)

      expect(myRequest.request).toBeDefined()
      expect(myRequest.cancel).toBeDefined()
    })
  })

  describe('Request::Class Tests', () => {
    beforeEach(() => {
      jest.spyOn(Config, 'getToken').mockImplementation(() => {
        return true
      })

      jest.spyOn(Utils, 'isExpired').mockImplementation(() => {
        return false
      })

      this.myRequest = new Request({
        url: 'someurl'
      })
    })

    describe('Request::handleError', () => {
      it('Should return a rejected Promise', () => {
        const errorMessage = 'someerror'
        const result = Request.prototype.handleError(errorMessage)

        expect(result.request).toBeDefined()
      })
    })

    describe('Request::preparePostData', () => {
      it('Should return an object with no data', () => {
        const result = Request.prototype.preparePostData()

        expect(result).toEqual({
          data: null,
          success: true,
          type: null
        })
      })

      it('Should return an object with stringified data', () => {
        const data = {
          someHeader: 'someValue'
        }
        const result = Request.prototype.preparePostData(data)

        expect(result).toEqual({
          data: JSON.stringify({
            someHeader: 'someValue'
          }),
          success: true,
          type: 'JSON'
        })
      })
    })

    describe('Request::requestComplete', () => {
      let reject, resolve

      beforeEach(() => {
        reject = jest.fn()
        resolve = jest.fn()

        jest.spyOn(Request.prototype, 'isValidResponseCode')
        jest.spyOn(Request.prototype, 'processResponse')
      })

      it('Should call reject if an error is present', () => {
        Request.prototype.requestComplete(reject, resolve, 'someerror')
        expect(reject).toHaveBeenCalledWith('someerror')
      })

      it('Should reject if an invalid response code is thrown', () => {
        const response = {
          statusMessage: 'StatusMessage',
          statusCode: 400,
          headers: {
            someheader: 'someheader'
          }
        }

        Request.prototype.requestComplete(reject, resolve, null, response, {})

        expect(reject).toHaveBeenCalledWith({
          statusMessage: 'StatusMessage',
          statusCode: 400,
          headers: {
            someheader: 'someheader'
          },
          message: 'Invalid Response Code'
        })
      })

      it('Should resovle if everything is ok', () => {
        const response = {
          statusMessage: 'StatusMessage',
          statusCode: 200,
          headers: {
            someheader: 'someheader'
          }
        }

        Request.prototype.requestComplete(reject, resolve, null, response, {})

        expect(resolve).toHaveBeenCalledWith({
          data: {},
          headers: {
            someheader: 'someheader'
          },
          statusCode: 200
        })
      })
    })

    describe('Request::processResponse', () => {
      it('Should process the response and return the final output with no data', () => {
        const response = {
          headers: {},
          statusCode: 200
        }

        const result = Request.prototype.processResponse(response, {})

        expect(result).toEqual({
          data: {},
          headers: response.headers,
          statusCode: response.statusCode
        })
      })

      it('Should process the response and return the final output with data', () => {
        const response = {
          headers: {
            'content-type': 'application/json'
          },
          statusCode: 200
        }

        const result = Request.prototype.processResponse(response, JSON.stringify({
          id: '1234'
        }))

        expect(result).toEqual({
          data: {
            id: '1234'
          },
          headers: response.headers,
          statusCode: response.statusCode
        })
      })
    })

    describe('prepareHeaders', () => {
      it('Should return all passed in headers lowercased.', () => {
        const key = {
          UPPERCASE: 'someValue'
        }
        const result = Request.prototype.prepareHeaders(key)

        expect(result).toEqual({
          uppercase: 'someValue'
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
})
